/**
 * MindGuard — useVideoRecorder hook
 * 
 * Premium, calm, reliable video recording for emotional check-ins.
 * - Real-time waveform (Web Audio)
 * - Strict 30-60s enforcement with beautiful UX
 * - Graceful permission + error handling
 * - Works great on iOS Safari and modern Android
 */

import { useCallback, useRef, useState } from 'react';

export interface RecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number; // seconds
  error: string | null;
  hasPermission: boolean;
  stream: MediaStream | null;
}

export interface UseVideoRecorderOptions {
  minDuration?: number; // default 25
  maxDuration?: number; // default 60
  onComplete?: (blob: Blob, duration: number) => void;
  errorMessages?: {
    permission?: string;
    notFound?: string;
    generic?: string;
    tooShort?: (sec: number) => string;
  };
}

export function useVideoRecorder(options: UseVideoRecorderOptions = {}) {
  const {
    minDuration = 25,
    maxDuration = 60,
    onComplete,
  } = options;

  const [state, setState] = useState<RecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    error: null,
    hasPermission: false,
    stream: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const updateDuration = useCallback(() => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const clamped = Math.min(maxDuration, Math.max(0, elapsed));

    setState((s) => ({ ...s, duration: clamped }));

    if (clamped >= maxDuration) {
      stopRecording();
    }
  }, [maxDuration]);

  /**
   * Request camera + mic with calm, mobile-friendly constraints.
   */
  const requestPermission = useCallback(async () => {
    setState((s) => ({ ...s, error: null }));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      setState((s) => ({ ...s, hasPermission: true, stream }));

      // Prepare audio analyser for waveform (non-blocking)
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.85;
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
      } catch {
        // Waveform is nice-to-have; recording still works without it
      }

      return stream;
    } catch (err: any) {
      const msgs = options.errorMessages || {};
      let message = msgs.generic || 'Не удалось получить доступ к камере и микрофону.';
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        message = msgs.permission || 'Разрешение отклонено. Пожалуйста, разрешите доступ к камере в настройках браузера.';
      } else if (err?.name === 'NotFoundError') {
        message = msgs.notFound || 'Камера или микрофон не найдены. Подключите устройство и попробуйте снова.';
      }
      setState((s) => ({ ...s, error: message }));
      return null;
    }
  }, []);

  /**
   * Start recording with live duration + optional waveform callback.
   */
  const startRecording = useCallback(async (onWaveform?: (levels: number[]) => void) => {
    let stream = streamRef.current;

    if (!stream) {
      stream = await requestPermission();
      if (!stream) return false;
    }

    try {
      chunksRef.current = [];
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || 'video/webm' });
        const finalDuration = Math.min(maxDuration, (Date.now() - startTimeRef.current) / 1000);

        cleanup();
        setState({
          isRecording: false,
          isPaused: false,
          duration: 0,
          error: null,
          hasPermission: false,
          stream: null,
        });

        if (finalDuration >= minDuration) {
          onComplete?.(blob, finalDuration);
        } else {
          const msg = options.errorMessages?.tooShort?.(minDuration) || `Минимум ${minDuration} секунд. Попробуйте ещё раз.`;
          setState((s) => ({ ...s, error: msg }));
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100); // collect data frequently

      startTimeRef.current = Date.now();
      setState((s) => ({ ...s, isRecording: true, duration: 0 }));

      // Live timer
      timerRef.current = window.setInterval(updateDuration, 120);

      // Live waveform (very cheap)
      if (analyserRef.current && onWaveform) {
        const analyser = analyserRef.current;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          analyser.getByteFrequencyData(dataArray);
          // Downsample to 8-12 nice bars
          const levels = Array.from({ length: 10 }, (_, i) => {
            const v = dataArray[Math.floor((i / 10) * dataArray.length)];
            return Math.max(4, (v / 255) * 100);
          });
          onWaveform(levels);
          animationRef.current = requestAnimationFrame(tick);
        };
        animationRef.current = requestAnimationFrame(tick);
      }

      return true;
    } catch (err: any) {
      setState((s) => ({ ...s, error: 'Ошибка записи. Попробуйте перезагрузить страницу.' }));
      return false;
    }
  }, [requestPermission, minDuration, maxDuration, onComplete, updateDuration, cleanup]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    } else {
      cleanup();
    }
  }, [cleanup]);

  const cancelRecording = useCallback(() => {
    cleanup();
    setState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      error: null,
      hasPermission: false,
      stream: null,
    });
  }, [cleanup]);

  return {
    ...state,
    startRecording,
    stopRecording,
    cancelRecording,
    requestPermission,
    canStop: state.duration >= minDuration,
  };
}

/** Best-effort MIME type for broadest compatibility (especially mobile). */
function getSupportedMimeType(): string | null {
  const candidates = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4;codecs=h264',
    'video/mp4',
  ];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return null;
}
