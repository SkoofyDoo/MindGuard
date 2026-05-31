/**
 * MindGuard — Robust Client-side Frame Extraction
 *
 * Strategy (Phase 1, maximum compatibility):
 * 1. Record with MediaRecorder → Blob
 * 2. Load Blob into a <video> element
 * 3. Seek to evenly spaced timestamps and draw to canvas
 * 4. Score each candidate with computeSharpness
 *
 * This approach works reliably on:
 * - Modern Chrome/Edge (desktop + Android)
 * - iOS Safari 15+
 * - Firefox
 *
 * WebCodecs path (faster, lower memory) can be added later as progressive enhancement.
 */

import type { VideoFrame, FrameExtractionOptions, ExtractedVideo, ExtractionProgress } from './types';
import { computeSharpness } from './computeSharpness';

/**
 * Load a video Blob into a video element.
 * Returns the video element + a function to revoke the blob URL when you're done.
 */
export function loadVideo(blob: Blob): Promise<{ video: HTMLVideoElement; revoke: () => void }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const video = document.createElement('video');

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const revoke = () => URL.revokeObjectURL(url);

    video.onloadedmetadata = () => {
      video.currentTime = 0.01;
    };

    video.onseeked = () => {
      resolve({ video, revoke });
    };

    video.onerror = (e) => {
      revoke();
      reject(new Error('Failed to load recorded video: ' + (e as any)?.message));
    };

    video.src = url;
  });
}

/**
 * Extract N evenly spaced candidate frames + score them.
 * Returns best-first sorted array ready for the gallery.
 * 
 * Supports onProgress callback for beautiful progress bars.
 */
export async function extractAndScoreFrames(
  videoBlob: Blob,
  options: FrameExtractionOptions = {}
): Promise<VideoFrame[]> {
  const {
    targetCount = 24,
    sampleEverySeconds = 0.9,
    maxWidth = 720,
    onProgress,
  } = options;

  const { video, revoke } = await loadVideo(videoBlob);

  try {
    const duration = video.duration;

    if (!duration || !isFinite(duration) || duration < 5) {
      throw new Error('Video is too short for analysis (minimum ~8 seconds).');
    }

    const candidates: Array<{ timestamp: number; dataUrl: string; sharpnessData: ReturnType<typeof computeSharpness> }> = [];

    const totalCandidates = Math.min(targetCount, Math.floor(duration / sampleEverySeconds));

    for (let i = 0; i < totalCandidates; i++) {
      const t = Math.min(duration - 0.2, (i + 0.5) * sampleEverySeconds);

      const percent = Math.round(((i + 0.5) / totalCandidates) * 100);
      onProgress?.({
        current: i + 1,
        total: totalCandidates,
        percent,
        message: `Analyzing frame ${i + 1} of ${totalCandidates}`,
      });

      await new Promise<void>((resolve) => {
        const onSeek = () => {
          video.removeEventListener('seeked', onSeek);
          resolve();
        };
        video.addEventListener('seeked', onSeek, { once: true });
        video.currentTime = t;
      });

      const { canvas } = drawVideoFrame(video, maxWidth);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      const sharpnessData = computeSharpness(video);

      candidates.push({
        timestamp: t,
        dataUrl,
        sharpnessData,
      });
    }

    onProgress?.({
      current: totalCandidates,
      total: totalCandidates,
      percent: 100,
      message: 'Selecting best frames...',
    });

    const ranked = candidates
      .sort((a, b) => b.sharpnessData.composite - a.sharpnessData.composite)
      .map((c, index) => ({
        id: `f-${index}-${Math.round(c.timestamp * 100)}`,
        timestamp: c.timestamp,
        dataUrl: c.dataUrl,
        sharpness: c.sharpnessData.sharpness,
        quality: c.sharpnessData.composite,
        selected: true,
      }));

    return ranked.slice(0, 12);
  } finally {
    // Важно: отзываем blob URL только после всей работы
    revoke();
  }
}

function drawVideoFrame(video: HTMLVideoElement, maxWidth: number) {
  const scale = Math.min(1, maxWidth / video.videoWidth);
  const w = Math.round(video.videoWidth * scale);
  const h = Math.round(video.videoHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(video, 0, 0, w, h);

  return { canvas, ctx };
}

/**
 * Helper used by the recorder: stop MediaRecorder and return clean Blob + duration.
 */
export function stopMediaRecorder(recorder: MediaRecorder): Promise<ExtractedVideo> {
  return new Promise((resolve) => {
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const mimeType = chunks[0]?.type || 'video/webm';
      const blob = new Blob(chunks, { type: mimeType });
      // Duration is best obtained from the video element after load
      resolve({ blob, duration: 0, mimeType });
    };

    recorder.stop();
  });
}
