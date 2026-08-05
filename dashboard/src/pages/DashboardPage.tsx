import { useEffect, useMemo, useState } from 'react'
import type { FormDef, FormResponse } from '../types'
import { loadForms, loadResponses } from '../lib/store'
import { countBy, distinctValues, enrichLeads, type EnrichedLead } from '../lib/aggregate'
import BarBreakdown from '../components/BarBreakdown'

type FilterKey = 'country' | 'nationality' | 'profession' | 'experience'

const FILTER_LABELS: Record<FilterKey, string> = {
  country: 'País',
  nationality: 'Nacionalidad',
  profession: 'Profesión',
  experience: 'Años de experiencia',
}

export default function DashboardPage() {
  const [forms, setForms] = useState<FormDef[]>([])
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    country: '',
    nationality: '',
    profession: '',
    experience: '',
  })

  useEffect(() => {
    setForms(loadForms())
    setResponses(loadResponses())
  }, [])

  const allLeads = useMemo(() => enrichLeads(forms, responses), [forms, responses])

  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) =>
      (Object.keys(filters) as FilterKey[]).every((key) => !filters[key] || lead[key] === filters[key]),
    )
  }, [allLeads, filters])

  function setFilter(key: FilterKey, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function clearFilters() {
    setFilters({ country: '', nationality: '', profession: '', experience: '' })
  }

  const activeCount = Object.values(filters).filter(Boolean).length
  const countriesRepresented = distinctValues(filteredLeads, 'country').length
  const professionsRepresented = distinctValues(filteredLeads, 'profession').length

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-[28px]" style={{ fontWeight: 560, letterSpacing: '-0.022em' }}>
          Dashboard de leads
        </h1>
        <p className="text-body mt-1">Resultados combinados de todos los formularios, con filtros por perfil.</p>
      </div>

      {/* Filters */}
      <div className="border border-border rounded-card bg-white/50 p-4 mb-6">
        <div className="flex flex-wrap items-end gap-3">
          {(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => (
            <div key={key} className="flex-1 min-w-[160px]">
              <label className="block text-[11px] text-eyebrow uppercase tracking-wide mb-1">{FILTER_LABELS[key]}</label>
              <select
                value={filters[key]}
                onChange={(e) => setFilter(key, e.target.value)}
                className="w-full border border-border rounded-md px-2.5 py-2 bg-white text-sm outline-none focus:border-accent"
              >
                <option value="">Todos</option>
                {distinctValues(allLeads, key).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button
            onClick={clearFilters}
            disabled={activeCount === 0}
            className="text-sm px-4 py-2 rounded-full border border-border text-body hover:bg-plate disabled:opacity-40 h-[38px]"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <KpiTile label="Leads (según filtro)" value={filteredLeads.length} />
        <KpiTile label="Países representados" value={countriesRepresented} />
        <KpiTile label="Profesiones representadas" value={professionsRepresented} />
      </div>

      {/* Breakdown charts */}
      <div className="grid grid-cols-2 gap-4">
        <BarBreakdown title="Por país" data={countBy(filteredLeads, 'country')} />
        <BarBreakdown title="Por nacionalidad" data={countBy(filteredLeads, 'nationality')} />
        <BarBreakdown title="Por profesión" data={countBy(filteredLeads, 'profession')} />
        <BarBreakdown title="Por años de experiencia" data={countBy(filteredLeads, 'experience')} />
      </div>

      {/* Table */}
      <div className="mt-8">
        <h2 className="text-sm text-eyebrow uppercase tracking-wide mb-3">Leads ({filteredLeads.length})</h2>
        <div className="border border-border rounded-card overflow-x-auto bg-white/50">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-border text-left text-eyebrow uppercase text-[11px] tracking-wide">
                <th className="px-4 py-3 font-normal">Nombre</th>
                <th className="px-4 py-3 font-normal">País</th>
                <th className="px-4 py-3 font-normal">Nacionalidad</th>
                <th className="px-4 py-3 font-normal">Profesión</th>
                <th className="px-4 py-3 font-normal">Experiencia</th>
                <th className="px-4 py-3 font-normal">Formulario</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.slice(0, 50).map((lead: EnrichedLead) => (
                <tr key={lead.responseId} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap">{lead.name || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{lead.country || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{lead.nationality || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{lead.profession || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{lead.experience || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-body text-xs">{lead.formTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function KpiTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border rounded-card bg-white/50 p-5">
      <div className="text-[11px] text-eyebrow uppercase tracking-wide mb-2">{label}</div>
      <div className="text-[28px] tabular-nums" style={{ fontWeight: 560 }}>
        {value}
      </div>
    </div>
  )
}
