"use client"

import React from "react"
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

const tableHeads = ["Company", "Position", "Location", "Status", "Applied"]

function MutedTableCell({ children }: { children: React.ReactNode }) {
  return <TableCell className="text-muted-foreground">{children}</TableCell>
}

export default function ApplicationsTable({ userId }: { userId: string }) {
  const { data: applications } = useApplications(userId)
  const deleteApplicationMutation = useDeleteApplication(userId)

  function handleDelete(applicationId: string) {
    deleteApplicationMutation.mutateAsync(applicationId)
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground hover:bg-transparent">
            {tableHeads.map((label) => (
              <TableHead key={label}>{label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications &&
            applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div className="flex items-center gap-2 font-semibold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
                      <span>
                        {application.company.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span>{application.company}</span>
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
                  <KebabMenu onDelete={() => handleDelete(application.id)} />
                </MutedTableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
