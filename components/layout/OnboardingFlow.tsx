"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ArrowRight, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useStore } from "@/store";
import { SKILL_COLORS, CATEGORIES } from "@/types";
import { generateDemoData } from "@/lib/demo";

const schema = z.object({ title: z.string().min(1,"Required").max(60), category: z.string(), difficulty: z.enum(["Beginner","Intermediate","Advanced"]), color: z.string() });
type FormData = z.infer<typeof schema>;
interface Props { onComplete: () => void; }

export function OnboardingFlow({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const { addSkill, completeOnboarding, recalcStreaks } = useStore();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title:"", category:"Technology", difficulty:"Beginner", color: SKILL_COLORS[0] },
  });
  const selectedColor = watch("color");
  const selectedDiff = watch("difficulty");

  function finish(data?: FormData) {
    if (data) addSkill({ title:data.title, description:"", category:data.category as any, difficulty:data.difficulty, color:data.color });
    completeOnboarding(); recalcStreaks(); onComplete();
  }
  function loadDemo() {
    const { skills:ds, logs:dl } = generateDemoData();
    useStore.setState({ skills:ds, logs:dl });
    completeOnboarding();
    setTimeout(() => recalcStreaks(), 100);
    onComplete();
  }

  return (
    <div className="min-h-screen bg-[var(--sf-bg)] flex items-center justify-center p-6">
      <div className="bg-[var(--sf-bg2)] border border-[var(--sf-border2)] rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--sf-accent)] to-[var(--sf-accent3)] flex items-center justify-center">
            <Flame size={13} className="text-white" />
          </div>
          <span className="font-display font-bold text-sm">SkillForge</span>
          <div className="ml-auto flex gap-1">
            {[0,1].map(i=><div key={i} className={`h-1 w-6 rounded-full transition-all ${i===step?"bg-[var(--sf-accent)]":"bg-[var(--sf-bg4)]"}`}/>)}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="s0" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="text-center">
              <div className="text-6xl mb-6">🔥</div>
              <h1 className="font-display text-3xl font-bold mb-3">Welcome to SkillForge</h1>
              <p className="text-[var(--sf-text2)] text-sm leading-relaxed mb-8">Your personal skill tracking companion. Build streaks, visualize progress, and stay consistent.</p>
              <button onClick={() => setStep(1)} className="w-full flex items-center justify-center gap-2 bg-[var(--sf-accent)] hover:bg-[var(--sf-accent3)] text-white py-3 rounded-xl font-semibold transition-all">
                Let's get started <ArrowRight size={15}/>
              </button>
              <button onClick={loadDemo} className="w-full mt-3 text-sm text-[var(--sf-text3)] hover:text-[var(--sf-text2)] py-2 transition-colors">Load demo data instead</button>
            </motion.div>
          ) : (
            <motion.div key="s1" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}>
              <h2 className="font-display text-xl font-bold mb-1">Add your first skill</h2>
              <p className="text-[var(--sf-text2)] text-xs mb-5">What do you want to track and improve consistently?</p>
              <form onSubmit={handleSubmit(finish)} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--sf-text2)] mb-1.5">Skill name *</label>
                  <input {...register("title")} placeholder="e.g. JavaScript, Piano, Running…" autoFocus
                    className="w-full bg-[var(--sf-bg3)] border border-[var(--sf-border2)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--sf-accent)] transition-colors placeholder:text-[var(--sf-text3)]"/>
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--sf-text2)] mb-1.5">Category</label>
                  <select {...register("category")} className="w-full bg-[var(--sf-bg3)] border border-[var(--sf-border2)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--sf-accent)] transition-colors">
                    {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--sf-text2)] mb-2">Difficulty</label>
                  <div className="flex gap-2">
                    {(["Beginner","Intermediate","Advanced"] as const).map(d=>(
                      <button key={d} type="button" onClick={()=>setValue("difficulty",d)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${selectedDiff===d?"bg-[var(--sf-accent)] border-[var(--sf-accent)] text-white":"border-[var(--sf-border2)] text-[var(--sf-text2)] hover:bg-[var(--sf-bg3)]"}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--sf-text2)] mb-2">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {SKILL_COLORS.map(c=>(
                      <button key={c} type="button" onClick={()=>setValue("color",c)}
                        className="w-7 h-7 rounded-full transition-all hover:scale-110"
                        style={{background:c, transform:selectedColor===c?"scale(1.25)":undefined, boxShadow:selectedColor===c?`0 0 0 2px var(--sf-bg2), 0 0 0 3px ${c}`:undefined}}/>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={()=>finish()} className="flex-1 py-2.5 rounded-xl text-sm border border-[var(--sf-border2)] text-[var(--sf-text2)] hover:bg-[var(--sf-bg3)] transition-all">Skip</button>
                  <button type="submit" className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--sf-accent)] hover:bg-[var(--sf-accent3)] text-white py-2.5 rounded-xl text-sm font-semibold transition-all">
                    <Plus size={14}/> Create skill
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
