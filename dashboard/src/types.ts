export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'number'
  | 'select'
  | 'radio'
  | 'date'

export type FieldMapping = 'country' | 'nationality' | 'profession' | 'experience' | 'name' | 'email' | 'none'

export interface FormField {
  id: string
  label: string
  type: FieldType
  required: boolean
  options?: string[]
  mapsTo: FieldMapping
  placeholder?: string
}

export type FormStatus = 'draft' | 'published'

export interface FormDef {
  id: string
  title: string
  description: string
  status: FormStatus
  fields: FormField[]
  createdAt: string
  updatedAt: string
}

export interface FormResponse {
  id: string
  formId: string
  answers: Record<string, string>
  submittedAt: string
}

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: 'Texto corto',
  textarea: 'Texto largo',
  email: 'Correo',
  phone: 'Teléfono',
  number: 'Número',
  select: 'Lista desplegable',
  radio: 'Opción única',
  date: 'Fecha',
}

export const FIELD_MAPPING_LABELS: Record<FieldMapping, string> = {
  country: 'País',
  nationality: 'Nacionalidad',
  profession: 'Profesión',
  experience: 'Años de experiencia',
  name: 'Nombre',
  email: 'Correo de contacto',
  none: 'Sin usar en dashboard',
}
