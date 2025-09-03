"use strict";

module.exports = {
  async attendance(ctx) {
    const { programId } = ctx.request.query;
    if (!programId) {
      ctx.throw(400, "programId is required");
    }

    const svc = strapi.service("api::report.stats");
    const kpis = await svc.compute(Number(programId));

    ctx.body = {
      kpis,
      items: await svc.listAttendance(Number(programId)),
    };
  },
};
