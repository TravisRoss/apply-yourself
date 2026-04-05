import { useCreateContact } from "@/hooks/useContacts"
import { ContactFormData } from "@/lib/zod"
import { PlusIcon } from "lucide-react"
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

  function handleSubmit(formData: ContactFormData) {
    addContactMutation.mutateAsync({ formData, userId })
    setSheetOpen(false)
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button onClick={() => setSheetOpen(true)}>
          <PlusIcon /> Add Contact
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Contact</SheetTitle>
        </SheetHeader>
        <ContactForm onHandleSubmit={handleSubmit} />
        <SheetFooter>
          <Button variant="outline" onClick={() => setSheetOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" type="submit" form="contact-form">
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
