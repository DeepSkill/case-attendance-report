/**
 * Report controller
 * Handles attendance report requests with proper validation.
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::report.report",
  ({ strapi }) => ({
    async attendance(ctx) {
      const { programId } = ctx.request.query;

      // Validate programId is provided
      if (!programId) {
        return ctx.badRequest("programId query parameter is required");
      }

      // Validate programId is a valid number
      const parsedProgramId = Number(programId);
      if (!Number.isInteger(parsedProgramId) || parsedProgramId <= 0) {
        return ctx.badRequest("programId must be a positive integer");
      }

      const service = strapi.service("api::report.report");
      const [kpis, items] = await Promise.all([
        service.compute(parsedProgramId),
        service.listAttendance(parsedProgramId),
      ]);

      ctx.body = { kpis, items };
    },
  })
);
