"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, FileTextIcon, GithubIcon } from "./icons";

export function PageActions({
  markdownUrl,
  githubUrl,
}: {
  markdownUrl: string;
  githubUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  async function copyPage() {
    try {
      const response = await fetch(markdownUrl);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const markdown = await response.text();
      await navigator.clipboard.writeText(markdown);
      setError(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError(true);
      window.setTimeout(() => setError(false), 2400);
    }
  }

  return (
    <div className="docs-page-actions">
      <button type="button" className="docs-action" onClick={copyPage} aria-live="polite">
        {copied ? <CheckIcon /> : <CopyIcon />}
        <span>{copied ? "Copied" : error ? "Copy failed" : "Copy page"}</span>
      </button>

      <a
        className="docs-action"
        href={markdownUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FileTextIcon />
        <span>Markdown</span>
      </a>

      <a
        className="docs-action"
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <GithubIcon />
        <span>Edit on GitHub</span>
      </a>
    </div>
  );
}
