// ============================================================================
// Słoik (Jarwise) — Local Database Repository (BR-DANE-001)
// Clean architecture repository for Batches, Pantry Items, and Ferment Logs.
// 100% Offline-First, Zero Data Loss.
// ============================================================================

import * as SQLite from 'expo-sqlite';
import { dbDirectory } from '../../lib/db-path';
import { SQLITE_INIT_QUERIES } from './schema';
import { autoBackup, SloikBackupData } from '../../lib/backup';
import { MASTER_RECIPES } from '../../core/recipes/recipes-data';
import { MasterRecipe } from '../../core/types';
import {
  ExperimentSeries,
  ExperimentVariant,
  SensoryEvaluation,
} from '../../core/experiments/types';
import { promoteVariantToCustomRecipe } from '../../core/experiments/experiment-engine';
import { FermentSensoryProfile } from '../../core/sensory-radar';

export interface BatchRecord {
  id: string;
  recipeId: string;
  recipeTitle: string;
  culture: string;
  method: string;
  startedAt: number;
  targetFermentationDays: number;
  produceWeightGrams: number;
  waterWeightGrams: number;
  saltWeightGrams: number;
  salinityPercent: number;
  status: 'fermenting' | 'pantry' | 'consumed' | 'discarded';
  ratingStars?: number;
  notes?: string;
  qrCodeUri?: string;
  createdAt: number;
}

export interface PantryItemRecord {
  id: string;
  batchId: string;
  label: string;
  jarVolumeMl: number;
  location: 'cellar' | 'pantry_cupboard' | 'fridge';
  quantity: number;
  sealedAt: number;
  bestBefore: number;
  openedAt?: number;
  isConsumed: boolean;
}

export interface FermentationLogRecord {
  id: string;
  batchId: string;
  loggedAt: number;
  dayNumber: number;
  sensoryNote?: string;
  phReading?: number;
  burped: boolean;
  tasted: boolean;
  sensoryProfile?: FermentSensoryProfile;
}

export interface PantryIngredientRecord {
  id: string;
  name: string;
  category: 'salt' | 'vinegar' | 'produce' | 'spice' | 'jar_lid';
  stockAmount: number;
  unit: string;
  costPerUnit: number;
  updatedAt: number;
}

export interface DatabaseBackupPayload {
  version: number;
  exportedAt: number;
  batches: BatchRecord[];
  pantryItems: PantryItemRecord[];
  fermentationLogs: FermentationLogRecord[];
  experimentSeries?: ExperimentSeries[];
  customRecipes?: MasterRecipe[];
  pantryIngredients?: PantryIngredientRecord[];
}


export class LocalDatabaseStore {
  private db: any = null;
  private batches: BatchRecord[] = [];
  private pantryItems: PantryItemRecord[] = [];
  private fermentationLogs: FermentationLogRecord[] = [];
  private experimentSeries: ExperimentSeries[] = [];
  private customRecipes: MasterRecipe[] = [];
  private pantryIngredients: PantryIngredientRecord[] = [];
  private settings: Map<string, string> = new Map();
  private initialized = false;
  private clearedForTesting = false;

  public ensureInitialized(): void {
    if (!this.initialized && !this.clearedForTesting) {
      this.init();
    }
  }

  public init(): void {
    if (this.initialized) return;
    this.clearedForTesting = false;

    // Próba podłączenia bezpiecznej bazy SQLite w /Library/SQLite (Apps4Brew SEC-09)
    if (!this.db) {
      try {
        if (SQLite && typeof (SQLite as any).openDatabaseSync === 'function') {
          const safeDir = dbDirectory((SQLite as any).defaultDatabaseDirectory);
          this.db = safeDir
            ? (SQLite as any).openDatabaseSync('sloik.db', undefined, safeDir)
            : (SQLite as any).openDatabaseSync('sloik.db');
          if (this.db) {
            for (const query of SQLITE_INIT_QUERIES) {
              try {
                this.db.execSync?.(query);
              } catch {
                // Ignoruj błąd gdy tabele już istnieją
              }
            }
          }
        }
      } catch {
        // In-memory fallback dla środowiska testowego Node/Jest
      }
    }

    let loadedFromDb = false;
    if (this.db && typeof this.db.getFirstSync === 'function') {
      try {
        const countRow = this.db.getFirstSync('SELECT count(*) as count FROM batches');
        const batchCount = countRow ? Number((countRow as any).count ?? (countRow as any)['count(*)'] ?? 0) : 0;

        if (batchCount > 0) {
          // 1. Wczytaj partie (Batches)
          const batchRows = (this.db.getAllSync('SELECT * FROM batches ORDER BY started_at DESC') || []) as any[];
          this.batches = batchRows.map((r) => ({
            id: String(r.id),
            recipeId: String(r.recipe_id),
            recipeTitle: String(r.recipe_title),
            culture: String(r.culture),
            method: String(r.method),
            startedAt: Number(r.started_at),
            targetFermentationDays: Number(r.target_fermentation_days),
            produceWeightGrams: Number(r.produce_weight_grams),
            waterWeightGrams: Number(r.water_weight_grams),
            saltWeightGrams: Number(r.salt_weight_grams),
            salinityPercent: Number(r.salinity_percent),
            status: r.status as BatchRecord['status'],
            ratingStars: r.rating_stars != null ? Number(r.rating_stars) : undefined,
            notes: r.notes || undefined,
            qrCodeUri: r.qr_code_uri || undefined,
            createdAt: Number(r.created_at),
          }));

          // 2. Wczytaj słoiki w spiżarni (Pantry Items)
          const pantryRows = (this.db.getAllSync('SELECT * FROM pantry_items ORDER BY sealed_at DESC') || []) as any[];
          this.pantryItems = pantryRows.map((r) => ({
            id: String(r.id),
            batchId: String(r.batch_id),
            label: String(r.label),
            jarVolumeMl: Number(r.jar_volume_ml),
            location: r.location,
            quantity: Number(r.quantity),
            sealedAt: Number(r.sealed_at),
            bestBefore: Number(r.best_before),
            openedAt: r.opened_at != null ? Number(r.opened_at) : undefined,
            isConsumed: Boolean(r.is_consumed),
          }));

          // 3. Wczytaj wpisy dziennika (Fermentation Logs)
          const logRows = (this.db.getAllSync('SELECT * FROM fermentation_logs ORDER BY logged_at ASC') || []) as any[];
          this.fermentationLogs = logRows.map((r) => ({
            id: String(r.id),
            batchId: String(r.batch_id),
            loggedAt: Number(r.logged_at),
            dayNumber: Number(r.day_number),
            sensoryNote: r.sensory_note || undefined,
            phReading: r.ph_reading != null ? Number(r.ph_reading) : undefined,
            burped: Boolean(r.burped),
            tasted: Boolean(r.tasted),
          }));

          // 4. Wczytaj receptury własne (Custom Recipes)
          const customRecipeRows = (this.db.getAllSync('SELECT * FROM custom_recipes ORDER BY created_at DESC') || []) as any[];
          this.customRecipes = customRecipeRows.map((r) => {
            let ingredients = [];
            let steps = [];
            try { ingredients = JSON.parse(r.ingredients_json || '[]'); } catch {}
            try { steps = JSON.parse(r.steps_json || '[]'); } catch {}
            return {
              id: String(r.id),
              title: String(r.title),
              subtitle: String(r.subtitle || ''),
              culture: String(r.culture || 'Własny przepis'),
              category: r.category,
              method: r.method,
              defaultProduceWeightGrams: Number(r.produce_weight_grams || 1000),
              defaultSalinityPercent: Number(r.salinity_percent || 2.0),
              fermentationDays: Number(r.fermentation_days || 7),
              shelfLifeMonths: Number(r.shelf_life_months || 12),
              recommendedJarType: 'Słoik 1000 ml',
              ingredients,
              steps,
              crispnessSecrets: [],
              sensoryMilestones: [],
              commonMistakes: [],
            };
          });

          // 5. Wczytaj serie eksperymentów (Experiment Series)
          const expRows = (this.db.getAllSync('SELECT * FROM experiment_series ORDER BY created_at DESC') || []) as any[];
          this.experimentSeries = expRows.map((r) => {
            const variantRows = (this.db.getAllSync('SELECT * FROM experiment_variants WHERE series_id = ?', [r.id]) || []) as any[];
            const variants = variantRows.map((vr) => {
              let specialAdditions = [];
              let sensoryScore = undefined;
              try { specialAdditions = JSON.parse(vr.special_additions_json || '[]'); } catch {}
              try { sensoryScore = vr.sensory_score_json ? JSON.parse(vr.sensory_score_json) : undefined; } catch {}
              return {
                id: String(vr.id),
                seriesId: String(vr.series_id),
                variantLetter: String(vr.variant_letter),
                name: String(vr.name),
                parameterDelta: String(vr.parameter_delta),
                produceGrams: Number(vr.produce_grams),
                waterGrams: Number(vr.water_grams),
                saltGrams: Number(vr.salt_grams),
                salinityPercent: Number(vr.salinity_percent),
                specialAdditions,
                batchId: vr.batch_id || undefined,
                sensoryScore,
                isWinner: Boolean(vr.is_winner),
              };
            });

            return {
              id: String(r.id),
              title: String(r.title),
              baseProduceName: String(r.base_produce_name),
              totalProduceGrams: Number(r.total_produce_grams),
              jarCount: Number(r.jar_count),
              hypothesis: String(r.hypothesis),
              axis: r.axis,
              status: r.status,
              blindCuppingEnabled: Boolean(r.blind_cupping_enabled),
              createdAt: Number(r.created_at),
              completedAt: r.completed_at != null ? Number(r.completed_at) : undefined,
              variants,
            };
          });

          // 6. Wczytaj surowce magazynu (Pantry Ingredients)
          const ingRows = (this.db.getAllSync('SELECT * FROM pantry_ingredients ORDER BY name ASC') || []) as any[];
          if (ingRows.length > 0) {
            this.pantryIngredients = ingRows.map((r) => ({
              id: String(r.id),
              name: String(r.name),
              category: r.category,
              stockAmount: Number(r.stock_amount),
              unit: String(r.unit),
              costPerUnit: Number(r.cost_per_unit),
              updatedAt: Number(r.updated_at),
            }));
          }

          // 7. Wczytaj ustawienia (App Settings)
          const settingRows = (this.db.getAllSync('SELECT key, value FROM app_settings') || []) as any[];
          for (const s of settingRows) {
            if (s.key && s.value != null) {
              this.settings.set(String(s.key), String(s.value));
            }
          }

          loadedFromDb = true;
        }
      } catch {
        // Fallback do ziaren demonstracyjnych
      }
    }

    if (!loadedFromDb) {
      // Przykładowa partia początkowa — dla demonstracji domowej spiżarni
      const now = Date.now();
      const demoBatchId = 'batch_demo_01';

      this.batches = [
        {
          id: demoBatchId,
          recipeId: 'REC-01',
          recipeTitle: 'Ogórki małosolne chrupiące',
          culture: 'Polska',
          method: 'lacto_fermentation',
          startedAt: now - 1000 * 60 * 60 * 36, // 36 godzin temu
          targetFermentationDays: 3,
          produceWeightGrams: 600,
          waterWeightGrams: 500,
          saltWeightGrams: 22.4,
          salinityPercent: 2.0,
          status: 'fermenting',
          notes: 'Ogórki z targu od pani Stasi, dodane liście wiśni.',
          qrCodeUri: `sloik://batch/${demoBatchId}`,
          createdAt: now - 1000 * 60 * 60 * 36,
        },
      ];

      this.fermentationLogs = [
        {
          id: 'log_demo_01',
          batchId: demoBatchId,
          loggedAt: now - 1000 * 60 * 60 * 12,
          dayNumber: 1,
          sensoryNote: 'Zalewa mętna, czuć silny zapach czosnku i kopru.',
          burped: true,
          tasted: false,
          sensoryProfile: {
            acidity: 2,
            salinity: 3,
            crispness: 5,
            effervescence: 3,
            aroma: 4,
          },
        },
      ];

      this.experimentSeries = [
        {
          id: 'exp_demo_01',
          title: 'Wielki Test Chrupkości Ogórka 2026',
          baseProduceName: 'Ogórki gruntowe Śremski',
          totalProduceGrams: 2000,
          jarCount: 4,
          hypothesis: 'Wpływ źródeł tanin i soli na chrupkość po 14 dniach',
          axis: 'tannins_crispness',
          status: 'fermenting',
          blindCuppingEnabled: true,
          createdAt: now - 1000 * 60 * 60 * 48,
          variants: [
            {
              id: 'exp_demo_01_var_a',
              seriesId: 'exp_demo_01',
              variantLetter: 'A',
              name: 'Słoik A (Kontrola)',
              parameterDelta: 'Bez dodatków garbnikowych (solanka 2.0%)',
              produceGrams: 500,
              waterGrams: 400,
              saltGrams: 18.0,
              salinityPercent: 2.0,
              specialAdditions: ['Koper: 1 baldach', 'Czosnek: 2 ząbki'],
            },
            {
              id: 'exp_demo_01_var_b',
              seriesId: 'exp_demo_01',
              variantLetter: 'B',
              name: 'Słoik B (Liść dębu)',
              parameterDelta: '2 świeże liście dębu (taniny elagowe)',
              produceGrams: 500,
              waterGrams: 400,
              saltGrams: 18.0,
              salinityPercent: 2.0,
              specialAdditions: ['Koper: 1 baldach', 'Czosnek: 2 ząbki', 'Liście dębu: 2 szt.'],
            },
            {
              id: 'exp_demo_01_var_c',
              seriesId: 'exp_demo_01',
              variantLetter: 'C',
              name: 'Słoik C (Liść czarnej porzeczki)',
              parameterDelta: '3 liście czarnej porzeczki (taniny + enzymy)',
              produceGrams: 500,
              waterGrams: 400,
              saltGrams: 18.0,
              salinityPercent: 2.0,
              specialAdditions: ['Koper: 1 baldach', 'Czosnek: 2 ząbki', 'Liście porzeczki: 3 szt.'],
            },
            {
              id: 'exp_demo_01_var_d',
              seriesId: 'exp_demo_01',
              variantLetter: 'D',
              name: 'Słoik D (Chlorek wapnia CaCl2)',
              parameterDelta: '0.5g CaCl2 na słoik (mostki pektynowe)',
              produceGrams: 500,
              waterGrams: 400,
              saltGrams: 18.0,
              salinityPercent: 2.0,
              specialAdditions: ['Koper: 1 baldach', 'Czosnek: 2 ząbki', 'CaCl2: 0.5g'],
            },
          ],
        },
      ];

      this.pantryIngredients = [
        {
          id: 'ing_salt_klodawa',
          name: 'Sól kamienna niejodowana Kłodawa',
          category: 'salt',
          stockAmount: 3.0,
          unit: 'kg',
          costPerUnit: 3.0,
          updatedAt: now,
        },
        {
          id: 'ing_vinegar_apple',
          name: 'Żywy ocet jabłkowy 5%',
          category: 'vinegar',
          stockAmount: 1.5,
          unit: 'L',
          costPerUnit: 14.0,
          updatedAt: now,
        },
        {
          id: 'ing_garlic',
          name: 'Czosnek polski Harnaś',
          category: 'spice',
          stockAmount: 12,
          unit: 'główek',
          costPerUnit: 2.5,
          updatedAt: now,
        },
        {
          id: 'ing_empty_jars_1000',
          name: 'Słoiki Weck / Twist-off 1000 ml',
          category: 'jar_lid',
          stockAmount: 16,
          unit: 'szt.',
          costPerUnit: 2.2,
          updatedAt: now,
        },
      ];

      // Jeśli SQLite jest dostępne, zapisz demonstracyjne dane startowe do bazy
      try {
        if (this.db && typeof this.db.runSync === 'function') {
          const b = this.batches[0];
          this.db.runSync(
            `INSERT OR REPLACE INTO batches (
              id, recipe_id, recipe_title, culture, method, started_at,
              target_fermentation_days, produce_weight_grams, water_weight_grams,
              salt_weight_grams, salinity_percent, status, notes, qr_code_uri, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              b.id, b.recipeId, b.recipeTitle, b.culture, b.method, b.startedAt,
              b.targetFermentationDays, b.produceWeightGrams, b.waterWeightGrams,
              b.saltWeightGrams, b.salinityPercent, b.status, b.notes ?? null,
              b.qrCodeUri ?? null, b.createdAt,
            ]
          );

          const l = this.fermentationLogs[0];
          this.db.runSync(
            `INSERT OR REPLACE INTO fermentation_logs (
              id, batch_id, logged_at, day_number, sensory_note, ph_reading, burped, tasted
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [l.id, l.batchId, l.loggedAt, l.dayNumber, l.sensoryNote ?? null, null, l.burped ? 1 : 0, l.tasted ? 1 : 0]
          );

          const s = this.experimentSeries[0];
          this.db.runSync(
            `INSERT OR REPLACE INTO experiment_series (
              id, title, base_produce_name, total_produce_grams, jar_count,
              hypothesis, axis, status, blind_cupping_enabled, created_at, completed_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              s.id, s.title, s.baseProduceName, s.totalProduceGrams, s.jarCount,
              s.hypothesis, s.axis, s.status, s.blindCuppingEnabled ? 1 : 0,
              s.createdAt, null,
            ]
          );

          for (const v of s.variants) {
            this.db.runSync(
              `INSERT OR REPLACE INTO experiment_variants (
                id, series_id, variant_letter, name, parameter_delta,
                produce_grams, water_grams, salt_grams, salinity_percent,
                special_additions_json, batch_id, sensory_score_json, is_winner
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                v.id, s.id, v.variantLetter, v.name, v.parameterDelta,
                v.produceGrams, v.waterGrams, v.saltGrams, v.salinityPercent,
                JSON.stringify(v.specialAdditions || []), null, null, 0,
              ]
            );
          }

          for (const ing of this.pantryIngredients) {
            this.db.runSync(
              `INSERT OR REPLACE INTO pantry_ingredients (
                id, name, category, stock_amount, unit, cost_per_unit, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [ing.id, ing.name, ing.category, ing.stockAmount, ing.unit, ing.costPerUnit, ing.updatedAt]
            );
          }
        }
      } catch {}
    }

    this.initialized = true;
  }

  // --- Zarządzanie Partiami (Batches) ---

  public createBatch(
    input: Omit<BatchRecord, 'id' | 'createdAt' | 'qrCodeUri'> & { id?: string }
  ): BatchRecord {
    this.ensureInitialized();
    const id = input.id || `batch_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newBatch: BatchRecord = {
      ...input,
      id,
      qrCodeUri: `sloik://batch/${id}`,
      createdAt: Date.now(),
    };
    this.batches.unshift(newBatch);

    try {
      if (this.db && typeof this.db.runSync === 'function') {
        this.db.runSync(
          `INSERT OR REPLACE INTO batches (
            id, recipe_id, recipe_title, culture, method, started_at,
            target_fermentation_days, produce_weight_grams, water_weight_grams,
            salt_weight_grams, salinity_percent, status, notes, qr_code_uri, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newBatch.id,
            newBatch.recipeId,
            newBatch.recipeTitle,
            newBatch.culture,
            newBatch.method,
            newBatch.startedAt,
            newBatch.targetFermentationDays,
            newBatch.produceWeightGrams,
            newBatch.waterWeightGrams,
            newBatch.saltWeightGrams,
            newBatch.salinityPercent,
            newBatch.status,
            newBatch.notes ?? null,
            newBatch.qrCodeUri ?? null,
            newBatch.createdAt,
          ]
        );
      }
    } catch {
      // Ignoruj w testach
    }

    autoBackup(this.getBackupData()).catch(() => {});
    return newBatch;
  }


  public getBatchById(id: string): BatchRecord | undefined {
    this.ensureInitialized();
    return this.batches.find((b) => b.id === id);
  }

  public getAllBatches(): BatchRecord[] {
    this.ensureInitialized();
    return [...this.batches];
  }

  public getActiveFerments(): BatchRecord[] {
    this.ensureInitialized();
    return this.batches.filter((b) => b.status === 'fermenting');
  }

  public updateBatchStatus(
    id: string,
    status: BatchRecord['status'],
    ratingStars?: number,
    notes?: string
  ): boolean {
    this.ensureInitialized();
    const batch = this.batches.find((b) => b.id === id);
    if (!batch) return false;

    batch.status = status;
    if (ratingStars !== undefined) batch.ratingStars = ratingStars;
    if (notes !== undefined) batch.notes = notes;

    try {
      if (this.db && typeof this.db.runSync === 'function') {
        this.db.runSync(
          `UPDATE batches SET status = ?, rating_stars = ?, notes = ? WHERE id = ?`,
          [batch.status, batch.ratingStars ?? null, batch.notes ?? null, batch.id]
        );
      }
    } catch {}

    autoBackup(this.getBackupData()).catch(() => {});
    return true;
  }

  // --- Spiżarnia (Pantry Items) ---

  public addPantryItem(
    input: Omit<PantryItemRecord, 'id' | 'isConsumed'> & { id?: string }
  ): PantryItemRecord {
    this.ensureInitialized();
    const id = input.id || `pantry_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newItem: PantryItemRecord = {
      ...input,
      id,
      isConsumed: false,
    };
    this.pantryItems.unshift(newItem);

    try {
      if (this.db && typeof this.db.runSync === 'function') {
        this.db.runSync(
          `INSERT OR REPLACE INTO pantry_items (
            id, batch_id, label, jar_volume_ml, location, quantity,
            sealed_at, best_before, is_consumed
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newItem.id,
            newItem.batchId,
            newItem.label,
            newItem.jarVolumeMl,
            newItem.location,
            newItem.quantity,
            newItem.sealedAt,
            newItem.bestBefore,
            newItem.isConsumed ? 1 : 0,
          ]
        );
      }
    } catch {}

    autoBackup(this.getBackupData()).catch(() => {});
    return newItem;
  }

  public getPantryItems(filterLocation?: PantryItemRecord['location']): PantryItemRecord[] {
    this.ensureInitialized();
    return this.pantryItems
      .filter((item) => !item.isConsumed)
      .filter((item) => (filterLocation ? item.location === filterLocation : true));
  }

  public consumePantryItem(itemId: string, quantityToConsume: number = 1): boolean {
    this.ensureInitialized();
    const item = this.pantryItems.find((i) => i.id === itemId);
    if (!item) return false;

    if (item.quantity <= quantityToConsume) {
      item.quantity = 0;
      item.isConsumed = true;
      item.openedAt = Date.now();
    } else {
      item.quantity -= quantityToConsume;
    }

    try {
      if (this.db && typeof this.db.runSync === 'function') {
        this.db.runSync(
          `UPDATE pantry_items SET quantity = ?, is_consumed = ?, opened_at = ? WHERE id = ?`,
          [item.quantity, item.isConsumed ? 1 : 0, item.openedAt ?? null, item.id]
        );
      }
    } catch {}

    autoBackup(this.getBackupData()).catch(() => {});
    return true;
  }

  // --- Dziennik Fermentacji (Logs) ---

  public addFermentationLog(
    input: Omit<FermentationLogRecord, 'id' | 'loggedAt'> & { id?: string }
  ): FermentationLogRecord {
    this.ensureInitialized();
    const id = input.id || `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newLog: FermentationLogRecord = {
      ...input,
      id,
      loggedAt: Date.now(),
    };
    this.fermentationLogs.push(newLog);

    try {
      if (this.db && typeof this.db.runSync === 'function') {
        this.db.runSync(
          `INSERT OR REPLACE INTO fermentation_logs (
            id, batch_id, logged_at, day_number, sensory_note, ph_reading, burped, tasted
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newLog.id,
            newLog.batchId,
            newLog.loggedAt,
            newLog.dayNumber,
            newLog.sensoryNote ?? null,
            newLog.phReading ?? null,
            newLog.burped ? 1 : 0,
            newLog.tasted ? 1 : 0,
          ]
        );
      }
    } catch {}

    autoBackup(this.getBackupData()).catch(() => {});
    return newLog;
  }


  public getLogsForBatch(batchId: string): FermentationLogRecord[] {
    this.ensureInitialized();
    return this.fermentationLogs
      .filter((l) => l.batchId === batchId)
      .sort((a, b) => a.dayNumber - b.dayNumber);
  }

  // --- Laboratorium Eksperymentów & Panel Sensoryczny (Multi-Jar Split-Batch) ---

  public createExperimentSeries(series: ExperimentSeries): ExperimentSeries {
    this.ensureInitialized();
    this.experimentSeries.unshift(series);
    try {
      if (this.db && typeof this.db.runSync === 'function') {
        this.db.runSync(
          `INSERT OR REPLACE INTO experiment_series (
            id, title, base_produce_name, total_produce_grams, jar_count,
            hypothesis, axis, status, blind_cupping_enabled, created_at, completed_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            series.id,
            series.title,
            series.baseProduceName,
            series.totalProduceGrams,
            series.jarCount,
            series.hypothesis,
            series.axis,
            series.status,
            series.blindCuppingEnabled ? 1 : 0,
            series.createdAt,
            series.completedAt ?? null,
          ]
        );
        for (const v of series.variants) {
          this.db.runSync(
            `INSERT OR REPLACE INTO experiment_variants (
              id, series_id, variant_letter, name, parameter_delta,
              produce_grams, water_grams, salt_grams, salinity_percent,
              special_additions_json, batch_id, sensory_score_json, is_winner
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              v.id,
              series.id,
              v.variantLetter,
              v.name,
              v.parameterDelta,
              v.produceGrams,
              v.waterGrams,
              v.saltGrams,
              v.salinityPercent,
              JSON.stringify(v.specialAdditions || []),
              v.batchId ?? null,
              v.sensoryScore ? JSON.stringify(v.sensoryScore) : null,
              v.isWinner ? 1 : 0,
            ]
          );
        }
      }
    } catch {}

    autoBackup(this.getBackupData()).catch(() => {});
    return series;
  }

  public getAllExperimentSeries(): ExperimentSeries[] {
    this.ensureInitialized();
    return [...this.experimentSeries];
  }

  public getExperimentSeriesById(id: string): ExperimentSeries | undefined {
    this.ensureInitialized();
    return this.experimentSeries.find((s) => s.id === id);
  }

  public updateExperimentSeriesStatus(
    id: string,
    status: ExperimentSeries['status']
  ): boolean {
    this.ensureInitialized();
    const series = this.experimentSeries.find((s) => s.id === id);
    if (!series) return false;
    series.status = status;
    if (status === 'completed') {
      series.completedAt = Date.now();
    }
    try {
      if (this.db && typeof this.db.runSync === 'function') {
        this.db.runSync(
          `UPDATE experiment_series SET status = ?, completed_at = ? WHERE id = ?`,
          [series.status, series.completedAt ?? null, id]
        );
      }
    } catch {}

    autoBackup(this.getBackupData()).catch(() => {});
    return true;
  }

  public toggleBlindCupping(id: string, enabled: boolean): boolean {
    this.ensureInitialized();
    const series = this.experimentSeries.find((s) => s.id === id);
    if (!series) return false;
    series.blindCuppingEnabled = enabled;
    try {
      if (this.db && typeof this.db.runSync === 'function') {
        this.db.runSync(
          `UPDATE experiment_series SET blind_cupping_enabled = ? WHERE id = ?`,
          [enabled ? 1 : 0, id]
        );
      }
    } catch {}
    return true;
  }

  public updateVariantSensoryScore(
    seriesId: string,
    variantId: string,
    score: SensoryEvaluation
  ): boolean {
    this.ensureInitialized();
    const series = this.experimentSeries.find((s) => s.id === seriesId);
    if (!series) return false;
    const variant = series.variants.find((v) => v.id === variantId);
    if (!variant) return false;

    variant.sensoryScore = score;
    try {
      if (this.db && typeof this.db.runSync === 'function') {
        this.db.runSync(
          `UPDATE experiment_variants SET sensory_score_json = ? WHERE id = ? AND series_id = ?`,
          [JSON.stringify(score), variantId, seriesId]
        );
      }
    } catch {}
    return true;
  }

  public toggleVariantWinner(
    seriesId: string,
    variantId: string,
    isWinner: boolean
  ): boolean {
    this.ensureInitialized();
    const series = this.experimentSeries.find((s) => s.id === seriesId);
    if (!series) return false;
    const variant = series.variants.find((v) => v.id === variantId);
    if (!variant) return false;

    variant.isWinner = isWinner;
    try {
      if (this.db && typeof this.db.runSync === 'function') {
        this.db.runSync(
          `UPDATE experiment_variants SET is_winner = ? WHERE id = ? AND series_id = ?`,
          [isWinner ? 1 : 0, variantId, seriesId]
        );
      }
    } catch {}
    return true;
  }

  public saveCustomRecipe(recipe: MasterRecipe): MasterRecipe {
    this.ensureInitialized();
    const idx = this.customRecipes.findIndex((r) => r.id === recipe.id);
    if (idx >= 0) {
      this.customRecipes[idx] = recipe;
    } else {
      this.customRecipes.unshift(recipe);
    }
    try {
      if (this.db && typeof this.db.runSync === 'function') {
        this.db.runSync(
          `INSERT OR REPLACE INTO custom_recipes (
            id, title, subtitle, culture, category, method,
            produce_weight_grams, salinity_percent, fermentation_days,
            shelf_life_months, ingredients_json, steps_json, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            recipe.id,
            recipe.title,
            recipe.subtitle ?? null,
            recipe.culture,
            recipe.category,
            recipe.method,
            recipe.defaultProduceWeightGrams ?? 1000,
            recipe.defaultSalinityPercent ?? 2.0,
            recipe.fermentationDays ?? 7,
            recipe.shelfLifeMonths ?? 12,
            JSON.stringify(recipe.ingredients || []),
            JSON.stringify(recipe.steps || []),
            Date.now(),
          ]
        );
      }
    } catch {}

    autoBackup(this.getBackupData()).catch(() => {});
    return recipe;
  }

  public getCustomRecipes(): MasterRecipe[] {
    this.ensureInitialized();
    return [...this.customRecipes];
  }

  public promoteVariantToMasterRecipe(
    seriesId: string,
    variantId: string,
    customTitle?: string
  ): MasterRecipe | null {
    this.ensureInitialized();
    const series = this.experimentSeries.find((s) => s.id === seriesId);
    if (!series) return null;
    const variant = series.variants.find((v) => v.id === variantId);
    if (!variant) return null;

    variant.isWinner = true;
    const masterRecipe = promoteVariantToCustomRecipe(variant, series.title, customTitle);
    this.saveCustomRecipe(masterRecipe);
    return masterRecipe;
  }

  // --- Magazyn Surowców Spiżarni (Pantry Ingredients / Inventory — Parity S4) ---

  public getPantryIngredients(): PantryIngredientRecord[] {
    this.ensureInitialized();
    return [...this.pantryIngredients];
  }

  public addPantryIngredient(
    input: Omit<PantryIngredientRecord, 'id' | 'updatedAt'> & { id?: string }
  ): PantryIngredientRecord {
    this.ensureInitialized();
    const id = input.id || `ing_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newItem: PantryIngredientRecord = {
      ...input,
      id,
      updatedAt: Date.now(),
    };
    this.pantryIngredients.unshift(newItem);

    try {
      if (this.db && typeof this.db.runSync === 'function') {
        this.db.runSync(
          `INSERT OR REPLACE INTO pantry_ingredients (
            id, name, category, stock_amount, unit, cost_per_unit, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            newItem.id,
            newItem.name,
            newItem.category,
            newItem.stockAmount,
            newItem.unit,
            newItem.costPerUnit,
            newItem.updatedAt,
          ]
        );
      }
    } catch {}

    return newItem;
  }

  public updatePantryIngredientStock(id: string, newAmount: number): boolean {
    this.ensureInitialized();
    const item = this.pantryIngredients.find((i) => i.id === id);
    if (!item) return false;
    item.stockAmount = Math.max(0, Math.round(newAmount * 100) / 100);
    item.updatedAt = Date.now();

    try {
      if (this.db && typeof this.db.runSync === 'function') {
        this.db.runSync(
          `UPDATE pantry_ingredients SET stock_amount = ?, updated_at = ? WHERE id = ?`,
          [item.stockAmount, item.updatedAt, id]
        );
      }
    } catch {}

    return true;
  }

  public deductIngredientsForBatch(params: {
    produceKg?: number;
    saltKg?: number;
    jarsCount?: number;
  }): boolean {
    this.ensureInitialized();
    if (params.saltKg) {
      const saltItem = this.pantryIngredients.find((i) => i.category === 'salt');
      if (saltItem) {
        saltItem.stockAmount = Math.max(
          0,
          Math.round((saltItem.stockAmount - params.saltKg) * 100) / 100
        );
        saltItem.updatedAt = Date.now();
        try {
          if (this.db && typeof this.db.runSync === 'function') {
            this.db.runSync(
              `UPDATE pantry_ingredients SET stock_amount = ?, updated_at = ? WHERE id = ?`,
              [saltItem.stockAmount, saltItem.updatedAt, saltItem.id]
            );
          }
        } catch {}
      }
    }
    if (params.jarsCount) {
      const jarItem = this.pantryIngredients.find((i) => i.category === 'jar_lid');
      if (jarItem) {
        jarItem.stockAmount = Math.max(0, jarItem.stockAmount - params.jarsCount);
        jarItem.updatedAt = Date.now();
        try {
          if (this.db && typeof this.db.runSync === 'function') {
            this.db.runSync(
              `UPDATE pantry_ingredients SET stock_amount = ?, updated_at = ? WHERE id = ?`,
              [jarItem.stockAmount, jarItem.updatedAt, jarItem.id]
            );
          }
        } catch {}
      }
    }
    return true;
  }

  public getBackupData(): SloikBackupData {
    this.ensureInitialized();
    return {
      batches: this.batches,
      pantryItems: this.pantryItems,
      fermentationLogs: this.fermentationLogs,
      experimentSeries: this.experimentSeries,
      customRecipes: this.customRecipes,
    };
  }

  // --- Eksport i Import Kopii Zapasowej JSON (Zero Data Loss) ---

  public exportBackupJson(): string {
    this.ensureInitialized();
    const payload: DatabaseBackupPayload = {
      version: 1,
      exportedAt: Date.now(),
      batches: this.batches,
      pantryItems: this.pantryItems,
      fermentationLogs: this.fermentationLogs,
      experimentSeries: this.experimentSeries,
      customRecipes: this.customRecipes,
      pantryIngredients: this.pantryIngredients,
    };
    return JSON.stringify(payload, null, 2);
  }

  public importBackupJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString) as DatabaseBackupPayload;
      if (!data || !Array.isArray(data.batches) || !Array.isArray(data.pantryItems)) {
        return false;
      }

      this.batches = data.batches;
      this.pantryItems = data.pantryItems;
      this.fermentationLogs = data.fermentationLogs || [];
      this.experimentSeries = data.experimentSeries || [];
      this.customRecipes = data.customRecipes || [];
      this.pantryIngredients = data.pantryIngredients || this.pantryIngredients;
      this.initialized = true;
      this.clearedForTesting = false;

      try {
        if (this.db && typeof this.db.runSync === 'function') {
          for (const b of this.batches) {
            this.db.runSync(
              `INSERT OR REPLACE INTO batches (
                id, recipe_id, recipe_title, culture, method, started_at,
                target_fermentation_days, produce_weight_grams, water_weight_grams,
                salt_weight_grams, salinity_percent, status, rating_stars, notes, qr_code_uri, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                b.id, b.recipeId, b.recipeTitle, b.culture, b.method, b.startedAt,
                b.targetFermentationDays, b.produceWeightGrams, b.waterWeightGrams,
                b.saltWeightGrams, b.salinityPercent, b.status, b.ratingStars ?? null,
                b.notes ?? null, b.qrCodeUri ?? null, b.createdAt
              ]
            );
          }
          for (const p of this.pantryItems) {
            this.db.runSync(
              `INSERT OR REPLACE INTO pantry_items (
                id, batch_id, label, jar_volume_ml, location, quantity,
                sealed_at, best_before, opened_at, is_consumed
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                p.id, p.batchId, p.label, p.jarVolumeMl, p.location, p.quantity,
                p.sealedAt, p.bestBefore, p.openedAt ?? null, p.isConsumed ? 1 : 0
              ]
            );
          }
          for (const l of this.fermentationLogs) {
            this.db.runSync(
              `INSERT OR REPLACE INTO fermentation_logs (
                id, batch_id, logged_at, day_number, sensory_note, ph_reading, burped, tasted
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                l.id, l.batchId, l.loggedAt, l.dayNumber, l.sensoryNote ?? null,
                l.phReading ?? null, l.burped ? 1 : 0, l.tasted ? 1 : 0
              ]
            );
          }
          for (const r of this.customRecipes) {
            this.db.runSync(
              `INSERT OR REPLACE INTO custom_recipes (
                id, title, subtitle, culture, category, method, produce_weight_grams,
                salinity_percent, fermentation_days, shelf_life_months, ingredients_json, steps_json, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                r.id, r.title, r.subtitle ?? null, r.culture, r.category, r.method,
                r.defaultProduceWeightGrams ?? 1000, r.defaultSalinityPercent ?? 2.0,
                r.fermentationDays ?? 7, r.shelfLifeMonths ?? 12,
                JSON.stringify(r.ingredients || []), JSON.stringify(r.steps || []),
                Date.now()
              ]
            );
          }
          for (const s of this.experimentSeries) {
            this.db.runSync(
              `INSERT OR REPLACE INTO experiment_series (
                id, title, base_produce_name, total_produce_grams, jar_count,
                hypothesis, axis, status, blind_cupping_enabled, created_at, completed_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                s.id, s.title, s.baseProduceName, s.totalProduceGrams, s.jarCount,
                s.hypothesis, s.axis, s.status, s.blindCuppingEnabled ? 1 : 0,
                s.createdAt, s.completedAt ?? null
              ]
            );
            for (const v of s.variants) {
              this.db.runSync(
                `INSERT OR REPLACE INTO experiment_variants (
                  id, series_id, variant_letter, name, parameter_delta,
                  produce_grams, water_grams, salt_grams, salinity_percent,
                  special_additions_json, batch_id, sensory_score_json, is_winner
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  v.id, s.id, v.variantLetter, v.name, v.parameterDelta,
                  v.produceGrams, v.waterGrams, v.saltGrams, v.salinityPercent,
                  JSON.stringify(v.specialAdditions || []), v.batchId ?? null,
                  v.sensoryScore ? JSON.stringify(v.sensoryScore) : null,
                  v.isWinner ? 1 : 0
                ]
              );
            }
          }
          for (const ing of this.pantryIngredients) {
            this.db.runSync(
              `INSERT OR REPLACE INTO pantry_ingredients (
                id, name, category, stock_amount, unit, cost_per_unit, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [ing.id, ing.name, ing.category, ing.stockAmount, ing.unit, ing.costPerUnit, ing.updatedAt]
            );
          }
        }
      } catch {}

      autoBackup(this.getBackupData()).catch(() => {});
      return true;
    } catch {
      return false;
    }
  }

  public getSetting(key: string): string | null {
    this.ensureInitialized();
    if (this.settings.has(key)) {
      return this.settings.get(key) || null;
    }
    try {
      if (this.db && typeof this.db.getFirstSync === 'function') {
        const row = this.db.getFirstSync(
          'SELECT value FROM app_settings WHERE key = ?',
          [key]
        );
        if (row && typeof (row as any).value === 'string') {
          this.settings.set(key, (row as any).value);
          return (row as any).value || null;
        }
      }
    } catch {}
    return null;
  }

  public setSetting(key: string, value: string): void {
    this.ensureInitialized();
    this.settings.set(key, value);
    try {
      if (this.db && typeof this.db.runSync === 'function') {
        this.db.runSync(
          'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
          [key, value]
        );
      }
    } catch {}
  }

  public clearAllForTesting(): void {
    this.batches = [];
    this.pantryItems = [];
    this.fermentationLogs = [];
    this.experimentSeries = [];
    this.customRecipes = [];
    this.pantryIngredients = [];
    this.settings.clear();
    this.initialized = false;
    this.clearedForTesting = true;
    try {
      if (this.db && typeof this.db.execSync === 'function') {
        this.db.execSync(
          'DELETE FROM batches; DELETE FROM pantry_items; DELETE FROM fermentation_logs; DELETE FROM custom_recipes; DELETE FROM experiment_series; DELETE FROM experiment_variants; DELETE FROM pantry_ingredients; DELETE FROM app_settings;'
        );
      }
    } catch {}
  }
}


export const dbStore = new LocalDatabaseStore();
dbStore.init();

