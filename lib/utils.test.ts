import { describe, expect, it } from "vitest"
import {
  calcMonthStartAndEndForDate,
  calcPercentageGain,
  calculateResponseRate,
  formatDate,
  getCurrentWeekForDate,
  percentageGainDisplay,
} from "./utils"

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

describe("getCurrentWeekForDate", () => {
  it("returns Mon–Sun for a Sunday (22/03/2026)", () => {
    const { weekStart, weekEnd } = getCurrentWeekForDate(new Date(2026, 2, 22))
    expect(weekStart).toEqual(new Date(2026, 2, 16, 0, 0, 0, 0))
    expect(weekEnd).toEqual(new Date(2026, 2, 22, 23, 59, 59, 999))
  })

  it("returns Mon–Sun for a Monday (16/03/2026)", () => {
    const { weekStart, weekEnd } = getCurrentWeekForDate(new Date(2026, 2, 16))
    expect(weekStart).toEqual(new Date(2026, 2, 16, 0, 0, 0, 0))
    expect(weekEnd).toEqual(new Date(2026, 2, 22, 23, 59, 59, 999))
  })

  it("returns Mon–Sun for a Wednesday mid-week (18/03/2026)", () => {
    const { weekStart, weekEnd } = getCurrentWeekForDate(new Date(2026, 2, 18))
    expect(weekStart).toEqual(new Date(2026, 2, 16, 0, 0, 0, 0))
    expect(weekEnd).toEqual(new Date(2026, 2, 22, 23, 59, 59, 999))
  })

  it("returns Mon–Sun for a Saturday (21/03/2026)", () => {
    const { weekStart, weekEnd } = getCurrentWeekForDate(new Date(2026, 2, 21))
    expect(weekStart).toEqual(new Date(2026, 2, 16, 0, 0, 0, 0))
    expect(weekEnd).toEqual(new Date(2026, 2, 22, 23, 59, 59, 999))
  })

  it("handles a week that spans a month boundary (28/02/2026)", () => {
    const { weekStart, weekEnd } = getCurrentWeekForDate(new Date(2026, 1, 28))
    expect(weekStart).toEqual(new Date(2026, 1, 23, 0, 0, 0, 0))
    expect(weekEnd).toEqual(new Date(2026, 2, 1, 23, 59, 59, 999))
  })

  it("does not mutate the input date", () => {
    const input = new Date(2026, 2, 18)
    const original = input.getTime()
    getCurrentWeekForDate(input)
    expect(input.getTime()).toBe(original)
  })
})

describe("calcMonthStartAndEndForDate", () => {
  it("returns the first and last day of March (22/03/2026)", () => {
    const { monthStart, monthEnd } = calcMonthStartAndEndForDate(
      new Date(2026, 2, 22)
    )

    expect(monthStart).toEqual(new Date(2026, 2, 1, 0, 0, 0, 0))
    expect(monthEnd).toEqual(new Date(2026, 2, 31, 23, 59, 59, 999))
  })

  it("returns the correct range when called on the first day of the month", () => {
    const { monthStart, monthEnd } = calcMonthStartAndEndForDate(
      new Date(2026, 2, 1)
    )
    expect(monthStart).toEqual(new Date(2026, 2, 1, 0, 0, 0, 0))
    expect(monthEnd).toEqual(new Date(2026, 2, 31, 23, 59, 59, 999))
  })

  it("returns the correct range when called on the last day of the month", () => {
    const { monthStart, monthEnd } = calcMonthStartAndEndForDate(
      new Date(2026, 2, 31)
    )
    expect(monthStart).toEqual(new Date(2026, 2, 1, 0, 0, 0, 0))
    expect(monthEnd).toEqual(new Date(2026, 2, 31, 23, 59, 59, 999))
  })

  it("handles February in a non-leap year (28 days)", () => {
    const { monthStart, monthEnd } = calcMonthStartAndEndForDate(
      new Date(2026, 1, 14)
    )
    expect(monthStart).toEqual(new Date(2026, 1, 1, 0, 0, 0, 0))
    expect(monthEnd).toEqual(new Date(2026, 1, 28, 23, 59, 59, 999))
  })

  it("handles February in a leap year (29 days)", () => {
    const { monthStart, monthEnd } = calcMonthStartAndEndForDate(
      new Date(2028, 1, 14)
    )
    expect(monthStart).toEqual(new Date(2028, 1, 1, 0, 0, 0, 0))
    expect(monthEnd).toEqual(new Date(2028, 1, 29, 23, 59, 59, 999))
  })

  it("does not mutate the input date", () => {
    const input = new Date(2026, 2, 22)
    const original = input.getTime()
    calcMonthStartAndEndForDate(input)
    expect(input.getTime()).toBe(original)
  })
})

describe("calcPercentageGain", () => {
  it("returns 0 when previous is 0", () => {
    expect(calcPercentageGain(10, 0)).toBe(0)
  })

  it("returns 100 when current is double previous", () => {
    expect(calcPercentageGain(10, 5)).toBe(100)
  })

  it("returns -50 when current is half of previous", () => {
    expect(calcPercentageGain(5, 10)).toBe(-50)
  })

  it("returns 0 when current equals previous", () => {
    expect(calcPercentageGain(5, 5)).toBe(0)
  })

  it("rounds to the nearest integer", () => {
    expect(calcPercentageGain(10, 3)).toBe(233)
  })
})

describe("percentageGainDisplay", () => {
  it("returns 'N/a' when gain is null", () => {
    expect(percentageGainDisplay(null, "from last month")).toBe("N/a")
  })

  it("prefixes with + for positive gain", () => {
    expect(percentageGainDisplay(20, "from last month")).toBe("+20% from last month")
  })

  it("does not prefix with + for negative gain", () => {
    expect(percentageGainDisplay(-10, "from last month")).toBe("-10% from last month")
  })

  it("does not prefix with + for zero gain", () => {
    expect(percentageGainDisplay(0, "from last month")).toBe("0% from last month")
  })

  it("includes the label in the output", () => {
    expect(percentageGainDisplay(5, "vs last week")).toBe("+5% vs last week")
  })
})
