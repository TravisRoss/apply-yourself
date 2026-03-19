import prisma from "@/lib/prisma"
import test, { expect, Page } from "@playwright/test"

async function fillForm(
  page: Page,
  overrides: Partial<{
    email: string
    password: string
  }> = {}
) {
  // insert the test user into the db

  const values = {
    email: "jane@example.com",
    password: "password123",
    ...overrides,
  }
  await page.getByLabel("Email").fill(values.email)
  await page.getByLabel("Password").fill(values.password)
}

test.beforeEach(async ({ page }) => {
  await page.goto("/sign-in")
})

test.describe("sign-in form", () => {
  test("renders all fields", async ({ page }) => {
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByLabel("Password")).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Login", exact: true })
    ).toBeVisible()
  })

  test("shows validation errors when submitting empty form", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Login", exact: true }).click()

    await expect(page.getByLabel("Email")).toHaveAttribute(
      "aria-invalid",
      "true"
    )
    await expect(page.getByLabel("Password")).toHaveAttribute(
      "aria-invalid",
      "true"
    )
  })

  test("shows error when email or password is incorrect", async ({ page }) => {
    await fillForm(page, { password: "incorrectpassword" })
    await page.getByRole("button", { name: "Login", exact: true }).click()

    await expect(page.getByRole("alert")).toBeVisible()
  })

  test("toggles password visibility", async ({ page }) => {
    const passwordInput = page.getByLabel("Password", { exact: true })
    await passwordInput.fill("mysecretpassword")

    await expect(passwordInput).toHaveAttribute("type", "password")
    await page.getByRole("button", { name: "Show password" }).click()
    await expect(passwordInput).toHaveAttribute("type", "text")
  })

  test("redirects to home on successful sign-in", async ({ page }) => {
    await prisma.
    await fillForm(page)
    await page.getByRole("button", { name: "login-submit" }).click()

    await expect(page).toHaveURL("/")
  })
})
