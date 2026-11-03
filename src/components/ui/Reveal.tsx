"use client";

import {
  createElement,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { useReveal } from "@/hooks/useReveal";

type RevealProps<T extends ElementType> = {
  as?: T;
  delay?: number;
  distance?: number;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * Applies the shared scroll-reveal state to any element. The hidden state is
 * CSS-only and gated behind the `js` class, so the content is always visible
 * when scripting or motion is unavailable.
 */
export function Reveal<T extends ElementType = "div">({
  as,
  delay,
  distance,
  className,
  children,
  ...rest
}: RevealProps<T>) {
  const { ref, ...reveal } = useReveal<HTMLElement>({ delay, distance });
  const Component = (as ?? "div") as ElementType;

  return createElement(Component, { ...rest, ...reveal, ref, className }, children);
}
