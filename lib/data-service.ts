"use server"

import prisma from "./prisma"
import { ApplicationFormData } from "./zod"

export async function getApplicationsByUserId(userId: string) {
  return await prisma.application.findMany({ where: { userId } })
}

export async function createApplication(
  userId: string,
  formData: ApplicationFormData
) {
  return await prisma.application.create({
    data: {
      userId,
      company: formData.company,
      position: formData.position,
      status: formData.status,
      appliedDate: formData.appliedDate,
      source: formData.source,
      jobType: formData.jobType,
      location: formData.location,
      salary: formData.salary,
      url: formData.url,
      notes: formData.notes,
    },
  })
}
