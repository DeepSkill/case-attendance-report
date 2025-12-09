/**
 * Report service
 * Handles KPI computation and attendance data retrieval.
 */

import { factories } from "@strapi/strapi";

interface AttendanceItem {
  present?: boolean;
  rating?: number;
}

interface Kpis {
  attendancePct: number;
  noShowPct: number;
  avgRating: number;
}

/**
 * Pure KPI computation function - can be unit-tested without Strapi.
 * @param items - Array of attendance items with present and optional rating
 * @returns Computed KPIs: attendance %, no-show %, and average rating
 */
export function computeKpisFromItems(
  items: AttendanceItem[] | null | undefined
): Kpis {
  if (!items || items.length === 0) {
    return { attendancePct: 0, noShowPct: 0, avgRating: 0 };
  }

  const total = items.length;
  const presentCount = items.filter((item) => item.present === true).length;
  const ratedItems = items.filter((item) => typeof item.rating === "number");

  const avgRating =
    ratedItems.length > 0
      ? ratedItems.reduce((sum, item) => sum + (item.rating as number), 0) /
        ratedItems.length
      : 0;

  return {
    attendancePct: (presentCount / total) * 100,
    noShowPct: ((total - presentCount) / total) * 100,
    avgRating,
  };
}

export default factories.createCoreService(
  "api::report.report",
  ({ strapi }) => ({
    /**
     * Compute KPIs from attendance records for a program.
     */
    async compute(programId: number): Promise<Kpis> {
      const items = await strapi.entityService.findMany(
        "api::attendance.attendance",
        {
          filters: { programId },
          fields: ["present", "rating"],
          sort: { date: "desc" },
          publicationState: "live",
        }
      );
      return computeKpisFromItems(items);
    },

    /**
     * List attendance records for a program.
     */
    async listAttendance(programId: number) {
      return strapi.entityService.findMany("api::attendance.attendance", {
        filters: { programId },
        fields: ["id", "programId", "coachId", "present", "rating", "date"],
        sort: { date: "desc" },
        publicationState: "live",
        limit: 25,
      });
    },

    /**
     * Lifecycle helper to recompute and persist KPIs into program-stats.
     * Called automatically when attendance records change.
     */
    async recompute(programId: number): Promise<Kpis> {
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
  })
);
