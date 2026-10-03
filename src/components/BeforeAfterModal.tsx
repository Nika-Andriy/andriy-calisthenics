'use client';

import React, { useState } from 'react';
import { X, ArrowLeftRight, Calendar, Scale, Sparkles } from 'lucide-react';
import { ProgressPhoto } from '@/types';
import { triggerHaptic } from '@/lib/audioHaptics';

interface BeforeAfterModalProps {
  photoBefore: ProgressPhoto;
  photoAfter: ProgressPhoto;
  onClose: () => void;
}

export const BeforeAfterModal: React.FC<BeforeAfterModalProps> = ({
  photoBefore,
  photoAfter,
  onClose,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider'>('side-by-side');

  const weightDelta = (photoAfter.weight_kg - photoBefore.weight_kg).toFixed(1);
  const isLighter = Number(weightDelta) < 0;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-2xl flex flex-col pt-safe pb-safe px-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-3 border-b border-zinc-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Порівняння форми
          </span>
          <h2 className="text-base font-bold text-zinc-100">
            «До» vs «Після» • Андрій
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              setViewMode(viewMode === 'side-by-side' ? 'slider' : 'side-by-side');
            }}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-1 active:scale-95"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>{viewMode === 'side-by-side' ? 'Слайдер' : 'Поруч'}</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-100 bg-zinc-900 border border-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Delta Metrics Banner */}
      <div className="my-3 py-2 px-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-300">
            Зміна ваги:
          </span>
          <span className={`font-mono font-bold ${isLighter ? 'text-emerald-400' : 'text-amber-400'}`}>
            {Number(weightDelta) > 0 ? `+${weightDelta}` : weightDelta} кг
          </span>
        </div>
        <div className="flex items-center gap-1 text-zinc-400 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Сухий м&apos;язовий рельєф</span>
        </div>
      </div>

      {/* Comparison Viewport */}
      <div className="flex-1 flex flex-col justify-center min-h-0 py-2">
        {viewMode === 'side-by-side' ? (
          <div className="grid grid-cols-2 gap-2 h-full max-h-[500px]">
            {/* Before Photo */}
            <div className="flex flex-col bg-zinc-900/60 rounded-3xl p-2 border border-zinc-800 overflow-hidden">
              <div className="relative flex-1 rounded-2xl overflow-hidden bg-zinc-950 flex items-center justify-center">
                <img
                  src={photoBefore.photo_url}
                  alt="До"
                  className="w-full h-full object-cover object-center"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-zinc-950/80 text-[10px] font-bold text-zinc-300 border border-zinc-800">
                  ДО
                </span>
              </div>
              <div className="pt-2 text-center">
                <div className="text-xs font-mono font-bold text-zinc-200">
                  {photoBefore.weight_kg} кг
                </div>
                <div className="text-[10px] text-zinc-500">
                  {photoBefore.taken_at}
                </div>
              </div>
            </div>

            {/* After Photo */}
            <div className="flex flex-col bg-zinc-900/60 rounded-3xl p-2 border border-emerald-500/30 overflow-hidden">
              <div className="relative flex-1 rounded-2xl overflow-hidden bg-zinc-950 flex items-center justify-center">
                <img
                  src={photoAfter.photo_url}
                  alt="Після"
                  className="w-full h-full object-cover object-center"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-emerald-500 text-[10px] font-bold text-zinc-950">
                  ПІСЛЯ
                </span>
              </div>
              <div className="pt-2 text-center">
                <div className="text-xs font-mono font-bold text-emerald-400">
                  {photoAfter.weight_kg} кг
                </div>
                <div className="text-[10px] text-zinc-500">
                  {photoAfter.taken_at}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Interactive Split Overlay Slider */
          <div className="relative flex-1 max-h-[520px] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 select-none">
            {/* Background After image */}
            <img
              src={photoAfter.photo_url}
              alt="Після"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Clipped Before image */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={photoBefore.photo_url}
                alt="До"
                className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            {/* Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-emerald-400 cursor-ew-resize shadow-[0_0_10px_rgba(16,185,129,0.8)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-lg">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
            </div>

            {/* Labels */}
            <span className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-zinc-950/80 text-[10px] font-bold text-zinc-300">
              ДО: {photoBefore.weight_kg} кг ({photoBefore.taken_at})
            </span>
            <span className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-emerald-500 text-[10px] font-bold text-zinc-950">
              ПІСЛЯ: {photoAfter.weight_kg} кг ({photoAfter.taken_at})
            </span>

            {/* Slider Range Control */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-x-0 bottom-12 opacity-0 h-10 w-full cursor-ew-resize"
            />
          </div>
        )}
      </div>
    </div>
  );
};
