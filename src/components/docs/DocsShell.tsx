"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { Root } from "fumadocs-core/page-tree";
import { getActiveVersion, getSidebarTree, type DocVersion } from "@/lib/docs";
import { DocsHeader } from "./DocsHeader";
import { DocsSearch } from "./DocsSearch";
import { DocsSidebar } from "./DocsSidebar";

export function DocsShell({
  tree,
  versions,
  knownUrls,
  children,
}: {
  tree: Root;
  versions: DocVersion[];
  knownUrls: string[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const activeVersion = getActiveVersion(pathname, versions);
  const sidebarTree = getSidebarTree(tree, activeVersion);
  const [lastPath, setLastPath] = useState(pathname);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setNavOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="docs-shell">
      <a className="skip-link" href="#docs-main">
        Skip to content
      </a>

      <DocsHeader
        versions={versions}
        knownUrls={knownUrls}
        navOpen={navOpen}
        onOpenNav={() => setNavOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <div className="docs-body">
        <DocsSidebar
          tree={sidebarTree}
          versions={versions}
          knownUrls={knownUrls}
          open={navOpen}
          onClose={() => setNavOpen(false)}
        />
        <div className="docs-content">{children}</div>
      </div>

      <DocsSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
