"use strict";

module.exports = {
  async afterCreate(event) {
    const { programId } = event.result;
    await strapi.service("api::report.stats").recompute(programId);
  },
  async afterUpdate(event) {
    const { programId } = event.result;
    await strapi.service("api::report.stats").recompute(programId);
  },
};
