---
name: mercury-landing
description: Build or edit sections of the Bookahospi landing page in the Mercury-derived visual system — cream editorial canvas, single indigo action colour, warm-gray ink, tabular figures, and layered product-screenshot showcases with soft wide lift and blurred overlay chrome. Use whenever working in landing/, adding a landing section, styling a stat row or hero, or placing product screenshots into floating cards. Not for the dashboard app, which uses flat surfaces.
---

# Mercury-derived landing system

The full specification is `landing/DESIGN.md`; the machine-readable tokens are
`landing/tokens.css`. Read both before writing markup. `landing/PROVENANCE.md`
records which values are second-hand and therefore still open to correction.

## Non-negotiables

1. **One saturated colour.** Indigo `--accent` is the primary CTA and the link
   underline. Nothing else on the page is saturated. Hierarchy elsewhere is
   warm-gray weight and cream tone shifts.
2. **Cream, not white.** The page is `--bg-primary` (#f6f5f2). White is a card
   surface, never the canvas.
3. **Tabular figures on every number** a reader might compare — every stat,
   percentage, count, duration. `class="tabular"`.
4. **Two depth rules, kept separate.** Marketing showcases layer and blur
   (`--lift-card`, `--lift-float`, `--wash`, `--glass-blur`). Data surfaces —
   tables, dashboard tiles, anything numeric a reader reads *through* the
   styling — stay flat with 1px `--border`. Never blur behind a number.
5. **Full-pill buttons.** `--radius-pill`, no shadow. Indigo primary paired with
   a tonal cream secondary; never two saturated buttons.
6. **1080px measure** on marketing sections, 96px vertical section padding.

## Building a showcase section

The "Get started fast" pattern, in construction order:

1. Section on `--bg-primary`, headline in `--font-display` at
   `--display-weight` with `--display-tracking`, one supporting paragraph in
   `--text-secondary`. Copy stays short — the graphic carries the section.
2. `--wash` as a radial light source behind the graphic group, fading to
   transparent. It should read as light, not as a gradient background.
3. Base plane: a real product screenshot, `--radius-shot`, `--lift-card`.
   Cropping it past the section edge is correct and desirable.
4. One or two smaller genuine UI fragments overlapping the base at its corners,
   `--lift-float`. This overlap is what creates depth without animation.
5. Any chrome sitting *over* a screenshot — badge, toast, filter pill — gets
   `--glass-bg` plus `backdrop-filter: var(--glass-blur)`.
6. Where a screenshot runs off the bottom, `--fade-to-canvas`.

Shadows are soft and wide at very low opacity, tinted with the ink colour
(`rgba(42,41,36,…)`) rather than black. A tight dark shadow reads as generic
SaaS and breaks the whole effect immediately.

## Stat blocks

Order is always eyebrow → figure → the sentence that makes the figure mean
something. Label at 13px uppercase `--text-muted` (`class="eyebrow"`), figure at
`--fs-36`/`--fs-48` tabular in `--text-primary`, explanation at `--fs-16` in
`--text-secondary`. Rows go 4-up → 2-up → 1-up.

## Product screenshots

Real captures only — the effect depends on the UI in the cards being genuine.
Source images live under `landing/assets/`, taken from the admin captures
(Panel-Inicio, Expedientes, Homologaciones, Validador, Reguladores, Trust,
Cerebro, Certificados, Visados, Facturacion, Comunicaciones, Chatbot, Stripe,
Organizaciones). Match the screenshot to the claim the section makes rather
than picking one that merely looks busy.

## Reject

Crypto gradients, neon, saturated hero fills, glass over data, drop shadows on
tables, a second accent colour, proportional figures on a percentage,
pure-white SaaS canvas, stock photography in place of product UI.
