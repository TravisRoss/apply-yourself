import prisma from "@/lib/prisma"
import test, { APIRequestContext, expect } from "@playwright/test"

const PASSWORD = "password123"

test.describe("delete contact", () => {
  let userId: string
  let email: string
  let storageState: Awaited<ReturnType<APIRequestContext["storageState"]>>

  test.beforeAll(async ({ request }) => {
    email = `delete-contact-test-${test.info().workerIndex}@example.com`

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      await prisma.contact.deleteMany({ where: { userId: existing.id } })
      await prisma.user.delete({ where: { id: existing.id } })
    }

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
    await prisma.contact.deleteMany({ where: { userId } })
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
  })

  test.afterEach(async () => {
    await prisma.contact.deleteMany({ where: { userId } })
  })

  test("clicking Delete opens the confirmation dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Open menu" }).click()
    await page.getByRole("menuitem", { name: "Delete" }).click()

    await expect(page.getByRole("alertdialog")).toBeVisible()
    await expect(page.getByText("Delete selected contact?")).toBeVisible()
  })

  test("clicking Cancel keeps the contact", async ({ page }) => {
    await page.getByRole("button", { name: "Open menu" }).click()
    await page.getByRole("menuitem", { name: "Delete" }).click()
    await page.getByRole("button", { name: "Cancel" }).click()

    await expect(page.getByRole("alertdialog")).not.toBeVisible()
    await expect(page.getByText("Jane Smith")).toBeVisible()
  })

  test("clicking Delete removes the contact from the page", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Open menu" }).click()
    await page.getByRole("menuitem", { name: "Delete" }).click()
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Delete" })
      .click()

    await expect(page.getByText("Jane Smith")).not.toBeVisible()
  })
})
