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
import { useTranslations } from "next-intl"

const STATUSES = applicationStatusSchema.options

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
  const t = useTranslations("applications.filter")

  const datePresets: { label: string; value: DatePreset }[] = [
    { label: t("last7Days"), value: "7d" },
    { label: t("last30Days"), value: "30d" },
    { label: t("last90Days"), value: "90d" },
  ]

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
          <span>{t("trigger")}{activeCount > 0 ? ` (${activeCount})` : ""}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t("status")}</DropdownMenuLabel>
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
        <DropdownMenuLabel>{t("appliedDate")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {datePresets.map(({ label, value }) => (
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
              {t("clearFilters")}
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
