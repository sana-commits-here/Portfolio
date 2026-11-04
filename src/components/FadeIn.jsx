import React from "react";
import { motion } from "framer-motion";

// motion.create(as) must NOT run inside the component body: it returns a new
// component type on every call, which makes React unmount and remount the
// whole subtree each render. Cache one motion component per tag instead.
const MOTION_CACHE = {};
function getMotionTag(as) {
  if (!MOTION_CACHE[as]) MOTION_CACHE[as] = motion.create(as);
  return MOTION_CACHE[as];
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = "div",
  className = "",
  style,
}) {
  const MotionTag = getMotionTag(as);
  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </MotionTag>
  );
}