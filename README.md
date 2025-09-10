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

### Task B (Lifecycle): On attendance create/update, recompute/persist KPIs into program-stats.

### Task C (Frontend): Fetch KPIs and render in a prebuilt table (wire data + 1 enhancement: sort or paginate).

### Task D (Unit Test): Write a focused test for KPI aggregation using Vitest.

### Task E (PR): Push branch and open a Pull Request using the provided template.

## Credentials

### Strapi

Admin: john@doe.com - sE\*PxAghULN!8lrROE7aGuNvon2RP&hH
