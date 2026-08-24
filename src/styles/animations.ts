import type { Variants, Transition } from "framer-motion";

/* ── Transition presets ── */
export const transitions = {
  spring: { type: "spring" as const, stiffness: 300, damping: 30 },
  springGentle: { type: "spring" as const, stiffness: 200, damping: 25 },
  springBouncy: { type: "spring" as const, stiffness: 400, damping: 15 },
  tween: { duration: 0.4, ease: "easeInOut" as const },
  tweenFast: { duration: 0.2, ease: "easeOut" as const },
  tweenSlow: { duration: 0.6, ease: "easeInOut" as const },
} as const;

/* ── Framer Motion variant objects ── */

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.springGentle,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.tween,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.springGentle,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.springGentle,
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.springGentle,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.springGentle,
  },
};

export const heroAnimation: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...transitions.springGentle,
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const heroItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.springGentle,
  },
};

/* ── Helper: build staggered delay ── */
export function staggerDelay(index: number, base = 0.1): Transition {
  return {
    ...transitions.springGentle,
    delay: index * base,
  };
}
