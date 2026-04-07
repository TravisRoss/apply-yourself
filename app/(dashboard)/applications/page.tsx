"use client"

import AddApplicationSheet from "@/components/applications/AddApplicationSheet"
import ApplicationsTable from "@/components/applications/ApplicationsTable"
import FilterMenu from "@/components/applications/FilterMenu"
import SearchBar from "@/components/applications/SearchBar"
import { PageShell } from "@/components/layout/PageShell"
import { DatePreset } from "@/lib/filter"
import { SortDirection, SortKey } from "@/lib/sort"
import { useTranslations } from "next-intl"
import { useState } from "react"

export default function ApplicationsPage() {
  const t = useTranslations("applications")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [datePreset, setDatePreset] = useState<DatePreset>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [sortKey, setSortKey] = useState<SortKey>("appliedDate")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  function handleSearchChange(value: string) {
    setSearch(value)
    setPageIndex(0)
  }

  function handleStatusesChange(statuses: string[]) {
    setStatusFilter(statuses)
    setPageIndex(0)
  }

  function handleSortChange(key: SortKey) {
    if (key === sortKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  return (
    <PageShell title={t("title")} action={<AddApplicationSheet />}>
      <div className="flex items-center gap-2">
        <SearchBar
          onInputChange={handleSearchChange}
          input={search}
          placeholder={t("search")}
        />
        <FilterMenu
          selectedStatuses={statusFilter}
          onStatusesChange={handleStatusesChange}
          datePreset={datePreset}
          onDatePresetChange={setDatePreset}
        />
      </div>

      <ApplicationsTable
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
