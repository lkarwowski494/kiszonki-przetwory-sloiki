import {
  evaluatePasteurizationSafety,
  BOTULISM_PH_CRITICAL,
} from '../safety/safety-guard';

describe('Strażnik Bezpieczeństwa Pasteryzacji i Bariery Botulinowej', () => {
  it('blokuje zwykłą kąpiel wodną dla produktów o pH >= 4.60 (np. fasolka, mięso, czosnek w oliwie)', () => {
    const result = evaluatePasteurizationSafety({
      foodPh: 5.2,
      jarVolumeMl: 500,
      method: 'water_bath',
    });

    expect(result.isSafeForWaterBath).toBe(false);
    expect(result.requiresPressureCanning).toBe(true);
    expect(result.safetyWarning).toContain('KRYTYCZNE OSTRZEŻENIE BEZPIECZEŃSTWA');
  });

  it('dopuszcza tyndalizację dla produktów o niskiej kwasowości', () => {
    const result = evaluatePasteurizationSafety({
      foodPh: 5.0,
      jarVolumeMl: 500,
      method: 'tyndallization',
    });

    expect(result.isSafeForWaterBath).toBe(true);
    expect(result.targetMinutes).toBe(60);
    expect(result.safetyWarning).toContain('Tyndalizacja');
  });

  it('dopuszcza pasteryzację wodną dla produktów kwasowych (pH < 4.60)', () => {
    const result = evaluatePasteurizationSafety({
      foodPh: 3.8, // Ogórki kiszone / pikle octowe / dżem
      jarVolumeMl: 500,
      method: 'water_bath',
    });

    expect(result.isSafeForWaterBath).toBe(true);
    expect(result.requiresPressureCanning).toBe(false);
    expect(result.targetMinutes).toBe(15);
    expect(result.temperatureCelsius).toBe(100);
    expect(result.testSteps.length).toBeGreaterThan(0);
  });

  it('skaluje czas pasteryzacji zależnie od pojemności słoika', () => {
    const smallJar = evaluatePasteurizationSafety({
      foodPh: 3.5,
      jarVolumeMl: 250,
      method: 'water_bath',
    });

    const largeJar = evaluatePasteurizationSafety({
      foodPh: 3.5,
      jarVolumeMl: 900,
      method: 'water_bath',
    });

    expect(smallJar.targetMinutes).toBeLessThan(largeJar.targetMinutes);
  });
});
