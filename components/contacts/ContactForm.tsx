"use client"

import { ContactRole } from "@/generated/prisma/enums"
import { ContactRoleLabels } from "@/lib/labels"
import { ContactFormData, contactSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Textarea } from "../ui/textarea"

type ContactFormProps = {
  onHandleSubmit: (formData: ContactFormData) => void
  defaultValues?: ContactFormData
  onDirtyChange?: (isDirty: boolean) => void
}

export default function ContactForm({
  onHandleSubmit,
  defaultValues,
  onDirtyChange,
}: ContactFormProps) {
  const {
    register,
    control,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  })

  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      <form
        id="contact-form"
        onSubmit={handleSubmit(onHandleSubmit)}
        noValidate
      >
        <FieldGroup>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              placeholder="Jane Smith"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>
          <Field data-invalid={!!errors.company}>
            <FieldLabel htmlFor="company">Company</FieldLabel>
            <Input
              id="company"
              placeholder="Acme Corp"
              aria-invalid={!!errors.company}
              {...register("company")}
            />
            <FieldError errors={[errors.company]} />
          </Field>
          <Field data-invalid={!!errors.role}>
            <FieldLabel>Role</FieldLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.role}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ContactRole).map((role) => (
                      <SelectItem key={role} value={role}>
                        {ContactRoleLabels[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.role]} />
          </Field>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="jane@acme.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>
          <Field data-invalid={!!errors.linkedinUrl}>
            <FieldLabel htmlFor="linkedinUrl">LinkedIn URL</FieldLabel>
            <Input
              id="linkedinUrl"
              type="url"
              placeholder="https://linkedin.com/in/janesmith"
              aria-invalid={!!errors.linkedinUrl}
              {...register("linkedinUrl")}
            />
            <FieldError errors={[errors.linkedinUrl]} />
          </Field>
          <Field data-invalid={!!errors.notes}>
            <FieldLabel htmlFor="notes">Notes</FieldLabel>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              aria-invalid={!!errors.notes}
              {...register("notes")}
            />
            <FieldError errors={[errors.notes]} />
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
