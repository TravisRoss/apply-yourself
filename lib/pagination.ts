export function getPaginationRange(pageIndex: number, pageSize: number, total: number) {
  return {
    rangeStart: total > 0 ? pageIndex * pageSize + 1 : 0,
    rangeEnd: Math.min((pageIndex + 1) * pageSize, total),
    numPages: Math.ceil(total / pageSize),
  }
}
