## Summary

- [ ] Implements `is-hr` policy on `/api/reports/attendance`
- [ ] KPI recompute on attendance create/update
- [ ] Frontend fetch + table wiring (+ one enhancement)
- [ ] Unit test for KPI aggregation (Vitest)

## How to test

1. Start Strapi (`pnpm develop`), Next (`pnpm dev`) and set `API_URL` in `web/.env.local`.
2. Create a few `attendance` entries (programId=1, mixed present/rating).
3. GET `/api/reports/attendance?programId=1` with header `x-hr: 1` should return KPIs + items.
4. Visit `/reports/attendance?programId=1` and verify KPIs + table.
5. Run tests: `pnpm test` in `web`.

## Notes

- Time spent:
- Trade-offs:
- Next steps if I had more time:
