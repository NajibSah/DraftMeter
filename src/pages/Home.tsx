import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Zap, TrendingUp, Search, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1 text-sm font-medium text-stone-500 shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            AI-Powered Writing Maturity Scale
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-6xl font-bold tracking-tighter sm:text-7xl md:text-8xl leading-tight"
          >
            Measure the weight of your words.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-stone-600 sm:text-xl"
          >
            DraftMeter evaluates your writing in real-time. Go beyond grammar to understand flow, structural maturity, and clarity with our proprietary maturity algorithm.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link 
              to="/editor" 
              className="group flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-stone-800 hover:shadow-lg sm:px-12"
            >
              Start Drafting
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              to="/how-to" 
              className="flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-8 py-4 text-lg font-bold text-stone-900 transition-all hover:bg-stone-50 sm:px-12"
            >
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-stone-200/50 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features Section */}
      <section className="bg-white py-24 px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-5xl">The Science of Drafting</h2>
            <p className="mx-auto max-w-2xl text-stone-500 text-lg">We don't just count words. We measure the evolution of your ideas from sketch to masterpiece.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <TrendingUp className="h-6 w-6 text-emerald-500" />,
                title: "Maturity Scoring",
                desc: "A composite metric that tracks the structural development of your draft as you write."
              },
              {
                icon: <Search className="h-6 w-6 text-blue-500" />,
                title: "Structural Density",
                desc: "Evaluates sentence variation and paragraph flow to ensure your writing remains engaging."
              },
              {
                icon: <Sparkles className="h-6 w-6 text-amber-500" />,
                title: "AI Deep Critique",
                desc: "Get professional-level feedback on clarity and tone using the power of Gemini AI."
              },
              {
                icon: <Zap className="h-6 w-6 text-yellow-500" />,
                title: "Real-time Metrics",
                desc: "Instant feedback on word count, reading time, and complexity without page refreshes."
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-indigo-500" />,
                title: "Privacy First",
                desc: "Your drafts remain yours. We don't store your text unless you choose to save it."
              },
              {
                icon: <ArrowRight className="h-6 w-6 text-stone-400" />,
                title: "Export Ready",
                desc: "Once your meter hits 100%, your draft is ready for professional publication."
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="group flex flex-col gap-4 rounded-3xl border border-stone-100 p-8 transition-all hover:border-stone-200 hover:shadow-xl hover:shadow-stone-200/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-50 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold tracking-tight">{feature.title}</h3>
                <p className="text-stone-500 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-stone-50 py-24 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-[4rem] bg-stone-900 px-12 py-20 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">Master your craft.</h2>
              <p className="mx-auto mb-10 max-w-2xl text-xl text-stone-400">Join thousands of writers who use DraftMeter to perfect their professional correspondence and creative writing.</p>
              <Link 
                to="/editor?sample=true" 
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-10 py-5 text-xl font-bold text-stone-900 transition-all hover:bg-stone-100 active:scale-95"
              >
                Load Sample Now
                <ArrowRight className="h-6 w-6" />
              </Link>
            </div>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-400 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
