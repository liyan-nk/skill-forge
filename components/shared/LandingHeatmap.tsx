"use client";
import { useMemo } from "react";
export function LandingHeatmap() {
  const cols = useMemo(() => {
    const all: number[] = [];
    for (let i = 0; i < 91; i++) all.push(Math.random() < 0.65 ? Math.floor(Math.random() * 4) + 1 : 0);
    const c: number[][] = [];
    for (let i = 0; i < all.length; i += 7) c.push(all.slice(i, i + 7));
    return c;
  }, []);
  const lc = ["bg-[var(--sf-bg4)]","bg-[var(--sf-accent)]/20","bg-[var(--sf-accent)]/45","bg-[var(--sf-accent)]/70","bg-[var(--sf-accent)]"];
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {cols.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-1">
          {col.map((v, ri) => <div key={ri} className={`w-3 h-3 rounded-sm ${lc[v]}`} />)}
        </div>
      ))}
    </div>
  );
}
