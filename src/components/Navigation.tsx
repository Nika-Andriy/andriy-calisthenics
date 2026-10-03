'use client';

import React from 'react';
import { Calendar, PlayCircle, Bot, Image as ImageIcon } from 'lucide-react';
import { triggerHaptic } from '@/lib/audioHaptics';

export type TabType = 'schedule' | 'workout' | 'coach' | 'gallery';

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  isWorkoutActive: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  isWorkoutActive,
}) => {
  const tabs = [
    { id: 'schedule' as TabType, label: 'Розклад', icon: Calendar },
    {
      id: 'workout' as TabType,
      label: 'Сесія',
      icon: PlayCircle,
      hasBadge: isWorkoutActive,
    },
    { id: 'coach' as TabType, label: 'ШІ-Тренер', icon: Bot },
    { id: 'gallery' as TabType, label: 'Форма', icon: ImageIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
      <div className="ios-glass border-t border-zinc-800/80 px-4 pt-2 pb-safe shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  triggerHaptic('light');
                  onTabChange(tab.id);
                }}
                className={`ios-tap flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl relative transition-all duration-200 ${
                  isActive
                    ? 'text-emerald-400 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-6 h-6 transition-transform duration-200 ${
                      isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                    }`}
                  />
                  {tab.hasBadge && (
                    <span className="absolute -top-1 -right-1.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-zinc-950"></span>
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-1 tracking-tight">
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 w-5 h-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
