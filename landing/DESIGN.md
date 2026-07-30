# Mercury-derived design system — Bookahospi landing

Reference system for the standalone landing page. Cream editorial canvas, single
indigo action colour, warm-gray ink, and a layered depth treatment reserved for
marketing sections.

> **Provenance:** mercury.com could not be fetched from this environment (the
> egress policy returns 403 for all non-allowlisted hosts). The token values
> below come from published third-party documentation of Mercury's system, not
> from the live stylesheet. They must be reconciled against the screenshots
> before the visual work is considered final. See `PROVENANCE.md`.

## 1. Atmosphere

The page is paper, not plastic. Banking-grade trust expressed through editorial
restraint: cream backgrounds, warm-gray ink, one indigo CTA. Information density
borrows from Linear; tone borrows from a financial broadsheet. The brand recedes
and lets the numbers stand.

Mood: trustworthy, deliberate, modern, unhurried.

For our product the same restraint carries a second job — a compliance and
regulatory story has to read as *inevitable*, not as a pitch. Quiet surfaces do
that better than a gradient.

## 2. Colour tokens

```css
:root {
  /* canvas */
  --bg-primary:     #f6f5f2;  /* warm canvas, page */
  --bg-secondary:   #ebe8e0;  /* surface lift, alternating band */
  --bg-tertiary:    #ded9ca;  /* tonal divider, secondary CTA fill */
  --surface:        #ffffff;  /* card, table */

  /* ink */
  --text-primary:   #2a2924;
  --text-secondary: #5a5548;
  --text-muted:     #8a8478;

  /* action — the only saturated colour on the page */
  --accent:         #5266eb;  /* indigo: primary CTA + link underline */
  --accent-hover:   #4255d4;

  /* decorative blues — washes and mockups only, never on buttons */
  --wash-mid:       #9cb4e8;
  --wash-light:     #cdddff;

  /* lines */
  --border:         #ded9ca;
  --border-strong:  #c9c3b3;

  /* semantic — status only, never decoration */
  --success:        #2f7d57;
  --warning:        #c98a42;
  --danger:         #b54a3a;
}
```

**Rule:** indigo is the only saturated colour. Warm grays do all other
hierarchy. Never introduce a second accent to mean "verified" or "alert" — use
warm-gray weight, or the semantic trio at status-sized scale.

## 3. Typography

Mercury sets everything in **Arcadia** and **Arcadia Display**, which are
proprietary and not licensable. Substitute stack:

- **Headlines** — `Arcadia Display` → `Tiempos Headline`, `Iowan Old Style`,
  `Georgia`, serif. Weight 400. Letter-spacing −1%.
- **Body + UI** — `Arcadia` → `Inter`, `system-ui`. Weight 400/500.
  Line-height 1.5.
- **Numerals** — tabular figures on every stat, percentage, and count.
  `font-variant-numeric: tabular-nums`. Never proportional figures on a number
  that a reader will compare against another number.
- **Mono** — `IBM Plex Mono` for regulator codes and file IDs.

Scale: `13 / 14 / 16 / 18 / 22 / 28 / 36 / 48 / 72`.

Mercury's display weight sits at an intermediate **480** — neither bold nor
light. With a variable substitute, set 480 rather than snapping to 500.

## 4. Components

**Buttons**
- Primary: indigo fill, white text, full pill (`radius: 999px`), padding
  `10px 20px`, weight 500. No shadow.
- Secondary: `--bg-tertiary` fill, ink text, full pill. Hover `--border-strong`.
- Ghost: ink text, indigo on hover.
- Never two saturated buttons side by side — indigo primary + tonal cream
  secondary.

**Cards**
- White surface on `--bg-primary`, 1px `--border`, radius 8px, no shadow.
- Stat cards: figure at 36–48px tabular, label at 13px uppercase eyebrow
  (`letter-spacing: 0.08em`, `--text-muted`).

**Inputs**
- Pill shape, 1px `--border`, padding `10px 16px`. Focus: 2px indigo ring at
  2px offset.

**Tables**
- Tabular numerals, hairline `--border` row separators, sticky header at 12px
  uppercase eyebrow on `--bg-secondary`.

## 5. Layout

- Marketing max-width **1080px**, generous vertical rhythm.
- 4px base scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 96`.
- Section padding 96px desktop, 48px mobile.
- Let cream do the lifting between sections. Resist boxing every group.

## 6. Depth — two different rules

This is the one place where the dashboard system and the marketing system
diverge, and conflating them is the most likely way to get this wrong.

**Dashboard / data surfaces: flat.** Depth comes from cream tone shifts and 1px
borders. No card lift, no shadow on tiles, no glass over financial data. Modals
are the sole exception: `0 12px 32px rgba(42, 41, 36, 0.10)`.

**Marketing showcase sections: layered.** The "Get started fast" / "never stop
moving" pattern — the one we are reproducing — floats real product UI in
stacked planes:

```css
/* the plane a product screenshot sits on */
--lift-card:   0 1px 2px rgba(42,41,36,.04),
               0 8px 24px rgba(42,41,36,.06),
               0 24px 64px rgba(42,41,36,.08);

/* a smaller card breaking the plane of the one behind it */
--lift-float:  0 2px 4px rgba(42,41,36,.05),
               0 12px 32px rgba(42,41,36,.10),
               0 40px 80px rgba(42,41,36,.10);

/* the wash sitting behind the stack */
--wash: radial-gradient(120% 90% at 50% 0%,
          var(--wash-light) 0%,
          rgba(205,221,255,0) 62%);
```

Construction notes for that pattern:
1. A soft radial wash of `--wash-light` behind the stack, fading to
   transparent — it reads as light falling on the group, not as a gradient
   background.
2. A large product screenshot as the base plane, radius 12px, `--lift-card`,
   often cropped by the section edge so it continues past the viewport.
3. One or two smaller real UI fragments overlapping it at the corners, radius
   10px, `--lift-float`, so the group has parallax without animation.
4. `backdrop-filter: blur(12px) saturate(140%)` plus
   `background: rgba(255,255,255,.72)` on any floating chrome that sits *over*
   a screenshot (a pill badge, a toast, a filter bar). Blur belongs on
   overlay chrome — never on a surface a reader has to read numbers from.
5. Bottom fade where a screenshot runs off the section:
   `linear-gradient(rgba(246,245,242,0) 0%, var(--bg-primary) 100%)`.

Depth here is *soft and wide* — large blur radii at very low opacity, tinted
with the ink colour rather than pure black. A tight dark shadow will
immediately read as generic SaaS instead of Mercury.

## 7. Do / Don't

**Do**
- Tabular figures on every stat (94%, 85%, 11, 100,000+, 24 → 4).
- Pair the indigo CTA with a tonal cream secondary.
- Use real product screenshots. The whole effect depends on the UI in the
  cards being genuine.
- Keep the stat eyebrow → figure → explanation order: label, number, then the
  sentence that makes the number mean something.

**Don't**
- Crypto-startup gradients, neon, or a saturated hero fill.
- Drop shadows on dashboard tiles or data tables.
- A second saturated accent.
- Glass-morphism over anything numeric.
- Proportional figures on a percentage.

## 8. Responsive

- Marketing headlines scale 72 → 36.
- Showcase stacks collapse: floating fragments drop below the base screenshot
  rather than overlapping it, below 768px.
- Stat rows go 4-up → 2-up → 1-up.
- Section padding 96 → 48.
