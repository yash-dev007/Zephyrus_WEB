"use client";

import { Fragment, useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { statementLines } from "@/data/site";
import { wordColor } from "@/lib/highlight";

const TOTAL_WORDS = statementLines.reduce((total, line) => total + line.length, 0);

export function Manifesto() {
  const statementRef = useRef<HTMLParagraphElement>(null);
  const wordsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: statementRef,
    offset: ["start 0.88", "end 0.38"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reduced) return;
    wordsRef.current.forEach((word, index) => {
      if (word) word.style.color = wordColor(progress, index, TOTAL_WORDS);
    });
  });

  let wordIndex = 0;

  return (
    <section
      className="manifesto"
      id="manifesto"
      tabIndex={-1}
      aria-labelledby="manifestoTitle"
    >
      <h2 className="sr-only" id="manifestoTitle">
        Zephyrus overview
      </h2>

      <p className="statement" id="statement" ref={statementRef}>
        {statementLines.map((line, lineIndex) => (
          <span className="statement-line" key={`line-${lineIndex}`}>
            {line.map((word, indexInLine) => {
              const index = wordIndex++;
              return (
                <Fragment key={`${lineIndex}-${indexInLine}`}>
                  {indexInLine > 0 ? " " : null}
                  <span
                    className="word"
                    ref={(element) => {
                      wordsRef.current[index] = element;
                    }}
                  >
                    {word}
                  </span>
                </Fragment>
              );
            })}
          </span>
        ))}
      </p>

      <Reveal as="p" className="subline" distance={18}>
        One FastAPI server, sixteen integrated modules, and thirteen model providers.
        <br className="desk-br" />
        <em>Built for local-first work.</em>
      </Reveal>
    </section>
  );
}
