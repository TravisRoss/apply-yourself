import { deleteAccount } from "@/lib/data/settings"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useDeleteAccount() {
  const router = useRouter()

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => deleteAccount(userId),
    onSuccess: () => {
      router.push("/sign-in")
    },
    onError: () => {
      toast.error("Failed to delete account. Please try again.")
    },
  })
}
