import { LocalDatabaseStore } from '../db/database';

describe('LocalDatabaseStore (100% Offline-First SQLite Persistence)', () => {
  let store: LocalDatabaseStore;

  beforeEach(() => {
    store = new LocalDatabaseStore();
    store.clearAllForTesting();
    store.init();
  });

  it('inicjalizuje się z domyślną demonstracyjną partią fermentującą', () => {
    const active = store.getActiveFerments();
    expect(active.length).toBe(1);
    expect(active[0].recipeTitle).toContain('Ogórki małosolne');
    expect(active[0].status).toBe('fermenting');
  });

  it('pozwala stworzyć nową partię i zaktualizować jej status do spiżarni', () => {
    const newBatch = store.createBatch({
      recipeId: 'REC-07',
      recipeTitle: 'Baechu-kimchi',
      culture: 'Korea',
      method: 'lacto_fermentation',
      startedAt: Date.now(),
      targetFermentationDays: 14,
      produceWeightGrams: 1500,
      waterWeightGrams: 0,
      saltWeightGrams: 37.5,
      salinityPercent: 2.5,
      status: 'fermenting',
      notes: 'Zrobione z ostrej papryki gochugaru.',
    });

    expect(newBatch.id).toBeDefined();
    expect(newBatch.qrCodeUri).toContain(newBatch.id);

    // Przeniesienie do spiżarni
    const updated = store.updateBatchStatus(newBatch.id, 'pantry', 5, 'Wyszło wybitnie!');
    expect(updated).toBe(true);

    const fetched = store.getBatchById(newBatch.id);
    expect(fetched?.status).toBe('pantry');
    expect(fetched?.ratingStars).toBe(5);
  });

  it('zarządza słoikami w spiżarni i poprawnie redukuje zapasy', () => {
    const item = store.addPantryItem({
      batchId: 'batch_test_1',
      label: 'Dżem truskawkowy 2026',
      jarVolumeMl: 350,
      location: 'pantry_cupboard',
      quantity: 4,
      sealedAt: Date.now(),
      bestBefore: Date.now() + 1000 * 60 * 60 * 24 * 365,
    });

    expect(item.quantity).toBe(4);

    // Zjedzenie 1 słoika
    store.consumePantryItem(item.id, 1);
    const inCupboard = store.getPantryItems('pantry_cupboard');
    const found = inCupboard.find((i) => i.id === item.id);
    expect(found?.quantity).toBe(3);
    expect(found?.isConsumed).toBe(false);

    // Zjedzenie pozostałych 3 słoików
    store.consumePantryItem(item.id, 3);
    const activeAfterConsumption = store.getPantryItems();
    expect(activeAfterConsumption.some((i) => i.id === item.id)).toBe(false);
  });

  it('zapisuje i pobiera wpisy sensoryczne w dzienniku fermentacji', () => {
    const active = store.getActiveFerments()[0];
    const log = store.addFermentationLog({
      batchId: active.id,
      dayNumber: 2,
      sensoryNote: 'Idealny trzask i chrupkość małosolnego!',
      phReading: 4.1,
      burped: true,
      tasted: true,
    });

    const logs = store.getLogsForBatch(active.id);
    expect(logs.some((l) => l.id === log.id)).toBe(true);
    expect(logs.find((l) => l.id === log.id)?.tasted).toBe(true);
  });

  it('zapewnia bezstratny eksport i import kopii zapasowej JSON (Zero Data Loss)', () => {
    // Utwórz unikalną partię
    store.createBatch({
      recipeId: 'REC-06',
      recipeTitle: 'Powidła śliwkowe',
      culture: 'Polska',
      method: 'sweet_preserve',
      startedAt: Date.now(),
      targetFermentationDays: 0,
      produceWeightGrams: 3000,
      waterWeightGrams: 0,
      saltWeightGrams: 0,
      salinityPercent: 0,
      status: 'pantry',
      notes: 'Smażone 14 godzin.',
    });

    const jsonBackup = store.exportBackupJson();
    expect(jsonBackup).toContain('Powidła śliwkowe');

    // Utwórz nowy pusty store i zaimportuj
    const newStore = new LocalDatabaseStore();
    newStore.clearAllForTesting();
    const success = newStore.importBackupJson(jsonBackup);

    expect(success).toBe(true);
    const importedBatches = newStore.getAllBatches();
    expect(importedBatches.some((b) => b.recipeTitle === 'Powidła śliwkowe')).toBe(true);
  });

  it('wczytuje istniejące rekordy z bazy SQLite podczas init() zamiast ich nadpisywania demo danymi', () => {
    const mockDb = {
      getFirstSync: jest.fn().mockImplementation((query: string) => {
        if (query.toLowerCase().includes('count') && query.toLowerCase().includes('batches')) {
          return { count: 2 };
        }
        return null;
      }),
      getAllSync: jest.fn().mockImplementation((query: string) => {
        if (query.includes('FROM batches')) {
          return [
            {
              id: 'batch_persisted_1',
              recipe_id: 'REC-09',
              recipe_title: 'Kiszona rzepa',
              culture: 'Polska',
              method: 'lacto_fermentation',
              started_at: 1700000000000,
              target_fermentation_days: 7,
              produce_weight_grams: 800,
              water_weight_grams: 600,
              salt_weight_grams: 28,
              salinity_percent: 2.0,
              status: 'fermenting',
              rating_stars: null,
              notes: 'Z targu',
              qr_code_uri: 'sloik://batch/batch_persisted_1',
              created_at: 1700000000000,
            },
            {
              id: 'batch_persisted_2',
              recipe_id: 'REC-10',
              recipe_title: 'Czosnek w miodzie',
              culture: 'Polska',
              method: 'lacto_fermentation',
              started_at: 1700005000000,
              target_fermentation_days: 30,
              produce_weight_grams: 500,
              water_weight_grams: 0,
              salt_weight_grams: 0,
              salinity_percent: 0,
              status: 'pantry',
              rating_stars: 5,
              notes: null,
              qr_code_uri: 'sloik://batch/batch_persisted_2',
              created_at: 1700005000000,
            },
          ];
        }
        if (query.includes('FROM pantry_items')) {
          return [
            {
              id: 'pantry_persisted_1',
              batch_id: 'batch_persisted_2',
              label: 'Czosnek w miodzie',
              jar_volume_ml: 500,
              location: 'pantry_cupboard',
              quantity: 2,
              sealed_at: 1700005000000,
              best_before: 1730005000000,
              opened_at: null,
              is_consumed: 0,
            },
          ];
        }
        if (query.includes('FROM fermentation_logs')) return [];
        if (query.includes('FROM custom_recipes')) return [];
        if (query.includes('FROM experiment_series')) return [];
        if (query.includes('FROM pantry_ingredients')) return [];
        if (query.includes('FROM app_settings')) {
          return [{ key: 'app_language', value: 'en' }];
        }
        return [];
      }),
      runSync: jest.fn(),
      execSync: jest.fn(),
    };

    const sqliteStore = new LocalDatabaseStore();
    sqliteStore.clearAllForTesting();
    (sqliteStore as any).db = mockDb;
    sqliteStore.init();

    const batches = sqliteStore.getAllBatches();
    expect(batches.length).toBe(2);
    expect(batches[0].recipeTitle).toBe('Kiszona rzepa');
    expect(batches[1].recipeTitle).toBe('Czosnek w miodzie');
    expect(sqliteStore.getSetting('app_language')).toBe('en');

    // Mutacja updateBatchStatus wykonuje runSync na SQLite
    sqliteStore.updateBatchStatus('batch_persisted_1', 'pantry', 4, 'Bardzo udana');
    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE batches SET status = ?'),
      expect.arrayContaining(['pantry', 4, 'Bardzo udana', 'batch_persisted_1'])
    );
  });
});
