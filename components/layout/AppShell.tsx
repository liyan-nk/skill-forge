"use client";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { SkillsPage } from "@/components/skills/SkillsPage";
import { LogsPage } from "@/components/logs/LogsPage";
import { AnalyticsPage } from "@/components/analytics/AnalyticsPage";
import { TimerPage } from "@/components/timer/TimerPage";
import { FloatingActionButton } from "@/components/shared/FloatingActionButton";
import { ToastContainer } from "@/components/shared/Toast";
import type { Page } from "@/types";

interface Props {
  onBackToLanding: () => void;
}

export function AppShell({ onBackToLanding }: Props) {
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageLabels: Record<Page, string> = {
    dashboard: "Dashboard",
    skills: "Skills",
    logs: "Activity Log",
    analytics: "Analytics",
    timer: "Focus Timer",
    landing: "Home",
    onboarding: "Onboarding",
  };

  return (
    <div className="flex min-h-screen bg-[var(--sf-bg)]">
      <ToastContainer />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-[150] lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        currentPage={page}
        onNavigate={(p) => { setPage(p); setSidebarOpen(false); }}
        onBackToLanding={onBackToLanding}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-[240px]">
        {/* Topbar */}
        <header className="h-14 bg-[var(--sf-bg2)] border-b border-[var(--sf-border)] flex items-center px-5 gap-3 sticky top-0 z-[100]">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--sf-bg3)] text-[var(--sf-text2)] transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="font-display font-bold text-base">{pageLabels[page]}</span>
          <div className="ml-auto flex items-center gap-3">
            {/* Back to landing — visible on desktop topbar too */}
            <button
              onClick={onBackToLanding}
              className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--sf-text3)] hover:text-[var(--sf-text2)] transition-colors px-3 py-1.5 rounded-full hover:bg-[var(--sf-bg3)] border border-transparent hover:border-[var(--sf-border)]"
            >
              ← Back to home
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--sf-text3)] bg-[var(--sf-bg3)] px-3 py-1.5 rounded-full border border-[var(--sf-border)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--sf-green)] animate-pulse" />
              All data saved locally
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-6 max-w-[1100px] w-full mx-auto">
          {page === "dashboard"  && <Dashboard />}
          {page === "skills"     && <SkillsPage />}
          {page === "logs"       && <LogsPage />}
          {page === "analytics"  && <AnalyticsPage />}
          {page === "timer"      && <TimerPage />}
        </main>
      </div>

      <FloatingActionButton currentPage={page} />
    </div>
  );
}
