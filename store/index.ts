"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Skill, Log, TimerSession, Difficulty, Category } from "@/types";
import { nanoid } from "@/lib/utils";

interface SkillForgeState {
  skills: Skill[];
  logs: Log[];
  timerSessions: TimerSession[];
  hasOnboarded: boolean;

  // Skill actions
  addSkill: (data: Omit<Skill, "id" | "streak" | "longestStreak" | "createdAt">) => string;
  updateSkill: (id: string, data: Partial<Omit<Skill, "id" | "createdAt">>) => void;
  deleteSkill: (id: string) => void;

  // Log actions
  addLog: (data: Omit<Log, "id" | "createdAt">) => void;
  updateLog: (id: string, data: Partial<Omit<Log, "id" | "createdAt">>) => void;
  deleteLog: (id: string) => void;

  // Timer
  addTimerSession: (session: Omit<TimerSession, "id">) => void;

  // Onboarding
  completeOnboarding: () => void;

  // Streak calculation
  recalcStreaks: () => void;
  clearData: () => void; // 1. Add to interface
}

function calcStreak(logs: Log[], skillId: string): { streak: number; longest: number } {
  const dates = logs
    .filter((l) => l.skillId === skillId)
    .map((l) => l.date)
    .sort()
    .reverse();

  if (dates.length === 0) return { streak: 0, longest: 0 };

  const unique = [...new Set(dates)];
  let streak = 0;
  let longest = 0;
  let current = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 400; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    if (unique.includes(ds)) {
      if (i === 0 || streak > 0) streak++;
      current++;
      longest = Math.max(longest, current);
    } else {
      if (i === 0) {
        // Check yesterday
      } else if (streak > 0) {
        break;
      } else {
        current = 0;
      }
    }
  }

  // Simpler approach
  streak = 0;
  const todayStr = today.toISOString().slice(0, 10);
  const yesterdayStr = new Date(today.getTime() - 86400000).toISOString().slice(0, 10);
  const hasToday = unique.includes(todayStr);
  const hasYesterday = unique.includes(yesterdayStr);

  if (!hasToday && !hasYesterday) return { streak: 0, longest: calcLongest(unique) };

  const start = hasToday ? 0 : 1;
  for (let i = start; i < 400; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    if (unique.includes(ds)) streak++;
    else break;
  }

  return { streak, longest: Math.max(streak, calcLongest(unique)) };
}

function calcLongest(sortedUnique: string[]): number {
  if (sortedUnique.length === 0) return 0;
  let max = 1, cur = 1;
  const sorted = [...sortedUnique].sort();
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) { cur++; max = Math.max(max, cur); }
    else cur = 1;
  }
  return max;
}

export const useStore = create<SkillForgeState>()(
  persist(
    (set, get) => ({
      skills: [],
      logs: [],
      timerSessions: [],
      hasOnboarded: false,
      // Proposed addition to skillforge/store/index.ts
      clearData: () => set({ 
        skills: [], 
        logs: [], 
        timerSessions: [], 
        hasOnboarded: false 
      }),

      addSkill: (data) => {
        const id = nanoid();
        set((s) => ({
          skills: [
            ...s.skills,
            { ...data, id, streak: 0, longestStreak: 0, createdAt: new Date().toISOString() },
          ],
        }));
        return id;
      },

      updateSkill: (id, data) =>
        set((s) => ({
          skills: s.skills.map((sk) => (sk.id === id ? { ...sk, ...data } : sk)),
        })),

      deleteSkill: (id) =>
        set((s) => ({
          skills: s.skills.filter((sk) => sk.id !== id),
          logs: s.logs.filter((l) => l.skillId !== id),
        })),

      addLog: (data) => {
        set((s) => ({
          logs: [...s.logs, { ...data, id: nanoid(), createdAt: new Date().toISOString() }],
        }));
        get().recalcStreaks();
      },

      updateLog: (id, data) => {
        set((s) => ({
          logs: s.logs.map((l) => (l.id === id ? { ...l, ...data } : l)),
        }));
        get().recalcStreaks();
      },

      deleteLog: (id) => {
        set((s) => ({ logs: s.logs.filter((l) => l.id !== id) }));
        get().recalcStreaks();
      },

      addTimerSession: (session) =>
        set((s) => ({
          timerSessions: [...s.timerSessions, { ...session, id: nanoid() }],
        })),

      completeOnboarding: () => set({ hasOnboarded: true }),

      recalcStreaks: () => {
        const { skills, logs } = get();
        set({
          skills: skills.map((sk) => {
            const { streak, longest } = calcStreak(logs, sk.id);
            return { ...sk, streak, longestStreak: longest };
          }),
        });
      },
    }),
    {
      name: "skillforge-storage",
      version: 1,
    }
  )
);
