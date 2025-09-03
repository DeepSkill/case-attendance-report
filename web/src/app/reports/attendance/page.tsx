import { fetchAttendanceReport } from "@/lib/api";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: { programId?: string };
}) {
  const programId = Number(searchParams?.programId ?? "1");
  let data: Awaited<ReturnType<typeof fetchAttendanceReport>> | null = null;
  let error: string | null = null;
  try {
    data = await fetchAttendanceReport(programId);
  } catch (e: any) {
    error = e?.message ?? "Unknown error";
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Attendance Report</h1>
      {error && <p role="alert">Error: {error}</p>}
      {!error && data && (
        <>
          <section style={{ display: "flex", gap: 24, marginBottom: 16 }}>
            <Kpi
              label="Attendance"
              value={`${Math.round(data.kpis.attendancePct)}%`}
            />
            <Kpi
              label="No‑Show"
              value={`${Math.round(data.kpis.noShowPct)}%`}
            />
            <Kpi label="Avg Rating" value={data.kpis.avgRating.toFixed(2)} />
          </section>

          {/* TODO (candidate):
1) Map rows from data.items
2) Add ONE enhancement: client-side sort on Rating OR simple pagination (10/pg)
3) Handle empty state
*/}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>Program</Th>
                <Th>Coach</Th>
                <Th>Present</Th>
                <Th /* TODO: make clickable to sort */>Rating</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody>{/* TODO: render rows */}</tbody>
          </table>
          {/* TODO (optional): pager UI if candidate chooses pagination */}
        </>
      )}
      {!error && !data && <p>Loading…</p>}
    </main>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: 12,
        border: "1px solid #ddd",
        borderRadius: 8,
        minWidth: 120,
      }}
    >
      <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
      <div style={{ fontSize: 20 }}>{value}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        borderBottom: "1px solid #ccc",
        padding: "8px 4px",
      }}
      scope="col"
    >
      {children}
    </th>
  );
}
