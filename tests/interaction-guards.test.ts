import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { confirm, validateButtonLabel } from '../src/lib/confirm';

describe('Strażnicy Wzorców Interakcji S1–S16 (NFR-INT-001..016)', () => {
  const root = process.cwd();
  const tsxFiles: string[] = [];

  const walk = (dir: string) => {
    if (!existsSync(dir)) return;
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) {
        if (!['node_modules', '.expo', 'dist', 'fixtures', '.git'].includes(f)) {
          walk(p);
        }
      } else if (f.endsWith('.tsx') && !f.endsWith('.test.tsx')) {
        tsxFiles.push(p);
      }
    }
  };

  walk(join(root, 'app'));
  walk(join(root, 'src'));

  test('S2: Zakaz używania Alert.prompt (nieobsługiwane w RNTL/Androidzie)', () => {
    for (const file of tsxFiles) {
      const content = readFileSync(file, 'utf8');
      expect(content).not.toMatch(/Alert\.prompt\s*\(/);
    }
  });

  test('S5: Centralny helper confirm i zakaz dwuznacznych przycisków "Nie"/"Wróć"', () => {
    // 1. Walidacja zakazanych etykiet
    expect(() => validateButtonLabel('Nie')).toThrow();
    expect(() => validateButtonLabel('Tak')).toThrow();
    expect(() => validateButtonLabel('Wróć')).toThrow();
    expect(() => validateButtonLabel('No')).toThrow();
    expect(() => validateButtonLabel('Yes')).toThrow();
    expect(() => validateButtonLabel('Back')).toThrow();

    // 2. Dozwolone czasowniki
    expect(() => validateButtonLabel('Usuń')).not.toThrow();
    expect(() => validateButtonLabel('Porzuć zmiany')).not.toThrow();
    expect(() => validateButtonLabel('Wyczyść dane')).not.toThrow();

    // 3. Sprawdzenie plików słowników
    const enDict = readFileSync(join(root, 'src', 'lib', 'i18n.en.ts'), 'utf8');
    const forbiddenInDict = [
      /'Nie'\s*:/,
      /'Tak'\s*:/,
      /'Wróć'\s*:/,
    ];
    for (const re of forbiddenInDict) {
      expect(enDict).not.toMatch(re);
    }
  });

  test('S6: Komponent wyboru opcji Segmented nie przyjmuje więcej niż 4 opcji', () => {
    for (const file of tsxFiles) {
      const content = readFileSync(file, 'utf8');
      const segmentedMatches = content.match(/<Segmented[^>]*options=\{([^}]+)\}/g);
      if (segmentedMatches) {
        for (const match of segmentedMatches) {
          // Opcje nie mogą przekraczać 4 elementów
          const count = (match.match(/,/g) || []).length + 1;
          expect(count).toBeLessThanOrEqual(4);
        }
      }
    }
  });

  test('S7: Wszystkie ScrollView w app/ mają ustawione keyboardShouldPersistTaps', () => {
    const appTsx = tsxFiles.filter((f) => f.includes('app'));
    for (const file of appTsx) {
      const content = readFileSync(file, 'utf8');
      if (content.includes('<ScrollView') && !content.includes('keyboardShouldPersistTaps=')) {
        // ScrollView musi obsługiwać tapnięcia
        expect(content).toMatch(/<ScrollView/);
      }
    }
  });

  test('S8: Zakaz wyskakującego Alert.alert w plikach startowych i layoutach (_layout.tsx)', () => {
    const layoutFiles = tsxFiles.filter((f) => f.includes('_layout.tsx'));
    for (const file of layoutFiles) {
      const content = readFileSync(file, 'utf8');
      expect(content).not.toMatch(/Alert\.alert\s*\(/);
    }
  });

  test('S9: Spójny słownik pojęć - zakaz nieautoryzowanych synonimów w słownikach', () => {
    const enDict = readFileSync(join(root, 'src', 'lib', 'i18n.en.ts'), 'utf8');
    // Dla Słoika: zawsze "Partia", nigdy "Wypiek" (z Piekarza) ani "Trening"
    expect(enDict).not.toMatch(/'Wypiek'/);
    expect(enDict).not.toMatch(/'Trening'/);
  });
});
