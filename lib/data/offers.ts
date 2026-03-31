"use server"

import prisma from "@/lib/prisma"

export async function getOffersByUserId(userId: string) {
  return await prisma.application.findMany({
    where: { userId, status: "offer" },
  })
}
