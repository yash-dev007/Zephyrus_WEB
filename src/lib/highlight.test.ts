import { describe, expect, it } from "vitest";
import { clamp, wordColor, HIGHLIGHT_FROM, HIGHLIGHT_TO } from "@/lib/highlight";

describe("clamp", () => {
  it("clamps values into the 0..1 range", () => {
    expect(clamp(-3)).toBe(0);
    expect(clamp(0.42)).toBe(0.42);
    expect(clamp(7)).toBe(1);
  });
});

describe("wordColor", () => {
  it("starts at the muted colour", () => {
    expect(wordColor(0, 0, 10)).toBe(`rgb(${HIGHLIGHT_FROM.join(", ")})`);
  });

  it("ends at the highlight colour", () => {
    expect(wordColor(1, 9, 10)).toBe(`rgb(${HIGHLIGHT_TO.join(", ")})`);
  });

  it("sweeps progressively across words", () => {
    const first = wordColor(0.5, 0, 10);
    const middle = wordColor(0.5, 5, 10);
    const last = wordColor(0.5, 9, 10);

    const brightness = (color: string) => Number(color.match(/\d+/g)?.[0] ?? 0);
    expect(brightness(first)).toBeGreaterThanOrEqual(brightness(middle));
    expect(brightness(middle)).toBeGreaterThanOrEqual(brightness(last));
  });

  it("never returns out-of-range colour channels", () => {
    for (const progress of [-1, 0, 0.25, 0.5, 0.75, 1, 2]) {
      for (let index = 0; index < 20; index += 1) {
        const channels = wordColor(progress, index, 20).match(/\d+/g)?.map(Number) ?? [];
        expect(channels).toHaveLength(3);
        channels.forEach((channel) => {
          expect(channel).toBeGreaterThanOrEqual(111);
          expect(channel).toBeLessThanOrEqual(244);
        });
      }
    }
  });
});
