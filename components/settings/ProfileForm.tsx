"use client"

import { useSession } from "@/lib/auth-client"
import { profileSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"

export default function ProfileForm() {
  const { data: session } = useSession()
  const user = session?.user

  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  })

  return (
    <form>
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
      </FieldGroup>
    </form>
  )
}
