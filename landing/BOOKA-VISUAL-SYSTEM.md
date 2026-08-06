# Booka visual system — colours, type, layout, graphics

Portable spec of everything visual on the Booka landing pages. No copy rules,
no approved claims, no voice — purely how it looks, so it can be adapted to a
different site while keeping the same visual language.

Two files should travel with this document if the goal is an exact match:
the Inter variable font (`assets/fonts/inter-latin-opsz-normal.woff2`) and the
logo marks (`assets/brand/booka-dark.png`, `booka-light.png`,
`booka-colour.png`). Everything else here is reproducible from values alone.

---

## 1. The core idea: three grounds, alternated on purpose

The whole system rests on three background "grounds" that the page cycles
between. This is the single most important structural decision — get this
right and most of the rest falls into place.

| Ground | Background | Plate (card surface) | Ink (headings) | Body text | Used for |
| --- | --- | --- | --- | --- | --- |
| **A — warm cream** | `#f5f4f1` | `#eceae4` | `#1c1c1e` | `#55534d` | Default. Openings, feature content, closings — most of the page. |
| **B — cool near-white** | `#f7f9fa` | `#d4e3ec` (pale blue) or dark | `#16181d` | `#50565e` | Outcome / benefit grids — a deliberate cool break from A. |
| **C — dark** | `#12121c` (deeper variant `#0d0d15`) | `#2b2b39` | `#ffffff` | `#a5a5b2` | Hard numbers, trust/security claims. Punctuation, not a theme. |

**The rule that matters most:** never run two dark (C) sections back to back.
Dark is reserved for the moments a claim is quantitative or about trust — used
everywhere, it stops meaning anything. A light section always separates two
dark ones.

Secondary rules:
- Additional surface tints, used sparingly inside grounds: `--a-panel-2:
  #e6e3db` (secondary button fill on A), `--b-panel-2: #c7dae6`, `--c-panel-2:
  #23232f`.
- Hairline borders: `--a-rule: #dcd8ce`, `--b-rule: #e2e8ec`, `--c-rule:
  #2e2e3d`.

---

## 2. Colour: one saturated hue, everything else neutral

```css
--accent:       #5266eb;  /* indigo — links, in-graphic highlights, data marks */
--accent-hover: #4255d4;
--cta:          #0b30f2;  /* brand blue — the primary button, and only the primary button */
--cta-hover:    #0827cf;
```

Everything that isn't a link or the primary button is carried by warm greys
and the ground-tone shifts above. Resist the instinct to add a second
saturated colour for "verified" or "highlighted" — reach for weight and the
semantic trio below instead, and keep it to status-sized elements (badges,
dots), never large fills:

```css
--ok:   #34d399;  /* success / live status */
--warn: #fbbf24;  /* pending / pilot status */
--bad:  #f87171;  /* error */
```

Decorative light washes — for a soft glow behind a graphic group, never on a
clickable element:

```css
--glow-ice:       #cdddff;
--glow-lavender:  #a79fd4;
--glow-lavender-2:#8f83c9;
```

**Third-party marks are exempt.** Partner logos, regulator/client marks, and
real product screenshots keep whatever colours they actually have. The
one-saturated-colour discipline governs original graphics you draw yourself,
not content you're displaying.

---

## 3. Typography

**Typeface:** Inter, loaded as a variable font (one file, every weight 100–900
via `font-variation-settings` / the `font-weight` shorthand). A single
`@font-face` block covers the whole range:

```css
@font-face {
  font-family: "Inter var";
  font-weight: 100 900;
  font-display: swap;
  src: url("inter-latin-opsz-normal.woff2") format("woff2");
}
```

For a fully self-contained HTML file, base64-encode the font into a `data:`
URI instead of linking the file.

**Weights and treatment by role:**

| Role | Weight | Letter-spacing | Line-height | Notes |
| --- | --- | --- | --- | --- |
| Display / headline | **560** | **−0.022em** | **1.06** | Break lines manually where the break carries meaning; two lines maximum. |
| Body | 400 | normal | 1.55 | Measure ~62 characters. |
| Eyebrow (small label above a headline) | 500 | **+0.09em**, uppercase | — | 13px, muted colour. |
| Emphasis inside a paragraph | **580** | normal | — | **Weight alone is not enough** — pair it with the ground's ink colour (see §7), or it barely separates from 400-weight body text. |
| Numbers being compared | 400–580 | — | — | `font-variant-numeric: tabular-nums`, always, on any figure a reader lines up against another. |

**Type scale** (px): 13 / 14 / 15 / 17 / 19 / 22 / 28 / 34 / 44 / 56 / 72.

A serif is never used for display type in this system — the headline face is
a grotesque sans throughout.

---

## 4. Layout, spacing, geometry

- **Base unit:** 4px. Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
- **Page measure:** 1180px max-width for marketing content.
- **Corner radii:** 18px for a graphic "plate" (see §6), 12px for a product
  screenshot, 8px for a flat data card, 999px (full pill) for buttons, chips
  and badges.
- **Buttons:** full pill, no shadow. One indigo/blue primary paired with a
  tonal cream secondary — never two saturated buttons side by side.

### Depth splits into two systems — the most common way this gets misapplied

**Data surfaces stay flat.** Tables, stat tiles, anything numeric: a 1px
border (`--a-rule` etc.), no drop shadow, no blur sitting behind a number.

**Showcase surfaces layer.** Product screenshots, floating chips, abstract
graphics — soft, wide, low-opacity shadows tinted with the ground's ink
colour rather than pure black:

```css
--lift-shot:
  0 1px 2px rgba(28,28,30,.04),
  0 10px 28px rgba(28,28,30,.07),
  0 28px 64px rgba(28,28,30,.08);

--lift-chip:
  0 1px 2px rgba(28,28,30,.06),
  0 8px 20px rgba(28,28,30,.10),
  0 24px 48px rgba(28,28,30,.08);

--lift-dark:
  0 2px 6px rgba(0,0,0,.3),
  0 18px 44px rgba(0,0,0,.34);

/* frosted chrome sitting over a screenshot or a photo */
--glass:      rgba(255,255,255,.78);
--glass-blur: blur(14px) saturate(150%);
```

A tight, dark, close shadow reads as generic SaaS the instant it appears —
the shadows here are deliberately soft and wide instead.

---

## 5. Status badges

Small pill indicating a live/pending/paused state — dot plus label, 13px:

```css
.status {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 560;
  padding: 4px 11px; border-radius: 999px;
  background: var(--a-panel-2); color: var(--a-body);
}
.status::before { content:""; width:6px; height:6px; border-radius:50%; background: var(--a-muted); }

.status--live  { background: rgba(52,211,153,.14); color:#1d7a52; }
.status--live::before  { background: var(--ok); }
.status--pilot { background: rgba(251,191,36,.16); color:#92620c; }
.status--pilot::before { background: var(--warn); }
```

On ground C, lighten both the fill and the text so the badge stays legible
against dark: `rgba(52,211,153,.16)` / `#6fe6b8` for live,
`rgba(251,191,36,.18)` / `#f4cd6b` for pilot.

---

## 6. Graphic construction — the recurring patterns

Every visual on the page is built from a small set of repeating patterns
rather than bespoke treatments per section. This is deliberate: it's what
makes a page assembled from many sections still read as one system.

### 6.1 The plate

Every graphic sits on a tinted "plate," never directly on the page background:

```css
.plate {
  position: relative; isolation: isolate; overflow: hidden;
  border-radius: 18px;
  background: var(--a-panel);   /* the ground's plate tone */
  aspect-ratio: 1.78;           /* tune this to whatever the plate holds */
  display: grid; place-items: center;
  padding: 8% 8% 0;
}
```

A soft radial "wash" behind the content reads as light falling on the group,
not as a flat gradient:

```css
background: radial-gradient(118% 92% at 50% 0%, var(--glow-ice) 0%, transparent 62%);
opacity: .72;
```

**Two things that go wrong here:** a plate whose aspect ratio doesn't match
its content leaves an empty band underneath — size the plate to what it
holds, and retune it whenever the content changes. And `place-items: center`
on the plate stops its rows stretching, which can silently collapse a `1fr`
grid track inside to zero width — if a bar or rail vanishes, this is usually
why; set `align-items: stretch` on that inner element.

### 6.2 Product screenshots

Kept **sharp** — never blurred to mute a clashing colour, since that hides
the evidence a screenshot exists to show. Desaturate mildly instead, and let
the bottom edge dissolve into the plate with a gradient overlay (not a blur,
not a CSS mask — both of those also kill the drop shadow):

```css
.shot {
  width: 100%; border-radius: 12px;
  box-shadow: var(--lift-shot);
  filter: saturate(.82) contrast(1.01);
}
.plate:has(.shot)::after {
  content:""; position:absolute; inset:auto 0 0; height:30%; z-index:3;
  background: linear-gradient(transparent, var(--plate-tone) 92%);
}
```

Export at the resolution the image actually displays at (2x for retina), not
smaller — a screenshot downscaled below its render size reads as fuzzy no
matter how it's styled afterward.

### 6.3 Floating chrome (chips and lockups)

Glass pills that float at the *edges* of a screenshot, never on top of the
number or detail they're meant to support:

```css
.chip {
  position:absolute; z-index:4;
  display:inline-flex; align-items:center; gap:8px;
  padding:11px 19px; border-radius:999px;
  background: var(--glass); backdrop-filter: var(--glass-blur);
  box-shadow: var(--lift-chip);
  font-size:15px; font-weight:520; white-space:nowrap;
}
```

A lockup with no plate behind it (e.g. a logo pair sitting directly over a
photo) needs a soft halo instead of a background, or it collides visually
with whatever sits underneath:

```css
filter: drop-shadow(0 0 14px rgba(255,255,255,.95))
        drop-shadow(0 0 30px rgba(255,255,255,.75));
```

To centre an element on another element's *edge* rather than guessing pixels:
a plate's percentage padding resolves against its **width**, so on a plate
with aspect ratio `R`, a `p%` top padding lands at `p × R` percent of the
*height*.

### 6.4 Stat comparisons on a dark ground

Two glowing bars, one tall and bright, one short and dim:

```css
.bar--hi {
  height:78%;
  background: linear-gradient(180deg,#fff,#f4f4ec);
  filter: blur(9px);
  box-shadow: 0 0 60px rgba(255,255,255,.5), 0 0 120px rgba(255,255,255,.3);
}
.bar--lo {
  height:9%; border-radius:999px;
  background: linear-gradient(180deg,#66667e,#45455a);
  filter: blur(5px);
}
```

Match blur radius to the element's size — the same blur applied to a short
bar as a tall one makes the short one dissolve into nothing; give it a
`min-width` and a lighter blur instead. And keep a "dim/before" state
noticeably lighter than the plate tone behind it (on a `#2b2b39` plate,
`#55556a` or lighter still reads; anything closer to the plate colour
disappears).

### 6.5 Abstract renders (soft shapes, shells, toggles)

Two things separate a convincing abstract render from a flat CSS gradient:

```css
/* visible grain — without it, gradients look synthetic */
.grain {
  position:absolute; inset:0; opacity:.2; mix-blend-mode:overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>");
}

/* a lit rim — a radial fill alone glows but describes no form */
border: 1px solid rgba(255,255,255,.1);
box-shadow: inset 0 3px 14px rgba(255,255,255,.1), 0 12px 32px rgba(0,0,0,.36);
```

Don't over-blur a composition of multiple shapes meant to overlap — each one
needs to keep its own edge, or heavy blur merges the group into a single
blob and the shape disappears.

### 6.6 A branded credential / ID-style card

Dark card, roughly 1.68 aspect ratio, 16px radius:

```css
background: linear-gradient(158deg,#53535f 0%,#43434f 48%,#383843 100%);
box-shadow: 0 2px 5px rgba(20,20,26,.24), 0 18px 40px rgba(28,28,30,.26);
```

Layout: a logo/placeholder pill top-left, a status dot top-right, a 13px
uppercase eyebrow label, a name at 22px/560, a hairline divider, then a row
of small label/value pairs in tabular figures. A QR code (if used) should
encode a real, working URL rather than a decorative pattern — a fake one is
the kind of detail that fails the moment someone actually scans it.

### 6.7 Maps and rotating globes

**A flat world map** should use real landmass geometry (e.g. a public-domain
world-atlas dataset), decoded and simplified to the resolution it actually
renders at — a full-detail coastline is enormous and mostly invisible at card
size. Frame roughly 72°N–58°S: an equirectangular projection smears the
poles into a solid band otherwise, and Antarctica plus sub-pixel islands are
usually worth dropping entirely.

**A rotating globe** needs `<canvas>`, not SVG — the graticule, points, and
great-circle connector arcs all have to be re-projected every frame.
Orthographic projection, spherical interpolation along each arc, and cull
anything on the far side by depth. Pause the animation when the element
scrolls off-screen, and render one static frame under
`prefers-reduced-motion`.

Two things that go wrong: connector arcs drawn *above* the sphere's surface
can project outside its silhouette near the edge and appear to float in
space — clip all drawing to the disc. And point labels that avoid each other
but not the dots themselves can land squarely on a neighbouring city marker —
treat the dots as occupied space too, and prioritise whichever point is most
face-on to the viewer when two labels collide.

### 6.8 Logo rails (partner / regulator marks)

Third-party logos sit on plain white pills with a hairline border:

```css
.logo-pill {
  display:flex; align-items:center;
  border:1px solid var(--a-rule); border-radius:999px;
  padding:10px 18px; background:#fff;
}
.logo-pill img { height:26px; width:auto; max-width:118px; object-fit:contain; }
```

Normalise every supplied logo to the **same height**, not the same width — a
wide wordmark and a square emblem should carry equal visual weight. And when
trimming whitespace from a supplied logo file, check whether it has a real
alpha channel first: many exported logo files paint an *opaque white*
background rather than transparency, so trimming by alpha silently fails and
returns the untrimmed canvas.

### 6.9 Pipeline / flow diagrams

Stages left to right, connected by thin lines with an arrowhead as a rotated
square corner:

```css
.pipeline { display:grid; grid-template-columns:auto 1fr auto 1fr auto; align-items:stretch; gap:16px; }
.pipe-flow { align-self:center; height:1.5px;
  background: linear-gradient(90deg, rgba(28,28,30,.06), rgba(28,28,30,.26)); }
.pipe-flow::after {
  content:""; position:absolute; right:0; top:50%; width:7px; height:7px;
  border-top:1.5px solid rgba(28,28,30,.26); border-right:1.5px solid rgba(28,28,30,.26);
  transform: translate(0,-50%) rotate(45deg);
}
```

For several inputs converging on one node, give every input a **fixed
width** so all their connector stubs terminate at exactly the same rail —
ragged stub lengths are what makes a converging diagram look like CSS rather
than a real drawing. And if a connector has to start from the middle of an
element drawn *after* it in the document, it will visually cut across that
element — start connectors from the element's edge, not its centre.

---

## 7. Applying emphasis and colour correctly per ground

Because the page moves between three grounds, every ink/body/emphasis value
above is ground-relative, not fixed. When adapting a component to sit on
ground B or C, swap:

- Headline colour → that ground's ink value
- Body colour → that ground's body value
- `<strong>`/emphasis → weight 580 **and** that ground's ink colour (not
  weight alone)
- Any status badge → the ground-C lightened variants in §5

Getting this step wrong — carrying ground A's dark-on-cream values onto a
dark-ground section — is the single most common way a component looks
"broken" when reused: text renders in a colour close to its own background
and nearly disappears.
