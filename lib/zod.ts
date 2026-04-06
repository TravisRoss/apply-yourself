import * as z from "zod"

type ValidationT = (key: string) => string

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

export const sourceSchema = z.enum([
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
])

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

// ─── Schema factories ─────────────────────────────────────────────────────────

export function createApplicationSchema(t: ValidationT) {
  return z.object({
    company: z.string().min(1, t("companyRequired")),
    position: z.string().min(1, t("positionRequired")),
    status: applicationStatusSchema,
    appliedDate: z.date({ error: t("dateRequired") }),
    source: z.enum(sourceSchema.options, { error: t("sourceRequired") }),
    jobType: jobTypeSchema,
    location: z.string().optional(),
    salary: z.string().optional(),
    url: z.union([z.url({ error: t("invalidUrl") }), z.literal("")]).optional(),
    notes: z.string().max(500, t("notesMaxLength")).optional(),
  })
}

export function createInterviewFormSchema(t: ValidationT) {
  return z.object({
    applicationId: z.uuid({ error: t("applicationRequired") }),
    date: z.date(),
    type: z.enum(interviewTypeSchema.options, { error: t("typeRequired") }),
    round: z.enum(interviewRoundSchema.options, { error: t("roundRequired") }),
    notes: z.string().optional(),
    time: z.string().regex(/^\d{2}:\d{2}$/, t("timeRequired")),
  })
}

export function createContactSchema(t: ValidationT) {
  return z.object({
    company: z.string().min(1, t("companyRequired")),
    name: z.string().min(1, t("nameRequired")),
    role: contactRoleSchema,
    email: z
      .union([z.email({ error: t("invalidEmail") }), z.literal("")])
      .optional(),
    linkedinUrl: z
      .union([z.url({ error: t("invalidUrl") }), z.literal("")])
      .optional(),
    notes: z.string().optional(),
  })
}

export function createProfileSchema(t: ValidationT) {
  return z.object({
    name: z.string().min(1, t("nameRequired")),
    email: z.email({ error: t("invalidEmail") }),
  })
}

export function createSignUpSchema(t: ValidationT) {
  return z
    .object({
      name: z.string().min(1, t("nameRequired")),
      email: z.email({ error: t("invalidEmail") }),
      password: z.string().min(8, t("passwordMinLength")),
      confirmPassword: z.string().min(8, t("passwordMinLength")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    })
}

export function createSignInSchema(t: ValidationT) {
  return z.object({
    email: z.email({ error: t("invalidEmail") }),
    password: z.string().min(1, t("passwordRequired")),
  })
}

export const notificationPreferencesSchema = z.object({
  interviewReminders: z.boolean(),
  weeklySummary: z.boolean(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApplicationFormData = z.infer<
  ReturnType<typeof createApplicationSchema>
>
export type InterviewFormData = Omit<InterviewFormValues, "time">
export type InterviewFormValues = z.infer<
  ReturnType<typeof createInterviewFormSchema>
>
export type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>
export type ProfileFormData = z.infer<ReturnType<typeof createProfileSchema>>
export type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>>
export type NotificationPreferencesFormData = z.infer<
  typeof notificationPreferencesSchema
>
export type SignInFormData = z.infer<ReturnType<typeof createSignInSchema>>
