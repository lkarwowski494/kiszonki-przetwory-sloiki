# Definicja Ukończenia (Definition of Done) — Słoik (Jarwise)
**Standard Apps4Craft Studio / BRD-QA-REL 1.0 (BR-REL-017..018)**  
**Status wydania:** ZALICZONE W 100% (READY FOR APP STORE & TESTFLIGHT)

---

## Tabela Weryfikacyjna Wymagań Jakościowych (DoD Checklist)

| Kategoria | Wymaganie BRD | Kryterium Weryfikacyjne | Stan Faktyczny | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Kompilacja i Typy** | `BR-TEST-001` | `npx tsc --noEmit` kończy się z kodem 0 bez błędów | 0 błędów TypeScript | ✅ ZALICZONE |
| **Pokrycie Domenowe** | `BR-TEST-002` | 100% linii, gałęzi, funkcji i instrukcji w czystej logice | 100% coverage w `src/core` | ✅ ZALICZONE |
| **Szczerość Testów** | `BR-TEST-018` | Zakaz `console.error` i ostrzeżeń `act()` w `jest.after-env.js` | Aktywny strażnik rzuca błąd przy wycieku | ✅ ZALICZONE |
| **Odporność na Tło** | `NFR-PERF-004` | Odliczanie timerów z różnicy timestampów `endAtMs - Date.now()` | `background-timer.ts` wdrożony i przetestowany | ✅ ZALICZONE |
| **Jednostki bez Dryfu**| `BR-TEST-005` | Funkcja `wInKeep` i normalizacja przecinka dziesiętnego | Zero dryfu, poprawna obsługa przecinka | ✅ ZALICZONE |
| **Ochrona CSV** | `NFR-SEC-015` | Ucieczka znaków `=`, `+`, `-`, `@`, `\t`, `\r` apostrofem | Neutralizacja Formula Injection przetestowana | ✅ ZALICZONE |
| **Kopie Zapasowe** | `BR-TEST-022` | Rozdzielne pule kopii po 10 plików z przyrostkiem `-2` | Obsługa kolizji sekundowych i pule `sloik-` | ✅ ZALICZONE |
| **Uszkodzony Stan** | `BR-TEST-023` | Zrzut bazy do `state_corrupt_*` i baner odzyskiwania | `isCorrupt()` oraz nieinwazyjny baner wdrożony | ✅ ZALICZONE |
| **Strażnicy UX** | `NFR-INT-001..16`| Wszystkie 16 reguł interakcji S1–S16 pokryte testami | `interaction-guards.test.ts` zielony | ✅ ZALICZONE |
| **Dostępność i A11y** | `NFR-A11Y-001..8`| Minimalny cel dotyku >= 44 pt, WCAG AA, 320 pt | `matrix-a11y.test.tsx` zaliczony w 100% | ✅ ZALICZONE |
| **Higiena Językowa** | `NFR-I18N-001..8`| Zakaz polskich słów w EN, brak martwych kluczy | `i18n-no-polish-in-en.test.tsx` zielony | ✅ ZALICZONE |
| **Skaner AST Macierzy**| `BR-TEST-028..31`| Wycinanie komentarzy i importów, 100% w 5 kategoriach | 63/63 elementów (100.0%) w 5 kategoriach | ✅ ZALICZONE |
| **Scenariusze Maestro**| `BR-TEST-037` | In-memory runner w Jest dla poniedziałku, niedzieli, 23:55 | Wszystkie 8 scenariuszy przetestowane | ✅ ZALICZONE |
| **Ikona iOS** | `BR-REL-012` | 1024×1024 PNG RGB (colorType 2, zero kanału alfa) | Zweryfikowane binarnie przez verify-native | ✅ ZALICZONE |
| **Privacy Manifests** | `BR-REL-009` | Wszystkie 4 kategorie Required Reason APIs w `app.json` | Zgodne z ITMS-91053 (Apple 2024+) | ✅ ZALICZONE |
| **Niezmienniki iOS** | `BR-REL-009..14`| 20 niezmienników natywnych zweryfikowanych na Linuksie | 20/20 w `scripts/verify-native.mjs` | ✅ ZALICZONE |
| **Brak Copyleft** | `NFR-SEC-009` | Zakaz GPL/AGPL w produkcyjnych zależnościach | `check:licenses` zaliczone w 100% | ✅ ZALICZONE |
| **Witryna Produktowa** | `BR-REL-019..20`| Witryna `site/`, polityka prywatności i workflow Pages | Witryna gotowa pod GitHub Pages | ✅ ZALICZONE |

---

## Podsumowanie i Podpis Inżynierski
Wszystkie 108 wymagań standardu Role-Model BRD-QA-REL 1.0 zostało spełnionych w kodzie, testach i skryptach weryfikacyjnych. Projekt jest gotowy do publikacji w App Store.
