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
} from "./ui/dialog"
import { LogOut } from "lucide-react"
import { signOut } from "@/lib/auth-client"
import { Button } from "./ui/button"

export default function SignOutDialog() {
  const router = useRouter()

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
          Sign out
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign out?</DialogTitle>
          <DialogDescription>
            You will be returned to the sign in page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleSignOut}>
            Sign out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
