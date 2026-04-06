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
import { SignUpFormData, createSignUpSchema } from "@/lib/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUp } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { signInWithProvider } from "@/lib/sign-in"
import { Eye, EyeOff } from "lucide-react"
import { useTranslations } from "next-intl"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const t = useTranslations("auth.signup")
  const tValidation = useTranslations("validation")

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(createSignUpSchema(tValidation)),
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
        onError: (context) => {
          if (context.error.status === 422) {
            setError("email", { message: t("emailExists") })
          } else {
            setError("root", {
              message: context.error.message ?? t("error"),
            })
          }
        },
      }
    )
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder={t("namePlaceholder")}
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                required
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
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
                    aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError errors={[errors.password]} />
            </Field>
            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirm-password">{t("confirmPassword")}</FieldLabel>
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
                    aria-label={showConfirmPassword ? t("hideConfirmPassword") : t("showConfirmPassword")}
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t("creating") : t("submit")}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={async () => {
                    setIsGoogleLoading(true)
                    await signInWithProvider("google")
                    setIsGoogleLoading(false)
                  }}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? t("googleLoading") : t("google")}
                </Button>
                <FieldDescription className="px-6 text-center">
                  {t("hasAccount")} <Link href="/sign-in">{t("signIn")}</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
