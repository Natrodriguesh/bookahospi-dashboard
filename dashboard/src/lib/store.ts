import { v4 as uuid } from 'uuid'
import type { FormDef, FormResponse } from '../types'

const FORMS_KEY = 'booka_forms_v1'
const RESPONSES_KEY = 'booka_responses_v1'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

function seedForms(): FormDef[] {
  const now = new Date().toISOString()
  return [
    {
      id: uuid(),
      title: 'Registro de candidatos — Homologación',
      description: 'Formulario base para captar profesionales interesados en homologar su título en el extranjero.',
      status: 'published',
      createdAt: now,
      updatedAt: now,
      fields: [
        { id: uuid(), label: 'Nombre completo', type: 'text', required: true, mapsTo: 'name' },
        { id: uuid(), label: 'Correo electrónico', type: 'email', required: true, mapsTo: 'email' },
        { id: uuid(), label: 'País de residencia', type: 'select', required: true, mapsTo: 'country', options: ['Colombia', 'México', 'Perú', 'Venezuela', 'Argentina', 'Ecuador', 'España'] },
        { id: uuid(), label: 'Nacionalidad', type: 'select', required: true, mapsTo: 'nationality', options: ['Colombiana', 'Mexicana', 'Peruana', 'Venezolana', 'Argentina', 'Ecuatoriana', 'Española'] },
        { id: uuid(), label: 'Profesión', type: 'select', required: true, mapsTo: 'profession', options: ['Abogado/a', 'Médico/a', 'Enfermero/a', 'Ingeniero/a', 'Odontólogo/a', 'Psicólogo/a'] },
        { id: uuid(), label: 'Años de experiencia', type: 'select', required: true, mapsTo: 'experience', options: ['Menos de 2', '2 a 5', '5 a 10', 'Más de 10'] },
      ],
    },
  ]
}

function seedResponses(forms: FormDef[]): FormResponse[] {
  const form = forms[0]
  if (!form) return []
  const f = Object.fromEntries(form.fields.map((fld) => [fld.mapsTo, fld.id]))
  const rows: Array<[string, string, string, string, string, string]> = [
    ['María Gómez', 'maria.gomez@mail.com', 'Colombia', 'Colombiana', 'Abogado/a', '2 a 5'],
    ['Carlos Pérez', 'carlos.perez@mail.com', 'México', 'Mexicana', 'Médico/a', '5 a 10'],
    ['Ana Torres', 'ana.torres@mail.com', 'Perú', 'Peruana', 'Enfermero/a', 'Menos de 2'],
    ['Luis Fernández', 'luis.fernandez@mail.com', 'Venezuela', 'Venezolana', 'Ingeniero/a', 'Más de 10'],
    ['Sofía Ramírez', 'sofia.ramirez@mail.com', 'Colombia', 'Colombiana', 'Odontólogo/a', '2 a 5'],
    ['Diego Morales', 'diego.morales@mail.com', 'Argentina', 'Argentina', 'Abogado/a', 'Menos de 2'],
    ['Valentina Ríos', 'valentina.rios@mail.com', 'Ecuador', 'Ecuatoriana', 'Psicólogo/a', '5 a 10'],
    ['Jorge Salazar', 'jorge.salazar@mail.com', 'España', 'Española', 'Médico/a', 'Más de 10'],
    ['Camila Ortiz', 'camila.ortiz@mail.com', 'Colombia', 'Colombiana', 'Abogado/a', '2 a 5'],
    ['Andrés Vargas', 'andres.vargas@mail.com', 'México', 'Mexicana', 'Ingeniero/a', 'Menos de 2'],
    ['Isabella Cruz', 'isabella.cruz@mail.com', 'Perú', 'Peruana', 'Abogado/a', '5 a 10'],
    ['Sebastián Rojas', 'sebastian.rojas@mail.com', 'Venezuela', 'Venezolana', 'Odontólogo/a', 'Más de 10'],
  ]
  return rows.map(([name, email, country, nat, prof, exp], i) => ({
    id: uuid(),
    formId: form.id,
    submittedAt: new Date(Date.now() - i * 86400000).toISOString(),
    answers: {
      [f.name]: name,
      [f.email]: email,
      [f.country]: country,
      [f.nationality]: nat,
      [f.profession]: prof,
      [f.experience]: exp,
    },
  }))
}

export function loadForms(): FormDef[] {
  const existing = read<FormDef[] | null>(FORMS_KEY, null)
  if (existing) return existing
  const seeded = seedForms()
  write(FORMS_KEY, seeded)
  return seeded
}

export function saveForms(forms: FormDef[]) {
  write(FORMS_KEY, forms)
}

export function loadResponses(): FormResponse[] {
  const existing = read<FormResponse[] | null>(RESPONSES_KEY, null)
  if (existing) return existing
  const seeded = seedResponses(loadForms())
  write(RESPONSES_KEY, seeded)
  return seeded
}

export function saveResponses(responses: FormResponse[]) {
  write(RESPONSES_KEY, responses)
}

export function newId() {
  return uuid()
}
