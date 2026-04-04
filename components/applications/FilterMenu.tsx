"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { applicationStatusLabels } from "@/lib/labels"
import { DatePreset } from "@/lib/filter"
import { applicationStatusSchema } from "@/lib/zod"
import { Filter } from "lucide-react"

const STATUSES = applicationStatusSchema.options

const DATE_PRESETS: { label: string; value: DatePreset }[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
]

type FilterMenuProps = {
  selectedStatuses: string[]
  onStatusesChange: (statuses: string[]) => void
  datePreset: DatePreset
  onDatePresetChange: (preset: DatePreset) => void
}

export default function FilterMenu({
  selectedStatuses,
  onStatusesChange,
  datePreset,
  onDatePresetChange,
}: FilterMenuProps) {
  function toggleStatus(status: string) {
    if (selectedStatuses.includes(status)) {
      onStatusesChange(selectedStatuses.filter((s) => s !== status))
    } else {
      onStatusesChange([...selectedStatuses, status])
    }
  }

  const activeCount = selectedStatuses.length + (datePreset ? 1 : 0)

  function clearAll() {
    onStatusesChange([])
    onDatePresetChange(null)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter />
          <span>Filter{activeCount > 0 ? ` (${activeCount})` : ""}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STATUSES.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={selectedStatuses.includes(status)}
            onCheckedChange={() => toggleStatus(status)}
          >
            {applicationStatusLabels[status]}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Applied date</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {DATE_PRESETS.map(({ label, value }) => (
          <DropdownMenuCheckboxItem
            key={value}
            checked={datePreset === value}
            onCheckedChange={() =>
              onDatePresetChange(datePreset === value ? null : value)
            }
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
        {activeCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={false} onCheckedChange={clearAll}>
              Clear filters
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
