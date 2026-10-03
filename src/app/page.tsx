'use client';

import React, { useState, useEffect } from 'react';
import { INITIAL_WORKOUTS } from '@/data/initialWorkouts';
import { Workout, WorkoutSession } from '@/types';
import { CalendarSchedule } from '@/components/CalendarSchedule';
import { ActiveWorkout } from '@/components/ActiveWorkout';
import { AiCoachChat } from '@/components/AiCoachChat';
import { ProgressGallery } from '@/components/ProgressGallery';
import { Navigation, TabType } from '@/components/Navigation';
import { triggerHaptic } from '@/lib/audioHaptics';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<TabType>('schedule');
  const [workouts] = useState<Workout[]>(INITIAL_WORKOUTS);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [isSubmittingWorkout, setIsSubmittingWorkout] = useState<boolean>(false);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [latestSession, setLatestSession] = useState<WorkoutSession | null>(null);

  // Restore saved completed days or sessions from localStorage
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem('andriy_completed_days');
      if (savedCompleted) {
        setCompletedDays(JSON.parse(savedCompleted));
      }
      const savedLatest = localStorage.getItem('andriy_latest_session');
      if (savedLatest) {
        setLatestSession(JSON.parse(savedLatest));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleStartWorkout = (workout: Workout) => {
    triggerHaptic('heavy');
    setActiveWorkout(workout);
    setCurrentTab('workout');
  };

  const handleCancelWorkout = () => {
    triggerHaptic('light');
    setActiveWorkout(null);
    setCurrentTab('schedule');
  };

  const handleFinishWorkout = async (session: WorkoutSession) => {
    setIsSubmittingWorkout(true);
    triggerHaptic('medium');

    try {
      // Send workout session to AI Coach API
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutTitle: activeWorkout?.title,
          workoutDay: activeWorkout?.day_number,
          durationSeconds: session.total_duration_seconds,
          logs: session.logs,
          athleteNotes: session.notes,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        session.coach_verdict = json.data.verdict;
        session.coach_recommendations = {
          rating_score: json.data.score || 9,
          technique_cues: json.data.technique_cues || [],
          next_session_adjustments: json.data.next_session_adjustments || [],
          recovery_advice: json.data.recovery_advice || '',
        };
      }
    } catch (err) {
      console.error('Coach API call failed:', err);
    } finally {
      setIsSubmittingWorkout(false);
    }

    // Update state
    setLatestSession(session);
    if (activeWorkout) {
      const updatedDays = Array.from(new Set([...completedDays, activeWorkout.day_number]));
      setCompletedDays(updatedDays);
      try {
        localStorage.setItem('andriy_completed_days', JSON.stringify(updatedDays));
        localStorage.setItem('andriy_latest_session', JSON.stringify(session));
      } catch (e) {
        console.error(e);
      }
    }

    // Reset active workout and switch to AI Coach verdict screen
    setActiveWorkout(null);
    setCurrentTab('coach');
    triggerHaptic('success');
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen relative bg-zinc-950 overflow-x-hidden">
      {/* Dynamic Screen View */}
      {currentTab === 'schedule' && (
        <CalendarSchedule
          workouts={workouts}
          onStartWorkout={handleStartWorkout}
          completedDays={completedDays}
        />
      )}

      {currentTab === 'workout' && (
        activeWorkout ? (
          <ActiveWorkout
            workout={activeWorkout}
            onFinishWorkout={handleFinishWorkout}
            onCancelWorkout={handleCancelWorkout}
            isSubmitting={isSubmittingWorkout}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-safe pb-28">
            <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
              🏋️
            </div>
            <h2 className="text-base font-bold text-zinc-200">
              Немає активного тренування
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-[260px]">
              Обери день із 6-денного мікроциклу на вкладці «Розклад», щоб розпочати сесію.
            </p>
            <button
              onClick={() => setCurrentTab('schedule')}
              className="mt-5 px-5 py-2.5 rounded-2xl bg-emerald-500 text-zinc-950 text-xs font-bold active:scale-95 shadow-md shadow-emerald-500/20"
            >
              Перейти до розкладу
            </button>
          </div>
        )
      )}

      {currentTab === 'coach' && (
        <AiCoachChat latestSession={latestSession} />
      )}

      {currentTab === 'gallery' && (
        <ProgressGallery />
      )}

      {/* iOS Floating Tab Navigation Bar */}
      <Navigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isWorkoutActive={Boolean(activeWorkout)}
      />
    </main>
  );
}
