import { computeKpisFromItems } from "@/app/lib/computeKpis";
import { describe, expect, it } from "vitest";

describe("computeKpisFromItems", () => {
  it("handles empty", () => {
    expect(computeKpisFromItems([])).toEqual({
      attendancePct: 0,
      noShowPct: 0,
      avgRating: 0,
    });
  });

  it("computes attendance and rating", () => {
    const k = computeKpisFromItems([
      { present: true, rating: 4 },
      { present: false },
      { present: true, rating: 2 },
    ]);
    expect(Math.round(k.attendancePct)).toBe(67);
    expect(Math.round(k.noShowPct)).toBe(33);
    expect(k.avgRating).toBeCloseTo(3.0, 1);
  });
});
