/**
 * MindGuard — Client-side Sharpness & Quality Scoring
 * 
 * Clean implementation (Phase 1) — no legacy code.
 * 
 * Algorithm:
 * - Convert frame to grayscale (luminance)
 * - Approximate Laplacian using 3x3 kernel (center-weighted differences)
 * - Compute variance of the Laplacian response (classic "focus" metric)
 * - Combine with simple contrast + exposure heuristics
 * 
 * Performance target: scoring a 640x360 frame in < 4ms on mid-range phone.
 * All work happens on main thread for now; easy to move to Worker later.
 */

import type { SharpnessResult } from './types';

const TARGET_WIDTH = 640; // good balance of quality vs speed for scoring

/**
 * Draw an HTMLVideoElement or Image to a canvas at controlled resolution.
 * Returns ImageData ready for analysis.
 */
export function drawFrameToCanvas(
  source: HTMLVideoElement | HTMLImageElement,
  maxWidth = TARGET_WIDTH
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; imageData: ImageData } {
  const videoWidth = 'videoWidth' in source ? source.videoWidth : source.width;
  const videoHeight = 'videoHeight' in source ? source.videoHeight : source.height;

  const scale = Math.min(1, maxWidth / videoWidth);
  const width = Math.round(videoWidth * scale);
  const height = Math.round(videoHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(source, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  return { canvas, ctx, imageData };
}

/**
 * Fast approximated Laplacian variance (the gold standard for auto-focus).
 * Uses a simple 3x3 high-pass kernel.
 */
function computeLaplacianVariance(gray: Uint8ClampedArray, width: number, height: number): number {
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  // 3x3 Laplacian-like kernel (center strong)
  //   1  1  1
  //   1 -8  1
  //   1  1  1
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;

      const center = gray[idx];
      const sumNeighbors =
        gray[idx - width - 1] + gray[idx - width] + gray[idx - width + 1] +
        gray[idx - 1] + gray[idx + 1] +
        gray[idx + width - 1] + gray[idx + width] + gray[idx + width + 1];

      const response = Math.abs(8 * center - sumNeighbors);

      sum += response;
      sumSq += response * response;
      count++;
    }
  }

  if (count === 0) return 0;

  const mean = sum / count;
  const variance = sumSq / count - mean * mean;

  // Normalize to roughly 0-100 range (empirically tuned on phone footage)
  return Math.min(100, Math.sqrt(Math.max(0, variance)) / 2.8);
}

/**
 * Simple RMS contrast + exposure (brightness distribution) heuristics.
 */
function computeContrastAndExposure(gray: Uint8ClampedArray): { contrast: number; exposure: number } {
  let min = 255;
  let max = 0;
  let sum = 0;

  for (let i = 0; i < gray.length; i++) {
    const v = gray[i];
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  }

  const range = max - min;
  const contrast = Math.min(100, (range / 255) * 100);

  const mean = sum / gray.length;
  // Punish very dark (<40) or very bright (>220) frames slightly
  let exposure = 100;
  if (mean < 40) exposure = 60 + (mean / 40) * 40;
  if (mean > 220) exposure = 100 - ((mean - 220) / 35) * 45;

  return { contrast: Math.max(0, contrast), exposure: Math.max(50, exposure) };
}

/**
 * Main exported function.
 * Pass a video element paused at the desired timestamp (or an Image).
 */
export function computeSharpness(
  source: HTMLVideoElement | HTMLImageElement
): SharpnessResult {
  const { imageData } = drawFrameToCanvas(source);

  // Convert to grayscale (Rec.709 luminance)
  const gray = new Uint8ClampedArray(imageData.width * imageData.height);
  for (let i = 0, j = 0; i < imageData.data.length; i += 4, j++) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    gray[j] = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
  }

  const lapVar = computeLaplacianVariance(gray, imageData.width, imageData.height);
  const { contrast, exposure } = computeContrastAndExposure(gray);

  // Composite ranking (tuned for "pleasant, usable selfie-style talking head")
  // Sharpness is king (70%), then contrast, then exposure
  const composite = Math.round(
    lapVar * 0.70 +
    contrast * 0.20 +
    exposure * 0.10
  );

  return {
    sharpness: Math.round(lapVar),
    contrast: Math.round(contrast),
    exposure: Math.round(exposure),
    composite: Math.max(0, Math.min(100, composite)),
  };
}

/**
 * Convenience: score multiple frames and return sorted best-first.
 */
export function rankFrames(
  frames: Array<{ timestamp: number; source: HTMLVideoElement | HTMLImageElement }>
): Array<{ timestamp: number; result: SharpnessResult }> {
  return frames
    .map(({ timestamp, source }) => ({
      timestamp,
      result: computeSharpness(source),
    }))
    .sort((a, b) => b.result.composite - a.result.composite);
}
