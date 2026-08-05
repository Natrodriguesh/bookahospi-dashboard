import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { FieldMapping, FieldType, FormDef, FormField } from '../types'
import { FIELD_MAPPING_LABELS, FIELD_TYPE_LABELS } from '../types'
import { loadForms, newId, saveForms } from '../lib/store'

const FIELD_TYPES = Object.keys(FIELD_TYPE_LABELS) as FieldType[]
const MAPPINGS = Object.keys(FIELD_MAPPING_LABELS) as FieldMapping[]

function emptyField(): FormField {
  return { id: newId(), label: '', type: 'text', required: true, mapsTo: 'none' }
}

export default function FormBuilderPage() {
  const { id } = useParams()
  const isNew = id === undefined || id === 'nuevo'
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fields, setFields] = useState<FormField[]>([emptyField()])
  const [allForms, setAllForms] = useState<FormDef[]>([])
  const [existing, setExisting] = useState<FormDef | null>(null)

  useEffect(() => {
    const forms = loadForms()
    setAllForms(forms)
    if (!isNew) {
      const found = forms.find((f) => f.id === id) ?? null
      setExisting(found)
      if (found) {
        setTitle(found.title)
        setDescription(found.description)
        setFields(found.fields.length ? found.fields : [emptyField()])
      }
    }
  }, [id, isNew])

  function updateField(fieldId: string, patch: Partial<FormField>) {
    setFields((prev) => prev.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)))
  }

  function addField() {
    setFields((prev) => [...prev, emptyField()])
  }

  function removeField(fieldId: string) {
    setFields((prev) => prev.filter((f) => f.id !== fieldId))
  }

  function moveField(index: number, dir: -1 | 1) {
    setFields((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function handleSave(status: 'draft' | 'published') {
    if (!title.trim()) {
      alert('Ponle un título al formulario antes de guardar.')
      return
    }
    const cleanFields = fields.filter((f) => f.label.trim())
    const now = new Date().toISOString()
    let updated: FormDef[]
    if (existing) {
      updated = allForms.map((f) =>
        f.id === existing.id ? { ...f, title, description, fields: cleanFields, status, updatedAt: now } : f,
      )
    } else {
      const created: FormDef = {
        id: newId(),
        title,
        description,
        status,
        fields: cleanFields,
        createdAt: now,
        updatedAt: now,
      }
      updated = [created, ...allForms]
    }
    saveForms(updated)
    navigate('/formularios')
  }

  return (
    <div className="p-8 max-w-3xl mx-auto pb-24">
      <button onClick={() => navigate('/formularios')} className="text-sm text-body hover:text-ink mb-6">
        ← Volver a formularios
      </button>

      <h1 className="text-[24px] mb-6" style={{ fontWeight: 560, letterSpacing: '-0.022em' }}>
        {existing ? 'Editar formulario' : 'Nuevo formulario'}
      </h1>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-xs text-eyebrow uppercase tracking-wide mb-1.5">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Registro de candidatos — Homologación"
            className="w-full border border-border rounded-card px-3.5 py-2.5 bg-white/60 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs text-eyebrow uppercase tracking-wide mb-1.5">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Breve contexto sobre para qué sirve este formulario"
            className="w-full border border-border rounded-card px-3.5 py-2.5 bg-white/60 text-sm outline-none focus:border-accent resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm text-eyebrow uppercase tracking-wide">Campos</h2>
        <button onClick={addField} className="text-xs text-accent hover:underline">
          + Añadir campo
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field, i) => (
          <div key={field.id} className="border border-border rounded-card p-4 bg-white/50">
            <div className="flex items-start gap-3">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <input
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    placeholder="Etiqueta del campo, ej. País de residencia"
                    className="w-full border border-border rounded-md px-3 py-2 bg-white text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-eyebrow mb-1">Tipo</label>
                  <select
                    value={field.type}
                    onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                    className="w-full border border-border rounded-md px-2.5 py-1.5 bg-white text-sm outline-none focus:border-accent"
                  >
                    {FIELD_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {FIELD_TYPE_LABELS[t]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-eyebrow mb-1">Usar en dashboard como</label>
                  <select
                    value={field.mapsTo}
                    onChange={(e) => updateField(field.id, { mapsTo: e.target.value as FieldMapping })}
                    className="w-full border border-border rounded-md px-2.5 py-1.5 bg-white text-sm outline-none focus:border-accent"
                  >
                    {MAPPINGS.map((m) => (
                      <option key={m} value={m}>
                        {FIELD_MAPPING_LABELS[m]}
                      </option>
                    ))}
                  </select>
                </div>

                {(field.type === 'select' || field.type === 'radio') && (
                  <div className="col-span-2">
                    <label className="block text-[11px] text-eyebrow mb-1">Opciones (separadas por coma)</label>
                    <input
                      value={(field.options ?? []).join(', ')}
                      onChange={(e) =>
                        updateField(field.id, {
                          options: e.target.value.split(',').map((o) => o.trim()).filter(Boolean),
                        })
                      }
                      placeholder="Colombia, México, Perú, Venezuela"
                      className="w-full border border-border rounded-md px-3 py-2 bg-white text-sm outline-none focus:border-accent"
                    />
                  </div>
                )}

                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    id={`req-${field.id}`}
                  />
                  <label htmlFor={`req-${field.id}`} className="text-xs text-body">
                    Obligatorio
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1 pt-1">
                <button
                  onClick={() => moveField(i, -1)}
                  disabled={i === 0}
                  className="w-7 h-7 rounded-md border border-border text-xs disabled:opacity-30 hover:bg-plate"
                  title="Subir"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveField(i, 1)}
                  disabled={i === fields.length - 1}
                  className="w-7 h-7 rounded-md border border-border text-xs disabled:opacity-30 hover:bg-plate"
                  title="Bajar"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeField(field.id)}
                  className="w-7 h-7 rounded-md border border-border text-xs text-bad hover:bg-bad/10"
                  title="Eliminar campo"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-64 right-0 border-t border-border bg-bg/95 backdrop-blur px-8 py-4 flex items-center justify-end gap-3">
        <button
          onClick={() => handleSave('draft')}
          className="text-sm px-5 py-2.5 rounded-full border border-border text-body hover:bg-plate"
        >
          Guardar borrador
        </button>
        <button
          onClick={() => handleSave('published')}
          className="text-sm px-5 py-2.5 rounded-full bg-cta hover:bg-cta-hover text-white"
          style={{ fontWeight: 580 }}
        >
          Publicar formulario
        </button>
      </div>
    </div>
  )
}
