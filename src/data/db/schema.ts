// ============================================================================
// Słoik (Jarwise) — Local SQLite Database Schema (BR-DANE-001…003)
// Transactional, 100% Offline-First, WAL mode, ACID compliance.
// Apps4Brew Studio.
// ============================================================================

export const SQLITE_INIT_QUERIES = [
  `PRAGMA journal_mode = WAL;`,
  `PRAGMA foreign_keys = ON;`,

  `CREATE TABLE IF NOT EXISTS batches (
    id TEXT PRIMARY KEY NOT NULL,
    recipe_id TEXT NOT NULL,
    recipe_title TEXT NOT NULL,
    culture TEXT NOT NULL,
    method TEXT NOT NULL,
    started_at INTEGER NOT NULL,
    target_fermentation_days INTEGER NOT NULL,
    produce_weight_grams REAL NOT NULL,
    water_weight_grams REAL NOT NULL,
    salt_weight_grams REAL NOT NULL,
    salinity_percent REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'fermenting', -- 'fermenting' | 'pantry' | 'consumed' | 'discarded'
    rating_stars INTEGER,
    notes TEXT,
    qr_code_uri TEXT,
    created_at INTEGER NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS pantry_items (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL,
    label TEXT NOT NULL,
    jar_volume_ml INTEGER NOT NULL DEFAULT 1000,
    location TEXT NOT NULL DEFAULT 'pantry_cupboard', -- 'cellar' | 'pantry_cupboard' | 'fridge'
    quantity INTEGER NOT NULL DEFAULT 1,
    sealed_at INTEGER NOT NULL,
    best_before INTEGER NOT NULL,
    opened_at INTEGER,
    is_consumed INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(batch_id) REFERENCES batches(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS fermentation_logs (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL,
    logged_at INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    sensory_note TEXT,
    ph_reading REAL,
    burped INTEGER NOT NULL DEFAULT 1,
    tasted INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(batch_id) REFERENCES batches(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS custom_recipes (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    culture TEXT NOT NULL DEFAULT 'Własny przepis',
    category TEXT NOT NULL,
    method TEXT NOT NULL,
    produce_weight_grams REAL NOT NULL,
    salinity_percent REAL NOT NULL,
    fermentation_days INTEGER NOT NULL,
    shelf_life_months INTEGER NOT NULL DEFAULT 12,
    ingredients_json TEXT NOT NULL,
    steps_json TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );`
];
