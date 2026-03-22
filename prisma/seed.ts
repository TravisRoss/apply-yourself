import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"
import { auth } from "../lib/auth"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const SEED_EMAIL = "seed@example.com"
const SEED_PASSWORD = "password123"

const THIS_MONTH = (day: number) =>
  new Date(`2026-03-${String(day).padStart(2, "0")}`)
const LAST_MONTH = (day: number) =>
  new Date(`2026-02-${String(day).padStart(2, "0")}`)
const TWO_MONTHS_AGO = (day: number) =>
  new Date(`2026-01-${String(day).padStart(2, "0")}`)

async function main() {
  await prisma.user.deleteMany({ where: { email: SEED_EMAIL } })

  const { user } = await auth.api.signUpEmail({
    body: { name: "Jane Doe", email: SEED_EMAIL, password: SEED_PASSWORD },
  })
  const userId = user.id

  // ── This month applications ──────────────────────────────────────────────────

  const thisMonthApps = await Promise.all([
    prisma.application.create({
      data: {
        userId,
        company: "Stripe",
        position: "Senior Frontend Engineer",
        status: "interview",
        appliedDate: THIS_MONTH(2),
        source: "linkedin",
        jobType: "full_time",
        location: "Remote",
        salary: "$180k–$220k",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Vercel",
        position: "Software Engineer, DX",
        status: "applied",
        appliedDate: THIS_MONTH(3),
        source: "company_website",
        jobType: "full_time",
        location: "Remote",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Supabase",
        position: "Developer Advocate",
        status: "applied",
        appliedDate: THIS_MONTH(5),
        source: "ycombinator",
        jobType: "full_time",
        location: "Remote",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "PlanetScale",
        position: "Software Engineer",
        status: "rejected",
        appliedDate: THIS_MONTH(6),
        source: "linkedin",
        jobType: "full_time",
        location: "Remote",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Resend",
        position: "Full Stack Engineer",
        status: "interview",
        appliedDate: THIS_MONTH(8),
        source: "ycombinator",
        jobType: "full_time",
        location: "Remote",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Fly.io",
        position: "Platform Engineer",
        status: "applied",
        appliedDate: THIS_MONTH(10),
        source: "company_website",
        jobType: "full_time",
        location: "Remote",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Turso",
        position: "Frontend Engineer",
        status: "applied",
        appliedDate: THIS_MONTH(12),
        source: "ycombinator",
        jobType: "full_time",
        location: "Remote",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Neon",
        position: "DevRel Engineer",
        status: "offer",
        appliedDate: THIS_MONTH(14),
        source: "referral",
        jobType: "full_time",
        location: "Remote",
        salary: "$160k–$190k",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Liveblocks",
        position: "React Engineer",
        status: "applied",
        appliedDate: THIS_MONTH(16),
        source: "linkedin",
        jobType: "full_time",
        location: "Remote",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Clerk",
        position: "Senior Engineer",
        status: "interview",
        appliedDate: THIS_MONTH(18),
        source: "company_website",
        jobType: "full_time",
        location: "Remote",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Upstash",
        position: "Backend Engineer",
        status: "applied",
        appliedDate: THIS_MONTH(20),
        source: "wellfound",
        jobType: "full_time",
        location: "Remote",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Inngest",
        position: "DX Engineer",
        status: "applied",
        appliedDate: THIS_MONTH(21),
        source: "ycombinator",
        jobType: "full_time",
        location: "Remote",
      },
    }),
  ])

  // ── Last month applications ──────────────────────────────────────────────────

  const lastMonthApps = await Promise.all([
    prisma.application.create({
      data: {
        userId,
        company: "Linear",
        position: "Product Engineer",
        status: "offer",
        appliedDate: LAST_MONTH(2),
        source: "referral",
        jobType: "full_time",
        location: "San Francisco, CA",
        salary: "$200k–$240k",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Shopify",
        position: "Frontend Developer",
        status: "rejected",
        appliedDate: LAST_MONTH(4),
        source: "indeed",
        jobType: "full_time",
        location: "Remote",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "GitHub",
        position: "Staff Engineer",
        status: "interview",
        appliedDate: LAST_MONTH(5),
        source: "linkedin",
        jobType: "full_time",
        location: "Remote",
        salary: "$220k–$260k",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Figma",
        position: "Software Engineer",
        status: "rejected",
        appliedDate: LAST_MONTH(7),
        source: "company_website",
        jobType: "full_time",
        location: "San Francisco, CA",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Notion",
        position: "Product Engineer",
        status: "interview",
        appliedDate: LAST_MONTH(9),
        source: "wellfound",
        jobType: "full_time",
        location: "Remote",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Raycast",
        position: "React Native Engineer",
        status: "offer",
        appliedDate: LAST_MONTH(11),
        source: "ycombinator",
        jobType: "full_time",
        location: "Remote",
        salary: "$170k–$200k",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Arc",
        position: "Frontend Engineer",
        status: "rejected",
        appliedDate: LAST_MONTH(13),
        source: "linkedin",
        jobType: "full_time",
        location: "New York, NY",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Cron",
        position: "Full Stack Engineer",
        status: "applied",
        appliedDate: LAST_MONTH(16),
        source: "company_website",
        jobType: "full_time",
        location: "Remote",
      },
    }),
  ])

  // ── Two months ago ───────────────────────────────────────────────────────────

  await Promise.all([
    prisma.application.create({
      data: {
        userId,
        company: "Tailwind Labs",
        position: "Engineer",
        status: "rejected",
        appliedDate: TWO_MONTHS_AGO(5),
        source: "company_website",
        jobType: "full_time",
        location: "Remote",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Planetscale",
        position: "DevRel",
        status: "rejected",
        appliedDate: TWO_MONTHS_AGO(10),
        source: "linkedin",
        jobType: "full_time",
        location: "Remote",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Hasura",
        position: "Frontend Engineer",
        status: "interview",
        appliedDate: TWO_MONTHS_AGO(15),
        source: "wellfound",
        jobType: "full_time",
        location: "Remote",
      },
    }),
    prisma.application.create({
      data: {
        userId,
        company: "Railway",
        position: "Product Engineer",
        status: "offer",
        appliedDate: TWO_MONTHS_AGO(20),
        source: "ycombinator",
        jobType: "full_time",
        location: "Remote",
        salary: "$150k–$180k",
      },
    }),
  ])

  // ── Status history ───────────────────────────────────────────────────────────
  // Record transitions for apps that are no longer "applied"

  const statusHistoryEntries = [
    // This month transitions
    {
      applicationId: thisMonthApps[0].id,
      fromStatus: "applied" as const,
      toStatus: "interview" as const,
      changedAt: THIS_MONTH(7),
    },
    {
      applicationId: thisMonthApps[3].id,
      fromStatus: "applied" as const,
      toStatus: "rejected" as const,
      changedAt: THIS_MONTH(13),
    },
    {
      applicationId: thisMonthApps[4].id,
      fromStatus: "applied" as const,
      toStatus: "interview" as const,
      changedAt: THIS_MONTH(15),
    },
    {
      applicationId: thisMonthApps[7].id,
      fromStatus: "applied" as const,
      toStatus: "interview" as const,
      changedAt: THIS_MONTH(17),
    },
    {
      applicationId: thisMonthApps[7].id,
      fromStatus: "interview" as const,
      toStatus: "offer" as const,
      changedAt: THIS_MONTH(21),
    },
    {
      applicationId: thisMonthApps[9].id,
      fromStatus: "applied" as const,
      toStatus: "interview" as const,
      changedAt: THIS_MONTH(22),
    },
    // Last month transitions
    {
      applicationId: lastMonthApps[0].id,
      fromStatus: "applied" as const,
      toStatus: "interview" as const,
      changedAt: LAST_MONTH(8),
    },
    {
      applicationId: lastMonthApps[0].id,
      fromStatus: "interview" as const,
      toStatus: "offer" as const,
      changedAt: LAST_MONTH(20),
    },
    {
      applicationId: lastMonthApps[1].id,
      fromStatus: "applied" as const,
      toStatus: "rejected" as const,
      changedAt: LAST_MONTH(12),
    },
    {
      applicationId: lastMonthApps[2].id,
      fromStatus: "applied" as const,
      toStatus: "interview" as const,
      changedAt: LAST_MONTH(14),
    },
    {
      applicationId: lastMonthApps[3].id,
      fromStatus: "applied" as const,
      toStatus: "rejected" as const,
      changedAt: LAST_MONTH(15),
    },
    {
      applicationId: lastMonthApps[4].id,
      fromStatus: "applied" as const,
      toStatus: "interview" as const,
      changedAt: LAST_MONTH(17),
    },
    {
      applicationId: lastMonthApps[5].id,
      fromStatus: "applied" as const,
      toStatus: "interview" as const,
      changedAt: LAST_MONTH(18),
    },
    {
      applicationId: lastMonthApps[5].id,
      fromStatus: "interview" as const,
      toStatus: "offer" as const,
      changedAt: LAST_MONTH(25),
    },
    {
      applicationId: lastMonthApps[6].id,
      fromStatus: "applied" as const,
      toStatus: "rejected" as const,
      changedAt: LAST_MONTH(20),
    },
  ]

  await prisma.statusHistory.createMany({ data: statusHistoryEntries })

  // ── Interviews ───────────────────────────────────────────────────────────────

  await prisma.interview.createMany({
    data: [
      // This month
      {
        applicationId: thisMonthApps[0].id,
        date: new Date("2026-03-10T10:00:00Z"),
        type: "phone",
        round: "recruiter_screen",
      },
      {
        applicationId: thisMonthApps[4].id,
        date: new Date("2026-03-17T14:00:00Z"),
        type: "video_call",
        round: "technical",
      },
      {
        applicationId: thisMonthApps[7].id,
        date: new Date("2026-03-18T11:00:00Z"),
        type: "video_call",
        round: "recruiter_screen",
      },
      {
        applicationId: thisMonthApps[7].id,
        date: new Date("2026-03-21T15:00:00Z"),
        type: "video_call",
        round: "final",
      },
      {
        applicationId: thisMonthApps[9].id,
        date: new Date("2026-03-22T13:00:00Z"),
        type: "phone",
        round: "recruiter_screen",
      },
      // Last month
      {
        applicationId: lastMonthApps[0].id,
        date: new Date("2026-02-09T10:00:00Z"),
        type: "video_call",
        round: "recruiter_screen",
      },
      {
        applicationId: lastMonthApps[0].id,
        date: new Date("2026-02-15T14:00:00Z"),
        type: "take_home",
        round: "technical",
      },
      {
        applicationId: lastMonthApps[2].id,
        date: new Date("2026-02-14T11:00:00Z"),
        type: "phone",
        round: "recruiter_screen",
      },
      {
        applicationId: lastMonthApps[4].id,
        date: new Date("2026-02-17T15:00:00Z"),
        type: "video_call",
        round: "technical",
      },
      {
        applicationId: lastMonthApps[5].id,
        date: new Date("2026-02-19T13:00:00Z"),
        type: "video_call",
        round: "recruiter_screen",
      },
      {
        applicationId: lastMonthApps[5].id,
        date: new Date("2026-02-24T10:00:00Z"),
        type: "video_call",
        round: "final",
      },
    ],
  })

  console.log(
    `Seeded: ${SEED_EMAIL} / ${SEED_PASSWORD} — 24 applications, 11 interviews, ${statusHistoryEntries.length} status history entries`
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
