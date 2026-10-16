// ============================================================================
// Słoik (Jarwise) — Local Database Repository (BR-DANE-001)
// Clean architecture repository for Batches, Pantry Items, and Ferment Logs.
// 100% Offline-First, Zero Data Loss.
// ============================================================================

import { MASTER_RECIPES } from '../../core/recipes/recipes-data';
import { MasterRecipe } from '../../core/types';

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
}

export interface DatabaseBackupPayload {
  version: number;
  exportedAt: number;
  batches: BatchRecord[];
  pantryItems: PantryItemRecord[];
  fermentationLogs: FermentationLogRecord[];
}

export class LocalDatabaseStore {
  private batches: BatchRecord[] = [];
  private pantryItems: PantryItemRecord[] = [];
  private fermentationLogs: FermentationLogRecord[] = [];
  private initialized = false;

  public init(): void {
    if (this.initialized) return;

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
    return newLog;
  }

  public getLogsForBatch(batchId: string): FermentationLogRecord[] {
    return this.fermentationLogs
      .filter((l) => l.batchId === batchId)
      .sort((a, b) => a.dayNumber - b.dayNumber);
  }

  // --- Eksport i Import Kopii Zapasowej JSON (Zero Data Loss) ---

  public exportBackupJson(): string {
    const payload: DatabaseBackupPayload = {
      version: 1,
      exportedAt: Date.now(),
      batches: this.batches,
      pantryItems: this.pantryItems,
      fermentationLogs: this.fermentationLogs,
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
      return true;
    } catch {
      return false;
    }
  }

  public clearAllForTesting(): void {
    this.batches = [];
    this.pantryItems = [];
    this.fermentationLogs = [];
    this.initialized = false;
  }
}

export const dbStore = new LocalDatabaseStore();
