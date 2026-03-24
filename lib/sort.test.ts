import { describe, expect, it } from "vitest"
import { sortApplications } from "./sort"

function makeApplication(company: string, appliedDate: Date) {
  return { company, appliedDate }
}

const apple = makeApplication("Apple", new Date("2026-01-01"))
const google = makeApplication("Google", new Date("2026-02-01"))
const meta = makeApplication("Meta", new Date("2026-03-01"))

describe("sortApplications — company", () => {
  it("sorts ascending (A → Z)", () => {
    const result = sortApplications([meta, apple, google], "company", "asc")
    expect(result.map((a) => a.company)).toEqual(["Apple", "Google", "Meta"])
  })

  it("sorts descending (Z → A)", () => {
    const result = sortApplications([apple, meta, google], "company", "desc")
    expect(result.map((a) => a.company)).toEqual(["Meta", "Google", "Apple"])
  })
})

describe("sortApplications — appliedDate", () => {
  it("sorts ascending (oldest first)", () => {
    const result = sortApplications([meta, apple, google], "appliedDate", "asc")
    expect(result.map((a) => a.company)).toEqual(["Apple", "Google", "Meta"])
  })

  it("sorts descending (newest first)", () => {
    const result = sortApplications(
      [apple, meta, google],
      "appliedDate",
      "desc"
    )
    expect(result.map((a) => a.company)).toEqual(["Meta", "Google", "Apple"])
  })
})

describe("sortApplications — edge cases", () => {
  it("returns an empty array unchanged", () => {
    expect(sortApplications([], "company", "asc")).toEqual([])
  })

  it("returns a single-item array unchanged", () => {
    const result = sortApplications([apple], "company", "asc")
    expect(result).toEqual([apple])
  })

  it("does not mutate the original array", () => {
    const input = [meta, apple, google]
    const original = [...input]
    sortApplications(input, "company", "asc")
    expect(input).toEqual(original)
  })

  it("handles duplicate company names", () => {
    const a = makeApplication("Acme", new Date("2026-01-01"))
    const b = makeApplication("Acme", new Date("2026-02-01"))
    const result = sortApplications([a, b], "company", "asc")
    expect(result).toHaveLength(2)
  })

  it("handles duplicate dates", () => {
    const a = makeApplication("Apple", new Date("2026-01-01"))
    const b = makeApplication("Google", new Date("2026-01-01"))
    const result = sortApplications([a, b], "appliedDate", "asc")
    expect(result).toHaveLength(2)
  })
})
