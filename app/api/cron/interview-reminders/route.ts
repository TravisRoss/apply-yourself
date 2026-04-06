import { InterviewReminderEmail } from "@/emails/InterviewReminderEmail"
import { sendEmail } from "@/lib/email"
import { interviewRoundLabels, interviewTypeLabels } from "@/lib/labels"
import prisma from "@/lib/prisma"
import { format } from "date-fns"
import { NextRequest, NextResponse } from "next/server"
import { createElement } from "react"

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization")
  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  const windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000)
  const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000)

  const interviews = await prisma.interview.findMany({
    where: {
      date: { gte: windowStart, lte: windowEnd },
      reminderSentAt: null,
      application: {
        user: {
          notificationPreferences: { interviewReminders: true },
        },
      },
    },
    include: {
      application: {
        include: { user: true },
      },
    },
  })

  for (const interview of interviews) {
    const { user, company, position } = interview.application

    await sendEmail({
      to: user.email,
      subject: `Interview reminder: ${company} tomorrow`,
      template: createElement(InterviewReminderEmail, {
        userName: user.name,
        company,
        position,
        interviewType: interviewTypeLabels[interview.type],
        interviewRound: interviewRoundLabels[interview.round],
        interviewDate: format(interview.date, "EEEE, MMMM d, yyyy"),
        interviewTime: format(interview.date, "h:mm a"),
      }),
    })

    await prisma.interview.update({
      where: { id: interview.id },
      data: { reminderSentAt: now },
    })
  }

  return NextResponse.json({ sent: interviews.length })
}
