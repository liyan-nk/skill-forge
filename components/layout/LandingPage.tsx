"use client";
import { motion } from "framer-motion";
import { ArrowRight, Flame, BarChart2, Calendar, Clock, Moon, Zap } from "lucide-react";
import { LandingHeatmap } from "@/components/shared/LandingHeatmap";

interface Props { onGetStarted: () => void; onDemo: () => void; }

const features = [
  { icon: Flame,     title: "Streak Tracking",  desc: "Build unstoppable momentum. Streaks are visible, celebrated, and psychologically wired to keep you going." },
  { icon: BarChart2, title: "Visual Analytics", desc: "Beautiful charts showing consistency, time invested, and skill growth. See exactly how you improve." },
  { icon: Calendar,  title: "Activity Heatmap", desc: "A GitHub-style heatmap reveals your consistency patterns at a glance. Every logged day is a win." },
  { icon: Zap,       title: "Daily Logging",    desc: "Log what you worked on, your mood, proof notes, and time spent. Every session builds the picture." },
  { icon: Clock,     title: "Focus Timer",      desc: "Built-in Pomodoro timer for deep work sessions. Stay locked in, distraction-free." },
  { icon: Moon,      title: "Dark & Light",     desc: "Crafted for extended use. Both themes are premium, readable, and easy on the eyes." },
];
const stats = [
  { num: "21",  label: "Days to build a habit" },
  { num: "1%",  label: "Daily gains = 37× in a year" },
  { num: "10k", label: "Hours to master any skill" },
  { num: "∞",   label: "Compounding potential" },
];

export function LandingPage({ onGetStarted, onDemo }: Props) {
  return (
    <div className="min-h-screen bg-[var(--sf-bg)] text-[var(--sf-text)]">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[var(--sf-border)] max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--sf-accent)] to-[var(--sf-accent3)] flex items-center justify-center">
            <Flame size={15} className="text-white" />
          </div>
          <span className="font-display font-bold text-base">SkillForge</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onDemo} className="text-sm text-[var(--sf-text2)] hover:text-[var(--sf-text)] transition-colors px-4 py-2 rounded-lg hover:bg-[var(--sf-bg3)]">View demo</button>
          <button onClick={onGetStarted} className="text-sm bg-[var(--sf-accent)] hover:bg-[var(--sf-accent3)] text-white px-4 py-2 rounded-lg font-medium transition-colors">Get started free</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 pt-24 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full border border-[var(--sf-accent)]/40 bg-[var(--sf-accent)]/10 text-[var(--sf-accent2)] mb-8">✦ Track · Build · Master</span>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-6 gradient-text">Build skills with<br />ruthless consistency</h1>
          <p className="text-lg text-[var(--sf-text2)] leading-relaxed max-w-lg mx-auto mb-10">SkillForge turns daily practice into visible progress. Track what you learn, streak what matters, and watch your growth compound.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button onClick={onGetStarted} className="flex items-center gap-2 bg-[var(--sf-accent)] hover:bg-[var(--sf-accent3)] text-white px-7 py-3.5 rounded-xl font-semibold text-base transition-all hover:scale-[1.02]">Start for free <ArrowRight size={16} /></button>
            <button onClick={onDemo} className="px-7 py-3.5 rounded-xl text-base font-medium text-[var(--sf-text2)] border border-[var(--sf-border2)] hover:bg-[var(--sf-bg3)] hover:text-[var(--sf-text)] transition-all">View demo →</button>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl mx-auto px-8 mb-24">
        <div className="bg-[var(--sf-bg2)] border border-[var(--sf-border2)] rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[var(--sf-border)]">
            <div className="w-3 h-3 rounded-full bg-red-500/70" /><div className="w-3 h-3 rounded-full bg-amber-500/70" /><div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs text-[var(--sf-text3)]">skillforge.app/dashboard</span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[{label:"Best Streak",value:"🔥 14",sub:"days",color:"text-amber-400"},{label:"Skills",value:"4",sub:"tracked",color:"text-[var(--sf-accent2)]"},{label:"This Week",value:"11.2h",sub:"invested",color:"text-emerald-400"}].map(s=>(
                <div key={s.label} className="bg-[var(--sf-bg3)] rounded-xl p-4">
                  <div className="text-xs text-[var(--sf-text3)] uppercase tracking-wider mb-2">{s.label}</div>
                  <div className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-[var(--sf-text2)] mt-1">{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="bg-[var(--sf-bg3)] rounded-xl p-4">
              <div className="text-xs text-[var(--sf-text3)] uppercase tracking-wider mb-3">Activity Heatmap</div>
              <LandingHeatmap />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-8 mb-24">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">Everything you need to grow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f,i)=>(
            <motion.div key={f.title} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} transition={{delay:i*0.06}} viewport={{once:true}}
              className="bg-[var(--sf-bg2)] border border-[var(--sf-border)] rounded-xl p-6 hover:border-[var(--sf-border2)] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[var(--sf-accent)]/10 flex items-center justify-center mb-4"><f.icon size={18} className="text-[var(--sf-accent2)]" /></div>
              <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
              <p className="text-xs text-[var(--sf-text2)] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--sf-bg2)] border-y border-[var(--sf-border)] py-16 mb-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="font-display text-3xl font-bold text-center mb-10">Why consistency compounds</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(s=>(
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl font-bold text-[var(--sf-accent2)] mb-2">{s.num}</div>
                <div className="text-sm text-[var(--sf-text2)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-20 text-center">
        <h2 className="font-display text-4xl font-bold mb-4 gradient-text">Start building today.</h2>
        <p className="text-[var(--sf-text2)] mb-8">Free forever. No account needed. Your data stays on your device.</p>
        <button onClick={onGetStarted} className="flex items-center gap-2 mx-auto bg-[var(--sf-accent)] hover:bg-[var(--sf-accent3)] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all hover:scale-[1.02]">
          Launch SkillForge <ArrowRight size={16} />
        </button>
      </div>

      <div className="border-t border-[var(--sf-border)] py-6 px-8 flex items-center justify-between text-xs text-[var(--sf-text3)] max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--sf-accent)] to-[var(--sf-accent3)] flex items-center justify-center"><Flame size={10} className="text-white" /></div>
          SkillForge
        </div>
        <div>Built for learners who mean business.</div>
      </div>
    </div>
  );
}
