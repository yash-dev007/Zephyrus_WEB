"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Keeps the `reduce` class in sync if the user changes their OS-level motion
 * preference while the page is open. The pre-paint script handles first load.
 */
export function MotionPreferences() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    document.documentElement.classList.toggle("reduce", reduced);
  }, [reduced]);

  // Cancel the pre-paint boot timeout in layout.tsx once React has hydrated.
  useEffect(() => {
    window.__zephyrusBooted = true;
  }, []);

  return null;
}
