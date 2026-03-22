import { type LucideIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { percentageGainDisplay } from "@/lib/utils"

type StatCardProps = {
  title: string
  icon: LucideIcon
  total: number
  count?: number
  countLabel?: string
  percentageGain?: number | null
  percentageGainLabel?: string
}

export default function StatCard({
  title,
  icon: Icon,
  total,
  count,
  countLabel,
  percentageGain,
  percentageGainLabel = "from last month",
}: StatCardProps) {
  return (
    <Card className="w-full bg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
          <h3>{title}</h3>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-semibold">
        <p>{title === "Response Rate" ? `${total}%` : total}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex flex-col gap-2">
          <p>
            {count} {countLabel ? countLabel : ""}
          </p>

          {percentageGain !== undefined && percentageGainLabel && (
            <p
              className={
                percentageGain === null
                  ? "text-muted-foreground"
                  : percentageGain > 0
                    ? "text-green-500"
                    : "text-red-500"
              }
            >
              {percentageGainDisplay(percentageGain, percentageGainLabel)}
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
