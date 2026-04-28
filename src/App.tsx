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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    setIsSidebarOpen(false); // Close mobile sidebar if open
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
    <div className="flex h-screen bg-stone-50 font-sans text-stone-900 selection:bg-stone-200 overflow-hidden relative">
      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 border-r border-stone-200 bg-white p-6 flex flex-col gap-8 overflow-y-auto transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:block
        ${isFullscreen ? 'lg:hidden' : ''}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white font-mono font-bold">
              D
            </div>
            <span className="text-xl font-bold tracking-tight">DraftMeter</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-stone-400">
            <Minimize2 className="w-5 h-5 rotate-90" />
          </button>
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
              <span className="text-[10px] font-bold text-stone-400 uppercase">Characters</span>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <button 
            onClick={analyzeWithAi}
            disabled={isAiLoading || !text.trim()}
            className="w-full group relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-4 py-4 text-sm font-bold text-white transition-all hover:bg-stone-800 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-pulse' : ''}`} />
            {isAiLoading ? "Analyzing..." : "Deep AI Critique"}
          </button>
        </div>
      </aside>

      {/* Editor Area */}
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        <header className="h-16 shrink-0 border-b border-stone-200 bg-white/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="p-2 -ml-2 lg:hidden hover:bg-stone-100 rounded-xl text-stone-900"
             >
               <Settings className="w-5 h-5 flex-shrink-0" />
             </button>
             <h2 className="text-sm font-bold text-stone-400 hidden xs:block truncate max-w-[120px] md:max-w-none">
               new_draft.txt
             </h2>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <button 
              onClick={() => setText("")}
              className="p-2 hover:bg-stone-100 rounded-xl text-stone-400 transition-colors"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-stone-100 rounded-xl text-stone-400 transition-colors hidden sm:block"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <div className="h-4 w-[1px] bg-stone-200 mx-1 md:mx-2" />
            <button 
              onClick={analyzeWithAi}
              disabled={isAiLoading || !text.trim()}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-stone-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 disabled:bg-stone-200"
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">Analyze</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full bg-white flex justify-center">
          <div className="max-w-3xl w-full p-4 md:p-12 lg:p-24 pb-32">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start drafting here..."
              className="w-full h-full min-h-[70vh] resize-none border-none focus:ring-0 bg-transparent text-base md:text-xl leading-relaxed text-stone-800 placeholder-stone-200 font-sans tracking-tight"
              spellCheck={false}
            />
          </div>
        </div>

        {/* AI Insight Panel (Responsive Overlay) */}
        <AnimatePresence>
          {aiFeedback && (
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-x-0 bottom-0 lg:left-auto lg:right-6 lg:top-20 lg:bottom-6 lg:w-[420px] bg-white shadow-2xl rounded-t-[2.5rem] lg:rounded-[2.5rem] border-t lg:border border-stone-200 p-6 md:p-10 flex flex-col z-50 max-h-[90vh] lg:max-h-none"
            >
              <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-6 lg:hidden" />
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-stone-900" />
                  <h3 className="text-xl font-bold tracking-tight">AI Critique</h3>
                </div>
                <button 
                  onClick={() => setAiFeedback(null)}
                  className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 rotate-90 lg:rotate-0" />
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-8">
                <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl lg:text-6xl font-black tracking-tighter">{aiFeedback.score}</span>
                    <span className="text-stone-400 font-bold mb-1">/ 100</span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${aiFeedback.score}%` }}
                      className="h-full bg-stone-900"
                    />
                  </div>
                </div>
                <div className="hidden lg:block">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Summary</h4>
                  <p className="text-stone-600 leading-relaxed font-serif italic text-lg">{aiFeedback.summary}</p>
                </div>
              </div>

              <div className="space-y-6 overflow-y-auto flex-1 pr-2">
                <div className="lg:hidden">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Summary</h4>
                  <p className="text-stone-600 leading-relaxed text-sm italic">{aiFeedback.summary}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Refinements</h4>
                  <ul className="space-y-4">
                    {aiFeedback.tips.map((tip, i) => (
                      <li key={i} className="flex gap-3 text-sm text-stone-600 bg-stone-50/50 p-4 rounded-2xl border border-stone-100/50">
                        <span className="font-bold text-stone-900">{i + 1}.</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live HUD (Mobile Optimization) */}
        <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 bg-stone-900/90 backdrop-blur-md text-white px-6 py-4 md:py-3 rounded-2xl md:rounded-full flex items-center justify-between md:justify-center gap-4 md:gap-12 shadow-2xl z-30">
           <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2">
             <span className="text-stone-500 font-mono text-[8px] md:text-[10px] uppercase font-bold">Words</span>
             <span className="font-bold tabular-nums text-sm">{stats.words}</span>
           </div>
           <div className="hidden xs:flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2">
             <span className="text-stone-500 font-mono text-[8px] md:text-[10px] uppercase font-bold">Characters</span>
             <span className="font-bold tabular-nums text-sm">{stats.chars}</span>
           </div>
           <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2">
             <span className="text-stone-500 font-mono text-[8px] md:text-[10px] uppercase font-bold">Progress</span>
             <div className="flex items-center gap-2">
               <div className={`h-2 w-2 rounded-full ${maturityScore > 70 ? 'bg-green-500' : 'bg-amber-500'}`} />
               <span className="text-[10px] font-bold uppercase">{maturityScore}%</span>
             </div>
           </div>
        </div>
      </main>
    </div>
  );
}

