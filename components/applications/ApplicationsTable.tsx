"use client"

import { useApplications, useDeleteApplication } from "@/hooks/useApplications"
import {
  DatePreset,
  filterByDatePreset,
  filterByStatus,
  searchApplications,
} from "@/lib/filter"
import { sortApplications, SortDirection, SortKey } from "@/lib/sort"
import { cn, formatDate } from "@/lib/utils"
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"
import { useTranslations } from "next-intl"
import React, { useState } from "react"
import Initials from "../shared/Initials"
import StatusBadge from "../shared/StatusBadge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { ApplicationPagination } from "./ApplicationPagination"
import KebabMenu from "./KebabMenu"

type Column = {
  label: string
  sortKey?: SortKey
}

function SortIcon({
  column,
  activeSortKey,
  direction,
}: {
  column: SortKey
  activeSortKey: SortKey
  direction: SortDirection
}) {
  if (column !== activeSortKey) return <ChevronsUpDown className="size-3.5" />
  return direction === "asc" ? (
    <ChevronUp className="size-3.5" />
  ) : (
    <ChevronDown className="size-3.5" />
  )
}

function MutedTableCell({ children }: { children: React.ReactNode }) {
  return <TableCell className="text-muted-foreground">{children}</TableCell>
}

type ApplicationsTableProps = {
  userId: string
  withPagination?: boolean
  className?: string
  search?: string
  statusFilter?: string[]
  datePreset?: DatePreset
  sortKey?: SortKey
  sortDirection?: SortDirection
  onSortChange?: (key: SortKey) => void
  pageIndex?: number
  onPageIndexChange?: (page: number) => void
}

export default function ApplicationsTable({
  userId,
  withPagination = false,
  className,
  search = "",
  statusFilter = [],
  datePreset = null,
  sortKey = "appliedDate",
  sortDirection = "desc",
  onSortChange,
  pageIndex = 0,
  onPageIndexChange,
}: ApplicationsTableProps) {
  const { data: applications } = useApplications(userId)
  const deleteApplicationMutation = useDeleteApplication(userId)
  const [pageSize, setPageSize] = useState(5)
  const t = useTranslations("applications")

  const columns: Column[] = [
    { label: t("table.company"), sortKey: "company" },
    { label: t("table.position") },
    { label: t("table.location") },
    { label: t("table.status") },
    { label: t("table.applied"), sortKey: "appliedDate" },
  ]

  const allApplications = applications ?? []
  const afterSearch = searchApplications(allApplications, search)
  const afterStatus = filterByStatus(afterSearch, statusFilter)
  const afterDate = filterByDatePreset(afterStatus, datePreset)
  const sorted = sortApplications(afterDate, sortKey, sortDirection)

  const pageStart = pageIndex * pageSize
  const pageEnd = pageStart + pageSize
  const recentApplications = sorted.slice(0, 6)
  const displayApplications = withPagination
    ? sorted.slice(pageStart, pageEnd)
    : recentApplications

  function handleDelete(applicationId: string) {
    deleteApplicationMutation.mutateAsync(applicationId)
  }

  return (
    <div
      className={cn(
        "overflow-x-scroll rounded-lg border border-border bg-card md:overflow-auto",
        className
      )}
    >
      <Table className="min-w-150">
        <TableHeader>
          <TableRow className="text-muted-foreground hover:bg-transparent">
            {columns.map((column) => (
              <TableHead key={column.label}>
                {column.sortKey && withPagination ? (
                  <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => onSortChange?.(column.sortKey!)}
                  >
                    {column.label}
                    <SortIcon
                      column={column.sortKey}
                      activeSortKey={sortKey}
                      direction={sortDirection}
                    />
                  </button>
                ) : (
                  column.label
                )}
              </TableHead>
            ))}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayApplications.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="py-8 text-center text-muted-foreground"
              >
                {t("noResults")}
              </TableCell>
            </TableRow>
          ) : (
            displayApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div className="flex items-center gap-2 font-semibold">
                    <Initials title={application.company} />
                    <span className="truncate">{application.company}</span>
                  </div>
                </TableCell>
                <TableCell>{application.position}</TableCell>
                <MutedTableCell>{application.location}</MutedTableCell>
                <MutedTableCell>
                  <StatusBadge status={application.status} />
                </MutedTableCell>
                <MutedTableCell>
                  {formatDate(application.appliedDate)}
                </MutedTableCell>
                <MutedTableCell>
                  <KebabMenu
                    onDelete={() => handleDelete(application.id)}
                    applicationId={application.id}
                    userId={userId}
                  />
                </MutedTableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {withPagination && (
        <ApplicationPagination
          total={sorted.length}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={onPageIndexChange ?? (() => {})}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  )
}
