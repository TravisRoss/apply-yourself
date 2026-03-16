export interface Settings {
  profile: {
    firstName: string
    lastName: string
    email: string
  }
  notifications: {
    emailNotifications: boolean
    interviewReminders: boolean
    weeklySummary: boolean
  }
}
