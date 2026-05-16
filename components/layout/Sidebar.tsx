"use client";
import { useTheme } from "next-themes";
import { Flame, LayoutDashboard, Star, FileText, BarChart2, Timer, Sun, Moon, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Page } from "@/types";
import { useStore } from "@/store";

const NAV = [
  { id:"dashboard" as Page, label:"Dashboard",    icon:LayoutDashboard },
  { id:"skills"    as Page, label:"Skills",       icon:Star },
  { id:"logs"      as Page, label:"Activity Log", icon:FileText },
  { id:"analytics" as Page, label:"Analytics",    icon:BarChart2 },
  { id:"timer"     as Page, label:"Focus Timer",  icon:Timer },
];

interface Props {
  currentPage: Page;
  onNavigate: (p: Page) => void;
  onBackToLanding: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentPage, onNavigate, onBackToLanding, isOpen, onClose }: Props) {
  const { theme, setTheme } = useTheme();
  const skills = useStore(s => s.skills);
  const logs = useStore(s => s.logs);
  const todayCount = logs.filter(l => l.date === new Date().toISOString().slice(0,10)).length;

  return (
    <aside className={cn(
      "fixed top-0 left-0 h-full w-[240px] bg-[var(--sf-bg2)] border-r border-[var(--sf-border)] flex flex-col z-[200] transition-transform duration-300 lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--sf-border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--sf-accent)] to-[var(--sf-accent3)] flex items-center justify-center flex-shrink-0">
            <Flame size={15} className="text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-sm leading-none">SkillForge</div>
            <div className="text-[10px] text-[var(--sf-text3)] mt-0.5">{skills.length} skills tracked</div>
          </div>
        </div>
        <button className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--sf-bg3)] text-[var(--sf-text3)]" onClick={onClose}>
          <X size={15} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] font-semibold text-[var(--sf-text3)] uppercase tracking-widest px-2 py-2">Menu</div>
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onNavigate(id)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all text-left relative",
              currentPage === id
                ? "bg-[var(--sf-accent)]/10 text-[var(--sf-accent2)] font-medium"
                : "text-[var(--sf-text2)] hover:bg-[var(--sf-bg3)] hover:text-[var(--sf-text)]"
            )}>
            {currentPage === id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[var(--sf-accent)] rounded-r-full" />
            )}
            <Icon size={15} className="flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {id === "logs" && todayCount > 0 && (
              <span className="text-[10px] bg-[var(--sf-accent)] text-white px-1.5 py-0.5 rounded-full font-bold">{todayCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[var(--sf-border)] space-y-1">
        {/* Theme toggle */}
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[var(--sf-text2)] hover:bg-[var(--sf-bg3)] hover:text-[var(--sf-text)] transition-all">
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          <div className={cn("ml-auto w-8 rounded-full border relative transition-all", theme === "dark" ? "bg-[var(--sf-bg4)] border-[var(--sf-border2)]" : "bg-[var(--sf-accent)] border-[var(--sf-accent)]")} style={{ height: 18 }}>
            <div className={cn("absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow transition-all", theme === "dark" ? "left-[2px]" : "left-[17px]")} />
          </div>
        </button>

        {/* Back to landing */}
        <button onClick={onBackToLanding}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[var(--sf-text3)] hover:bg-[var(--sf-bg3)] hover:text-[var(--sf-text2)] transition-all">
          <ArrowLeft size={15} />
          <span>Back to home</span>
        </button>
      </div>
    </aside>
  );
}
