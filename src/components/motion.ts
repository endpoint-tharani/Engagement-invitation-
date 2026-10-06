import type { Transition, Variants } from "framer-motion";

/** Slow, soft deceleration used for every reveal on the page. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Reveal once, shortly after the element's top enters the screen. */
export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

const slow: Transition = { duration: 1.2, ease: EASE };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: slow },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.6, ease: EASE } },
};

export const softScale: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.6, ease: EASE } },
};

export const stagger = (gap = 0.14, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});
