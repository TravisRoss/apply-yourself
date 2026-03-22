"use client"

import React, { useState } from "react"
import { Table } from "./ui/table"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Badge } from "./ui/badge"
import KebabMenu from "./KebabMenu"
import { useApplications, useDeleteApplication } from "@/hooks/useApplications"
import { formatDate } from "@/lib/utils"
import { ApplicationPagination } from "./ApplicationPagination"

const tableHeads = ["Company", "Position", "Location", "Status", "Applied"]

function MutedTableCell({ children }: { children: React.ReactNode }) {
  return <TableCell className="text-muted-foreground">{children}</TableCell>
}

type ApplicationsTableProps = {
  userId: string
  withPagination?: boolean
}

export default function ApplicationsTable({
  userId,
  withPagination = false,
}: ApplicationsTableProps) {
  const { data: applications } = useApplications(userId)
  const deleteApplicationMutation = useDeleteApplication(userId)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const pageStart = page * pageSize
  const pageEnd = pageStart + pageSize
  const recentApplications = applications
    ?.sort((a, b) => b.appliedDate.getTime() - a.appliedDate.getTime())
    .slice(0, 6)
  const displayApplications = withPagination
    ? applications?.slice(pageStart, pageEnd)
    : recentApplications

  function handleDelete(applicationId: string) {
    deleteApplicationMutation.mutateAsync(applicationId)
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="text-muted-foreground hover:bg-transparent">
            {tableHeads.map((label) => (
              <TableHead key={label}>{label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayApplications &&
            displayApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div className="flex items-center gap-2 font-semibold">
                    <div className="flex min-h-8 min-w-8 items-center justify-center rounded-md bg-accent">
                      <span>
                        {application.company.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="truncate">{application.company}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span>{application.position}</span>
                </TableCell>
                <MutedTableCell>
                  <span>{application.location}</span>
                </MutedTableCell>
                <MutedTableCell>
                  <Badge>{application.status}</Badge>
                </MutedTableCell>
                <MutedTableCell>
                  <span>{formatDate(application.appliedDate)}</span>
                </MutedTableCell>
                <MutedTableCell>
                  <KebabMenu
                    onDelete={() => handleDelete(application.id)}
                    applicationId={application.id}
                    userId={userId}
                  />
                </MutedTableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {withPagination && (
        <ApplicationPagination
          total={applications?.length || 0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  )
}
