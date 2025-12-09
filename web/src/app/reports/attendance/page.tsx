"use client";

import { fetchAttendanceReport } from "@/app/lib/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * TODO: Implement this page for the interview test.
 *
 * Requirements:
 * 1. Fetch attendance data using fetchAttendanceReport (needs to be implemented in api.ts)
 * 2. Display KPIs (attendance %, no-show %, avg rating)
 * 3. Display attendance items in the table
 * 4. Handle loading and error states
 * 5. Add ONE enhancement: either sorting OR pagination
 */

export default function AttendancePage() {
  const searchParams = useSearchParams();
  const programId = Number(searchParams.get("programId") ?? "1");

  // TODO: Add state for data, loading, error
  // TODO: Add state for enhancement (sorting or pagination)

  // TODO: Fetch data using useEffect

  // TODO: Implement enhancement logic (sorting or pagination)

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Attendance Report</h1>

      {/* TODO: Add loading state */}
      {/* TODO: Add error state */}

      {/* KPI Section */}
      <section style={{ display: "flex", gap: 24, marginBottom: 16 }}>
        <Kpi label="Attendance" value="--%" />
        <Kpi label="No‑Show" value="--%" />
        <Kpi label="Avg Rating" value="--" />
      </section>

      {/* Data Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <Th>Program</Th>
            <Th>Coach</Th>
            <Th>Present</Th>
            <Th>Rating</Th>
            <Th>Date</Th>
          </tr>
        </thead>
        <tbody>
          {/* TODO: Map over items and render rows */}
          <tr>
            <td
              colSpan={5}
              style={{ textAlign: "center", padding: 24, color: "#666" }}
            >
              No data loaded yet
            </td>
          </tr>
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
