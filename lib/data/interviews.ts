"use server"

import prisma from "@/lib/prisma"
import { getCurrentWeekForDate } from "@/lib/utils"
import { InterviewFormData } from "@/lib/zod"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

async function getUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function getInterviewById(interviewId: string) {
  return await prisma.interview.findUnique({ where: { id: interviewId } })
}

export async function getInterviewsByUserId() {
  const userId = await getUserId()
  if (userId === null) return []
  return await prisma.interview.findMany({ where: { application: { userId } } })
}

export async function getInterviewsThisWeek() {
  const userId = await getUserId()
  if (userId === null) return []
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

export async function updateInterview(
  interviewId: string,
  formData: InterviewFormData
) {
  await prisma.interview.update({
    where: { id: interviewId },
    data: {
      ...formData,
      notes: formData.notes || null,
    },
  })
}

export async function deleteInterview(interviewId: string) {
  await prisma.interview.delete({ where: { id: interviewId } })
}
