"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"

async function getUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function getOffersByUserId() {
  const userId = await getUserId()
  if (userId === null) return []
  return await prisma.application.findMany({
    where: { userId, status: "offer" },
  })
}
