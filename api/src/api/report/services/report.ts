/**
 * Report service
 */

import { factories } from "@strapi/strapi";

/** Pure KPI computation - can be unit-tested easily */
function computeKpisFromItems(items) {
  /* To be implemented */
  return {
    attendancePct: 0,
    noShowPct: 0,
    avgRating: 0,
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
     * TODO: Implement for Task B
     * Persist computed KPIs to program-stats collection.
     * Use "api::program-stat.program-stat" content type.
     */
    async recompute(programId) {
      // TODO: Implement
      throw new Error("recompute not implemented");
    },
  })
);
