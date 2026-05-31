/**
 * MindGuard — Client-side Video Processing Types
 * Phase 1: Fully local, zero server video storage.
 * These types will evolve in Phase 2 when we add E2EE + real backend.
 */

export interface VideoFrame {
  id: string;
  timestamp: number; // seconds from start
  dataUrl: string; // base64 data URL for preview (small)
  blob?: Blob; // full frame if needed (avoid keeping all in memory)
  sharpness: number; // 0-100, higher = better focus/detail
  quality: number; // composite score
  selected?: boolean;
}

export interface ExtractedVideo {
  blob: Blob;
  duration: number;
  mimeType: string;
}

export interface ExtractionProgress {
  current: number;
  total: number;
  percent: number; // 0-100
  message?: string;
}

export interface FrameExtractionOptions {
  targetCount?: number;
  sampleEverySeconds?: number;
  maxWidth?: number;
  onProgress?: (progress: ExtractionProgress) => void;
}

export interface SharpnessResult {
  sharpness: number; // primary Laplacian variance score (normalized 0-100)
  contrast: number;
  exposure: number;
  composite: number; // final ranking score
}

export interface ProcessingProgress {
  stage: 'extracting' | 'scoring' | 'selecting' | 'done';
  progress: number; // 0-1
  message: string;
  framesProcessed?: number;
}

/**
 * The final "check-in" object stored locally (demo mode).
 * In real product this will be heavily encrypted client-side.
 */
export interface CheckIn {
  id: string;
  createdAt: string; // ISO
  duration: number;
  selectedFrameCount: number;
  result: CheckInResult;
}

/**
 * Rich result schema (used by both mock and future real analysis)
 */
export interface EmotionScores {
  calm: number; // 0-100
  joy: number;
  anxiety: number;
  fatigue: number;
  frustration: number;
  hope: number;
  connection?: number;
}

export interface CheckInResult {
  id: string;
  date: string;
  overall: string; // "Спокойный день с тёплыми акцентами"
  headline: string;
  summary: string; // 2-4 empathetic sentences
  scores: EmotionScores;
  valenceTimeline: Array<{
    t: number; // 0..1 normalized time in check-in
    v: number; // valence -1..+1
    a: number; // arousal 0..1
  }>;
  advice: Array<{
    id: string;
    title: string;
    body: string;
    why: string;
    category: 'breath' | 'movement' | 'connection' | 'environment' | 'mindset';
  }>;
  bestPractices: string[];
  primaryEmotion: keyof EmotionScores;
}
