import { Search, PenTool, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="bg-stone-50 min-h-screen py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <section className="text-center mb-20">
          <h1 className="text-5xl font-bold tracking-tight mb-6">About DraftMeter</h1>
          <p className="text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed">
            We believe that every writer deserves an objective mirror for their draft. DraftMeter was built to bridge the gap between human intuition and structural precision.
          </p>
        </section>

        <div className="grid gap-8 md:grid-cols-2 mb-20">
          <div className="bg-white p-10 rounded-[3rem] border border-stone-200">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-stone-600 leading-relaxed">
              To empower professional writers, students, and creators with real-time feedback that focuses on the "maturity" of a draft—evaluating flow, density, and structure rather than just grammar.
            </p>
          </div>
          <div className="bg-white p-10 rounded-[3rem] border border-stone-200">
            <h2 className="text-2xl font-bold mb-4">AI Integration</h2>
            <p className="text-stone-600 leading-relaxed">
              By utilizing the latest Gemini AI models, we provide deep structural critiques that were previously only available from professional human editors.
            </p>
          </div>
        </div>

        <section className="bg-stone-900 rounded-[4rem] p-12 text-white">
          <div className="grid gap-12 md:grid-cols-3 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10k+</div>
              <div className="text-stone-400 text-sm uppercase tracking-widest font-bold">Drafts Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">AI-Driven</div>
              <div className="text-stone-400 text-sm uppercase tracking-widest font-bold">Evaluation</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-stone-400 text-sm uppercase tracking-widest font-bold">Privacy Focused</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
