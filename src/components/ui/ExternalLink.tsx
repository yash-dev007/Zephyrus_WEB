import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Icon, icons } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type ExternalLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "target" | "rel"
> & {
  href: string;
  children: ReactNode;
  showArrow?: boolean;
  arrowClassName?: string;
  "data-nav-key"?: string;
};

/**
 * Every outbound link gets the same safe target/rel policy and a screen-reader
 * hint that a new tab will open.
 */
export function ExternalLink({
  href,
  children,
  className,
  showArrow = false,
  arrowClassName,
  ...rest
}: ExternalLinkProps) {
  return (
    <a
      {...rest}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(className)}
    >
      {children}
      {showArrow ? (
        <Icon icon={icons.arrowUp} className={cn("arrow-ne", arrowClassName)} />
      ) : null}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
