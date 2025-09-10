/**
 * report controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::report.report",
  ({ strapi }) => ({
    async attendance(ctx) {
      const { programId } = ctx.request.query;
      if (!programId) {
        ctx.throw(400, "programId is required");
      }

      const svc = strapi.service("api::report.report");
      console.log("svc", svc);
      const kpis = await svc.compute(Number(programId));

      ctx.body = {
        kpis,
        items: await svc.listAttendance(Number(programId)),
      };
    },
  })
);
