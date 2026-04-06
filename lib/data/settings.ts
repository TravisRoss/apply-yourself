"use server"

import prisma from "../prisma"

export async function deleteAccount(userId: string) {
  await prisma.user.delete({ where: { id: userId } })
}

export async function getNotificationPreferences(userId: string) {
  return prisma.notificationPreferences.findUnique({
    where: { userId },
  })
}

export async function updateNotificationPreferences(
  userId: string,
  data: { interviewReminders: boolean; weeklySummary: boolean }
) {
  await prisma.notificationPreferences.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  })
}

export async function setLocale(userId: string, locale: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { locale },
  })
}
