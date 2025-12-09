import { AttendanceReportResponse } from "./types";

/**
 * Fetches attendance report data for a given program ID.
 *
 * TODO: Implement this function for the interview test.
 * The function should:
 * 1. Make an API call to GET /api/reports/attendance?programId={programId}
 * 2. Include the x-hr: 1 header for authentication
 * 3. Handle errors appropriately
 * 4. Return data matching the AttendanceReportResponse interface
 *
 * @param programId - The ID of the program to fetch attendance data for
 * @returns Promise<AttendanceReportResponse> - The attendance report data
 */
export async function fetchAttendanceReport(
  programId: number
): Promise<AttendanceReportResponse> {
  // TODO: Implement API call
  throw new Error("Not implemented");
}
