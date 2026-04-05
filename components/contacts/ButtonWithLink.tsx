import Link from "next/link"
import { type ComponentType } from "react"
import { Button } from "../ui/button"

type ButtonWithLinkProps = {
  href: string
  icon: ComponentType
  label: string
}

export default function ButtonWithLink({
  href,
  icon: Icon,
  label,
}: ButtonWithLinkProps) {
  return (
    <Button
      asChild
      variant="link"
      className="p-0 text-muted-foreground hover:text-foreground hover:no-underline"
    >
      <Link href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
        <Icon />
        {label}
      </Link>
    </Button>
  )
}
