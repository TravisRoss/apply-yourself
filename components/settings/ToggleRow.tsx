import { Switch } from "../ui/switch"

type ToggleRowProps = {
  title: string
  description: string
}

export default function ToggleRow({
  title,
  description,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex flex-col">
        <p className="text-foreground">{title}</p>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Switch />
    </div>
  )
}
