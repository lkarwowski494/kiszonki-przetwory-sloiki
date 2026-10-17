# Protokół Przekazania Technicznego — Słoik (Jarwise)
**Standard Apps4Craft Studio / BRD-QA-REL 1.0 (BR-REL-021..022)**  
**Data przekazania:** 17 października 2026 r.  
**Wariant architektoniczny:** Wariant T (Jednobinarkowy Offline-First, wzorzec `trening` + `organizer`)

---

## 1. Układ Repozytorium i Struktura Modułów
- `app/` — Trasy nawigacyjne Expo Router (File-based routing, w tym modale i zakładki).
- `src/core/` — Czysta logika domenowa (kalkulatory solanek, pasteryzacja USDA, drzewo decyzyjne doktora, oś czasu fermentacji, radar sensoryczny, konwersje jednostek bez dryfu `wInKeep`).
- `src/data/` — 100% lokalna warstwa trwałości w Expo SQLite (`LocalDatabaseStore`) z automatyczną obsługą uszkodzonego stanu (`state_corrupt_<timestamp>`).
- `src/lib/` — Narzędzia pomocnicze: kopie zapasowe z ochroną CSV Formula Injection, system i18n z normalizacją polskich znaków, strażnik potwierdzeń `confirm.ts`.
- `src/ui/` — Ceramiczny motyw bazaltowy `#121214` oraz komponenty o gwarantowanym polu kliku min. 44 pt (`CraftHeader`, `CraftModal`, `CraftButton`, `NumInput`, `SearchField`, `Missing`).
- `tests/` — Testy integracyjne, własnościowe `fast-check`, strażnicy interakcji S1–S16, wyrocznia z korpusu Pythona, testy dostępności i wielojęzyczności oraz runner Maestro w Jest.
- `scripts/` — Skrypty inżynieryjne: skaner AST macierzy testów, weryfikator 20 niezmienników iOS, weryfikator licencji, generator korpusu matematycznego w Pythonie.
- `site/` — Statyczna witryna produktowa, polityka prywatności i strona wsparcia gotowe do publikacji na GitHub Pages.

---

## 2. Kluczowe Komendy Developerskie
```bash
# Uruchomienie deweloperskie Expo
npm start

# Kompilacja TypeScript do dist/
npm run build

# Uruchomienie pełnego pakietu testów Jest
npm test

# Skaner AST macierzy testów (100% we wszystkich 5 kategoriach)
npm run check:matrix

# Weryfikator niezmienników iOS (20 reguł Apple na Linuksie/Windowsie)
npm run verify:native

# Weryfikator licencji zależności (brak copyleft GPL)
npm run check:licenses

# Główna bramka weryfikacyjna przed commitem / wydaniem
npm run verify
```

---

## 3. Parametry Wydania i Certyfikacja App Store
- **Bundle ID:** `com.apps4brew.sloik`
- **Wymagane API:** Wszystkie 4 kategorie Required Reason API zadeklarowane w `app.json` (`privacyManifests`).
- **Ikona aplikacji:** 1024×1024 RGB, colorType 2 (brak przezroczystości, ITMS-90717).
- **Zgodność z FairPlay DRM:** Wszystkie 22 produkcyjne zależności posiadają licencje permisywne (MIT/Apache-2.0/BSD).
