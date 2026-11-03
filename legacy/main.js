/* ────────────────────────────────────────────────────────────
   Zephyrus motion layer
   Framer Motion (vanilla `motion`) for animation, Lenis for scroll.

   Everything here degrades to a static, fully visible page when
   `prefers-reduced-motion: reduce` is set, when JS fails, and when the
   deterministic recorder (`?rec=1`) drives the timeline instead.
   ──────────────────────────────────────────────────────────── */

import { animate, scroll, inView, stagger, Lenis } from "../vendor/motion/motion.es.js";

window.__motionBooted = true;

const doc = document.documentElement;
const reduce = doc.classList.contains("reduce");
const rec = new URLSearchParams(window.location.search).get("rec") === "1";

const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const unit = () => (window.innerWidth <= 760
  ? window.innerWidth / 390
  : Math.min(window.innerWidth / 1440, 1.33333));

/* Motion tokens — these mirror --ease-out-strong in assets/css/motion.css.
   Change them in one place, not two. */
const EASE_OUT = [0.16, 1, 0.3, 1];
const NAV_SPRING = { type: "spring", stiffness: 420, damping: 42, mass: 0.7 };

/* The recorder drives its own timeline and takes no scroll-linked motion. */
if (rec) {
  $$("[data-reveal]").forEach(el => el.removeAttribute("data-reveal"));
}

/* ── Smooth scroll ─────────────────────────────────────────── */

let lenis = null;

if (!reduce && !rec) {
  lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    smoothWheel: true,
    autoRaf: false
  });

  const frame = time => {
    lenis.raf(time);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function scrollToTarget(target) {
  const el = typeof target === "string" ? $(target) : target;
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, {
      duration: 1.15,
      easing: t => 1 - Math.pow(2, -10 * t),
      /* Overwrite Lenis' internal target, in case the page was repositioned
         from outside it (browser restore, hash load, Playwright, etc.). */
      force: true
    });
    return;
  }
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

/* ── Navigation: the white pill follows the active / focused link ── */

const nav = $("#nav");
const navSlider = $("#navSlider");
const navLinks = $$(".nav-link", nav);

function activeNavLink() {
  return $(".nav-link.is-active", nav) || navLinks[0];
}

function moveNavSlider(link, { instant = false } = {}) {
  if (!nav || !navSlider || !link) return;
  const navRect = nav.getBoundingClientRect();
  const rect = link.getBoundingClientRect();
  const x = rect.left - navRect.left;
  const y = rect.top - navRect.top;

  navSlider.style.width = `${rect.width}px`;
  navSlider.style.height = `${rect.height}px`;

  const transform = `translate3d(${x}px, ${y}px, 0)`;
  if (reduce || instant) {
    navSlider.style.transform = transform;
    return;
  }
  animate(navSlider, { transform }, NAV_SPRING);
}

function settleNav() {
  navLinks.forEach(link => link.classList.remove("is-hot"));
  moveNavSlider(activeNavLink());
}

navLinks.forEach(link => {
  link.addEventListener("focus", () => {
    navLinks.forEach(item => item.classList.toggle("is-hot", item === link));
    moveNavSlider(link);
  });
});

nav.addEventListener("focusout", event => {
  if (!nav.contains(event.relatedTarget)) settleNav();
});
window.addEventListener("resize", () => requestAnimationFrame(() => moveNavSlider(activeNavLink(), { instant: true })));
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => requestAnimationFrame(() => moveNavSlider(activeNavLink())));
}
requestAnimationFrame(() => moveNavSlider(activeNavLink(), { instant: true }));

/* ── In-page anchors go through Lenis ──────────────────────── */

$$('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    scrollToTarget(target);

    if (link.classList.contains("nav-link")) {
      navLinks.forEach(item => item.classList.toggle("is-active", item === link));
      requestAnimationFrame(() => moveNavSlider(link));
    }
    try { history.pushState(null, "", hash); } catch (error) {}
  });
});

window.addEventListener("popstate", () => {
  if (!location.hash) return;
  const target = document.querySelector(location.hash);
  if (target) scrollToTarget(target);
});

/* ── Count-up ──────────────────────────────────────────────── */

function countUp(element, target, { duration = 1.4, delay = 0 } = {}) {
  if (!element) return;
  const suffix = element.dataset.suffix || "";

  if (reduce) {
    element.textContent = `${target}${suffix}`;
    return;
  }

  element.textContent = `0${suffix}`;
  animate(0, target, {
    duration,
    delay,
    ease: EASE_OUT,
    onUpdate: value => { element.textContent = `${Math.round(value)}${suffix}`; },
    onComplete: () => { element.textContent = `${target}${suffix}`; }
  });
}

/* ── Hero entrance ─────────────────────────────────────────── */

const heroCounts = $$(".hero-stats .count");
const titleLines = $$(".title-inner");
const photoRise = $("#photoRise");
const riseItems = $$(".rise");

if (reduce) {
  heroCounts.forEach(el => { el.textContent = `${el.dataset.target}${el.dataset.suffix || ""}`; });
} else {
  const u = unit();

  animate(nav,
    { opacity: [0, 1], transform: [`translate3d(0, ${-16 * u}px, 0)`, "translate3d(0, 0, 0)"] },
    { duration: 0.82, delay: 0.04, ease: EASE_OUT });

  titleLines.forEach((line, index) => {
    animate(line,
      { transform: ["translateY(106%)", "translateY(0%)"] },
      { duration: 1, delay: 0.12 + index * 0.11, ease: EASE_OUT });
  });

  animate(photoRise,
    {
      opacity: [0, 1],
      transform: [`translate3d(0, ${40 * u}px, 0)`, "translate3d(0, 0, 0)"],
      filter: [`blur(${14 * u}px)`, "blur(0px)"]
    },
    { duration: 1.3, delay: 0.1, ease: EASE_OUT });

  riseItems.forEach((item, index) => {
    animate(item,
      { opacity: [0, 1], transform: [`translate3d(0, ${14 * u}px, 0)`, "translate3d(0, 0, 0)"] },
      {
        duration: 0.78,
        delay: 0.36 + index * 0.055,
        ease: EASE_OUT,
        /* Hand the element back to CSS so :hover transforms work again. */
        onComplete: () => { item.style.transform = ""; item.style.willChange = ""; }
      });
  });

  heroCounts.forEach((element, index) => {
    countUp(element, Number(element.dataset.target), { duration: 1.4, delay: 0.48 + index * 0.09 });
  });
}

/* ── Scroll-linked motion ──────────────────────────────────── */

const hero = $("#home");
const photoStage = $("#photoStage");
const statement = $("#statement");
const words = $$(".word", statement);
const footer = $(".site-footer");
const footerMega = $(".footer-mega");

const FROM = [111, 111, 111];
const TO = [244, 244, 244];
let lastStatementProgress = -1;

function updateStatement(progress) {
  const p = clamp(progress);
  if (Math.abs(p - lastStatementProgress) < 0.0005) return;
  lastStatementProgress = p;

  const total = words.length;
  const edge = 3;
  words.forEach((word, index) => {
    const local = clamp((p * (total + edge) - index) / edge);
    const red = Math.round(FROM[0] + (TO[0] - FROM[0]) * local);
    const green = Math.round(FROM[1] + (TO[1] - FROM[1]) * local);
    const blue = Math.round(FROM[2] + (TO[2] - FROM[2]) * local);
    word.style.color = `rgb(${red}, ${green}, ${blue})`;
  });
}

if (reduce) {
  updateStatement(1);
} else if (!rec) {
  /* Photo drifts slower than the page: depth without moving content. */
  if (photoStage && hero) {
    scroll(
      animate(photoStage, {
        transform: ["translate3d(0, 0%, 0) scale(1.04)", "translate3d(0, 13%, 0) scale(1)"]
      }, { ease: "linear" }),
      { target: hero, offset: ["start start", "end start"] }
    );
  }

  /* Statement lights up word by word — mirrors the old rect maths:
     starts at 88% of the viewport, ends when the block is 38% down. */
  if (statement) {
    scroll(progress => updateStatement(progress), {
      target: statement,
      offset: ["start 0.88", "end 0.38"]
    });
  }

  /* Footer wordmark rises into place as the footer is pulled up. */
  if (footer && footerMega) {
    scroll(
      animate(footerMega, {
        opacity: [0.35, 1],
        transform: ["translate3d(0, 10%, 0)", "translate3d(0, -2%, 0)"]
      }, { ease: "linear" }),
      { target: footer, offset: ["start end", "end end"] }
    );
  }
}

/* ── Recorder: a deterministic timeline for screenshots ────── */

if (rec) {
  const start = performance.now();
  function recorderFrame(now) {
    const elapsed = now - start;
    updateStatement(elapsed > 1300 ? (elapsed - 1300) / 2900 : 0);
    if (elapsed > 4200) updateStatement(1);
    if (photoStage) {
      const drift = window.innerWidth > 760 ? Math.min(elapsed / 12000, 1) * 48 * unit() : 0;
      photoStage.style.transform = drift ? `translate3d(0, ${drift}px, 0)` : "";
    }
    if (elapsed < 12000) requestAnimationFrame(recorderFrame);
  }
  requestAnimationFrame(recorderFrame);
}

/* ── Scroll-triggered reveals ──────────────────────────────── */

function revealOnEnter(container, items, { distance = 26, each = 0.07, delay = 0, amount = 0.18 } = {}) {
  if (reduce || rec || !container || !items.length) return;

  inView(container, () => {
    animate(items,
      { opacity: [0, 1], transform: [`translate3d(0, ${distance}px, 0)`, "translate3d(0, 0, 0)"] },
      {
        duration: 0.9,
        ease: EASE_OUT,
        delay: stagger(each, { startDelay: delay }),
        onComplete: () => items.forEach(item => {
          item.removeAttribute("data-reveal");
          item.style.opacity = "";
          item.style.transform = "";
          item.style.willChange = "";
        })
      });
  }, { amount, margin: "0px 0px -8% 0px" });
}

revealOnEnter($("#manifesto"), $$(".subline"), { distance: 18, each: 0 });

const trustPanel = $("#trustPanel");
revealOnEnter(trustPanel, $$(".trust-copy > *"), { each: 0.07 });
revealOnEnter(trustPanel, $$(".trust-card"), { distance: 32, each: 0.09, delay: 0.1, amount: 0.12 });

revealOnEnter($(".footer-cta"), $$(".footer-cta-copy > *"), { each: 0.06 });
revealOnEnter($(".footer-cta"), $$(".footer-term"), { distance: 22, delay: 0.18, each: 0 });
revealOnEnter($(".footer-main"), $$(".footer-identity, .footer-col"), { each: 0.06 });

/* ── Trust panel: counters and module tiles on first view ──── */

const trustCounts = $$(".trust-count .count", trustPanel);
const awardsCard = $("#awardsCard");
let trustStarted = false;

function startTrust({ duration = 1.4, delay = 0 } = {}) {
  if (!trustPanel || trustStarted) return;
  trustStarted = true;
  trustPanel.classList.add("trust-live");
  trustCounts.forEach((element, index) => {
    countUp(element, Number(element.dataset.target), { duration, delay: delay + index * 0.08 });
  });
}

if (reduce) {
  trustPanel?.classList.add("trust-live");
} else if (rec) {
  trustCounts.forEach(el => { el.textContent = `0${el.dataset.suffix || ""}`; });
  window.setTimeout(() => startTrust({ duration: 1.7, delay: 0 }), 3500);
  window.setTimeout(() => awardsCard.classList.add("is-lifted"), 5300);
} else {
  trustCounts.forEach(el => { el.textContent = `0${el.dataset.suffix || ""}`; });
  inView(trustPanel, () => startTrust({ duration: 1.4 }), { amount: 0.2, margin: "0px 0px -8% 0px" });
}

/* ── Scroll cue ────────────────────────────────────────────── */

$("#scrollCue")?.addEventListener("click", () => scrollToTarget($("#manifesto")));
