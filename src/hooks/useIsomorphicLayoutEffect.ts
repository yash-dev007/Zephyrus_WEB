"use client";

import { useEffect, useLayoutEffect } from "react";

/** useLayoutEffect without the SSR warning. */
export const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
