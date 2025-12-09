import { computeKpisFromItems } from "../src/api/report/services/report";

describe("computeKpisFromItems", () => {
  describe("edge cases", () => {
    it("returns zeros for empty array", () => {
      const result = computeKpisFromItems([]);
      expect(result).toEqual({
        attendancePct: 0,
        noShowPct: 0,
        avgRating: 0,
      });
    });

    it("returns zeros for null input", () => {
      const result = computeKpisFromItems(null);
      expect(result).toEqual({
        attendancePct: 0,
        noShowPct: 0,
        avgRating: 0,
      });
    });

    it("returns zeros for undefined input", () => {
      const result = computeKpisFromItems(undefined);
      expect(result).toEqual({
        attendancePct: 0,
        noShowPct: 0,
        avgRating: 0,
      });
    });

    it("handles single item correctly", () => {
      const result = computeKpisFromItems([{ present: true, rating: 5 }]);
      expect(result).toEqual({
        attendancePct: 100,
        noShowPct: 0,
        avgRating: 5,
      });
    });
  });

  describe("attendance calculations", () => {
    it("calculates 100% attendance when all present", () => {
      const result = computeKpisFromItems([
        { present: true },
        { present: true },
        { present: true },
      ]);
      expect(result.attendancePct).toBe(100);
      expect(result.noShowPct).toBe(0);
    });

    it("calculates 0% attendance when all absent", () => {
      const result = computeKpisFromItems([
        { present: false },
        { present: false },
        { present: false },
      ]);
      expect(result.attendancePct).toBe(0);
      expect(result.noShowPct).toBe(100);
    });

    it("calculates mixed attendance correctly", () => {
      const result = computeKpisFromItems([
        { present: true },
        { present: false },
        { present: true },
      ]);
      expect(Math.round(result.attendancePct)).toBe(67);
      expect(Math.round(result.noShowPct)).toBe(33);
    });

    it("ensures attendance + noShow equals 100%", () => {
      const result = computeKpisFromItems([
        { present: true },
        { present: false },
        { present: true },
        { present: false },
        { present: true },
      ]);
      expect(result.attendancePct + result.noShowPct).toBe(100);
    });
  });

  describe("rating calculations", () => {
    it("calculates average rating correctly", () => {
      const result = computeKpisFromItems([
        { present: true, rating: 4 },
        { present: true, rating: 5 },
        { present: true, rating: 3 },
      ]);
      expect(result.avgRating).toBe(4);
    });

    it("returns 0 average when no ratings provided", () => {
      const result = computeKpisFromItems([
        { present: true },
        { present: false },
      ]);
      expect(result.avgRating).toBe(0);
    });

    it("ignores items without ratings in average calculation", () => {
      const result = computeKpisFromItems([
        { present: true, rating: 4 },
        { present: true }, // no rating
        { present: true, rating: 2 },
      ]);
      expect(result.avgRating).toBe(3); // (4 + 2) / 2
    });

    it("handles rating of 0 correctly", () => {
      // Rating of 0 should be included in average (it's a valid rating)
      const result = computeKpisFromItems([
        { present: true, rating: 0 },
        { present: true, rating: 4 },
      ]);
      expect(result.avgRating).toBe(2); // (0 + 4) / 2
    });

    it("calculates average with decimal precision", () => {
      const result = computeKpisFromItems([
        { present: true, rating: 3 },
        { present: true, rating: 4 },
      ]);
      expect(result.avgRating).toBe(3.5);
    });
  });

  describe("combined scenarios", () => {
    it("computes all KPIs correctly for mixed data", () => {
      const result = computeKpisFromItems([
        { present: true, rating: 4 },
        { present: false },
        { present: true, rating: 2 },
      ]);
      expect(Math.round(result.attendancePct)).toBe(67);
      expect(Math.round(result.noShowPct)).toBe(33);
      expect(result.avgRating).toBeCloseTo(3.0, 5);
    });

    it("handles large datasets", () => {
      const items = Array.from({ length: 1000 }, (_, i) => ({
        present: i % 2 === 0,
        rating: (i % 5) + 1,
      }));
      const result = computeKpisFromItems(items);
      expect(result.attendancePct).toBe(50);
      expect(result.noShowPct).toBe(50);
      expect(result.avgRating).toBe(3); // Average of 1,2,3,4,5 repeated
    });
  });
});

