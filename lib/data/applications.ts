"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { calcMonthStartAndEndForDate, getCurrentWeekForDate } from "@/lib/utils"
import { ApplicationFormData } from "@/lib/zod"
import { headers } from "next/headers"

async function getUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function getApplicationsByUserId() {
  const userId = await getUserId()
  if (userId === null) return []
  return await prisma.application.findMany({ where: { userId } })
}

export async function getApplictionsWhereStatusApplied() {
  const userId = await getUserId()
  if (userId === null) return []
  return await prisma.application.findMany({
    where: { userId, status: "applied" },
  })
}

export async function getApplicationsThisWeek() {
  const userId = await getUserId()
  if (userId === null) return []
  const currentWeek = getCurrentWeekForDate(new Date())

  return await prisma.application.findMany({
    where: {
      userId,
      appliedDate: { gte: currentWeek.weekStart, lte: currentWeek.weekEnd },
    },
  })
}

export async function getApplicationsForMonth(date: Date = new Date()) {
  const userId = await getUserId()
  if (userId === null) return []
  const { monthStart, monthEnd } = calcMonthStartAndEndForDate(date)

  return await prisma.application.findMany({
    where: { userId, appliedDate: { gte: monthStart, lte: monthEnd } },
  })
}

export async function getResponsesThisWeek() {
  const userId = await getUserId()
  if (userId === null) return []
  const currentWeek = getCurrentWeekForDate(new Date())

  return await prisma.statusHistory.findMany({
    where: {
      application: { userId },
      fromStatus: "applied",
      changedAt: { gte: currentWeek.weekStart, lte: currentWeek.weekEnd },
    },
    include: { application: true },
  })
}

export async function getApplicationById(applicationId: string) {
  return await prisma.application.findUnique({ where: { id: applicationId } })
}

export async function createApplication(formData: ApplicationFormData) {
  const userId = await getUserId()
  if (userId === null) return
  return await prisma.application.create({
    data: {
      userId,
      company: formData.company,
      position: formData.position,
      status: formData.status,
      appliedDate: formData.appliedDate,
      source: formData.source,
      jobType: formData.jobType,
      location: formData.location || null,
      salary: formData.salary || null,
      url: formData.url || null,
      notes: formData.notes || null,
    },
  })
}

export async function updateApplication(
  applicationId: string,
  formData: ApplicationFormData
) {
  await prisma.$transaction(async (db) => {
    const { status: fromStatus } = await db.application.findUniqueOrThrow({
      where: { id: applicationId },
      select: { status: true },
    })

    await db.application.update({
      where: { id: applicationId },
      data: {
        company: formData.company,
        position: formData.position,
        status: formData.status,
        appliedDate: formData.appliedDate,
        source: formData.source,
        jobType: formData.jobType,
        location: formData.location || null,
        salary: formData.salary || null,
        url: formData.url || null,
        notes: formData.notes || null,
      },
    })

    if (fromStatus !== formData.status) {
      await db.statusHistory.create({
        data: { applicationId, fromStatus, toStatus: formData.status },
      })
    }
  })
}

export async function deleteApplication(applicationId: string) {
  await prisma.application.delete({ where: { id: applicationId } })
}
