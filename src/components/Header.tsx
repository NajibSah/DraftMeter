import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "How to Use", path: "/how-to" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy", path: "/privacy" },
    { name: "Terms", path: "/terms" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-stone-50/80 backdrop-blur-md px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-stone-900 text-white font-mono font-bold transition-transform group-hover:scale-110">
            D
          </div>
          <span className="text-xl font-bold tracking-tight">DraftMeter</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="hover:text-stone-900 transition-colors px-1">
              {link.name}
            </Link>
          ))}
          <Link 
            to="/editor" 
            className="rounded-full bg-stone-900 px-5 py-2 text-xs font-bold text-white transition-transform hover:scale-105 active:scale-95"
          >
            Open Editor
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-stone-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-stone-100 mt-4"
          >
            <div className="flex flex-col gap-4 py-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/editor" 
                onClick={() => setIsOpen(false)}
                className="inline-block rounded-2xl bg-stone-900 px-6 py-4 text-center font-bold text-white transition-all active:scale-95 mt-2"
              >
                Open Editor
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
