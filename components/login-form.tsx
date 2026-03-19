"use client"

import { cn } from "@/lib/utils"
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
import Link from "next/link"
import { signInWithProvider } from "@/lib/sign-in"
import { useForm } from "react-hook-form"
import { SignInFormData, signInSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({ resolver: zodResolver(signInSchema) })

  async function onSubmit(formData: SignInFormData) {
    await signIn.email(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          router.push("/")
        },
        onError: (context) => {
          setError("root", {
            message:
              context.error.message ??
              "Something went wrong. Please try again.",
          })
        },
      }
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
                <FieldError errors={[errors.email]} />
              </Field>
              <Field data-invalid={!!errors.password}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                  aria-invalid={!!errors.password}
                />
                <FieldError errors={[errors.password]} />
              </Field>
              <Field>
                {errors.root && <FieldError errors={[errors.root]} />}
                <Button type="submit">
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => signInWithProvider("google")}
                  aria-label="login-submit"
                >
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link href="#">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
