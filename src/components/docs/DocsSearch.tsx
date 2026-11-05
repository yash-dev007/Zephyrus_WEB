"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import {
  useHighlightQuery,
  useStaticSearch,
  type SearchResultItem,
} from "fumadocs-core/search/client";
import { normalizePath } from "@/lib/docs";
import { CloseIcon, FileTextIcon, SearchIcon } from "./icons";

const SEARCH_INDEX_URL = "/api/search";

export function DocsSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!open) return null;

  return <SearchDialog onClose={() => onOpenChange(false)} />;
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [selected, setSelected] = useState(0);

  const { search, onSearchChange, isLoading, data, error } = useStaticSearch({
    from: SEARCH_INDEX_URL,
  });
  const highlightRef = useHighlightQuery(search);

  const items = (data?.items ?? []).filter(
    (item): item is Exclude<SearchResultItem, { type: "table" }> => item.type !== "table",
  );
  const selectedIndex = items.length === 0 ? 0 : Math.min(selected, items.length - 1);

  useEffect(() => {
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function go(item: { url: string }) {
    onClose();
    router.push(normalizePath(item.url));
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((value) => Math.min(value + 1, items.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((value) => Math.max(value - 1, 0));
    } else if (event.key === "Enter") {
      const item = items[selectedIndex];
      if (item) {
        event.preventDefault();
        go(item);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  }

  const activeId = items[selectedIndex] ? `${listId}-result-${selectedIndex}` : undefined;

  return (
    <div
      className="docs-search-overlay"
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="docs-search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
      >
        <div className="docs-search-head">
          <SearchIcon className="docs-search-head-icon" />
          <input
            ref={inputRef}
            type="search"
            className="docs-search-input"
            placeholder="Search the documentation…"
            value={search}
            onChange={(event) => {
              setSelected(0);
              onSearchChange(event.target.value);
            }}
            onKeyDown={handleInputKeyDown}
            role="combobox"
            aria-expanded={Boolean(data)}
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            className="docs-search-close"
            onClick={onClose}
            aria-label="Close search"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="docs-search-body">
          {error ? (
            <p className="docs-search-message">
              Search is unavailable right now. Try again after reloading the page.
            </p>
          ) : isLoading ? (
            <p className="docs-search-message">Searching…</p>
          ) : search.trim().length === 0 ? (
            <div className="docs-search-empty">
              <p>Search pages, headings and code samples.</p>
              <p className="docs-search-hint">
                Try “Ollama”, “memory” or “docker compose”.
              </p>
            </div>
          ) : items.length === 0 ? (
            <p className="docs-search-message">
              No results for <strong>“{search}”</strong>.
            </p>
          ) : (
            <div
              id={listId}
              className="docs-search-results"
              role="listbox"
              aria-label="Search results"
              ref={highlightRef}
            >
              {items.map((item, index) => (
                <Link
                  key={`${item.id}-${index}`}
                  id={`${listId}-result-${index}`}
                  href={normalizePath(item.url)}
                  className="docs-search-result"
                  role="option"
                  aria-selected={index === selectedIndex}
                  data-selected={index === selectedIndex ? "" : undefined}
                  onPointerEnter={() => setSelected(index)}
                  onClick={(event) => {
                    event.preventDefault();
                    go(item);
                  }}
                >
                  <span className="docs-search-result-icon">
                    <FileTextIcon />
                  </span>
                  <span className="docs-search-result-copy">
                    <span className="docs-search-result-content">{item.content}</span>
                    {item.breadcrumbs?.length ? (
                      <span className="docs-search-result-crumbs">
                        {item.breadcrumbs.join(" / ")}
                      </span>
                    ) : null}
                  </span>
                  <span className="docs-search-result-type">{item.type}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="docs-search-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
