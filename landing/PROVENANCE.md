# Where the Mercury tokens came from

## What was attempted

Direct extraction from `https://mercury.com/` — HTML, stylesheets, font files,
and the image assets used in the "Get started fast" / "never stop moving"
sections.

## What happened

Blocked. This session's outbound HTTPS goes through a policy-enforcing egress
proxy, and it refuses the connection before any request reaches Mercury:

```
$ curl https://mercury.com/
curl: (56) CONNECT tunnel failed, response 403

proxy status → recentRelayFailures:
  kind:   connect_rejected
  detail: gateway answered 403 to CONNECT (policy denial or upstream failure)
  host:   mercury.com:443
```

This is not specific to Mercury — `https://example.com` returns the same 403,
so the environment's network policy allows only an allowlist (package
registries, GitHub, Anthropic). `WebFetch` against mercury.com returns 403 for
the same reason. Per the proxy's own guidance, a policy denial is reported
rather than routed around.

Reachable from here: `api.github.com`, `raw.githubusercontent.com`, package
registries, and web *search* (which runs server-side, so it returns
descriptions of pages but not their source).

## What the tokens are actually based on

Two things, neither of which is Mercury's stylesheet:

1. **A published design specification** of Mercury's system, fetched from
   GitHub — `rohitg00/awesome-claude-design`, `design-md/warm/mercury.md`. This
   is the source of the cream/indigo palette, the type scale, the pill button
   geometry, the 1080px marketing measure, and the flat-dashboard rule. Saved
   verbatim alongside this file as `reference/mercury-design-md.md`.
2. **Search-returned descriptions** of Mercury's design from several
   design-writing sources. These supplied the `#5266eb` indigo, the decorative
   blues `#9cb4e8` / `#cdddff`, the intermediate display weight of 480, the
   Arcadia / Arcadia Display family names, and the gradient-overlay technique.

## Consequences to be aware of

- **The values are second-hand.** They are internally consistent and they
  describe Mercury accurately in prose, but no number here was read off
  Mercury's CSS. Treat them as a starting point to reconcile against
  screenshots, not as ground truth.
- **The sources disagree about light vs dark.** The design spec describes a
  cream canvas with indigo action; other sources describe a near-black
  cinematic canvas (`#171721`, surfaces at `rgb(25,25,32)`). Both are probably
  right about different parts of the site — Mercury's marketing pages are
  light, and some campaign and product-photography sections are dark. The
  screenshots will settle which treatment the target sections use.
- **The spec's depth rule contradicts the brief.** It says flat, no card
  shadows, no glass. That rule is about Mercury's *dashboard*; the marketing
  showcase sections plainly do use lift, layering, and blur — which is what the
  brief asks for. `DESIGN.md` §6 splits the two rather than picking one.
- **Arcadia is proprietary.** It cannot be licensed or self-hosted for this
  project. The substitute stack in `DESIGN.md` §3 is the closest available
  approximation and is the one visual dimension that will not match Mercury
  exactly.
- **No image assets were obtained.** The wash colours, crop geometry, and
  overlap offsets of the showcase graphics are reconstructed from written
  description. These specifically need the screenshots.

## To resolve

Screenshots of the Mercury homepage — particularly full-width captures of the
"Get started fast" and "never stop moving" sections — let every item above be
corrected by direct observation. Alternatively, allowlisting `mercury.com` in
the environment's network policy would permit real extraction.
