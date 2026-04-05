import prisma from "@/lib/prisma"
import { APIRequestContext, test as base } from "@playwright/test"

const PASSWORD = "password123"
const BASE_URL = "http://localhost:3000"

type WorkerFixtures = {
  authenticatedUser: {
    userId: string
    email: string
    storageState: Awaited<ReturnType<APIRequestContext["storageState"]>>
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const test = base.extend<{}, WorkerFixtures>({
  authenticatedUser: [
    async ({ playwright }, use, workerInfo) => {
      const request = await playwright.request.newContext({ baseURL: BASE_URL })
      const email = `test-worker-${workerInfo.workerIndex}@example.com`

      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) await prisma.user.delete({ where: { id: existing.id } })

      await request.post("/api/auth/sign-up/email", {
        data: { name: "Test User", email, password: PASSWORD },
      })
      const user = await prisma.user.findUnique({ where: { email } })
      const userId = user!.id

      await request.post("/api/auth/sign-in/email", {
        data: { email, password: PASSWORD },
      })
      const storageState = await request.storageState()

      await use({ userId, email, storageState })

      await prisma.user.deleteMany({ where: { id: userId } })
      await request.dispose()
    },
    { scope: "worker" },
  ],
})

export { expect } from "@playwright/test"
