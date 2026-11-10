import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Toaster } from "@/components/ui/toaster";
import Home from './pages/Home';
import CaseStudy from './pages/CaseStudy';

const EASE = [0.22, 1, 0.36, 1];

// Cross-fade between pages, with a brand-gradient bar sweeping across on enter.
function Page({ children }) {
  const reduced = useReducedMotion();
  if (reduced) return children;
  return (
    <motion.div
      // Opacity only: a transform here would turn this wrapper into the
      // containing block for the fixed header and the sticky project deck.
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.45, ease: EASE } }}
      exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }}
    >
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[3px] z-[80] origin-left pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #B600A8, #7621B0, #BE4C00)' }}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0, transition: { duration: 0.8, ease: EASE } }}
      />
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const latest = useRef(location);
  latest.current = location;

  // Once the old page has faded out: jump to the hash target (e.g. /#work)
  // or to the top, so the new page never appears mid-scroll.
  const onExitComplete = () => {
    const { hash } = latest.current;
    window.setTimeout(() => {
      const el = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) el.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 30);
  };

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={onExitComplete}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/work/:slug" element={<Page><CaseStudy /></Page>} />
        <Route path="*" element={<Page><Home /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
      <Toaster />
    </Router>
  );
}
