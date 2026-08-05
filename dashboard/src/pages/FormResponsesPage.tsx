import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { FormDef, FormResponse } from '../types'
import { loadForms, loadResponses, saveResponses } from '../lib/store'

export default function FormResponsesPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormDef | null>(null)
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [allResponses, setAllResponses] = useState<FormResponse[]>([])

  useEffect(() => {
    const forms = loadForms()
    const found = forms.find((f) => f.id === id) ?? null
    setForm(found)
    const all = loadResponses()
    setAllResponses(all)
    setResponses(all.filter((r) => r.formId === id))
  }, [id])

  function removeResponse(responseId: string) {
    if (!confirm('¿Eliminar esta respuesta?')) return
    const updated = allResponses.filter((r) => r.id !== responseId)
    setAllResponses(updated)
    setResponses(updated.filter((r) => r.formId === id))
    saveResponses(updated)
  }

  function exportCsv() {
    if (!form) return
    const headers = form.fields.map((f) => f.label)
    const rows = responses.map((r) => form.fields.map((f) => (r.answers[f.id] ?? '').replaceAll('"', '""')))
    const csv = [headers, ...rows].map((row) => row.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.title.replace(/\s+/g, '_')}_respuestas.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!form) {
    return (
      <div className="p-8">
        <p className="text-body">Formulario no encontrado.</p>
        <button onClick={() => navigate('/formularios')} className="text-accent text-sm mt-2 hover:underline">
          Volver
        </button>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <button onClick={() => navigate('/formularios')} className="text-sm text-body hover:text-ink mb-6">
        ← Volver a formularios
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[24px]" style={{ fontWeight: 560, letterSpacing: '-0.022em' }}>
            {form.title}
          </h1>
          <p className="text-body text-sm mt-1 tabular-nums">{responses.length} respuestas</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/formularios/${form.id}/editar`}
            className="text-sm px-4 py-2 rounded-full border border-border text-body hover:bg-plate"
          >
            Editar formulario
          </Link>
          <button
            onClick={exportCsv}
            disabled={responses.length === 0}
            className="text-sm px-4 py-2 rounded-full bg-cta hover:bg-cta-hover text-white disabled:opacity-40"
            style={{ fontWeight: 580 }}
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="border border-border rounded-card bg-white/40 p-12 text-center text-body">
          Todavía no hay respuestas para este formulario.
        </div>
      ) : (
        <div className="border border-border rounded-card overflow-x-auto bg-white/40">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-border text-left text-eyebrow uppercase text-[11px] tracking-wide">
                {form.fields.map((f) => (
                  <th key={f.id} className="px-4 py-3 font-normal whitespace-nowrap">
                    {f.label}
                  </th>
                ))}
                <th className="px-4 py-3 font-normal whitespace-nowrap">Enviado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {responses
                .slice()
                .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt))
                .map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    {form.fields.map((f) => (
                      <td key={f.id} className="px-4 py-3 whitespace-nowrap">
                        {r.answers[f.id] ?? '—'}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-body text-xs whitespace-nowrap">
                      {new Date(r.submittedAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => removeResponse(r.id)} className="text-bad text-xs hover:underline">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
