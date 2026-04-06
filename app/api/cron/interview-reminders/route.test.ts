import prisma from "@/lib/prisma"
import { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { GET } from "./route"

vi.mock("@/lib/email", () => ({ sendEmail: vi.fn() }))

const CRON_SECRET = "test-cron-secret"

function makeRequest(secret?: string) {
  return new NextRequest("http://localhost/api/cron/interview-reminders", {
    headers: secret !== undefined ? { authorization: `Bearer ${secret}` } : {},
  })
}

describe("GET /api/cron/interview-reminders", () => {
  let userId: string
  let applicationId: string

  beforeEach(async () => {
    vi.stubEnv("CRON_SECRET", CRON_SECRET)

    const user = await prisma.user.create({
      data: {
        id: `cron-reminder-test-${Date.now()}`,
        name: "Test User",
        email: `cron-reminder-${Date.now()}@example.com`,
        emailVerified: true,
        notificationPreferences: {
          create: { interviewReminders: true, weeklySummary: false },
        },
      },
    })
    userId = user.id

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
    applicationId = application.id
  })

  afterEach(async () => {
    await prisma.user.deleteMany({ where: { id: userId } })
    vi.unstubAllEnvs()
  })

  test("returns 401 without an authorization header", async () => {
    const response = await GET(makeRequest())
    expect(response.status).toBe(401)
  })

  test("returns 401 with a wrong secret", async () => {
    const response = await GET(makeRequest("wrong-secret"))
    expect(response.status).toBe(401)
  })

  test("stamps reminderSentAt on interviews in the 24-hour window", async () => {
    const interviewDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const interview = await prisma.interview.create({
      data: {
        applicationId,
        date: interviewDate,
        type: "video_call",
        round: "technical",
      },
    })

    await GET(makeRequest(CRON_SECRET))

    const updated = await prisma.interview.findUnique({
      where: { id: interview.id },
    })
    expect(updated?.reminderSentAt).not.toBeNull()
  })

  test("does not stamp interviews outside the 24-hour window", async () => {
    const interviewDate = new Date(Date.now() + 48 * 60 * 60 * 1000)
    const interview = await prisma.interview.create({
      data: {
        applicationId,
        date: interviewDate,
        type: "video_call",
        round: "technical",
      },
    })

    await GET(makeRequest(CRON_SECRET))

    const unchanged = await prisma.interview.findUnique({
      where: { id: interview.id },
    })
    expect(unchanged?.reminderSentAt).toBeNull()
  })

  test("does not re-stamp interviews already sent", async () => {
    const alreadySentAt = new Date("2026-01-01")
    const interviewDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const interview = await prisma.interview.create({
      data: {
        applicationId,
        date: interviewDate,
        type: "video_call",
        round: "technical",
        reminderSentAt: alreadySentAt,
      },
    })

    await GET(makeRequest(CRON_SECRET))

    const unchanged = await prisma.interview.findUnique({
      where: { id: interview.id },
    })
    expect(unchanged?.reminderSentAt?.toISOString()).toBe(
      alreadySentAt.toISOString()
    )
  })
})
