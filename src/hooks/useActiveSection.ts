"use client";

import { useEffect, useState } from "react";
import type { SectionId } from "@/data/site";

export const SECTION_IDS = [
  "home",
  "manifesto",
  "trust",
] as const satisfies ReadonlyArray<SectionId>;

export function useActiveSection(initial: SectionId = "home") {
  const [active, setActive] = useState<SectionId>(initial);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (section): section is HTMLElement => section !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const first = visible[0];
        if (first) setActive(first.target.id as SectionId);
      },
      {
        rootMargin: "-42% 0px -52% 0px",
        threshold: [0, 0.1, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return [active, setActive] as const;
}
