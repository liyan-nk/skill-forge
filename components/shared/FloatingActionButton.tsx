"use client";
import { useState } from "react";
import { Plus, Star, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Page } from "@/types";

interface Props { currentPage: Page; }

export function FloatingActionButton({ currentPage }: Props) {
  const [open, setOpen] = useState(false);
  const [showSkill, setShowSkill] = useState(false);
  const [showLog, setShowLog] = useState(false);

  // Dynamic imports to avoid circular deps
  const [SkillModal, setSkillModal] = useState<any>(null);
  const [LogModal, setLogModal] = useState<any>(null);

  async function openSkill() {
    const m = await import("@/components/skills/SkillModal");
    setSkillModal(() => m.SkillModal);
    setOpen(false); setShowSkill(true);
  }
  async function openLog() {
    const m = await import("@/components/logs/LogModal");
    setLogModal(() => m.LogModal);
    setOpen(false); setShowLog(true);
  }

  const actions = [
    { icon: FileText, label: "Log session", onClick: openLog },
    { icon: Star,     label: "Add skill",   onClick: openSkill },
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[300] flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && actions.map((a, i) => (
            <motion.div key={a.label} initial={{ opacity: 0, scale: 0.8, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 8 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2.5">
              <span className="text-xs font-medium bg-[var(--sf-bg2)] border border-[var(--sf-border2)] px-3 py-1.5 rounded-full text-[var(--sf-text2)] shadow-xl whitespace-nowrap">{a.label}</span>
              <button onClick={a.onClick} className="w-10 h-10 rounded-full bg-[var(--sf-bg2)] border border-[var(--sf-border2)] flex items-center justify-center text-[var(--sf-accent2)] hover:bg-[var(--sf-bg3)] shadow-xl transition-all hover:scale-110">
                <a.icon size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <button onClick={() => setOpen(!open)}
          className="w-[52px] h-[52px] rounded-full text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
          style={{ background: "linear-gradient(135deg,var(--sf-accent),var(--sf-accent3))", boxShadow: "0 8px 32px rgba(108,92,231,0.45)" }}>
          <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}><Plus size={22} /></motion.div>
        </button>
      </div>
      {showSkill && SkillModal && <SkillModal onClose={() => setShowSkill(false)} />}
      {showLog && LogModal && <LogModal onClose={() => setShowLog(false)} />}
    </>
  );
}
