import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import HowTo from "./pages/HowTo";
import Editor from "./pages/Editor";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Contact from "./pages/Contact";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isEditor = location.pathname === "/editor";

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <div className="bg-amber-500 text-white text-center py-2 text-sm font-medium shadow-md z-50">
        This website is for sale. Contact <a href="mailto:support@draftmeter.com" className="underline font-bold hover:text-amber-100 transition-colors">support@draftmeter.com</a>
      </div>
      {!isEditor && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {!isEditor && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-to" element={<HowTo />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

