/**
 * Interface for individual attendance report items
 */
export interface AttendanceReportItem {
  programId: number;
  coachId: number;
  present: boolean;
  rating?: number;
  date: string;
}

/**
 * Interface for KPIs in the attendance report
 */
export interface AttendanceKpis {
  attendancePct: number;
  noShowPct: number;
  avgRating: number;
}

/**
 * Interface for the complete attendance report response
 */
export interface AttendanceReportResponse {
  kpis: AttendanceKpis;
  items: AttendanceReportItem[];
}
