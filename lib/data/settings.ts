"use server"

import prisma from "../prisma"

export async function deleteAccount(userId: string) {
  await prisma.user.delete({ where: { id: userId } })
}
