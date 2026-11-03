import { describe, expect, it } from "vitest";
import {
  footerColumns,
  localRuntimes,
  navItems,
  siteConfig,
  statementLines,
} from "@/data/site";

describe("site data", () => {
  it("exposes the canonical project links", () => {
    expect(siteConfig.github).toMatch(/^https:\/\/github\.com\//);
    expect(siteConfig.docs).toContain("/docs/setup.md");
    expect(siteConfig.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("has a unique key and destination for every nav item", () => {
    const keys = navItems.map((item) => item.key);
    expect(new Set(keys).size).toBe(keys.length);

    const internal = navItems.filter((item) => !item.external);
    expect(internal.every((item) => item.href.startsWith("#"))).toBe(true);
    expect(internal.every((item) => Boolean(item.sectionId))).toBe(true);

    const external = navItems.filter((item) => item.external);
    expect(external.every((item) => item.href.startsWith("https://"))).toBe(true);
  });

  it("keeps the footer columns fully described", () => {
    expect(footerColumns).toHaveLength(3);
    for (const column of footerColumns) {
      expect(column.title.length).toBeGreaterThan(0);
      expect(column.links).toHaveLength(4);
      for (const link of column.links) {
        expect(link.label.length).toBeGreaterThan(0);
        expect(link.href.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps the manifesto statement and provider list populated", () => {
    expect(statementLines.flat().length).toBeGreaterThan(20);
    expect(localRuntimes).toContain("Ollama");
    expect(localRuntimes).toContain("llama.cpp");
  });
});
