"use server"

import prisma from "../prisma"
import { ContactFormData } from "../zod"

export async function getContactsByUserId(userId: string) {
  return await prisma.contact.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
}

export async function getContactById(contactId: string) {
  return await prisma.contact.findUnique({
    where: { id: contactId },
  })
}

export async function createContact(userId: string, formData: ContactFormData) {
  return await prisma.contact.create({
    data: { userId, ...formData },
  })
}

export async function updateContact(
  contactId: string,
  formData: ContactFormData
) {
  return await prisma.contact.update({
    where: { id: contactId },
    data: formData,
  })
}

export async function deleteContact(contactId: string) {
  return await prisma.contact.delete({ where: { id: contactId } })
}
