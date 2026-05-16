"use client";
interface Props { value: number; color?: string; className?: string; }
export function ProgressBar({ value, color, className }: Props) {
  return (
    <div className={`h-1.5 bg-[var(--sf-bg4)] rounded-full overflow-hidden ${className ?? ""}`}>
      <div className="h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color ?? "var(--sf-accent)" }} />
    </div>
  );
}
