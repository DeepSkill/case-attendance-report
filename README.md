# case-attendance-report

This is the setup repository for the attendance report case used in interviews.

## Quick Start

After cloning the repository, run the setup script to ensure everything works correctly:

```bash
./setup.sh
```

Then start the development server:

```bash
pnpm dev
```

This will start both the API server (http://localhost:1337) and the web frontend.

## Manual Setup

If you prefer to set up manually:

1. Install dependencies: `pnpm install`
2. Rebuild better-sqlite3: `cd api && npm rebuild better-sqlite3`
3. Ensure the `.env` file exists in the `api` directory
4. Start development: `pnpm dev`

## Goals

### Task A (Policy): Protect GET /api/reports/attendance with is-hr policy.

**Implementation Required**: Create a policy to protect the attendance reports endpoint. The policy should:

1. Check for the `x-hr` header in the request
2. Allow access only when the header value is `1` (indicating HR user)
3. Return appropriate error response (401/403) for unauthorized access
4. Apply this policy to the `GET /api/reports/attendance` route

**Files to modify**: Look for policy configuration files in the `/api` directory, typically in `config/policies.js` or similar.

### Task B (Lifecycle): On attendance create/update, recompute/persist KPIs into program-stats.

**Implementation Required**: Create lifecycle hooks to automatically update KPIs when attendance records change. The implementation should:

1. Create a lifecycle hook for attendance model (create/update/delete operations)
2. Recalculate KPIs using the existing `computeKpisFromItems` function from `/web/src/app/lib/computeKpis.ts`
3. Store the computed KPIs in a `program-stats` collection/content type
4. Ensure the KPI calculation includes:
   - Attendance percentage
   - No-show percentage
   - Average rating
5. Handle edge cases (empty data, division by zero, etc.)

**Files to modify**: Look for lifecycle hook configuration in the `/api` directory, typically in `src/api/attendance/content-types/attendance/lifecycles.js` or similar.

### Task C (Frontend): Fetch KPIs and render in a prebuilt table (wire data + 1 enhancement: sort or paginate).

**Implementation Required**: The `fetchAttendanceReport` function in `/web/src/app/lib/api.ts` needs to be implemented. The function should:

1. Make an API call to `GET /api/reports/attendance?programId={programId}`
2. Include the `x-hr: 1` header for authentication
3. Handle errors appropriately
4. Return data matching the `AttendanceReportResponse` interface

The TypeScript interfaces are already defined in `/web/src/app/lib/types.ts` to guide the implementation.

### Task D (Unit Test): Write a focused test for KPI aggregation.

### Task E (PR): Push branch and open a Pull Request using the provided template.

## Credentials

### Strapi

Admin: john@doe.com - sE\*PxAghULN!8lrROE7aGuNvon2RP&hH
