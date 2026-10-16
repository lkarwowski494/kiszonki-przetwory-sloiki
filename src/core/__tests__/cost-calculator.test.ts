import {
  calculateJarBatchCost,
  DEFAULT_JAR_COST_PARAMETERS,
} from '../pantry/cost-calculator';

describe('Batch Cost & Yield Calculator (Apps4Brew Parity S4)', () => {
  it('oblicza deterministycznie koszty surowców i słoików dla 4 słoików ogórków', () => {
    const result = calculateJarBatchCost({
      jarsCount: 4,
      produceWeightGrams: 2000, // 2 kg * 8 zł = 16 zł
      waterWeightGrams: 1500,   // 1.5 L = ~0.02 zł
      saltWeightGrams: 35,      // 0.035 kg * 3 zł = 0.11 zł
      herbsAndSpicesCost: 2.50,
      jarAndLidCostPerUnit: 1.80, // 4 * 1.80 = 7.20 zł
      pasteurizationMethod: 'none',
      storeRetailBenchmarkPerJar: 16.0, // 4 * 16 = 64 zł
    });

    expect(result.produceCost).toBe(16.0);
    expect(result.saltCost).toBe(0.11);
    expect(result.jarsCost).toBe(7.2);
    expect(result.herbsCost).toBe(2.5);
    expect(result.ingredientsTotalCost).toBeGreaterThan(25);

    // Energia kuchenna (zagotowanie wody)
    expect(result.energyCost).toBeGreaterThan(0);
    expect(result.totalBatchCost).toBeGreaterThan(25);
    expect(result.costPerJar).toBeLessThan(result.totalBatchCost);
    expect(result.costPerJar).toBeCloseTo(result.totalBatchCost / 4, 1);

    // Porównanie ze sklepem
    expect(result.storeBenchmarkTotalCost).toBe(64.0);
    expect(result.totalSavings).toBeGreaterThan(30);
    expect(result.savingsPercent).toBeGreaterThan(50);
  });

  it('uwzględnia zwiększone zużycie energii podczas pasteryzacji w kąpieli wodnej', () => {
    const rawCost = calculateJarBatchCost({
      jarsCount: 6,
      produceWeightGrams: 3000,
      waterWeightGrams: 2000,
      saltWeightGrams: 50,
      pasteurizationMethod: 'none',
    });

    const cannedCost = calculateJarBatchCost({
      jarsCount: 6,
      produceWeightGrams: 3000,
      waterWeightGrams: 2000,
      saltWeightGrams: 50,
      pasteurizationMethod: 'water_bath',
      cookingTimeHours: 0.5,
    });

    expect(cannedCost.energyKwh).toBeGreaterThan(rawCost.energyKwh);
    expect(cannedCost.energyCost).toBeGreaterThan(rawCost.energyCost);
    expect(cannedCost.totalBatchCost).toBeGreaterThan(rawCost.totalBatchCost);
  });

  it('obsługuje wartości domyślne parametrów', () => {
    const defaultCost = calculateJarBatchCost({
      jarsCount: 1,
      produceWeightGrams: 500,
      waterWeightGrams: 400,
      saltWeightGrams: 10,
    });

    expect(defaultCost.produceCost).toBe(4.0); // 0.5kg * 8.0 zł
    expect(defaultCost.storeBenchmarkTotalCost).toBe(DEFAULT_JAR_COST_PARAMETERS.storeRetailBenchmarkPerJar);
    expect(defaultCost.savingsPercent).toBeGreaterThan(0);
  });
});
