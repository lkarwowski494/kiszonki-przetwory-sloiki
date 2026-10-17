import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('Brak polskich słów i znaków w tłumaczeniu angielskim (NFR-I18N-003)', () => {
  const dictPath = join(process.cwd(), 'src', 'lib', 'i18n.en.ts');
  const dictSrc = readFileSync(dictPath, 'utf8');

  // Wyciągamy pary klucz: wartość
  const entries: [string, string][] = [];
  for (const m of dictSrc.matchAll(/'((?:[^'\\]|\\.)*)'\s*:\s*'((?:[^'\\]|\\.)*)'/g)) {
    entries.push([m[1], m[2]]);
  }

  test('słownik EN zawiera zdefiniowane wpisy', () => {
    expect(entries.length).toBeGreaterThan(100);
  });

  test('tłumaczenia w słowniku EN nie zawierają typowych polskich słów łączących ani czasowników', () => {
    const forbiddenWords = [
      /\boraz\b/i,
      /\blub\b/i,
      /\bjeśli\b/i,
      /\bjesli\b/i,
      /\bmożesz\b/i,
      /\bmozesz\b/i,
      /\btylko\b/i,
      /\bbrak\b/i,
      /\bbłędu\b/i,
      /\bwszystkie\b/i,
      /\bzapisz\b/i,
      /\busuń\b/i,
      /\banuluj\b/i,
      /\bgotowe\b/i,
    ];

    for (const [key, val] of entries) {
      for (const pattern of forbiddenWords) {
        expect(val).not.toMatch(pattern);
      }
    }
  });

  test('wartości w EN nie zawierają nieoczekiwanych polskich znaków diakrytycznych', () => {
    const polishLetters = /[ąćęłńśźżĄĆĘŁŃŚŹŻ]/;
    // Wyjątki dla nazw własnych i pojęć kulturowych (np. nazwa polskiej kultury lub tradycji)
    const allowedExceptions = [
      'Polska',
      'Słoik',
      'Kłodawa',
    ];

    for (const [key, val] of entries) {
      let scrubbed = val;
      for (const exc of allowedExceptions) {
        scrubbed = scrubbed.split(exc).join('');
      }
      expect(scrubbed).not.toMatch(polishLetters);
    }
  });
});
