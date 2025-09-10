# case-attendance-report

This is the setup repository for the attendance report case used in interviews.

## Goals

### Task A (Policy): Protect GET /api/reports/attendance with is-hr policy.

### Task B (Lifecycle): On attendance create/update, recompute/persist KPIs into program-stats.

### Task C (Frontend): Fetch KPIs and render in a prebuilt table (wire data + 1 enhancement: sort or paginate).

**Implementation Required**: The `fetchAttendanceReport` function in `/web/src/app/lib/api.ts` needs to be implemented. The function should:

1. Make an API call to `GET /api/reports/attendance?programId={programId}`
2. Include the `x-hr: 1` header for authentication
3. Handle errors appropriately
4. Return data matching the `AttendanceReportResponse` interface

The TypeScript interfaces are already defined in `/web/src/app/lib/types.ts` to guide the implementation.

### Task D (Unit Test): Write a focused test for KPI aggregation using Vitest.

### Task E (PR): Push branch and open a Pull Request using the provided template.

## Credentials

### Strapi

Admin: john@doe.com - sE\*PxAghULN!8lrROE7aGuNvon2RP&hH
