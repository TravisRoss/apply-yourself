import prisma from "@/lib/prisma"
import test, { APIRequestContext, expect } from "@playwright/test"

const PASSWORD = "password123"

test.describe("search contacts", () => {
  let userId: string
  let email: string
  let storageState: Awaited<ReturnType<APIRequestContext["storageState"]>>

  test.beforeAll(async ({ request }) => {
    email = `search-contacts-test-${test.info().workerIndex}@example.com`

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
        name: "Alice Johnson",
        company: "Acme Corp",
        role: "recruiter",
        notes: "Met at a conference",
      },
    })
    await prisma.contact.create({
      data: {
        userId,
        name: "Bob Martinez",
        company: "Globex",
        role: "hiring_manager",
      },
    })
    await prisma.contact.create({
      data: {
        userId,
        name: "Carol White",
        company: "Initech",
        role: "referral",
        notes: "Referral from a friend",
      },
    })

    await page.context().addCookies(storageState.cookies)
    await page.goto("/contacts")
    await expect(page.getByText("Alice Johnson")).toBeVisible()
    await expect(page.getByText("Bob Martinez")).toBeVisible()
    await expect(page.getByText("Carol White")).toBeVisible()
  })

  test.afterEach(async () => {
    await prisma.contact.deleteMany({ where: { userId } })
  })

  test("searching by name shows only matching contacts", async ({ page }) => {
    await page.getByPlaceholder("Search contacts...").fill("Alice")

    await expect(page.getByText("Alice Johnson")).toBeVisible()
    await expect(page.getByText("Bob Martinez")).not.toBeVisible()
    await expect(page.getByText("Carol White")).not.toBeVisible()
  })

  test("searching by company shows only matching contacts", async ({
    page,
  }) => {
    await page.getByPlaceholder("Search contacts...").fill("Globex")

    await expect(page.getByText("Bob Martinez")).toBeVisible()
    await expect(page.getByText("Alice Johnson")).not.toBeVisible()
    await expect(page.getByText("Carol White")).not.toBeVisible()
  })

  test("searching by notes shows only matching contacts", async ({ page }) => {
    await page.getByPlaceholder("Search contacts...").fill("conference")

    await expect(page.getByText("Alice Johnson")).toBeVisible()
    await expect(page.getByText("Bob Martinez")).not.toBeVisible()
    await expect(page.getByText("Carol White")).not.toBeVisible()
  })

  test("search is case-insensitive", async ({ page }) => {
    await page.getByPlaceholder("Search contacts...").fill("acme corp")

    await expect(page.getByText("Alice Johnson")).toBeVisible()
    await expect(page.getByText("Bob Martinez")).not.toBeVisible()
    await expect(page.getByText("Carol White")).not.toBeVisible()
  })

  test("clearing the search restores all contacts", async ({ page }) => {
    await page.getByPlaceholder("Search contacts...").fill("Alice")
    await expect(page.getByText("Bob Martinez")).not.toBeVisible()

    await page.getByPlaceholder("Search contacts...").clear()

    await expect(page.getByText("Alice Johnson")).toBeVisible()
    await expect(page.getByText("Bob Martinez")).toBeVisible()
    await expect(page.getByText("Carol White")).toBeVisible()
  })

  test("a search term matching no contacts shows a no results message", async ({
    page,
  }) => {
    await page.getByPlaceholder("Search contacts...").fill("zzznomatch")

    await expect(
      page.getByText("No contacts found matching your search.")
    ).toBeVisible()
    await expect(page.getByText("Alice Johnson")).not.toBeVisible()
    await expect(page.getByText("Bob Martinez")).not.toBeVisible()
    await expect(page.getByText("Carol White")).not.toBeVisible()
  })
})
