import prisma from "@/lib/prisma"
import test, { expect } from "@playwright/test"

const PASSWORD = "password123"

test.describe("edit application", () => {
  let userId: string
  let email: string

  test.beforeAll(async ({ request }) => {
    email = `edit-application-test-${test.info().workerIndex}@example.com`

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      await prisma.user.delete({ where: { id: existing.id } })
    }

    await request.post("/api/auth/sign-up/email", {
      data: { name: "Test User", email, password: PASSWORD },
    })
    const user = await prisma.user.findUnique({ where: { email } })
    userId = user!.id
  })

  test.afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } })
  })

  test.beforeEach(async ({ page }) => {
    await prisma.application.deleteMany({ where: { userId } })
    await prisma.application.create({
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

    await page.goto("/sign-in")
    await page.getByLabel("Email").fill(email)
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD)
    await page.getByRole("button", { name: "Login", exact: true }).click()
    await page.waitForURL("/")
    await page.goto("/applications")
  })

  test.afterEach(async () => {
    await prisma.application.deleteMany({ where: { userId } })
  })

  test("clicking Edit opens the edit sheet", async ({ page }) => {
    await page.getByRole("button", { name: "Open menu" }).click()
    await page.getByRole("menuitem", { name: "Edit" }).click()

    await expect(page.getByText("Edit application")).toBeVisible()
  })

  test("Save button is disabled until a field is changed", async ({ page }) => {
    const dirtyLogs: string[] = []
    page.on("console", (msg) => {
      if (msg.text().startsWith("[dirty-debug]")) dirtyLogs.push(msg.text())
    })

    await page.getByRole("button", { name: "Open menu" }).click()
    await page.getByRole("menuitem", { name: "Edit" }).click()
    await page.waitForTimeout(1000)

    console.log("Dirty logs:", dirtyLogs)
    await expect(page.getByRole("button", { name: "Save" })).toBeDisabled()
  })

  test("editing the company name updates it in the table", async ({ page }) => {
    await page.getByRole("button", { name: "Open menu" }).click()
    await page.getByRole("menuitem", { name: "Edit" }).click()

    await page.getByLabel("Company").clear()
    await page.getByLabel("Company").fill("New Company")
    await page.getByRole("button", { name: "Save" }).click()

    await expect(page.getByText("New Company")).toBeVisible()
    await expect(page.getByText("Acme Corp")).not.toBeVisible()
  })

  test("editing the status persists to the database", async ({ page }) => {
    await page.getByRole("button", { name: "Open menu" }).click()
    await page.getByRole("menuitem", { name: "Edit" }).click()

    await page.getByRole("combobox").filter({ hasText: "Applied" }).click()
    await page.getByRole("option", { name: "Interview" }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await page.waitForSelector('[data-sonner-toast]')

    const application = await prisma.application.findFirst({
      where: { userId },
    })
    expect(application?.status).toBe("interview")
  })

  test("editing the status creates a status history entry", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Open menu" }).click()
    await page.getByRole("menuitem", { name: "Edit" }).click()

    await page.getByRole("combobox").filter({ hasText: "Applied" }).click()
    await page.getByRole("option", { name: "Interview" }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await page.waitForSelector('[data-sonner-toast]')

    const application = await prisma.application.findFirst({
      where: { userId },
    })
    const history = await prisma.statusHistory.findFirst({
      where: { applicationId: application!.id },
    })

    expect(history?.fromStatus).toBe("applied")
    expect(history?.toStatus).toBe("interview")
  })

  test("editing a non-status field does not create a status history entry", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Open menu" }).click()
    await page.getByRole("menuitem", { name: "Edit" }).click()

    await page.getByLabel("Company").clear()
    await page.getByLabel("Company").fill("New Company")
    await page.getByRole("button", { name: "Save" }).click()
    await page.waitForSelector('[data-sonner-toast]')

    const application = await prisma.application.findFirst({
      where: { userId },
    })
    const history = await prisma.statusHistory.findFirst({
      where: { applicationId: application!.id },
    })

    expect(history).toBeNull()
  })

  test("clicking Cancel discards changes", async ({ page }) => {
    await page.getByRole("button", { name: "Open menu" }).click()
    await page.getByRole("menuitem", { name: "Edit" }).click()

    await page.getByLabel("Company").clear()
    await page.getByLabel("Company").fill("Should Not Save")
    await page.getByRole("button", { name: "Cancel" }).click()

    await expect(page.getByText("Acme Corp")).toBeVisible()
    await expect(page.getByText("Should Not Save")).not.toBeVisible()
  })
})
