import { describe, expect, it } from "vitest"
import { calculateResponseRate, formatDate } from "./utils"

describe("formatDate", () => {
  it("formats a date as 'Mon D, YYYY'", () => {
    expect(formatDate(new Date("2026-03-14"), "en-US")).toEqual("Mar 14, 2026")
  })

  it("formats a single-digit day without padding", () => {
    expect(formatDate(new Date("2026-01-05"), "en-US")).toEqual("Jan 5, 2026")
  })

  it("formats the first day of the year", () => {
    expect(formatDate(new Date("2026-01-01"), "en-US")).toEqual("Jan 1, 2026")
  })

  it("formats the last day of the year", () => {
    expect(formatDate(new Date("2026-12-31"), "en-US")).toEqual("Dec 31, 2026")
  })

  it("formats a date using a different locale", () => {
    expect(formatDate(new Date("2026-03-14"), "fr-FR")).toEqual("14 mars 2026")
  })
})

describe("calculateResponseRate", () => {
  it("returns 0 when there are no applications", () => {
    expect(calculateResponseRate(0, 0)).toEqual(0)
  })

  it("returns 0 when all applications are pending", () => {
    expect(calculateResponseRate(10, 10)).toEqual(0)
  })

  it("returns 100 when no applications are pending", () => {
    expect(calculateResponseRate(0, 10)).toEqual(100)
  })

  it("returns 50 when half of applications are pending", () => {
    expect(calculateResponseRate(5, 10)).toEqual(50)
  })

  it("returns correct rate for arbitrary values", () => {
    expect(calculateResponseRate(4, 20)).toEqual(80)
  })

  it("handles fractions", () => {
    expect(calculateResponseRate(3, 21)).toEqual(86)
  })
})
