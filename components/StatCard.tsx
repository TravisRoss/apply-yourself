import { type LucideIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"

type StatCardProps = {
  title: string
  icon: LucideIcon
  total: string
  count?: number
  countLabel?: string
  percentage?: number
  percentageLabel?: string
}

export default function StatCard({
  title,
  icon: Icon,
  total,
  count,
  countLabel,
  percentage,
  percentageLabel = "from last month",
}: StatCardProps) {
  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
          {title}
          <Icon className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-semibold">
        <p>{total}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex flex-col gap-2">
          {count && countLabel && (
            <p>
              {count} {countLabel}
            </p>
          )}
          {percentage && percentageLabel && (
            <p className={percentage > 0 ? "text-green-500" : "text-red-500"}>
              {percentage > 0 ? `+${percentage}%` : `${percentage}%`}{" "}
              {percentageLabel}
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
