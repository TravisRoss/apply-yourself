import { getPaginationRange } from "@/lib/pagination"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const notAllowed = "cursor-not-allowed opacity-50"

type ApplicationPaginationProps = {
  pageIndex: number
  onPageChange: (pageIndex: number) => void
  pageSize: number
  onPageSizeChange: (pageSize: number) => void
  total: number
}

export function ApplicationPagination({
  pageIndex,
  onPageChange,
  pageSize,
  onPageSizeChange,
  total,
}: ApplicationPaginationProps) {
  const { numPages, rangeStart, rangeEnd } = getPaginationRange(pageIndex, pageSize, total)

  function handlePreviousClick() {
    if (pageIndex > 0) onPageChange(pageIndex - 1)
  }

  function handleNextClick() {
    if (pageIndex < numPages - 1) onPageChange(pageIndex + 1)
  }

  return (
    <div className="flex items-center justify-between gap-4 p-2">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePreviousClick()}
              aria-disabled={pageIndex === 0}
              className={pageIndex === 0 ? notAllowed : ""}
              text="Previous"
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-2 text-xs text-muted-foreground">
              {rangeStart}–{rangeEnd} of {total}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => handleNextClick()}
              aria-disabled={pageIndex === numPages - 1}
              className={pageIndex === numPages - 1 ? notAllowed : ""}
              text="Next"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
