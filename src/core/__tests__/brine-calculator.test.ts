import { calculateBrine } from '../brine/brine-calculator';

describe('Kalkulator Solanek (RD-01 Total Salinity Rule)', () => {
  it('oblicza poprawną masę soli dla całkowitej masy układu (ogórki 600g + woda 500g, 2.0%)', () => {
    const result = calculateBrine({
      produceWeightGrams: 600,
      waterWeightGrams: 500,
      targetSalinityPercent: 2.0,
      method: 'total_mass',
    });

    // 1100 * (2 / 98) = 22.448 g ~ 22.4 g
    expect(result.saltGrams).toBeCloseTo(22.4, 1);
    expect(result.effectiveSalinityPercent).toBe(2.0);
    expect(result.totalMassGrams).toBe(1122);
    expect(result.calciumChlorideGrams).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('oblicza solenie na sucho (dry salting) dla kapusty 2000g, 2.0%', () => {
    const result = calculateBrine({
      produceWeightGrams: 2000,
      waterWeightGrams: 0,
      targetSalinityPercent: 2.0,
      method: 'dry_salting',
    });

    // 2000 * (2 / 98) = 40.8 g
    expect(result.saltGrams).toBeCloseTo(40.8, 1);
    expect(result.waterGrams).toBe(0);
    expect(result.totalMassGrams).toBe(2041);
  });

  it('ostrzega przed błędem rozcieńczenia przy soleniu liczonym wyłącznie od wody', () => {
    const result = calculateBrine({
      produceWeightGrams: 1000,
      waterWeightGrams: 1000,
      targetSalinityPercent: 3.0,
      method: 'water_only',
    });

    // Sól od wody 1000 * 3% = 30g, ale w układzie 2000g to tylko ~1.5%
    expect(result.saltGrams).toBe(30);
    expect(result.effectiveSalinityPercent).toBeLessThan(2.0);
    expect(result.recommendations.some((r) => r.includes('UWAGA'))).toBe(true);
  });

  it('wyrzuca błąd dla nieprawidłowych danych wejściowych', () => {
    expect(() =>
      calculateBrine({
        produceWeightGrams: -100,
        waterWeightGrams: 500,
        targetSalinityPercent: 2.0,
        method: 'total_mass',
      })
    ).toThrow();

    expect(() =>
      calculateBrine({
        produceWeightGrams: 500,
        waterWeightGrams: 500,
        targetSalinityPercent: 25.0, // Za wysokie stężenie
        method: 'total_mass',
      })
    ).toThrow();
  });
});
