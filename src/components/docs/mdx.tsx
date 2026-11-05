import type { ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { Callout, Card, Cards, MDXLink } from "./mdx-primitives";
import { CodeBlock } from "./CodeBlock";
import { Tab, Tabs } from "./Tabs";

export function Steps({ children }: { children: ReactNode }) {
  return <div className="docs-steps">{children}</div>;
}

export function Step({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="docs-step">
      {title ? <h3 className="docs-step-title">{title}</h3> : null}
      <div className="docs-step-body">{children}</div>
    </section>
  );
}

export function Files({ children }: { children: ReactNode }) {
  return <div className="docs-files">{children}</div>;
}

export function Folder({ name, children }: { name: string; children?: ReactNode }) {
  return (
    <details className="docs-folder" open>
      <summary>{name}/</summary>
      {children ? <div className="docs-folder-body">{children}</div> : null}
    </details>
  );
}

export function File({ name }: { name: string }) {
  return <div className="docs-file">{name}</div>;
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    a: MDXLink,
    pre: CodeBlock,
    Callout,
    Cards,
    Card,
    Tabs,
    Tab,
    Steps,
    Step,
    Files,
    Folder,
    File,
    ...components,
  } satisfies MDXComponents;
}
