/**
 * Lifecycle hooks for attendance records.
 * Automatically recomputes and persists KPIs when attendance data changes.
 */

interface LifecycleEvent {
  result: {
    programId?: number;
  };
}

export default {
  async afterCreate(event: LifecycleEvent) {
    await recomputeKpis(event.result?.programId);
  },

  async afterUpdate(event: LifecycleEvent) {
    await recomputeKpis(event.result?.programId);
  },

  async afterDelete(event: LifecycleEvent) {
    await recomputeKpis(event.result?.programId);
  },
};

/**
 * Helper to safely recompute KPIs for a program.
 * Handles null/undefined programId and catches errors to prevent lifecycle failures.
 */
async function recomputeKpis(programId: number | undefined): Promise<void> {
  if (programId == null) {
    strapi.log.warn(
      "Attendance lifecycle: programId is missing, skipping KPI recomputation"
    );
    return;
  }

  try {
    await strapi.service("api::report.report").recompute(programId);
    strapi.log.debug(`KPIs recomputed for program ${programId}`);
  } catch (error) {
    // Log but don't throw - we don't want to fail the main operation
    strapi.log.error(
      `Failed to recompute KPIs for program ${programId}:`,
      error
    );
  }
}
