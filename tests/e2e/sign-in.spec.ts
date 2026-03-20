import prisma from "@/lib/prisma"
import test, { expect } from "@playwright/test"
import { fillSignInForm } from "./test-utils"

test.beforeEach(async ({ page }) => {
  await page.goto("/sign-in")
})

test.describe("sign-in form", () => {
  test("renders all fields", async ({ page }) => {
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible()
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
    await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
      "aria-invalid",
      "true"
    )
  })

  test("shows error when email or password is incorrect", async ({ page }) => {
    await fillSignInForm(page, { password: "incorrectpassword" })
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

  test("clicking Login with Google initiates Google OAuth", async ({
    page,
  }) => {
    const authRequest = page.waitForRequest((req) =>
      req.url().includes("/api/auth/sign-in/social")
    )

    await page.getByRole("button", { name: "Login with Google" }).click()

    await expect(authRequest).resolves.toBeDefined()
  })

  test("has a link to the sign-up page", async ({ page }) => {
    await page.getByRole("link", { name: "Sign up" }).click()
    await expect(page).toHaveURL("/sign-up")
  })

  test.describe("redirects to home on successful sign-in", () => {
    let email: string

    test.beforeEach(async ({ request }) => {
      email = `test+${Date.now()}@example.com`
      await request.post("/api/auth/sign-up/email", {
        data: { name: "Jane Doe", email, password: "password123" },
      })
    })

    test.afterEach(async () => {
      await prisma.user.delete({ where: { email } })
    })

    test("redirects to home", async ({ page }) => {
      await fillSignInForm(page, { email })
      await page.getByRole("button", { name: "Login", exact: true }).click()

      await expect(page).toHaveURL("/")
    })
  })
})
