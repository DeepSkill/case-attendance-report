import { AttendanceReportResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

/**
 * Custom error class for API errors with status code and response details.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    message?: string
  ) {
    super(message || `API request failed: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

/**
 * Fetches attendance report data for a given program ID.
 *
 * @param programId - The ID of the program to fetch attendance data for
 * @returns Promise<AttendanceReportResponse> - The attendance report data
 * @throws ApiError when the request fails
 */
export async function fetchAttendanceReport(
  programId: number
): Promise<AttendanceReportResponse> {
  const url = `${API_BASE_URL}/api/reports/attendance?programId=${programId}`;

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "x-hr": "1",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let errorMessage: string | undefined;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody?.error?.message || errorBody?.message;
    } catch {
      // Response body is not JSON, use default message
    }
    throw new ApiError(response.status, response.statusText, errorMessage);
  }

  return response.json() as Promise<AttendanceReportResponse>;
}
