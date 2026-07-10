#!/usr/bin/env bash
# hertz PR Hub — restore real TypeScript extensions.
# Source files ship as *.tsx.txt / *.ts.txt; this strips the trailing .txt.
# Run once from the package root after unzipping:  bash restore-extensions.sh
set -euo pipefail
cd "$(dirname "$0")"
found=0
while IFS= read -r -d '' f; do
  mv "$f" "${f%.txt}"
  echo "→ ${f%.txt}"
  found=$((found+1))
done < <(find . \( -name '*.tsx.txt' -o -name '*.ts.txt' \) -print0)
echo "Done. Restored $found file(s)."
