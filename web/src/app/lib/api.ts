export async function fetchAttendanceReport(programId: number) {
  const url = `${process.env.API_URL}/api/reports/attendance?programId=${programId}`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: { "x-hr": "1" }, // interview shortcut: pretend HR user
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<{
    kpis: { attendancePct: number; noShowPct: number; avgRating: number };
    items: Array<{
      programId: number;
      coachId: number;
      present: boolean;
      rating?: number;
      date: string;
    }>;
  }>;
}
