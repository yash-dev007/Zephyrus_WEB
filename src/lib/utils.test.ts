import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("nav", false, undefined, "is-active", null)).toBe("nav is-active");
  });

  it("returns an empty string when nothing is provided", () => {
    expect(cn()).toBe("");
  });
});
