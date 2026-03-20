import { Page } from "@playwright/test"

export async function fillSignInForm(
  page: Page,
  overrides: Partial<{
    email: string
    password: string
  }> = {}
) {
  const values = {
    email: "jane@example.com",
    password: "password123",
    ...overrides,
  }
  await page.getByLabel("Email").fill(values.email)
  await page.getByLabel("Password", { exact: true }).fill(values.password)
}
