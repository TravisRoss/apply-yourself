"use client"

import { LucideIcon } from "lucide-react"
import StatCard from "./StatCard"

type Stat = {
  title: string
  icon: LucideIcon
  total: number
  isPercentage?: boolean
  count?: number
  countLabel?: string
  percentageGain?: number | null
  percentageGainLabel?: string
}

type StatCardsProps = {
  stats: Stat[]
  isLoading?: boolean
}

export default function StatCards({ stats, isLoading }: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          icon={stat.icon}
          total={stat.total}
          isPercentage={stat.isPercentage}
          count={stat.count}
          countLabel={stat.countLabel}
          percentageGain={stat.percentageGain}
          percentageGainLabel={stat.percentageGainLabel}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
}
