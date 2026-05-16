# SkillForge 🔥

A beautifully designed personal skill tracking app focused on consistency, streaks, and visible growth.

## Features

- **Skill Management** — Add, edit, delete skills with color themes, categories & difficulty
- **Daily Session Logging** — Log what you worked on, time spent, mood rating & proof notes
- **Streak Tracking** — Auto-calculated streaks that update with every log
- **Activity Heatmap** — GitHub-style calendar showing 20+ weeks of consistency
- **Visual Analytics** — Area charts, bar charts, skill time breakdowns, focus distribution
- **Focus Timer** — Built-in Pomodoro timer with session tracking
- **Dark / Light Mode** — Premium themes with system detection
- **100% Local** — All data stored in localStorage, no account needed

## Tech Stack

- **Next.js 15** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — smooth animations
- **Zustand** — state management with localStorage persistence
- **React Hook Form** + **Zod** — form validation
- **Recharts** — beautiful charts
- **Radix UI / shadcn** — accessible UI primitives
- **next-themes** — dark/light mode

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start
```

### Deploy to Vercel

```bash
npx vercel deploy
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

## Project Structure

```
skillforge/
├── app/
│   ├── globals.css          # Design tokens & global styles
│   ├── layout.tsx           # Root layout with theme provider
│   └── page.tsx             # Entry point (landing/onboarding/app routing)
├── components/
│   ├── layout/              # AppShell, Sidebar, LandingPage, OnboardingFlow, ThemeProvider
│   ├── dashboard/           # Dashboard with stats, charts, heatmap
│   ├── skills/              # SkillCard, SkillModal, SkillsPage
│   ├── logs/                # LogModal, LogsPage
│   ├── analytics/           # AnalyticsPage with Recharts
│   ├── timer/               # Focus timer with SVG ring
│   └── shared/              # Modal, Toast, StatCard, Heatmap, EmptyState, Badge, ProgressBar, FAB
├── hooks/
│   └── index.ts             # useDashboardStats, useWeeklyChartData, useHeatmapData, etc.
├── lib/
│   ├── utils.ts             # cn(), formatDate(), totalMinutes(), heatLevel(), etc.
│   └── demo.ts              # Demo data seeder
├── store/
│   └── index.ts             # Zustand store with localStorage persistence
└── types/
    └── index.ts             # TypeScript types: Skill, Log, TimerSession, etc.
```

## Data Model

```typescript
interface Skill {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  color: string;
  streak: number;
  longestStreak: number;
  createdAt: string;
}

interface Log {
  id: string;
  skillId: string;
  what: string;
  minutes: number;
  proof: string;
  mood: number; // 1-5
  date: string; // YYYY-MM-DD
  createdAt: string;
}
```

All data persists in `localStorage` under the key `skillforge-storage`.
