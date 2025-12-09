"use client";

import { fetchAttendanceReport, ApiError } from "@/app/lib/api";
import { AttendanceReportResponse } from "@/app/lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SortColumn = "rating" | "date";
type SortOrder = "asc" | "desc";

export default function AttendancePage() {
  const searchParams = useSearchParams();
  const programId = Number(searchParams.get("programId") ?? "1");

  const [data, setData] = useState<AttendanceReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortColumn | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchAttendanceReport(programId);
        setData(result);
      } catch (e) {
        if (e instanceof ApiError) {
          setError(`Failed to load report: ${e.message} (${e.status})`);
        } else if (e instanceof Error) {
          setError(`Failed to load report: ${e.message}`);
        } else {
          setError("An unexpected error occurred");
        }
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [programId]);

  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const sortedItems = data?.items
    ? [...data.items].sort((a, b) => {
        if (!sortBy) return 0;

        let aValue: number;
        let bValue: number;

        if (sortBy === "rating") {
          aValue = a.rating ?? 0;
          bValue = b.rating ?? 0;
        } else {
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
        }

        const direction = sortOrder === "asc" ? 1 : -1;
        return (aValue - bValue) * direction;
      })
    : [];

  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Attendance Report</h1>
        <p>Loading…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Attendance Report</h1>
        <p role="alert" style={{ color: "#ef4444" }}>
          Error: {error}
        </p>
      </main>
    );
  }

  if (!data) {
    return (
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Attendance Report</h1>
        <p>No data available</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Attendance Report</h1>

      <section style={{ display: "flex", gap: 24, marginBottom: 16 }}>
        <Kpi
          label="Attendance"
          value={`${Math.round(data.kpis.attendancePct)}%`}
        />
        <Kpi label="No‑Show" value={`${Math.round(data.kpis.noShowPct)}%`} />
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
              Rating {sortBy === "rating" && (sortOrder === "asc" ? "↑" : "↓")}
            </Th>
            <Th
              style={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => handleSort("date")}
            >
              Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
            </Th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                style={{ textAlign: "center", padding: 24, color: "#666" }}
              >
                No attendance records found
              </td>
            </tr>
          ) : (
            sortedItems.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px 4px" }}>{item.programId}</td>
                <td style={{ padding: "8px 4px" }}>{item.coachId}</td>
                <td style={{ padding: "8px 4px" }}>
                  <span
                    style={{
                      color: item.present ? "#22c55e" : "#ef4444",
                      fontWeight: "bold",
                    }}
                  >
                    {item.present ? "✓ Present" : "✗ Absent"}
                  </span>
                </td>
                <td style={{ padding: "8px 4px" }}>
                  {item.rating != null ? item.rating.toFixed(1) : "N/A"}
                </td>
                <td style={{ padding: "8px 4px" }}>
                  {new Date(item.date).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
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
