"use client"

import { changeEmail, updateUser, useSession } from "@/lib/auth-client"
import { ProfileFormData, profileSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Skeleton } from "../ui/skeleton"

export default function ProfileForm() {
  const { data: session, isPending } = useSession()
  const user = session?.user

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  })

  useEffect(() => {
    if (user !== undefined) {
      reset({ name: user?.name ?? "", email: user?.email ?? "" })
    }
  }, [user, reset])

  async function handleSaveProfile(formData: ProfileFormData) {
    const nameChanged = formData.name !== user?.name
    const emailChanged = formData.email !== user?.email

    if (nameChanged) {
      const { error } = await updateUser({ name: formData.name })
      if (error !== null) {
        toast.error(error.message ?? "Failed to update name")
        return
      }
    }

    if (emailChanged) {
      const { error } = await changeEmail({ newEmail: formData.email })
      if (error !== null) {
        toast.error(error.message ?? "Failed to update email")
        return
      }
    }

    toast.success("Profile updated")
  }

  if (isPending) {
    return (
      <FieldGroup>
        <Field>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </Field>
        <Field>
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-9 w-full" />
        </Field>
        <Skeleton className="h-9 w-28" />
      </FieldGroup>
    )
  }

  return (
    <form onSubmit={handleSubmit(handleSaveProfile)}>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input id="name" placeholder="Jane Smith" {...register("name")} />
          <FieldError errors={[errors.name]} />
        </Field>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            placeholder="example@example.com"
            {...register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>
        <Button type="submit" className="w-fit">
          Save Profile
        </Button>
      </FieldGroup>
    </form>
  )
}
