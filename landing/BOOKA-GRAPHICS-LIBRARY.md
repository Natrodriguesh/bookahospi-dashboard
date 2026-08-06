# Booka — Graphics & Mockup Library

Every custom graphic built for the Booka landing page, as copy-pasteable
HTML + CSS (+ JS where it animates). This is the companion to
`BOOKA-VISUAL-SYSTEM.md` (which covers the *system* — color, type, layout) —
this file is only the graphics themselves: the globe, the world map, the
credential card, the chart mocks, the diagrams, the badges.

Nothing here is a stock icon or a screenshot of a real product — every
graphic below is drawn from scratch in CSS/SVG/Canvas to *represent* a
concept (a pipeline, a comparison, a lock) without faking a UI that doesn't
exist. That's a deliberate rule, not an accident: see the note at the end.

Source of truth: `landing/index.html`, `landing/plataforma.html`,
`landing/styles.css`. Line references point at `styles.css` on the
`claude/landing-page-mercury-design-s0k798` branch at the time this was
written — re-grep if the file has moved since.

---

## 0. The three primitives every graphic sits on

Before the individual graphics: three small pieces get reused by almost
everything below, so they're worth lifting out once instead of repeating in
every recipe.

### 0.1 `.plate` — the tinted background plane

Every graphic, screenshot, or diagram sits on a `.plate`: a rounded panel
sized to a fixed aspect ratio, so cards in the same grid line up even
though what's inside them varies wildly (a screenshot vs. a canvas vs. an
SVG chart).

```css
.plate {
  --plate-tone: #eceae4; /* swap per ground — see BOOKA-VISUAL-SYSTEM.md §1 */
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 18px;
  background: var(--plate-tone);
  aspect-ratio: 1.78;       /* default — override per graphic below */
  display: grid;
  place-items: center;
  padding: 8% 8% 0;
}

/* variants used across the graphics below */
.plate--tall  { aspect-ratio: 1.62; padding: 11% 7% 0; }      /* screenshot-heavy cards */
.plate--wide  { aspect-ratio: 3.8;  padding: 0; }               /* pipeline diagram */
.plate--dark  { background: linear-gradient(165deg,#2d2d36 0%,#1b1b22 62%,#141419 100%); padding: 0; }
.plate--blue  { background: #d4e3ec; padding: 8%; }             /* pale blue, ground B */
.plate--c     { background: #2b2b39; padding: 0; }              /* ground C panel */
.plate--hero  { --plate-tone:#e9e6df; aspect-ratio: 1.95; padding: 5% 6% 0;
                background: linear-gradient(180deg,#efede7,var(--plate-tone)); }
```

Pick the aspect ratio to match what's inside it — a screenshot crop and a
square icon diagram should never share a ratio; that's what produces dead
space.

### 0.2 `.wash` — the "light falling on the group" glow

A soft radial highlight behind a graphic, always at the *top* of the plate,
never centered — it reads as light falling on the scene, not a spotlight.

```css
.wash {
  position: absolute;
  inset: -10% -10% auto;
  height: 78%;
  background: radial-gradient(118% 92% at 50% 0%, #cdddff 0%, rgba(205,221,255,0) 62%);
  opacity: 0.72;
  z-index: 0;
}
.wash--lav {
  background: radial-gradient(100% 80% at 50% 6%, #a79fd4 0%, rgba(167,159,212,0) 60%);
  opacity: 0.5;
}
```

```html
<figure class="plate">
  <span class="wash" aria-hidden="true"></span>
  <!-- graphic content -->
</figure>
```

### 0.3 `.grain` — the texture that saves abstract renders from looking flat

Every dark/abstract CSS-gradient graphic (rings, shield, cost chart, world
map veil) gets a `feTurbulence` noise overlay on top, blended with
`overlay`. Without it, gradients on a plain background read as generic
"AI startup" clip art — the grain is what makes them feel rendered rather
than drawn in a color picker.

```css
.grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.2;
  mix-blend-mode: overlay;
  z-index: 5;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>");
}
```

Drop `<span class="grain" aria-hidden="true"></span>` as the last child of
any dark abstract graphic.

---

## 1. Rotating 3D globe (canvas)

A real orthographic-projection globe — not an SVG or a GIF — rotating
slowly, with great-circle arcs animating between cities in sequence.
Renders to a `<canvas>`, driven entirely by JS, no image assets.

**Used for:** "origin market doesn't matter" — a card showing the product
works regardless of where a candidate trained.

```html
<figure class="plate">
  <span class="wash" aria-hidden="true"></span>
  <canvas
    class="gfx globe"
    role="img"
    aria-label="A rotating globe connecting New York, Bogotá, Buenos Aires, Madrid, London, Riyadh and Beijing"
  ></canvas>
</figure>
```

```css
.globe {
  width: 100%;
  aspect-ratio: 62 / 35;
  display: block;
  position: relative;
  z-index: 1;
}
```

```js
(() => {
  const canvas = document.querySelector(".globe");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");

  const CITY = {
    "New York": [40.71, -74.01], "Bogotá": [4.71, -74.07],
    "Buenos Aires": [-34.6, -58.38], Madrid: [40.42, -3.7],
    London: [51.51, -0.13], Riyadh: [24.71, 46.68], Beijing: [39.9, 116.41],
  };
  const LINK = [
    ["Bogotá","Madrid"], ["Buenos Aires","Madrid"], ["Bogotá","Riyadh"],
    ["Beijing","Riyadh"], ["New York","London"], ["Madrid","Riyadh"],
    ["Riyadh","London"], ["Buenos Aires","London"], ["Beijing","London"],
  ];

  const TILT = (20 * Math.PI) / 180;
  const STAGGER = 0.5, DRAW = 0.9, HOLD = 2.4, FADE = 0.8;
  const CYCLE = (LINK.length - 1) * STAGGER + DRAW + HOLD;

  const vec = ([lat, lon]) => {
    const p = (lat * Math.PI) / 180, l = (lon * Math.PI) / 180;
    return [Math.cos(p) * Math.cos(l), Math.sin(p), Math.cos(p) * Math.sin(l)];
  };
  const V = Object.fromEntries(Object.entries(CITY).map(([k, ll]) => [k, vec(ll)]));

  // spin about the polar axis, then tilt the pole toward the viewer
  const project = (v, rot, R, cx, cy) => {
    const c = Math.cos(rot), s = Math.sin(rot);
    const x = v[0] * c + v[2] * s;
    const z = -v[0] * s + v[2] * c;
    const ct = Math.cos(TILT), st = Math.sin(TILT);
    return [cx + R * x, cy - R * (v[1] * ct - z * st), v[1] * st + z * ct];
  };

  const slerp = (a, b, t) => {
    const d = Math.max(-1, Math.min(1, a[0]*b[0] + a[1]*b[1] + a[2]*b[2]));
    const o = Math.acos(d);
    if (o < 1e-6) return a.slice();
    const s = Math.sin(o), k1 = Math.sin((1-t)*o)/s, k2 = Math.sin(t*o)/s;
    return [a[0]*k1+b[0]*k2, a[1]*k1+b[1]*k2, a[2]*k1+b[2]*k2];
  };

  let w = 0, h = 0, dpr = 1;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const polyline = (pts, rot, R, cx, cy) => {
    let started = false;
    ctx.beginPath();
    for (const v of pts) {
      const [x, y, z] = project(v, rot, R, cx, cy);
      if (z <= 0) { started = false; continue; }
      if (started) ctx.lineTo(x, y); else { ctx.moveTo(x, y); started = true; }
    }
    ctx.stroke();
  };

  const graticule = (rot, R, cx, cy) => {
    ctx.strokeStyle = "rgba(28,28,30,0.10)";
    ctx.lineWidth = 1;
    for (let lon = -180; lon < 180; lon += 30) {
      const pts = [];
      for (let lat = -90; lat <= 90; lat += 4) pts.push(vec([lat, lon]));
      polyline(pts, rot, R, cx, cy);
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts = [];
      for (let lon = -180; lon <= 180; lon += 4) pts.push(vec([lat, lon]));
      polyline(pts, rot, R, cx, cy);
    }
  };

  const arc = (a, b, prog, rot, R, cx, cy, alpha) => {
    const N = 64;
    ctx.strokeStyle = "rgba(82,102,235," + (0.85*alpha).toFixed(3) + ")"; // --accent
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    let started = false;
    ctx.beginPath();
    for (let i = 0; i <= N * prog; i++) {
      const t = i / N;
      const m = slerp(a, b, t);
      const lift = 1 + 0.07 * Math.sin(Math.PI * t); // arcs bow outward, not straight chords
      const [x, y, z] = project([m[0]*lift, m[1]*lift, m[2]*lift], rot, R, cx, cy);
      if (z <= 0) { started = false; continue; }
      if (started) ctx.lineTo(x, y); else { ctx.moveTo(x, y); started = true; }
    }
    ctx.stroke();
  };

  let rot = -1.1, last = 0, t = 0;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");

  const frame = (now) => {
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    if (!reduce.matches) { rot += dt * 0.13; t = (t + dt) % CYCLE; }
    draw();
    if (running) requestAnimationFrame(frame);
  };

  function draw() {
    if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const R = Math.min(w, h) * 0.46, cx = w / 2, cy = h / 2;

    ctx.strokeStyle = "rgba(28,28,30,0.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    graticule(rot, R, cx, cy);

    const tail = Math.max(0, t - (CYCLE - FADE));
    const fade = reduce.matches ? 1 : 1 - tail / FADE;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip(); // depth-cull: nothing draws past the disc edge
    LINK.forEach(([from, to], i) => {
      const p = reduce.matches ? 1 : Math.max(0, Math.min(1, (t - i*STAGGER) / DRAW));
      if (p > 0) arc(V[from], V[to], p, rot, R, cx, cy, fade);
    });
    ctx.restore();

    ctx.font = '13px "Inter var", Inter, system-ui, sans-serif';
    ctx.textAlign = "center";
    const seen = Object.entries(V)
      .map(([name, v]) => ({ name, p: project(v, rot, R, cx, cy) }))
      .filter((c) => c.p[2] > 0.02)
      .sort((a, b) => b.p[2] - a.p[2]); // nearest-to-viewer first

    for (const { p } of seen) {
      ctx.fillStyle = "rgba(28,28,30," + Math.min(1, p[2]/0.35).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(p[0], p[1], 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // drop a label rather than let it overlap one already placed
    const boxes = seen.map(({ p }) => [p[0]-7, p[1]-7, p[0]+7, p[1]+7]);
    for (const { name, p } of seen) {
      if (p[2] <= 0.3) continue;
      const wl = ctx.measureText(name).width;
      const box = [p[0]-wl/2-3, p[1]-24, p[0]+wl/2+3, p[1]-8];
      if (boxes.some((b) => box[0]<b[2] && box[2]>b[0] && box[1]<b[3] && box[3]>b[1])) continue;
      boxes.push(box);
      ctx.fillStyle = "rgba(85,83,77," + Math.min(1, (p[2]-0.3)/0.2).toFixed(3) + ")";
      ctx.fillText(name, p[0], p[1] - 11);
    }
  }

  let running = false;
  const io = new IntersectionObserver((es) => {
    const vis = es.some((e) => e.isIntersecting);
    if (vis && !running) { running = true; last = 0; requestAnimationFrame(frame); }
    else if (!vis) running = false;
  }, { rootMargin: "120px" });

  new ResizeObserver(() => { resize(); draw(); }).observe(canvas);
  resize();
  io.observe(canvas);
})();
```

**To adapt:** swap `CITY` for your own lat/lon pairs and `LINK` for the
routes you want to animate. Everything else (rotation speed, arc timing,
label collision) is generic.

**What goes wrong if you skip parts of this:** dropping the `z <= 0`
back-face check draws lines through the far side of the sphere as if it
were transparent. Dropping the `IntersectionObserver` gate burns CPU on a
card that has scrolled off-screen. Dropping `prefers-reduced-motion`
handling spins a sphere in front of a user who explicitly asked for none.

---

## 2. Real-geography world map

Not a stylized/abstract map — the actual coastlines, decimated from the
`world-atlas` npm package's TopoJSON (110m resolution), converted to one
SVG `<path>`, and framed 72°N–58°S to avoid the pole-smearing that
equirectangular projections produce at the poles.

**Used for:** a dark "new revenue line" / global-reach card, and reused as
the B2C hero background on `profesionales.html`.

```html
<figure class="plate plate--dark">
  <!-- MUST be plate--dark: the landmass fill is white-at-15%-opacity,
       designed to sit on a dark ground. On a light plate it's nearly
       invisible — this was a real bug during development. -->
  <div class="gfx gfx--world" aria-hidden="true">
    <svg class="world" viewBox="0 68 1000 348" preserveAspectRatio="xMidYMid slice">
      <path d="M312,400L315,401L…Z" /> <!-- full path in landing/index.html:536 -->
    </svg>
    <span class="world-veil"></span>
    <img class="world-mark" src="assets/brand/booka-light.png" alt="" />
    <span class="grain"></span>
  </div>
</figure>
```

```css
.gfx--world { overflow: hidden; }

.world {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.world path {
  fill: rgba(255, 255, 255, 0.15);
}

/* darkens the middle so the mark reads without dimming the edges */
.world-veil {
  position: absolute;
  inset: 0;
  background: radial-gradient(58% 68% at 50% 50%, rgba(16,16,22,.82) 0%, rgba(16,16,22,0) 72%);
}

.world-mark {
  position: relative;
  z-index: 3;
  width: 42%;
  height: auto;
}
```

**To adapt:** the full `d` path is long (it's real coastline data) — pull
it from `landing/index.html` line 536 rather than retyping it. To
regenerate at a different resolution or framing, use `world-atlas`'s
`land-110m.json`, run it through `topojson-client`'s `feature()`, and a
`geoPath` with a plain `geoEquirectangular` projection clipped to your
own latitude band (72°N/-58°S here) before flattening to one path string.

**What goes wrong:** placing this on a light plate (the bug that actually
happened) — the landmass disappears and only the dark veil blob is left,
with no visible geography at all.

---

## 3. Credential / ID card mockup (with a real, working QR code)

A polished "sample credential" card — the kind of document the product
issues — floating on a soft lavender glow, with a QR code that encodes a
real (not decorative) verification URL.

```html
<figure class="plate">
  <span class="wash wash--lav" aria-hidden="true"></span>
  <div class="gfx gfx--card" aria-hidden="true">
    <span class="cardglow"></span>
    <div class="licence">
      <div class="licence-top">
        <span class="licence-logo"></span> <!-- deliberately a blank shape, not a real logo: this represents "the customer's brand goes here" -->
        <span class="licence-state"><span class="dot dot--ok"></span>Active</span>
      </div>
      <div class="licence-body">
        <div class="licence-id">
          <span class="licence-role">Registered Nurse</span>
          <span class="licence-name">Amina Diallo</span>
        </div>
        <div class="licence-verify">
          <svg class="licence-qr" viewBox="0 0 29 29" aria-hidden="true">
            <path stroke="currentColor" d="M0 0.5h7m1 0h1… (full path in index.html:156)" />
          </svg>
          <img class="licence-brand" src="assets/brand/booka-light.png" alt="" />
        </div>
      </div>
      <dl class="licence-data">
        <div><dt>Regulator</dt><dd class="tabular">SCFHS</dd></div>
        <div><dt>Licence</dt><dd class="tabular">···· 4307</dd></div>
        <div><dt>Valid to</dt><dd class="tabular">Jul 2028</dd></div>
      </dl>
    </div>
  </div>
</figure>
```

```css
.cardglow {
  position: absolute;
  left: 16%; right: 16%; top: 14%; height: 22%;
  border-radius: 999px;
  background: linear-gradient(90deg, #b9b2e2, #a79fd4 55%, #b9b2e2);
  filter: blur(26px);
  opacity: 0.9;
}

.licence {
  position: relative;
  width: 76%;
  aspect-ratio: 1.68;
  border-radius: 16px;
  padding: 6.5% 7%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(158deg, #53535f 0%, #43434f 48%, #383843 100%);
  box-shadow: 0 2px 5px rgba(20,20,26,.24), 0 18px 40px rgba(28,28,30,.26);
  color: #eceaf4;
}

.licence-top { display: flex; align-items: center; justify-content: space-between; }

.licence-logo {
  width: 34%; height: 16px; border-radius: 999px;
  background: linear-gradient(90deg, rgba(255,255,255,.34), rgba(255,255,255,.14));
}

.licence-state { display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 500; }

.licence-body { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
.licence-id { display: grid; gap: 2px; }
.licence-role { font-size: 13px; letter-spacing: .08em; text-transform: uppercase; color: #a9a5bd; }
.licence-name { font-size: 22px; font-weight: 560; letter-spacing: -.018em; line-height: 1.1; }

.licence-verify { display: grid; justify-items: center; gap: 7px; width: 24%; flex: none; margin-bottom: 5px; }
.licence-brand { width: 62%; height: auto; opacity: .8; }
.licence-qr {
  width: 100%; aspect-ratio: 1; flex: none; color: #fff;
  stroke-width: 1; shape-rendering: crispEdges; opacity: .94;
}

.licence-data {
  display: flex; gap: 9%; margin: 0; padding-top: 6.5%;
  border-top: 1px solid rgba(255,255,255,.11);
}
.licence-data dt { font-size: 13px; color: #a9a5bd; margin-bottom: 1px; }
.licence-data dd { margin: 0; font-size: 14px; font-weight: 520; }
```

**How the QR path was generated:** the `d` attribute is a real QR code —
generated with Python's `segno` library at a low error-correction level,
then converted module-by-module into a single SVG path (`segno` can emit
SVG directly; the path here was hand-consolidated for file size). Point
`segno.make("https://your-verification-url")` at whatever URL you want the
card to actually resolve to — don't reuse decorative/fake QR noise, since
a reader will actually scan it.

**What goes wrong:** filling `.licence-logo` with a real third-party logo
undercuts the point of the card — it's supposed to represent "your brand
goes here," so leaving it a blank pill is intentional, not unfinished.

---

## 4. Regulator node diagram (many authorities → one integration)

A rail-and-hub diagram: several regulator logos on the left, each with a
stub connecting to a vertical rail, which converges on a single "hub"
pill, then drops to an outcome card.

```html
<figure class="plate" style="padding:0">
  <div class="gfx gfx--nodes" aria-hidden="true">
    <span class="node node--1"><img src="assets/regulators/scfhs.png" alt="" /></span>
    <span class="node node--2"><img src="assets/regulators/dataflow.png" alt="" /></span>
    <span class="node node--3"><img src="assets/regulators/dha.png" alt="" /></span>
    <span class="node node--4"><img src="assets/regulators/gmc.png" alt="" /></span>
    <span class="node node--5"><img src="assets/regulators/sanidad.png" alt="" /></span>
    <span class="rail"></span>
    <span class="hub">One integration</span>
    <span class="drop"></span>
    <span class="outcome">
      <span class="outcome-title">Unlimited files in parallel</span>
      <span class="outcome-sub">Any destination market</span>
    </span>
  </div>
</figure>
```

```css
.gfx--nodes { display: block; }

.gfx--nodes::before { /* the rail-to-hub run; hub pill paints over its right end */
  content: ""; position: absolute; left: calc(6% + 16rem); right: 6%; top: 42%;
  height: 1.5px; background: rgba(28,28,30,.18);
}

.node, .hub {
  position: absolute; display: inline-flex; align-items: center;
  border-radius: 999px; background: #fff;
  box-shadow: 0 1px 2px rgba(28,28,30,.05), 0 6px 16px rgba(28,28,30,.07);
  font-size: 14px; font-weight: 540; color: #1c1c1e; padding: 8px 15px; left: 6%;
}

/* five nodes, spaced symmetrically about the hub at 50% */
.node--1 { top: 3.9%; }  .node--2 { top: 23.2%; } .node--3 { top: 42.4%; }
.node--4 { top: 61.7%; } .node--5 { top: 80.9%; }

.node { width: 9rem; justify-content: center; padding: 8px 12px; } /* fixed width so every stub lands on the rail */
.node img { display: block; height: 30px; max-width: 100%; width: auto; object-fit: contain; margin: 0 auto; }

.node::after {
  content: ""; position: absolute; left: 100%; top: 50%; width: 7rem; height: 1.5px;
  background: rgba(28,28,30,.18);
}

.rail {
  position: absolute; left: calc(6% + 16rem); top: 11.5%; bottom: 11.5%; width: 1.5px;
  background: rgba(28,28,30,.18);
}

.hub {
  left: auto; right: 6%; top: 42%; transform: translateY(-50%); width: auto;
  padding: 11px 19px; font-size: 15px; box-shadow: var(--lift-chip);
}

.drop { /* starts below the hub — starting earlier draws a line through the pill */
  position: absolute; right: calc(6% + 4rem); top: 50%; height: 14%; width: 1.5px;
  background: rgba(28,28,30,.18);
}

.outcome {
  position: absolute; right: 6%; top: 64%; display: grid; gap: 2px; border-radius: 14px;
  background: #fff; padding: 12px 18px; box-shadow: var(--lift-chip); text-align: left;
}
.outcome-title { font-size: 14px; font-weight: 580; color: #1c1c1e; letter-spacing: -.008em; }
.outcome-sub { font-size: 13px; color: #8a8478; }
```

**What goes wrong:** letting node widths vary with logo width makes every
stub end at a different x-position, which is the tell that this is CSS
positioning and not a real diagram — force a fixed `.node` width and
`object-fit: contain` on the marks instead.

---

## 5. Compact regulator logo grid

A simpler 3-column grid of logo tiles — used where the point is "many
regulators," without the full node-and-rail choreography above.

```html
<div class="regulator-grid" aria-hidden="true">
  <img src="assets/regulators/scfhs.png" alt="" />
  <img src="assets/regulators/dha.png" alt="" />
  <img src="assets/regulators/gmc.png" alt="" />
  <img src="assets/regulators/dataflow.png" alt="" />
  <img src="assets/regulators/sanidad.png" alt="" />
  <img src="assets/regulators/mofa.png" alt="" />
</div>
```

```css
.regulator-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 84%;
}
.regulator-grid img {
  width: 100%;
  height: 52px;
  object-fit: contain;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #dcd8ce;
  padding: 10px;
}
```

**Note on the logo assets themselves:** the source SVGs painted an
*opaque white* background rather than true alpha transparency, so trimming
whitespace by alpha channel returns the full untrimmed canvas for every
logo. Trim against a white reference color instead.

---

## 6. Cost-down / throughput-up chart (SVG line chart)

Two crossing lines on a dark card: cost trending down, files-processed
trending up — a "before/after" line chart, not a real data plot.

```html
<figure class="plate plate--dark">
  <div class="gfx gfx--cost" aria-hidden="true">
    <svg class="cost" viewBox="0 0 400 240">
      <defs>
        <linearGradient id="costfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity="1" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <g class="cost-grid">
        <line x1="26" y1="60" x2="374" y2="60" />
        <line x1="26" y1="120" x2="374" y2="120" />
        <line x1="26" y1="180" x2="374" y2="180" />
      </g>
      <path class="cost-fill" d="M30,62 C110,70 150,120 200,142 C255,166 300,182 370,190 L370,214 L30,214 Z" />
      <path class="cost-line" d="M30,62 C110,70 150,120 200,142 C255,166 300,182 370,190" />
      <path class="cost-line cost-line--up" d="M30,196 C110,190 150,150 200,126 C255,100 300,74 370,58" />
      <circle class="cost-dot" cx="370" cy="190" r="4.5" />
      <circle class="cost-dot cost-dot--up" cx="370" cy="58" r="4.5" />
      <text class="cost-tag cost-tag--up" x="356" y="40">+ Files processed</text>
      <text class="cost-tag" x="356" y="215">− Cost per hire</text>
    </svg>
    <span class="grain"></span>
  </div>
</figure>
```

```css
.gfx--cost { overflow: hidden; padding: 6%; }
.cost { width: 100%; height: auto; }
.cost-grid line { stroke: rgba(255,255,255,.07); stroke-width: 1; }
.cost-line { fill: none; stroke: #fff; stroke-width: 2.6; stroke-linecap: round; }
.cost-line--up { stroke: rgba(255,255,255,.34); stroke-width: 2; stroke-dasharray: 5 6; } /* dashed: the counterpoint line, not the subject */
.cost-fill { fill: url(#costfade); opacity: .16; }
.cost-dot { fill: #fff; }
.cost-dot--up { fill: rgba(255,255,255,.45); }
.cost-tag { font-family: "Inter var", Inter, sans-serif; font-size: 15px; font-weight: 560; fill: #fff; text-anchor: end; }
.cost-tag--up { fill: rgba(255,255,255,.5); }
```

---

## 7. Glowing bar comparison (dark)

Two vertical bars — one "lit" (the good number), one dim (the baseline) —
for a single head-to-head stat.

```html
<figure class="plate plate--c">
  <div class="gfx gfx--bars" aria-hidden="true">
    <div class="bar-col">
      <span class="bar-label"><b class="tabular">94%</b> Booka</span>
      <span class="bar bar--hi"></span>
    </div>
    <div class="bar-col">
      <span class="bar-label bar-label--low"><b class="tabular">60%</b> Industry standard</span>
      <span class="bar bar--lo"></span>
    </div>
    <span class="grain"></span>
  </div>
</figure>
```

```css
.gfx--bars { display: flex; align-items: flex-end; justify-content: center; gap: 12%; padding: 12% 12% 14%; overflow: hidden; }
.bar-col { position: relative; width: 26%; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 12px; }
.bar-label { font-size: 13px; line-height: 1.35; color: #a5a5b2; text-align: center; }
.bar-label b { display: block; font-size: 17px; font-weight: 600; color: #fff; }
.bar-label--low b { color: #a5a5b2; }
.bar { width: 100%; border-radius: 16px; }
.bar--hi {
  height: 78%;
  background: linear-gradient(180deg, #fff 0%, #f4f4ec 100%);
  filter: blur(9px);
  box-shadow: 0 0 60px rgba(255,255,255,.5), 0 0 120px rgba(255,255,255,.3);
}
.bar--lo {
  height: 9%;
  border-radius: 999px;
  background: linear-gradient(180deg, #66667e 0%, #45455a 100%);
  filter: blur(5px);
}
```

**What makes the "winning" bar read as winning:** the blur + double
box-shadow glow on `.bar--hi`, not its height alone — a flat un-blurred bar
next to a dim one just reads as a bar chart, not a highlight.

---

## 8. Before/after horizontal span comparison

Same idea as §7 but horizontal, for a duration-style stat ("24 months" →
"under 4").

```html
<figure class="plate plate--c">
  <div class="gfx gfx--span" aria-hidden="true">
    <div class="span-row">
      <span class="span-label">Before</span>
      <span class="hbar hbar--long"></span>
      <span class="span-val tabular">24 mo</span>
    </div>
    <div class="span-row">
      <span class="span-label">With the engine</span>
      <span class="hbar hbar--short"></span>
      <span class="span-val span-val--hi tabular">&lt; 4 mo</span>
    </div>
    <span class="grain"></span>
  </div>
</figure>
```

```css
.gfx--span { display: flex; flex-direction: column; align-items: stretch; justify-content: center; gap: 24px; padding: 12% 10%; overflow: hidden; }
.span-row { display: grid; grid-template-columns: 8.5rem 1fr 4.6rem; align-items: center; gap: 16px; }
.span-label { font-size: 13px; color: #a5a5b2; letter-spacing: .04em; text-transform: uppercase; line-height: 1.3; }
.hbar { height: 24px; border-radius: 999px; display: block; }
.hbar--long { width: 100%; background: linear-gradient(90deg, #6d6d85, #45455a); filter: blur(5px); }
.hbar--short {
  width: 17%; min-width: 42px;
  background: linear-gradient(90deg, #fff, #f2f2ea);
  filter: blur(3.5px);
  box-shadow: 0 0 40px rgba(255,255,255,.5), 0 0 90px rgba(255,255,255,.28);
}
.span-val { text-align: right; font-size: 15px; color: #a5a5b2; }
.span-val--hi { color: #fff; font-weight: 600; }
```

**What goes wrong:** the grid column widths (`8.5rem 1fr 4.6rem`) matter —
without a fixed-width label column, a longer label pushes the bar track's
starting point and the two rows stop lining up.

---

## 9. Document-flow pipeline card (pale blue)

Three floating cards connected by an elbow connector, representing a
document moving through stages, plus a "paused/loading" chip.

```html
<figure class="plate plate--blue">
  <div class="gfx gfx--flow" aria-hidden="true">
    <div class="flow-card flow-card--head">
      <span class="flow-title">Document received</span>
      <span class="flow-sub tabular">1,284 in queue</span>
    </div>
    <span class="connector"></span>
    <div class="flow-card flow-card--a">
      <span class="flow-icon"></span>
      <span>
        <span class="flow-title">Verified by the engine</span>
        <span class="flow-sub">Errors flagged before filing</span>
      </span>
    </div>
    <div class="flow-card flow-card--b">
      <span class="flow-icon"></span>
      <span>
        <span class="flow-title">Submitted to SCFHS</span>
        <span class="flow-sub">After every clean file</span>
      </span>
    </div>
    <span class="pause"></span>
  </div>
</figure>
```

```css
.gfx--flow { display: block; }
.flow-card {
  position: absolute; background: #fff; border-radius: 12px; padding: 13px 17px;
  box-shadow: 0 1px 2px rgba(22,24,29,.05), 0 8px 20px rgba(22,24,29,.08);
  display: flex; align-items: center; gap: 12px;
}
.flow-title { display: block; font-size: 14px; font-weight: 580; color: #16181d; letter-spacing: -.008em; }
.flow-sub { display: block; font-size: 13px; color: #6b7280; }
.flow-card--head { left: 0; top: 0; flex-direction: column; align-items: flex-start; gap: 2px; }
.flow-card--a { right: 0; top: 40%; left: 22%; }
.flow-card--b { right: 0; top: 72%; left: 22%; }
.flow-icon { width: 26px; height: 26px; flex: none; border-radius: 8px; background: #1c1c22; position: relative; }
.flow-icon::after {
  content: ""; position: absolute; inset: 0; margin: auto; width: 8px; height: 8px;
  background: #fff; transform: rotate(45deg); border-radius: 1px;
}
.connector {
  position: absolute; left: 9%; top: 30%; width: 13%; height: 52%;
  border-left: 1.5px solid rgba(22,24,29,.3); border-bottom: 1.5px solid rgba(22,24,29,.3);
  border-bottom-left-radius: 12px;
}
.flow-card--a::before {
  content: ""; position: absolute; right: 100%; top: 50%; width: 2.4rem; height: 1.5px;
  background: rgba(22,24,29,.3);
}
.pause {
  position: absolute; left: -4%; bottom: 6%; width: 44px; height: 44px; border-radius: 50%;
  background: rgba(255,255,255,.62); backdrop-filter: blur(8px); border: 1px solid rgba(22,24,29,.12);
}
.pause::before, .pause::after {
  content: ""; position: absolute; top: 34%; width: 3px; height: 32%; border-radius: 2px; background: #16181d;
}
.pause::before { left: 39%; }
.pause::after { right: 39%; }
```

---

## 10. "24 → 4" collapse card (pale blue)

A single stat card showing a struck-through old value collapsing into a
new one, with a progress meter and a floating "measured across N" chip.

```html
<figure class="plate plate--blue">
  <div class="gfx gfx--collapse" aria-hidden="true">
    <div class="collapse-card">
      <span class="flow-sub">Time to productivity</span>
      <div class="collapse-row">
        <span class="was tabular">24 months</span>
        <svg class="arr" viewBox="0 0 24 24"><path d="M4 12h14m0 0l-5-5m5 5l-5 5" /></svg>
        <span class="now tabular">under 4</span>
      </div>
      <span class="meter"><span class="meter-fill"></span></span>
    </div>
    <div class="collapse-chip tabular">2,500+ files measured</div>
  </div>
</figure>
```

```css
.gfx--collapse { display: block; }
.collapse-card {
  position: absolute; left: 0; top: 14%; right: 14%; background: #fff; border-radius: 12px; padding: 18px 20px;
  box-shadow: 0 1px 2px rgba(22,24,29,.05), 0 10px 26px rgba(22,24,29,.09);
}
.collapse-row { display: flex; align-items: baseline; gap: 12px; margin: 6px 0 14px; }
.was { font-size: 19px; color: #9aa1a8; text-decoration: line-through; text-decoration-thickness: 1.5px; }
.now { font-size: 28px; font-weight: 600; color: #16181d; letter-spacing: -.02em; }
.arr { width: 20px; height: 20px; fill: none; stroke: #9aa1a8; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; align-self: center; }
.meter { display: block; height: 7px; border-radius: 999px; background: #e7eef2; overflow: hidden; }
.meter-fill { display: block; width: 15%; height: 100%; border-radius: 999px; background: #5266eb; } /* --accent */
.collapse-chip {
  position: absolute; right: 0; bottom: 12%; background: rgba(255,255,255,.82);
  backdrop-filter: blur(14px) saturate(150%); border-radius: 999px; padding: 9px 16px;
  font-size: 14px; font-weight: 520; color: #16181d;
  box-shadow: 0 1px 2px rgba(22,24,29,.06), 0 10px 24px rgba(22,24,29,.1);
}
```

---

## 11. Rings + lock (trust / security)

Three nested translucent spheres with a lit top rim, centered on a lock
icon — used for anything about trust, encryption, or being sealed/secure.

```html
<figure class="plate plate--c">
  <div class="gfx gfx--rings" aria-hidden="true">
    <span class="ring ring--3"></span>
    <span class="ring ring--2"></span>
    <span class="ring ring--1"></span>
    <svg class="lock" viewBox="0 0 24 24">
      <path d="M7 10V8a5 5 0 0110 0v2" fill="none" stroke="currentColor" stroke-width="2" />
      <rect x="4.5" y="10" width="15" height="10" rx="2.5" />
    </svg>
    <span class="grain"></span>
  </div>
</figure>
```

```css
.gfx--rings { overflow: hidden; }
.ring {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
  border-radius: 50%; border: 1px solid rgba(255,255,255,.1);
  background: radial-gradient(circle at 50% 0%, rgba(255,255,255,.14) 0%, rgba(255,255,255,.03) 32%, rgba(10,10,16,.22) 66%);
  box-shadow: inset 0 3px 14px rgba(255,255,255,.1), 0 12px 32px rgba(0,0,0,.36);
  filter: blur(1.5px);
}
.ring--1 { width: 34%; aspect-ratio: 1; }
.ring--2 { width: 58%; aspect-ratio: 1; opacity: .8; }
.ring--3 { width: 84%; aspect-ratio: 1; opacity: .6; }
.lock {
  position: relative; z-index: 4; width: 13%; color: #fff; fill: #fff;
  filter: drop-shadow(0 0 22px rgba(255,255,255,.5));
}
```

Swap the inner `<svg class="lock">` for any single-glyph icon (shield,
check, fingerprint) to reuse the same "sealed sphere" treatment for a
different trust claim.

---

## 12. Encryption mesh (dark)

A conic-gradient "sphere lit from one side" with a bright core — used
specifically for the encryption/security claim, distinct from the
lock-in-rings pattern above.

```html
<figure class="plate plate--c">
  <div class="gfx gfx--shield" aria-hidden="true">
    <span class="mesh"></span>
    <span class="mesh mesh--2"></span>
    <span class="shield-core"></span>
    <span class="grain"></span>
  </div>
</figure>
```

```css
.gfx--shield { overflow: hidden; }
.mesh {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
  width: 72%; aspect-ratio: 1; border-radius: 50%; border: 1px solid rgba(255,255,255,.09);
  background:
    conic-gradient(from 208deg, rgba(255,255,255,.2), rgba(255,255,255,.01) 34%, rgba(255,255,255,.14) 60%, rgba(255,255,255,0) 86%),
    radial-gradient(circle at 50% 100%, rgba(10,10,16,.3), transparent 62%);
  box-shadow: 0 16px 40px rgba(0,0,0,.34);
  filter: blur(6px);
}
.mesh--2 { width: 42%; transform: translate(-50%,-50%) rotate(146deg); opacity: .9; filter: blur(4px); }
.shield-core {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
  width: 14%; aspect-ratio: 1; border-radius: 50%;
  background: radial-gradient(circle at 38% 30%, #fff, #dcdcd2 76%);
  filter: blur(3px);
  box-shadow: 0 0 34px rgba(255,255,255,.34);
}
```

**Why not just one `.mesh`:** a single conic gradient with a bright core
reads as a blown-out blob, not a lit sphere — the second, smaller, rotated
`.mesh--2` is what gives it a form instead of a glow.

---

## 13. Permission toggles (dark)

Three rows of on/off switches, one lit — used for "you're in control /
granular permissions" claims.

```html
<figure class="plate plate--c">
  <div class="gfx gfx--toggles" aria-hidden="true">
    <span class="tgl-row"><span class="knob knob--sm"></span><span class="tgl"></span></span>
    <span class="tgl-row"><span class="knob knob--sm"></span><span class="tgl"></span></span>
    <span class="tgl-row"><span class="tgl tgl--on"><span class="knob"></span></span></span>
    <span class="grain"></span>
  </div>
</figure>
```

```css
.gfx--toggles { display: flex; flex-direction: column; align-items: stretch; justify-content: center; gap: 11%; padding: 16% 13%; overflow: hidden; }
.tgl-row { display: flex; align-items: center; gap: 12px; }
.tgl {
  flex: 1; height: 30px; border-radius: 999px;
  background: linear-gradient(180deg, #55556a 0%, #3a3a4a 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.12), 0 10px 22px rgba(0,0,0,.4);
  filter: blur(1.4px);
  display: flex; align-items: center; justify-content: flex-end;
}
.tgl--on {
  background: linear-gradient(180deg, #fdfdf8 0%, #e6e6dc 100%);
  box-shadow: 0 0 46px rgba(255,255,255,.4), 0 12px 26px rgba(0,0,0,.4);
  height: 38px; padding: 3px;
}
.knob {
  width: 32px; height: 32px; border-radius: 50%; flex: none;
  background: radial-gradient(circle at 34% 28%, #fff, #c9c9bf 78%);
  box-shadow: 0 3px 8px rgba(0,0,0,.26);
}
.knob--sm {
  width: 26px; height: 26px;
  background: radial-gradient(circle at 34% 28%, #7f7f92, #43434f 76%);
  filter: blur(1.2px); box-shadow: none;
}
```

---

## 14. Origin markets → engine → outcome pipeline (with real flag SVGs)

A three-stage horizontal diagram: a grid of country flags, an arrow into a
"document stack" icon with a seal, another arrow into an outcome
paragraph. Every flag is a hand-built inline SVG (no image assets, no
emoji flags — emoji flags don't render consistently across platforms).

```html
<figure class="plate plate--wide">
  <span class="wash" aria-hidden="true"></span>
  <div class="pipeline">
    <div class="pipe-stage">
      <p class="pipe-label">Origin markets</p>
      <div class="flags">
        <span class="flag">
          <svg viewBox="0 0 30 20" role="img" aria-label="Saudi Arabia">
            <rect width="30" height="20" fill="#165d31"/>
            <rect x="6" y="6.4" width="18" height="2.2" rx="1.1" fill="#fff"/>
            <rect x="6" y="12.4" width="18" height="1.3" rx=".65" fill="#fff"/>
          </svg>
        </span>
        <!-- repeat .flag for each country — see index.html:644-669 for the
             full set (US, Australia, UK, France, Spain, Colombia, Qatar, Oman) -->
      </div>
    </div>

    <span class="pipe-flow" aria-hidden="true"></span>

    <div class="pipe-stage pipe-stage--core">
      <p class="pipe-label">One engine</p>
      <div class="docs" aria-hidden="true">
        <span class="doc doc--3"></span>
        <span class="doc doc--2"></span>
        <span class="doc doc--1"><i></i><i></i><i></i></span>
        <span class="doc-seal">
          <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </span>
      </div>
      <p class="pipe-note">Credentials, translations, apostilles, filings</p>
    </div>

    <span class="pipe-flow" aria-hidden="true"></span>

    <div class="pipe-stage pipe-stage--out">
      <p class="pipe-label">Outcome</p>
      <p class="pipe-out-title">Every profession,<br />every destination</p>
      <p class="pipe-out-sub">In weeks instead of years, at a fraction of the cost</p>
    </div>
  </div>
</figure>
```

```css
.plate--wide { aspect-ratio: 3.8; padding: 0; margin-top: 24px; }
.pipeline {
  position: relative; z-index: 1; width: 100%; height: 100%;
  display: grid; grid-template-columns: auto 1fr auto 1fr auto;
  align-items: stretch; gap: 16px; padding: 4.5% 6%;
}
.pipe-stage { display: grid; align-content: start; justify-items: start; gap: 12px; }
.pipe-stage--core { justify-items: center; text-align: center; }
.pipe-stage--out { justify-items: start; max-width: 30ch; }
.pipe-label { margin: 0; font-size: 13px; letter-spacing: .09em; text-transform: uppercase; color: #8a8478; font-weight: 500; }

.flags { display: grid; grid-template-columns: repeat(3, auto); gap: 9px; }
.flag svg { display: block; width: 34px; height: auto; border-radius: 3px; box-shadow: 0 0 0 1px rgba(28,28,30,.08), 0 2px 5px rgba(28,28,30,.1); }

.docs { position: relative; width: 96px; height: 108px; }
.doc { position: absolute; inset: 0; background: #fff; border: 1px solid #dcd8ce; border-radius: 8px; box-shadow: 0 6px 16px rgba(28,28,30,.07); }
.doc--3 { transform: rotate(-7deg) translate(-7px,4px); opacity: .55; }
.doc--2 { transform: rotate(4deg) translate(6px,2px); opacity: .8; }
.doc--1 { display: grid; align-content: start; gap: 7px; padding: 16px 13px; }
.doc--1 i { height: 4px; border-radius: 2px; background: #dcd8ce; }
.doc--1 i:nth-child(2) { width: 72%; }
.doc--1 i:nth-child(3) { width: 52%; }
.doc-seal {
  position: absolute; right: -12px; bottom: -10px; width: 34px; height: 34px; border-radius: 50%;
  background: #0b30f2; /* --cta */
  display: grid; place-items: center; box-shadow: 0 6px 16px rgba(11,48,242,.32);
}
.doc-seal svg { width: 18px; height: 18px; fill: none; stroke: #fff; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }

.pipe-note { margin: 0; font-size: 13px; color: #8a8478; max-width: 22ch; }
.pipe-out-title { margin: 0; font-size: 22px; font-weight: 560; letter-spacing: -.018em; line-height: 1.18; color: #1c1c1e; }
.pipe-out-sub { margin: 0; font-size: 15px; color: #55534d; }

.pipe-flow {
  position: relative; align-self: center; height: 1.5px;
  background: linear-gradient(90deg, rgba(28,28,30,.06), rgba(28,28,30,.26));
}
.pipe-flow::after {
  content: ""; position: absolute; right: 0; top: 50%; width: 7px; height: 7px;
  border-top: 1.5px solid rgba(28,28,30,.26); border-right: 1.5px solid rgba(28,28,30,.26);
  transform: translate(0,-50%) rotate(45deg);
}
```

**To adapt:** the flags are all `viewBox="0 0 30 20"` inline SVGs built
from plain rects/paths — copy the pattern rather than embedding raster
flag images, so they stay crisp at any size and never trigger emoji-font
inconsistency across OSes.

---

## 15. Co-brand lockup ("Booka × Your Brand")

An unbacked lockup — no pill, no background box, just a soft white halo —
laid directly over a product screenshot's top edge. This exists because
the client explicitly asked for "sin fondo" (no background) after seeing a
backed version.

```html
<span class="cobrand">
  <img class="cobrand-mark" src="assets/brand/booka-colour.png" alt="Booka" />
  <svg class="cobrand-x" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
  <span class="cobrand-pill">Your brand</span>
</span>
```

```css
.cobrand {
  position: absolute;
  z-index: 5;
  /* Straddles the parent screenshot's top edge, centred on it. Derived, not
     eyeballed: for a plate with 5% top padding at aspect-ratio 1.95, that
     edge sits at 9.75% of the plate's height (5% × 1.95 ≈ 9.75). */
  top: 9.75%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 20px;
  white-space: nowrap;
  filter: drop-shadow(0 0 14px rgba(255,255,255,.95)) drop-shadow(0 0 30px rgba(255,255,255,.75));
}
.cobrand-mark { height: 42px; width: auto; }
.cobrand-x { width: 24px; height: 24px; flex: none; fill: none; stroke: #0b30f2; stroke-width: 3.4; stroke-linecap: round; }
.cobrand-pill {
  padding: 11px 28px; border-radius: 999px;
  background: linear-gradient(100deg, #f3b473 0%, #ef8f66 52%, #ee6f60 100%);
  color: #fff; font-size: 28px; font-weight: 640; letter-spacing: -.014em; line-height: 1.15;
  box-shadow: 0 10px 28px rgba(238,111,96,.3);
}
```

**The math behind the positioning, if you resize the parent plate:**
`top` should equal `plate top-padding % × plate aspect-ratio`. It's a
double-percentage because the padding is a share of the plate's *width*,
but `top` is measured against its *height* — recompute this any time you
change the plate's aspect ratio or padding.

---

## 16. Status badges (Live / Pilot)

A small pill with a colored dot, for marking a feature's rollout stage.

```html
<span class="status status--live">Live</span>
<span class="status status--pilot">Pilot</span>
```

```css
.status {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 560; letter-spacing: .02em;
  padding: 4px 11px; border-radius: 999px;
  background: #eceae4; color: #55534d;
}
.status::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: #8a8478; }

.status--live { background: rgba(52,211,153,.14); color: #1d7a52; }
.status--live::before { background: #34d399; }
.status--pilot { background: rgba(251,191,36,.16); color: #92620c; }
.status--pilot::before { background: #fbbf24; }

/* on dark ground, lighten the text so it doesn't muddy against ink */
.s--c .status--live { background: rgba(52,211,153,.16); color: #6fe6b8; }
.s--c .status--pilot { background: rgba(251,191,36,.18); color: #f4cd6b; }
```

Add more states (`--beta`, `--deprecated`, …) by pairing a background tint
+ text color + dot color, keeping the same 3-part structure.

---

## 17. Metrics band with count-up animation

A full-bleed stat row where each number animates from 0 to its real value
once, the first time it scrolls into view — and settles instantly on the
final number under `prefers-reduced-motion`.

```html
<section class="metrics-band">
  <div class="wrap">
    <h2 class="display">You're not starting a pipeline.</h2>
    <div class="metrics">
      <div>
        <p class="metric-fig tabular" data-count-to="100000" data-suffix="+">0</p>
        <p class="metric-label">Verified professionals already in the network</p>
      </div>
      <div>
        <p class="metric-fig tabular" data-count-to="15" data-suffix="+">0</p>
        <p class="metric-label">Source countries processed</p>
      </div>
      <div>
        <p class="metric-fig" data-static="Weeks">0</p>
        <p class="metric-label">To license, against three years to build internally</p>
      </div>
    </div>
  </div>
</section>
```

```css
.metrics-band { background: #f5f4f1; padding: 64px 0; border-top: 1px solid #dcd8ce; } /* ground A, on purpose — see note below */
.metrics-band .display { color: #1c1c1e; text-align: center; margin-left: auto; margin-right: auto; }
.metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 24px; text-align: center; }
.metric-fig { font-size: 56px; font-weight: 580; letter-spacing: -.03em; color: #1c1c1e; margin: 0 0 6px; }
.metric-label { font-size: 14px; color: #55534d; max-width: 24ch; margin: 0 auto; }
@media (max-width: 760px) { .metrics { grid-template-columns: 1fr; gap: 32px; } }
```

```js
(() => {
  const figs = document.querySelectorAll(".metric-fig[data-count-to]");
  const statics = document.querySelectorAll(".metric-fig[data-static]");
  statics.forEach((el) => (el.textContent = el.dataset.static));
  if (!figs.length) return;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (n) => n.toLocaleString("en-US");

  const run = (el) => {
    const to = Number(el.dataset.countTo);
    const suffix = el.dataset.suffix || "";
    if (reduce) { el.textContent = fmt(to) + suffix; return; }
    const dur = 1400;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = fmt(Math.round(to * eased)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  figs.forEach((el) => io.observe(el));
})();
```

**Why this band is on the light ground, not dark:** it originally sat on
the same dark ground as the section above it — two dark sections back to
back, which breaks the three-ground rhythm (see `BOOKA-VISUAL-SYSTEM.md`
§1). Moving it to the light ground and adding the `border-top` for
separation fixed it. If you reuse this band, check what sits immediately
above it before picking its ground.

---

## 18. Testimonial marquee (infinite auto-scroll)

A horizontally auto-scrolling row of quote cards, seamless-looped by
duplicating the card set once and translating by exactly -50%. Pauses on
hover, and freezes entirely under reduced motion.

```html
<div class="marquee-wrap">
  <div class="marquee-track">
    <article class="t-card">
      <p class="t-quote">"…quote…"</p>
      <div class="t-meta">
        <div class="t-who"><span class="t-name">Name, role</span><span class="t-org">Organisation</span></div>
        <span class="t-badge">Stat</span>
      </div>
    </article>
    <!-- repeat real cards, then duplicate the whole set once more with
         aria-hidden="true" on the duplicates, so the 50%-translate loop
         has no visible seam -->
  </div>
</div>
```

```css
.marquee-wrap {
  overflow: hidden;
  margin-top: 24px;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
.marquee-track { display: flex; gap: 24px; width: max-content; animation: marquee 34s linear infinite; }
.marquee-wrap:hover .marquee-track { animation-play-state: paused; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

.t-card { flex: none; width: 360px; background: #fff; border: 1px solid #dcd8ce; border-radius: 14px; padding: 28px; }
.t-quote { font-size: 17px; color: #1c1c1e; margin: 0 0 16px; line-height: 1.5; }
.t-meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.t-who { display: grid; }
.t-name { font-size: 15px; font-weight: 560; color: #1c1c1e; }
.t-org { font-size: 13px; color: #8a8478; }
.t-badge {
  flex: none; font-size: 13px; font-weight: 560; color: #5266eb;
  background: rgba(82,102,235,.1); border-radius: 999px; padding: 5px 11px; white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }
```

**The edge-fade mask** (`mask-image`/`-webkit-mask-image`) is what makes
cards fade in/out at the row's edges instead of hard-clipping — don't skip
it, a hard `overflow: hidden` clip alone looks unfinished.

**On content, briefly, since it's adjacent:** a quote with a name and
organization is a factual claim about a real person — never fill this
pattern with an invented name/quote. Ship it with an explicit placeholder
label until real testimonials exist, exactly as done here.

---

## 19. Numbered roadmap timeline

A vertical numbered list with a connecting spine — used for "here's what
happens, step by step" explanations (e.g. how an agent processes a file).

```html
<ol class="timeline">
  <li class="step">
    <span class="step-num tabular">1</span>
    <h4>Document received</h4>
    <p>A passport, degree, transcript, or licence is uploaded.</p>
  </li>
  <!-- more .step items -->
</ol>
```

```css
.timeline {
  position: relative; display: grid; gap: 24px; margin-top: 24px;
  padding-left: 56px;
  list-style: none; /* <ol> needs this explicitly — a global `ul{list-style:none}`
                        reset does NOT cover <ol>, and native "1." markers will
                        double up with .step-num otherwise */
}
.timeline::before {
  content: ""; position: absolute; left: 19px; top: 8px; bottom: 8px; width: 1.5px;
  background: #dcd8ce;
}
.step { position: relative; }
.step-num {
  position: absolute; left: -56px; top: 0; width: 40px; height: 40px; border-radius: 50%;
  background: #fff; border: 1.5px solid #dcd8ce;
  display: grid; place-items: center; font-size: 15px; font-weight: 580; color: #1c1c1e;
}
.step h4 { margin: 4px 0 4px; font-size: 19px; font-weight: 580; color: #1c1c1e; }
.step p { margin: 0; font-size: 15px; color: #55534d; max-width: 52ch; }

/* on a dark section, invert the number badge to match */
.s--c .step-num { background: #2b2b39; border-color: rgba(255,255,255,.14); color: #fff; }
```

---

## 20. Unused-but-documented ambient patterns: orbs & arcs

Two dark ambient-light graphics exist in the stylesheet but aren't
currently placed on either page — worth keeping since they're ready-made
alternatives to the rings/mesh patterns above (§11–12) if you need a third
distinct "abstract dark card" treatment.

```css
/* Two soft overlapping ellipses of light, screen-blended */
.gfx--orbs { overflow: hidden; }
.orb {
  position: absolute; border-radius: 50%;
  background: radial-gradient(circle at 50% 44%, rgba(255,255,255,.3) 0%, rgba(255,255,255,.19) 44%, rgba(255,255,255,.07) 62%, rgba(255,255,255,0) 71%);
  filter: blur(6px);
  mix-blend-mode: screen;
}
.orb--1 { width: 54%; aspect-ratio: 1.3; left: 4%; top: 14%; }
.orb--2 { width: 54%; aspect-ratio: 1.3; right: 4%; top: 14%; }
.orb--3 { width: 34%; aspect-ratio: 1.2; left: 33%; top: 20%; opacity: .5; }

/* Concentric rising arcs with a lit core at the base — a "launch/liftoff" feel */
.gfx--arcs { overflow: hidden; }
.arc {
  position: absolute; left: 50%; bottom: -34%; transform: translateX(-50%); border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,.11);
  background: radial-gradient(circle at 50% 10%, rgba(255,255,255,.15) 0%, rgba(255,255,255,.02) 40%, rgba(255,255,255,0) 58%);
  box-shadow: inset 0 2px 0 rgba(255,255,255,.1);
  filter: blur(3px);
}
.arc--1 { width: 46%; aspect-ratio: 1; }
.arc--2 { width: 74%; aspect-ratio: 1; opacity: .7; }
.arc--3 { width: 104%; aspect-ratio: 1; opacity: .45; }
.arc-core {
  position: absolute; left: 50%; bottom: 8%; transform: translateX(-50%); width: 26%; aspect-ratio: 1.7; border-radius: 50%;
  background: radial-gradient(ellipse at 50% 50%, rgba(255,255,255,.5), rgba(255,255,255,0) 68%);
  filter: blur(16px);
}
```

---

## A note on why every graphic here is drawn, not faked

None of these mockups pretend to be something they're not: the credential
card is explicitly a sample, the flags are drawn SVGs (not claiming to be
official state emblems), the world map is real geographic data (not an
invented shape), and the globe's cities/routes are the actual markets named
in the surrounding copy. Where a graphic *could* have been a fabricated
product screenshot instead — e.g. a fake "dashboard" mockup — an abstract
render was used instead, on the rule that a screenshot of a product feature
that doesn't exist yet is a misleading claim, while an abstract diagram of
the same concept is not. Keep that distinction when adapting this library
to a different product: draw the concept, don't fake the UI.
