import {
  ApplicationStatus,
  InterviewRound,
  InterviewType,
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

export const interviewTypeLabels: Record<InterviewType, string> = {
  [InterviewType.video_call]: "Video Call",
  [InterviewType.phone]: "Phone",
  [InterviewType.in_person]: "In Person",
  [InterviewType.take_home]: "Take Home",
  [InterviewType.panel]: "Panel",
  [InterviewType.other]: "Other",
}

export const interviewRoundLabels: Record<InterviewRound, string> = {
  [InterviewRound.hr]: "HR",
  [InterviewRound.recruiter_screen]: "Recruiter Screen",
  [InterviewRound.technical]: "Technical",
  [InterviewRound.system_design]: "System Design",
  [InterviewRound.behavioral]: "Behavioral",
  [InterviewRound.manager]: "Manager",
  [InterviewRound.final]: "Final Round",
  [InterviewRound.other]: "Other",
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
