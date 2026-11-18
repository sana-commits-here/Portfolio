import { useState } from 'react';
import { LazyMotion, MotionConfig } from 'framer-motion';

const loadFeatures = () => import('./lib/motion-features.js').then((r) => r.default);
import { useHashLinks, useLiveRegions, useReduced, useScrollProgress } from './lib/util.js';
import Boot from './components/system/Boot.jsx';
import Cursor from './components/system/Cursor.jsx';
import Interlude from './components/system/Interlude.jsx';
import { Dock, Spine } from './components/system/Navigation.jsx';
import Hero from './components/sections/Hero.jsx';
import Profile from './components/sections/Profile.jsx';
import Trajectory from './components/sections/Trajectory.jsx';
import Experiments from './components/sections/Experiments.jsx';
import Ecosystem from './components/sections/Ecosystem.jsx';
import Laboratory from './components/sections/Laboratory.jsx';
import Response from './components/sections/Response.jsx';

export default function App() {
  // The logo curtain plays on every visit and every refresh.
  const [curtain, setCurtain] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const reduced = useReduced();
  useScrollProgress();
  useLiveRegions();
  useHashLinks();

  return (
    <LazyMotion features={loadFeatures} strict>
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip">Skip to content</a>
      <div className="backdrop" aria-hidden="true">
        <div className="bd-grid" />
        <div className="bd-grain" />
      </div>
      {curtain && <Boot reduced={reduced} onReveal={() => setRevealed(true)} onDone={() => setCurtain(false)} />}
      <Cursor />
      <Spine />
      <Dock />
      <main id="main">
        <Hero ready={revealed} />
        <Interlude from="lines" to="cloud" op="encode(identity)" result="embedding" />
        <Profile />
        <Interlude from="cloud" to="axis" op="sort(embedding, by=time)" result="sequence" />
        <Trajectory />
        <Interlude from="axis" to="frames" op="expand(sequence)" result="experiments" />
        <Experiments />
        <Interlude from="frames" to="graph" op="decompose(experiments)" result="skill graph" />
        <Ecosystem />
        <Interlude from="graph" to="plot" op="fit(graph)" result="hypotheses" toTheme="lab" />
        <Laboratory />
        <Interlude from="plot" to="point" op="reduce(everything)" result="one channel" theme="lab" toTheme="ink" />
        <Response />
      </main>
    </MotionConfig>
    </LazyMotion>
  );
}
