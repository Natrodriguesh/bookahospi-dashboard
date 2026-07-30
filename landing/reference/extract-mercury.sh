#!/usr/bin/env bash
# Extract the real design tokens from mercury.com's stylesheets.
#
# This could not be run from the session that built the landing page: the
# environment's egress proxy answers 403 to CONNECT for mercury.com (and for
# every other non-allowlisted host). Run it anywhere with open outbound HTTPS,
# or after allowlisting mercury.com in the environment's network policy, then
# reconcile landing/tokens.css against out/*.txt.
#
# Usage: ./extract-mercury.sh [outdir]

set -euo pipefail

OUT="${1:-out}"
mkdir -p "$OUT"
cd "$OUT"

UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

echo "→ homepage"
curl -sSL --compressed -A "$UA" https://mercury.com/ -o merc.html

echo "→ stylesheets"
: > merc.css
# Next.js serves them under hashed names, e.g. /_next/static/css/<hash>.css
grep -oE 'href="[^"]*\.css"' merc.html |
  sed -E 's/^href="//; s/"$//' |
  sort -u |
  while read -r href; do
    case "$href" in
      http*) url="$href" ;;
      /*) url="https://mercury.com$href" ;;
      *) url="https://mercury.com/$href" ;;
    esac
    echo "   $url"
    curl -sSL --compressed -A "$UA" "$url" >> merc.css
    printf '\n' >> merc.css
  done
echo "   $(wc -c < merc.css) bytes of CSS"

# Grep for what matters instead of reading the whole bundle.
echo "→ colour custom properties"
grep -oE '\-\-color-[a-z]+-[a-z0-9-]*: *#[0-9a-f]{3,8}' merc.css |
  sort -u > colors.txt

echo "→ every hex used, by frequency"
grep -oE '#[0-9a-fA-F]{6}\b' merc.css |
  tr 'A-F' 'a-f' | sort | uniq -c | sort -rn > colors-by-use.txt

echo "→ easing curves (real, not approximated)"
grep -oE 'cubic-bezier\([^)]*\)' merc.css |
  sort | uniq -c | sort -rn > easings.txt

echo "→ font stacks"
grep -oE 'font-family:[^;}]{0,120}' merc.css | sort -u > fonts.txt

echo "→ corner radii"
grep -oE '\-\-radius[a-z0-9-]*: *[^;}]{0,24}' merc.css | sort -u > radii.txt

echo "→ shadows (the depth system)"
grep -oE 'box-shadow: *[^;}]{0,180}' merc.css | sort -u > shadows.txt

echo "→ blurs"
grep -oE '(backdrop-)?filter: *[^;}]{0,90}blur\([^)]*\)[^;}]{0,60}' merc.css |
  sort -u > blurs.txt

echo "→ font files"
grep -oE 'url\([^)]*\.woff2?[^)]*\)' merc.css |
  sed -E 's/^url\(//; s/\)$//; s/^["'"'"']//; s/["'"'"']$//' |
  sort -u > fontfiles.txt

wc -l ./*.txt
echo
echo "Done. Reconcile landing/tokens.css against $OUT/*.txt."
echo "Note: Arcadia / Arcadia Display are proprietary — fontfiles.txt tells you"
echo "which faces the site loads, not files you may redistribute."
