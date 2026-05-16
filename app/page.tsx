"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { LandingPage } from "@/components/layout/LandingPage";
import { OnboardingFlow } from "@/components/layout/OnboardingFlow";
import { AppShell } from "@/components/layout/AppShell";
import { generateDemoData } from "@/lib/demo";

type View = "landing" | "onboarding" | "app";

export default function Home() {
  const { hasOnboarded, recalcStreaks, clearData } = useStore();
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<View>("landing");

  useEffect(() => {
    setMounted(true);
    if (hasOnboarded) {
      const store = useStore.getState();
      if (store.skills.length === 0 && store.logs.length === 0) {
        const { skills: ds, logs: dl } = generateDemoData();
        useStore.setState({ skills: ds, logs: dl });
        setTimeout(() => recalcStreaks(), 50);
      }
      setView("app");
    }
  }, [hasOnboarded, recalcStreaks]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--sf-bg)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--sf-accent)] to-[var(--sf-accent3)] animate-pulse" />
      </div>
    );
  }

  function handleDemo() {
    const store = useStore.getState();
    if (store.skills.length === 0) {
      const { skills: ds, logs: dl } = generateDemoData();
      useStore.setState({ skills: ds, logs: dl, hasOnboarded: true });
      setTimeout(() => recalcStreaks(), 50);
    } else {
      useStore.setState({ hasOnboarded: true });
    }
    setView("app");
  }

  function handleBackToLanding() {
    setView("landing");
  }

  function handleGetStarted() {
    clearData(); // This wipes the 4 demo skills immediately
    setView("onboarding");
  }

  if (view === "landing") return (
    <LandingPage
      onGetStarted={() => setView("onboarding")}
      onDemo={handleDemo}
    />
  );

  if (view === "onboarding") return (
    <OnboardingFlow onComplete={() => setView("app")} />
  );

  return <AppShell onBackToLanding={handleBackToLanding} />;
}
