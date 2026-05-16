"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({ open, onClose, title, children, size = "md" }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  const maxW = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" }[size];
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }} transition={{ type: "spring", damping: 28, stiffness: 380 }}
            className={cn("relative w-full bg-[var(--sf-bg2)] border border-[var(--sf-border2)] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto", maxW)}>
            <div className="flex items-center justify-between p-5 pb-0">
              <h2 className="font-display font-bold text-lg">{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--sf-bg3)] text-[var(--sf-text3)] hover:text-[var(--sf-text)] transition-colors"><X size={16} /></button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
