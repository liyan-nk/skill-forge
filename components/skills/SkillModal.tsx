"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/shared/Modal";
import { useStore } from "@/store";
import { SKILL_COLORS, CATEGORIES, DIFFICULTIES } from "@/types";
import { toast } from "@/components/shared/Toast";
import type { Skill } from "@/types";

const schema = z.object({
  title: z.string().min(1, "Required").max(60),
  description: z.string().max(200).optional(),
  category: z.string(),
  difficulty: z.enum(["Beginner","Intermediate","Advanced"]),
  color: z.string(),
});
type FormData = z.infer<typeof schema>;
interface Props { onClose: () => void; skill?: Skill; }

export function SkillModal({ onClose, skill }: Props) {
  const { addSkill, updateSkill } = useStore();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: skill?.title ?? "", description: skill?.description ?? "", category: skill?.category ?? "Technology", difficulty: skill?.difficulty ?? "Beginner", color: skill?.color ?? SKILL_COLORS[0] },
  });
  const selectedColor = watch("color");

  function onSubmit(data: FormData) {
    if (skill) { updateSkill(skill.id, { description: data.description ?? "", ...data, category: data.category as any }); toast("Skill updated ✓"); }
    else { addSkill({ ...data, description: data.description ?? "", category: data.category as any }); toast("Skill created! 🎉"); }
    onClose();
  }

  return (
    <Modal open title={skill ? "Edit Skill" : "New Skill"} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--sf-text2)] mb-1.5">Skill name *</label>
          <input {...register("title")} placeholder="e.g. TypeScript, Piano, Spanish…" autoFocus
            className="w-full bg-[var(--sf-bg3)] border border-[var(--sf-border2)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--sf-accent)] transition-colors placeholder:text-[var(--sf-text3)]" />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--sf-text2)] mb-1.5">Description <span className="text-[var(--sf-text3)]">(optional)</span></label>
          <textarea {...register("description")} placeholder="What's your goal with this skill?" rows={2}
            className="w-full bg-[var(--sf-bg3)] border border-[var(--sf-border2)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--sf-accent)] transition-colors resize-none placeholder:text-[var(--sf-text3)]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--sf-text2)] mb-1.5">Category</label>
            <select {...register("category")} className="w-full bg-[var(--sf-bg3)] border border-[var(--sf-border2)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--sf-accent)] transition-colors">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--sf-text2)] mb-1.5">Difficulty</label>
            <select {...register("difficulty")} className="w-full bg-[var(--sf-bg3)] border border-[var(--sf-border2)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--sf-accent)] transition-colors">
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--sf-text2)] mb-2">Color theme</label>
          <div className="flex gap-2 flex-wrap">
            {SKILL_COLORS.map(c => (
              <button key={c} type="button" onClick={() => setValue("color", c)}
                className="w-7 h-7 rounded-full transition-all hover:scale-110"
                style={{ background: c, transform: selectedColor === c ? "scale(1.25)" : undefined, boxShadow: selectedColor === c ? `0 0 0 2px var(--sf-bg2), 0 0 0 3px ${c}` : undefined }} />
            ))}
          </div>
        </div>
        <div className="h-0.5 rounded-full" style={{ background: selectedColor }} />
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm border border-[var(--sf-border2)] text-[var(--sf-text2)] hover:bg-[var(--sf-bg3)] transition-all">Cancel</button>
          <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: selectedColor }}>
            {skill ? "Save changes" : "Create skill"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
