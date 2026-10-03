'use client';

import React, { useState } from 'react';
import { 
  Bot, Send, Sparkles, Award, ArrowUpRight, ShieldCheck, 
  MessageSquare, HeartPulse, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { WorkoutSession, CoachRecommendations } from '@/types';
import { triggerHaptic } from '@/lib/audioHaptics';

interface AiCoachChatProps {
  latestSession?: WorkoutSession | null;
  onRefreshCoach?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

export const AiCoachChat: React.FC<AiCoachChatProps> = ({
  latestSession,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'coach',
      text: 'Привіт, Андрію! Я проаналізував твій стан та 6-денний мікроцикл. Як почуваються зап’ястя та плечі сьогодні? Готовий розібрати будь-які деталі щодо Handstand, Planche чи тяги.',
      timestamp: 'Щойно',
    },
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isAsking, setIsAsking] = useState<boolean>(false);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputVal;
    if (!textToSend.trim() || isAsking) return;

    triggerHaptic('medium');
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Зараз',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsAsking(true);

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutTitle: latestSession?.workout_id ? `День ${latestSession.workout_id}` : 'Консультація поза тренуванням',
          userMessage: textToSend,
          athleteNotes: textToSend,
          logs: latestSession?.logs || [],
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const coachReply = json.data.verdict || json.data.analysis;
        setMessages((prev) => [
          ...prev,
          {
            id: `c-${Date.now()}`,
            sender: 'coach',
            text: coachReply,
            timestamp: 'Зараз',
          },
        ]);
        triggerHaptic('success');
      }
    } catch (e) {
      console.error('Chat error:', e);
      setMessages((prev) => [
        ...prev,
        {
          id: `c-err-${Date.now()}`,
          sender: 'coach',
          text: 'Андрію, не втрачай фокус: головне в стійці зараз — активний тиск пучками пальців (fingertip pressure) та втоплені ребра без прогину!',
          timestamp: 'Зараз',
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const quickQuestions = [
    "Як стабілізувати стійку без перельоту?",
    "Як розвантажити зап'ястя на паралетсах?",
    "Чи додати вагу на фронтальний присід?",
  ];

  const recommendations = latestSession?.coach_recommendations;

  return (
    <div className="flex flex-col pb-28 pt-safe px-4">
      {/* Header */}
      <div className="mt-2 mb-4 ios-glass rounded-3xl p-4 border border-zinc-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center text-zinc-950 font-bold shadow-lg shadow-emerald-500/20">
            <Bot className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-zinc-100">
                ШІ-Тренер Gemini
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-zinc-400">
              Персоналізовано для Андрія (66 кг, Calisthenics)
            </p>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-emerald-400 font-semibold">
          v2.5 Flash
        </div>
      </div>

      {/* Latest Workout Verdict Card (if exists) */}
      {latestSession?.coach_verdict && (
        <div className="ios-glass-card rounded-3xl p-5 border border-emerald-500/40 bg-zinc-900/90 shadow-2xl mb-5 relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Вердикт останнього тренування
                </span>
                <h3 className="text-sm font-bold text-zinc-100">
                  Оцінка сесії: {recommendations?.rating_score || 9.0}/10
                </h3>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-200 leading-relaxed font-medium bg-zinc-950/70 p-3.5 rounded-2xl border border-zinc-800/80 mb-4">
            {latestSession.coach_verdict}
          </p>

          {/* Actionable Adjustments */}
          {recommendations?.next_session_adjustments && recommendations.next_session_adjustments.length > 0 && (
            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                🎯 Корективи на наступну сесію:
              </span>
              {recommendations.next_session_adjustments.map((adj, i) => (
                <div
                  key={i}
                  className="bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between text-xs"
                >
                  <span className="text-zinc-300 font-medium">{adj.exercise}</span>
                  <span className="text-emerald-400 font-mono font-bold">{adj.target_metric}</span>
                </div>
              ))}
            </div>
          )}

          {/* Technique Cues */}
          {recommendations?.technique_cues && recommendations.technique_cues.length > 0 && (
            <div className="space-y-1.5 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                💡 Ключові біомеханічні акценти:
              </span>
              {recommendations.technique_cues.map((cue, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{cue}</span>
                </div>
              ))}
            </div>
          )}

          {/* Recovery Advice */}
          {recommendations?.recovery_advice && (
            <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-start gap-2 text-xs text-zinc-400">
              <HeartPulse className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{recommendations.recovery_advice}</span>
            </div>
          )}
        </div>
      )}

      {/* Interactive Chat Dialogue */}
      <div className="ios-glass-card rounded-3xl p-4 border border-zinc-800 mb-4 shadow-xl">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>Діалог з тренером</span>
        </h2>

        {/* Message Stream */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1 mb-3">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-emerald-500 text-zinc-950 font-medium rounded-br-none shadow-md shadow-emerald-500/10'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-zinc-500 mt-0.5 px-1 font-mono">
                  {m.timestamp}
                </span>
              </div>
            );
          })}
          {isAsking && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 p-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span>ШІ-Тренер аналізує біомеханіку...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar mb-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-300 border border-zinc-800/80 active:scale-95 transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="flex items-center gap-2 bg-zinc-950/80 rounded-2xl p-1.5 border border-zinc-800">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Запитай про стійку, планш, біль у плечах..."
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputVal.trim() || isAsking}
            className="p-2 rounded-xl bg-emerald-500 text-zinc-950 disabled:opacity-40 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
