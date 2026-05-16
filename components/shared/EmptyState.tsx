"use client";
import { motion } from "framer-motion";
interface Props { icon: string; title: string; description: string; action?: React.ReactNode; }
export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="text-5xl opacity-30">{icon}</div>
      <h3 className="text-base font-semibold text-[var(--sf-text2)]">{title}</h3>
      <p className="text-sm text-[var(--sf-text3)] max-w-xs">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
