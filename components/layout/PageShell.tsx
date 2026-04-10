export function PageShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="p-8 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="mb-1 text-xl font-semibold text-foreground">{title}</h1>
        {action}
      </div>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      {children && <div className="mt-6 touch-pan-y">{children}</div>}
    </div>
  )
}
