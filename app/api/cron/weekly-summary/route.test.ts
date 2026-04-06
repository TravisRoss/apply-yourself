import prisma from "@/lib/prisma"
import { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { GET } from "./route"

vi.mock("@/lib/email", () => ({ sendEmail: vi.fn() }))

const CRON_SECRET = "test-cron-secret"

function makeRequest(secret?: string) {
  return new NextRequest("http://localhost/api/cron/weekly-summary", {
    headers: secret !== undefined ? { authorization: `Bearer ${secret}` } : {},
  })
}

describe("GET /api/cron/weekly-summary", () => {
  let userId: string

  beforeEach(async () => {
    vi.stubEnv("CRON_SECRET", CRON_SECRET)

    const user = await prisma.user.create({
      data: {
        id: `cron-summary-test-${Date.now()}`,
        name: "Test User",
        email: `cron-summary-${Date.now()}@example.com`,
        emailVerified: true,
        notificationPreferences: {
          create: { interviewReminders: false, weeklySummary: true },
        },
      },
    })
    userId = user.id
  })

  afterEach(async () => {
    await prisma.user.deleteMany({ where: { id: userId } })
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  test("returns 401 without an authorization header", async () => {
    const response = await GET(makeRequest())
    expect(response.status).toBe(401)
  })

  test("returns 401 with a wrong secret", async () => {
    const response = await GET(makeRequest("wrong-secret"))
    expect(response.status).toBe(401)
  })

  test("returns 200 and calls sendEmail for users with weeklySummary enabled", async () => {
    const { sendEmail } = await import("@/lib/email")

    const response = await GET(makeRequest(CRON_SECRET))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.sent).toBe(1)
    expect(sendEmail).toHaveBeenCalledOnce()
  })

  test("does not call sendEmail for users with weeklySummary disabled", async () => {
    const { sendEmail } = await import("@/lib/email")

    await prisma.notificationPreferences.update({
      where: { userId },
      data: { weeklySummary: false },
    })

    const response = await GET(makeRequest(CRON_SECRET))
    const body = await response.json()

    expect(body.sent).toBe(0)
    expect(sendEmail).not.toHaveBeenCalled()
  })
})
