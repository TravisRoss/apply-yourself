import { cn } from "@/lib/utils"
import { SearchIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"

type SearchBarProps = {
  input: string
  onInputChange: (input: string) => void
  placeholder?: string
  align?:
    | "inline-start"
    | "inline-end"
    | "block-start"
    | "block-end"
    | null
    | undefined
  className?: string
}

export default function SearchBar({
  input,
  onInputChange,
  placeholder = "Search...",
  align = "inline-start",
  className,
}: SearchBarProps) {
  return (
    <InputGroup className={cn(className, "max-w-md")}>
      <InputGroupAddon align={align}>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        placeholder={placeholder}
        onChange={(e) => onInputChange(e.target.value)}
        value={input}
      />
    </InputGroup>
  )
}
