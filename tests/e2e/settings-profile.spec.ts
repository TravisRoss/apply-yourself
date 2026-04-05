import prisma from "@/lib/prisma"
import test, { APIRequestContext, expect } from "@playwright/test"

const PASSWORD = "password123"

test.describe("settings profile", () => {
  let userId: string
  let email: string
  let storageState: Awaited<ReturnType<APIRequestContext["storageState"]>>

  test.beforeAll(async ({ request }) => {
    email = `settings-profile-test-${test.info().workerIndex}@example.com`

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing !== null)
      await prisma.user.delete({ where: { id: existing.id } })

    await request.post("/api/auth/sign-up/email", {
      data: { name: "Jane Smith", email, password: PASSWORD },
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
    await page.context().addCookies(storageState.cookies)
    await page.goto("/settings")
    await expect(page.getByLabel("Full Name")).toBeVisible()
  })

  test("form is pre-filled with the user's name and email", async ({
    page,
  }) => {
    await expect(page.getByLabel("Full Name")).toHaveValue("Jane Smith")
    await expect(page.getByLabel("Email")).toHaveValue(email)
  })

  test("updating the name persists to the database", async ({ page }) => {
    await page.getByLabel("Full Name").fill("John Doe")
    await page.getByRole("button", { name: "Save Profile" }).click()
    await page.waitForSelector("[data-sonner-toast]")

    const user = await prisma.user.findUnique({ where: { id: userId } })
    expect(user?.name).toBe("John Doe")
  })
})
