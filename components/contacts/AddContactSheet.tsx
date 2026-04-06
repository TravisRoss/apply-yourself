"use client"

import { useCreateContact } from "@/hooks/useContacts"
import { ContactFormData } from "@/lib/zod"
import { PlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "../ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import ContactForm from "./ContactForm"

type AddContactSheetProps = {
  userId: string
}

export default function AddContactSheet({ userId }: AddContactSheetProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const addContactMutation = useCreateContact(userId)
  const t = useTranslations("contacts")
  const tCommon = useTranslations("common")

  function handleSubmit(formData: ContactFormData) {
    addContactMutation.mutateAsync({ formData, userId })
    setSheetOpen(false)
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button onClick={() => setSheetOpen(true)}>
          <PlusIcon /> {t("add.trigger")}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("add.title")}</SheetTitle>
        </SheetHeader>
        <ContactForm onHandleSubmit={handleSubmit} />
        <SheetFooter>
          <Button variant="outline" onClick={() => setSheetOpen(false)}>
            {tCommon("cancel")}
          </Button>
          <Button variant="default" type="submit" form="contact-form">
            {tCommon("save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
