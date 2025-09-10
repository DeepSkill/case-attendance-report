"use client";

import { fetchAttendanceReport } from "@/app/lib/api";
import { AttendanceReportResponse } from "@/app/lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AttendancePage() {
  const searchParams = useSearchParams();
  const programId = Number(searchParams.get("programId") ?? "1");
  const [data, setData] = useState<AttendanceReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"rating" | "date" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const result = await fetchAttendanceReport(programId);
        setData(result);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [programId]);

  const handleSort = (column: "rating" | "date") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const sortedItems = data?.items
    ? [...data.items].sort((a, b) => {
        if (!sortBy) return 0;

        let aValue: number | string;
        let bValue: number | string;

        if (sortBy === "rating") {
          aValue = a.rating ?? 0;
          bValue = b.rating ?? 0;
        } else if (sortBy === "date") {
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
        } else {
          return 0;
        }

        if (sortOrder === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      })
    : [];

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

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>Program</Th>
                <Th>Coach</Th>
                <Th>Present</Th>
                <Th
                  style={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort("rating")}
                >
                  Rating{" "}
                  {sortBy === "rating" && (sortOrder === "asc" ? "↑" : "↓")}
                </Th>
                <Th
                  style={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort("date")}
                >
                  Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </Th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </>
      )}
      {loading && <p>Loading…</p>}
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

function Th({
  children,
  style,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <th
      style={{
        textAlign: "left",
        borderBottom: "1px solid #ccc",
        padding: "8px 4px",
        ...style,
      }}
      scope="col"
      onClick={onClick}
    >
      {children}
    </th>
  );
}
