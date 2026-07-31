---
name: booka-brand
description: >-
  Booka's visual system — the exact colours, typography, layout, graphic
  recipes and copy voice used on the Booka landing page, with the real logo
  files and font bundled. Use this whenever producing anything that carries
  Booka's brand — slide decks, pitch decks, investor or sales presentations,
  one-pagers, reports, proposals, HTML pages, or internal documents. Trigger
  it even when the request just says "make a deck about our engine", "write up
  our pitch", "put together something for a client", or names Booka,
  credentialing, licensing, regulators, homologation or international hiring.
  Anything branded should come out looking like it came from the same company,
  and these values cannot be guessed.
---

# Booka's visual system

Everything here is measured from the live Booka landing page. Apply it whenever
you build something that carries the brand, so a deck made today and a page
made last month read as the same company.

## Before you build

Two things decide almost everything downstream, so settle them first.

**What surface is this?** The system has three grounds and they alternate on
purpose (see §1). Picking the ground first stops you reaching for a colour that
doesn't belong on it.

**What is the one claim?** Every section, slide and card earns its place by
making a single point. If you can't name it in a sentence, the slide isn't
ready — that's a content problem, and no amount of styling fixes it.

## 1. Three grounds, never two dark in a row

| Ground | Background | Plate | Ink | Body | Use for |
| --- | --- | --- | --- | --- | --- |
| **A — warm cream** | `#f5f4f1` | `#eceae4` | `#1c1c1e` | `#55534d` | Openings, feature content, closings. The default. |
| **B — cool near-white** | `#f7f9fa` | `#d4e3ec` (pale blue) or dark | `#16181d` | `#50565e` | Outcome and benefit grids. |
| **C — dark** | `#12121c` (deep `#0d0d15`) | `#2b2b39` | `#ffffff` | `#a5a5b2` | Hard numbers and trust/security. Punctuation only. |

Dark is a punctuation mark, not a theme. It appears where the claim is
quantitative or about trust, and a light ground separates each use. Two dark
sections back to back and the emphasis stops meaning anything.

## 2. One saturated colour

```
--accent      #5266eb   indigo — links, in-graphic highlights, data marks
--cta         #0b30f2   brand blue — the primary button, and nothing else
--cta-hover   #0827cf
```

Everything else is carried by warm greys and tone shifts. Resist introducing a
second saturated colour to mean "verified" or "alert" — use weight and the
semantic trio instead, at status size only:

```
--ok #34d399    --warn #fbbf24    --bad #f87171
```

Decorative washes, for light falling behind a group — never on a button:
`--glow-ice #cdddff`, `--glow-lavender #a79fd4`.

**Third-party marks are content, not chrome.** Regulator logos, client logos
and product screenshots keep their own colours. The one-saturated-colour rule
governs what *you* draw.

## 3. Type

Inter, bundled at `assets/inter-latin-opsz-normal.woff2` — a variable font, so
one file covers every weight. Inline it as a data URI when the output must be
self-contained.

- **Display**: weight **560**, letter-spacing **−0.022em**, line-height **1.06**.
  Break headlines manually where the break carries meaning. Two lines maximum.
- **Body**: 400, line-height 1.55, measure 62 characters.
- **Eyebrow**: 13px, uppercase, `letter-spacing: 0.09em`, muted `#8a8478`.
- **Emphasis**: weight **580 plus the ground's ink colour**. Weight alone
  barely separates from a 400 warm grey — this is the single most common way
  the system gets applied wrongly.
- **Numbers**: `font-variant-numeric: tabular-nums` on anything a reader
  compares.

Scale: 13 / 14 / 15 / 17 / 19 / 22 / 28 / 34 / 44 / 56 / 72.

Mercury's own Arcadia is proprietary; Inter is the closest available grotesque.
Don't substitute a serif — the display face is a sans.

## 4. Layout

- 4px base: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
- Page measure 1180px. Slides: 1280×720 or 1920×1080, same proportions inside.
- Radii: plate 18px, screenshot 12px, card 8px, pill 999px.
- Buttons are **full pills**, no shadow. Indigo primary with a tonal cream
  secondary — never two saturated buttons side by side.

**Depth splits in two, and conflating them is the usual mistake:**

- *Data surfaces stay flat.* Tables, stat tiles, anything numeric: 1px border
  `#dcd8ce`, no lift, no blur behind a number.
- *Showcase surfaces layer.* Soft, wide, low-opacity shadows tinted with the
  ink colour rather than black. A tight dark shadow instantly reads as generic
  SaaS.

```
--lift-shot  0 1px 2px rgba(28,28,30,.04), 0 10px 28px rgba(28,28,30,.07), 0 28px 64px rgba(28,28,30,.08)
--lift-chip  0 1px 2px rgba(28,28,30,.06), 0 8px 20px rgba(28,28,30,.10), 0 24px 48px rgba(28,28,30,.08)
--glass      rgba(255,255,255,.78) + backdrop-filter: blur(14px) saturate(150%)
```

## 5. Building a deck

`assets/deck-template.html` is a working deck in this system — cream, cool and
dark slides, a stat slide, a two-up card slide, with the font and logo already
inlined. Copy it and replace the content rather than starting from scratch;
it encodes the spacing and type decisions you'd otherwise have to re-derive.

Slide rhythm that works: open on cream with the problem, alternate cream and
cool for the argument, drop to dark for the numbers and for trust, close on
cream with the ask.

One claim per slide. The headline states it; the graphic proves it; the body
line explains the consequence. If a slide has two claims, it's two slides.

## 6. Graphics

Recipes for every graphic on the landing page — floating chrome over
screenshots, stat comparisons, the rotating globe, the credential card, the
world map, flag rails, pipeline diagrams — are in
**`references/graphics.md`**. Read it before drawing anything; each entry
includes the failure mode that recipe exists to avoid.

The short version:

- Product screenshots stay **sharp**. Blur them and you hide the evidence.
  Desaturate mildly (`saturate(.82)`), dissolve the bottom edge into the plate
  with a gradient overlay — not a blur, not a CSS mask, both of which kill the
  card's lift.
- Crop screenshots so nothing internal leaks. Revenue figures, real names and
  email addresses have all had to be cropped out of this deck's source
  material at least once.
- Abstract renders need **grain** (`feTurbulence` at ~0.2 opacity, overlay
  blend) and a **lit rim**. Without both they read as flat CSS gradients.

## 7. Voice and the approved claims

**`references/voice.md`** holds the copy rules and the exact wording of every
claim and statistic — 94% first-submission acceptance, 85% time reduction, 11
regulators, 100,000+ professionals, and the rest.

Use those numbers verbatim. They're measured, they're defensible, and quietly
rounding one to something punchier is how a deck ends up making a claim the
company can't stand behind.

The voice in one line: concrete, declarative, unhedged. Short sentences. Name
the cost before naming the fix. No exclamation marks, no "revolutionary", no
"seamless".

## 8. Full token reference

**`references/tokens.md`** has every value as copy-pasteable CSS custom
properties, plus the light/dark equivalents. Pull from there rather than
retyping hexes — a hand-typed `#5266ab` looks right in isolation and wrong
next to the real thing.
