"use server"

import prisma from "./prisma"

export async function getApplicationsByUserId(userId: string) {
  return await prisma.application.findMany({ where: { userId } })
}
