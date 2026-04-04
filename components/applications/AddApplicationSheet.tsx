"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { Button } from "../ui/button"
import { PlusIcon } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

import { useState } from "react"
import AddApplicationForm from "./AddApplicationForm"
import { useCreateApplication } from "@/hooks/useApplications"
import { ApplicationFormData } from "@/lib/zod"

export default function AddApplicationSheet({ userId }: { userId: string }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const createApplicationMutation = useCreateApplication(userId)

  function handleSubmit(formData: ApplicationFormData) {
    createApplicationMutation.mutateAsync(formData)
    setSheetOpen(false)
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="default" onClick={() => setSheetOpen(true)}>
          <PlusIcon /> Add application
        </Button>
      </SheetTrigger>
      <SheetContent
        side={useIsMobile() ? "bottom" : "right"}
        className={useIsMobile() ? "max-h-[85dvh]" : undefined}
      >
        <SheetHeader className="px-4">
          <SheetTitle className="text-lg">Add application</SheetTitle>
          <SheetDescription>Add a new application.</SheetDescription>
        </SheetHeader>
        <AddApplicationForm onHandleSubmit={handleSubmit} />
        <SheetFooter>
          <Button variant="outline" onClick={() => setSheetOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" type="submit" form="add-application-form">
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
