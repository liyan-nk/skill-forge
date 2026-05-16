"use client";
import { useMemo } from "react";
import { useStore } from "@/store";
import {
  getLast7Days,
  getLast30Days,
  totalMinutes,
  totalHours,
  today,
} from "@/lib/utils";

export function useSkillStats(skillId: string) {
  const logs = useStore((s) => s.logs);
  return useMemo(() => {
    const skillLogs = logs.filter((l) => l.skillId === skillId);
    const mins = totalMinutes(skillLogs);
    const todayLogs = skillLogs.filter((l) => l.date === today());
    const weekDates = getLast7Days();
    const weekLogs = skillLogs.filter((l) => weekDates.includes(l.date));
    return {
      totalLogs: skillLogs.length,
      totalMins: mins,
      totalHours: Math.round((mins / 60) * 10) / 10,
      todaySessions: todayLogs.length,
      weekSessions: weekLogs.length,
      avgMood:
        skillLogs.length > 0
          ? Math.round(
              (skillLogs.reduce((a, l) => a + l.mood, 0) / skillLogs.length) * 10
            ) / 10
          : 0,
    };
  }, [logs, skillId]);
}

export function useDashboardStats() {
  const skills = useStore((s) => s.skills);
  const logs = useStore((s) => s.logs);

  return useMemo(() => {
    const todayStr = today();
    const todayLogs = logs.filter((l) => l.date === todayStr);
    const weekDates = getLast7Days();
    const weekLogs = logs.filter((l) => weekDates.includes(l.date));
    const bestStreak = skills.reduce((a, s) => Math.max(a, s.streak), 0);
    const totalMins = totalMinutes(logs);
    const weekMins = totalMinutes(weekLogs);

    return {
      bestStreak,
      skillCount: skills.length,
      todaySessions: todayLogs.length,
      weekHours: Math.round((weekMins / 60) * 10) / 10,
      totalHours: Math.round((totalMins / 60) * 10) / 10,
      activeDays: new Set(logs.map((l) => l.date)).size,
      avgMood:
        logs.length > 0
          ? Math.round((logs.reduce((a, l) => a + l.mood, 0) / logs.length) * 10) / 10
          : 0,
    };
  }, [skills, logs]);
}

export function useWeeklyChartData() {
  const logs = useStore((s) => s.logs);
  return useMemo(() => {
    return getLast7Days().map((date) => {
      const dayLogs = logs.filter((l) => l.date === date);
      const d = new Date(date + "T00:00:00");
      return {
        date,
        day: d.toLocaleDateString("en", { weekday: "short" }),
        sessions: dayLogs.length,
        minutes: totalMinutes(dayLogs),
        hours: Math.round((totalMinutes(dayLogs) / 60) * 10) / 10,
      };
    });
  }, [logs]);
}

export function useMonthlyChartData() {
  const logs = useStore((s) => s.logs);
  return useMemo(() => {
    return getLast30Days().map((date) => {
      const dayLogs = logs.filter((l) => l.date === date);
      const d = new Date(date + "T00:00:00");
      return {
        date,
        label: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
        sessions: dayLogs.length,
        minutes: totalMinutes(dayLogs),
      };
    });
  }, [logs]);
}

export function useSkillTimeData() {
  const skills = useStore((s) => s.skills);
  const logs = useStore((s) => s.logs);
  return useMemo(() => {
    return skills
      .map((s) => ({
        name: s.title,
        color: s.color,
        hours: totalHours(logs.filter((l) => l.skillId === s.id)),
        sessions: logs.filter((l) => l.skillId === s.id).length,
      }))
      .sort((a, b) => b.hours - a.hours);
  }, [skills, logs]);
}

export function useHeatmapData() {
  const logs = useStore((s) => s.logs);
  return useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach((l) => {
      counts[l.date] = (counts[l.date] || 0) + 1;
    });
    return counts;
  }, [logs]);
}
