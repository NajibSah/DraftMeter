import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Zap, Target, BookOpen } from "lucide-react";

export default function HowTo() {
  const steps = [
    {
      title: "1. Paste your Draft",
      description: "Start by pasting your text into the minimalist editor. We support everything from short emails to long-form essays.",
      icon: <Zap className="h-6 w-6 text-yellow-500" />
    },
    {
      title: "2. Watch the Meter",
      description: "As you write, the Maturity Score and real-time metrics update instantly. Watch for suggestions on balance and structure.",
      icon: <Target className="h-6 w-6 text-red-500" />
    },
    {
      title: "3. AI Deep Critique",
      description: "When your draft feels ready, trigger the AI analysis for a detailed critique on clarity, tone, and specific refinements.",
      icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />
    },
    {
      title: "4. Refine & Export",
      description: "Follow the AI suggestions to polish your draft till you hit that perfect 100% maturity score.",
      icon: <BookOpen className="h-6 w-6 text-blue-500" />
    }
  ];

  return (
    <div className="bg-stone-50 min-h-screen py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-20 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl">How it Works</h1>
          <p className="mx-auto max-w-2xl text-xl text-stone-500">Mastering the DraftMeter workflow is the first step toward clearer, more professional writing.</p>
        </div>

        <div className="space-y-12">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-8 md:flex-row md:items-center bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] bg-stone-50 shadow-inner">
                {step.icon}
              </div>
              <div className="flex-1">
                <h3 className="mb-3 text-2xl font-bold tracking-tight">{step.title}</h3>
                <p className="text-stone-500 text-lg leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 rounded-[4rem] bg-white border border-stone-200 p-16 text-center shadow-2xl">
          <h2 className="mb-8 text-3xl font-bold tracking-tight">Ready to see it in action?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/editor" 
              className="group flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-10 py-5 text-xl font-bold text-white transition-all hover:bg-stone-800"
            >
              Launch Editor
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
