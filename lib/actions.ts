import prisma from "./prisma"

export async function getApplications() {
  return await prisma.application.findMany()
}
