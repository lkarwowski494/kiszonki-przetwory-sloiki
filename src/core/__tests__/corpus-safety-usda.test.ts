import {
  evaluatePasteurizationSafety,
  BOTULISM_PH_CRITICAL,
} from '../safety/safety-guard';

describe('USDA AI-539 & Botulism Safety Corpus Suite (1,530 Punktów pH × Objętość)', () => {
  const phValues: number[] = [];
  for (let ph = 2.0; ph <= 7.01; ph += 0.1) {
    phValues.push(Math.round(ph * 10) / 10);
  }

  const volumeValues: number[] = [];
  for (let vol = 100; vol <= 3000; vol += 100) {
    volumeValues.push(vol);
  }

  const grid: Array<[number, number]> = [];
  for (const ph of phValues) {
    for (const vol of volumeValues) {
      grid.push([ph, vol]);
    }
  }

  test.each(grid)(
    'Bariera USDA dla pH: %s oraz pojemności: %i ml w kąpieli wodnej',
    (ph, volume) => {
      const res = evaluatePasteurizationSafety({
        foodPh: ph,
        jarVolumeMl: volume,
        method: 'water_bath',
      });

      if (ph >= BOTULISM_PH_CRITICAL) {
        expect(res.isSafeForWaterBath).toBe(false);
        expect(res.requiresPressureCanning).toBe(true);
        expect(res.targetMinutes).toBe(0);
        expect(res.safetyWarning).toContain('KRYTYCZNE OSTRZEŻENIE BEZPIECZEŃSTWA');
        expect(res.safetyWarning).toContain('Clostridium botulinum');
      } else {
        expect(res.isSafeForWaterBath).toBe(true);
        expect(res.requiresPressureCanning).toBe(false);
        expect(res.targetMinutes).toBeGreaterThan(0);
        expect(res.testSteps.length).toBeGreaterThanOrEqual(4);
      }
    }
  );
});
