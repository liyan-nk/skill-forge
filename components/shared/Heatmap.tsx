"use client";
import { useMemo, useState } from "react";
import { getHeatmapDates, heatLevel, formatDate } from "@/lib/utils";
interface Props { counts: Record<string, number>; weeks?: number; }
export function Heatmap({ counts, weeks = 20 }: Props) {
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);
  const dates = useMemo(() => getHeatmapDates(weeks), [weeks]);
  const max = useMemo(() => Math.max(1, ...Object.values(counts)), [counts]);
  const cols: string[][] = [];
  let col: string[] = [];
  dates.forEach((d, i) => {
    if (new Date(d + "T00:00:00").getDay() === 0 && i > 0) { cols.push(col); col = []; }
    col.push(d);
  });
  if (col.length) cols.push(col);
  const lc = ["heat-0","heat-1","heat-2","heat-3","heat-4"];
  return (
    <div className="relative">
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {cols.map((week, ci) => (
          <div key={ci} className="flex flex-col gap-[3px]">
            {week.map((date) => {
              const count = counts[date] || 0;
              const level = heatLevel(count, max);
              return (
                <div key={date} className={`heatmap-cell ${lc[level]}`}
                  onMouseEnter={(e) => { const r = e.currentTarget.getBoundingClientRect(); setTooltip({ date, count, x: r.left + r.width / 2, y: r.top }); }}
                  onMouseLeave={() => setTooltip(null)} />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2 justify-end">
        <span className="text-[10px] text-[var(--sf-text3)]">Less</span>
        {lc.map((c, i) => <div key={i} className={`w-2.5 h-2.5 rounded-sm ${c}`} />)}
        <span className="text-[10px] text-[var(--sf-text3)]">More</span>
      </div>
      {tooltip && (
        <div className="fixed z-50 pointer-events-none -translate-x-1/2 bg-[var(--sf-bg4)] border border-[var(--sf-border2)] rounded-lg px-2.5 py-1.5 text-xs shadow-xl whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y - 40 }}>
          <span className="font-medium">{formatDate(tooltip.date)}</span>
          <span className="text-[var(--sf-text2)] ml-1.5">{tooltip.count} session{tooltip.count !== 1 ? "s" : ""}</span>
        </div>
      )}
    </div>
  );
}
