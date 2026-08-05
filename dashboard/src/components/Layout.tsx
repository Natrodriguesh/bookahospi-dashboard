import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/formularios', label: 'Formularios', icon: FormIcon, active: true },
  { to: '/dashboard', label: 'Dashboard', icon: ChartIcon, active: true },
  { to: '/mensajes', label: 'Mensajes con IA', icon: MessageIcon, active: false },
  { to: '/whatsapp', label: 'WhatsApp', icon: WhatsappIcon, active: false },
  { to: '/pipeline', label: 'Pipeline', icon: PipelineIcon, active: false },
  { to: '/facturacion', label: 'Facturación', icon: InvoiceIcon, active: false },
]

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-bg text-ink font-sans">
      <aside className="w-64 shrink-0 border-r border-border bg-bg flex flex-col">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-border">
          <div className="w-7 h-7 rounded-md bg-cta text-white flex items-center justify-center text-sm font-semibold">B</div>
          <span className="font-medium" style={{ fontWeight: 580 }}>Booka Leads</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) =>
            item.active ? (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive ? 'bg-plate text-ink' : 'text-body hover:bg-plate/60'
                  }`
                }
                style={({ isActive }) => (isActive ? { fontWeight: 580 } : {})}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </NavLink>
            ) : (
              <div
                key={item.to}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm text-body/60 cursor-not-allowed"
                title="Próximamente — fase 2"
              >
                <span className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-eyebrow border border-border rounded-full px-1.5 py-0.5">
                  Pronto
                </span>
              </div>
            ),
          )}
        </nav>
        <div className="px-5 py-4 border-t border-border text-xs text-eyebrow">
          Prototipo — datos guardados en este navegador
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}

function FormIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={props.className}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
    </svg>
  )
}
function ChartIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={props.className}>
      <path d="M4 20V10M12 20V4M20 20v-7" strokeLinecap="round" />
    </svg>
  )
}
function MessageIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={props.className}>
      <path d="M4 5h16v11H8l-4 4V5Z" strokeLinejoin="round" />
    </svg>
  )
}
function WhatsappIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={props.className}>
      <path d="M3 21l1.6-4.8A8 8 0 1 1 8.8 19.4L3 21Z" strokeLinejoin="round" />
    </svg>
  )
}
function PipelineIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={props.className}>
      <rect x="3" y="4" width="5" height="16" rx="1" />
      <rect x="10" y="4" width="5" height="10" rx="1" />
      <rect x="17" y="4" width="4" height="7" rx="1" />
    </svg>
  )
}
function InvoiceIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={props.className}>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6" strokeLinecap="round" />
    </svg>
  )
}
