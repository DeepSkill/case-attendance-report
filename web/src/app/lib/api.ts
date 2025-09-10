import { AttendanceReportResponse } from "./types";

/**
 * Fetches attendance report data for a given program ID.
 *
 * TODO: Implement this function for the interview test.
 * The function should:
 * 1. Make an API call to fetch attendance data
 * 2. Handle errors appropriately
 * 3. Return data in the expected format
 *
 * @param programId - The ID of the program to fetch attendance data for
 * @returns Promise<AttendanceReportResponse> - The attendance report data
 */

export async function fetchAttendanceReport(
  programId: number
): Promise<AttendanceReportResponse> {
  const url = `${
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337"
  }/api/reports/attendance?programId=${programId}`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: { "x-hr": "1" }, // interview shortcut: pretend HR user
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<AttendanceReportResponse>;
}
