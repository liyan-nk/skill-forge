"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useStore } from "@/store";
import { SkillCard } from "./SkillCard";
import { SkillModal } from "./SkillModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { ToastContainer } from "@/components/shared/Toast";

export function SkillsPage() {
  const skills = useStore(s => s.skills);
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl">My Skills</h1>
          <p className="text-sm text-[var(--sf-text2)] mt-0.5">{skills.length} skill{skills.length !== 1 ? "s" : ""} tracked</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[var(--sf-accent)] hover:bg-[var(--sf-accent3)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]">
          <Plus size={15} /> Add skill
        </button>
      </div>

      {skills.length === 0 ? (
        <EmptyState icon="⚡" title="No skills tracked yet" description="Add your first skill and start building consistency one day at a time."
          action={<button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[var(--sf-accent)] text-white px-4 py-2 rounded-xl text-sm font-medium"><Plus size={14} /> Add first skill</button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, i) => <SkillCard key={skill.id} skill={skill} index={i} />)}
        </div>
      )}

      {showModal && <SkillModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
