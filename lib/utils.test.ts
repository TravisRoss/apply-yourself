import { describe, expect, test } from "vitest"
import { formatDate } from "./utils"

describe("formatDate", () => {
  test("formats a date as 'Mon D, YYYY'", () => {
    expect(formatDate(new Date("2026-03-14"), "en-US")).toBe("Mar 14, 2026")
  })

  test("formats a single-digit day without padding", () => {
    expect(formatDate(new Date("2026-01-05"), "en-US")).toBe("Jan 5, 2026")
  })

  test("formats the first day of the year", () => {
    expect(formatDate(new Date("2026-01-01"), "en-US")).toBe("Jan 1, 2026")
  })

  test("formats the last day of the year", () => {
    expect(formatDate(new Date("2026-12-31"), "en-US")).toBe("Dec 31, 2026")
  })

  test("formats a date using a different locale", () => {
    expect(formatDate(new Date("2026-03-14"), "fr-FR")).toBe("14 mars 2026")
  })
})
