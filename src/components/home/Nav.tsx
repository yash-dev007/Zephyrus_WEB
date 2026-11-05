"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { navItems, type SectionId } from "@/data/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { cn } from "@/lib/utils";

type PillRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useActiveSection("home");
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [pill, setPill] = useState<PillRect | null>(null);
  const [ready, setReady] = useState(false);
  const { scrollTo } = useSmoothScroll();

  const highlightedKey = focusedKey ?? active;
  const targetKey = navItems.find((item) => item.key === highlightedKey)?.key ?? "home";

  const updatePill = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const link = nav.querySelector<HTMLElement>(`[data-nav-key="${targetKey}"]`);
    if (!link) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    setPill({
      x: linkRect.left - navRect.left,
      y: linkRect.top - navRect.top,
      width: linkRect.width,
      height: linkRect.height,
    });
  }, [targetKey]);

  useIsomorphicLayoutEffect(() => {
    updatePill();
  }, [updatePill]);

  // Enable the slide transition only after the pill has been placed once, so
  // it does not fly in from the left on first paint.
  useEffect(() => {
    if (!pill || ready) return;
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, [pill, ready]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const onResize = () => requestAnimationFrame(updatePill);
    window.addEventListener("resize", onResize);

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    resizeObserver?.observe(nav);

    let cancelled = false;
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!cancelled) requestAnimationFrame(updatePill);
      });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      resizeObserver?.disconnect();
    };
  }, [updatePill]);

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: SectionId,
  ) => {
    event.preventDefault();
    setActive(sectionId);
    setFocusedKey(null);
    scrollTo(`#${sectionId}`);

    try {
      window.history.pushState(null, "", `#${sectionId}`);
    } catch {
      // History is unavailable in some embedded browsers; scrolling still works.
    }
  };

  useEffect(() => {
    const onPopState = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const item = navItems.find((entry) => entry.href === hash);
      if (!item || item.kind !== "section") return;
      setActive(item.sectionId);
      scrollTo(hash);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [scrollTo, setActive]);

  useEffect(() => {
    if (!window.location.hash) return;
    const frame = requestAnimationFrame(() => scrollTo(window.location.hash));
    return () => cancelAnimationFrame(frame);
  }, [scrollTo]);

  return (
    <nav
      ref={navRef}
      id="nav"
      className="nav"
      aria-label="Primary"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusedKey(null);
      }}
    >
      <span
        className="nav-slider"
        aria-hidden="true"
        data-ready={ready ? "" : undefined}
        style={
          pill
            ? {
                transform: `translate3d(${pill.x}px, ${pill.y}px, 0)`,
                width: `${pill.width}px`,
                height: `${pill.height}px`,
              }
            : undefined
        }
      />

      {navItems.map((item) => {
        const isHighlighted = highlightedKey === item.key;
        const commonProps = {
          className: cn("nav-link", isHighlighted && "is-hot"),
          "data-nav-key": item.key,
          onFocus: () => setFocusedKey(item.key),
        };

        if (item.kind === "external") {
          return (
            <ExternalLink
              key={item.key}
              href={item.href}
              {...commonProps}
              aria-current={undefined}
            >
              {item.label}
            </ExternalLink>
          );
        }

        if (item.kind === "route") {
          return (
            <Link
              key={item.key}
              href={item.href}
              {...commonProps}
              aria-current={undefined}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <a
            key={item.key}
            href={item.href}
            {...commonProps}
            aria-current={active === item.sectionId ? "location" : undefined}
            onClick={(event) => handleNavigate(event, item.sectionId)}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
