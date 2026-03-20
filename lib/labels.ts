import {
  ApplicationStatus,
  JobType,
  Source,
} from "@/generated/prisma/enums"

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  [ApplicationStatus.applied]: "Applied",
  [ApplicationStatus.interview]: "Interview",
  [ApplicationStatus.offer]: "Offer",
  [ApplicationStatus.rejected]: "Rejected",
}

export const jobTypeLabels: Record<JobType, string> = {
  [JobType.full_time]: "Full-time",
  [JobType.part_time]: "Part-time",
  [JobType.contract]: "Contract",
  [JobType.freelance]: "Freelance",
  [JobType.internship]: "Internship",
  [JobType.other]: "Other",
}

export const sourceLabels: Record<Source, string> = {
  [Source.linkedin]: "LinkedIn",
  [Source.indeed]: "Indeed",
  [Source.glassdoor]: "Glassdoor",
  [Source.levels_fyi]: "Levels.fyi",
  [Source.ycombinator]: "YCombinator",
  [Source.wellfound]: "Wellfound",
  [Source.company_website]: "Company website",
  [Source.referral]: "Referral",
  [Source.recruiter]: "Recruiter",
  [Source.job_fair]: "Job fair",
  [Source.other]: "Other",
}
