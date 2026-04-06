"use client"

import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog"
import { LogOut } from "lucide-react"
import { signOut } from "@/lib/auth-client"
import { Button } from "../ui/button"
import { useTranslations } from "next-intl"

export default function SignOutDialog() {
  const router = useRouter()
  const t = useTranslations("auth.signOut")

  async function handleSignOut() {
    await signOut()
    router.push("/sign-in")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          {t("trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="text-muted-foreground hover:text-foreground"
            >
              {t("cancel")}
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleSignOut}>
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
