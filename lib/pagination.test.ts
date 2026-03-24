import { describe, expect, it } from "vitest"
import { getPaginationRange } from "./pagination"

describe("getPaginationRange", () => {
  it("returns correct range for the first pageIndex", () => {
    expect(getPaginationRange(0, 5, 23)).toEqual({
      rangeStart: 1,
      rangeEnd: 5,
      numPages: 5,
    })
  })

  it("returns correct range for a middle pageIndex", () => {
    expect(getPaginationRange(1, 5, 23)).toEqual({
      rangeStart: 6,
      rangeEnd: 10,
      numPages: 5,
    })
  })

  it("clamps rangeEnd on the last partial pageIndex", () => {
    expect(getPaginationRange(4, 5, 23)).toEqual({
      rangeStart: 21,
      rangeEnd: 23,
      numPages: 5,
    })
  })

  it("returns correct range when total is an exact multiple of pageSize", () => {
    expect(getPaginationRange(1, 5, 10)).toEqual({
      rangeStart: 6,
      rangeEnd: 10,
      numPages: 2,
    })
  })

  it("returns 0-0 of 0 when total is 0", () => {
    expect(getPaginationRange(0, 5, 0)).toEqual({
      rangeStart: 0,
      rangeEnd: 0,
      numPages: 0,
    })
  })

  it("returns correct range for a single pageIndex", () => {
    expect(getPaginationRange(0, 5, 3)).toEqual({
      rangeStart: 1,
      rangeEnd: 3,
      numPages: 1,
    })
  })
})
