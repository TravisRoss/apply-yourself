import prisma from "@/lib/prisma"
import test, { expect } from "@playwright/test"

const PASSWORD = "password123"

test.describe("delete application", () => {
  let userId: string
  let email: string

  test.beforeAll(async ({ request }) => {
    email = `delete-application-test-${test.info().workerIndex}@example.com`

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      await prisma.application.deleteMany({ where: { userId: existing.id } })
      await prisma.user.delete({ where: { id: existing.id } })
    }

    await request.post("/api/auth/sign-up/email", {
      data: { name: "Test User", email, password: PASSWORD },
    })
    const user = await prisma.user.findUnique({ where: { email } })
    userId = user!.id
  })

  test.afterAll(async () => {
    await prisma.application.deleteMany({ where: { userId } })
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

  test("clicking Delete opens the confirmation dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Open menu" }).click()
    await page.getByRole("menuitem", { name: "Delete" }).click()

    await expect(page.getByRole("alertdialog")).toBeVisible()
    await expect(
      page.getByText("Delete selected application?")
    ).toBeVisible()
  })

  test("clicking Cancel keeps the application", async ({ page }) => {
    await page.getByRole("button", { name: "Open menu" }).click()
    await page.getByRole("menuitem", { name: "Delete" }).click()
    await page.getByRole("button", { name: "Cancel" }).click()

    await expect(page.getByRole("alertdialog")).not.toBeVisible()
    await expect(page.getByText("Acme Corp")).toBeVisible()
  })

  test("clicking Delete removes the application from the table", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Open menu" }).click()
    await page.getByRole("menuitem", { name: "Delete" }).click()
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Delete" })
      .click()

    await expect(page.getByText("Acme Corp")).not.toBeVisible()
  })
})
