"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getActiveVersion, getVersionHref, type DocVersion } from "@/lib/docs";
import { CheckIcon, ChevronDownIcon } from "./icons";

export function DocsVersionSwitcher({
  versions,
  knownUrls,
  compact = false,
}: {
  versions: DocVersion[];
  knownUrls: string[];
  compact?: boolean;
}) {
  const pathname = usePathname();
  const active = getActiveVersion(pathname, versions);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="docs-version" ref={rootRef} data-compact={compact ? "" : undefined}>
      <button
        type="button"
        className="docs-version-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="docs-version-prefix">v</span>
        <span className="docs-version-name">{active.name}</span>
        <ChevronDownIcon className="docs-version-chevron" />
      </button>

      {open ? (
        <div className="docs-version-menu" role="menu" aria-label="Documentation version">
          <p className="docs-version-menu-label">Documentation version</p>
          {versions.map((version) => {
            const current = version.id === active.id;
            const href = getVersionHref(pathname, active, version, knownUrls);

            return (
              <Link
                key={version.id}
                href={href}
                role="menuitem"
                className="docs-version-option"
                data-current={current ? "" : undefined}
                aria-current={current ? "true" : undefined}
                onClick={() => setOpen(false)}
              >
                <span>{version.name}</span>
                {current ? <CheckIcon className="docs-version-check" /> : null}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
