-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('applied', 'interview', 'offer', 'rejected');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('full-time', 'part-time', 'contract', 'freelance', 'internship', 'other');

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('linkedin', 'indeed', 'glassdoor', 'levels.fyi', 'ycombinator', 'wellfound', 'company-website', 'referral', 'recruiter', 'job-fair', 'other');

-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('video-call', 'phone', 'in-person', 'take-home', 'panel', 'other');

-- CreateEnum
CREATE TYPE "InterviewRound" AS ENUM ('hr', 'recruiter-screen', 'technical', 'system-design', 'behavioral', 'manager', 'final', 'other');

-- CreateEnum
CREATE TYPE "ContactRole" AS ENUM ('recruiter', 'hiring-manager', 'interviewer', 'referral', 'other');

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'applied',
    "applied_date" TIMESTAMP(3) NOT NULL,
    "source" "Source" NOT NULL,
    "job_type" "JobType" NOT NULL,
    "location" TEXT,
    "salary" TEXT,
    "url" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviews" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "InterviewType" NOT NULL,
    "round" "InterviewRound" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "ContactRole" NOT NULL,
    "email" TEXT,
    "linkedin_url" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ApplicationToContact" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ApplicationToContact_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ApplicationToContact_B_index" ON "_ApplicationToContact"("B");

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToContact" ADD CONSTRAINT "_ApplicationToContact_A_fkey" FOREIGN KEY ("A") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToContact" ADD CONSTRAINT "_ApplicationToContact_B_fkey" FOREIGN KEY ("B") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
