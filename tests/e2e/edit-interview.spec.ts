import prisma from "@/lib/prisma"
import test, { BrowserContext, expect, Page } from "@playwright/test"

const PASSWORD = "password123"
const FIXED_NOON = new Date("2026-03-31T12:00:00")
const UPCOMING_DATE = new Date("2026-03-31T23:00:00")

test.describe("edit interview", () => {
  let userId: string
  let applicationId: string
  let email: string
  let storageState: Awaited<ReturnType<BrowserContext["storageState"]>>

  test.beforeAll(async ({ browser, request }) => {
    email = `edit-interview-test-${test.info().workerIndex}@example.com`

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) await prisma.user.delete({ where: { id: existing.id } })

    await request.post("/api/auth/sign-up/email", {
      data: { name: "Test User", email, password: PASSWORD },
    })
    const user = await prisma.user.findUnique({ where: { email } })
    userId = user!.id

    const application = await prisma.application.create({
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
    applicationId = application.id

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
    await prisma.interview.create({
      data: {
        applicationId,
        date: UPCOMING_DATE,
        type: "phone",
        round: "recruiter_screen",
      },
    })
    await page.context().addCookies(storageState.cookies)
    await page.clock.setFixedTime(FIXED_NOON)
    await page.goto("/interviews")
  })

  test.afterEach(async () => {
    await prisma.interview.deleteMany({ where: { application: { userId } } })
  })

  async function openEditSheet(page: Page) {
    await page.getByRole("button", { name: "Open menu" }).click()
    await page.getByRole("menuitem", { name: "Edit" }).click()
  }

  test("clicking Edit opens the edit sheet", async ({ page }) => {
    await openEditSheet(page)

    await expect(page.getByText("Edit interview")).toBeVisible()
  })

  test("the edit sheet pre-fills with the current interview values", async ({
    page,
  }) => {
    await openEditSheet(page)

    await expect(
      page.getByRole("combobox").filter({ hasText: "Phone" })
    ).toBeVisible()
    await expect(
      page.getByRole("combobox").filter({ hasText: "Recruiter Screen" })
    ).toBeVisible()
  })

  test("editing the type persists to the database", async ({ page }) => {
    await openEditSheet(page)
    await page.getByRole("combobox").filter({ hasText: "Phone" }).click()
    await page.getByRole("option", { name: "Video Call" }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await page.waitForSelector("[data-sonner-toast]")

    const interview = await prisma.interview.findFirst({
      where: { application: { userId } },
    })
    expect(interview?.type).toBe("video_call")
  })

  test("editing the round persists to the database", async ({ page }) => {
    await openEditSheet(page)
    await page
      .getByRole("combobox")
      .filter({ hasText: "Recruiter Screen" })
      .click()
    await page.getByRole("option", { name: "Technical" }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await page.waitForSelector("[data-sonner-toast]")

    const interview = await prisma.interview.findFirst({
      where: { application: { userId } },
    })
    expect(interview?.round).toBe("technical")
  })

  test("clicking Cancel discards changes", async ({ page }) => {
    await openEditSheet(page)
    await page.getByRole("combobox").filter({ hasText: "Phone" }).click()
    await page.getByRole("option", { name: "Video Call" }).click()
    await page.getByRole("button", { name: "Cancel" }).click()

    const interview = await prisma.interview.findFirst({
      where: { application: { userId } },
    })
    expect(interview?.type).toBe("phone")
  })
})
