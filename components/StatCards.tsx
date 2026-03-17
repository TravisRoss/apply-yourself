import { Calendar, FileText, Gift, TrendingUp } from "lucide-react"
import StatCard from "./StatCard"

const stats = [
  {
    title: "Total Applied",
    icon: FileText,
    total: "10",
    count: 12,
    countLabel: "this week",
    percentage: 5,
  },
  {
    title: "Interviews",
    icon: Calendar,
    total: "8",
    count: 10,
    countLabel: "this week",
    percentage: 3,
  },
  {
    title: "Offers",
    icon: Gift,
    total: "5",
    count: 8,
    countLabel: "pending response",
    percentage: 50,
  },
  {
    title: "Response Rate",
    icon: TrendingUp,
    total: "90%",
    count: 12,
    countLabel: "this week",
    percentage: -5,
  },
]

export default function StatCards() {
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
          percentage={stat.percentage}
        />
      ))}
    </div>
  )
}
