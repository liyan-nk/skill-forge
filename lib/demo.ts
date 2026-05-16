import type { Skill, Log } from "@/types";
import { nanoid } from "@/lib/utils";

export function generateDemoData(): { skills: Skill[]; logs: Log[] } {
  const skills: Skill[] = [
    {
      id: nanoid(),
      title: "TypeScript",
      description: "Mastering advanced types, generics, and real-world patterns.",
      category: "Technology",
      difficulty: "Intermediate",
      color: "#74b9ff",
      streak: 0,
      longestStreak: 0,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: nanoid(),
      title: "Piano",
      description: "Classical pieces and jazz improvisation fundamentals.",
      category: "Music",
      difficulty: "Beginner",
      color: "#fd79a8",
      streak: 0,
      longestStreak: 0,
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
    {
      id: nanoid(),
      title: "Spanish",
      description: "Conversational fluency — B2 level by end of year.",
      category: "Language",
      difficulty: "Intermediate",
      color: "#00b894",
      streak: 0,
      longestStreak: 0,
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    },
    {
      id: nanoid(),
      title: "Running",
      description: "Training for a 10K. Building base mileage.",
      category: "Fitness",
      difficulty: "Beginner",
      color: "#fdcb6e",
      streak: 0,
      longestStreak: 0,
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
  ];

  const notesBySkill: Record<string, string[]> = {
    [skills[0].id]: [
      "Built a type-safe API client with generics",
      "Practiced conditional types and infer keyword",
      "Refactored a project to use strict mode",
      "Learned mapped types and template literals",
      "Solved 3 TypeScript challenges on exercism.io",
      "Studied utility types — Partial, Required, Pick",
      "Built a custom useLocalStorage hook with full types",
    ],
    [skills[1].id]: [
      "Practiced C major and G major scales",
      "Worked on chord transitions — C to F to G",
      "Learned the opening of Moonlight Sonata",
      "Practiced sight-reading new sheet music",
      "Studied music theory: intervals and triads",
      "Played Bach Minuet in G slowly, hands separate",
    ],
    [skills[2].id]: [
      "Duolingo + Anki flashcards review",
      "Watched an episode of 'Casa de Papel' in Spanish",
      "30min conversation with language exchange partner",
      "Practiced past tense conjugations",
      "Read a simple Spanish article, looked up vocab",
      "Grammar: ser vs estar deep dive",
    ],
    [skills[3].id]: [
      "Easy 3km recovery run",
      "5km at comfortable pace — 28 min",
      "Interval training: 6×400m",
      "Long run: 7km easy",
      "Stretching + foam rolling session",
      "Tempo run: 4km at 5:30/km pace",
    ],
  };

  const logs: Log[] = [];

  skills.forEach((skill) => {
    const notes = notesBySkill[skill.id] || [];
    let noteIdx = 0;
    for (let i = 28; i >= 0; i--) {
      // ~70% chance of logging
      if (Math.random() > 0.35 && noteIdx < notes.length) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        logs.push({
          id: nanoid(),
          skillId: skill.id,
          what: notes[noteIdx % notes.length],
          minutes: Math.floor(Math.random() * 60) + 20,
          proof: Math.random() > 0.6 ? "github.com/user/practice-repo" : "",
          mood: Math.floor(Math.random() * 2) + 3,
          date: d.toISOString().slice(0, 10),
          createdAt: d.toISOString(),
        });
        noteIdx++;
      }
    }
  });

  return { skills, logs };
}
