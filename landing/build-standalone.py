#!/usr/bin/env python3
"""Bundle the landing page into one self-contained HTML file.

Inlines the stylesheets, the Inter face, and every screenshot as data URIs so
the page renders with no outbound requests — required for publishing it
somewhere with a strict content-security policy.

Usage: python3 build-standalone.py [outfile]
"""

import base64
import io
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "standalone.html")


def read(*parts):
    with open(os.path.join(HERE, *parts), encoding="utf-8") as f:
        return f.read()


def b64(path):
    with open(os.path.join(HERE, path), "rb") as f:
        return base64.b64encode(f.read()).decode("ascii")


def jpeg_data_uri(path, quality=82):
    """Screenshots are shown blurred, so JPEG costs nothing visually and cuts
    the payload roughly fourfold against PNG."""
    from PIL import Image

    im = Image.open(os.path.join(HERE, path)).convert("RGB")
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=quality, optimize=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


css = read("tokens.css") + "\n" + read("styles.css")

# The latin subset covers this page's copy, accents included, so the larger
# latin-ext face is dropped rather than bundled unused.
css = re.sub(
    r"@font-face\s*\{[^}]*inter-latin-ext-opsz-normal\.woff2[^}]*\}\s*",
    "",
    css,
    flags=re.S,
)
font = b64("assets/fonts/inter-latin-opsz-normal.woff2")
css = css.replace(
    'url("assets/fonts/inter-latin-opsz-normal.woff2")',
    f'url("data:font/woff2;base64,{font}")',
)
if "assets/fonts" in css:
    sys.exit("a font reference was left unresolved")

html = read("index.html")

# Body content only: the host page supplies the document skeleton.
body = re.search(r"<body[^>]*>(.*)</body>", html, re.S)
if not body:
    sys.exit("could not locate <body>")
body = body.group(1)

for src in sorted(set(re.findall(r'src="(assets/[^"]+)"', body))):
    body = body.replace(f'src="{src}"', f'src="{jpeg_data_uri(src)}"')
if "assets/" in body:
    sys.exit("an asset reference was left unresolved")

title = re.search(r"<title>(.*?)</title>", html, re.S).group(1).strip()

# The page is a deliberate single visual world that alternates its own light
# and dark sections, so it opts out of the viewer's theme rather than
# inverting; the explicit ground stops a dark host theme bleeding through.
page = f"""<title>{title}</title>
<style>
:root {{ color-scheme: light; }}
html, body {{ background: var(--a-bg); color: var(--a-body); }}
{css}
</style>
{body}"""

with open(OUT, "w", encoding="utf-8") as f:
    f.write(page)

print(f"{OUT}  {len(page) / 1024:.0f} KB")
