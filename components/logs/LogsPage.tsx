"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Link } from "lucide-react";
import { useStore } from "@/store";
import { LogModal } from "./LogModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { ToastContainer, toast } from "@/components/shared/Toast";
import { formatDate, moodEmoji } from "@/lib/utils";
import type { Log } from "@/types";

export function LogsPage() {
  const { logs, skills, deleteLog } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editLog, setEditLog] = useState<Log | undefined>();
  const [filter, setFilter] = useState("all");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const skillMap = useMemo(() => Object.fromEntries(skills.map(s => [s.id, s])), [skills]);

  const filtered = useMemo(() => {
    const l = filter === "all" ? logs : logs.filter(l => l.skillId === filter);
    return [...l].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [logs, filter]);

  // Group by date
  const grouped = useMemo(() => {
    const g: Record<string, Log[]> = {};
    filtered.forEach(l => { if (!g[l.date]) g[l.date] = []; g[l.date].push(l); });
    return Object.entries(g).sort(([a],[b]) => b.localeCompare(a));
  }, [filtered]);

  function handleDelete(id: string) {
    deleteLog(id);
    setConfirmId(null);
    toast("Log deleted", "info");
  }

  return (
    <div>
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl">Activity Log</h1>
          <p className="text-sm text-[var(--sf-text2)] mt-0.5">{logs.length} session{logs.length !== 1 ? "s" : ""} recorded</p>
        </div>
        <button onClick={() => { setEditLog(undefined); setShowModal(true); }}
          className="flex items-center gap-2 bg-[var(--sf-accent)] hover:bg-[var(--sf-accent3)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
          <Plus size={15} /> Log session
        </button>
      </div>

      {/* Filter tabs */}
      {skills.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-6">
          {[{ id: "all", title: "All" }, ...skills].map(s => (
            <button key={s.id} onClick={() => setFilter(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s.id ? "bg-[var(--sf-accent)] text-white" : "bg-[var(--sf-bg3)] text-[var(--sf-text2)] hover:bg-[var(--sf-bg4)]"}`}>
              {s.title}
            </button>
          ))}
        </div>
      )}

      {logs.length === 0 ? (
        <EmptyState icon="📝" title="No sessions logged yet" description="Start tracking your practice sessions. Every logged session builds the streak."
          action={<button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[var(--sf-accent)] text-white px-4 py-2 rounded-xl text-sm font-medium"><Plus size={14} /> Log first session</button>} />
      ) : filtered.length === 0 ? (
        <EmptyState icon="🔍" title="No sessions found" description="Try selecting a different skill filter." />
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, dayLogs]) => (
            <motion.div key={date} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-[11px] font-semibold text-[var(--sf-text3)] uppercase tracking-widest mb-2">{formatDate(date)}</div>
              <div className="bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-2xl overflow-hidden">
                {dayLogs.map((log, i) => {
                  const skill = skillMap[log.skillId];
                  return (
                    <div key={log.id} className={`flex items-start gap-3 p-4 ${i < dayLogs.length - 1 ? "border-b border-[var(--sf-border)]" : ""} hover:bg-[var(--sf-bg3)] transition-colors group`}>
                      {/* Color dot */}
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: skill?.color ?? "var(--sf-accent)" }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{skill?.title ?? "Unknown"}</span>
                          <span className="text-base">{moodEmoji(log.mood)}</span>
                          <span className="text-xs text-[var(--sf-text3)]">{log.minutes}min</span>
                        </div>
                        <p className="text-sm text-[var(--sf-text2)] mt-0.5 line-clamp-2">{log.what}</p>
                        {log.proof && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Link size={10} className="text-[var(--sf-accent2)]" />
                            <span className="text-xs text-[var(--sf-accent2)] truncate max-w-[280px]">{log.proof}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditLog(log); setShowModal(true); }} className="p-1.5 rounded-lg bg-[var(--sf-bg4)] hover:bg-[var(--sf-bg5)] text-[var(--sf-text2)] transition-colors"><Edit2 size={12} /></button>
                        {confirmId === log.id ? (
                          <button onClick={() => handleDelete(log.id)} className="px-2 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/25 transition-colors">Delete?</button>
                        ) : (
                          <button onClick={() => setConfirmId(log.id)} className="p-1.5 rounded-lg bg-[var(--sf-bg4)] hover:bg-red-500/10 hover:text-red-400 text-[var(--sf-text2)] transition-colors"><Trash2 size={12} /></button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && <LogModal log={editLog} onClose={() => { setShowModal(false); setEditLog(undefined); }} />}
    </div>
  );
}
