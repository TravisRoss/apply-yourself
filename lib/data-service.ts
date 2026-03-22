"use server"

import prisma from "./prisma"
import { calcMonthStartAndEndForDate, getCurrentWeekForDate } from "./utils"
import { ApplicationFormData } from "./zod"

export async function getApplicationsByUserId(userId: string) {
  return await prisma.application.findMany({ where: { userId } })
}

export async function getApplictionsWhereStatusApplied(userId: string) {
  return await prisma.application.findMany({
    where: { userId, status: "applied" },
  })
}

export async function getApplicationsThisWeek(userId: string) {
  const currentWeek = getCurrentWeekForDate(new Date())

  return await prisma.application.findMany({
    where: {
      userId: userId,
      appliedDate: { gte: currentWeek.weekStart, lte: currentWeek.weekEnd },
    },
  })
}

export async function getApplicationsForMonth(
  userId: string,
  date: Date = new Date()
) {
  const { monthStart, monthEnd } = calcMonthStartAndEndForDate(date)

  return await prisma.application.findMany({
    where: { userId: userId, appliedDate: { gte: monthStart, lte: monthEnd } },
  })
}

export async function getResponsesThisWeek(userId: string) {
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

export async function getOffersByUserIed(userId: string) {
  return await prisma.application.findMany({
    where: { userId, status: "offer" },
  })
}

export async function getInterviewsByUserId(userId: string) {
  return await prisma.interview.findMany({ where: { application: { userId } } })
}

export async function getInterviewsThisWeek(userId: string) {
  const currentWeek = getCurrentWeekForDate(new Date())

  return await prisma.interview.findMany({
    where: {
      application: {
        userId: userId,
      },
      date: { gte: currentWeek.weekStart, lte: currentWeek.weekEnd },
    },
  })
}

export async function createApplication(
  userId: string,
  formData: ApplicationFormData
) {
  return await prisma.application.create({
    data: {
      userId,
      company: formData.company,
      position: formData.position,
      status: formData.status,
      appliedDate: formData.appliedDate,
      source: formData.source,
      jobType: formData.jobType,
      location: formData.location,
      salary: formData.salary,
      url: formData.url,
      notes: formData.notes,
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
        location: formData.location,
        salary: formData.salary,
        url: formData.url,
        notes: formData.notes,
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
