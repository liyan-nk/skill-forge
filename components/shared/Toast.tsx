"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";
interface Toast { id: string; message: string; type: ToastType; }
let _add: (msg: string, type?: ToastType) => void = () => {};
export function toast(message: string, type: ToastType = "success") { _add(message, type); }

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    _add = (message, type = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
    };
  }, []);
  const icons = { success: CheckCircle, error: AlertCircle, info: Info };
  const colors = { success: "text-[var(--sf-green)]", error: "text-red-400", info: "text-[var(--sf-accent2)]" };
  return (
    <div className="fixed top-5 right-5 z-[1000] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => {
          const Icon = icons[t.type];
          return (
            <motion.div key={t.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
              className="flex items-center gap-3 bg-[var(--sf-bg2)] border border-[var(--sf-border2)] rounded-xl px-4 py-3 shadow-2xl max-w-xs pointer-events-auto">
              <Icon size={15} className={colors[t.type]} />
              <span className="text-sm">{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
