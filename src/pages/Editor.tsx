import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import { 
  FileText, 
  Settings, 
  Sparkles, 
  Trash2, 
  Clock, 
  Maximize2, 
  Minimize2,
  Info,
  ChevronRight,
  TrendingUp,
  Highlighter,
  Zap,
  ArrowRight,
  Search,
  ShieldCheck,
  ArrowLeft
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function Editor() {
  const [text, setText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<null | { score: number; summary: string; critique: string; tips: string[] }>(null);
  
  const WORD_LIMIT = 1500;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showHowTo, setShowHowTo] = useState(true);

  const editorScrollRef = useRef<HTMLDivElement>(null);

  const [searchParams] = useSearchParams();

  const handleQuickStart = useCallback(() => {
    setText("The future of professional writing isn't just about AI generation—it's about AI evaluation. DraftMeter allows writers to gauge the 'maturity' of their prose by measuring structural integrity, sentence variation, and overall flow.\n\nBy providing a real-time 'Maturity Score', users can visualize their progress from a rough sketch to a polished final draft. It’s the essential tool for creators who care about the craftsmanship of their words.");
    setShowHowTo(false);
  }, []);

  useEffect(() => {
    if (searchParams.get("sample") === "true") {
      handleQuickStart();
    }
  }, [searchParams, handleQuickStart]);

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
    if (!text.trim()) return 0;
    let score = 0;
    score += Math.min(stats.words / 10, 50); 
    score += Math.min(stats.avgSentenceLength * 2, 25);
    score += text.includes("\n\n") ? 25 : 0;
    return Math.round(score);
  }, [stats, text]);

  const analyzeWithAi = async () => {
    if (!text.trim() || isAiLoading) return;
    
    if (stats.words > WORD_LIMIT) {
      alert(`Please reduce your draft to under ${WORD_LIMIT} words for a deep analysis.`);
      return;
    }
    
    setIsAiLoading(true);
    setIsSidebarOpen(false); // Close mobile sidebar if open
    
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Analyze this text: ${text}`;
      const systemInstruction = "You are a world-class critical editor. Provide a rigorous, unvarnished analysis of the provided text. Focus on identifying structural weaknesses, logical gaps, and stylistic inconsistencies. Return a JSON object with: 'score' (0-100 reflecting structural maturity), 'summary' (a brief overview), 'critique' (a detailed critical evaluation of flaws and weaknesses, max 100 words), and 'tips' (3 actionable strategies for improvement).";

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        }
      });

      if (!response.text) {
        throw new Error("No response from AI.");
      }

      const data = JSON.parse(response.text);
      setAiFeedback(data);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      alert("Service temporarily unavailable, please try again later.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const scrollToEditorAndLoad = () => {
    if (editorScrollRef.current) {
      editorScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    handleQuickStart();
  };

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden relative">
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
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white font-mono font-bold transition-transform group-hover:scale-110">
              D
            </div>
            <span className="text-xl font-bold tracking-tight">DraftMeter</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-stone-400">
            <Minimize2 className="w-5 h-5 rotate-90" />
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Draft Progress</h3>
            <div className="group relative">
              <Info className="w-3 h-3 text-stone-300 cursor-help" />
              <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-stone-900 text-white text-[10px] rounded shadow-xl hidden group-hover:block z-50">
                Calculated based on word count, sentence structure, and paragraph formatting.
              </div>
            </div>
          </div>
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
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">Statistics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200 flex flex-col gap-1">
              <span className="text-2xl font-black">{stats.words}</span>
              <span className="text-[10px] font-bold text-stone-400 uppercase">Words</span>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200 flex flex-col gap-1">
              <span className="text-lg font-bold">{stats.readingTime}m</span>
              <span className="text-[10px] font-bold text-stone-400 uppercase">Read Time</span>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-4">
           <button 
            onClick={() => setShowHowTo(true)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-stone-200 px-4 py-3 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors"
          >
            How to use
          </button>
          <button 
            onClick={analyzeWithAi}
            disabled={isAiLoading || !text.trim() || stats.words > WORD_LIMIT}
            className="w-full group relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-4 py-4 text-sm font-bold text-white transition-all hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-pulse' : ''}`} />
            {isAiLoading ? "Analyzing..." : "Deep AI Analysis"}
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
              disabled={isAiLoading || !text.trim() || stats.words > WORD_LIMIT}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-stone-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 disabled:bg-stone-200 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">Analyze</span>
            </button>
          </div>
        </header>

        <div ref={editorScrollRef} className="flex-1 overflow-y-auto w-full bg-stone-100 relative">
          <div className="max-w-3xl mx-auto w-full p-4 md:p-12 lg:p-16 pb-20">
            <div className="bg-white rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-stone-200 min-h-[85vh] p-8 md:p-16 relative mb-24 flex flex-col">
              <div className="flex-1">
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    if (showHowTo) setShowHowTo(false);
                  }}
                  placeholder="Paste your text or start writing here..."
                  className="w-full h-full min-h-[60vh] resize-none border-none focus:ring-0 bg-transparent text-lg md:text-xl leading-relaxed text-stone-800 placeholder-stone-200 font-sans tracking-tight"
                  spellCheck={false}
                />
              </div>

              {/* Word Count Limit Indicator */}
              <div className="mt-8 pt-8 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Usage</span>
                    <div className="flex items-center gap-2">
                       <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${stats.words > WORD_LIMIT ? 'bg-red-500' : 'bg-stone-900'}`}
                            style={{ width: `${Math.min((stats.words / WORD_LIMIT) * 100, 100)}%` }}
                          />
                       </div>
                       <span className={`text-xs font-bold font-mono ${stats.words > WORD_LIMIT ? 'text-red-500' : 'text-stone-400'}`}>
                         {stats.words} / {WORD_LIMIT}
                       </span>
                    </div>
                  </div>
                </div>
                {stats.words > WORD_LIMIT && (
                  <p className="text-[10px] font-bold text-red-500 uppercase animate-pulse">Draft too long for AI</p>
                )}
              </div>

              {/* Guide Overlay when empty */}
              {!text && !showHowTo && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-12 text-center">
                  <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-6 border border-stone-100">
                    <FileText className="w-8 h-8 text-stone-200" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Editor Ready</h3>
                  <p className="text-stone-400 text-sm max-w-xs mb-8">
                    Your words go here. We'll measure the complexity and quality as you type.
                  </p>
                  <button 
                    onClick={handleQuickStart}
                    className="pointer-events-auto px-6 py-3 bg-stone-900 text-white rounded-2xl text-xs font-bold hover:scale-105 transition-transform"
                  >
                    Load Sample Text
                  </button>
                </div>
              )}
            </div>

            {/* Homepage Content Integrated into Editor */}
            <div className="space-y-32 py-20 border-t border-stone-200">
              <section className="text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1 text-xs font-medium text-stone-500">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  The Science of Drafting
                </div>
                <h2 className="text-4xl font-bold tracking-tight mb-6">Why use DraftMeter?</h2>
                <p className="text-stone-500 max-w-xl mx-auto leading-relaxed">
                  DraftMeter evaluates your writing in real-time. Go beyond grammar to understand flow, structural maturity, and clarity with our proprietary algorithm.
                </p>
              </section>

              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
                    title: "Maturity Scoring",
                    desc: "A composite metric that tracks the structural development of your draft."
                  },
                  {
                    icon: <Search className="h-5 w-5 text-blue-500" />,
                    title: "Structural Density",
                    desc: "Evaluates sentence variation and paragraph flow to ensure engagement."
                  },
                  {
                    icon: <Sparkles className="h-5 w-5 text-amber-500" />,
                    title: "AI Deep Critique",
                    desc: "Get professional-level feedback using Gemini AI models."
                  },
                  {
                    icon: <Zap className="h-5 w-5 text-yellow-500" />,
                    title: "Real-time Metrics",
                    desc: "Instant feedback on word count and reading time as you type."
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2rem] border border-stone-200/50 shadow-sm">
                    <div className="h-10 w-10 flex items-center justify-center bg-stone-50 rounded-xl mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>

              <section className="bg-stone-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">Master your craft.</h3>
                  <p className="text-stone-400 text-sm mb-8 max-w-md mx-auto">
                    Join thousands of writers who use DraftMeter to perfect their professional correspondence.
                  </p>
                  <button 
                    onClick={scrollToEditorAndLoad}
                    className="bg-white text-stone-900 px-8 py-3 rounded-xl text-sm font-bold hover:scale-105 transition-transform"
                  >
                    Load Sample Now
                  </button>
                </div>
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-400 via-transparent to-transparent" />
                </div>
              </section>
              
              <footer className="text-center py-10 opacity-30 text-[10px] font-bold uppercase tracking-widest">
                DraftMeter © {new Date().getFullYear()}
              </footer>
            </div>
          </div>

          {/* Floating Onboarding Guide */}
          <AnimatePresence>
            {showHowTo && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-40 pointer-events-auto"
              >
                <div className="bg-stone-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <button onClick={() => setShowHowTo(false)} className="text-stone-500 hover:text-white">
                      <Minimize2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Sparkles className="w-6 h-6 text-amber-400 mb-4" />
                  <h4 className="text-xl font-bold mb-4 tracking-tight">How to use DraftMeter</h4>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-4 text-xs">
                      <div className="w-4 h-4 rounded-full bg-stone-800 flex items-center justify-center shrink-0">1</div>
                      <p className="text-stone-300"><strong className="text-white">Draft:</strong> Paste your article, essay, or email into the editor.</p>
                    </li>
                    <li className="flex gap-4 text-xs">
                      <div className="w-4 h-4 rounded-full bg-stone-800 flex items-center justify-center shrink-0">2</div>
                      <p className="text-stone-300"><strong className="text-white">Measure:</strong> Watch your Maturity Score reflect your draft's progress.</p>
                    </li>
                    <li className="flex gap-4 text-xs">
                      <div className="w-4 h-4 rounded-full bg-stone-800 flex items-center justify-center shrink-0">3</div>
                      <p className="text-stone-300"><strong className="text-white">Analysis:</strong> Click "Deep AI Analysis" for expert structural tips.</p>
                    </li>
                  </ul>
                  <button 
                    onClick={handleQuickStart}
                    className="w-full py-4 bg-white text-stone-900 rounded-2xl text-xs font-bold hover:bg-stone-100 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-8 shrink-0">
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
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-8 pb-12">
                    <div className="lg:block space-y-6">
                      <div>
                        <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Summary</h4>
                        <p className="text-stone-600 leading-relaxed font-serif italic text-lg">{aiFeedback.summary}</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Critical Critique</h4>
                        <p className="text-stone-600 leading-relaxed text-sm bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50 relative overflow-hidden">
                          <span className="relative z-10">{aiFeedback.critique}</span>
                          <span className="absolute -bottom-4 -right-4 text-amber-100/30 font-black text-6xl select-none">!</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Refinements</h4>
                      <ul className="space-y-4">
                        {aiFeedback.tips.map((tip, i) => (
                          <li key={i} className="flex gap-4 text-sm text-stone-600 bg-stone-50/50 p-5 rounded-2xl border border-stone-100/50 transition-colors hover:border-stone-200">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-white uppercase">{i + 1}</span>
                            <span className="leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live HUD (Mobile Optimization) */}
        {!showHowTo && (
          <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 bg-stone-900/90 backdrop-blur-md text-white px-6 py-4 md:py-3 rounded-2xl md:rounded-full flex items-center justify-between md:justify-center gap-4 md:gap-12 shadow-2xl z-30 ring-1 ring-white/10">
             <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2">
               <span className="text-stone-500 font-mono text-[8px] md:text-[10px] uppercase font-bold tracking-widest">Words</span>
               <span className="font-bold tabular-nums text-sm">{stats.words}</span>
             </div>
             <div className="hidden xs:flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2">
               <span className="text-stone-500 font-mono text-[8px] md:text-[10px] uppercase font-bold tracking-widest">Sentences</span>
               <span className="font-bold tabular-nums text-sm">{text.split(/[.!?]+/).filter(Boolean).length}</span>
             </div>
             <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2">
               <span className="text-stone-500 font-mono text-[8px] md:text-[10px] uppercase font-bold tracking-widest">Maturity</span>
               <div className="flex items-center gap-2">
                 <div className={`h-2 w-2 rounded-full ${maturityScore > 70 ? 'bg-green-500' : maturityScore > 30 ? 'bg-amber-400' : 'bg-stone-600'}`} />
                 <span className="text-[10px] font-bold uppercase">{maturityScore}%</span>
               </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
