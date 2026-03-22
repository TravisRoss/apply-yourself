import {
  useApplications,
  useApplicationsForMonth,
  useApplicationsThisWeek,
  useOffers,
  useResponsesThisWeek,
  useStatusApplied,
} from "@/hooks/useApplications"
import { useInterviews, useInterviewsThisWeek } from "@/hooks/useInterviews"
import {
  calcMonthStartAndEndForDate,
  calcPercentageGain,
  calculateResponseRate,
} from "@/lib/utils"
import { Calendar, FileText, Gift, TrendingUp } from "lucide-react"

export function useDashboardStats(userId: string | undefined) {
  const now = new Date()
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1)

  const { data: applications } = useApplications(userId)
  const { data: interviews } = useInterviews(userId)
  const { data: offers } = useOffers(userId)
  const { data: statusApplied } = useStatusApplied(userId)
  const { data: applicationsThisWeek } = useApplicationsThisWeek(userId)
  const { data: interviewsThisWeek } = useInterviewsThisWeek(userId)
  const { data: responsesThisWeek } = useResponsesThisWeek(userId)
  const { data: applicationsThisMonth } = useApplicationsForMonth(userId, now)
  const { data: applicationsLastMonth } = useApplicationsForMonth(
    userId,
    previousMonth
  )

  const { monthStart: thisMonthStart, monthEnd: thisMonthEnd } =
    calcMonthStartAndEndForDate(now)
  const { monthStart: lastMonthStart, monthEnd: lastMonthEnd } =
    calcMonthStartAndEndForDate(previousMonth)

  const inRange = (date: Date, start: Date, end: Date) =>
    date >= start && date <= end

  const interviewsThisMonth = interviews?.filter((i) =>
    inRange(new Date(i.date), thisMonthStart, thisMonthEnd)
  )
  const interviewsLastMonth = interviews?.filter((i) =>
    inRange(new Date(i.date), lastMonthStart, lastMonthEnd)
  )

  const offersThisMonth = offers?.filter((o) =>
    inRange(new Date(o.updatedAt), thisMonthStart, thisMonthEnd)
  )
  const offersLastMonth = offers?.filter((o) =>
    inRange(new Date(o.updatedAt), lastMonthStart, lastMonthEnd)
  )

  const responseRateThisMonth = calculateResponseRate(
    applicationsThisMonth?.filter((a) => a.status === "applied").length ?? 0,
    applicationsThisMonth?.length ?? 0
  )
  const responseRateLastMonth = calculateResponseRate(
    applicationsLastMonth?.filter((a) => a.status === "applied").length ?? 0,
    applicationsLastMonth?.length ?? 0
  )

  const responseRate = calculateResponseRate(
    statusApplied?.length ?? 0,
    applications?.length ?? 0
  )

  return [
    {
      title: "Total Applied",
      icon: FileText,
      total: applications?.length ?? 0,
      count: applicationsThisWeek?.length ?? 0,
      countLabel: "this week",
      percentageGain: calcPercentageGain(
        applicationsThisMonth?.length ?? 0,
        applicationsLastMonth?.length ?? 0
      ),
    },
    {
      title: "Interviews",
      icon: Calendar,
      total: interviews?.length ?? 0,
      count: interviewsThisWeek?.length ?? 0,
      countLabel: "this week",
      percentageGain: calcPercentageGain(
        interviewsThisMonth?.length ?? 0,
        interviewsLastMonth?.length ?? 0
      ),
    },
    {
      title: "Offers",
      icon: Gift,
      total: offers?.length ?? 0,
      count: statusApplied?.length ?? 0,
      countLabel: "pending response",
      percentageGain: calcPercentageGain(
        offersThisMonth?.length ?? 0,
        offersLastMonth?.length ?? 0
      ),
    },
    {
      title: "Response Rate",
      icon: TrendingUp,
      total: responseRate,
      count: responsesThisWeek?.length ?? 0,
      countLabel: "this week",
      percentageGain: calcPercentageGain(
        responseRateThisMonth,
        responseRateLastMonth
      ),
    },
  ]
}
