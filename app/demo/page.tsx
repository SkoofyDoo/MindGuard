'use client';

import { useState, useEffect } from 'react';
import { PipelineVisualizer, type PipelineStage } from '@/components/demo/PipelineVisualizer';
import { useVideoRecorder, extractAndScoreFrames, type VideoFrame, type CheckInResult } from '@/lib/video';
import { generateMockResult } from '@/lib/mockAnalysis';
import { useTranslation } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ArrowLeft, Play, Square, Check, RefreshCw, Upload } from 'lucide-react';
import Link from 'next/link';

type DemoStep = 'intro' | 'recording' | 'extracting' | 'selecting' | 'processing' | 'result';

export default function MindGuardDemo() {
  const { t, lang } = useTranslation();

  const [step, setStep] = useState<DemoStep>('intro');
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [frames, setFrames] = useState<VideoFrame[]>([]);
  const [selectedFrames, setSelectedFrames] = useState<VideoFrame[]>([]);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [waveform, setWaveform] = useState<number[]>(Array(10).fill(12));
  const [processingStage, setProcessingStage] = useState<PipelineStage>('local-extract');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Progress for frame extraction (upload + after recording)
  const [extractionProgress, setExtractionProgress] = useState<{
    percent: number;
    message: string;
    current: number;
    total: number;
  } | null>(null);

  // Drag & Drop UI state
  const [isDragging, setIsDragging] = useState(false);

  // Store the duration of the last check-in so we can re-generate advice when language changes
  const [lastCheckInDuration, setLastCheckInDuration] = useState<number | null>(null);

  // Re-generate advice when language changes while on the result screen
  useEffect(() => {
    if (step === 'result' && lastCheckInDuration !== null) {
      const newResult = generateMockResult(lastCheckInDuration, lang);
      setResult(newResult);
    }
  }, [lang, step, lastCheckInDuration]);

  const recorder = useVideoRecorder({
    minDuration: 25,
    maxDuration: 60,
    errorMessages: {
      permission: t.demo.errors.permission,
      notFound: t.demo.errors.notFound,
      generic: t.demo.errors.generic,
      tooShort: t.demo.errors.tooShort,
    },
    onComplete: async (blob, duration) => {
      // Use the new progress-aware processor
      await processVideoLocally(blob);
    }
  });

  const handleStartRecording = async () => {
    const success = await recorder.startRecording((levels) => setWaveform(levels));
    if (success) setStep('recording');
  };

  /**
   * Central function: takes a video blob (from recording or upload),
   * shows nice progress while extracting + scoring frames locally,
   * then moves to the frame selection gallery.
   */
  const processVideoLocally = async (blob: Blob) => {
    setRecordedBlob(blob);
    setExtractionProgress({ percent: 0, message: 'Preparing video...', current: 0, total: 1 });
    setStep('extracting');

    try {
      const extracted = await extractAndScoreFrames(blob, {
        targetCount: 22,
        sampleEverySeconds: 0.85,
        onProgress: (p) => {
          setExtractionProgress({
            percent: p.percent,
            message: p.message || 'Processing frames...',
            current: p.current,
            total: p.total,
          });
        },
      });

      setFrames(extracted);
      setSelectedFrames(extracted.filter(f => f.selected));
      setExtractionProgress(null);
      setStep('selecting');
    } catch (e: any) {
      console.error(e);
      setExtractionProgress(null);
      alert(e?.message || t.demo.errors.loadVideo);
      setStep('intro');
    }
  };

  const handleStopRecording = () => {
    recorder.stopRecording();
  };

  const toggleFrame = (frameId: string) => {
    setSelectedFrames(prev => {
      const exists = prev.some(f => f.id === frameId);
      if (exists) {
        if (prev.length <= 4) return prev; // minimum 4
        return prev.filter(f => f.id !== frameId);
      } else {
        const frame = frames.find(f => f.id === frameId)!;
        return [...prev, frame].sort((a, b) => b.quality - a.quality);
      }
    });
  };

  const runAnalysis = async () => {
    if (!recordedBlob || selectedFrames.length < 4) return;

    setIsProcessing(true);
    setStep('processing');

    const stages: PipelineStage[] = ['local-extract', 'quality', 'encrypt', 'transmit', 'vision', 'audio', 'text', 'supervisor'];

    // Beautiful staged animation (real work happens in background)
    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(stages[i]);
      await new Promise(r => setTimeout(r, 380 + Math.random() * 220));
    }

    // Generate the actual beautiful result (mocked but high quality)
    const duration = recorder.duration || 42;
    const mockResult = generateMockResult(duration, lang);
    setResult(mockResult);
    setLastCheckInDuration(duration);
    
    setTimeout(() => {
      setProcessingStage('complete');
      setIsProcessing(false);
      setStep('result');
    }, 420);
  };

  /** Upload video from device (click or drag & drop) */
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    setIsUploading(true);
    // For uploaded files we use a fixed approximate duration for mock generation
    setLastCheckInDuration(45);
    await processVideoLocally(file);
    setIsUploading(false);
  };

  // For the classic <input type="file">
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // allow re-selecting the same file
    e.target.value = '';
  };

  // ============ Drag & Drop Handlers ============
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const resetDemo = () => {
    setStep('intro');
    setRecordedBlob(null);
    setFrames([]);
    setSelectedFrames([]);
    setResult(null);
    setProcessingStage('local-extract');
    setWaveform(Array(10).fill(12));
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-[#f1f5f9]">
      {/* Calm top nav */}
      <div className="border-b border-[#272b33] bg-[#0a0b0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm hover:text-[#85edb2] transition-colors">
            <ArrowLeft className="h-4 w-4" /> MindGuard
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-xs tracking-[2px] text-[#64748b] hidden sm:block">{t.demo.nav}</div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* INTRO - with beautiful Drag & Drop */}
        {step === 'intro' && (
          <div className="max-w-3xl mx-auto text-center pt-12">
            <div className="text-[#85edb2] text-sm tracking-[3px] mb-3">30–60 SECONDS • LOCAL ONLY • NO PRESSURE</div>
            <h1 className="text-6xl font-semibold tracking-[-1.5px] leading-none mb-6">{t.demo.intro.title}</h1>
            <p className="text-xl text-[#94a3b8] mb-10">{t.demo.intro.subtitle}</p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch">
              {/* Record live */}
              <button
                onClick={handleStartRecording}
                disabled={recorder.isRecording}
                className="record-button group flex-1 inline-flex h-20 items-center justify-center gap-3 rounded-3xl bg-[#00ff9d] px-10 text-2xl font-medium text-[#0a0b0f] transition-all active:scale-[0.985] disabled:opacity-70"
              >
                <Play className="h-7 w-7" />
                {t.demo.intro.record}
              </button>

              {/* Drag & Drop Zone */}
              <label
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                  flex-1 group relative flex h-20 cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed px-8 text-center transition-all
                  ${isDragging 
                    ? 'border-[#00ff9d] bg-[#00ff9d]/10 scale-[1.01]' 
                    : 'border-[#272b33] hover:border-[#3a3f4a] hover:bg-[#121317]'
                  }
                `}
              >
                <div className="flex items-center gap-3 text-xl font-medium text-[#f1f5f9]">
                  <Upload className="h-6 w-6" />
                  {t.demo.intro.upload}
                </div>
                <div className="text-xs text-[#64748b]">{t.demo.intro.uploadHint}</div>

                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                  disabled={isUploading}
                />
              </label>
            </div>

            <div className="mt-8 text-xs text-[#64748b]">{t.demo.intro.note}</div>

            {recorder.error && <div className="mt-4 text-red-400 text-sm">{recorder.error}</div>}
          </div>
        )}

        {/* EXTRACTION PROGRESS BAR */}
        {step === 'extracting' && extractionProgress && (
          <div className="max-w-xl mx-auto pt-20 text-center">
            <div className="mb-8">
              <div className="text-[#85edb2] text-sm tracking-[3px] mb-2">LOCAL PROCESSING</div>
              <h2 className="text-4xl font-semibold tracking-tight">Analyzing your video on device</h2>
              <p className="mt-3 text-[#94a3b8]">Extracting &amp; scoring frames locally. Nothing leaves your browser.</p>
            </div>

            {/* Premium calm progress bar */}
            <div className="mx-auto w-full max-w-md">
              <div className="mb-3 flex justify-between text-sm">
                <span className="text-[#85edb2]">{extractionProgress.message}</span>
                <span className="font-mono text-[#64748b] tabular-nums">{extractionProgress.percent}%</span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1a1c22]">
                <div 
                  className="h-full bg-gradient-to-r from-[#00ff9d] to-[#85edb2] transition-all duration-300 ease-out"
                  style={{ width: `${extractionProgress.percent}%` }}
                />
              </div>

              <div className="mt-2 text-right text-xs text-[#64748b] tabular-nums">
                {extractionProgress.current} / {extractionProgress.total} frames
              </div>
            </div>

            <div className="mt-12 text-xs text-[#64748b]">
              This can take a few seconds for longer videos. All computation happens on your device.
            </div>
          </div>
        )}

        {/* RECORDING SCREEN */}
        {step === 'recording' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-[#85edb2] tracking-[2px] text-sm mb-2">{t.demo.recording.hint}</div>
              <div className="text-4xl font-semibold tracking-tight">{t.demo.recording.title}</div>
            </div>

            {/* Big beautiful preview + waveform */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-[#272b33] mb-6">
              {recorder.stream && (
                <video
                  autoPlay
                  muted
                  playsInline
                  ref={(el) => { if (el && recorder.stream) el.srcObject = recorder.stream; }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
            </div>

            {/* Waveform */}
            <div className="flex items-end justify-center gap-1.5 h-16 mb-8">
              {waveform.map((h, i) => (
                <div key={i} className="w-2.5 bg-[#00ff9d] rounded-full transition-all" style={{ height: `${Math.max(8, h)}%` }} />
              ))}
            </div>

            <div className="flex items-center justify-between text-sm mb-4 px-1">
              <div className="font-mono text-[#85edb2] text-3xl tabular-nums tracking-tighter">{recorder.duration.toFixed(0)}<span className="text-base align-super">s</span></div>
              <div className="text-[#64748b]">{t.demo.recording.min}</div>
            </div>

            <div className="flex gap-4">
              <button onClick={handleStopRecording} disabled={!recorder.canStop} className="flex-1 h-16 rounded-2xl bg-white/5 hover:bg-white/10 border border-[#272b33] flex items-center justify-center gap-3 text-lg disabled:opacity-50">
                <Square className="h-5 w-5" /> {t.demo.recording.stop}
              </button>
              <button onClick={recorder.cancelRecording} className="flex-1 h-16 rounded-2xl border border-[#272b33] hover:bg-[#121317]">{t.common.cancel}</button>
            </div>
          </div>
        )}

        {/* FRAME SELECTION */}
        {step === 'selecting' && frames.length > 0 && (
          <div>
            <div className="mb-8">
              <div className="uppercase tracking-[2px] text-xs text-[#85edb2]">STEP 2 OF 3 — LOCAL ONLY</div>
              <h2 className="text-4xl font-semibold tracking-[-1px] mt-2">{t.demo.selecting.title}</h2>
              <p className="mt-3 text-[#94a3b8]">{t.demo.selecting.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-10">
              {frames.map((frame) => {
                const isSelected = selectedFrames.some(f => f.id === frame.id);
                return (
                  <button
                    key={frame.id}
                    onClick={() => toggleFrame(frame.id)}
                    className={`frame-card group relative rounded-2xl overflow-hidden border ${isSelected ? 'selected border-[#00ff9d]' : 'border-[#272b33] hover:border-[#3a3f4a]'}`}
                  >
                    <img src={frame.dataUrl} alt={`Frame at ${frame.timestamp.toFixed(1)}s`} className="w-full aspect-[16/10] object-cover" />
                    <div className="quality-badge absolute bottom-3 right-3 text-[10px] px-2 py-px rounded text-[#85edb2]">
                      {Math.round(frame.quality)}%
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-[#00ff9d] text-[#0a0b0f] flex items-center justify-center">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-[#272b33] pt-8">
              <div className="text-sm text-[#64748b]">{t.demo.selecting.selected(selectedFrames.length, frames.length)}</div>
              <button
                onClick={runAnalysis}
                disabled={selectedFrames.length < 4}
                className="btn-lime h-14 px-10 rounded-2xl text-lg font-medium disabled:opacity-40"
              >
                {t.demo.selecting.analyze}
              </button>
            </div>
          </div>
        )}

        {/* PROCESSING WITH LIVE PIPELINE VISUALIZER + PROGRESS */}
        {step === 'processing' && (
          <div className="max-w-4xl mx-auto py-12">
            <div className="text-center mb-8">
              <div className="inline text-[#85edb2] text-sm tracking-[3px]">{t.demo.processing.subtitle}</div>
              <div className="text-4xl font-semibold tracking-tight mt-3">{t.demo.processing.title}</div>
            </div>

            {/* Overall progress bar for the analysis phase */}
            <div className="mx-auto mb-8 max-w-md">
              <div className="mb-2 flex justify-between text-xs text-[#64748b]">
                <span>Deep multimodal analysis</span>
                <span>
                  {Math.round((['local-extract','quality','encrypt','transmit','vision','audio','text','supervisor'].indexOf(processingStage) + 1) / 8 * 100)}%
                </span>
              </div>
              <div className="h-px w-full bg-[#1a1c22]">
                <div 
                  className="h-px bg-[#00ff9d] transition-all duration-500"
                  style={{ 
                    width: `${Math.round((['local-extract','quality','encrypt','transmit','vision','audio','text','supervisor'].indexOf(processingStage) + 1) / 8 * 100)}%` 
                  }}
                />
              </div>
            </div>

            <PipelineVisualizer 
              activeStage={processingStage} 
              completedStages={(['local-extract', 'quality', 'encrypt', 'transmit', 'vision', 'audio', 'text'] as const).slice(0, Math.max(0, ['local-extract','quality','encrypt','transmit','vision','audio','text','supervisor'].indexOf(processingStage))) as any}
              className="mb-12"
            />

            <div className="text-center text-sm text-[#64748b]">{t.demo.processing.note}</div>
          </div>
        )}

        {/* BEAUTIFUL RESULT */}
        {step === 'result' && result && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-10">
              <div>
                <div className="text-[#85edb2] tracking-[2px] text-sm">{t.demo.result.badge}</div>
                <div className="text-5xl font-semibold tracking-[-1.2px] mt-2">{result.overall}</div>
              </div>
              <button onClick={resetDemo} className="flex items-center gap-2 text-sm border border-[#272b33] hover:bg-[#121317] px-5 h-11 rounded-2xl">
                <RefreshCw className="h-4 w-4" /> {t.demo.result.newCheckin}
              </button>
            </div>

            <div className="prose prose-invert max-w-none mb-12 text-[#c5d0e0]">
              <p className="text-2xl leading-tight text-[#f1f5f9]">{result.headline}</p>
              <p className="text-lg mt-4 text-[#94a3b8]">{result.summary}</p>
            </div>

            {/* Visual Metrics — much better than raw numbers */}
            <div className="mb-12">
              <div className="uppercase tracking-[1.5px] text-xs mb-4 text-[#85edb2]">{t.demo.result.metricsTitle}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result.scores).map(([key, value]) => {
                  const pct = Math.min(100, Math.max(0, value));
                  const color = pct >= 65 ? '#00ff9d' : pct >= 40 ? '#facc15' : '#f87171';

                  return (
                    <div key={key} className="card p-5">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium capitalize tracking-wide text-[#f1f5f9]">
                          {t.demo.result.metricsLabels?.[key as keyof typeof t.demo.result.metricsLabels] || key}
                        </div>
                        <div className="text-xl font-semibold tabular-nums" style={{ color }}>{pct}</div>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="h-2.5 w-full rounded-full bg-[#1a1c22] overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-700"
                          style={{ 
                            width: `${pct}%`, 
                            backgroundColor: color 
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Advice */}
            <div className="mb-14">
              <div className="uppercase tracking-[1.5px] text-xs mb-4 text-[#85edb2]">{t.demo.result.adviceTitle}</div>
              <div className="space-y-4">
                {result.advice.map((a, i) => (
                  <div key={i} className="card p-7">
                    <div className="font-medium text-xl mb-2">{a.title}</div>
                    <div className="text-[#c5d0e0] mb-3">{a.body}</div>
                    <div className="text-sm text-[#85edb2] border-l-2 border-[#85edb2]/40 pl-3">{t.demo.result.whyThisHelps || 'Why this helps'}: {a.why}</div>
                  </div>
                ))}
              </div>
            </div>

            <PipelineVisualizer compact className="opacity-60" />
          </div>
        )}
      </div>
    </div>
  );
}
