import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { FormDef, FormResponse } from '../types'
import { loadForms, loadResponses, saveForms } from '../lib/store'

export default function FormsListPage() {
  const [forms, setForms] = useState<FormDef[]>([])
  const [responses, setResponses] = useState<FormResponse[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    setForms(loadForms())
    setResponses(loadResponses())
  }, [])

  function countFor(formId: string) {
    return responses.filter((r) => r.formId === formId).length
  }

  function togglePublish(form: FormDef) {
    const updated = forms.map((f) =>
      f.id === form.id ? { ...f, status: f.status === 'published' ? ('draft' as const) : ('published' as const), updatedAt: new Date().toISOString() } : f,
    )
    setForms(updated)
    saveForms(updated)
  }

  function duplicate(form: FormDef) {
    const copy: FormDef = {
      ...form,
      id: crypto.randomUUID(),
      title: `${form.title} (copia)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [copy, ...forms]
    setForms(updated)
    saveForms(updated)
  }

  function remove(form: FormDef) {
    if (!confirm(`¿Eliminar el formulario "${form.title}"? Esta acción no se puede deshacer.`)) return
    const updated = forms.filter((f) => f.id !== form.id)
    setForms(updated)
    saveForms(updated)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px]" style={{ fontWeight: 560, letterSpacing: '-0.022em' }}>
            Formularios
          </h1>
          <p className="text-body mt-1">Crea, edita y revisa los formularios que captan leads.</p>
        </div>
        <button
          onClick={() => navigate('/formularios/nuevo')}
          className="bg-cta hover:bg-cta-hover text-white text-sm px-5 py-2.5 rounded-full transition-colors"
          style={{ fontWeight: 580 }}
        >
          + Nuevo formulario
        </button>
      </div>

      {forms.length === 0 ? (
        <div className="border border-border rounded-card bg-white/40 p-12 text-center text-body">
          Aún no has creado ningún formulario.
        </div>
      ) : (
        <div className="border border-border rounded-card overflow-hidden bg-white/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-eyebrow uppercase text-[11px] tracking-wide">
                <th className="px-5 py-3 font-normal">Formulario</th>
                <th className="px-5 py-3 font-normal">Estado</th>
                <th className="px-5 py-3 font-normal text-right">Respuestas</th>
                <th className="px-5 py-3 font-normal">Actualizado</th>
                <th className="px-5 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => (
                <tr key={form.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-4">
                    <div style={{ fontWeight: 580 }}>{form.title}</div>
                    <div className="text-body text-xs mt-0.5 line-clamp-1">{form.description}</div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => togglePublish(form)}
                      className={`text-xs px-2.5 py-1 rounded-full border ${
                        form.status === 'published'
                          ? 'border-ok/40 text-ok bg-ok/10'
                          : 'border-border text-eyebrow bg-transparent'
                      }`}
                    >
                      {form.status === 'published' ? 'Publicado' : 'Borrador'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums">
                    <Link to={`/formularios/${form.id}/respuestas`} className="text-accent hover:underline">
                      {countFor(form.id)}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-body text-xs">
                    {new Date(form.updatedAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3 text-xs">
                      <Link to={`/formularios/${form.id}/editar`} className="text-accent hover:underline">
                        Editar
                      </Link>
                      <button onClick={() => duplicate(form)} className="text-body hover:text-ink">
                        Duplicar
                      </button>
                      <button onClick={() => remove(form)} className="text-bad hover:underline">
                        Eliminar
                      </button>
                    </div>
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
