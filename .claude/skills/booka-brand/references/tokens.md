# Booka tokens

Copy-pasteable. Every value is measured from the live landing page.

## Custom properties

```css
:root {
  /* ── ground A: warm cream — the default ─────────────────── */
  --a-bg: #f5f4f1;
  --a-panel: #eceae4;      /* tinted plate a graphic sits on */
  --a-panel-2: #e6e3db;    /* secondary button fill */
  --a-ink: #1c1c1e;
  --a-body: #55534d;
  --a-muted: #8a8478;
  --a-rule: #dcd8ce;

  /* ── ground B: cool near-white — outcome grids ───────────── */
  --b-bg: #f7f9fa;
  --b-panel: #d4e3ec;
  --b-panel-2: #c7dae6;
  --b-ink: #16181d;
  --b-body: #50565e;
  --b-rule: #e2e8ec;

  /* ── ground C: dark — numbers and trust, used sparingly ──── */
  --c-bg: #12121c;
  --c-bg-2: #0d0d15;
  --c-panel: #2b2b39;
  --c-panel-2: #23232f;
  --c-ink: #ffffff;
  --c-body: #a5a5b2;
  --c-muted: #75758a;
  --c-rule: #2e2e3d;

  /* ── action ─────────────────────────────────────────────── */
  --accent: #5266eb;       /* links, data marks, in-graphic highlights */
  --accent-hover: #4255d4;
  --cta: #0b30f2;          /* primary button only */
  --cta-hover: #0827cf;

  /* ── decorative washes: light behind a group, never a fill ─ */
  --glow-ice: #cdddff;
  --glow-lavender: #a79fd4;
  --glow-lavender-2: #8f83c9;

  /* ── status: at status size only ────────────────────────── */
  --ok: #34d399;
  --warn: #fbbf24;
  --bad: #f87171;

  /* ── type ───────────────────────────────────────────────── */
  --font: "Inter var", Inter, "Helvetica Neue", -apple-system, system-ui, sans-serif;
  --display-weight: 560;
  --display-tracking: -0.022em;
  --display-leading: 1.06;

  --fs-13: 0.8125rem;  --fs-14: 0.875rem;   --fs-15: 0.9375rem;
  --fs-17: 1.0625rem;  --fs-19: 1.1875rem;  --fs-22: 1.375rem;
  --fs-28: 1.75rem;    --fs-34: 2.125rem;   --fs-44: 2.75rem;
  --fs-56: 3.5rem;     --fs-72: 4.5rem;

  /* ── space: 4px base ────────────────────────────────────── */
  --sp-1: 4px;   --sp-2: 8px;   --sp-3: 12px;  --sp-4: 16px;
  --sp-6: 24px;  --sp-8: 32px;  --sp-12: 48px; --sp-16: 64px;
  --sp-24: 96px; --sp-32: 128px;

  /* ── geometry ───────────────────────────────────────────── */
  --measure: 1180px;
  --r-plate: 18px;   /* tinted graphic plate */
  --r-shot: 12px;    /* product screenshot */
  --r-card: 8px;     /* flat data card */
  --r-chip: 999px;   /* pills and buttons */

  /* ── depth: showcase surfaces only ──────────────────────── */
  --lift-shot:
    0 1px 2px rgba(28, 28, 30, 0.04),
    0 10px 28px rgba(28, 28, 30, 0.07),
    0 28px 64px rgba(28, 28, 30, 0.08);
  --lift-chip:
    0 1px 2px rgba(28, 28, 30, 0.06),
    0 8px 20px rgba(28, 28, 30, 0.1),
    0 24px 48px rgba(28, 28, 30, 0.08);
  --lift-dark:
    0 2px 6px rgba(0, 0, 0, 0.3),
    0 18px 44px rgba(0, 0, 0, 0.34);

  --glass: rgba(255, 255, 255, 0.78);
  --glass-blur: blur(14px) saturate(150%);

  /* ── product captures ───────────────────────────────────── */
  --shot-filter: saturate(0.82) contrast(1.01);
}
```

## The font

`assets/inter-latin-opsz-normal.woff2` is Inter as a variable font: one file,
every weight from 100 to 900. Declare it once.

```css
@font-face {
  font-family: "Inter var";
  font-weight: 100 900;
  font-display: swap;
  src: url("assets/inter-latin-opsz-normal.woff2") format("woff2");
}
```

For a self-contained file, base64 it into a data URI instead of a path. The
latin subset covers accented characters, so "Bogota" and "Espana" with their
accents render correctly without a second file.

## The logos

| File | Use |
| --- | --- |
| `assets/booka-dark.png` | Black mark — light grounds A and B |
| `assets/booka-light.png` | White mark — dark ground C |
| `assets/booka-colour.png` | Blue and navy — only where the brand is the subject |

The full-colour mark's blue is more saturated than the accent, so on a page
that follows the one-saturated-colour rule it will fight everything around it.
Reach for the monochrome variants by default; use colour deliberately, such as
in a lockup where the brand itself is what the graphic is about.

## Contrast

Checked against WCAG AA for body text on each ground:

| Combination | Ratio |
| --- | --- |
| `--a-body` on `--a-bg` | 6.9:1 |
| `--a-ink` on `--a-bg` | 15.3:1 |
| `--b-body` on `--b-bg` | 7.6:1 |
| `--c-body` on `--c-bg` | 8.1:1 |
| white on `--cta` | 8.4:1 |

`--a-muted` on cream is 3.4:1 — fine for the 13px uppercase eyebrow it exists
for, not for running text.
