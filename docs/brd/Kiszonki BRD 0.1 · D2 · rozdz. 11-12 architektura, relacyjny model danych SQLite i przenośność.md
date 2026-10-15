# **Kiszonki, przetwory, słoiki BRD 0.1 — Część D2: Architektura techniczna i model danych SQLite (Rozdz. 11–12)**

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

