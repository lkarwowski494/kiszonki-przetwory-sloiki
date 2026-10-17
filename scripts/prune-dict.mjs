import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [];

function walk(d) {
  if (!fs.existsSync(d)) return;
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      if (!['node_modules', '.expo', 'dist', 'scratch'].includes(f)) walk(p);
    } else if (/\.(ts|tsx)$/.test(f) && !/i18n(\.en)?\.ts$/.test(f) && !/\.test\.(ts|tsx)$/.test(f)) {
      files.push(p);
    }
  }
}

['src', 'app'].forEach((d) => walk(path.join(root, d)));

const unq = (s) => s.replace(/\\'/g, "'").replace(/\\\\/g, '\\');
const used = new Set();

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/\bt\(\s*['"]((?:[^'"\\]|\\.)*)['"]/g)) {
    used.add(unq(m[1]));
  }
}

const dictPath = path.join(root, 'src/lib/i18n.en.ts');
const dictSrc = fs.readFileSync(dictPath, 'utf8');
const dictEntries = [...dictSrc.matchAll(/'((?:[^'\\]|\\.)*)'\s*:\s*'((?:[^'\\]|\\.)*)'/g)].map((m) => [
  unq(m[1]),
  unq(m[2]),
]);

const activeEntries = dictEntries.filter(([k]) => used.has(k));
console.log(`Original entries: ${dictEntries.length}`);
console.log(`Active used entries: ${activeEntries.length}`);
console.log(`Pruned dead entries: ${dictEntries.length - activeEntries.length}`);

// Sort active entries alphabetically for clean diff and fast lookup
activeEntries.sort((a, b) => a[0].localeCompare(b[0]));

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const output = `// ============================================================================
// Słoik (Jarwise) — English Translations Dictionary (Apps4Brew Core / Parity S2)
// 100% Offline-First. Zero dead keys.
// ============================================================================

export const EN: Record<string, string> = {
${activeEntries.map(([k, v]) => `  '${esc(k)}': '${esc(v)}',`).join('\n')}
};
`;

fs.writeFileSync(dictPath, output, 'utf8');
console.log('Successfully pruned dead keys from src/lib/i18n.en.ts!');
