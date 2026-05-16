export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Category =
  | "Technology"
  | "Music"
  | "Language"
  | "Art"
  | "Fitness"
  | "Business"
  | "Science"
  | "Writing"
  | "Other";

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  color: string;
  streak: number;
  longestStreak: number;
  createdAt: string;
}

export interface Log {
  id: string;
  skillId: string;
  what: string;
  minutes: number;
  proof: string;
  mood: number; // 1–5
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface TimerSession {
  id: string;
  skillId?: string;
  durationMinutes: number;
  completedAt: string;
}

export interface AppState {
  skills: Skill[];
  logs: Log[];
  timerSessions: TimerSession[];
  theme: "dark" | "light" | "system";
  hasOnboarded: boolean;
}

export type Page =
  | "dashboard"
  | "skills"
  | "logs"
  | "analytics"
  | "timer"
  | "landing"
  | "onboarding";

export const SKILL_COLORS = [
  "#6c5ce7",
  "#00b894",
  "#fdcb6e",
  "#d63031",
  "#00cec9",
  "#fd79a8",
  "#74b9ff",
  "#e17055",
  "#a29bfe",
  "#55efc4",
] as const;

export const CATEGORIES: Category[] = [
  "Technology",
  "Music",
  "Language",
  "Art",
  "Fitness",
  "Business",
  "Science",
  "Writing",
  "Other",
];

export const DIFFICULTIES: Difficulty[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

export const MOTIVATIONAL_QUOTES = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
  },
  {
    text: "We are what we repeatedly do. Excellence is not an act but a habit.",
    author: "Aristotle",
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
  },
  {
    text: "What you do every day matters more than what you do once in a while.",
    author: "Gretchen Rubin",
  },
  {
    text: "Mastery is not a function of genius; it's a function of time and intense focus.",
    author: "Robert Greene",
  },
  {
    text: "A little progress each day adds up to big results.",
    author: "Satya Nani",
  },
  {
    text: "The difference between who you are and who you want to be is what you do.",
    author: "Unknown",
  },
  {
    text: "Discipline is the bridge between goals and accomplishment.",
    author: "Jim Rohn",
  },
];
