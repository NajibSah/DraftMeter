import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-stone-50/80 backdrop-blur-md px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-stone-900 text-white font-mono font-bold transition-transform group-hover:scale-110">
            D
          </div>
          <span className="text-xl font-bold tracking-tight">DraftMeter</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-stone-600">
          <Link to="/" className="hover:text-stone-900 transition-colors px-1">Home</Link>
          <Link to="/how-to" className="hover:text-stone-900 transition-colors px-1">How to Use</Link>
          <Link 
            to="/editor" 
            className="rounded-full bg-stone-900 px-5 py-2 text-xs font-bold text-white transition-transform hover:scale-105 active:scale-95"
          >
            Open Editor
          </Link>
        </nav>
      </div>
    </header>
  );
}
