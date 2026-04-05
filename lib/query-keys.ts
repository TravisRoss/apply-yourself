export const queryKeys = {
  applications: (userId: string) => ["applications", userId] as const,
  applicationsThisWeek: (userId: string) =>
    ["applications", userId, "applications_this_week"] as const,
  applicationsForMonth: (userId: string, year: number, month: number) =>
    ["applications", userId, "month", year, month] as const,
  responsesThisWeek: (userId: string) =>
    ["applications", userId, "responses_this_week"] as const,
  application: (userId: string, applicationId: string) =>
    ["applications", userId, "application", applicationId] as const,
  offers: (userId: string) => ["applications", userId, "offers"] as const,
  statusApplied: (userId: string) =>
    ["applications", userId, "applied"] as const,
  interviews: (userId: string) => ["interviews", userId] as const,
  interview: (interviewId: string) =>
    ["interviews", "interview", interviewId] as const,
  interviewsThisWeek: (userId: string) =>
    ["interviews", userId, "this_week"] as const,
  contacts: (userId: string) => ["contacts", userId] as const,
  contact: (contactId: string) => ["contacts", "contact", contactId] as const,
}
