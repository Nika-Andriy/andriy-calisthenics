'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flame, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { playShortBeep, triggerHaptic } from '@/lib/audioHaptics';

interface FloatingStopwatchProps {
  onApplySeconds?: (seconds: number) => void;
  activeExerciseName?: string;
  targetSeconds?: number;
}

export const FloatingStopwatch: React.FC<FloatingStopwatchProps> = ({
  onApplySeconds,
  activeExerciseName,
  targetSeconds,
}) => {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const startRef = useRef<number>(0);
  const reqRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      startRef.current = performance.now() - elapsedMs;
      const update = () => {
        const now = performance.now();
        const current = now - startRef.current;
        setElapsedMs(current);

        // Milestone beep if reaching targetSeconds
        if (targetSeconds && Math.floor(current / 1000) === targetSeconds && Math.floor((current - 16) / 1000) < targetSeconds) {
          playShortBeep(1046, 0.2); // C6 tone
          triggerHaptic('success');
        }

        reqRef.current = requestAnimationFrame(update);
      };
      reqRef.current = requestAnimationFrame(update);
    } else if (reqRef.current) {
      cancelAnimationFrame(reqRef.current);
    }

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isRunning, targetSeconds]);

  const toggleRun = () => {
    triggerHaptic('medium');
    setIsRunning(!isRunning);
  };

  const reset = () => {
    triggerHaptic('light');
    setIsRunning(false);
    setElapsedMs(0);
  };

  const handleApply = () => {
    if (onApplySeconds && elapsedMs > 0) {
      triggerHaptic('success');
      onApplySeconds(Math.round(elapsedMs / 1000));
    }
  };

  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((elapsedMs % 1000) / 100);

  const isTargetReached = targetSeconds ? totalSeconds >= targetSeconds : false;

  return (
    <div className="sticky top-2 z-30 mb-4 px-1">
      <div className={`ios-glass-card rounded-2xl p-3 border transition-all duration-200 shadow-xl ${
        isTargetReached
          ? 'border-emerald-500/80 bg-zinc-950/95 shadow-emerald-950/30'
          : 'border-zinc-800 bg-zinc-900/90'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-lg ${isRunning ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' : 'bg-zinc-800 text-zinc-400'}`}>
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Секундомір статики
              </span>
              {activeExerciseName && (
                <p className="text-[11px] text-emerald-400 font-medium truncate max-w-[200px]">
                  {activeExerciseName} {targetSeconds ? `(Ціль: ${targetSeconds}с)` : ''}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-zinc-400 hover:text-zinc-200"
          >
            {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {!isMinimized && (
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-800/60">
            {/* Digital Display */}
            <div className="flex items-baseline font-mono tracking-tight">
              <span className={`text-2xl font-bold ${isTargetReached ? 'text-emerald-400' : 'text-zinc-100'}`}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-sm font-semibold text-zinc-400 ml-0.5">
                .{tenths}
              </span>
              {targetSeconds && (
                <span className="text-xs text-zinc-500 ml-2 font-sans font-normal">
                  / {targetSeconds}с
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleRun}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 active:scale-95 transition-all text-xs ${
                  isRunning
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Пауза</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Старт</span>
                  </>
                )}
              </button>

              <button
                onClick={reset}
                className="p-1.5 rounded-xl bg-zinc-800/70 text-zinc-400 hover:text-zinc-200 active:scale-95"
                title="Скинути"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {onApplySeconds && totalSeconds > 0 && (
                <button
                  onClick={handleApply}
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-800 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-950/40 active:scale-95 text-xs font-medium flex items-center gap-1"
                  title="Зафіксувати результат у сет"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{totalSeconds}с</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
