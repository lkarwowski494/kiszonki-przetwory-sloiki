// ============================================================================
// Słoik (Jarwise) — Artisan Batch Cost & Yield Calculator Engine (Parity S4)
// Oblicza rzeczywisty koszt przygotowania partii domowych przetworów vs sklepowa
// cena delikatesowa. Uwzględnia surowce, słoiki, wieczka i energię pasteryzacji.
// Apps4Brew Studio — 100% Offline-First.
// ============================================================================

export interface JarCostInput {
  produceWeightGrams: number;
  waterWeightGrams: number;
  saltWeightGrams: number;
  jarsCount: number;
  jarVolumeMl?: number;

  producePricePerKg?: number; // domyślnie: 8.00 PLN/kg (ogórki gruntowe)
  waterPricePerM3?: number;   // domyślnie: 12.00 PLN/m3 (0.012 PLN/L)
  saltPricePerKg?: number;    // domyślnie: 3.00 PLN/kg (sól kamienna niejodowana)
  herbsAndSpicesCost?: number;// domyślnie: 2.50 PLN (czosnek, koper, chrzan na partię)
  jarAndLidCostPerUnit?: number; // domyślnie: 1.80 PLN/szt. (lub amortyzacja szkła + nowe wieczko)

  pasteurizationMethod?: 'none' | 'water_bath' | 'oven';
  stovePowerKw?: number;      // domyślnie: 2.0 kW
  cookingTimeHours?: number;  // domyślnie: 0.5 h (30 min)
  electricityPricePerKwh?: number; // domyślnie: 1.15 PLN/kWh
  storeRetailBenchmarkPerJar?: number; // domyślnie: 16.00 PLN za słoik rzemieślniczy
}

export interface JarCostMetrics {
  produceCost: number;
  waterCost: number;
  saltCost: number;
  herbsCost: number;
  jarsCost: number;
  ingredientsTotalCost: number;

  energyKwh: number;
  energyCost: number;

  totalBatchCost: number;
  costPerJar: number;
  storeBenchmarkTotalCost: number;
  totalSavings: number;
  savingsPercent: number;
}

export const DEFAULT_JAR_COST_PARAMETERS = {
  producePricePerKg: 8.0,
  waterPricePerM3: 12.0,
  saltPricePerKg: 3.0,
  herbsAndSpicesCost: 2.5,
  jarAndLidCostPerUnit: 1.8,
  stovePowerKw: 2.0,
  cookingTimeHours: 0.5,
  electricityPricePerKwh: 1.15,
  storeRetailBenchmarkPerJar: 16.0,
};

function roundGrosze(val: number): number {
  return Math.round(val * 100) / 100;
}

export function calculateJarBatchCost(input: JarCostInput): JarCostMetrics {
  const producePrice =
    input.producePricePerKg ?? DEFAULT_JAR_COST_PARAMETERS.producePricePerKg;
  const waterPrice =
    input.waterPricePerM3 ?? DEFAULT_JAR_COST_PARAMETERS.waterPricePerM3;
  const saltPrice =
    input.saltPricePerKg ?? DEFAULT_JAR_COST_PARAMETERS.saltPricePerKg;
  const herbsCost = roundGrosze(
    Math.max(0, input.herbsAndSpicesCost ?? DEFAULT_JAR_COST_PARAMETERS.herbsAndSpicesCost)
  );
  const jarCostPerUnit =
    input.jarAndLidCostPerUnit ?? DEFAULT_JAR_COST_PARAMETERS.jarAndLidCostPerUnit;

  const jars = Math.max(1, Math.round(input.jarsCount || 1));

  // 1. Koszty składników spożywczych
  const produceKg = Math.max(0, input.produceWeightGrams) / 1000;
  const produceCost = roundGrosze(produceKg * producePrice);

  const waterM3 = Math.max(0, input.waterWeightGrams) / 1000000;
  const waterCost = roundGrosze(waterM3 * waterPrice);

  const saltKg = Math.max(0, input.saltWeightGrams) / 1000;
  const saltCost = roundGrosze(saltKg * saltPrice);

  const jarsCost = roundGrosze(jars * jarCostPerUnit);

  const ingredientsTotalCost = roundGrosze(
    produceCost + waterCost + saltCost + herbsCost + jarsCost
  );

  // 2. Koszt energii (pasteryzacja lub podgrzanie zalewy)
  const isCanned = input.pasteurizationMethod && input.pasteurizationMethod !== 'none';
  const stovePower = input.stovePowerKw ?? DEFAULT_JAR_COST_PARAMETERS.stovePowerKw;
  const cookingHours = isCanned
    ? (input.cookingTimeHours ?? DEFAULT_JAR_COST_PARAMETERS.cookingTimeHours)
    : 0.2; // 12 minut na zagotowanie wody na zalewę
  const electricityPrice =
    input.electricityPricePerKwh ?? DEFAULT_JAR_COST_PARAMETERS.electricityPricePerKwh;

  const dutyCycle = 0.75; // cykl pracy palnika indukcyjnego/elektrycznego
  const energyKwh = Math.round(stovePower * cookingHours * dutyCycle * 100) / 100;
  const energyCost = roundGrosze(energyKwh * electricityPrice);

  // 3. Łączny koszt partii i za pojedynczy słoik
  const totalBatchCost = roundGrosze(ingredientsTotalCost + energyCost);
  const costPerJar = roundGrosze(totalBatchCost / jars);

  // 4. Porównanie ze sklepem delikatesowym i oszczędności
  const storeBenchmarkPrice =
    input.storeRetailBenchmarkPerJar ?? DEFAULT_JAR_COST_PARAMETERS.storeRetailBenchmarkPerJar;
  const storeBenchmarkTotalCost = roundGrosze(jars * storeBenchmarkPrice);
  const totalSavings = roundGrosze(Math.max(0, storeBenchmarkTotalCost - totalBatchCost));
  const savingsPercent =
    storeBenchmarkTotalCost > 0
      ? Math.round((totalSavings / storeBenchmarkTotalCost) * 100)
      : 0;

  return {
    produceCost,
    waterCost,
    saltCost,
    herbsCost,
    jarsCost,
    ingredientsTotalCost,
    energyKwh,
    energyCost,
    totalBatchCost,
    costPerJar,
    storeBenchmarkTotalCost,
    totalSavings,
    savingsPercent,
  };
}
