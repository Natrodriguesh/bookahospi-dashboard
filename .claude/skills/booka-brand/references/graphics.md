# Graphic recipes

Each entry says what the recipe is, then the failure mode it exists to avoid.
The failure modes are all mistakes that were actually made building the
landing page — they look reasonable in the abstract and wrong on screen.

## Contents

1. Plates — the plane a graphic sits on
2. Product screenshots
3. Floating chrome (chips and lockups)
4. Stat comparisons on dark
5. Abstract renders
6. The credential card
7. Maps and globes
8. Logo rails and flags
9. Pipeline diagrams

---

## 1. Plates

Every graphic sits on a tinted plate, not directly on the page.

```css
.plate {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 18px;
  background: var(--a-panel);
  aspect-ratio: 1.78;      /* match this to the content it holds */
  display: grid;
  place-items: center;
  padding: 8% 8% 0;
}
```

A soft radial wash sits behind the group so it reads as light falling on it
rather than a gradient background:

```css
background: radial-gradient(118% 92% at 50% 0%, var(--glow-ice) 0%, transparent 62%);
opacity: .72;
```

**Failure mode.** A plate whose aspect doesn't match its content leaves a dead
band under the graphic. Size the plate to what it holds — a 2.9:1 screenshot
crop in a 1.5:1 plate is nearly half empty. Retune the aspect whenever the
content changes.

**Second failure mode.** `place-items: center` on a plate stops its rows
stretching, which collapses any `1fr` track inside to zero width. If a bar or
a rail vanishes entirely, this is why: set `align-items: stretch` on that
graphic.

---

## 2. Product screenshots

Sharp, mildly desaturated, dissolving into the plate at the bottom edge.

```css
.shot {
  width: 100%;
  border-radius: 12px;
  box-shadow: var(--lift-shot);
  filter: saturate(0.82) contrast(1.01);
}

/* the dissolve, as an overlay on the plate */
.plate:has(.shot)::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 30%;
  z-index: 3;
  background: linear-gradient(transparent, var(--plate-tone) 92%);
}
```

**Failure mode.** Blurring the screenshot to stop its own accent colour
competing with the page. It does stop the competing — by hiding the evidence.
The screenshot is the proof; if the product's colours clash, desaturate
mildly and crop tighter, don't blur.

**Second failure mode.** Using a mask or a blur for the bottom fade. Both kill
the card's lift, because the shadow gets masked with the element. A gradient
overlay keeps it.

**Third failure mode.** Exporting the crop smaller than it renders. Size for
the display width at 2x, then crop — not the other way round.

**Crop for what leaks, not just for composition.** Internal revenue figures,
real candidate names and email addresses have each had to be cropped out of
this project's screenshots after the fact. Read the capture before shipping it.

---

## 3. Floating chrome

Glass pills over a screenshot, at its edges.

```css
.chip {
  position: absolute;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 19px;
  border-radius: 999px;
  background: var(--glass);
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--lift-chip);
  font-size: 0.9375rem;
  font-weight: 520;
  white-space: nowrap;
}
```

**Failure mode.** Parking a chip over the thing it describes. Once a
screenshot is legible, a chip on top of a counter hides the number it is meant
to support. Keep chips at the edges, over empty regions.

**A lockup with no plate** needs a halo instead, or it collides with whatever
is underneath:

```css
filter: drop-shadow(0 0 14px rgba(255,255,255,.95))
        drop-shadow(0 0 30px rgba(255,255,255,.75));
```

To straddle an element's edge, derive the offset — don't guess. A plate's
percentage padding resolves against its *width*, so on an aspect-`R` plate a
`p%` top padding sits at `p × R` percent of the height.

---

## 4. Stat comparisons on dark

Two glowing bars, one large and one small.

```css
.bar--hi {
  height: 78%;
  background: linear-gradient(180deg, #fff, #f4f4ec);
  filter: blur(9px);
  box-shadow: 0 0 60px rgba(255,255,255,.5), 0 0 120px rgba(255,255,255,.3);
}
.bar--lo {
  height: 9%;
  border-radius: 999px;
  background: linear-gradient(180deg, #66667e, #45455a);
  filter: blur(5px);
}
```

Label above each bar: figure in white 17px, caption in body grey 13px.

**Failure mode.** Same blur on both bars. A short bar at a long bar's blur
radius stops reading as a bar at all. Scale blur with the element, and give
short bars a `min-width`.

**Second failure mode.** Making the "before" state too close to the plate
tone. On a `#2b2b39` plate, a dim element needs to sit around `#55556a` to
register at all.

---

## 5. Abstract renders

Soft overlapping ellipses, concentric shells, soft-body toggles.

Two things make them read as renders rather than as CSS:

```css
/* grain — without it, gradients look flat and synthetic */
.grain {
  position: absolute;
  inset: 0;
  opacity: 0.2;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>");
}

/* a lit rim — a radial fill alone glows but describes no form */
border: 1px solid rgba(255,255,255,0.1);
box-shadow: inset 0 3px 14px rgba(255,255,255,0.1), 0 12px 32px rgba(0,0,0,0.36);
```

**Failure mode.** Over-blurring a group. Two ellipses meant to overlap need to
keep their own edges; heavy blur merges them into one blob and the composition
disappears. Also size them to fit the plate — shapes taller than the plate get
clipped and merge for the same reason.

---

## 6. The credential card

A dark card, aspect ~1.68, radius 16px:

```css
background: linear-gradient(158deg, #53535f 0%, #43434f 48%, #383843 100%);
box-shadow: 0 2px 5px rgba(20,20,26,.24), 0 18px 40px rgba(28,28,30,.26);
```

Contents: a logo placeholder pill top-left, status with a green dot top-right,
role as a 13px uppercase eyebrow, holder name at 22px/560, then a hairline
rule and a row of label/value pairs in tabular figures. A QR sits at the right
with the issuer's mark beneath it.

**Make the QR real.** Generate it with `segno` or equivalent, encoding the
actual verification URL. A decorative pattern is exactly the detail that fails
the moment someone points a phone at it.

**Failure mode.** Putting the issuer's mark on a card that is meant to
demonstrate white-labelling. If the surrounding claim is "nothing points back
to us", leave the customer's logo slot as a placeholder shape. The issuer's
mark belongs on the credential itself, where it's what makes the code worth
scanning — not in the product chrome.

---

## 7. Maps and globes

**Flat world map.** Use real geography — Natural Earth land at 110m via the
`world-atlas` npm package. Decode the TopoJSON, project equirectangular,
decimate to the resolution it renders at. That takes the path from ~50KB to
~20KB with no visible loss at card size.

Frame it 72N to 58S. Equirectangular smears the high latitudes, and at full
extent Greenland and northern Russia become a solid band across the top. Drop
Antarctica and sub-threshold islands.

**Rotating globe.** Canvas, not SVG — the graticule, points and great-circle
arcs all need re-projecting every frame. Orthographic projection, slerp along
each arc, far side culled by depth. Pause it when off-screen, and render a
single static frame under `prefers-reduced-motion`.

**Failure mode.** Arcs lifted off the surface project outside the sphere's
silhouette near the limb and end in mid-air. Clip drawing to the disc.

**Second failure mode.** Labels that avoid each other but not the city dots.
Seed the dots into the occupancy list and place labels facing-most first, so
the label that survives a collision is the one nearest the viewer.

**Third failure mode.** Hand-drawing coastlines. At small sizes an inaccurate
map looks amateurish; a graticule or an abstract diagram is more honest and
usually reads better.

---

## 8. Logo rails and flags

Third-party marks sit on white pills with a hairline border:

```css
.reglist li {
  display: flex;
  align-items: center;
  border: 1px solid var(--a-rule);
  border-radius: 999px;
  padding: 10px 18px;
  background: #fff;
}
.reglist li img { height: 26px; width: auto; max-width: 118px; object-fit: contain; }
```

Normalise supplied logos to a **common height** so a wide wordmark and a
square emblem carry the same optical weight.

**Failure mode.** Trimming supplied SVGs by alpha. Most exported logo SVGs
paint an opaque white ground, so alpha-trimming returns the full canvas and
every mark comes out the same shape. Trim against white instead.

**Second failure mode.** Sizing a logo to 26px when it's a stacked lockup with
three lines of type. Give wordmark logos the height they need to be legible,
or crop to the mark.

---

## 9. Pipeline diagrams

Stages left to right with connectors between them.

```css
.pipeline {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr auto;
  align-items: stretch;    /* so stage labels sit on one line */
  gap: 16px;
}
.pipe-stage { display: grid; align-content: start; gap: 12px; }
.pipe-flow  { align-self: center; height: 1.5px;
              background: linear-gradient(90deg, rgba(28,28,30,.06), rgba(28,28,30,.26)); }
```

The arrowhead is a rotated corner: a 7px square with only its top and right
borders, rotated 45 degrees.

For a converging rail, give the nodes a **fixed width** so every stub
terminates on the rail. Ragged stub ends are the giveaway that a diagram is
CSS rather than drawing.

**Failure mode.** A long empty run between the rail and the hub. Move the rail
toward the hub and let the node stubs carry the horizontal distance — the
junction should read as one group, not as a span of nothing.

**Second failure mode.** A vertical connector that starts at the centre of the
element above it. Painted later in DOM order, it draws a line straight across
that element. Start it below.

---

## Verify before shipping

Measure rather than eyeball. The checks that have caught real bugs here:

- Do connector stubs actually terminate on the rail? Read the computed width
  from the pseudo-element — don't hardcode what you think it is.
- Does any floating chip escape the bounds of its plate?
- Does anything overflow the viewport at 1440, 768 and 390px? Compare
  `scrollWidth` to `clientWidth`, and when listing offenders, skip elements
  with a clipping ancestor or you get false positives forever.
- Do all images decode? Scroll first — lazy-loaded images below the fold
  report zero width otherwise.
- Are the tags balanced? Use a stack scan, not a regex count; a naive count of
  open versus close tags reports mismatches that aren't there.
