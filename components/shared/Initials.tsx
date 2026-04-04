import { cn } from "@/lib/utils"

type InitialsProps = {
  title: string
  className?: string
}

export default function Initials({ title, className }: InitialsProps) {
  return (
    <div
      className={cn(
        "flex min-h-8 min-w-8 items-center justify-center rounded-md bg-accent",
        className
      )}
    >
      <span>{title.slice(0, 2).toUpperCase()}</span>
    </div>
  )
}
