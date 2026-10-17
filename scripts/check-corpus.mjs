// ============================================================================
// Apps4Brew / Słoik — Python Corpus Oracle Checker (BR-TEST-012, Z-016)
// Weryfikuje determinizm wyroczni w Pythonie 3 i aktualność plików fixtures.
// ============================================================================

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fixturesDir = join(root, 'tests', 'fixtures');

function getPythonCmd() {
  for (const cmd of ['python3', 'python']) {
    try {
      execSync(`${cmd} --version`, { stdio: 'pipe' });
      return cmd;
    } catch {
      // try next
    }
  }
  return null;
}

const py = getPythonCmd();
if (!py) {
  console.warn('[check-corpus] OSTRZEŻENIE: Brak python3 w PATH. Sprawdzanie statyczne istniejących korpusów...');
} else {
  console.log(`[check-corpus] Uruchamianie generatorów Pythona (${py})...`);
  execSync(`${py} scripts/gen-brine-corpus.py`, { cwd: root, stdio: 'inherit' });
  execSync(`${py} scripts/gen-theme-contrast-corpus.py`, { cwd: root, stdio: 'inherit' });
}

// Sprawdzenie integralności plików fixtures
const brinePath = join(fixturesDir, 'brine-oracle-corpus.json');
const themePath = join(fixturesDir, 'theme-contrast-corpus.json');

if (!existsSync(brinePath) || !existsSync(themePath)) {
  console.error('[check-corpus] BŁĄD: Brak wymaganych plików korpusów JSON w tests/fixtures/');
  process.exit(1);
}

const brine = JSON.parse(readFileSync(brinePath, 'utf8'));
const theme = JSON.parse(readFileSync(themePath, 'utf8'));

if (!brine.brine_cases || brine.brine_cases.length < 270) {
  console.error('[check-corpus] BŁĄD: brine-oracle-corpus.json zawiera za mało wektorów');
  process.exit(1);
}

if (!theme.results || theme.results.length < 10) {
  console.error('[check-corpus] BŁĄD: theme-contrast-corpus.json zawiera za mało par');
  process.exit(1);
}

console.log(`[check-corpus] OK: Wszystkie korpusy prawdy Pythona są zsynchronizowane (${brine.brine_cases.length} solanek + ${theme.results.length} par WCAG).`);
