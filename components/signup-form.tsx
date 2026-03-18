"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { SignUpFormData, signUpSchema } from "@/lib/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUp } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { signInWithProvider } from "@/lib/sign-in"
import { Eye, EyeOff } from "lucide-react"
import { Spinner } from "./ui/spinner"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  async function onSubmit(formData: SignUpFormData) {
    await signUp.email(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          router.push("/")
        },
        onError: (ctx) => {
          if (ctx.error.status === 422) {
            setError("email", {
              message: "An account with this email already exists.",
            })
          } else {
            setError("root", {
              message:
                ctx.error.message ?? "Something went wrong. Please try again.",
            })
          }
        },
      }
    )
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                aria-invalid={!!errors.email}
                {...register("email")}
              />

              <FieldError errors={[errors.email]} />
            </Field>
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError errors={[errors.password]} />
            </Field>
            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError errors={[errors.confirmPassword]} />
            </Field>
            <FieldGroup>
              <Field>
                {errors.root && <FieldError>{errors.root.message}</FieldError>}
                <Button type="submit">
                  {isSubmitting ? <Spinner /> : "Create Account"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => signInWithProvider("google")}
                >
                  Sign in with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/sign-in">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
