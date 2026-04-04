import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

type SheetRowProps = {
  icon: LucideIcon
  label: string | null
  muted?: boolean
}

export default function SheetRow({ icon: Icon, label, muted }: SheetRowProps) {
  if (!label) return null

  return (
    <li className="flex min-w-0 items-start gap-2">
      <Icon className="min-w-8 text-muted-foreground" />
      <span className={cn("min-w-0 wrap-break-word", muted && "text-muted-foreground")}>{label}</span>
    </li>
  )
}
