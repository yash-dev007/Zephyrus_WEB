"use client";

import { useEffect, useId, useState, type ReactNode } from "react";

function extractText(node: ReactNode): string {
  if (node === null || node === undefined) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && node !== null) {
    const maybeLazy = node as { _init?: (payload: unknown) => unknown; _payload?: unknown };
    if (typeof maybeLazy._init === "function") {
      try {
        const resolved = maybeLazy._init(maybeLazy._payload) as ReactNode;
        return extractText(resolved);
      } catch {
        // Fall through
      }
    }
    if (
      "props" in node &&
      node.props &&
      typeof node.props === "object" &&
      "children" in node.props
    ) {
      return extractText((node.props as Record<string, unknown>).children as ReactNode);
    }
  }
  return "";
}

export function Mermaid({ chart, children }: { chart?: string; children?: ReactNode }) {
  const rawChart = (chart ?? extractText(children)).trim();
  const cleanChart = rawChart
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  const uniqueId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      if (!cleanChart) return;
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            darkMode: true,
            background: "transparent",
            primaryColor: "rgba(255, 255, 255, 0.05)",
            primaryTextColor: "#dcdfe4",
            primaryBorderColor: "rgba(255, 255, 255, 0.2)",
            lineColor: "#8fa391",
            secondaryColor: "rgba(185, 217, 176, 0.08)",
            secondaryBorderColor: "rgba(185, 217, 176, 0.3)",
            secondaryTextColor: "#dcdfe4",
            tertiaryColor: "rgba(255, 255, 255, 0.03)",
            tertiaryBorderColor: "rgba(255, 255, 255, 0.15)",
            tertiaryTextColor: "#9aa0a6",
            noteBkgColor: "rgba(255, 255, 255, 0.04)",
            noteTextColor: "#dcdfe4",
            noteBorderColor: "rgba(255, 255, 255, 0.18)",
            actorBkg: "rgba(255, 255, 255, 0.06)",
            actorBorder: "rgba(255, 255, 255, 0.25)",
            actorTextColor: "#ffffff",
            actorLineColor: "rgba(255, 255, 255, 0.3)",
            signalColor: "#b9d9b0",
            signalTextColor: "#e5e7eb",
            labelBoxBkgColor: "#141a16",
            labelBoxBorderColor: "rgba(255, 255, 255, 0.2)",
            labelTextColor: "#e5e7eb",
            loopTextColor: "#e5e7eb",
            activationBorderColor: "#b9d9b0",
            activationBkgColor: "rgba(185, 217, 176, 0.15)",
            fontFamily: "var(--font-mono, ui-monospace, monospace)",
            fontSize: "12px",
          },
          securityLevel: "loose",
        });

        const id = `mmd${uniqueId}`;
        const { svg: renderedSvg } = await mermaid.render(id, cleanChart);
        if (isMounted) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Mermaid render error:", err);
          setError(String(err));
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [cleanChart, uniqueId]);

  if (error) {
    return (
      <div className="docs-mermaid-error">
        <p className="text-xs text-red-400">Failed to render architecture diagram</p>
        <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto">{cleanChart}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="docs-mermaid-loading">
        <span>Rendering architecture diagram...</span>
      </div>
    );
  }

  return (
    <div
      className="docs-mermaid"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
