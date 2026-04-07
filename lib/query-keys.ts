export const queryKeys = {
  applications: () => ["applications"] as const,
  applicationsThisWeek: () =>
    ["applications", "applications_this_week"] as const,
  applicationsForMonth: (year: number, month: number) =>
    ["applications", "month", year, month] as const,
  responsesThisWeek: () =>
    ["applications", "responses_this_week"] as const,
  application: (applicationId: string) =>
    ["applications", "application", applicationId] as const,
  offers: () => ["applications", "offers"] as const,
  statusApplied: () => ["applications", "applied"] as const,
  interviews: () => ["interviews"] as const,
  interview: (interviewId: string) =>
    ["interviews", "interview", interviewId] as const,
  interviewsThisWeek: () => ["interviews", "this_week"] as const,
  contacts: (userId: string) => ["contacts", userId] as const,
  contact: (contactId: string) => ["contacts", "contact", contactId] as const,
  notificationPreferences: (userId: string) =>
    ["settings", userId, "notification_preferences"] as const,
}
