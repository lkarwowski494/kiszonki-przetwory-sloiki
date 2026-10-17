// ============================================================================
// Apps4Brew / Słoik — Trademark & Brand Contract Tests (NFR-SEC-011, RYZ-33)
// Weryfikuje ochronę przed naruszeniem cudzych znaków towarowych.
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';

describe('Kontrakt Znaków Towarowych i Marek (NFR-SEC-011, RYZ-33)', () => {
  const root = process.cwd();

  test('NFR-SEC-011: Nazwa aplikacji i slug nie zawierają cudzych znaków towarowych', () => {
    const appJson = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8'));
    const name = appJson.expo.name.toLowerCase();
    const slug = appJson.expo.slug.toLowerCase();

    // Dozwolone: Słoik, Jarwise, Apps4Brew, Apps4Craft
    expect(name).toContain('słoik');
    expect(slug).toBe('sloik');

    // Zakazane: bezpośrednie podszywanie się pod marki komercyjne
    const forbiddenBrandKeywords = ['thermomix', 'kilner', 'bormioli', 'tupperware', 'ball jar'];
    for (const kw of forbiddenBrandKeywords) {
      expect(name).not.toContain(kw);
      expect(slug).not.toContain(kw);
    }
  });

  test('NFR-SEC-011: Słowniki językowe używają pojęć generycznych dla sprzętu i słoików', () => {
    const enDict = fs.readFileSync(path.join(root, 'src', 'lib', 'i18n.en.ts'), 'utf8').toLowerCase();
    const plDict = fs.readFileSync(path.join(root, 'src', 'lib', 'i18n.ts'), 'utf8').toLowerCase();

    // Zakaz komercyjnych zastrzeżonych nazw urządzeń jako obowiązkowych
    expect(enDict).not.toContain('thermomix®');
    expect(plDict).not.toContain('thermomix®');
  });
});
