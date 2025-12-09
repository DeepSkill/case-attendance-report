/**
 * Report service
 */

import { factories } from "@strapi/strapi";

/** Pure KPI computation - can be unit-tested easily */
function computeKpisFromItems(items) {
  if (!items || items.length === 0) {
    return { attendancePct: 0, noShowPct: 0, avgRating: 0 };
  }
  const total = items.length;
  const present = items.filter((x) => x.present).length;
  const rated = items.filter((x) => typeof x.rating === "number");
  const avgRating = rated.length
    ? rated.reduce((s, x) => s + x.rating, 0) / rated.length
    : 0;
  return {
    attendancePct: (present / total) * 100,
    noShowPct: ((total - present) / total) * 100,
    avgRating,
  };
}

export default factories.createCoreService(
  "api::report.report",
  ({ strapi }) => ({
    /** Compute KPIs from attendance records for a program */
    async compute(programId) {
      const items = await strapi.entityService.findMany(
        "api::attendance.attendance",
        {
          filters: { programId },
          fields: ["programId", "coachId", "present", "rating", "date"],
          sort: { date: "desc" },
          publicationState: "live",
        }
      );
      return computeKpisFromItems(items);
    },

    /** List attendance records for a program */
    async listAttendance(programId) {
      return await strapi.entityService.findMany("api::attendance.attendance", {
        filters: { programId },
        fields: ["programId", "coachId", "present", "rating", "date"],
        sort: { date: "desc" },
        publicationState: "live",
        limit: 25,
      });
    },

    /**
     * TODO: Implement this method for the interview test.
     * This method should:
     * 1. Compute the current KPIs using this.compute(programId)
     * 2. Find existing program-stat for this programId (or create new one)
     * 3. Update/create the program-stat with the computed KPIs
     *
     * Hint: Use strapi.entityService.findMany/update/create
     * Hint: The program-stat content type is "api::program-stat.program-stat"
     *
     * @param programId - The program ID to recompute KPIs for
     * @returns The computed KPIs
     */
    async recompute(programId) {
      // TODO: Implement KPI persistence to program-stats
      throw new Error("recompute not implemented");
    },
  })
);
