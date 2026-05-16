"use client";
import { cn } from "@/lib/utils";
interface Props { children: React.ReactNode; color?: string; className?: string; }
export function Badge({ children, color, className }: Props) {
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--sf-bg4)] text-[var(--sf-text2)]", className)}
      style={color ? { background: color + "22", color } : undefined}>
      {children}
    </span>
  );
}
