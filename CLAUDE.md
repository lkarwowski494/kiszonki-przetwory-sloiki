# Wytyczne Deweloperskie i Inżynieryjne — Słoik (Jarwise)
**Standard Inżynierski Apps4Craft Studio: BRD-QA-REL 1.0 (Role-Model: `trening` + `organizer`)**

---

## 1. Architektura i Konwencje
- **Wariant architektoniczny:** Wariant T (Jednobinarkowy, 100% Offline-First, lokalne SQLite).
- **Zero telemetrii:** Bezwzględny zakaz dodawania zewnętrznych SDK śledzących, analityki chmurowej (Firebase, Adjust, Segment) i reklam.
- **Design System:** Oficjalna biblioteka `@apps4craft/ui` (`CraftHeader`, `CraftModal`, `CraftButton`, `CraftCard`, `CraftStatDisplay`).
- **Motyw rzemieślniczy:** Ceramiczny bazalt `#121214` z akcentem koperkowej zieleni solanki `#5B8A61`.
- **Dostępność i Ergonomia:** Minimalny cel dotykowy każdego elementu klikalnego wynosi 44 pt (standard 48 pt/52 pt na blacie kuchennym, `hitSlop` min. ±12 pt).

---

## 2. Podstawowe Komendy
```bash
# Uruchomienie aplikacji w Expo Go / symulatorze
npm start

# Kompilacja TypeScriptu do dist/
npm run build

# Uruchomienie pełnego zestawu testów Jest
npm test

# Skaner AST macierzy testów (100% pokrycia w 5 kategoriach)
npm run check:matrix

# Generowanie zaktualizowanej macierzy testów
npm run matrix:write

# Higiena słowników i18n
npm run check:i18n

# Weryfikacja scenariuszy Maestro
npm run check:maestro

# Weryfikacja licencji zależności (brak copyleft w FairPlay DRM)
npm run check:licenses

# Weryfikacja 20 niezmienników natywnych iOS
npm run verify:native

# Kompletny pipeline weryfikacyjny (musi przejść w 100% na zielono przed commitem)
npm run verify
```

---

## 3. Żelazne Niezmienniki Inżynieryjne (RD-ENG-01..12)
1. **Konwersja jednostek bez dryfu (`RD-ENG-01`, `BR-TEST-005`):** Zawsze używaj `wInKeep(txt, unit, stored)` oraz komponentu `NumInput` akceptującego przecinek i kropkę dziesiętną (`"12,5" === "12.5"`).
2. **Kontrast barw kuchennych (`RD-ENG-02`):** Zachowaj zgodność z WCAG 2.1 AA (min. 4.5:1 dla tekstu zwykłego, min. 3.0:1 dla dużych liczb na blacie).
3. **Pola dotyku (`RD-ENG-03`):** Wysokość i szerokość celów dotykowych `>= 44 pt`.
4. **Cyfry tabularne (`RD-ENG-04`):** Wartości liczbowe, wagi i timery zawsze renderowane z `fontVariant: ['tabular-nums']`.
5. **Timery odporne na tło (`RD-ENG-06`, `NFR-PERF-004`):** Bezwzględny zakaz odliczania z `setInterval(prev => prev - 1)`. Odliczanie zawsze z różnicy znaczników czasu: `endAtMs - Date.now()`.
6. **Wyszukiwanie z normalizacją diakrytyków (`RD-ENG-07`):** Komponent `SearchField` i funkcja `normSearch` usuwają polskie ogonki (`ł -> l`, `ą -> a`, `ó -> o`).
7. **Ochrona CSV (`RD-ENG-10`, `NFR-SEC-015`):** Wszystkie wartości eksportowane do CSV muszą przechodzić przez `escapeCsvCell` neutralizujący znaki `=`, `+`, `-`, `@`, `\t`, `\r`.
8. **Ikona App Store (`RD-ENG-11`, `BR-REL-012`):** `assets/icon.png` w kwadracie 1024×1024 w formacie PNG RGB (colorType 2, bez kanału alfa).
9. **Kopie zapasowe i kolizje (`RD-ENG-12`, `BR-TEST-022`):** Rozdzielne pule po 10 plików (`sloik-` vs `sloik-przed-importem-` / `sloik-przed-czyszczeniem-`) z przyrostkiem `-2` w razie kolizji sekundowej.
10. **Ochrona uszkodzonego stanu (`BR-TEST-023`):** W razie awarii SQLite surowy zrzut trafia do `state_corrupt_<timestamp>`, a aplikacja wyświetla nieinwazyjny baner odzyskiwania zamiast cichego skasowania danych.
