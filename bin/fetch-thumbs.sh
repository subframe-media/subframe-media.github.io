#!/usr/bin/env bash
# fetch-thumbs.sh — download a poster image for every Vimeo id in _data/videos.yml.
# Run locally whenever videos.yml changes. Not invoked by GitHub Pages.
#
# Output: assets/img/thumbs/{id}.jpg
#
# Strategy: prefer Vimeo's oEmbed endpoint (returns the canonical thumbnail_url
# at a chosen width). Fall back to the legacy /api/v2 endpoint if oEmbed fails.

set -euo pipefail

cd "$(dirname "$0")/.."

VIDEOS_FILE="_data/videos.yml"
OUT_DIR="assets/img/thumbs"
WIDTH=1280

mkdir -p "$OUT_DIR"

if [[ ! -f "$VIDEOS_FILE" ]]; then
  echo "error: $VIDEOS_FILE not found" >&2
  exit 1
fi

# extract every `id: "..."` value from the YAML
ids=$(grep -E '^[[:space:]]*-?[[:space:]]*id:[[:space:]]*"[0-9]+"' "$VIDEOS_FILE" \
  | sed -E 's/.*"([0-9]+)".*/\1/')

count=0
for id in $ids; do
  out="$OUT_DIR/$id.jpg"
  if [[ -f "$out" ]]; then
    echo "skip   $id (already cached at $out)"
    continue
  fi

  oembed_url="https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/${id}&width=${WIDTH}"
  thumb=$(curl -sSL "$oembed_url" | sed -nE 's/.*"thumbnail_url":"([^"]+)".*/\1/p' | sed 's/\\\//\//g')

  if [[ -z "$thumb" ]]; then
    legacy=$(curl -sSL "https://vimeo.com/api/v2/video/${id}.json")
    thumb=$(printf '%s' "$legacy" | sed -nE 's/.*"thumbnail_large":"([^"]+)".*/\1/p' | sed 's/\\\//\//g')
  fi

  if [[ -z "$thumb" ]]; then
    echo "warn   $id — no thumbnail returned" >&2
    continue
  fi

  curl -sSL -o "$out" "$thumb"
  echo "fetch  $id -> $out"
  count=$((count + 1))
done

echo
echo "done: $count new thumbnail(s) downloaded into $OUT_DIR"
