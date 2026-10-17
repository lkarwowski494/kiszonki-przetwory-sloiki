#!/usr/bin/env bash
# ============================================================================
# Apps4Brew / Słoik — Gitleaks Range Runner (NFR-SEC-005, RYZ-31)
# Flaga -m gwarantuje skanowanie commitów scalających (merge commits).
# ============================================================================
set -euo pipefail

BASE_REF="${1:-origin/master}"
HEAD_REF="${2:-HEAD}"

echo "[gitleaks] Skanowanie zakresu: ${BASE_REF}...${HEAD_REF} (z flagą -m dla merge commitów)"

if ! command -v gitleaks &> /dev/null; then
  echo "[gitleaks] Gitleaks nie jest zainstalowany globalnie. Pomijanie na lokalnym środowisku bez binarki."
  exit 0
fi

gitleaks detect --verbose --config .gitleaks.toml --log-opts="-m ${BASE_REF}...${HEAD_REF}"
echo "[gitleaks] Skanowanie zakończone sukcesem: brak sekretów."
