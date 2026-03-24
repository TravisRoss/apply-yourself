export type SortKey = "company" | "appliedDate"
export type SortDirection = "asc" | "desc"

type Sortable = { company: string; appliedDate: Date }

function compareByCompany(a: Sortable, b: Sortable): number {
  return a.company.localeCompare(b.company)
}

function compareByDate(a: Sortable, b: Sortable): number {
  return a.appliedDate.getTime() - b.appliedDate.getTime()
}

export function sortApplications<T extends Sortable>(
  applications: T[],
  sortKey: SortKey,
  sortDirection: SortDirection
): T[] {
  const compare = sortKey === "company" ? compareByCompany : compareByDate
  const order = sortDirection === "asc" ? 1 : -1

  return applications.slice().sort((a, b) => compare(a, b) * order)
}
