import { AttendanceKpis } from "./types";

export type AttendanceItem = { present: boolean; rating?: number };
export type Kpis = AttendanceKpis;

export function computeKpisFromItems(items: AttendanceItem[]): Kpis {
  if (!items || items.length === 0)
    return { attendancePct: 0, noShowPct: 0, avgRating: 0 };
  const total = items.length;
  const present = items.filter((i) => i.present).length;
  const rated = items.filter((i) => typeof i.rating === "number");
  const avgRating = rated.length
    ? rated.reduce((s, i) => s + (i.rating as number), 0) / rated.length
    : 0;
  return {
    attendancePct: (present / total) * 100,
    noShowPct: ((total - present) / total) * 100,
    avgRating,
  };
}
