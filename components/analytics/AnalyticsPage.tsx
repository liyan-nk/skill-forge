"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Clock, Calendar, Star } from "lucide-react";
import { useStore } from "@/store";
import { StatCard } from "@/components/shared/StatCard";
import { Heatmap } from "@/components/shared/Heatmap";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { ToastContainer } from "@/components/shared/Toast";
import { useDashboardStats, useMonthlyChartData, useSkillTimeData, useHeatmapData } from "@/hooks";
import { totalMinutes } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, PieChart, Pie, Legend,
} from "recharts";

export function AnalyticsPage() {
  const skills = useStore(s => s.skills);
  const logs = useStore(s => s.logs);
  const stats = useDashboardStats();
  const monthlyData = useMonthlyChartData();
  const skillTimeData = useSkillTimeData();
  const heatCounts = useHeatmapData();

  const maxSkillHours = Math.max(1, ...skillTimeData.map(s => s.hours));

  const moodDist = useMemo(() => {
    const dist = [0,0,0,0,0];
    logs.forEach(l => { if (l.mood >= 1 && l.mood <= 5) dist[l.mood - 1]++; });
    return ["😓","😕","😐","😊","🔥"].map((emoji, i) => ({ emoji, count: dist[i], label: ["Tough","Below avg","Solid","Great","On fire"][i] }));
  }, [logs]);

  return (
    <div>
      <ToastContainer />
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl">Analytics</h1>
        <p className="text-sm text-[var(--sf-text2)] mt-0.5">Your progress at a glance</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Hours" value={`${stats.totalHours}h`} sub="across all skills" icon={<Clock size={14}/>} delay={0} />
        <StatCard label="Active Days" value={stats.activeDays} sub="days with sessions" icon={<Calendar size={14}/>} delay={0.05} />
        <StatCard label="Avg Mood" value={`${stats.avgMood}/5`} sub="focus rating" icon={<Star size={14}/>} delay={0.1} />
        <StatCard label="Best Streak" value={`🔥 ${stats.bestStreak}`} sub="days" accent delay={0.15} />
      </div>

      {/* 30-day sessions chart */}
      <div className="bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-2xl p-5 mb-4">
        <div className="text-[11px] font-semibold text-[var(--sf-text3)] uppercase tracking-widest mb-4">Sessions per Day — Last 30 Days</div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--sf-accent)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--sf-accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} interval={6} />
            <YAxis hide allowDecimals={false} />
            <Tooltip contentStyle={{ background: "var(--sf-bg3)", border: "1px solid var(--sf-border2)", borderRadius: 10, fontSize: 12 }}
              formatter={(v: any) => [`${v} sessions`, ""]} cursor={{ stroke: "var(--sf-accent)", strokeWidth: 1 }} />
            <Area type="monotone" dataKey="sessions" stroke="var(--sf-accent)" strokeWidth={2} fill="url(#areaGrad)" dot={false} activeDot={{ r: 4, fill: "var(--sf-accent)" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Skill time breakdown */}
        <div className="bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-2xl p-5">
          <div className="text-[11px] font-semibold text-[var(--sf-text3)] uppercase tracking-widest mb-4">Time per Skill</div>
          {skillTimeData.length === 0 ? (
            <div className="text-sm text-[var(--sf-text3)] text-center py-8">No data yet</div>
          ) : (
            <div className="space-y-3">
              {skillTimeData.map(s => (
                <div key={s.name}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                      <span className="text-sm font-medium">{s.name}</span>
                    </div>
                    <div className="text-xs text-[var(--sf-text2)]">{s.hours}h · {s.sessions} sessions</div>
                  </div>
                  <ProgressBar value={Math.round((s.hours / maxSkillHours) * 100)} color={s.color} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mood distribution */}
        <div className="bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-2xl p-5">
          <div className="text-[11px] font-semibold text-[var(--sf-text3)] uppercase tracking-widest mb-4">Focus Distribution</div>
          {logs.length === 0 ? (
            <div className="text-sm text-[var(--sf-text3)] text-center py-8">No data yet</div>
          ) : (
            <div className="space-y-2.5">
              {moodDist.map(({ emoji, count, label }) => {
                const pct = logs.length > 0 ? Math.round((count / logs.length) * 100) : 0;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-lg w-6 flex-shrink-0">{emoji}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-[var(--sf-text2)]">{label}</span>
                        <span className="text-xs text-[var(--sf-text3)]">{count} ({pct}%)</span>
                      </div>
                      <ProgressBar value={pct} color="var(--sf-accent)" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Streak leaderboard */}
      <div className="bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-2xl p-5 mb-4">
        <div className="text-[11px] font-semibold text-[var(--sf-text3)] uppercase tracking-widest mb-4">Streak Leaderboard</div>
        {skills.length === 0 ? (
          <div className="text-sm text-[var(--sf-text3)] text-center py-8">No skills tracked yet</div>
        ) : (
          <div className="divide-y divide-[var(--sf-border)]">
            {[...skills].sort((a,b) => b.streak - a.streak).map((s, i) => (
              <div key={s.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="w-6 text-center text-sm font-bold text-[var(--sf-text3)]">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </div>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <div className="flex-1 font-medium text-sm">{s.title}</div>
                <div className="text-sm font-bold text-amber-400">{s.streak > 0 ? `🔥 ${s.streak} days` : <span className="text-[var(--sf-text3)] font-normal">No streak</span>}</div>
                <div className="text-xs text-[var(--sf-text3)]">Best: {s.longestStreak || s.streak}d</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full heatmap */}
      <div className="bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-2xl p-5">
        <div className="text-[11px] font-semibold text-[var(--sf-text3)] uppercase tracking-widest mb-4">Full Activity Heatmap</div>
        <Heatmap counts={heatCounts} weeks={26} />
      </div>
    </div>
  );
}
