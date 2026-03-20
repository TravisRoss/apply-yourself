import prisma from "@/lib/prisma"
import test, { expect } from "@playwright/test"
import { fillSignInForm } from "./test-utils"

let email: string

test.beforeEach(async ({ page, request }) => {
  email = `test+${Date.now()}@example.com`
  await request.post("/api/auth/sign-up/email", {
    data: { name: "Jane Doe", email, password: "password123" },
  })
  await page.goto("/sign-in")
  await fillSignInForm(page, { email })
  await page.getByRole("button", { name: "Login", exact: true }).click()
  await page.waitForURL("/")
})

test.afterEach(async () => {
  if (email) {
    await prisma.user.deleteMany({ where: { email } })
  }
})

test("opens confirmation dialog", async ({ page }) => {
  await page.getByRole("button", { name: "Sign out" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Sign out?" })).toBeVisible()
})

test("cancel closes the dialog without navigating", async ({ page }) => {
  await page.getByRole("button", { name: "Sign out" }).click()
  await page.getByRole("button", { name: "Cancel" }).click()
  await expect(page.getByRole("dialog")).not.toBeVisible()
  await expect(page).not.toHaveURL("/sign-in")
})

test("sign out navigates to sign in page", async ({ page }) => {
  await page.getByRole("button", { name: "Sign out" }).click()
  await page.getByRole("dialog").getByRole("button", { name: "Sign out" }).click()
  await expect(page).toHaveURL("/sign-in")
})

test("sign out closes the dialog", async ({ page }) => {
  await page.getByRole("button", { name: "Sign out" }).click()
  await page.getByRole("dialog").getByRole("button", { name: "Sign out" }).click()
  await expect(page.getByRole("dialog")).not.toBeVisible()
})

test("cannot access protected route after signing out", async ({ page }) => {
  await page.getByRole("button", { name: "Sign out" }).click()
  await page.getByRole("dialog").getByRole("button", { name: "Sign out" }).click()
  await page.waitForURL("/sign-in")
  await page.goto("/")
  await expect(page).toHaveURL("/sign-in")
})
