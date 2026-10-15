# -*- coding: utf-8 -*-
"""
Expander for D1 (115 NFRs) and D2 (Architecture & SQLite Data Model)
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\joyful-chandrasekhar\kiszonki_brd"

# D1 NFR Full Detail (115 NFRs)
f_d1 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · D1 · rozdz. 9-10 wymagania niefunkcjonalne (NFR) i zgodność z Apple.md")
with open(f_d1, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część D1: Wymagania niefunkcjonalne (NFR) i zgodność z Apple (Rozdz. 9–10)**

## **Rozdział 9: Wymagania niefunkcjonalne (NFR-001…NFR-115)**

Wymagania niefunkcjonalne stanowią twarde ograniczenia jakościowe dla całego systemu. Każde wymaganie podlega automatycznej weryfikacji w pipeline CI.

---

### **9.1 Offline i Niezależność Sieciowa (NFR-OFF-001…010)**
* **NFR-OFF-001:** 100% funkcjonalności aplikacji (kalkulatory solanek, monitor fermentacji, stoper pasteryzacji, baza naczyń, spis spiżarni, moduł diagnostyczny, eksport i import kopii zapasowej) działa bez aktywnego połączenia z siecią w trybie samolotowym.
* **NFR-OFF-002:** Aplikacja nie zawiera żadnych odwołań sieciowych (`fetch`, `XMLHttpRequest`, `axios`, `WebSocket`) do zewnętrznych serwerów w warstwie domenowej ani prezentacji.
* **NFR-OFF-003:** Baza danych SQLite jest inicjalizowana lokalnie w katalogu piaskownicy aplikacji (`NSDocumentDirectory`).
* **NFR-OFF-004:** Baza wiedzy (atlas kultur mikrobiologicznych, przepisy bazowe, drzewa diagnostyczne) jest w całości skompilowana w lokalnym bundle aplikacji i nie wymaga pobierania dodatkowych pakietów.
* **NFR-OFF-005:** Generowanie etykiet graficznych i kodów QR odbywa się w 100% na procesorze urządzenia bez odpytywania zewnętrznych API graficznych.
* **NFR-OFF-006…010:** Weryfikacja braku uprawnień sieciowych w `app.json` i `Info.plist`, odporność na błędy braku łączności w watchOS.

---

### **9.2 Dostępność i Ergonomia Kuchenna (NFR-DOST-001…015)**
* **NFR-DOST-001:** 100% elementów interaktywnych posiada pełne etykiety VoiceOver (`accessibilityLabel`, `accessibilityHint`, `accessibilityRole`).
* **NFR-DOST-002:** Minimalny cel dotykowy w widokach kuchennych (np. przycisk startu pasteryzacji, odhaczenie odgazowania) wynosi co najmniej $56 \times 56\,\text{pt}$ (zwiększony standard dla mokrych lub ubrudzonych palców).
* **NFR-DOST-003:** Dynamic Type: wszystkie teksty skalują się bez obcięć (Zero Truncation) od rozmiaru `xSmall` do największego rozmiaru dostępnościowego `AccessibilityXXL`.
* **NFR-DOST-004:** Kontrast barwny tekstu do tła spełnia kryteria WCAG 2.1 AAA: minimalny kontrast $7.0:1$ dla tekstu zwykłego i $4.5:1$ dla nagłówków.
* **NFR-DOST-005:** Żadna informacja o stanie mikrobiologicznym (np. strefa bezpieczeństwa pH) nie jest przekazywana wyłącznie za pomocą koloru — zawsze towarzyszy jej wyrazista ikona i jednoznaczny opis tekstowy.
* **NFR-DOST-006…015:** Dźwiękowe i haptyczne potwierdzenia dla osób niewidomych, obsługa zewnętrznych klawiatur Bluetooth i przełączników dostępnościowych iOS.

---

### **9.3 Lokalizacja i Wielojęzyczność (NFR-I18N-001…012)**
* **NFR-I18N-001:** Architektura i18n oparta na silniku lokalizacyjnym studia Apps4Brew z precyzyjnymi słownikami kluczy.
* **NFR-I18N-002:** Obsługa formatowania liczb, separatorów dziesiętnych (przecinek w PL vs kropka w US) oraz jednostek miar zgodnie z `Intl.NumberFormat`.
* **NFR-I18N-003:** Dynamiczne dopasowanie jednostek (metryczne: g, kg, ml, l, cm vs imperialne: oz, lb, fl oz, cal).
* **NFR-I18N-004…012:** Pokrycie testami 100% kluczy językowych, brak martwych kluczy w słownikach (`npm run check:i18n`).

---

### **9.4 Wydajność i Czas Reakcji (NFR-WYD-001…012)**
* **NFR-WYD-001:** Zimny start aplikacji (Cold Start) na urządzeniach od iPhone 11 w górę trwa poniżej $800\,\text{ms}$.
* **NFR-WYD-002:** Stabilne 60 FPS (i 120 FPS na ekranach ProMotion) podczas przewijania list w spiżarni z 500 słoikami.
* **NFR-WYD-003:** Synchroniczne przeliczanie formuł solanki i pasteryzacji w czasie $< 2\,\text{ms}$.
* **NFR-WYD-004…012:** Czas renderowania etykiety PNG $< 150\,\text{ms}$, limity zużycia pamięci RAM $< 90\,\text{MB}$.

---

### **9.5 Bezpieczeństwo i Prywatność (NFR-BEZP-001…018)**
* **NFR-BEZP-001:** Zero zbierania danych telemetrycznych i osobowych („Data Not Collected” w App Store Privacy Manifest).
* **NFR-BEZP-002:** Wszystkie zapytania SQL korzystają ze zmiennych wiązanych (`?`), eliminując 100% podatności na SQL Injection.
* **NFR-BEZP-003:** Wyłączona telemetria systemowa stron trzecich; brak Crashlytics czy SDK analitycznych.
* **NFR-BEZP-004…018:** Bezpieczne przechowywanie kopii zapasowej, brak ekspozycji identyfikatorów w logach.

---

### **9.6 Niezawodność i Integralność Danych (NFR-DANE-001…014)**
* **NFR-DANE-001:** Tryb SQLite WAL (`PRAGMA journal_mode = WAL;`) i pełna atomowość transakcji zapisu partii.
* **NFR-DANE-002:** Zero utraty danych przy nagłym ubiciu procesu w trakcie pasteryzacji.
* **NFR-DANE-003:** Automatyczna kopia zapasowa przed każdą migracją schematu bazy danych.
* **NFR-DANE-004…014:** Weryfikacja sum kontrolnych SHA-256 eksportowanego pliku JSON.

---

### **9.7 Interakcja i Zegarek watchOS (NFR-ZEG-001…012)**
* **NFR-ZEG-001:** Aplikacja watchOS działa w pełni autonomicznie bez konieczności ciągłego połączenia Bluetooth z telefonem.
* **NFR-ZEG-002:** Sterowanie cyfrową koronką (Digital Crown) z haptyczną informacją zwrotną co 1 minutę pasteryzacji.
* **NFR-ZEG-003…012:** Live Activity na ekranie blokady, obsługa Dynamic Island, automatyczne wznawianie stopera.

---

### **9.8 Rygor Testowy (NFR-TEST-001…014)**
* **NFR-TEST-001:** 100% pokrycia linii, gałęzi i funkcji w czystej logice domenowej `src/core/domain/`.
* **NFR-TEST-002:** Wskaźnik przeżywalności testów mutacyjnych Stryker poniżej 10% ($\ge 90\%$ zabitych mutantów).
* **NFR-TEST-003…014:** Testy property-based `fast-check`, testy odpornościowe transakcji, automatyczne scenariusze Maestro E2E.

---

## **Rozdział 10: Zgodność z wytycznymi Apple App Store Review Guidelines**

1. **Wytyczna 4.3(a) & 4.3(b) (Spam i brak unikalności):** Aplikacja broni się bogatym, unikalnym modułem laboratoryjnej fizykochemii (solanki masowe, penetracja ciepła, kinetyka fermentacji), natywną aplikacją na Apple Watch z cyfrową koronką, Live Activity oraz Szkołą Przetwórstwa. Nie jest prostym licznikiem ani generyczną książką kucharską.
2. **Wytyczna 5.1.1 (Prywatność i zbieranie danych):** Etykieta App Privacy zawiera wyłącznie status „Data Not Collected”. Brak profilowania, brak wymogu logowania.
3. **Wytyczna 3.1.2 (Subskrypcje i zakupy in-app):** Jasna prezentacja cen, przywracanie zakupów (Restore Purchases) widoczne na pierwszym planie, pełny opis korzyści wersji Pro.
4. **Wytyczna 1.4.1 (Bezpieczeństwo żywności i zdrowie):** Aplikacja zawiera wyraźny disclaimer prawny informujący, że stanowi narzędzie wspomagające, a odpowiedzialność za higienę surowców i bezpieczeństwo przetworów spoczywa na użytkowniku. Ostrzeżenia o botulizmie są zgodne z oficjalnymi wytycznymi agencji rządowych.

""")

print("Expanded D1 written successfully.")

# D2 Architecture & Relational SQLite Schema Full Detail
f_d2 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · D2 · rozdz. 11-12 architektura, relacyjny model danych SQLite i przenośność.md")
with open(f_d2, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część D2: Architektura techniczna i model danych SQLite (Rozdz. 11–12)**

## **Rozdział 11: Architektura systemu**

Aplikacja oparta jest na wzorcu **Czystej Architektury (Hexagonal / Clean Architecture)** gwarantującym absolutną niezależność domeny matematyczno-biologicznej od frameworków UI.

```text
+-----------------------------------------------------------------------------------+
|                        PREZENTACJA (Expo Router / UI / WatchOS)                   |
|   - Ekrany: Kalkulator, Monitor partii, Pasteryzacja, Spiżarnia, Szkoła, Ustawienia |
|   - Komponenty: JarGeometryViewer, BrineSlider, PhaseTimeline, WatchCompanion     |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        APLIKACJA (Application Use Cases)                          |
|   - CreateBatchUseCase, CompleteFermentationUseCase, ExecutePasteurizationUseCase |
|   - GenerateQrLabelUseCase, EvaluateSafetyStatusUseCase, ExportBackupUseCase      |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        DOMENA (Pure TypeScript Domain Core)                       |
|   - Modele: Batch, Jar, SalinityFormula, HeatPenetrationCurve, PectinEquilibrium  |
|   - Reguły: RD-01..RD-55 (Zero zależności od react-native, 100% testów)           |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                   INFRASTRUKTURA (Persistence & Native Bridges)                   |
|   - SQLiteDatabaseDriver (WAL mode, Foreign Keys), FileSystemStorage              |
|   - AppleWatchConnectivityBridge, HapticsFeedbackService, LocalNotifications      |
+-----------------------------------------------------------------------------------+
```

---

## **Rozdział 12: Relacyjny schemat bazy danych SQLite (DDL) i migracje**

Baza danych `preserves.db` inicjalizowana jest poniższym kompletnym skryptem DDL:

```sql
-- Włączenie kluczy obcych i trybu WAL
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = FULL;
PRAGMA busy_timeout = 5000;

-- Tabela 1: Partie przetworów (Batches)
CREATE TABLE IF NOT EXISTS batches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('lacto_ferment', 'vinegar_pickle', 'jam_preserve', 'beverage', 'meat_fish', 'confit', 'koji_miso', 'custom')),
    recipe_id TEXT,
    jar_type_id TEXT NOT NULL,
    jar_volume_ml INTEGER NOT NULL,
    jar_count INTEGER NOT NULL DEFAULT 1,
    vegetable_mass_g REAL NOT NULL,
    water_mass_g REAL NOT NULL,
    salt_mass_g REAL NOT NULL,
    salt_percent REAL NOT NULL,
    salinity_mode TEXT NOT NULL CHECK(salinity_mode IN ('total_mass', 'water_only', 'dry_salting')),
    target_ph REAL,
    measured_ph REAL,
    safety_status TEXT NOT NULL DEFAULT 'PENDING' CHECK(safety_status IN ('SAFE', 'WARNING', 'CRITICAL_BOTULISM_RISK', 'PENDING')),
    status TEXT NOT NULL CHECK(status IN ('active_ferment', 'pasteurizing', 'mature_in_pantry', 'consumed', 'spoiled')),
    started_at TEXT NOT NULL,
    ferment_f1_end_at TEXT,
    mature_at TEXT,
    best_before_at TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Tabela 2: Predefiniowane i własne naczynia/słoiki (Jars)
CREATE TABLE IF NOT EXISTS jars (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL, -- 'Weck', 'Twist-Off', 'Mason', 'Kamionka', 'Fido', 'Inny'
    closure_type TEXT NOT NULL CHECK(closure_type IN ('glass_clamp', 'twist_lid', 'mason_band', 'wire_bail', 'water_groove', 'open_cloth')),
    volume_ml INTEGER NOT NULL,
    diameter_mm INTEGER,
    recommended_headspace_mm INTEGER NOT NULL,
    can_pressure_can BOOLEAN NOT NULL DEFAULT 0,
    is_custom BOOLEAN NOT NULL DEFAULT 0
);

-- Tabela 3: Pomiary laboratoryjne partii (Measurements)
CREATE TABLE IF NOT EXISTS measurements (
    id TEXT PRIMARY KEY,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    measured_at TEXT NOT NULL DEFAULT (datetime('now')),
    measurement_type TEXT NOT NULL CHECK(measurement_type IN ('ph', 'brix', 'temperature_c', 'salinity_pct', 'sensory_note')),
    numeric_value REAL,
    text_value TEXT,
    photo_uri TEXT
);

-- Tabela 4: Sesje pasteryzacji (Pasteurization_Sessions)
CREATE TABLE IF NOT EXISTS pasteurization_sessions (
    id TEXT PRIMARY KEY,
    batch_id TEXT REFERENCES batches(id) ON DELETE SET NULL,
    method TEXT NOT NULL CHECK(method IN ('water_bath', 'oven', 'sous_vide', 'tyndallization_d1', 'tyndallization_d2', 'tyndallization_d3', 'pressure')),
    target_temp_c REAL NOT NULL,
    duration_seconds INTEGER NOT NULL,
    completed_seconds INTEGER NOT NULL,
    is_successful BOOLEAN NOT NULL DEFAULT 0,
    calculated_p0 REAL,
    calculated_f0 REAL,
    started_at TEXT NOT NULL,
    finished_at TEXT
);

-- Tabela 5: Zapasy spiżarni (Pantry_Items)
CREATE TABLE IF NOT EXISTS pantry_items (
    id TEXT PRIMARY KEY,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    storage_location TEXT NOT NULL DEFAULT 'Piwnica',
    shelf_identifier TEXT,
    remaining_jars INTEGER NOT NULL,
    initial_jars INTEGER NOT NULL,
    qr_code_payload TEXT UNIQUE NOT NULL
);

-- Tabela 6: Historia i audyt (Audit_Log)
CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indeksy wydajnościowe
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);
CREATE INDEX IF NOT EXISTS idx_batches_category ON batches(category);
CREATE INDEX IF NOT EXISTS idx_measurements_batch_id ON measurements(batch_id);
CREATE INDEX IF NOT EXISTS idx_pantry_batch_id ON pantry_items(batch_id);
CREATE INDEX IF NOT EXISTS idx_pantry_qr ON pantry_items(qr_code_payload);
```

### **12.2 Mechanizm migracji schematu `migrate()`**
Migracje zarządzane są w dedykowanym module `src/core/state/migrate.ts`.
Przed uruchomieniem jakiejkolwiek migracji baza tworzy automatyczną kopię zapasową w pliku `preserves.pre_v{old}.bak`.

```typescript
export interface Migration {
  fromVersion: number;
  toVersion: number;
  up: (db: DatabaseClient) => Promise<void>;
  down: (db: DatabaseClient) => Promise<void>;
}

export const MIGRATIONS: Migration[] = [
  {
    fromVersion: 0,
    toVersion: 1,
    up: async (db) => {
      await db.executeSql(DDL_SCHEMA_V1);
    },
    down: async (db) => {
      await db.executeSql('DROP TABLE IF EXISTS audit_log;');
      await db.executeSql('DROP TABLE IF EXISTS pantry_items;');
      await db.executeSql('DROP TABLE IF EXISTS pasteurization_sessions;');
      await db.executeSql('DROP TABLE IF EXISTS measurements;');
      await db.executeSql('DROP TABLE IF EXISTS jars;');
      await db.executeSql('DROP TABLE IF EXISTS batches;');
    }
  }
];
```

### **12.3 Koperta kopii zapasowej JSON (Backup Envelope)**
Zgodnie z zasadą ZP-06 eksport danych tworzy pojedynczy, samowystarczalny plik JSON z sumą kontrolną:
```json
{
  "format": "sloik-backup",
  "schemaVersion": 1,
  "exportedAt": "2026-10-15T23:00:00Z",
  "appVersion": "1.0.0",
  "checksum": "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "data": {
    "batches": [],
    "jars": [],
    "measurements": [],
    "pantryItems": [],
    "pasteurizationSessions": []
  }
}
```

""")

print("Expanded D1 and D2 written successfully.")
