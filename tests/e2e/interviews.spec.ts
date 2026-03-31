import prisma from "@/lib/prisma"
import test, { BrowserContext, expect, Page } from "@playwright/test"

const PASSWORD = "password123"
const FIXED_NOON = new Date("2026-03-31T12:00:00")

test.describe("interviews page", () => {
  let userId: string
  let email: string
  let storageState: Awaited<ReturnType<BrowserContext["storageState"]>>

  test.beforeAll(async ({ browser, request }) => {
    email = `interviews-test-${test.info().workerIndex}@example.com`

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) await prisma.user.delete({ where: { id: existing.id } })

    await request.post("/api/auth/sign-up/email", {
      data: { name: "Test User", email, password: PASSWORD },
    })

    const user = await prisma.user.findUnique({ where: { email } })
    userId = user!.id

    await prisma.application.create({
      data: {
        userId,
        company: "Stripe",
        position: "Senior Frontend Engineer",
        status: "applied",
        appliedDate: new Date(),
        source: "linkedin",
        jobType: "full_time",
      },
    })

    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto("/sign-in")
    await page.getByLabel("Email").fill(email)
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD)
    await page.getByRole("button", { name: "Login", exact: true }).click()
    await page.waitForURL("/")
    storageState = await context.storageState()
    await context.close()
  })

  test.afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } })
  })

  test.beforeEach(async ({ page }) => {
    await prisma.interview.deleteMany({ where: { application: { userId } } })
    await page.context().addCookies(storageState.cookies)
    await page.clock.setFixedTime(FIXED_NOON)
    await page.goto("/interviews")
  })

  test.afterEach(async () => {
    await prisma.interview.deleteMany({ where: { application: { userId } } })
  })

  async function scheduleInterview(
    page: Page,
    { time = "09:00" }: { time?: string } = {}
  ) {
    await page.getByRole("button", { name: "Schedule interview" }).click()

    await page
      .getByRole("combobox")
      .filter({ hasText: "Select application" })
      .click()
    await page
      .getByRole("option", { name: "Stripe — Senior Frontend Engineer" })
      .click()

    await page.getByLabel("Time").fill(time)

    await page.getByRole("combobox").filter({ hasText: "Select type" }).click()
    await page.getByRole("option", { name: "Phone" }).click()

    await page.getByRole("combobox").filter({ hasText: "Select round" }).click()
    await page.getByRole("option", { name: "Recruiter Screen" }).click()

    await page.getByRole("button", { name: "Save" }).click()
  }

  test("shows empty state when the user has no interviews", async ({
    page,
  }) => {
    await expect(
      page.getByText(
        "No interviews yet. Add your first interview to get started!"
      )
    ).toBeVisible()
  })

  test("shows a scheduled interview in the Upcoming Interviews section", async ({
    page,
  }) => {
    await scheduleInterview(page, { time: "23:00" })

    await expect(
      page.getByRole("heading", { name: "Upcoming Interviews" })
    ).toBeVisible()
    await expect(page.getByText("Stripe")).toBeVisible()
  })

  test("shows a completed interview in the Past Interviews section", async ({
    page,
  }) => {
    await scheduleInterview(page, { time: "09:00" })

    await expect(
      page.getByRole("heading", { name: "Past Interviews" })
    ).toBeVisible()
    await expect(page.getByText("Stripe")).toBeVisible()
  })

  test("shows upcoming empty state when all interviews are in the past", async ({
    page,
  }) => {
    await scheduleInterview(page, { time: "09:00" })

    await expect(
      page.getByText("Currently no upcoming interviews.")
    ).toBeVisible()
  })

  test("shows past empty state when all interviews are in the future", async ({
    page,
  }) => {
    await scheduleInterview(page, { time: "23:00" })

    await expect(
      page.getByText("You don't have any past interviews.")
    ).toBeVisible()
  })
})
