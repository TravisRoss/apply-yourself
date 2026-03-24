import { describe, expect, it } from "vitest"
import {
  searchApplications,
  filterByStatus,
  filterByDatePreset,
} from "./filter"

function makeApp(overrides: {
  company?: string
  position?: string
  location?: string | null
  status?: string
  appliedDate?: Date
}) {
  return {
    company: "Acme",
    position: "Engineer",
    location: "London",
    status: "applied",
    appliedDate: new Date("2026-01-01"),
    ...overrides,
  }
}

const apple = makeApp({
  company: "Apple",
  position: "iOS Engineer",
  location: "Cupertino",
  status: "applied",
})
const google = makeApp({
  company: "Google",
  position: "SRE",
  location: "London",
  status: "interview",
})
const meta = makeApp({
  company: "Meta",
  position: "React Engineer",
  location: null,
  status: "offer",
})
const rejected = makeApp({
  company: "Amazon",
  position: "Engineer",
  location: "Seattle",
  status: "rejected",
})

describe("searchApplications", () => {
  it("returns all applications when term is empty", () => {
    expect(searchApplications([apple, google], "")).toHaveLength(2)
  })

  it("returns all applications when term is whitespace only", () => {
    expect(searchApplications([apple, google], "   ")).toHaveLength(2)
  })

  it("matches by company name", () => {
    const result = searchApplications([apple, google, meta], "apple")
    expect(result).toEqual([apple])
  })

  it("matches by position", () => {
    const result = searchApplications([apple, google, meta], "react")
    expect(result).toEqual([meta])
  })

  it("matches by location", () => {
    const result = searchApplications([apple, google, meta], "london")
    expect(result).toEqual([google])
  })

  it("matches by status", () => {
    const result = searchApplications([apple, google, meta, rejected], "offer")
    expect(result).toEqual([meta])
  })

  it("is case insensitive", () => {
    const result = searchApplications([apple, google], "GOOGLE")
    expect(result).toEqual([google])
  })

  it("returns empty array when nothing matches", () => {
    expect(searchApplications([apple, google], "zzz")).toHaveLength(0)
  })

  it("returns empty array unchanged when input is empty", () => {
    expect(searchApplications([], "apple")).toHaveLength(0)
  })

  it("skips null location without crashing", () => {
    const result = searchApplications([meta], "cupertino")
    expect(result).toHaveLength(0)
  })

  it("does not mutate the original array", () => {
    const input = [apple, google]
    searchApplications(input, "apple")
    expect(input).toHaveLength(2)
  })
})

describe("filterByDatePreset", () => {
  const daysAgo = (n: number) => {
    const d = new Date()
    d.setDate(d.getDate() - n)
    return d
  }

  const recent = makeApp({ appliedDate: daysAgo(3) })
  const older = makeApp({ appliedDate: daysAgo(45) })
  const ancient = makeApp({ appliedDate: daysAgo(120) })

  it("returns all applications when preset is null", () => {
    expect(filterByDatePreset([recent, older, ancient], null)).toHaveLength(3)
  })

  it("filters to last 7 days", () => {
    expect(filterByDatePreset([recent, older, ancient], "7d")).toEqual([recent])
  })

  it("filters to last 30 days", () => {
    expect(filterByDatePreset([recent, older, ancient], "30d")).toEqual([
      recent,
    ])
  })

  it("filters to last 90 days", () => {
    expect(filterByDatePreset([recent, older, ancient], "90d")).toEqual([
      recent,
      older,
    ])
  })

  it("returns empty array when nothing falls in range", () => {
    expect(filterByDatePreset([ancient], "7d")).toHaveLength(0)
  })

  it("returns empty array unchanged when input is empty", () => {
    expect(filterByDatePreset([], "30d")).toHaveLength(0)
  })

  it("does not mutate the original array", () => {
    const input = [recent, older, ancient]
    filterByDatePreset(input, "7d")
    expect(input).toHaveLength(3)
  })
})

describe("filterByStatus", () => {
  it("returns all applications when statuses array is empty", () => {
    expect(filterByStatus([apple, google, meta], [])).toHaveLength(3)
  })

  it("filters by a single status", () => {
    const result = filterByStatus([apple, google, meta, rejected], ["applied"])
    expect(result).toEqual([apple])
  })

  it("filters by multiple statuses", () => {
    const result = filterByStatus(
      [apple, google, meta, rejected],
      ["applied", "interview"]
    )
    expect(result).toEqual([apple, google])
  })

  it("returns empty array when no applications match", () => {
    expect(filterByStatus([apple, google], ["offer"])).toHaveLength(0)
  })

  it("returns empty array unchanged when input is empty", () => {
    expect(filterByStatus([], ["applied"])).toHaveLength(0)
  })

  it("does not mutate the original array", () => {
    const input = [apple, google]
    filterByStatus(input, ["applied"])
    expect(input).toHaveLength(2)
  })
})
