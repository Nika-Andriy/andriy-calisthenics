'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Clock, Flame, Dumbbell, 
  ChevronDown, ChevronUp, AlertCircle, Send, Timer as TimerIcon, RotateCcw 
} from 'lucide-react';
import { Workout, ExerciseSessionLog, WorkoutSession } from '@/types';
import { FloatingStopwatch } from './FloatingStopwatch';
import { RestTimer } from './RestTimer';
import { triggerHaptic } from '@/lib/audioHaptics';

interface ActiveWorkoutProps {
  workout: Workout;
  onFinishWorkout: (session: WorkoutSession) => Promise<void>;
  onCancelWorkout: () => void;
  isSubmitting: boolean;
}

export const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({
  workout,
  onFinishWorkout,
  onCancelWorkout,
  isSubmitting,
}) => {
  const [startTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  
  // Exercise logs state
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseSessionLog[]>(() => {
    return workout.exercises.map((ex) => ({
      exercise_id: ex.id,
      exercise_name: ex.name,
      sets: Array.from({ length: ex.target_sets }).map((_, idx) => ({
        set_number: idx + 1,
        completed: false,
        actual_reps: ex.type === 'reps' ? ex.target_reps : undefined,
        actual_seconds: ex.type === 'isometric' ? ex.hold_seconds : undefined,
        weight_kg: ex.weight_kg || 0,
        rpe: 8,
      })),
      notes: '',
    }));
  });

  // Active exercise focus for stopwatch & rest timer
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(90);
  const [isRestTimerOpen, setIsRestTimerOpen] = useState<boolean>(false);

  // Overall workout session duration ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const activeExercise = workout.exercises[activeExerciseIndex] || workout.exercises[0];

  const handleToggleSet = (exIndex: number, setIndex: number) => {
    triggerHaptic('medium');
    setExerciseLogs((prev) => {
      const next = [...prev];
      const targetSet = next[exIndex].sets[setIndex];
      const wasCompleted = targetSet.completed;
      targetSet.completed = !wasCompleted;

      // If user just marked set as completed, trigger rest timer
      if (!wasCompleted) {
        const plannedRest = workout.exercises[exIndex].rest_seconds || 90;
        setRestTimerSeconds(plannedRest);
        setIsRestTimerOpen(true);
      }

      return next;
    });
  };

  const handleUpdateSetValue = (
    exIndex: number, 
    setIndex: number, 
    field: 'actual_reps' | 'actual_seconds' | 'weight_kg', 
    val: number
  ) => {
    setExerciseLogs((prev) => {
      const next = [...prev];
      next[exIndex].sets[setIndex][field] = val;
      return next;
    });
  };

  const handleApplyStopwatchSeconds = (seconds: number) => {
    if (activeExerciseIndex >= 0) {
      setExerciseLogs((prev) => {
        const next = [...prev];
        const sets = next[activeExerciseIndex].sets;
        const firstUncompleted = sets.find((s) => !s.completed);
        if (firstUncompleted) {
          firstUncompleted.actual_seconds = seconds;
          firstUncompleted.completed = true;
          // Trigger rest timer
          setRestTimerSeconds(workout.exercises[activeExerciseIndex].rest_seconds || 90);
          setIsRestTimerOpen(true);
        }
        return next;
      });
    }
  };

  const completedSetsCount = exerciseLogs.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const totalSetsCount = exerciseLogs.reduce((acc, ex) => acc + ex.sets.length, 0);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    triggerHaptic('heavy');
    const sessionData: WorkoutSession = {
      id: `session-${Date.now()}`,
      workout_id: workout.day_number,
      athlete_name: 'Андрій',
      started_at: new Date(startTime).toISOString(),
      completed_at: new Date().toISOString(),
      status: 'completed',
      notes,
      logs: exerciseLogs,
      total_duration_seconds: elapsedSeconds,
    };
    await onFinishWorkout(sessionData);
  };

  return (
    <div className="flex flex-col pb-36 pt-safe px-4">
      {/* Session Header Bar */}
      <div className="mt-2 mb-3 ios-glass rounded-3xl p-4 border border-zinc-800 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Активна сесія • День {workout.day_number}
          </span>
          <h2 className="text-base font-bold text-zinc-100 tracking-tight">
            {workout.title}
          </h2>
          <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(elapsedSeconds)}
            </span>
            <span>
              Сети: {completedSetsCount}/{totalSetsCount}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Завершити або вийти з тренування?')) {
              onCancelWorkout();
            }
          }}
          className="p-2 text-zinc-500 hover:text-zinc-300 rounded-xl bg-zinc-900 border border-zinc-800 text-xs"
        >
          Вийти
        </button>
      </div>

      {/* Floating Stopwatch for Isometric holds */}
      {activeExercise && (
        <FloatingStopwatch
          activeExerciseName={activeExercise.name}
          targetSeconds={activeExercise.hold_seconds}
          onApplySeconds={handleApplyStopwatchSeconds}
        />
      )}

      {/* Rest Timer Modal / Drawer */}
      <RestTimer
        isOpen={isRestTimerOpen}
        initialSeconds={restTimerSeconds}
        onClose={() => setIsRestTimerOpen(false)}
      />

      {/* Exercise Checklist */}
      <div className="space-y-4 mb-6">
        {workout.exercises.map((exercise, exIdx) => {
          const log = exerciseLogs[exIdx];
          const isSelected = activeExerciseIndex === exIdx;
          const isIsometric = exercise.type === 'isometric';

          return (
            <div
              key={exercise.id}
              onClick={() => setActiveExerciseIndex(exIdx)}
              className={`ios-glass-card rounded-3xl p-4 border transition-all ${
                isSelected
                  ? 'border-emerald-500/60 bg-zinc-900/90 shadow-lg shadow-emerald-950/20'
                  : 'border-zinc-800/80 bg-zinc-950/70'
              }`}
            >
              {/* Exercise Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      #{exIdx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-100">
                      {exercise.name}
                    </h3>
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-0.5 block">
                    {exercise.equipment} • Ціль:{' '}
                    {isIsometric ? `${exercise.hold_seconds}с утримання` : `${exercise.target_reps} повторень`}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRestTimerSeconds(exercise.rest_seconds);
                    setIsRestTimerOpen(true);
                  }}
                  className="px-2 py-1 rounded-xl bg-zinc-900 text-zinc-400 hover:text-emerald-400 border border-zinc-800 text-[11px] flex items-center gap-1"
                  title="Відпочинок"
                >
                  <TimerIcon className="w-3 h-3" />
                  <span>{exercise.rest_seconds}с</span>
                </button>
              </div>

              {/* Biomechanical Technical Cue */}
              <div className="bg-zinc-950/90 rounded-2xl p-2.5 border border-zinc-900 mb-3 text-xs text-zinc-300 leading-relaxed">
                <span className="text-emerald-400 font-semibold">💡 Фокус техніки: </span>
                {exercise.cue}
              </div>

              {/* Sets Table */}
              <div className="space-y-2">
                {log?.sets.map((set, setIdx) => (
                  <div
                    key={setIdx}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                      set.completed
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : 'bg-zinc-900/50 border-zinc-800/60 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSet(exIdx, setIdx);
                        }}
                        className="text-emerald-400 ios-tap"
                      >
                        {set.completed ? (
                          <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-zinc-950" />
                        ) : (
                          <Circle className="w-5 h-5 text-zinc-600 hover:text-zinc-400" />
                        )}
                      </button>
                      <span className="text-xs font-mono font-semibold">
                        Сет {set.set_number}
                      </span>
                    </div>

                    {/* Numeric Value Inputs */}
                    <div className="flex items-center gap-2">
                      {isIsometric ? (
                        <div className="flex items-center gap-1 bg-zinc-950/80 px-2 py-1 rounded-xl border border-zinc-800">
                          <input
                            type="number"
                            value={set.actual_seconds || ''}
                            onChange={(e) =>
                              handleUpdateSetValue(
                                exIdx,
                                setIdx,
                                'actual_seconds',
                                Number(e.target.value)
                              )
                            }
                            className="w-10 bg-transparent text-right font-mono font-bold text-xs text-emerald-400 focus:outline-none"
                            placeholder="сек"
                          />
                          <span className="text-[10px] text-zinc-500">сек</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-zinc-950/80 px-2 py-1 rounded-xl border border-zinc-800">
                          <input
                            type="number"
                            value={set.actual_reps || ''}
                            onChange={(e) =>
                              handleUpdateSetValue(
                                exIdx,
                                setIdx,
                                'actual_reps',
                                Number(e.target.value)
                              )
                            }
                            className="w-8 bg-transparent text-right font-mono font-bold text-xs text-emerald-400 focus:outline-none"
                            placeholder="повт"
                          />
                          <span className="text-[10px] text-zinc-500">повт</span>
                        </div>
                      )}

                      {exercise.weight_kg !== undefined && (
                        <div className="flex items-center gap-1 bg-zinc-950/80 px-2 py-1 rounded-xl border border-zinc-800">
                          <input
                            type="number"
                            value={set.weight_kg || ''}
                            onChange={(e) =>
                              handleUpdateSetValue(
                                exIdx,
                                setIdx,
                                'weight_kg',
                                Number(e.target.value)
                              )
                            }
                            className="w-10 bg-transparent text-right font-mono text-xs text-zinc-200 focus:outline-none"
                            placeholder="кг"
                          />
                          <span className="text-[10px] text-zinc-500">кг</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Notes Section */}
      <div className="ios-glass-card rounded-3xl p-4 border border-zinc-800 mb-6 shadow-xl">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
          Замітки для ШІ-Тренера (суглоби, відчуття, помилки)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Наприклад: Handstand — вдався баланс на 18с, але на 3 сеті був переліт. Planche Lean — плечі відчували навантаження без болю..."
          rows={3}
          className="w-full bg-zinc-950/80 rounded-2xl p-3 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 resize-none"
        />
      </div>

      {/* Finish Workout CTA */}
      <button
        onClick={handleFinish}
        disabled={isSubmitting}
        className="ios-tap w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide bg-gradient-to-r from-emerald-500 to-emerald-400 text-zinc-950 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-98 transition-transform disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            <span>Аналіз тренування з Gemini...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5 fill-current" />
            <span>Завершити тренування ({completedSetsCount}/{totalSetsCount} виконано)</span>
          </>
        )}
      </button>
    </div>
  );
};
