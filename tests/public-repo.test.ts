// ============================================================================
// Apps4Brew / Słoik — Public Repository Security Invariants (Chapter 12.5 BRD)
// (NFR-SEC-001..004)
// Weryfikuje zakaz wycieku sekretów, kluczy .p8, tokenów i minimalne uprawnienia CI.
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';

describe('Bezpieczeństwo Publicznego Repozytorium (Chapter 12.5 BRD, NFR-SEC-001..004)', () => {
  const root = process.cwd();

  test('NFR-SEC-001: .gitignore zawiera wszystkie krytyczne wzorce sekretów i artefaktów', () => {
    const gitignorePath = path.join(root, '.gitignore');
    expect(fs.existsSync(gitignorePath)).toBe(true);
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');

    const requiredPatterns = [
      'node_modules',
      'dist',
      '.env',
      '*.p8',
      '*.mobileprovision',
      '*.keystore',
    ];

    for (const pattern of requiredPatterns) {
      expect(gitignore).toContain(pattern);
    }
  });

  test('NFR-SEC-002: W kodzie źródłowym i skryptach brak kluczy prywatnych i tokenów produkcyjnych', () => {
    const walkFiles = (dir: string): string[] => {
      let results: string[] = [];
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        if (['node_modules', '.git', 'dist', '.expo'].includes(entry)) continue;
        const p = path.join(dir, entry);
        if (fs.statSync(p).isDirectory()) {
          results = results.concat(walkFiles(p));
        } else if (/\.(ts|tsx|js|mjs|json|yml|yaml|md|sh)$/.test(entry)) {
          results.push(p);
        }
      }
      return results;
    };

    const files = walkFiles(root);
    const secretPatterns = [
      /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/,
      /ghp_[a-zA-Z0-9]{36}/,
      /github_pat_[a-zA-Z0-9]{82}/,
      /AIzaSy[0-9A-Za-z-_]{35}/, // Google API key
    ];

    for (const file of files) {
      // Ignorujemy fixture lub specyficzne mocki
      if (file.includes('fixtures')) continue;
      const content = fs.readFileSync(file, 'utf8');
      for (const pattern of secretPatterns) {
        expect(content).not.toMatch(pattern);
      }
    }
  });

  test('NFR-SEC-003: Pliki GitHub Actions mają zdefiniowane minimalne uprawnienia (permissions)', () => {
    const workflowsDir = path.join(root, '.github', 'workflows');
    if (!fs.existsSync(workflowsDir)) return;

    const files = fs.readdirSync(workflowsDir).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(workflowsDir, file), 'utf8');
      // Każdy workflow z akcjami zapisu musi jawnie deklarować blok permissions
      if (content.includes('write')) {
        expect(content).toMatch(/permissions:\s*/);
      }
    }
  });
});
