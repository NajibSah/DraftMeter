import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white py-12 px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-stone-900 text-white font-mono text-[10px] font-bold">
            D
          </div>
          <span className="text-sm font-bold tracking-tight">DraftMeter</span>
        </div>
        <p className="text-sm text-stone-400">
          © {new Date().getFullYear()} DraftMeter. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-stone-400">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <Link to="/how-to" className="hover:text-stone-900 transition-colors">How to Use</Link>
          <Link to="/about" className="hover:text-stone-900 transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-stone-900 transition-colors">Contact</Link>
          <Link to="/privacy" className="hover:text-stone-900 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-stone-900 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
