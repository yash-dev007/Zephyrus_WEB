"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";

type ScrollTarget = string | number | HTMLElement;

type ScrollToOptions = {
  duration?: number;
  offset?: number;
  immediate?: boolean;
};

type SmoothScrollContextValue = {
  lenis: Lenis | null;
  scrollTo: (target: ScrollTarget, options?: ScrollToOptions) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      smoothWheel: true,
      autoRaf: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Lenis is an external system created after mount. Publishing the instance
    // so consumers can drive it requires one state update.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  const scrollTo = useCallback(
    (target: ScrollTarget, options: ScrollToOptions = {}) => {
      const reduced = prefersReducedMotion();

      if (lenis && !reduced) {
        lenis.scrollTo(target, {
          duration: options.duration ?? 1.15,
          easing: (t: number) => 1 - Math.pow(2, -10 * t),
          offset: options.offset ?? 0,
          immediate: options.immediate ?? false,
          force: true,
        });
        return;
      }

      const behavior: ScrollBehavior = reduced ? "auto" : "smooth";

      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior });
        return;
      }

      const element =
        typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      element?.scrollIntoView({ behavior, block: "start" });
    },
    [lenis],
  );

  const value = useMemo(() => ({ lenis, scrollTo }), [lenis, scrollTo]);

  return (
    <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll(): SmoothScrollContextValue {
  const context = useContext(SmoothScrollContext);
  return (
    context ?? {
      lenis: null,
      scrollTo: (target) => {
        if (typeof target === "number") {
          window.scrollTo({ top: target, behavior: "auto" });
          return;
        }

        const element =
          typeof target === "string"
            ? document.querySelector<HTMLElement>(target)
            : target;
        element?.scrollIntoView({ behavior: "auto", block: "start" });
      },
    }
  );
}
