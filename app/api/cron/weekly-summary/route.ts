import { WeeklySummaryEmail } from "@/emails/WeeklySummaryEmail"
import { sendEmail } from "@/lib/email"
import { applicationStatusLabels, interviewRoundLabels } from "@/lib/labels"
import prisma from "@/lib/prisma"
import { format, startOfDay, subDays } from "date-fns"
import { NextRequest, NextResponse } from "next/server"
import { createElement } from "react"

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization")
  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  const weekAgo = startOfDay(subDays(now, 7))
  const weekAhead = startOfDay(subDays(now, -7))

  const users = await prisma.user.findMany({
    where: {
      notificationPreferences: { weeklySummary: true },
    },
    include: {
      applications: {
        where: { createdAt: { gte: weekAgo } },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  const userIds = users.map((user) => user.id)

  const upcomingInterviewsByUser = await prisma.interview.findMany({
    where: {
      date: { gte: now, lte: weekAhead },
      application: { userId: { in: userIds } },
    },
    include: {
      application: true,
    },
  })

  for (const user of users) {
    const totalApplications = await prisma.application.count({
      where: { userId: user.id },
    })

    const upcomingInterviews = upcomingInterviewsByUser
      .filter((interview) => interview.application.userId === user.id)
      .map((interview) => ({
        company: interview.application.company,
        position: interview.application.position,
        round: interviewRoundLabels[interview.round],
        date: format(interview.date, "EEE, MMM d 'at' h:mm a"),
      }))

    await sendEmail({
      to: user.email,
      subject: `Your weekly job search summary`,
      template: createElement(WeeklySummaryEmail, {
        userName: user.name,
        weekOf: format(weekAgo, "MMMM d, yyyy"),
        totalApplications,
        newApplications: user.applications.map((application) => ({
          company: application.company,
          position: application.position,
          status: applicationStatusLabels[application.status],
        })),
        upcomingInterviews,
      }),
    })
  }

  return NextResponse.json({ sent: users.length })
}
