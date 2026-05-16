"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, Plus, Flame, Clock, BookOpen } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { SkillModal } from "./SkillModal";
import { LogModal } from "@/components/logs/LogModal";
import { useStore } from "@/store";
import { useSkillStats } from "@/hooks";
import { toast } from "@/components/shared/Toast";
import type { Skill } from "@/types";
import { cn } from "@/lib/utils";

interface Props { skill: Skill; index: number; }

export function SkillCard({ skill, index }: Props) {
  const [showEdit, setShowEdit] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { deleteSkill } = useStore();
  const stats = useSkillStats(skill.id);

  function handleDelete() {
    deleteSkill(skill.id);
    toast("Skill deleted", "info");
  }

  const weekPct = Math.min(100, stats.weekSessions * 14.3); // 7 days = 100%

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
        className="bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-2xl overflow-hidden hover:border-[var(--sf-border2)] transition-all group relative">
        {/* Color accent bar */}
        <div className="h-0.5 w-full" style={{ background: skill.color }} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-base truncate">{skill.title}</h3>
              {skill.description && <p className="text-xs text-[var(--sf-text2)] mt-0.5 line-clamp-2">{skill.description}</p>}
            </div>
            {skill.streak > 0 && (
              <div className="flex items-center gap-1 text-amber-400 font-bold text-sm ml-3 flex-shrink-0">
                <Flame size={14} className="animate-pulse" /> {skill.streak}
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            <Badge>{skill.category}</Badge>
            <Badge className={cn(skill.difficulty === "Beginner" ? "text-emerald-400 bg-emerald-400/10" : skill.difficulty === "Intermediate" ? "text-amber-400 bg-amber-400/10" : "text-red-400 bg-red-400/10")}>
              {skill.difficulty}
            </Badge>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: BookOpen, val: stats.totalLogs, label: "sessions" },
              { icon: Clock,    val: `${stats.totalHours}h`, label: "total" },
              { icon: Flame,    val: skill.longestStreak || skill.streak, label: "best streak" },
            ].map(({ icon: Icon, val, label }) => (
              <div key={label} className="text-center bg-[var(--sf-bg3)] rounded-xl py-2 px-1">
                <div className="font-bold text-sm text-[var(--sf-text)]">{val}</div>
                <div className="text-[10px] text-[var(--sf-text3)] mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Weekly progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] text-[var(--sf-text3)]">This week</span>
              <span className="text-[10px] text-[var(--sf-text2)]">{stats.weekSessions}/7 days</span>
            </div>
            <ProgressBar value={weekPct} color={skill.color} />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={() => setShowLog(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90 text-white"
              style={{ background: skill.color }}>
              <Plus size={12} /> Log session
            </button>
            <button onClick={() => setShowEdit(true)}
              className="p-2 rounded-xl bg-[var(--sf-bg3)] hover:bg-[var(--sf-bg4)] text-[var(--sf-text2)] transition-colors">
              <Edit2 size={14} />
            </button>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)}
                className="p-2 rounded-xl bg-[var(--sf-bg3)] hover:bg-red-500/10 hover:text-red-400 text-[var(--sf-text2)] transition-colors">
                <Trash2 size={14} />
              </button>
            ) : (
              <button onClick={handleDelete}
                className="px-3 py-2 rounded-xl bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/25 transition-colors"
                onBlur={() => setConfirmDelete(false)}>
                Confirm
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {showEdit && <SkillModal skill={skill} onClose={() => setShowEdit(false)} />}
      {showLog  && <LogModal  skillId={skill.id} onClose={() => setShowLog(false)} />}
    </>
  );
}
