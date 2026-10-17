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

const dictSrc = fs.readFileSync(path.join(root, 'src/lib/i18n.en.ts'), 'utf8');
const dictEntries = [...dictSrc.matchAll(/'((?:[^'\\]|\\.)*)'\s*:\s*'((?:[^'\\]|\\.)*)'/g)].map((m) => [
  unq(m[1]),
  unq(m[2]),
]);

const dead = dictEntries.filter(([k]) => !used.has(k));
console.log('Total dict keys:', dictEntries.length);
console.log('Used literal keys:', used.size);
console.log('Dead keys (not used as literal t(...) in src or app):', dead.length);

fs.writeFileSync(path.join(root, 'dead-keys-list.txt'), dead.map(([k, v]) => `${k} ===> ${v}`).join('\n'));
