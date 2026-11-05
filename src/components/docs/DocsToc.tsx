"use client";

import { useRef } from "react";
import {
  AnchorProvider,
  ScrollProvider,
  TOCItem,
  type TOCItemType,
} from "fumadocs-core/toc";

export function DocsToc({ toc }: { toc: TOCItemType[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (toc.length === 0) return null;

  return (
    <aside className="docs-toc" aria-label="Table of contents">
      <p className="docs-toc-label">On this page</p>
      <AnchorProvider toc={toc} single>
        <ScrollProvider containerRef={containerRef}>
          <nav className="docs-toc-nav" ref={containerRef}>
            {toc.map((item) => (
              <TOCItem
                key={item.url}
                href={item.url}
                className="docs-toc-link"
                data-depth={item.depth}
              >
                {item.title}
              </TOCItem>
            ))}
          </nav>
        </ScrollProvider>
      </AnchorProvider>
      <a className="docs-toc-top" href="#docs-main">
        Back to top <span aria-hidden="true">↑</span>
      </a>
    </aside>
  );
}

export function DocsMobileToc({ toc }: { toc: TOCItemType[] }) {
  if (toc.length === 0) return null;

  return (
    <details className="docs-mobile-toc">
      <summary>
        <span>On this page</span>
        <span className="docs-mobile-toc-count">{toc.length}</span>
      </summary>
      <nav aria-label="Table of contents">
        {toc.map((item) => (
          <a
            key={item.url}
            href={item.url}
            className="docs-mobile-toc-link"
            data-depth={item.depth}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </details>
  );
}
