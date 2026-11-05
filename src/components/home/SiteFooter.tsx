"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Icon, icons } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  footerColumns,
  quickstartCommands,
  quickstartUrl,
  siteConfig,
} from "@/data/site";

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollTo } = useSmoothScroll();

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const megaOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const megaY = useTransform(scrollYProgress, [0, 1], ["10%", "-2%"]);

  const handleSectionLink = (event: MouseEvent<HTMLAnchorElement>, hash: string) => {
    event.preventDefault();
    scrollTo(hash);
    try {
      window.history.pushState(null, "", hash);
    } catch {
      // Scrolling still works if history is unavailable.
    }
  };

  return (
    <footer ref={footerRef} className="site-footer" aria-labelledby="footerTitle">
      <div className="footer-shell">
        <div className="footer-cta">
          <div className="footer-cta-copy">
            <Reveal as="div" className="footer-eyebrow">
              (SELF-HOSTED)
            </Reveal>
            <Reveal as="h2" className="footer-title" id="footerTitle" delay={60}>
              Self-host
              <br />
              your AI.
            </Reveal>
            <Reveal as="p" className="footer-copy" delay={120}>
              One FastAPI server for agents, memory, research, email and tools. Docker or
              native Python 3.11+. All state stays under{" "}
              <span className="footer-path">data/</span>.
            </Reveal>
            <Reveal as="div" className="footer-actions" delay={180}>
              <Link className="footer-btn primary" href={siteConfig.docs}>
                Setup guide
                <Icon icon={icons.arrowUp} className="arrow-ne" />
              </Link>
              <ExternalLink
                className="footer-btn ghost"
                href={siteConfig.github}
                showArrow
              >
                View source
              </ExternalLink>
            </Reveal>
          </div>

          <Reveal
            as="div"
            className="footer-term"
            role="group"
            aria-label="Docker quickstart"
            delay={220}
            distance={22}
          >
            <div className="term-top">
              <span>Quickstart</span>
              <span className="term-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </div>
            <div className="term-body">
              {quickstartCommands.map((command) => (
                <div className="term-line" key={command}>
                  <span className="term-prompt" aria-hidden="true">
                    $
                  </span>
                  <span>{command}</span>
                </div>
              ))}
              <div className="term-line">
                <span className="term-prompt" aria-hidden="true">
                  →
                </span>
                <span className="term-url">{quickstartUrl}</span>
              </div>
            </div>
            <div className="term-meta">
              <span>{siteConfig.moduleCount} modules</span>
              <span>
                {siteConfig.providerCount}
                {siteConfig.providerSuffix} providers
              </span>
              <span>v{siteConfig.version}</span>
            </div>
          </Reveal>
        </div>

        <div className="footer-main">
          <Reveal as="div" className="footer-identity">
            <div className="footer-lockup">
              <img
                src="/assets/img/zephyrus-mark.png"
                alt=""
                width={125}
                height={138}
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
              <span className="footer-word">Zephyrus</span>
            </div>
            <p className="footer-tag">{siteConfig.tagline}</p>
            <p className="footer-blurb">
              A local-first AI harness. Provider-agnostic by design, AGPL-3.0 by choice,
              your data by default.
            </p>
          </Reveal>

          {footerColumns.map((column, columnIndex) => (
            <Reveal
              as="nav"
              className="footer-col"
              aria-label={column.title}
              key={column.title}
              delay={80 + columnIndex * 60}
            >
              <h3>{column.title}</h3>
              {column.links.map((link) => {
                if (link.external) {
                  return (
                    <ExternalLink href={link.href} showArrow key={link.label}>
                      {link.label}
                    </ExternalLink>
                  );
                }

                if (!link.href.startsWith("#")) {
                  return (
                    <Link href={link.href} key={link.label}>
                      {link.label}
                    </Link>
                  );
                }

                return (
                  <a
                    href={link.href}
                    key={link.label}
                    onClick={(event) => handleSectionLink(event, link.href)}
                  >
                    {link.label}
                  </a>
                );
              })}
            </Reveal>
          ))}
        </div>

        <motion.div
          className="footer-mega"
          aria-hidden="true"
          style={reduced ? undefined : { opacity: megaOpacity, y: megaY }}
        >
          Zephyrus
        </motion.div>

        <div className="footer-bottom">
          <span>
            © {siteConfig.copyrightYear} {siteConfig.name}
          </span>
          <span className="footer-status">
            <span className="footer-dot" aria-hidden="true" />
            Local-first
          </span>
          <div className="footer-legal">
            <span>{siteConfig.license}</span>
            <span>V{siteConfig.version}</span>
            <ExternalLink href={siteConfig.github}>
              GitHub <span aria-hidden="true">↗</span>
            </ExternalLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
