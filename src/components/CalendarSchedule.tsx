'use client';

import React, { useState } from 'react';
import { Play, CheckCircle, ChevronRight, Dumbbell, ShieldCheck, Flame, Moon, Sparkles, Target } from 'lucide-react';
import { Workout } from '@/types';
import { ATHLETE_ANDRIY } from '@/data/athleteProfile';
import { triggerHaptic } from '@/lib/audioHaptics';

interface CalendarScheduleProps {
  workouts: Workout[];
  onStartWorkout: (workout: Workout) => void;
  completedDays: number[];
}

export const CalendarSchedule: React.FC<CalendarScheduleProps> = ({
  workouts,
  onStartWorkout,
  completedDays,
}) => {
  // Default to Day 1 or current day of week (1-7)
  const todayDayNumber = new Date().getDay() === 0 ? 7 : new Date().getDay();
  const [selectedDay, setSelectedDay] = useState<number>(todayDayNumber);

  const currentWorkout = workouts.find((w) => w.day_number === selectedDay) || workouts[0];

  return (
    <div className="flex flex-col pb-28 pt-safe px-4">
      {/* Athlete Header Card */}
      <div className="mt-2 mb-5 ios-glass rounded-3xl p-4 border border-zinc-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                {ATHLETE_ANDRIY.level}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {ATHLETE_ANDRIY.height_cm}см / {ATHLETE_ANDRIY.weight_kg}кг
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 mt-1">
              Атлет: {ATHLETE_ANDRIY.name}
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
              {ATHLETE_ANDRIY.body_type}
            </p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shadow-inner">
            <Flame className="w-5 h-5 fill-emerald-500/20" />
          </div>
        </div>

        {/* 4 Pillars Quick Summary */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-800/60">
          <div className="bg-zinc-950/60 rounded-xl p-2 border border-zinc-900">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
              Handstand
            </span>
            <span className="text-[11px] text-zinc-300 line-clamp-1">
              Fingertip pressure & Hollow body
            </span>
          </div>
          <div className="bg-zinc-950/60 rounded-xl p-2 border border-zinc-900">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
              Planche
            </span>
            <span className="text-[11px] text-zinc-300 line-clamp-1">
              Низькі паралетси & Протракція
            </span>
          </div>
          <div className="bg-zinc-950/60 rounded-xl p-2 border border-zinc-900">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
              Front Lever
            </span>
            <span className="text-[11px] text-zinc-300 line-clamp-1">
              Adv. Tuck → One-leg & Rows
            </span>
          </div>
          <div className="bg-zinc-950/60 rounded-xl p-2 border border-zinc-900">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
              Legs & Core
            </span>
            <span className="text-[11px] text-zinc-300 line-clamp-1">
              Фронтальний присід, RDL, L-sit
            </span>
          </div>
        </div>
      </div>

      {/* Week Microcycle Horizontal Strip */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            6-Денний Мікроцикл
          </h2>
          <span className="text-[11px] text-emerald-400 font-medium">
            Сьогодні: День {todayDayNumber}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {workouts.map((w) => {
            const isSelected = selectedDay === w.day_number;
            const isToday = todayDayNumber === w.day_number;
            const isDone = completedDays.includes(w.day_number);

            return (
              <button
                key={w.day_number}
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedDay(w.day_number);
                }}
                className={`ios-tap flex-1 min-w-[48px] py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center relative transition-all border ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-400 shadow-md shadow-emerald-500/10'
                    : 'bg-zinc-900/60 border-zinc-800/70 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                {isToday && (
                  <span className="absolute -top-1 w-2 h-2 rounded-full bg-emerald-400" />
                )}
                <span className="text-[10px] uppercase font-bold tracking-tight">
                  Д{w.day_number}
                </span>
                <span className="text-sm font-bold mt-0.5 font-mono">
                  {w.is_rest ? 'Rest' : `P${w.day_number}`}
                </span>
                {isDone && (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-1 fill-emerald-500/20" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Workout Card */}
      {currentWorkout && (
        <div className="ios-glass-card rounded-3xl p-5 border border-zinc-800 shadow-xl relative">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                День {currentWorkout.day_number} {currentWorkout.day_number === todayDayNumber ? '• Сьогодні' : ''}
              </span>
              <h3 className="text-lg font-bold text-zinc-100 tracking-tight mt-0.5">
                {currentWorkout.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {currentWorkout.focus}
              </p>
            </div>

            {currentWorkout.is_rest ? (
              <div className="p-2.5 rounded-2xl bg-zinc-900 text-indigo-400 border border-zinc-800">
                <Moon className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Dumbbell className="w-5 h-5" />
              </div>
            )}
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-2xl border border-zinc-900 mb-4">
            {currentWorkout.description}
          </p>

          {/* Exercises Preview List */}
          {!currentWorkout.is_rest && (
            <div className="space-y-2 mb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Програма тренування ({currentWorkout.exercises.length} вправ)
              </span>

              {currentWorkout.exercises.map((ex, idx) => (
                <div
                  key={ex.id || idx}
                  className="bg-zinc-950/70 p-3 rounded-2xl border border-zinc-800/60 flex items-start justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        #{idx + 1}
                      </span>
                      <h4 className="text-xs font-semibold text-zinc-200">
                        {ex.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1 italic">
                      💡 {ex.cue}
                    </p>
                  </div>

                  <div className="text-right whitespace-nowrap">
                    <span className="text-xs font-mono font-bold text-zinc-200 block">
                      {ex.target_sets} x {ex.type === 'isometric' ? `${ex.hold_seconds}с` : `${ex.target_reps} повт`}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {ex.equipment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Start Button or Rest Note */}
          {currentWorkout.is_rest ? (
            <div className="text-center py-4 px-3 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <Sparkles className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
              <p className="text-xs text-zinc-300 font-medium">
                День активного відновлення: прогулянка, сауна, розтяжка кистей.
              </p>
            </div>
          ) : (
            <button
              onClick={() => {
                triggerHaptic('heavy');
                onStartWorkout(currentWorkout);
              }}
              className="ios-tap w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide bg-gradient-to-r from-emerald-500 to-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-98 transition-transform"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Почати тренування</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
