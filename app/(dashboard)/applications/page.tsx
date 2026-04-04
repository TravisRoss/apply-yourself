"use client"

import AddApplicationSheet from "@/components/applications/AddApplicationSheet"
import ApplicationsTable from "@/components/applications/ApplicationsTable"
import { PageShell } from "@/components/layout/PageShell"
import SearchBar from "@/components/applications/SearchBar"
import FilterMenu from "@/components/applications/FilterMenu"
import { useSession } from "@/lib/auth-client"
import { DatePreset } from "@/lib/filter"
import { SortDirection, SortKey } from "@/lib/sort"
import { redirect } from "next/navigation"
import { useState } from "react"

export default function ApplicationsPage() {
  const { data: sessionData } = useSession()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [datePreset, setDatePreset] = useState<DatePreset>(null)
  const [pageIndex, setPageIndex] = useState(0)

  function handleSearchChange(value: string) {
    setSearch(value)
    setPageIndex(0)
  }

  function handleStatusesChange(statuses: string[]) {
    setStatusFilter(statuses)
    setPageIndex(0)
  }
  const [sortKey, setSortKey] = useState<SortKey>("appliedDate")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  if (!sessionData) {
    redirect("/sign-in")
  }

  function handleSortChange(key: SortKey) {
    if (key === sortKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const userId = sessionData.user.id

  return (
    <PageShell
      title="Applications"
      action={<AddApplicationSheet userId={userId!} />}
    >
      <div className="flex items-center gap-2">
        <SearchBar onInputChange={handleSearchChange} input={search} />
        <FilterMenu
          selectedStatuses={statusFilter}
          onStatusesChange={handleStatusesChange}
          datePreset={datePreset}
          onDatePresetChange={setDatePreset}
        />
      </div>

      <ApplicationsTable
        userId={userId!}
        withPagination={true}
        className="mt-4"
        search={search}
        statusFilter={statusFilter}
        datePreset={datePreset}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        pageIndex={pageIndex}
        onPageIndexChange={setPageIndex}
      />
    </PageShell>
  )
}
