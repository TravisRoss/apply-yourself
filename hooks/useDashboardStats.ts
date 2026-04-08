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
import { useTranslations } from "next-intl"

export function useDashboardStats() {
  const t = useTranslations("dashboard.stats")
  const now = new Date()
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1)

  const { data: applications, isLoading: isLoadingApplications } =
    useApplications()
  const { data: interviews, isLoading: isLoadingInterviews } = useInterviews()
  const { data: offers, isLoading: isLoadingOffers } = useOffers()
  const { data: statusApplied, isLoading: isLoadingStatusApplied } =
    useStatusApplied()
  const {
    data: applicationsThisWeek,
    isLoading: isLoadingApplicationsThisWeek,
  } = useApplicationsThisWeek()
  const { data: interviewsThisWeek, isLoading: isLoadingInterviewsThisWeek } =
    useInterviewsThisWeek()
  const { data: responsesThisWeek, isLoading: isLoadingResponsesThisWeek } =
    useResponsesThisWeek()
  const {
    data: applicationsThisMonth,
    isLoading: isLoadingApplicationsThisMonth,
  } = useApplicationsForMonth(now)
  const {
    data: applicationsLastMonth,
    isLoading: isLoadingApplicationsLastMonth,
  } = useApplicationsForMonth(previousMonth)

  const isLoading =
    isLoadingApplications ||
    isLoadingInterviews ||
    isLoadingOffers ||
    isLoadingStatusApplied ||
    isLoadingApplicationsThisWeek ||
    isLoadingInterviewsThisWeek ||
    isLoadingResponsesThisWeek ||
    isLoadingApplicationsThisMonth ||
    isLoadingApplicationsLastMonth

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

  const fromLastMonth = useTranslations("dashboard")("fromLastMonth")

  return {
    isLoading,
    stats: [
      {
        title: t("totalApplied"),
        icon: FileText,
        total: applications?.length ?? 0,
        count: applicationsThisWeek?.length ?? 0,
        countLabel: t("thisWeek"),
        percentageGain: calcPercentageGain(
          applicationsThisMonth?.length ?? 0,
          applicationsLastMonth?.length ?? 0
        ),
        percentageGainLabel: fromLastMonth,
      },
      {
        title: t("interviews"),
        icon: Calendar,
        total: interviews?.length ?? 0,
        count: interviewsThisWeek?.length ?? 0,
        countLabel: t("thisWeek"),
        percentageGain: calcPercentageGain(
          interviewsThisMonth?.length ?? 0,
          interviewsLastMonth?.length ?? 0
        ),
        percentageGainLabel: fromLastMonth,
      },
      {
        title: t("offers"),
        icon: Gift,
        total: offers?.length ?? 0,
        count: statusApplied?.length ?? 0,
        countLabel: t("pendingResponse"),
        percentageGain: calcPercentageGain(
          offersThisMonth?.length ?? 0,
          offersLastMonth?.length ?? 0
        ),
        percentageGainLabel: fromLastMonth,
      },
      {
        title: t("responseRate"),
        icon: TrendingUp,
        total: responseRate,
        isPercentage: true,
        count: responsesThisWeek?.length ?? 0,
        countLabel: t("thisWeek"),
        percentageGain: calcPercentageGain(
          responseRateThisMonth,
          responseRateLastMonth
        ),
        percentageGainLabel: fromLastMonth,
      },
    ],
  }
}
