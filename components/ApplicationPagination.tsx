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
  page: number
  onPageChange: (page: number) => void
  pageSize: number
  onPageSizeChange: (pageSize: number) => void
  total: number
}

export function ApplicationPagination({
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  total,
}: ApplicationPaginationProps) {
  const numPages = Math.ceil(total / pageSize)

  function handlePreviousClick() {
    if (page > 0) onPageChange(page - 1)
  }

  function handleNextClick() {
    if (page < numPages - 1) onPageChange(page + 1)
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
              aria-disabled={page === 0}
              className={page === 0 ? notAllowed : ""}
              text="Previous"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => handleNextClick()}
              aria-disabled={page === numPages - 1}
              className={page === numPages - 1 ? notAllowed : ""}
              text="Next"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
