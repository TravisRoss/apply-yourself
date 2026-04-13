"use client"

import { ContactRole } from "@/generated/prisma/enums"
import { useDeleteContact } from "@/hooks/useContacts"
import { Mail } from "lucide-react"
import { useTranslations } from "next-intl"
import Initials from "../shared/Initials"
import { Badge } from "../ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import ButtonWithLink from "./ButtonWithLink"
import ContactsKebabMenu from "./ContactsKebabMenu"
import LinkedinOutlineIcon from "./LinkedInIcon"

type ContactCardProps = {
  userId: string
  contactId: string
  company: string
  name: string
  role: ContactRole
  email?: string
  linkedInUrl?: string
  notes?: string
}

export default function ContactCard({
  userId,
  contactId,
  company,
  name,
  role,
  email,
  linkedInUrl,
  notes,
}: ContactCardProps) {
  const deleteContactMutation = useDeleteContact(userId)
  const t = useTranslations("contacts")

  async function handleDelete() {
    await deleteContactMutation.mutateAsync(contactId)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <Initials title={name} className="h-10 w-10" />
            <div className="flex flex-col">
              <CardTitle className="text-sm">{name}</CardTitle>
              <CardDescription className="text-xs leading-tight">
                {t(`roles.${role}`)}
              </CardDescription>
            </div>
          </div>
          <ContactsKebabMenu contactId={contactId} onDelete={handleDelete} />
        </div>
      </CardHeader>
      <CardContent>
        <Badge className="rounded-tl-md font-bold">{company}</Badge>
        {(email !== undefined || linkedInUrl !== undefined) && (
          <div className="flex-start flex items-center gap-2">
            {email && (
              <ButtonWithLink
                href={`mailto:${email}`}
                icon={Mail}
                label={t("card.email")}
              />
            )}
            {linkedInUrl && (
              <ButtonWithLink
                href={linkedInUrl}
                icon={LinkedinOutlineIcon}
                label={t("card.linkedin")}
              />
            )}
          </div>
        )}
        {notes && <p className="text-xs text-muted-foreground">{notes}</p>}
      </CardContent>
    </Card>
  )
}
