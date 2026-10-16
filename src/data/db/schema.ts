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
  );`,

  `CREATE TABLE IF NOT EXISTS experiment_series (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    base_produce_name TEXT NOT NULL,
    total_produce_grams REAL NOT NULL,
    jar_count INTEGER NOT NULL,
    hypothesis TEXT NOT NULL,
    axis TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    blind_cupping_enabled INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    completed_at INTEGER
  );`,

  `CREATE TABLE IF NOT EXISTS experiment_variants (
    id TEXT PRIMARY KEY NOT NULL,
    series_id TEXT NOT NULL,
    variant_letter TEXT NOT NULL,
    name TEXT NOT NULL,
    parameter_delta TEXT NOT NULL,
    produce_grams REAL NOT NULL,
    water_grams REAL NOT NULL,
    salt_grams REAL NOT NULL,
    salinity_percent REAL NOT NULL,
    special_additions_json TEXT NOT NULL DEFAULT '[]',
    batch_id TEXT,
    sensory_score_json TEXT,
    is_winner INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(series_id) REFERENCES experiment_series(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS pantry_ingredients (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'salt' | 'vinegar' | 'produce' | 'spice' | 'jar_lid'
    stock_amount REAL NOT NULL,
    unit TEXT NOT NULL,
    cost_per_unit REAL NOT NULL DEFAULT 0.0,
    updated_at INTEGER NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS custom_equipment (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    jar_volume_ml INTEGER NOT NULL,
    seal_type TEXT NOT NULL,
    tare_weight_grams REAL NOT NULL DEFAULT 0.0,
    notes TEXT,
    created_at INTEGER NOT NULL
  );`
];


