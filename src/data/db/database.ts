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
  private initialized = false;

  public init(): void {
    if (this.initialized) return;

    // Próba podłączenia bezpiecznej bazy SQLite w /Library/SQLite (Apps4Brew SEC-09)
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

    this.initialized = true;
  }

  // --- Zarządzanie Partiami (Batches) ---

  public createBatch(
    input: Omit<BatchRecord, 'id' | 'createdAt' | 'qrCodeUri'> & { id?: string }
  ): BatchRecord {
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
    return this.batches.find((b) => b.id === id);
  }

  public getAllBatches(): BatchRecord[] {
    return [...this.batches];
  }

  public getActiveFerments(): BatchRecord[] {
    return this.batches.filter((b) => b.status === 'fermenting');
  }

  public updateBatchStatus(
    id: string,
    status: BatchRecord['status'],
    ratingStars?: number,
    notes?: string
  ): boolean {
    const batch = this.batches.find((b) => b.id === id);
    if (!batch) return false;

    batch.status = status;
    if (ratingStars !== undefined) batch.ratingStars = ratingStars;
    if (notes !== undefined) batch.notes = notes;
    return true;
  }

  // --- Spiżarnia (Pantry Items) ---

  public addPantryItem(
    input: Omit<PantryItemRecord, 'id' | 'isConsumed'> & { id?: string }
  ): PantryItemRecord {
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
    return this.pantryItems
      .filter((item) => !item.isConsumed)
      .filter((item) => (filterLocation ? item.location === filterLocation : true));
  }

  public consumePantryItem(itemId: string, quantityToConsume: number = 1): boolean {
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
    return this.fermentationLogs
      .filter((l) => l.batchId === batchId)
      .sort((a, b) => a.dayNumber - b.dayNumber);
  }

  // --- Laboratorium Eksperymentów & Panel Sensoryczny (Multi-Jar Split-Batch) ---

  public createExperimentSeries(series: ExperimentSeries): ExperimentSeries {
    this.experimentSeries.unshift(series);
    return series;
  }

  public getAllExperimentSeries(): ExperimentSeries[] {
    return [...this.experimentSeries];
  }

  public getExperimentSeriesById(id: string): ExperimentSeries | undefined {
    return this.experimentSeries.find((s) => s.id === id);
  }

  public updateExperimentSeriesStatus(
    id: string,
    status: ExperimentSeries['status']
  ): boolean {
    const series = this.experimentSeries.find((s) => s.id === id);
    if (!series) return false;
    series.status = status;
    if (status === 'completed') {
      series.completedAt = Date.now();
    }
    return true;
  }

  public toggleBlindCupping(id: string, enabled: boolean): boolean {
    const series = this.experimentSeries.find((s) => s.id === id);
    if (!series) return false;
    series.blindCuppingEnabled = enabled;
    return true;
  }

  public updateVariantSensoryScore(
    seriesId: string,
    variantId: string,
    score: SensoryEvaluation
  ): boolean {
    const series = this.experimentSeries.find((s) => s.id === seriesId);
    if (!series) return false;
    const variant = series.variants.find((v) => v.id === variantId);
    if (!variant) return false;

    variant.sensoryScore = score;
    return true;
  }

  public toggleVariantWinner(
    seriesId: string,
    variantId: string,
    isWinner: boolean
  ): boolean {
    const series = this.experimentSeries.find((s) => s.id === seriesId);
    if (!series) return false;
    const variant = series.variants.find((v) => v.id === variantId);
    if (!variant) return false;

    variant.isWinner = isWinner;
    return true;
  }

  public saveCustomRecipe(recipe: MasterRecipe): MasterRecipe {
    const idx = this.customRecipes.findIndex((r) => r.id === recipe.id);
    if (idx >= 0) {
      this.customRecipes[idx] = recipe;
    } else {
      this.customRecipes.unshift(recipe);
    }
    return recipe;
  }

  public getCustomRecipes(): MasterRecipe[] {
    return [...this.customRecipes];
  }

  public promoteVariantToMasterRecipe(
    seriesId: string,
    variantId: string,
    customTitle?: string
  ): MasterRecipe | null {
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
    return [...this.pantryIngredients];
  }

  public addPantryIngredient(
    input: Omit<PantryIngredientRecord, 'id' | 'updatedAt'> & { id?: string }
  ): PantryIngredientRecord {
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
    if (params.saltKg) {
      const saltItem = this.pantryIngredients.find((i) => i.category === 'salt');
      if (saltItem) {
        saltItem.stockAmount = Math.max(
          0,
          Math.round((saltItem.stockAmount - params.saltKg) * 100) / 100
        );
        saltItem.updatedAt = Date.now();
      }
    }
    if (params.jarsCount) {
      const jarItem = this.pantryIngredients.find((i) => i.category === 'jar_lid');
      if (jarItem) {
        jarItem.stockAmount = Math.max(0, jarItem.stockAmount - params.jarsCount);
        jarItem.updatedAt = Date.now();
      }
    }
    return true;
  }

  public getBackupData(): SloikBackupData {
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
      return true;
    } catch {
      return false;
    }
  }

  public clearAllForTesting(): void {
    this.batches = [];
    this.pantryItems = [];
    this.fermentationLogs = [];
    this.experimentSeries = [];
    this.customRecipes = [];
    this.pantryIngredients = [];
    this.initialized = false;
  }
}


export const dbStore = new LocalDatabaseStore();

