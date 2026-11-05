import type { ReactNode } from "react";
import Link from "next/link";

type CalloutType = "info" | "tip" | "warn" | "danger";

const calloutLabels: Record<CalloutType, string> = {
  info: "Note",
  tip: "Tip",
  warn: "Warning",
  danger: "Important",
};

export function Callout({
  title,
  type = "info",
  children,
}: {
  title?: string;
  type?: CalloutType;
  children: ReactNode;
}) {
  return (
    <aside className="docs-callout" data-type={type}>
      <p className="docs-callout-title">{title ?? calloutLabels[type]}</p>
      <div className="docs-callout-body">{children}</div>
    </aside>
  );
}

export function Cards({ children }: { children: ReactNode }) {
  return <div className="docs-cards">{children}</div>;
}

export function Card({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children?: ReactNode;
}) {
  const content = (
    <>
      <span className="docs-card-title">{title}</span>
      {children ? <span className="docs-card-body">{children}</span> : null}
      <span className="docs-card-arrow" aria-hidden="true">
        ↗
      </span>
    </>
  );

  if (href.startsWith("http")) {
    return (
      <a className="docs-card" href={href} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link className="docs-card" href={href}>
      {content}
    </Link>
  );
}

export function MDXLink({
  href = "",
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
