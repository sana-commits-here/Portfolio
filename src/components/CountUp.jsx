import React, { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

// Counts "50+", "25%", "4+" … up from 0 when scrolled into view, keeping
// whatever prefix/suffix surrounds the number. Non-numeric values render as-is.
export default function CountUp({ value, duration = 1.6, className, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const match = String(value).match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[2]) : 0;
  const decimals = match && match[2].includes(".") ? match[2].split(".")[1].length : 0;
  const [n, setN] = useState(reduced || !match ? target : 0);

  const isNumeric = Boolean(match);
  useEffect(() => {
    if (!isNumeric || !inView || reduced) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [inView, reduced, target, duration, isNumeric]);

  if (!match) return <span className={className} style={style}>{value}</span>;
  return (
    <span ref={ref} className={className} style={style}>
      {match[1]}
      {n.toFixed(decimals)}
      {match[3]}
    </span>
  );
}
