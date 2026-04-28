import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Settings, 
  Sparkles, 
  Trash2, 
  Clock, 
  Maximize2, 
  Minimize2,
  CheckCircle2,
  Info,
  ChevronRight,
  TrendingUp,
  Highlighter,
  Zap
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const FADE_IN = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

export default function App() {
  const [text, setText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<null | { score: number; summary: string; tips: string[] }>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Statistics Calculation
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const readingTime = Math.ceil(words / 225); // ~225 wpm
    
    const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
    const avgSentenceLength = words / sentences;
    
    let readability = "Easy";
    if (avgSentenceLength > 20) readability = "Complex";
    else if (avgSentenceLength > 12) readability = "Standard";

    return { words, chars, readingTime, readability, avgSentenceLength };
  }, [text]);

  const maturityScore = useMemo(() => {
    let score = 0;
    score += Math.min(stats.words / 10, 50); 
    score += Math.min(stats.avgSentenceLength * 2, 25);
    score += text.includes("\n\n") ? 25 : 0;
    return Math.round(score);
  }, [stats, text]);

  const analyzeWithAi = async () => {
    if (!text.trim() || isAiLoading) return;
    
    setIsAiLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are an expert editor. Analyze the draft given for clarity, tone, and flow. Return a JSON object with 'score' (0-100), 'summary' (max 60 words), and 'tips' (array of 3 specific improvements)."
        },
        contents: text
      });

      if (response.text) {
        setAiFeedback(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-stone-50 font-sans text-stone-900 selection:bg-stone-200 overflow-hidden">
      {/* Sidebar */}
      {!isFullscreen && (
        <aside className="w-80 border-r border-stone-200 bg-white p-6 flex flex-col gap-8 overflow-y-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white font-mono font-bold">
              D
            </div>
            <span className="text-xl font-bold tracking-tight">DraftMeter</span>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4 px-1">Draft Progress</h3>
            <div className="relative h-48 w-full flex items-center justify-center">
              <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f5f5f4" strokeWidth="8" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#1c1917"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * maturityScore) / 100 }}
                  transition={{ duration: 1.2, ease: "circOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black">{maturityScore}%</span>
                <span className="text-[10px] font-bold text-stone-400 tracking-widest mt-1">MATURITY</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-stone-50 p-4 border border-stone-100 flex flex-col gap-1">
                <span className="text-2xl font-black">{stats.words}</span>
                <span className="text-[10px] font-bold text-stone-400 uppercase">Words</span>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4 border border-stone-100 flex flex-col gap-1">
                <span className="text-2xl font-black">{stats.chars}</span>
                <span className="text-[10px] font-bold text-stone-400 uppercase">Chars</span>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4 border border-stone-100 flex flex-col gap-1">
                <span className="text-lg font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {stats.readingTime}m
                </span>
                <span className="text-[10px] font-bold text-stone-400 uppercase">Reading</span>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4 border border-stone-100 flex flex-col gap-1">
                <span className="text-lg font-bold">{stats.readability}</span>
                <span className="text-[10px] font-bold text-stone-400 uppercase">Style</span>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
               <div className="flex items-center gap-2 mb-1">
                 <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                 <span className="text-[10px] font-bold text-amber-900 uppercase">Quick Tip</span>
               </div>
               <p className="text-[11px] text-amber-900/70 leading-snug">
                 {stats.avgSentenceLength > 15 ? "Sentences are getting long. Try breaking some up for clarity." : "Good sentence pacing. Keep the rhythm varied."}
               </p>
            </div>
            
            <button 
              onClick={analyzeWithAi}
              disabled={isAiLoading || !text.trim()}
              className="w-full group relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-4 py-4 text-sm font-bold text-white transition-all hover:bg-stone-800 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-pulse' : ''}`} />
              {isAiLoading ? "Analyzing Draft..." : "Full AI Critique"}
            </button>
          </div>
        </aside>
      )}

      {/* Editor Area */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-stone-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
             <div className="px-2 py-1 bg-stone-100 rounded text-[10px] font-bold uppercase text-stone-500 tracking-wider">Unsaved</div>
             <h2 className="text-sm font-bold text-stone-400">new_draft_meter.txt</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setText("")}
              className="p-2 hover:bg-stone-100 rounded-xl text-stone-400 transition-colors"
              title="Clear text"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-stone-100 rounded-xl text-stone-400 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <div className="h-4 w-[1px] bg-stone-200 mx-2" />
            <button className="p-2 hover:bg-stone-100 rounded-xl text-stone-400">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className={`flex-1 p-8 md:p-16 lg:p-24 overflow-y-auto flex justify-center transition-all bg-white`}>
          <div className="max-w-3xl w-full">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start your writing draft here..."
              className="w-full h-[80vh] resize-none border-none focus:ring-0 bg-transparent text-xl leading-relaxed text-stone-800 placeholder-stone-200 font-sans tracking-tight"
              spellCheck={false}
            />
          </div>
        </div>

        {/* AI Insight Panel */}
        <AnimatePresence>
          {aiFeedback && (
            <motion.div 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: "spring", damping: 20 }}
              className="absolute right-6 top-24 bottom-6 w-[400px] bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[2.5rem] border border-stone-200 p-10 flex flex-col z-20"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-stone-900" />
                  <h3 className="text-xl font-bold tracking-tight">AI Critique</h3>
                </div>
                <button 
                  onClick={() => setAiFeedback(null)}
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-10 p-6 bg-stone-50 rounded-3xl border border-stone-100">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-black tracking-tighter">{aiFeedback.score}</span>
                  <span className="text-stone-400 font-bold mb-1">/ 100</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${aiFeedback.score}%` }}
                    className="h-full bg-stone-900"
                  />
                </div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-4">Draft Quality Index</p>
              </div>

              <div className="space-y-8 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-stone-400" />
                    <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Executive Summary</h4>
                  </div>
                  <p className="text-stone-600 leading-relaxed font-serif italic text-lg">{aiFeedback.summary}</p>
                </div>

                <div>
                   <div className="flex items-center gap-2 mb-4">
                    <Highlighter className="w-4 h-4 text-stone-400" />
                    <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Specific Refinements</h4>
                  </div>
                  <ul className="space-y-4">
                    {aiFeedback.tips.map((tip, i) => (
                      <li key={i} className="flex gap-4 text-sm text-stone-600 bg-stone-50/50 p-4 rounded-2xl border border-stone-100/50">
                        <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold border border-stone-200 shrink-0">
                          {i + 1}
                        </div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button 
                onClick={analyzeWithAi}
                className="mt-8 w-full py-4 rounded-2xl border border-stone-200 text-xs font-bold hover:bg-stone-50 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3 h-3" /> Regenerate Analysis
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live HUD */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-stone-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-8 shadow-2xl z-30">
           <div className="flex items-center gap-2 border-r border-stone-700 pr-8">
             <span className="text-stone-500 font-mono text-[10px] uppercase font-bold">Words</span>
             <span className="font-bold tabular-nums text-sm">{stats.words}</span>
           </div>
           <div className="flex items-center gap-2 border-r border-stone-700 pr-8">
             <span className="text-stone-500 font-mono text-[10px] uppercase font-bold">Characters</span>
             <span className="font-bold tabular-nums text-sm">{stats.chars}</span>
           </div>
           <div className="flex items-center gap-2">
             <span className="text-stone-500 font-mono text-[10px] uppercase font-bold">Draft Status</span>
             <div className="flex items-center gap-1.5">
               <div className={`h-2 w-2 rounded-full ${maturityScore > 70 ? 'bg-green-500 animate-pulse' : maturityScore > 30 ? 'bg-amber-500' : 'bg-stone-500'}`} />
               <span className="text-[11px] font-bold uppercase tracking-tight">{maturityScore > 70 ? 'Ready' : maturityScore > 30 ? 'Drafting' : 'Idle'}</span>
             </div>
           </div>
        </div>
      </main>

      {/* Floating Insight */}
      <AnimatePresence>
        {text.length > 300 && !aiFeedback && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-24 right-8 bg-white border border-stone-200 p-4 rounded-3xl shadow-xl flex items-center gap-4 z-10 max-w-sm pointer-events-auto"
          >
            <div className="h-10 w-10 flex items-center justify-center bg-stone-50 border border-stone-100 rounded-full shrink-0">
               <Sparkles className="w-5 h-5 text-stone-400" />
            </div>
            <p className="text-xs text-stone-600 font-medium leading-normal">
              You've crossed 300 words. Ready for a deep analysis to see how your flow is holding up?
            </p>
            <button 
              onClick={analyzeWithAi}
              className="text-xs font-bold text-stone-900 underline underline-offset-4 decoration-stone-200 transition-colors hover:decoration-stone-900"
            >
              Analyze
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

