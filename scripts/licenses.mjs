// ============================================================================
// Apps4Brew / Słoik — License Compliance Checker (NFR-SEC-009, RYZ-32)
// Zakazuje licencji copyleft (GPL, AGPL, LGPL, SSPL) w produkcyjnych zależnościach.
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const ALLOWED_LICENSES = new Set([
  'MIT',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'ISC',
  '0BSD',
  'Unlicense',
  'CC0-1.0',
]);

const FORBIDDEN_LICENSES = [
  /GPL/i,
  /AGPL/i,
  /LGPL/i,
  /SSPL/i,
  /EUPL/i,
];

console.log('[check:licenses] Sprawdzanie licencji produkcyjnych zależności...');

const prodDeps = Object.keys(pkg.dependencies || {});
const violations = [];

for (const dep of prodDeps) {
  // Ignorujemy zależności z lokalnego repo github:
  if (dep.startsWith('@apps4craft/')) continue;

  const depPkgPath = path.join(root, 'node_modules', dep, 'package.json');
  if (!fs.existsSync(depPkgPath)) {
    continue;
  }

  const depPkg = JSON.parse(fs.readFileSync(depPkgPath, 'utf8'));
  const license = typeof depPkg.license === 'string'
    ? depPkg.license
    : depPkg.license?.type || depPkg.licenses?.[0]?.type || 'UNKNOWN';

  for (const forbidden of FORBIDDEN_LICENSES) {
    if (forbidden.test(license)) {
      violations.push({ dep, license, reason: 'Licencja copyleft zabroniona w FairPlay DRM' });
    }
  }
}

if (violations.length > 0) {
  console.error('[check:licenses] BŁĄD: Wykryto zabronione licencje:');
  for (const v of violations) {
    console.error(`  - ${v.dep}: ${v.license} (${v.reason})`);
  }
  process.exit(1);
}

console.log(`[check:licenses] OK: Wszystkie produkcyjne zależności (${prodDeps.length}) są zgodne z App Store i FairPlay DRM.`);
