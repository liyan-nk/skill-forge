"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, PlusCircle } from "lucide-react";
import { useStore } from "@/store";
import { LogModal } from "@/components/logs/LogModal";
import { ToastContainer, toast } from "@/components/shared/Toast";
import { today } from "@/lib/utils";

const DURATIONS = [
  { label: "15m",  mins: 15 },
  { label: "25m",  mins: 25 },
  { label: "45m",  mins: 45 },
  { label: "60m",  mins: 60 },
  { label: "90m",  mins: 90 },
];

const CIRCUMFERENCE = 2 * Math.PI * 90; // r=90

export function TimerPage() {
  const { timerSessions, addTimerSession } = useStore();
  const [duration, setDuration] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const todaySessions = timerSessions.filter(s => s.completedAt.startsWith(today())).length;

  const pct = seconds / (duration * 60);
  const offset = CIRCUMFERENCE * (1 - pct);
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
  }, []);

  const complete = useCallback(() => {
    stop();
    addTimerSession({ durationMinutes: duration, completedAt: new Date().toISOString() });
    toast(`Session complete! Great work 🎉`);
    setSeconds(duration * 60);
  }, [stop, addTimerSession, duration]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) { complete(); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, complete]);

  function toggleTimer() {
    if (running) { stop(); } else { setRunning(true); }
  }

  function reset() {
    stop();
    setSeconds(duration * 60);
  }

  function selectDuration(mins: number) {
    if (running) return;
    setDuration(mins);
    setSeconds(mins * 60);
  }

  return (
    <div>
      <ToastContainer />
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl">Focus Timer</h1>
        <p className="text-sm text-[var(--sf-text2)] mt-0.5">Deep work sessions · {todaySessions} completed today</p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Duration selector */}
        <div className="bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-2xl p-5 mb-4">
          <div className="text-[11px] font-semibold text-[var(--sf-text3)] uppercase tracking-widest mb-3">Session Duration</div>
          <div className="flex gap-2 flex-wrap">
            {DURATIONS.map(d => (
              <button key={d.mins} onClick={() => selectDuration(d.mins)} disabled={running}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${duration === d.mins ? "bg-[var(--sf-accent)] text-white" : "bg-[var(--sf-bg3)] text-[var(--sf-text2)] hover:bg-[var(--sf-bg4)] disabled:opacity-50 disabled:cursor-not-allowed"}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timer ring */}
        <div className="bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-2xl p-8 text-center mb-4">
          <div className="relative w-[200px] h-[200px] mx-auto mb-6">
            <svg width="200" height="200" viewBox="0 0 200 200" className="rotate-[-90deg]">
              {/* Track */}
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--sf-bg4)" strokeWidth="8" />
              {/* Progress */}
              <motion.circle cx="100" cy="100" r="90" fill="none"
                stroke="var(--sf-accent)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 0.5, ease: "linear" }}
                style={{ filter: running ? "drop-shadow(0 0 8px var(--sf-accent))" : "none" }} />
            </svg>
            {/* Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-5xl font-bold tracking-tight">{mins}:{secs}</div>
              <div className="text-xs text-[var(--sf-text3)] mt-1">
                {running ? "Focusing…" : seconds === duration * 60 ? "Ready" : "Paused"}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={reset} disabled={!running && seconds === duration * 60}
              className="w-11 h-11 rounded-full bg-[var(--sf-bg3)] border border-[var(--sf-border2)] flex items-center justify-center text-[var(--sf-text2)] hover:bg-[var(--sf-bg4)] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              <RotateCcw size={16} />
            </button>
            <button onClick={toggleTimer}
              className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-white text-lg transition-all hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg,var(--sf-accent),var(--sf-accent3))", boxShadow: "0 6px 24px rgba(108,92,231,0.45)" }}>
              {running ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" className="translate-x-0.5" />}
            </button>
            <button onClick={() => setShowLogModal(true)}
              className="w-11 h-11 rounded-full bg-[var(--sf-bg3)] border border-[var(--sf-border2)] flex items-center justify-center text-[var(--sf-text2)] hover:bg-[var(--sf-bg4)] transition-all">
              <PlusCircle size={16} />
            </button>
          </div>
          <p className="text-xs text-[var(--sf-text3)] mt-4">
            {running ? "Stay focused. You've got this." : "Press play to start your focus session"}
          </p>
        </div>

        {/* Today's sessions */}
        <div className="bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-2xl p-5">
          <div className="text-[11px] font-semibold text-[var(--sf-text3)] uppercase tracking-widest mb-3">Today's Sessions</div>
          {timerSessions.filter(s => s.completedAt.startsWith(today())).length === 0 ? (
            <div className="text-sm text-[var(--sf-text3)] text-center py-4">No sessions completed yet today</div>
          ) : (
            <div className="space-y-2">
              {timerSessions.filter(s => s.completedAt.startsWith(today())).reverse().map((s, i) => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-[var(--sf-border)] last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--sf-green)]" />
                    <span className="text-sm">Session {timerSessions.filter(ts => ts.completedAt.startsWith(today())).length - i}</span>
                  </div>
                  <span className="text-xs text-[var(--sf-text2)]">{s.durationMinutes} minutes</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showLogModal && <LogModal onClose={() => setShowLogModal(false)} />}
    </div>
  );
}
