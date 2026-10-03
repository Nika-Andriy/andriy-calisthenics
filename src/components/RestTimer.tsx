'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, X, BellRing, Plus, Minus } from 'lucide-react';
import { playRestDoneChime, triggerHaptic } from '@/lib/audioHaptics';

interface RestTimerProps {
  initialSeconds?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  initialSeconds = 90,
  isOpen,
  onClose,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && !isRunning && timeLeft === totalSeconds) {
      setIsRunning(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      setIsFinished(true);
      playRestDoneChime();
      triggerHaptic('success');
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const setPreset = (sec: number) => {
    triggerHaptic('light');
    setTotalSeconds(sec);
    setTimeLeft(sec);
    setIsRunning(true);
    setIsFinished(false);
  };

  const addSeconds = (amount: number) => {
    triggerHaptic('light');
    setTimeLeft((prev) => Math.max(5, prev + amount));
    setTotalSeconds((prev) => Math.max(5, prev + amount));
  };

  const toggleRun = () => {
    triggerHaptic('medium');
    setIsRunning(!isRunning);
    if (isFinished) {
      setIsFinished(false);
      setTimeLeft(totalSeconds);
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    triggerHaptic('light');
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(totalSeconds);
  };

  if (!isOpen) return null;

  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-x-0 bottom-20 z-40 px-4 max-w-md mx-auto">
      <div className={`ios-glass rounded-3xl p-4 shadow-2xl border ${
        isFinished 
          ? 'border-emerald-500 bg-emerald-950/70 shadow-emerald-900/50 animate-pulse' 
          : 'border-zinc-800 bg-zinc-900/90'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Timer className={`w-5 h-5 ${isFinished ? 'text-emerald-400 animate-bounce' : 'text-emerald-500'}`} />
            <span className="text-sm font-semibold tracking-wide text-zinc-200">
              {isFinished ? 'Час відпочинку вийшов! До роботи ⚡' : 'Відпочинок між сетами'}
            </span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Digital Countdown & Controls */}
        <div className="flex items-center justify-between bg-zinc-950/80 rounded-2xl p-3 border border-zinc-800/80 mb-3">
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-mono font-bold tracking-tight ${
              isFinished ? 'text-emerald-400' : 'text-zinc-100'
            }`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs text-zinc-400 font-medium">сек</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addSeconds(-15)}
              className="p-1.5 rounded-xl bg-zinc-800/70 text-zinc-300 hover:bg-zinc-700 active:scale-95"
              title="-15s"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => addSeconds(15)}
              className="p-1.5 rounded-xl bg-zinc-800/70 text-zinc-300 hover:bg-zinc-700 active:scale-95"
              title="+15s"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={toggleRun}
              className={`p-2.5 rounded-xl font-bold flex items-center justify-center active:scale-95 transition-all ${
                isRunning 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                  : 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/30'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-2 rounded-xl bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden mb-3">
          <div
            className={`h-full transition-all duration-300 ${
              isFinished ? 'bg-emerald-400' : 'bg-emerald-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Quick Presets */}
        <div className="flex items-center justify-between gap-2">
          {[60, 90, 120].map((preset) => (
            <button
              key={preset}
              onClick={() => setPreset(preset)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                totalSeconds === preset && !isFinished
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800 border border-transparent'
              }`}
            >
              {preset} сек
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
