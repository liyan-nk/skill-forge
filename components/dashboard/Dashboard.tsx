"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Star, Clock, CalendarCheck } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { Heatmap } from "@/components/shared/Heatmap";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { ToastContainer } from "@/components/shared/Toast";
import { useStore } from "@/store";
import { useDashboardStats, useWeeklyChartData, useHeatmapData } from "@/hooks";
import { greeting, formatDate, moodEmoji, today, totalMinutes } from "@/lib/utils";
import { MOTIVATIONAL_QUOTES } from "@/types";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export function Dashboard() {
  const skills = useStore(s => s.skills);
  const logs = useStore(s => s.logs);
  const stats = useDashboardStats();
  const weeklyData = useWeeklyChartData();
  const heatCounts = useHeatmapData();
  const todayStr = today();

  const quote = useMemo(() => {
    const idx = Math.floor(Date.now() / 86400000) % MOTIVATIONAL_QUOTES.length;
    return MOTIVATIONAL_QUOTES[idx];
  }, []);

  const recentLogs = useMemo(() =>
    [...logs].sort((a,b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6),
    [logs]
  );

  const skillMap = useMemo(() => Object.fromEntries(skills.map(s => [s.id, s])), [skills]);

  return (
    <div>
      <ToastContainer />

      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display font-bold text-3xl gradient-text">{greeting()} 👋</h1>
        <p className="text-[var(--sf-text2)] text-sm mt-1">{new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}</p>
      </motion.div>

      {/* Quote */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-[var(--sf-accent)]10 to-transparent border border-[var(--sf-accent)]20 rounded-2xl px-5 py-4 mb-6">
        <p className="font-display text-sm italic text-[var(--sf-text)] leading-relaxed">"{quote.text}"</p>
        <p className="text-xs text-[var(--sf-text3)] mt-1.5">— {quote.author}</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Best Streak" value={`🔥 ${stats.bestStreak}`} sub="days in a row" accent delay={0} />
        <StatCard label="Skills" value={stats.skillCount} sub="actively tracked" delay={0.05} />
        <StatCard label="Today" value={stats.todaySessions} sub="sessions logged" delay={0.1} />
        <StatCard label="This Week" value={`${stats.weekHours}h`} sub="time invested" delay={0.15} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Weekly chart */}
        <div className="bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-2xl p-5">
          <div className="text-[11px] font-semibold text-[var(--sf-text3)] uppercase tracking-widest mb-4">Weekly Activity</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "var(--sf-bg3)", border: "1px solid var(--sf-border2)", borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: "var(--sf-text2)" }}
                formatter={(v: any) => [`${v} sessions`, ""]}
                cursor={{ fill: "var(--sf-accent)10" }}
              />
              <Bar dataKey="sessions" fill="var(--sf-accent)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active skills */}
        <div className="bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-2xl p-5">
          <div className="text-[11px] font-semibold text-[var(--sf-text3)] uppercase tracking-widest mb-4">Active Skills</div>
          {skills.length === 0 ? (
            <div className="flex items-center justify-center h-[160px] text-[var(--sf-text3)] text-sm">No skills yet</div>
          ) : (
            <div className="space-y-3">
              {skills.slice(0, 5).map(s => {
                const weekLogs = logs.filter(l => l.skillId === s.id && weeklyData.map(d => d.date).includes(l.date));
                const pct = Math.min(100, weekLogs.length * 14.3);
                return (
                  <div key={s.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                        <span className="text-sm font-medium truncate max-w-[140px]">{s.title}</span>
                      </div>
                      <span className="text-xs text-amber-400 font-semibold">{s.streak > 0 ? `🔥 ${s.streak}` : ""}</span>
                    </div>
                    <ProgressBar value={pct} color={s.color} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-2xl p-5 mb-4">
        <div className="text-[11px] font-semibold text-[var(--sf-text3)] uppercase tracking-widest mb-4">Consistency Heatmap</div>
        <Heatmap counts={heatCounts} weeks={20} />
      </div>

      {/* Recent activity */}
      <div className="bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] font-semibold text-[var(--sf-text3)] uppercase tracking-widest">Recent Activity</div>
        </div>
        {recentLogs.length === 0 ? (
          <div className="text-center py-8 text-sm text-[var(--sf-text3)]">No sessions yet. Log your first session to see it here.</div>
        ) : (
          <div className="divide-y divide-[var(--sf-border)]">
            {recentLogs.map(log => {
              const skill = skillMap[log.skillId];
              return (
                <div key={log.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: skill?.color ?? "var(--sf-accent)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{skill?.title ?? "Unknown"}</span>
                      <span>{moodEmoji(log.mood)}</span>
                      <span className="text-xs text-[var(--sf-text3)]">{log.minutes}min</span>
                    </div>
                    <p className="text-xs text-[var(--sf-text2)] mt-0.5 truncate">{log.what}</p>
                  </div>
                  <span className="text-xs text-[var(--sf-text3)] flex-shrink-0">{formatDate(log.date)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
