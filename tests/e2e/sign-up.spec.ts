import { test, expect, Page } from "@playwright/test"
import prisma from "../../lib/prisma"

async function fillForm(
  page: Page,
  overrides: Partial<{
    name: string
    email: string
    password: string
    confirmPassword: string
  }> = {}
) {
  const values = {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
    confirmPassword: "password123",
    ...overrides,
  }
  await page.getByLabel("Full Name").fill(values.name)
  await page.getByLabel("Email").fill(values.email)
  await page.getByLabel("Password", { exact: true }).fill(values.password)
  await page
    .getByLabel("Confirm Password", { exact: true })
    .fill(values.confirmPassword)
}

test.beforeEach(async ({ page }) => {
  await page.goto("/sign-up")
})

test.describe("sign-up form", () => {
  test("renders all fields", async ({ page }) => {
    await expect(page.getByLabel("Full Name")).toBeVisible()
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible()
    await expect(
      page.getByLabel("Confirm Password", { exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Create Account" })
    ).toBeVisible()
  })

  test("shows validation errors when submitting empty form", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Create Account" }).click()

    await expect(page.getByLabel("Full Name")).toHaveAttribute(
      "aria-invalid",
      "true"
    )
    await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
      "aria-invalid",
      "true"
    )
  })

  test("shows error when passwords do not match", async ({ page }) => {
    await fillForm(page, { confirmPassword: "differentpassword" })
    await page.getByRole("button", { name: "Create Account" }).click()

    await expect(
      page.getByLabel("Confirm Password", { exact: true })
    ).toHaveAttribute("aria-invalid", "true")
  })

  test("shows error when password is too short", async ({ page }) => {
    await fillForm(page, { password: "short", confirmPassword: "short" })
    await page.getByRole("button", { name: "Create Account" }).click()

    await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
      "aria-invalid",
      "true"
    )
  })

  test("toggles password visibility", async ({ page }) => {
    const passwordInput = page.getByLabel("Password", { exact: true })
    await passwordInput.fill("mysecretpassword")

    await expect(passwordInput).toHaveAttribute("type", "password")
    await page.getByRole("button", { name: "Show password" }).click()
    await expect(passwordInput).toHaveAttribute("type", "text")
  })

  test("shows error when email is already registered", async ({ page }) => {
    await fillForm(page, { email: "existing@example.com" })
    await page.getByRole("button", { name: "Create Account" }).click()

    await expect(page.getByLabel("Email")).toHaveAttribute(
      "aria-invalid",
      "true"
    )
  })

  test("has a link to the sign-in page", async ({ page }) => {
    await page.getByRole("link", { name: "Sign in" }).click()
    await expect(page).toHaveURL("/sign-in")
  })

  test.describe("redirects to home on successful sign-up", () => {
    let email: string

    test.afterEach(async () => {
      await prisma.user.delete({ where: { email } })
    })

    test("redirects to home", async ({ page }) => {
      email = `test+${Date.now()}@example.com`
      await fillForm(page, { email })
      await page.getByRole("button", { name: "Create Account" }).click()

      await expect(page).toHaveURL("/")
    })
  })
})
