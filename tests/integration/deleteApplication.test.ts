// @vitest-environment node
import prisma from "@/lib/prisma"
import { deleteApplication } from "@/lib/data/applications"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

const EMAIL = "delete-application-integration@example.com"

describe("deleteApplication", () => {
  let userId: string

  beforeAll(async () => {
    const existing = await prisma.user.findFirst({ where: { email: EMAIL } })
    if (existing) {
      await prisma.application.deleteMany({ where: { userId: existing.id } })
      await prisma.user.delete({ where: { id: existing.id } })
    }
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: "Test User",
        email: EMAIL,
        emailVerified: true,
      },
    })
    userId = user.id
  })

  afterAll(async () => {
    await prisma.application.deleteMany({ where: { userId } })
    await prisma.user.delete({ where: { id: userId } })
  })

  it("deletes an existing application from the database", async () => {
    const application = await prisma.application.create({
      data: {
        userId,
        company: "Acme Corp",
        position: "Software Engineer",
        status: "applied",
        appliedDate: new Date(),
        source: "linkedin",
        jobType: "full_time",
      },
    })

    await deleteApplication(application.id)

    const deleted = await prisma.application.findUnique({
      where: { id: application.id },
    })
    expect(deleted).toBeNull()
  })

  it("throws when the application does not exist", async () => {
    await expect(deleteApplication("non-existent-id")).rejects.toThrow()
  })
})
