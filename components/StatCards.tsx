"use client"

import { LucideIcon } from "lucide-react"
import StatCard from "./StatCard"

type Stat = {
  title: string
  icon: LucideIcon
  total: number
  count?: number
  countLabel?: string
  percentageGain?: number | null
}

type StatCardsProps = {
  stats: Stat[]
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          icon={stat.icon}
          total={stat.total}
          count={stat.count}
          countLabel={stat.countLabel}
          percentageGain={stat.percentageGain}
        />
      ))}
    </div>
  )
}
