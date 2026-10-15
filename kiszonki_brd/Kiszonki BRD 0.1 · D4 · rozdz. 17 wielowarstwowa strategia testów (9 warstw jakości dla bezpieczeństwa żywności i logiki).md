# **Kiszonki, przetwory, słoiki BRD 0.1 — Część D4: Wielowarstwowa strategia testów — 9 warstw jakości (Rozdz. 17)**

Zgodnie ze standardem inżynieryjnym projektów `trening`, `Oczko` i `czy-sie-zmiesci`, w projekcie **Słoik (Jarwise)** obowiązuje bezwzględny reżim weryfikacji jakości oparty na 9 niezależnych warstwach testowych.

```text
+-----------------------------------------------------------------------------------+
|               WARSTWA 9: STRAŻNICY ARCHITEKTURY, BEZPIECZEŃSTWA I WZORCÓW         |
+-----------------------------------------------------------------------------------+
|               WARSTWA 8: DOSTĘPNOŚĆ (APPLE HIG, WCAG AAA, VOICEOVER)              |
+-----------------------------------------------------------------------------------+
|               WARSTWA 7: E2E I REGRESJA WIZUALNA (MAESTRO NA SYMULATORZE IOS)     |
+-----------------------------------------------------------------------------------+
|               WARSTWA 6: MACIERZ KOMPONENTÓW I SCENARIUSZE UI (RNTL)             |
+-----------------------------------------------------------------------------------+
|               WARSTWA 5: TESTY BAZY DANYCH SQLITE, WAL I ODPORNOŚCI NA BŁĘDY      |
+-----------------------------------------------------------------------------------+
|               WARSTWA 4: NIEZALEŻNE KORPUSY REFERENCYJNE (GROUND-TRUTH USDA/FDA)  |
+-----------------------------------------------------------------------------------+
|               WARSTWA 3: TESTY WŁASNOŚCIOWE PROPERTY-BASED (FAST-CHECK)          |
+-----------------------------------------------------------------------------------+
|               WARSTWA 2: TESTY MUTACYJNE (STRYKER MUTATION TESTING >= 90%)       |
+-----------------------------------------------------------------------------------+
|               WARSTWA 1: CZYSTA DOMENA I MATEMATYKA (100% LINE & BRANCH COVERAGE) |
+-----------------------------------------------------------------------------------+
```

---

## **Warstwa 1: Czysta logika domenowa i wzory biologiczne (100% Coverage)**
Wszystkie moduły w katalogu `src/core/domain/` (kalkulatory solanek, przelicznik octu, algorytm kwasowości, termika pasteryzacji $P_0/F_0$) podlegają wymogowi **100% pokrycia linii, gałęzi i funkcji**.
* Brak jakichkolwiek importów z `react-native`, `expo` czy bibliotek UI.
* Weryfikacja poleceniem: `npm run test:domain` z progiem w `jest.config.js`:
  ```javascript
  coverageThreshold: {
    './src/core/domain/**/*.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
  ```

---

## **Warstwa 2: Testy mutacyjne (Stryker Mutation Testing $\ge 90\%$)**
Weryfikacja jakości testów poprzez automatyczne mutowanie kodu źródłowego (`stryker.config.json`):
* Zamiana operatorów matematycznych ($+ \leftrightarrow -$, $\cdot \leftrightarrow /$, $< \leftrightarrow \le$).
* Celowa zmiana stałych fizykochemicznych (np. zmiana progu botulinowego z $4.60$ na $4.80$ lub temperatury wrzenia z $100$ na $95$).
* Każdy taki mutant **musi zostać natychmiast wykryty i zabity (Killed Mutant)** przez zestaw testowy. Wskaźnik przeżywalności mutantów poniżej 10%.

---

## **Warstwa 3: Testy własnościowe Property-Based Testing (`fast-check`)**
Generowanie setek tysięcy pseudolosowych kombinacji danych wejściowych w celu weryfikacji niezmienników matematycznych:
* **Niezmiennik 1 (Zachowanie masy soli):** Dla dowolnej wagi warzyw $M_v \in (0, 100000]\,\text{g}$, wody $M_w \in [0, 100000]\,\text{g}$ i zadanego stężenia $p \in (0, 25]\%$, masa soli $M_s$ obliczona ze wzoru RD-01 spełnia tożsamość:
  $$\frac{M_s}{M_v + M_w + M_s} \cdot 100\% = p \pm 10^{-6}\%$$
* **Niezmiennik 2 (Monotoniczność pasteryzacji):** Wartość sterylizacyjna $F_0(t, T)$ jest funkcją ściśle rosnącą względem czasu $t$ i temperatury $T$:
  $$\forall T_2 > T_1, t_2 > t_1: F_0(t_2, T_2) > F_0(t_1, T_1)$$
* **Niezmiennik 3 (Bezpieczeństwo kwasowości):** Jeśli zmierzone $pH \ge 4.60$, funkcja `evaluateSafetyStatus(ph, isAnaerobic)` zawsze zwraca status `CRITICAL_BOTULISM_RISK`.

---

## **Warstwa 4: Niezależne korpusy referencyjne (Ground-Truth Corpora)**
Porównanie wyników silnika aplikacji z oficjalnymi tabelami referencyjnymi:
* Oficjalne tabele USDA Complete Guide to Home Canning (Bulletin 539) dla czasów pasteryzacji 40 rodzajów warzyw i owoców.
* Tabele kwasowości i stężeń solanek z Noma Guide to Fermentation.
* Skrypt różnicowy w Pythonie 3.14 (`scripts/verify_ground_truth.py`) odpalany w pipeline CI, weryfikujący zgodność do 4 miejsc po przecinku.

---

## **Warstwa 5: Baza danych SQLite i odporność na awarie (Resilience & Rollback)**
* **Zero Partial Writes:** Symulacja błędu zapisu w trakcie transakcji tworzenia partii przetworu $\to$ weryfikacja automatycznego `ROLLBACK` bazy SQLite i braku osieroconych rekordów.
* **Odporność na ubicie procesu:** Zrzut bazy w trakcie aktywnej sesji pasteryzacji $\to$ ponowne uruchomienie aplikacji $\to$ odtworzenie stanu stopera na podstawie bezwzględnego znacznika `targetDate`.
* **Roundtrip kopii zapasowej JSON:** Eksport pełnej bazy do JSON $\to$ usunięcie bazy SQLite $\to$ import z JSON $\to$ porównanie hashy SHA-256 wszystkich tabel.

---

## **Warstwa 6: Macierz komponentów UI (React Native Testing Library)**
Każdy komponent i ekran testowany w 4 podstawowych stanach:
1. Stan pusty (Empty State — np. brak słoików w spiżarni z zachętą do utworzenia partii).
2. Stan wprowadzania danych z dynamiczną walidacją błędów (np. wpisanie stężenia soli 90% wyświetla ostrzeżenie).
3. Stan aktywnego procesu (pasek postępu pasteryzacji).
4. Stan sukcesu (potwierdzenie dodania partii, podgląd wygenerowanej etykiety PNG).

---

## **Warstwa 7: Scenariusze E2E Maestro na symulatorze iOS**
Automatyczne testy end-to-end symulujące realne gesty użytkownika na symulatorze iPhone'a:

### **Scenariusz 01: Utworzenie partii ogórków kiszonych (`.maestro/01-ogorki-batch.yaml`)**
```yaml
appId: com.apps4brew.preserves
---
- launchApp
- assertVisible: "Słoik"
- tapOn: "Nowa Partia"
- tapOn: "Ogórki kiszone"
- inputText: "1500" # 1500g ogórków
- tapOn: "Dalej"
- assertVisible: "Zalecana sól: 33.8 g"
- tapOn: "Zatwierdź i Rozpocznij"
- assertVisible: "Faza 1: Fermentacja wstępna"
```

### **Scenariusz 02: Pasteryzacja i alarm na ekranie (`.maestro/02-pasteryzacja-timer.yaml`)**
```yaml
appId: com.apps4brew.preserves
---
- launchApp
- tapOn: "Pasteryzacja"
- tapOn: "Kąpiel wodna"
- tapOn: "Słoik 0.9L"
- tapOn: "Start odliczania"
- assertVisible: "15:00"
```

### **Scenariusz 03: Diagnostyk problemu Kahm (`.maestro/03-doktor-kahm.yaml`)**
```yaml
appId: com.apps4brew.preserves
---
- launchApp
- tapOn: "Pomoc i Diagnostyka"
- tapOn: "Biały nalot na powierzchni"
- tapOn: "Płaska, matowa błonka"
- assertVisible: "Diagnoza: Drożdże kożuchujące (Kahm)"
- assertVisible: "Nalot jest nieszkodliwy"
```

---

## **Warstwa 8: Kontrakty Dostępności (Apple HIG, WCAG AAA, VoiceOver)**
* Minimalne cele dotykowe $56\times 56\,\text{pt}$ w widokach kuchennych weryfikowane automatycznym testem statycznym `accessibility-touch-target.test.tsx`.
* Poprawność hierarchii dostępności: brak elementów klikalnych bez etykiet VoiceOver.
* Dynamic Type: automatyczny rendering komponentów przy rozmiarach czcionki od `Medium` do `AccessibilityXXL`.

---

## **Warstwa 9: Strażnicy Architektury i Bezpieczeństwa (Guard Tests)**
Zautomatyzowane testy statyczne weryfikujące architekturę przed każdym commitem:
* `network-guard.test.ts`: Skanowanie całego kodu źródłowego `src/` pod kątem obecności nieautoryzowanych wywołań sieciowych (`fetch`, `XMLHttpRequest`, `axios`). Dozwolony wyłącznie lokalny dostęp do bazy SQLite i systemu plików.
* `sql-injection-guard.test.ts`: Weryfikacja, że 100% zapytań do SQLite korzysta ze sparametryzowanych zmiennych wiązanych (`?`) — zakaz konkatenacji ciągów tekstowych w zapytaniach SQL.
* `close-button-guard.test.tsx`: Weryfikacja zasady projektowej studia — każde okno modalne posiada widoczny, spójny przycisk „Anuluj” po lewej stronie nagłówka (`headerLeft`).

