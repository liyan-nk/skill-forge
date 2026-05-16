"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/shared/Modal";
import { useStore } from "@/store";
import { toast } from "@/components/shared/Toast";
import { today, moodEmoji } from "@/lib/utils";
import type { Log } from "@/types";

const schema = z.object({
  skillId: z.string().min(1, "Pick a skill"),
  what: z.string().min(1, "Describe what you worked on").max(500),
  minutes: z.coerce.number().min(1).max(600),
  date: z.string(),
  proof: z.string().max(300).optional(),
  mood: z.coerce.number().min(1).max(5),
});
type FormData = z.infer<typeof schema>;
interface Props { onClose: () => void; skillId?: string; log?: Log; }

export function LogModal({ onClose, skillId, log }: Props) {
  const { skills, addLog, updateLog } = useStore();
  const [mood, setMood] = useState(log?.mood ?? 3);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      skillId: log?.skillId ?? skillId ?? skills[0]?.id ?? "",
      what: log?.what ?? "",
      minutes: log?.minutes ?? 30,
      date: log?.date ?? today(),
      proof: log?.proof ?? "",
      mood: log?.mood ?? 3,
    },
  });

  function onSubmit(data: FormData) {
    if (log) { updateLog(log.id, { ...data, proof: data.proof ?? "" }); toast("Session updated ✓"); }
    else { addLog({ ...data, proof: data.proof ?? "" }); toast("Session logged! 💪"); }
    onClose();
  }

  if (skills.length === 0) return (
    <Modal open title="Log Session" onClose={onClose}>
      <p className="text-[var(--sf-text2)] text-sm text-center py-4">Add a skill first before logging a session.</p>
      <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-[var(--sf-border2)] text-sm text-[var(--sf-text2)] hover:bg-[var(--sf-bg3)] transition-all">Close</button>
    </Modal>
  );

  return (
    <Modal open title={log ? "Edit Session" : "Log a Session"} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--sf-text2)] mb-1.5">Skill *</label>
          <select {...register("skillId")} className="w-full bg-[var(--sf-bg3)] border border-[var(--sf-border2)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--sf-accent)] transition-colors">
            {skills.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--sf-text2)] mb-1.5">What did you work on? *</label>
          <textarea {...register("what")} placeholder="Describe what you practiced or learned…" rows={3} autoFocus
            className="w-full bg-[var(--sf-bg3)] border border-[var(--sf-border2)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--sf-accent)] transition-colors resize-none placeholder:text-[var(--sf-text3)]" />
          {errors.what && <p className="text-red-400 text-xs mt-1">{errors.what.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--sf-text2)] mb-1.5">Duration (minutes)</label>
            <input type="number" {...register("minutes")} min={1} max={600}
              className="w-full bg-[var(--sf-bg3)] border border-[var(--sf-border2)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--sf-accent)] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--sf-text2)] mb-1.5">Date</label>
            <input type="date" {...register("date")}
              className="w-full bg-[var(--sf-bg3)] border border-[var(--sf-border2)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--sf-accent)] transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--sf-text2)] mb-1.5">Proof / Notes <span className="text-[var(--sf-text3)]">(optional)</span></label>
          <input {...register("proof")} placeholder="Link, screenshot note, or evidence of progress…"
            className="w-full bg-[var(--sf-bg3)] border border-[var(--sf-border2)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--sf-accent)] transition-colors placeholder:text-[var(--sf-text3)]" />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--sf-text2)] mb-2">Mood & Focus</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button" onClick={() => { setMood(n); setValue("mood", n); }}
                className={`flex-1 py-2 rounded-xl text-lg transition-all ${mood === n ? "bg-[var(--sf-accent)]20 scale-105 ring-1 ring-[var(--sf-accent)]" : "bg-[var(--sf-bg3)] hover:bg-[var(--sf-bg4)]"}`}>
                {moodEmoji(n)}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[var(--sf-text3)] mt-1.5 text-center">
            {["","Tough session","Below average","Solid focus","Great flow","In the zone! 🔥"][mood]}
          </p>
        </div>

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm border border-[var(--sf-border2)] text-[var(--sf-text2)] hover:bg-[var(--sf-bg3)] transition-all">Cancel</button>
          <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-[var(--sf-accent)] hover:bg-[var(--sf-accent3)] text-white transition-all">
            {log ? "Save changes" : "Save session"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
