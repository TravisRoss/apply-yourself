"use client"

import { useSession } from "@/lib/auth-client"
import { setLocale } from "@/lib/data/settings"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Deutsch", value: "de" },
]

export default function LanguageSelect() {
  const locale = useLocale() // This MUST match one of the LANGUAGES values
  const { data: session } = useSession()
  const userId = session?.user.id
  const router = useRouter()

  async function handleLocaleChange(newLocale: string) {
    await setLocale(userId!, newLocale) // server action sets cookie
    router.refresh() // refresh to update locale and re-render with new language
  }

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Language</SelectLabel>
          {LANGUAGES.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
