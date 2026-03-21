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

export function formatDate(date: Date, locale: string = "en-US"): string {
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
