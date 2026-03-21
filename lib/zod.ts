import * as z from "zod"

// ─── Enums ────────────────────────────────────────────────────────────────────

export const applicationStatusSchema = z.enum([
  "applied",
  "interview",
  "offer",
  "rejected",
])

export const jobTypeSchema = z.enum([
  "full_time",
  "part_time",
  "contract",
  "freelance",
  "internship",
  "other",
])

export const sourceSchema = z.enum(
  [
    "linkedin",
    "indeed",
    "glassdoor",
    "levels_fyi",
    "ycombinator",
    "wellfound",
    "company_website",
    "referral",
    "recruiter",
    "job_fair",
    "other",
  ],
  { error: "Source is required" }
)

export const interviewTypeSchema = z.enum([
  "video_call",
  "phone",
  "in_person",
  "take_home",
  "panel",
  "other",
])

export const interviewRoundSchema = z.enum([
  "hr",
  "recruiter_screen",
  "technical",
  "system_design",
  "behavioral",
  "manager",
  "final",
  "other",
])

export const contactRoleSchema = z.enum([
  "recruiter",
  "hiring_manager",
  "interviewer",
  "referral",
  "other",
])

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const applicationSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  status: applicationStatusSchema,
  appliedDate: z.date({ error: "Date is required" }),
  source: sourceSchema,
  jobType: jobTypeSchema,
  location: z.string().optional(),
  salary: z.string().optional(),
  url: z
    .union([z.url({ error: "Must be a valid URL" }), z.literal("")])
    .optional(),
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
})

export const interviewSchema = z.object({
  applicationId: z.uuid(),
  date: z.date(),
  type: interviewTypeSchema,
  round: interviewRoundSchema,
  notes: z.string().optional(),
})

export const contactSchema = z.object({
  company: z.string().min(1, "Company is required"),
  name: z.string().min(1, "Name is required"),
  role: contactRoleSchema,
  email: z
    .union([z.email({ error: "Must be a valid email" }), z.literal("")])
    .optional(),
  linkedinUrl: z
    .union([z.url({ error: "Must be a valid URL" }), z.literal("")])
    .optional(),
  notes: z.string().optional(),
})

export const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email({ error: "Must be a valid email" }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const signInSchema = z.object({
  email: z.email({ error: "Must be a valid email" }),
  password: z.string().min(1, "Password is required"),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApplicationFormData = z.infer<typeof applicationSchema>
export type InterviewFormData = z.infer<typeof interviewSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type SignInFormData = z.infer<typeof signInSchema>
