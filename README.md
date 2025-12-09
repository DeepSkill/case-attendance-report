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

This will start both the API server (http://localhost:1337) and the web frontend (http://localhost:3000).

## Manual Setup

If you prefer to set up manually:

1. Install dependencies: `pnpm install`
2. Rebuild better-sqlite3: `cd api && npm rebuild better-sqlite3`
3. Ensure the `.env` file exists in the `api` directory
4. Start development: `pnpm dev`

## Goals

### Task A (Policy): Protect GET /api/reports/attendance with is-hr policy

**File to modify:** `api/src/api/report/policies/is-hr.ts`

Implement the policy stub to protect the attendance reports endpoint:

1. Check for the `x-hr` header in the request
2. Return `true` when header value is `"1"` (allow access)
3. Return `false` otherwise (Strapi automatically returns 403 Forbidden)

**Hint:** Access headers via `policyContext.request.get("x-hr")`

**Note:** The route configuration already applies this policy - you only need to implement the policy logic.

---

### Task B (Lifecycle): On attendance create/update/delete, recompute and persist KPIs

**Files to modify:**

- `api/src/api/attendance/content-types/attendance/lifecycles.ts` - Lifecycle hooks
- `api/src/api/report/services/report.ts` - The `recompute()` and `computeKpisFromItems()` methods

Implement lifecycle hooks to automatically update KPIs when attendance records change:

1. Add `afterCreate`, `afterUpdate`, and `afterDelete` hooks in `lifecycles.ts`
2. Each hook should call `strapi.service("api::report.report").recompute(programId)`
3. Implement the `recompute()` method in the report service to:
   - Compute KPIs using `computeKpisFromItems()`
   - Find or create a `program-stat` record for the programId
   - Store the computed KPIs (attendancePct, noShowPct, avgRating)
4. Implement `computeKpisFromItems()` to calculate:
   - Attendance percentage: `(present / total) * 100`
   - No-show percentage: `((total - present) / total) * 100`
   - Average rating: average of all items with a rating

**Hints:**

- Access programId from `event.result.programId` in lifecycle hooks
- Use `strapi.entityService.findMany/update/create` for database operations
- The program-stat content type is `"api::program-stat.program-stat"`
- Handle errors gracefully in lifecycle hooks (log but don't throw)

---

### Task C (Frontend): Fetch KPIs and render with sorting

**Files to modify:**

- `web/src/app/lib/api.ts` - The `fetchAttendanceReport()` function
- `web/src/app/reports/attendance/page.tsx` - Wire up data and add sorting

Implement the frontend to display attendance data:

1. **API Function** (`api.ts`):

   - Make a GET request to `/api/reports/attendance?programId={programId}`
   - Include the `x-hr: 1` header for authentication
   - Handle errors appropriately
   - Return data matching the `AttendanceReportResponse` interface

2. **Page Component** (`page.tsx`):
   - Fetch data using the API function
   - Display KPIs (attendance %, no-show %, avg rating)
   - Render attendance items in the table
   - Handle loading and error states
   - **Enhancement:** Add sorting by rating or date (clickable column headers)

**Hint:** The TypeScript interfaces in `web/src/app/lib/types.ts` define the expected data structure.

---

### Task D (Unit Test): Write focused tests for KPI aggregation

**File to create:** `api/tests/computeKpis.test.ts`

Write unit tests for the `computeKpisFromItems` function using Jest:

1. Test edge cases (empty array, null/undefined input)
2. Test attendance calculations (100%, 0%, mixed)
3. Test rating calculations (with ratings, without ratings, partial ratings)
4. Ensure `attendancePct + noShowPct = 100%`

**Run tests with:** `cd api && npm test`

---

### Task E (PR): Push branch and open a Pull Request

Push your implementation branch and open a Pull Request using the provided template.

---

## Credentials

### Strapi Admin

- Email: `john@doe.com`
- Password: `sE*PxAghULN!8lrROE7aGuNvon2RP&hH`
