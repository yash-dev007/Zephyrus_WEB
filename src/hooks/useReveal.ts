"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";

type RevealOptions = {
  amount?: number;
  delay?: number;
  distance?: number;
};

/**
 * Scroll-triggered CSS reveal. The hidden state lives in motion.css behind the
 * `js` class, so content stays visible when JavaScript is unavailable.
 */
export function useReveal<T extends HTMLElement = HTMLElement>({
  amount = 0.18,
  delay = 0,
  distance = 26,
}: RevealOptions = {}) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, {
    once: true,
    amount,
    margin: "0px 0px -8% 0px",
  });

  const style = {
    "--reveal-delay": `${delay}ms`,
    "--reveal-y": `${distance}px`,
  } as CSSProperties;

  return {
    ref,
    "data-reveal": "",
    "data-revealed": inView ? "" : undefined,
    style,
  };
}
