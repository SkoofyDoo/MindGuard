'use client';

import { motion } from 'framer-motion';
import { 
  Camera, 
  Scissors, 
  Shield, 
  Send, 
  Eye, 
  Mic, 
  MessageCircle, 
  Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/useTranslation';

export type PipelineStage = 
  | 'local-extract'
  | 'quality'
  | 'encrypt'
  | 'transmit'
  | 'vision'
  | 'audio'
  | 'text'
  | 'supervisor'
  | 'complete';

// Маппинг иконок и типа локации (не зависит от языка)
const STAGE_META: Record<PipelineStage, { icon: React.ElementType; location: 'device' | 'encrypted' | 'server' }> = {
  'local-extract': { icon: Scissors, location: 'device' },
  'quality':       { icon: Camera,  location: 'device' },
  'encrypt':       { icon: Shield,  location: 'encrypted' },
  'transmit':      { icon: Send,    location: 'encrypted' },
  'vision':        { icon: Eye,     location: 'server' },
  'audio':         { icon: Mic,     location: 'server' },
  'text':          { icon: MessageCircle, location: 'server' },
  'supervisor':    { icon: Sparkles, location: 'server' },
  'complete':      { icon: Sparkles, location: 'server' },
};

interface PipelineVisualizerProps {
  activeStage?: PipelineStage;
  completedStages?: PipelineStage[];
  className?: string;
  compact?: boolean;
  onStageClick?: (stage: PipelineStage) => void;
}

export function PipelineVisualizer({
  activeStage,
  completedStages = [],
  className,
  compact = false,
  onStageClick,
}: PipelineVisualizerProps) {
  const { t } = useTranslation();
  const isComplete = activeStage === 'complete';

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          {/* @ts-ignore - pipeline exists at runtime for current language */}
          <div className="text-sm font-medium tracking-[1px] text-[#85edb2] uppercase">{(t as any).pipeline?.label || 'Data Transparency'}</div>
          {/* @ts-ignore */}
          <div className="text-2xl font-semibold tracking-tight mt-1">{(t as any).pipeline?.title || 'What happens to your video'}</div>
        </div>
        <div className="hidden md:block text-right text-xs text-[#64748b]">
          {/* @ts-ignore */}
          {(t as any).pipeline?.note?.split(' • ')[0] || 'Encryption key stays with you'}<br />
          {(t as any).pipeline?.note?.split(' • ')[1] || 'Server never sees raw video'}
        </div>
      </div>

      <div className={cn(
        "grid gap-3",
        compact ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      )}>
        {(Object.keys(STAGE_META) as PipelineStage[])
          .filter(id => id !== 'complete')
          .map((stageId, index) => {
            const meta = STAGE_META[stageId];
            const isActive = activeStage === stageId;
            const isCompleted = completedStages.includes(stageId) || isComplete;
            const Icon = meta.icon;

            {/* @ts-ignore */}
            const stageTranslation = (t as any).pipeline?.stages?.[stageId] || { label: stageId, desc: '' };
            {/* @ts-ignore */}
            const locationLabel = (t as any).pipeline?.locations?.[meta.location] || meta.location;

            return (
              <motion.div
                key={stageId}
                whileHover={onStageClick ? { y: -2 } : undefined}
                onClick={() => onStageClick?.(stageId)}
                className={cn(
                  "group relative flex gap-4 rounded-2xl border p-5 transition-all duration-300 cursor-default",
                  "bg-[#121317] border-[#272b33]",
                  isActive && "border-[#00ff9d] bg-[#00ff9d]/5 shadow-[0_0_0_1px_#00ff9d]",
                  isCompleted && !isActive && "border-[#85edb2]/60",
                  onStageClick && "cursor-pointer hover:border-[#3a3f4a]"
                )}
              >
                {/* Number / Status */}
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-medium border transition-colors",
                  isActive ? "bg-[#00ff9d] text-[#0a0b0f] border-[#00ff9d]" : 
                  isCompleted ? "bg-[#85edb2]/10 text-[#85edb2] border-[#85edb2]/40" : 
                  "bg-[#1a1c22] text-[#64748b] border-[#272b33]"
                )}>
                  {isCompleted ? '✓' : index + 1}
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center gap-2">
                    <Icon className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-[#00ff9d]" : isCompleted ? "text-[#85edb2]" : "text-[#64748b]"
                    )} />
                    <div className="font-medium tracking-tight text-[15px]">{stageTranslation.label}</div>
                  </div>

                  <div className="mt-1 text-sm text-[#94a3b8] leading-snug">
                    {stageTranslation.desc}
                  </div>

                  <div className={cn(
                    "mt-3 inline-flex items-center rounded-full px-2.5 py-px text-[10px] tracking-widest font-medium",
                    meta.location === 'device' && "bg-emerald-950 text-emerald-400",
                    meta.location === 'encrypted' && "bg-amber-950 text-amber-400",
                    meta.location === 'server' && "bg-sky-950 text-sky-400"
                  )}>
                    {locationLabel}
                  </div>
                </div>

                {/* Subtle active indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="active-pipeline-glow"
                    className="absolute inset-0 rounded-2xl bg-[#00ff9d]/5 pointer-events-none" 
                  />
                )}
              </motion.div>
            );
          })}
      </div>

      <div className="mt-6 text-center text-xs text-[#64748b]">
        {/* @ts-ignore */}
        {(t as any).pipeline?.note || 'Encryption key is derived from your passphrase • The server never sees raw video'}
      </div>
    </div>
  );
}
