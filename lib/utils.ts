import { ApplicationStatus } from "@/generated/prisma/enums"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateResponseRate(
  pendingCount: number,
  total: number
): number {
  if (total === 0) return 0
  return Math.round((1 - pendingCount / total) * 100)
}

export function calcPercentageGain(
  current: number,
  previous: number
): number | null {
  if (previous === 0) return null
  return Math.round(((current - previous) / previous) * 100)
}

export function formatDate(date: Date, locale: string = "en-GB"): string {
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function getCurrentWeekForDate(date: Date): {
  weekStart: Date
  weekEnd: Date
} {
  const day = date.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysFromMonday = (day + 6) % 7 // Monday = 0, ..., Sunday = 6

  const weekStart = new Date(date)
  weekStart.setDate(date.getDate() - daysFromMonday)
  weekStart.setHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  return { weekStart, weekEnd }
}

export function calcMonthStartAndEndForDate(date: Date) {
  const monthStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
    0,
    0,
    0,
    0
  )
  const monthEnd = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  )

  return {
    monthStart,
    monthEnd,
  }
}

export function percentageGainDisplay(
  gain: number | null,
  label: string
): string {
  if (gain === null) {
    return "N/a"
  }

  return gain > 0 ? `+${gain}% ${label}` : `${gain}% ${label}`
}

export const STATUS_CLASSES: Record<ApplicationStatus, string> = {
  applied: "text-blue-500  bg-blue-500/15  border-blue-500/30",
  interview: "text-amber-500 bg-amber-500/15 border-amber-500/30",
  offer: "text-green-500 bg-green-500/15 border-green-500/30",
  rejected: "text-red-500   bg-red-500/15   border-red-500/30",
}
