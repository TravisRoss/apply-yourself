"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { useContact, useUpdateContact } from "@/hooks/useContacts"
import { useSession } from "@/lib/auth-client"
import { ContactFormData } from "@/lib/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "../ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet"
import ContactForm from "./ContactForm"

type EditContactSheetProps = {
  contactId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditContactSheet({
  contactId,
  open,
  onOpenChange,
}: EditContactSheetProps) {
  const { data: sessionData } = useSession()
  const userId = sessionData?.user.id
  const { data: contact } = useContact(contactId)
  const updateContactMutation = useUpdateContact(userId!)
  const isMobile = useIsMobile()
  const [isFormDirty, setIsFormDirty] = useState(false)
  const t = useTranslations("contacts")
  const tCommon = useTranslations("common")

  async function handleSubmit(formData: ContactFormData) {
    await updateContactMutation.mutateAsync({ contactId, formData })
    onOpenChange(false)
  }

  const defaultValues = contact
    ? {
        name: contact.name,
        role: contact.role,
        company: contact.company,
        email: contact.email ?? "",
        linkedinUrl: contact.linkedinUrl ?? "",
        notes: contact.notes ?? "",
      }
    : undefined

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={isMobile ? "max-h-[85dvh]" : undefined}
      >
        <SheetHeader>
          <SheetTitle>{t("edit.title")}</SheetTitle>
        </SheetHeader>
        {defaultValues !== undefined && (
          <ContactForm
            onHandleSubmit={handleSubmit}
            defaultValues={defaultValues}
            onDirtyChange={setIsFormDirty}
          />
        )}
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tCommon("cancel")}
          </Button>
          <Button
            variant="default"
            type="submit"
            form="contact-form"
            disabled={!isFormDirty}
          >
            {tCommon("save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
