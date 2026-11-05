"use client";

import Link from "next/link";
import type { DocVersion } from "@/lib/docs";
import { DocsVersionSwitcher } from "./DocsVersionSwitcher";
import { GithubIcon, MenuIcon, SearchIcon } from "./icons";

export function DocsHeader({
  versions,
  knownUrls,
  navOpen,
  onOpenNav,
  onOpenSearch,
}: {
  versions: DocVersion[];
  knownUrls: string[];
  navOpen: boolean;
  onOpenNav: () => void;
  onOpenSearch: () => void;
}) {
  return (
    <header className="docs-header">
      <div className="docs-header-inner">
        <button
          type="button"
          className="docs-menu-button"
          onClick={onOpenNav}
          aria-label="Open documentation navigation"
          aria-expanded={navOpen}
          aria-controls="docs-sidebar"
        >
          <MenuIcon />
        </button>

        <Link href="/" className="docs-brand" aria-label="Zephyrus home">
          <img
            src="/assets/img/zephyrus-mark.png"
            alt=""
            width={24}
            height={26}
            aria-hidden="true"
          />
          <span className="docs-brand-word">ZEPHYRUS</span>
          <span className="docs-brand-sep" aria-hidden="true">
            /
          </span>
          <span className="docs-brand-docs">DOCS</span>
        </Link>

        <div className="docs-header-actions">
          <div className="docs-header-version">
            <DocsVersionSwitcher versions={versions} knownUrls={knownUrls} />
          </div>

          <button
            type="button"
            className="docs-search-trigger"
            onClick={onOpenSearch}
            aria-label="Search documentation"
          >
            <SearchIcon />
            <span className="docs-search-trigger-label">Search</span>
            <kbd className="docs-search-trigger-key">⌘K</kbd>
          </button>

          <a
            className="docs-header-link"
            href="https://github.com/yash-dev007/Zephyrus"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon />
            <span>GitHub</span>
          </a>

          <Link className="docs-header-link docs-header-back" href="/">
            Back to site
          </Link>
        </div>
      </div>
    </header>
  );
}
