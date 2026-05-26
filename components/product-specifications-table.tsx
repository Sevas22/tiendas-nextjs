interface ProductSpecificationsTableProps {
  title: string
  specifications: Record<string, string>
  className?: string
}

export function ProductSpecificationsTable({
  title,
  specifications,
  className = "",
}: ProductSpecificationsTableProps) {
  const entries = Object.entries(specifications).filter(
    ([label, value]) => label.trim() && String(value).trim()
  )

  if (!entries.length) return null

  return (
    <div className={className}>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">{title}</h3>
      <div className="overflow-hidden rounded-xl border border-border">
        {entries.map(([label, value], idx) => (
          <div
            key={label}
            className={`flex items-center justify-between gap-4 px-4 py-3 text-sm ${
              idx % 2 === 0 ? "bg-secondary/50" : "bg-card"
            }`}
          >
            <span className="font-medium text-foreground">{label}</span>
            <span className="text-right text-muted-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
