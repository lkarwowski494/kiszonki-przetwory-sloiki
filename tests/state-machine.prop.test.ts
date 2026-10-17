import * as fc from 'fast-check';
import {
  LocalDatabaseStore,
} from '../src/data/db/database';
import { SloikBackupData } from '../src/lib/backup';

export function assertStateInvariants(data: SloikBackupData): void {
  const batchIds = new Set<string>();
  for (const b of data.batches) {
    expect(b.id).toBeDefined();
    expect(typeof b.id).toBe('string');
    expect(b.id.length).toBeGreaterThan(0);
    expect(batchIds.has(b.id)).toBe(false);
    batchIds.add(b.id);

    expect(b.recipeTitle).toBeDefined();
    expect(b.produceWeightGrams).toBeGreaterThanOrEqual(0);
    expect(b.waterWeightGrams).toBeGreaterThanOrEqual(0);
    expect(b.saltWeightGrams).toBeGreaterThanOrEqual(0);
    expect(b.salinityPercent).toBeGreaterThanOrEqual(0.5);
    expect(b.salinityPercent).toBeLessThanOrEqual(25);
    expect(b.startedAt).toBeGreaterThan(0);
    expect(['fermenting', 'pantry', 'consumed', 'discarded']).toContain(b.status);
  }

  const pantryIds = new Set<string>();
  for (const p of data.pantryItems) {
    expect(p.id).toBeDefined();
    expect(pantryIds.has(p.id)).toBe(false);
    pantryIds.add(p.id);

    expect(p.quantity).toBeGreaterThanOrEqual(0);
    expect(p.jarVolumeMl).toBeGreaterThan(0);
    expect(p.sealedAt).toBeGreaterThan(0);
    expect(p.bestBefore).toBeGreaterThanOrEqual(p.sealedAt);
  }

  for (const log of data.fermentationLogs) {
    expect(log.id).toBeDefined();
    expect(log.batchId).toBeDefined();
    expect(log.loggedAt).toBeGreaterThan(0);
    if (log.phReading !== undefined) {
      expect(log.phReading).toBeGreaterThan(1.0);
      expect(log.phReading).toBeLessThan(14.0);
    }
  }
}

type Action =
  | { type: 'createBatch'; title: string; produce: number; water: number; sal: number }
  | { type: 'burp'; idx: number }
  | { type: 'ph'; idx: number; ph: number }
  | { type: 'seal'; idx: number; count: number }
  | { type: 'consume'; idx: number };

const actionArb: fc.Arbitrary<Action> = fc.oneof(
  fc.record({
    type: fc.constant('createBatch' as const),
    title: fc.constantFrom('Ogórki tradycyjne', 'Kimchi klasyczne', 'Czosnek kiszony', 'Zakwas buraczany'),
    produce: fc.integer({ min: 100, max: 5000 }),
    water: fc.integer({ min: 100, max: 4000 }),
    sal: fc.double({ min: 1.0, max: 5.0, noNaN: true }),
  }),
  fc.record({
    type: fc.constant('burp' as const),
    idx: fc.nat(),
  }),
  fc.record({
    type: fc.constant('ph' as const),
    idx: fc.nat(),
    ph: fc.double({ min: 3.0, max: 6.5, noNaN: true }),
  }),
  fc.record({
    type: fc.constant('seal' as const),
    idx: fc.nat(),
    count: fc.integer({ min: 1, max: 5 }),
  }),
  fc.record({
    type: fc.constant('consume' as const),
    idx: fc.nat(),
  })
);

describe('State Machine Invariants & Random Sequence (BR-TEST-007..010)', () => {
  test('sekwencja losowych operacji stanowych z gwarantowanym krokiem otwierającym zachowuje niezmienniki po każdym kroku', () => {
    fc.assert(
      fc.property(
        fc.array(actionArb, { minLength: 5, maxLength: 30 }),
        (actions) => {
          const store = new LocalDatabaseStore();
          store.clearAllForTesting();

          // Gwarantowany krok otwierający (BR-TEST-009)
          const openingBatch = store.createBatch({
            recipeId: 'REC-OPEN',
            recipeTitle: 'Otwierający nastaw kiszonki',
            culture: 'Polska',
            method: 'lacto_fermentation',
            targetFermentationDays: 5,
            produceWeightGrams: 1000,
            waterWeightGrams: 800,
            saltWeightGrams: 20,
            salinityPercent: 2.0,
            startedAt: Date.now(),
            status: 'fermenting',
          });
          expect(openingBatch.id).toBeDefined();

          // Weryfikacja niezmienników po kroku otwierającym
          assertStateInvariants(store.getBackupData());

          // Wykonanie sekwencji losowych operacji z weryfikacją po KAŻDEJ akcji
          for (const action of actions) {
            switch (action.type) {
              case 'createBatch': {
                store.createBatch({
                  recipeId: 'REC-PROP',
                  recipeTitle: action.title,
                  culture: 'Polska',
                  method: 'lacto_fermentation',
                  targetFermentationDays: 7,
                  produceWeightGrams: action.produce,
                  waterWeightGrams: action.water,
                  saltWeightGrams: Math.round((action.sal / 100) * action.water),
                  salinityPercent: Math.round(action.sal * 10) / 10,
                  startedAt: Date.now(),
                  status: 'fermenting',
                });
                break;
              }
              case 'burp': {
                const active = store.getActiveFerments();
                if (active.length > 0) {
                  const target = active[action.idx % active.length];
                  store.addFermentationLog({
                    batchId: target.id,
                    dayNumber: 2,
                    burped: true,
                    tasted: false,
                  });
                }
                break;
              }
              case 'ph': {
                const active = store.getActiveFerments();
                if (active.length > 0) {
                  const target = active[action.idx % active.length];
                  store.addFermentationLog({
                    batchId: target.id,
                    dayNumber: 3,
                    phReading: Math.round(action.ph * 10) / 10,
                    burped: true,
                    tasted: true,
                  });
                }
                break;
              }
              case 'seal': {
                const active = store.getActiveFerments();
                if (active.length > 0) {
                  const target = active[action.idx % active.length];
                  store.addPantryItem({
                    batchId: target.id,
                    label: `${target.recipeTitle} (Słoik)`,
                    jarVolumeMl: 900,
                    quantity: action.count,
                    location: 'cellar',
                    sealedAt: Date.now(),
                    bestBefore: Date.now() + 1000 * 60 * 60 * 24 * 365,
                  });
                  store.updateBatchStatus(target.id, 'pantry');
                }
                break;
              }
              case 'consume': {
                const pantry = store.getPantryItems().filter((p) => !p.isConsumed);
                if (pantry.length > 0) {
                  const target = pantry[action.idx % pantry.length];
                  store.consumePantryItem(target.id, 1);
                }
                break;
              }
            }
            assertStateInvariants(store.getBackupData());
          }
        }
      ),
      { numRuns: 30 }
    );
  });
});
