"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { animate } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type CountUpProps = {
  value: number;
  suffix?: string;
  start?: boolean;
  duration?: number;
  delay?: number;
  className?: string;
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function format(value: number, suffix: string): string {
  return `${value}${suffix}`;
}

/**
 * Animates the rendered text directly instead of re-rendering React on every
 * frame. The server-rendered output already contains the final value, so the
 * number remains meaningful without JavaScript.
 */
export function CountUp({
  value,
  suffix = "",
  start = true,
  duration = 1.4,
  delay = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!start) {
      if (!started.current) element.textContent = format(value, suffix);
      return;
    }

    if (started.current) return;
    started.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.textContent = format(value, suffix);
      return;
    }

    element.textContent = format(0, suffix);
    const controls = animate(0, value, {
      duration,
      delay,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        element.textContent = format(Math.round(latest), suffix);
      },
      onComplete: () => {
        element.textContent = format(value, suffix);
      },
    });

    return () => controls.stop();
  }, [delay, duration, start, suffix, value]);

  return (
    <span ref={ref} className={cn("count", className)} data-target={value}>
      {format(value, suffix)}
    </span>
  );
}
