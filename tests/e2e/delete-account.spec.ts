import prisma from "@/lib/prisma"
import test, { APIRequestContext, expect } from "@playwright/test"

const PASSWORD = "password123"

test.describe("delete account", () => {
  let email: string
  let storageState: Awaited<ReturnType<APIRequestContext["storageState"]>>

  async function createUser(request: APIRequestContext) {
    email = `delete-account-test-${test.info().workerIndex}@example.com`

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing !== null)
      await prisma.user.delete({ where: { id: existing.id } })

    await request.post("/api/auth/sign-up/email", {
      data: { name: "Test User", email, password: PASSWORD },
    })

    await request.post("/api/auth/sign-in/email", {
      data: { email, password: PASSWORD },
    })
    storageState = await request.storageState()
  }

  test.beforeEach(async ({ request }) => {
    await createUser(request)
  })

  test.afterEach(async () => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (user !== null) await prisma.user.delete({ where: { id: user.id } })
  })

  test("clicking Delete opens the confirmation dialog", async ({ page }) => {
    await page.context().addCookies(storageState.cookies)
    await page.goto("/settings")

    await page.getByRole("button", { name: "Delete" }).click()

    await expect(page.getByRole("alertdialog")).toBeVisible()
    await expect(page.getByText("Delete account?")).toBeVisible()
  })

  test("clicking Cancel keeps the account", async ({ page }) => {
    await page.context().addCookies(storageState.cookies)
    await page.goto("/settings")

    await page.getByRole("button", { name: "Delete" }).click()
    await page.getByRole("button", { name: "Cancel" }).click()

    await expect(page.getByRole("alertdialog")).not.toBeVisible()

    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).not.toBeNull()
  })

  test("confirming deletion removes the account and redirects to sign-in", async ({
    page,
  }) => {
    await page.context().addCookies(storageState.cookies)
    await page.goto("/settings")

    await page.getByRole("button", { name: "Delete" }).click()
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Delete" })
      .click()

    await page.waitForURL("/sign-in")

    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })
})
