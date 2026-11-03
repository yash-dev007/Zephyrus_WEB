"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { CountUp } from "@/components/ui/CountUp";
import { Icon, icons, moduleIcons } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { localRuntimes, moduleHighlights, siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

export function Trust() {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(panelRef, {
    once: true,
    amount: 0.2,
    margin: "0px 0px -8% 0px",
  });
  const live = reduced || inView;

  return (
    <section className="trust-section" id="trust">
      <div
        ref={panelRef}
        className={cn("trust-panel", live && "trust-live")}
        aria-labelledby="trustHeading"
      >
        <div className="trust-copy">
          <Reveal as="h2" className="trust-heading" id="trustHeading">
            Own your
            <br />
            models,
            <br />
            memory
            <br />
            and data.
          </Reveal>

          <Reveal
            as="span"
            className="glass-tile tile-star"
            aria-hidden="true"
            delay={70}
          >
            <Icon icon={icons.asterisk} />
          </Reveal>

          <Reveal
            as="span"
            className="glass-tile tile-dots"
            aria-hidden="true"
            delay={140}
          >
            <span className="four-dots">
              <span />
              <span />
              <span />
              <span />
            </span>
          </Reveal>

          <Reveal as="p" className="trust-para" delay={210}>
            Zephyrus keeps models, memory, research and tools in one self-hosted
            workspace. Your data stays yours.
          </Reveal>
        </div>

        <div className="trust-cards">
          <Reveal
            as="article"
            className="trust-card avatar-card"
            aria-label="Integrated workspace modules"
            distance={32}
            delay={100}
          >
            <div className="avatar-grid module-grid">
              {moduleHighlights.map((module, index) => (
                <span
                  className="module-tile"
                  style={{ transitionDelay: `${index * 100}ms` }}
                  role="img"
                  aria-label={module.label}
                  key={module.label}
                >
                  <Icon icon={moduleIcons[module.icon]} />
                </span>
              ))}
            </div>
            <div className="avatar-meta">
              <div className="trust-count">
                <CountUp value={siteConfig.moduleCount} start={live} />
              </div>
              <p>Integrated Modules</p>
            </div>
          </Reveal>

          <Reveal
            as="article"
            className="trust-card awards-card"
            aria-label="Model providers"
            distance={32}
            delay={190}
          >
            <div className="awards-top">
              <div className="awards-metric">
                <div className="trust-count">
                  <CountUp
                    value={siteConfig.providerCount}
                    suffix={siteConfig.providerSuffix}
                    start={live}
                  />
                </div>
                <div className="awards-label">Model Providers</div>
              </div>
            </div>
            <div className="provider-block">
              <div className="provider-kicker">Local runtimes</div>
              <ul className="provider-chips" aria-label="Local runtimes">
                {localRuntimes.map((runtime) => (
                  <li key={runtime}>{runtime}</li>
                ))}
              </ul>
            </div>
            <p className="awards-note">
              Plus Anthropic, Gemini, Groq, xAI,
              <br />
              OpenRouter, OpenAI and DeepSeek.
            </p>
          </Reveal>

          <Reveal
            as="article"
            className="trust-card portrait-card"
            aria-label="Zephyrus identity"
            distance={32}
            delay={280}
          >
            <img
              src="/assets/img/zephyrus-brand.webp"
              alt="Zephyrus dragon mark on a dark topographic field"
              width={384}
              height={652}
              loading="lazy"
              decoding="async"
            />
            <div className="portrait-cap">
              <span>Workspace</span>
              <span>v{siteConfig.version}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
