import prisma from "@/lib/prisma"
import test, { APIRequestContext, expect, Page } from "@playwright/test"

const PASSWORD = "password123"

test.describe("edit contact", () => {
  let userId: string
  let email: string
  let storageState: Awaited<ReturnType<APIRequestContext["storageState"]>>

  test.beforeAll(async ({ request }) => {
    email = `edit-contact-test-${test.info().workerIndex}@example.com`

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) await prisma.user.delete({ where: { id: existing.id } })

    await request.post("/api/auth/sign-up/email", {
      data: { name: "Test User", email, password: PASSWORD },
    })
    const user = await prisma.user.findUnique({ where: { email } })
    userId = user!.id

    await request.post("/api/auth/sign-in/email", {
      data: { email, password: PASSWORD },
    })
    storageState = await request.storageState()
  })

  test.afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } })
  })

  test.beforeEach(async ({ page }) => {
    await prisma.contact.deleteMany({ where: { userId } })
    await prisma.contact.create({
      data: {
        userId,
        name: "Jane Smith",
        company: "Acme Corp",
        role: "recruiter",
      },
    })

    await page.context().addCookies(storageState.cookies)
    await page.goto("/contacts")
    await expect(page.getByText("Jane Smith")).toBeVisible()
  })

  test.afterEach(async () => {
    await prisma.contact.deleteMany({ where: { userId } })
  })

  async function openEditSheet(page: Page) {
    await page.getByRole("button", { name: "Open menu" }).click()
    await page.getByRole("menuitem", { name: "Edit" }).click()
  }

  test("clicking Edit opens the edit sheet", async ({ page }) => {
    await openEditSheet(page)

    await expect(page.getByText("Edit Contact")).toBeVisible()
  })

  test("the edit sheet pre-fills with the current contact values", async ({
    page,
  }) => {
    await openEditSheet(page)

    await expect(page.getByLabel("Name")).toHaveValue("Jane Smith")
    await expect(page.getByLabel("Company")).toHaveValue("Acme Corp")
    await expect(
      page.getByRole("combobox").filter({ hasText: "Recruiter" })
    ).toBeVisible()
  })

  test("Save button is disabled until a change is made", async ({ page }) => {
    await openEditSheet(page)

    await expect(page.getByRole("button", { name: "Save" })).toBeDisabled()

    await page.getByLabel("Name").fill("John Doe")

    await expect(page.getByRole("button", { name: "Save" })).toBeEnabled()
  })

  test("editing the name persists to the database", async ({ page }) => {
    await openEditSheet(page)
    await page.getByLabel("Name").fill("John Doe")
    await page.getByRole("button", { name: "Save" }).click()
    await page.waitForSelector("[data-sonner-toast]")

    const contact = await prisma.contact.findFirst({ where: { userId } })
    expect(contact?.name).toBe("John Doe")
  })

  test("editing the role persists to the database", async ({ page }) => {
    await openEditSheet(page)
    await page.getByRole("combobox").filter({ hasText: "Recruiter" }).click()
    await page.getByRole("option", { name: "Hiring Manager" }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await page.waitForSelector("[data-sonner-toast]")

    const contact = await prisma.contact.findFirst({ where: { userId } })
    expect(contact?.role).toBe("hiring_manager")
  })

  test("clicking Cancel discards changes", async ({ page }) => {
    await openEditSheet(page)
    await page.getByLabel("Name").fill("John Doe")
    await page.getByRole("button", { name: "Cancel" }).click()

    const contact = await prisma.contact.findFirst({ where: { userId } })
    expect(contact?.name).toBe("Jane Smith")
  })
})
