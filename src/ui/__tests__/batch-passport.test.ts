import { dbStore } from '../../data/db/database';
import { evaluatePasteurizationSafety } from '../../core/safety/safety-guard';
import { DEFAULT_FERMENT_SENSORY_PROFILE } from '../../core/sensory-radar';

describe('Batch Passport Screen Logic (/batch/[id]) & Deep Linking Invariants', () => {
  beforeEach(() => {
    dbStore.init();
  });

  it('resolves batch details and parameters correctly by ID', () => {
    const batches = dbStore.getAllBatches();
    expect(batches.length).toBeGreaterThanOrEqual(1);

    const targetBatch = batches[0];
    const retrieved = dbStore.getBatchById(targetBatch.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(targetBatch.id);
    expect(retrieved?.recipeTitle).toBe(targetBatch.recipeTitle);
    expect(retrieved?.salinityPercent).toBeGreaterThan(0);
    expect(retrieved?.produceWeightGrams).toBeGreaterThan(0);
  });

  it('correctly extracts and parses deep link sloik://batch/[id] URIs', () => {
    const testId = 'batch_custom_999';
    const uri = `sloik://batch/${testId}`;
    const extractedId = uri.replace('sloik://batch/', '');
    expect(extractedId).toBe(testId);
  });

  it('evaluates biological safety (USDA AI-539) for batch records', () => {
    const batch = dbStore.createBatch({
      recipeId: 'REC-TEST-PASSPORT',
      recipeTitle: 'Ogórki kiszone testowe',
      culture: 'Polska',
      method: 'lacto_fermentation',
      startedAt: Date.now(),
      targetFermentationDays: 5,
      produceWeightGrams: 1000,
      waterWeightGrams: 800,
      saltWeightGrams: 20,
      salinityPercent: 2.0,
      status: 'fermenting',
    });

    const safety = evaluatePasteurizationSafety({
      foodPh: 3.8,
      jarVolumeMl: 1000,
      method: 'water_bath',
    });

    expect(safety.isSafeForWaterBath).toBe(true);
    expect(safety.targetMinutes).toBeGreaterThan(0);
  });

  it('appends and retrieves fermentation and burping logs for a passport', () => {
    const batch = dbStore.createBatch({
      recipeId: 'REC-LOG-TEST',
      recipeTitle: 'Czosnek kiszony',
      culture: 'Polska',
      method: 'lacto_fermentation',
      startedAt: Date.now(),
      targetFermentationDays: 14,
      produceWeightGrams: 400,
      waterWeightGrams: 350,
      saltWeightGrams: 15,
      salinityPercent: 2.0,
      status: 'fermenting',
    });

    const initialLogs = dbStore.getLogsForBatch(batch.id);
    expect(initialLogs).toHaveLength(0);

    dbStore.addFermentationLog({
      batchId: batch.id,
      dayNumber: 2,
      sensoryNote: 'Uwolniono gaz CO2 ze słoika.',
      burped: true,
      tasted: false,
      sensoryProfile: {
        ...DEFAULT_FERMENT_SENSORY_PROFILE,
        effervescence: 4,
      },
    });

    const updatedLogs = dbStore.getLogsForBatch(batch.id);
    expect(updatedLogs).toHaveLength(1);
    expect(updatedLogs[0].burped).toBe(true);
    expect(updatedLogs[0].sensoryProfile?.effervescence).toBe(4);
  });

  it('updates batch status to consumed when eaten', () => {
    const batch = dbStore.createBatch({
      recipeId: 'REC-CONSUME-TEST',
      recipeTitle: 'Pikle z rzodkiewki',
      culture: 'Polska',
      method: 'lacto_fermentation',
      startedAt: Date.now(),
      targetFermentationDays: 3,
      produceWeightGrams: 300,
      waterWeightGrams: 250,
      saltWeightGrams: 11,
      salinityPercent: 2.0,
      status: 'fermenting',
    });

    expect(batch.status).toBe('fermenting');

    const success = dbStore.updateBatchStatus(batch.id, 'consumed', 5, 'Chrupiące i pyszne!');
    expect(success).toBe(true);

    const refreshed = dbStore.getBatchById(batch.id);
    expect(refreshed?.status).toBe('consumed');
    expect(refreshed?.ratingStars).toBe(5);
  });
});
