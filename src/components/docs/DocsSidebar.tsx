"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Item, Node, Root } from "fumadocs-core/page-tree";
import { normalizePath, pageMatchesPath, type DocVersion } from "@/lib/docs";
import { DocsVersionSwitcher } from "./DocsVersionSwitcher";
import { CloseIcon, GithubIcon } from "./icons";

export function DocsSidebar({
  tree,
  versions,
  knownUrls,
  open,
  onClose,
}: {
  tree: Root;
  versions: DocVersion[];
  knownUrls: string[];
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        className="docs-sidebar-scrim"
        data-open={open ? "" : undefined}
        aria-label="Close documentation navigation"
        onClick={onClose}
      />

      <aside
        className="docs-sidebar"
        id="docs-sidebar"
        data-open={open ? "" : undefined}
        aria-label="Documentation navigation"
      >
        <div className="docs-sidebar-inner">
          <div className="docs-sidebar-mobile-head">
            <span className="docs-sidebar-mobile-title">Documentation</span>
            <button
              type="button"
              className="docs-sidebar-close"
              onClick={onClose}
              aria-label="Close documentation navigation"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="docs-sidebar-version">
            <DocsVersionSwitcher versions={versions} knownUrls={knownUrls} compact />
          </div>

          <nav className="docs-sidebar-nav" aria-label="Documentation pages">
            <SidebarNodes
              nodes={tree.children}
              pathname={pathname}
              depth={0}
              onNavigate={onClose}
            />
          </nav>

          <div className="docs-sidebar-foot">
            <a
              href="https://github.com/yash-dev007/Zephyrus"
              target="_blank"
              rel="noopener noreferrer"
              className="docs-sidebar-foot-link"
            >
              <GithubIcon />
              Source
            </a>
            <Link href="/" className="docs-sidebar-foot-link">
              ← Back to site
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarNodes({
  nodes,
  pathname,
  depth,
  onNavigate,
}: {
  nodes: Node[];
  pathname: string;
  depth: number;
  onNavigate: () => void;
}) {
  return (
    <>
      {nodes.map((node, index) => {
        const key = node.$id ?? `${node.type}-${index}`;

        if (node.type === "separator") {
          return (
            <p className="docs-sidebar-separator" key={key}>
              {typeof node.name === "string" ? node.name : null}
            </p>
          );
        }

        if (node.type === "folder") {
          return (
            <div className="docs-sidebar-group" key={key}>
              {node.index ? (
                <SidebarPage
                  page={node.index}
                  pathname={pathname}
                  depth={depth}
                  onNavigate={onNavigate}
                  className="docs-sidebar-group-title"
                />
              ) : (
                <p className="docs-sidebar-group-title">
                  {typeof node.name === "string" ? node.name : null}
                </p>
              )}
              <div className="docs-sidebar-group-items">
                <SidebarNodes
                  nodes={node.children}
                  pathname={pathname}
                  depth={depth + 1}
                  onNavigate={onNavigate}
                />
              </div>
            </div>
          );
        }

        return (
          <SidebarPage
            key={key}
            page={node}
            pathname={pathname}
            depth={depth}
            onNavigate={onNavigate}
          />
        );
      })}
    </>
  );
}

function SidebarPage({
  page,
  pathname,
  depth,
  onNavigate,
  className,
}: {
  page: Item;
  pathname: string;
  depth: number;
  onNavigate: () => void;
  className?: string;
}) {
  const active = pageMatchesPath(page.url, pathname);
  const classes = ["docs-sidebar-link", className, active ? "is-active" : undefined]
    .filter(Boolean)
    .join(" ");
  const label = typeof page.name === "string" ? page.name : page.url;
  const isExternal = page.external || page.url.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={page.url}
        className={classes}
        data-depth={depth}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={normalizePath(page.url)}
      className={classes}
      data-depth={depth}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
    >
      <span className="docs-sidebar-marker" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
