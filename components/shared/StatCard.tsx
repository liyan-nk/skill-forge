"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
interface Props { label: string; value: string | number; sub?: string; icon?: React.ReactNode; accent?: boolean; delay?: number; className?: string; }
export function StatCard({ label, value, sub, icon, accent, delay = 0, className }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.3 }}
      className={cn("bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-2xl p-5 hover:border-[var(--sf-border2)] transition-colors group", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-[10px] font-semibold text-[var(--sf-text3)] uppercase tracking-widest">{label}</div>
        {icon && <div className="text-[var(--sf-text3)] group-hover:text-[var(--sf-text2)] transition-colors">{icon}</div>}
      </div>
      <div className={cn("text-3xl font-display font-bold leading-none", accent ? "text-[var(--sf-accent2)]" : "text-[var(--sf-text)]")}>{value}</div>
      {sub && <div className="text-xs text-[var(--sf-text2)] mt-2">{sub}</div>}
    </motion.div>
  );
}
