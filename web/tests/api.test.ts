import { fetchAttendanceReport, ApiError } from "@/app/lib/api";
import { AttendanceReportResponse } from "@/app/lib/types";

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("ApiError", () => {
  it("creates error with status and statusText", () => {
    const error = new ApiError(404, "Not Found");
    expect(error.status).toBe(404);
    expect(error.statusText).toBe("Not Found");
    expect(error.message).toBe("API request failed: 404 Not Found");
    expect(error.name).toBe("ApiError");
  });

  it("creates error with custom message", () => {
    const error = new ApiError(400, "Bad Request", "Invalid programId");
    expect(error.status).toBe(400);
    expect(error.statusText).toBe("Bad Request");
    expect(error.message).toBe("Invalid programId");
  });

  it("is an instance of Error", () => {
    const error = new ApiError(500, "Internal Server Error");
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
  });
});

describe("fetchAttendanceReport", () => {
  const mockResponse: AttendanceReportResponse = {
    kpis: {
      attendancePct: 75,
      noShowPct: 25,
      avgRating: 4.2,
    },
    items: [
      {
        id: 1,
        programId: 1,
        coachId: 101,
        present: true,
        rating: 5,
        date: "2024-01-15T10:00:00.000Z",
      },
      {
        id: 2,
        programId: 1,
        coachId: 102,
        present: false,
        date: "2024-01-15T10:00:00.000Z",
      },
    ],
  };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("successful requests", () => {
    it("fetches attendance report for a program ID", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchAttendanceReport(1);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("constructs correct URL with programId", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await fetchAttendanceReport(42);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:1337/api/reports/attendance?programId=42",
        expect.any(Object)
      );
    });

    it("includes required headers", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await fetchAttendanceReport(1);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            "x-hr": "1",
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("sets cache to no-store", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await fetchAttendanceReport(1);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          cache: "no-store",
        })
      );
    });
  });

  describe("error handling", () => {
    it("throws ApiError on non-ok response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: () => Promise.reject(new Error("No JSON")),
      });

      await expect(fetchAttendanceReport(1)).rejects.toThrow(ApiError);
    });

    it("includes status code in ApiError", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: () => Promise.reject(new Error("No JSON")),
      });

      try {
        await fetchAttendanceReport(999);
        fail("Expected ApiError to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(404);
        expect((error as ApiError).statusText).toBe("Not Found");
      }
    });

    it("extracts error message from JSON response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: () =>
          Promise.resolve({
            error: { message: "programId must be a positive integer" },
          }),
      });

      try {
        await fetchAttendanceReport(-1);
        fail("Expected ApiError to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe(
          "programId must be a positive integer"
        );
      }
    });

    it("extracts error message from flat JSON response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: () => Promise.resolve({ message: "Invalid request" }),
      });

      try {
        await fetchAttendanceReport(0);
        fail("Expected ApiError to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe("Invalid request");
      }
    });

    it("handles non-JSON error response gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      try {
        await fetchAttendanceReport(1);
        fail("Expected ApiError to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(500);
        expect((error as ApiError).message).toBe(
          "API request failed: 500 Internal Server Error"
        );
      }
    });

    it("handles network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchAttendanceReport(1)).rejects.toThrow("Network error");
    });
  });

  describe("edge cases", () => {
    it("handles empty items array", async () => {
      const emptyResponse: AttendanceReportResponse = {
        kpis: { attendancePct: 0, noShowPct: 0, avgRating: 0 },
        items: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(emptyResponse),
      });

      const result = await fetchAttendanceReport(1);
      expect(result.items).toEqual([]);
      expect(result.kpis.attendancePct).toBe(0);
    });

    it("handles large programId", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await fetchAttendanceReport(999999999);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:1337/api/reports/attendance?programId=999999999",
        expect.any(Object)
      );
    });
  });
});

