"use server"

import prisma from "@/lib/prisma"
import { getCurrentWeekForDate } from "@/lib/utils"
import { InterviewFormData } from "@/lib/zod"

export async function getInterviewsByUserId(userId: string) {
  return await prisma.interview.findMany({ where: { application: { userId } } })
}

export async function getInterviewsThisWeek(userId: string) {
  const currentWeek = getCurrentWeekForDate(new Date())

  return await prisma.interview.findMany({
    where: {
      application: { userId },
      date: { gte: currentWeek.weekStart, lte: currentWeek.weekEnd },
    },
  })
}

export async function createInterview(formData: InterviewFormData) {
  await prisma.interview.create({
    data: { ...formData, notes: formData.notes || null },
  })
  await prisma.application.update({
    where: { id: formData.applicationId },
    data: { status: "interview" },
  })
}
