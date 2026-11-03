"use client";

import { Fragment, useRef, type CSSProperties, type MouseEvent } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Nav } from "@/components/home/Nav";
import { CountUp } from "@/components/ui/CountUp";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Icon, icons, moduleIcons } from "@/components/ui/Icon";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { coreStack, heroMarks, siteConfig } from "@/data/site";

function riseStyle(index: number): CSSProperties {
  return { "--rise-delay": `${360 + index * 55}ms` } as CSSProperties;
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollTo } = useSmoothScroll();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "13%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.04, 1]);

  const handleSectionLink = (event: MouseEvent<HTMLAnchorElement>, hash: string) => {
    event.preventDefault();
    scrollTo(hash);
    try {
      window.history.pushState(null, "", hash);
    } catch {
      // The scroll itself is the important part.
    }
  };

  return (
    <section
      ref={heroRef}
      className="hero"
      id="home"
      aria-label="Zephyrus — local-first AI harness"
    >
      <div className="media-layer">
        <motion.div
          className="photo-stage"
          id="photoStage"
          style={reduced ? undefined : { y: photoY, scale: photoScale }}
        >
          <div className="photo-rise" id="photoRise">
            <picture>
              <source
                type="image/avif"
                srcSet="/assets/img/dragon-654.avif 654w, /assets/img/dragon-1308.avif 1308w"
                sizes="(max-width: 760px) 100vw, 53vw"
              />
              <source
                type="image/webp"
                srcSet="/assets/img/dragon-654.webp 654w, /assets/img/dragon-1308.webp 1308w"
                sizes="(max-width: 760px) 100vw, 53vw"
              />
              <img
                className="hero-photo"
                src="/assets/img/dragon-1308.webp"
                alt="Monochrome dragon head emerging from black"
                width={1308}
                height={1752}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>
        </motion.div>

        <div className="hero-logos" role="group" aria-label="Core stack">
          {coreStack.map((item, index) => (
            <Fragment key={item}>
              {index > 0 ? (
                <span className="logo-dot" aria-hidden="true">
                  ·
                </span>
              ) : null}
              <span>{item}</span>
            </Fragment>
          ))}
        </div>
      </div>

      <header className="hero-top">
        <Nav />
      </header>

      <div className="hero-intro">
        <h1 className="hero-title" aria-label="Zephyrus">
          <span className="title-mask">
            <span className="title-inner" aria-hidden="true">
              ZEPHYRUS
            </span>
          </span>
        </h1>

        <div className="about-block">
          <div className="about-label">
            <span className="about-dot" aria-hidden="true" />
            <span>(THE HARNESS)</span>
          </div>
          <p className="about-copy">
            A self-hosted AI workspace
            <br />
            for agents, memory and research.
          </p>
          <ExternalLink
            className="book-btn rise"
            href={siteConfig.docs}
            showArrow
            style={riseStyle(0)}
          >
            Read the Docs
          </ExternalLink>
        </div>
      </div>

      <div className="hero-stats rise" style={riseStyle(1)}>
        <div className="stat-card partner-card">
          <div className="hero-count">
            <CountUp value={siteConfig.moduleCount} />
          </div>
          <div className="stat-kicker">Workspace Modules</div>
          <div className="partner-marks" role="group" aria-label="Core modules">
            {heroMarks.map((mark) => (
              <span className="partner-mark" key={mark.label}>
                <Icon icon={moduleIcons[mark.icon]} />
                {mark.label}
              </span>
            ))}
          </div>
          <a
            className="book-bar"
            href="#trust"
            onClick={(event) => handleSectionLink(event, "#trust")}
          >
            Explore modules
            <Icon icon={icons.arrowUp} className="arrow-ne" />
          </a>
        </div>

        <div className="stat-card cap-card">
          <img
            src="/assets/img/zephyrus-ui.webp"
            alt="Zephyrus chat workspace with the prompt bar and model selector"
            width={1600}
            height={765}
            decoding="async"
          />
          <div className="cap-top">
            <span>Self-Hosted</span>
            <span>· v{siteConfig.version}</span>
          </div>
          <div className="cap-bottom">
            <div className="hero-count">
              <CountUp
                value={siteConfig.providerCount}
                suffix={siteConfig.providerSuffix}
              />
            </div>
            <p>
              Model providers
              <br />
              ready to connect
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
