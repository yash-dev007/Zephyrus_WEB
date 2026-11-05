"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";

type CodeBlockProps = ComponentPropsWithoutRef<"pre"> & {
  icon?: string;
  allowCopy?: string;
};

export function CodeBlock({
  children,
  title,
  icon,
  allowCopy,
  ...props
}: CodeBlockProps) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const showCopy = allowCopy !== "false";

  async function copy() {
    const text = ref.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be denied; the code remains selectable.
    }
  }

  return (
    <div className="docs-code">
      {title || icon ? (
        <div className="docs-code-head">
          {icon ? (
            <span
              className="docs-code-icon"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: icon }}
            />
          ) : null}
          {title ? <span className="docs-code-title">{title}</span> : null}
        </div>
      ) : null}

      {showCopy ? (
        <button
          type="button"
          className="docs-code-copy"
          data-titled={title ? "" : undefined}
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      ) : null}

      <pre ref={ref} {...props}>
        {children}
      </pre>
    </div>
  );
}
