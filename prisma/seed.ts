import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"
import { auth } from "../lib/auth"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const SEED_EMAIL = "seed@example.com"
const SEED_PASSWORD = "password123"

async function main() {
  // Clean existing seed user (cascades to applications, contacts, interviews)
  await prisma.user.deleteMany({ where: { email: SEED_EMAIL } })

  // Create seed user via auth so the password is hashed correctly
  const { user } = await auth.api.signUpEmail({
    body: { name: "Jane Doe", email: SEED_EMAIL, password: SEED_PASSWORD },
  })
  const userId = user.id

  // Applications
  const stripe = await prisma.application.create({
    data: {
      userId,
      company: "Stripe",
      position: "Senior Frontend Engineer",
      status: "interview",
      appliedDate: new Date("2026-02-10"),
      source: "linkedin",
      jobType: "full_time",
      location: "Remote",
      salary: "$180,000 - $220,000",
      url: "https://stripe.com/jobs",
    },
  })

  const vercel = await prisma.application.create({
    data: {
      userId,
      company: "Vercel",
      position: "Software Engineer, DX",
      status: "applied",
      appliedDate: new Date("2026-03-01"),
      source: "company_website",
      jobType: "full_time",
      location: "Remote",
      url: "https://vercel.com/careers",
    },
  })

  const linear = await prisma.application.create({
    data: {
      userId,
      company: "Linear",
      position: "Product Engineer",
      status: "offer",
      appliedDate: new Date("2026-01-15"),
      source: "referral",
      jobType: "full_time",
      location: "San Francisco, CA",
      salary: "$200,000 - $240,000",
    },
  })

  const shopify = await prisma.application.create({
    data: {
      userId,
      company: "Shopify",
      position: "Frontend Developer",
      status: "rejected",
      appliedDate: new Date("2026-01-20"),
      source: "indeed",
      jobType: "full_time",
      location: "Remote",
    },
  })

  const supabase = await prisma.application.create({
    data: {
      userId,
      company: "Supabase",
      position: "Developer Advocate",
      status: "applied",
      appliedDate: new Date("2026-03-10"),
      source: "ycombinator",
      jobType: "full_time",
      location: "Remote",
    },
  })

  // Interviews
  await prisma.interview.create({
    data: {
      applicationId: stripe.id,
      date: new Date("2026-02-18T10:00:00Z"),
      type: "phone",
      round: "recruiter_screen",
      notes: "Spoke with recruiter Sarah. Positive call, moving to technical.",
    },
  })

  await prisma.interview.create({
    data: {
      applicationId: stripe.id,
      date: new Date("2026-02-25T14:00:00Z"),
      type: "video_call",
      round: "technical",
      notes: "Two Leetcode mediums. Went well overall.",
    },
  })

  await prisma.interview.create({
    data: {
      applicationId: linear.id,
      date: new Date("2026-01-22T11:00:00Z"),
      type: "video_call",
      round: "recruiter_screen",
    },
  })

  await prisma.interview.create({
    data: {
      applicationId: linear.id,
      date: new Date("2026-02-01T15:00:00Z"),
      type: "take_home",
      round: "technical",
      notes: "Built a small kanban board in 4 hours.",
    },
  })

  await prisma.interview.create({
    data: {
      applicationId: linear.id,
      date: new Date("2026-02-10T13:00:00Z"),
      type: "video_call",
      round: "final",
      notes: "Met with CTO and two engineers. Very strong culture fit.",
    },
  })

  // Contacts
  await prisma.contact.create({
    data: {
      userId,
      name: "Sarah Chen",
      company: "Stripe",
      role: "recruiter",
      email: "sarah.chen@stripe.com",
      linkedinUrl: "https://linkedin.com/in/sarahchen",
      notes: "Very responsive. Prefers email over LinkedIn.",
      applications: { connect: { id: stripe.id } },
    },
  })

  await prisma.contact.create({
    data: {
      userId,
      name: "James Wright",
      company: "Linear",
      role: "hiring_manager",
      linkedinUrl: "https://linkedin.com/in/jameswright",
      notes: "Engineering lead. Referred me to the role.",
      applications: { connect: { id: linear.id } },
    },
  })

  await prisma.contact.create({
    data: {
      userId,
      name: "Priya Nair",
      company: "Vercel",
      role: "referral",
      email: "priya@vercel.com",
      applications: { connect: { id: vercel.id } },
    },
  })

  console.log(
    `Seeded: user (${SEED_EMAIL} / ${SEED_PASSWORD}), 5 applications (including ${shopify.company} and ${supabase.company}), 5 interviews, 3 contacts`
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
