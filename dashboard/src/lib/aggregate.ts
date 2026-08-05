import type { FormDef, FormResponse } from '../types'

export interface EnrichedLead {
  responseId: string
  formId: string
  formTitle: string
  submittedAt: string
  name: string
  email: string
  country: string
  nationality: string
  profession: string
  experience: string
}

export function enrichLeads(forms: FormDef[], responses: FormResponse[]): EnrichedLead[] {
  const formsById = new Map(forms.map((f) => [f.id, f]))
  const leads: EnrichedLead[] = []

  for (const r of responses) {
    const form = formsById.get(r.formId)
    if (!form) continue
    const byMapping = (mapping: string) => {
      const field = form.fields.find((f) => f.mapsTo === mapping)
      if (!field) return ''
      return r.answers[field.id] ?? ''
    }
    leads.push({
      responseId: r.id,
      formId: form.id,
      formTitle: form.title,
      submittedAt: r.submittedAt,
      name: byMapping('name'),
      email: byMapping('email'),
      country: byMapping('country'),
      nationality: byMapping('nationality'),
      profession: byMapping('profession'),
      experience: byMapping('experience'),
    })
  }
  return leads
}

export function countBy(leads: EnrichedLead[], key: keyof EnrichedLead) {
  const counts = new Map<string, number>()
  for (const lead of leads) {
    const value = (lead[key] || 'Sin dato') as string
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

export function distinctValues(leads: EnrichedLead[], key: keyof EnrichedLead) {
  const set = new Set<string>()
  for (const lead of leads) {
    const v = lead[key] as string
    if (v) set.add(v)
  }
  return Array.from(set).sort()
}
