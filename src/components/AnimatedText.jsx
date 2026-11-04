import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Scroll-reveal text — word-level instead of per-character.
 * Drastically fewer motion values and DOM nodes (e.g. ~30 words
 * vs ~200 characters for a typical bio paragraph), with the same
 * fade-in-from-left reveal feel.
 */
export default function AnimatedText({ text, className = "", style }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const words = text.split(" ");

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min(start + 1 / words.length, 1);
        return (
          <Word
            key={i}
            word={word}
            isLast={i === words.length - 1}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}

function Word({ word, isLast, progress, range }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <>
      <span className="relative inline-block">
        <span className="opacity-20">{word}</span>
        <motion.span className="absolute inset-0" style={{ opacity }}>
          {word}
        </motion.span>
      </span>
      {!isLast && " "}
    </>
  );
}