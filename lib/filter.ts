type Filterable = {
  company: string
  position: string
  location: string | null
  status: string
}

type DateFilterable = { appliedDate: Date }

export type DatePreset = "7d" | "30d" | "90d" | null

export function filterByDatePreset<T extends DateFilterable>(
  applications: T[],
  preset: DatePreset
): T[] {
  if (!preset) return applications
  const days = { "7d": 7, "30d": 30, "90d": 90 }[preset]
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return applications.filter((app) => app.appliedDate >= cutoff)
}

export function searchApplications<T extends Filterable>(
  applications: T[],
  term: string
): T[] {
  const lower = term.toLowerCase().trim()
  if (!lower) return applications
  return applications.filter(
    (app) =>
      app.company.toLowerCase().includes(lower) ||
      app.position.toLowerCase().includes(lower) ||
      (app.location?.toLowerCase().includes(lower) ?? false) ||
      app.status.toLowerCase().includes(lower)
  )
}

export function filterByStatus<T extends Filterable>(
  applications: T[],
  statuses: string[]
): T[] {
  if (statuses.length === 0) return applications
  return applications.filter((app) => statuses.includes(app.status))
}
