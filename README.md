# Zephyrus website

The production marketing site for [Zephyrus](https://github.com/yash-dev007/Zephyrus), a
local-first AI harness for agents, memory, research and tools.

The original static design has been rebuilt as a statically exported **Next.js 16** application
with **React 19** and **TypeScript 6**. It keeps the pixel-font identity, dragon artwork and
scroll choreography while adding typed content, accessible markup, optimized assets, automated
tests and a reproducible production build.

## Stack

| Layer      | Choice                                                          |
| ---------- | --------------------------------------------------------------- |
| Framework  | Next.js 16 App Router with `output: "export"`                   |
| UI         | React 19, bespoke CSS (no utility framework)                    |
| Language   | TypeScript 6 in `strict` mode                                   |
| Motion     | Motion 14 for scroll-linked effects, CSS for entrances          |
| Smoothness | Lenis, automatically disabled for reduced-motion users          |
| Fonts      | Locally hosted Bubbledot, Geist Pixel and Inter via `next/font` |
| Icons      | Font Awesome React SVG icons                                    |
| Testing    | Vitest + Testing Library, Playwright                            |
| Tooling    | ESLint 9, Prettier 3, Sharp                                     |

## Requirements

- Node.js **22.12 or newer** (matches `engines` in `package.json`)
- npm 10 or newer

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The dev server supports hot reload for components and styles.

### Environment

Copy the example file before building for a real domain:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

| Variable               | Required | Description                                                                                                        |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | No       | Absolute public URL used for canonical links, Open Graph, sitemap and robots. Defaults to `http://localhost:3000`. |

The value is read at **build time**, so rebuild after changing it.

## Commands

| Command                   | What it does                                                         |
| ------------------------- | -------------------------------------------------------------------- |
| `npm run dev`             | Start the Next.js development server on port 3000.                   |
| `npm run build`           | Create the static production site in `out/`.                         |
| `npm run preview`         | Serve `out/` on port 3000 with `serve`.                              |
| `npm run typecheck`       | Run `tsc --noEmit` across the app, tests and scripts.                |
| `npm run lint`            | Run ESLint with the Next.js core-web-vitals and TypeScript rules.    |
| `npm run format`          | Format the repository with Prettier.                                 |
| `npm run format:check`    | Verify formatting without writing files.                             |
| `npm test`                | Run unit and component tests once.                                   |
| `npm run test:watch`      | Run Vitest in watch mode.                                            |
| `npm run test:coverage`   | Produce a V8 coverage report in `coverage/`.                         |
| `npm run test:e2e`        | Build the site, then run the Playwright suite.                       |
| `npm run test:e2e:ci`     | Run Playwright against an existing `out/` build, without rebuilding. |
| `npm run optimize:images` | Regenerate AVIF/WebP assets, PWA icons and the OG image with Sharp.  |
| `npm run capture`         | Capture QA screenshots into `qa/` (requires a running preview).      |

## Production build and deployment

```bash
# Set the real origin first; it is embedded in metadata and sitemap output.
$env:NEXT_PUBLIC_SITE_URL = "https://your-domain.com"   # PowerShell
# export NEXT_PUBLIC_SITE_URL="https://your-domain.com" # bash

npm run build
npm run preview # local verification at http://localhost:3000
```

Deploy the generated `out/` directory to any static host or CDN. No Node.js runtime is needed in
production.

- The site is exported with `trailingSlash: true`; canonical URLs end with `/`.
- Unknown routes are served from `out/404.html`; make sure the host is configured to use it.
- Deploy at the domain root. If you must use a sub-path, add matching `basePath` and
  `assetPrefix` settings in `next.config.ts`.
- Add caching and security headers at the host/CDN. Fingerprinted files under `_next/static/`
  can be cached immutably; HTML should be revalidated.
- `NEXT_PUBLIC_SITE_URL` only affects generated URLs. It does not configure DNS, TLS or redirects.

## Project structure

```text
.
├── e2e/                       # Playwright end-to-end tests
├── legacy/                    # Archived original HTML/CSS/JS, kept for reference
├── public/
│   ├── assets/img/            # Optimized AVIF/WebP artwork
│   ├── icons/                 # PWA and touch icons
│   └── og-image.jpg           # Social preview image
├── qa/                        # Baseline and current visual-regression captures
├── scripts/
│   ├── capture-screenshots.mjs
│   └── optimize-images.mjs
├── src/
│   ├── app/                   # Layout, page, manifest, robots and sitemap
│   ├── components/
│   │   ├── home/              # Hero, nav, manifesto, modules, footer
│   │   ├── providers/         # Lenis and reduced-motion coordination
│   │   └── ui/                # Reveal, ExternalLink, Icon, CountUp
│   ├── data/site.ts           # All copy, links, counts and typed content
│   ├── fonts/                 # Self-hosted WOFF2 files
│   ├── hooks/                 # Active section, reveal and motion hooks
│   ├── lib/                   # Shared utilities and highlight logic
│   ├── styles/                # base, hero, content, footer and motion CSS
│   └── test/                  # Vitest setup and browser API polyfills
├── next.config.ts
├── playwright.config.ts
└── vitest.config.mts
```

Most copy changes only require editing `src/data/site.ts`. Navigation and footer link types keep
external and in-page links distinct at compile time.

## Quality and behavior

### Accessibility

- Semantic landmarks, a visible-on-focus skip link and a single page `h1`.
- Keyboard-visible focus rings and navigation targets of at least 24×24 CSS pixels.
- Decorative icons and artwork are hidden from assistive technology; meaningful images have
  descriptive alt text.
- The site footer is a sibling of `<main>` so it exposes the `contentinfo` landmark correctly.
- `prefers-reduced-motion` disables Lenis, entrance animations and scroll reveals while keeping
  all content visible.

### Progressive enhancement

- Entrance and reveal hidden states are gated behind a `.js` class added before paint.
- A boot timeout removes that class if React fails to hydrate, so content never stays invisible.
- Counters are server-rendered with their final values and only animate after hydration.
- With JavaScript disabled the full page, navigation anchors and footer links remain usable.

### Performance and SEO

- Fully static HTML with no server component runtime.
- Self-hosted fonts with `display: swap`; the hero font and above-the-fold image are preloaded.
- Artwork is pre-generated as AVIF with WebP fallbacks and explicit dimensions to avoid layout
  shift. `next/image` optimization is intentionally disabled because there is no image server.
- Canonical URL, Open Graph and Twitter metadata, a `SoftwareApplication` JSON-LD block,
  `robots.txt`, `sitemap.xml`, web app manifest and PWA icons are generated at build time.
- External links use `target="_blank"` with `rel="noopener noreferrer"` and an accessible
  new-tab hint.

## Tests

Unit and component tests cover content invariants, URL helpers, highlight calculations and the
external-link policy.

```bash
npm test
npm run test:coverage
```

The Playwright suite checks content, navigation and smooth-scroll destinations, counter values,
external-link safety, metadata and static routes, keyboard access, no-JS rendering, reduced
motion, and horizontal overflow across desktop and mobile viewports.

```bash
npx playwright install chromium
npm run test:e2e
```

To use an installed browser instead of downloading Chromium:

```powershell
$env:PLAYWRIGHT_CHANNEL = "msedge"
npm run test:e2e
```

```bash
PLAYWRIGHT_CHANNEL=msedge npm run test:e2e
```

`npm run test:e2e` rebuilds `out/` first. The Playwright config starts `npm run preview` when no
server is already listening on port 3000.

## CI

`.github/workflows/ci.yml` runs two jobs on pushes to `main` and on pull requests:

1. **Verify** — install, format check, lint, typecheck, unit tests and production build.
2. **End-to-end** — install Chromium and run the Playwright suite against a fresh build.

Failure traces and screenshots are written to `test-results/` and the HTML report to
`playwright-report/`. Both are git-ignored; CI uploads them on failure.

## License

The website source is licensed under **AGPL-3.0**, matching the Zephyrus project. Zephyrus
branding, artwork and third-party fonts remain the property of their respective owners.
