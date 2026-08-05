# Booka Leads — Dashboard (prototipo)

Prototipo frontend (React + Vite + TypeScript + Tailwind) para la plataforma de
leads y formularios. Los datos se guardan en `localStorage` del navegador —
no hay backend todavía, así que cada dispositivo/navegador tiene sus propios
datos.

## Desarrollo

```bash
npm install
npm run dev
```

## Qué incluye esta fase (Fase 1)

- **Formularios** (`/formularios`): crear, editar, publicar/despublicar,
  duplicar y eliminar formularios. Cada campo se puede marcar como "usado en
  el dashboard" (país, nacionalidad, profesión, años de experiencia, nombre,
  correo) para que alimente los filtros y gráficas.
- **Respuestas** (`/formularios/:id/respuestas`): tabla de respuestas por
  formulario, exportable a CSV.
- **Dashboard** (`/dashboard`): KPIs y desgloses combinando las respuestas de
  todos los formularios, filtrables por país, nacionalidad, profesión y años
  de experiencia.

## Vista previa como archivo único (para compartir sin desplegar)

`npm run build:artifact` genera `dist-artifact/index.html`: el mismo dashboard
compilado en un solo archivo HTML autocontenido (JS y CSS inlineados), útil
para publicarlo como preview sin necesidad de hosting. La app usa `HashRouter`
y `localStorage`, así que funciona igual dentro de un solo archivo estático.

## Qué falta (Fase 2, pendiente de definir con más detalle)

- Redacción de mensajes (correo / WhatsApp) asistida con la API de Claude.
- Botón "Abrir en WhatsApp" con el mensaje pre-cargado (`wa.me`).
- Tablero tipo kanban para mover leads entre etapas del pipeline.
- Sección de facturación (montos cerrados, estado de pago por cliente).

## Notas técnicas

- Sin backend: `src/lib/store.ts` centraliza todo el acceso a datos. El día
  que haya base de datos real, solo hay que reemplazar las funciones de ese
  archivo por llamadas a la API — el resto de la app no debería cambiar.
- Estilo siguiendo el sistema de marca de Booka: fondo cálido, superficies de
  datos planas (sin sombras), un solo color saturado (indigo) para acentos.
