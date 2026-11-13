"use client";

import {
  isValidElement,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { Mermaid } from "./Mermaid";

function extractCodeText(node: ReactNode): string {
  if (node === null || node === undefined) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractCodeText).join("");
  if (typeof node === "object" && node !== null) {
    const maybeLazy = node as {
      _init?: (payload: unknown) => unknown;
      _payload?: unknown;
    };
    if (typeof maybeLazy._init === "function") {
      try {
        const resolved = maybeLazy._init(maybeLazy._payload) as ReactNode;
        return extractCodeText(resolved);
      } catch {
        // Fall through
      }
    }
    if (
      isValidElement(node) &&
      node.props &&
      typeof node.props === "object" &&
      "children" in node.props
    ) {
      return extractCodeText(
        (node.props as Record<string, unknown>).children as ReactNode,
      );
    }
  }
  return "";
}

type CodeBlockProps = ComponentPropsWithoutRef<"pre"> & {
  icon?: string;
  allowCopy?: string;
  "data-language"?: string;
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

  const codeText = extractCodeText(children).trim();
  const childProps =
    isValidElement(children) && typeof children.props === "object" && children.props
      ? (children.props as Record<string, unknown>)
      : null;

  const className = `${props.className ?? ""} ${childProps?.className ?? ""}`;
  const dataLanguage = props["data-language"] || childProps?.["data-language"];
  const isMermaid =
    dataLanguage === "mermaid" ||
    className.includes("language-mermaid") ||
    /^(flowchart|sequenceDiagram|stateDiagram(-v2)?|classDiagram|erDiagram|gantt|journey|pie)\b/.test(
      codeText,
    );

  if (isMermaid && codeText) {
    return <Mermaid chart={codeText} />;
  }

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
