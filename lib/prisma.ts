import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// Create a global Prisma client in the global scope so that it's
// accessible from anywhere and avoid creating a new client for each request
const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  })
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
export default prisma
