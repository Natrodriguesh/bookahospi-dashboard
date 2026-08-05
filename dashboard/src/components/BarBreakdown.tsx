import { useState } from 'react'

export default function BarBreakdown({
  title,
  data,
}: {
  title: string
  data: { label: string; value: number }[]
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  const max = Math.max(1, ...data.map((d) => d.value))
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="border border-border rounded-card bg-white/50 p-5">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm text-eyebrow uppercase tracking-wide">{title}</h3>
        <span className="text-xs text-body tabular-nums">{total} leads</span>
      </div>
      {data.length === 0 ? (
        <p className="text-body text-sm py-6 text-center">Sin datos para este filtro.</p>
      ) : (
        <div className="space-y-2.5">
          {data.slice(0, 8).map((d) => {
            const pct = (d.value / max) * 100
            const isHover = hovered === d.label
            return (
              <div
                key={d.label}
                className="group"
                onMouseEnter={() => setHovered(d.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={isHover ? 'text-ink' : 'text-body'} style={isHover ? { fontWeight: 580 } : {}}>
                    {d.label}
                  </span>
                  <span className="tabular-nums text-ink" style={{ fontWeight: 580 }}>
                    {d.value}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-plate overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: isHover ? 'var(--color-cta)' : 'var(--color-accent)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
