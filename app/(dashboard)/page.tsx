import StatCard from "@/components/StatCard"

const stats = [
  { title: "Applied", value: "10", footerText: "+12% from last month" },
  { title: "Interviews", value: "5", footerText: "-2% from last month" },
  { title: "Offers", value: "3", footerText: "+5% from last month" },
  { title: "Response Rate", value: "2", footerText: "+3% from last month" },
]

export default function DashboardPage() {
  return (
    <div className="p-8 pt-4">
      <h1 className="mb-1 text-xl font-semibold">Overview</h1>
      <p className="text-sm text-muted-foreground">
        Track every job you&apos;ve applied to.
      </p>
      <div className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            footerText={stat.footerText}
          />
        ))}
      </div>
    </div>
  )
}
