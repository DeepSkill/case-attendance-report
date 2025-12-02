/**
 * report service
 */

import { factories } from "@strapi/strapi";

/** Pure KPI computation so it can be unit-tested easily */
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
    /** Compute from DB (attendance content-type) */
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

    async listAttendance(programId) {
      return await strapi.entityService.findMany("api::attendance.attendance", {
        filters: { programId },
        fields: ["programId", "coachId", "present", "rating", "date"],
        sort: { date: "desc" },
        publicationState: "live",
        limit: 25,
      });
    },

    /** Lifecycle helper to persist current KPIs into program-stats */
    async recompute(programId) {
      const kpis = await this.compute(programId);
      const [existing] = await strapi.entityService.findMany(
        "api::program-stat.program-stat",
        {
          filters: { programId },
          limit: 1,
        }
      );
      if (existing) {
        await strapi.entityService.update(
          "api::program-stat.program-stat",
          existing.id,
          { data: { ...kpis } }
        );
      } else {
        await strapi.entityService.create("api::program-stat.program-stat", {
          data: { programId, ...kpis },
        });
      }
      return kpis;
    },

    // export for unit tests if desired
    _test: { computeKpisFromItems },
  })
);
