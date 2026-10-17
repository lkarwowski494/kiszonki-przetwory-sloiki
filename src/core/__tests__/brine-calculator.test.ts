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
    expect(result.calciumChlorideGrams).toBe(0.9);
    expect(result.recommendations).toEqual([
      'Obliczono sól dla CAŁKOWITEJ masy słoika (600g warzyw + 500g wody).',
      'Dzięki temu stężenie soli nie spadnie po wyjściu soków z warzyw, a kiszonka zachowa idealną chrupkość.',
      'Dla dodatkowej chrupkości dodaj liść dębu, wiśni lub chrzanu (zawierają naturalne taniny).',
    ]);
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
    expect(result.calciumChlorideGrams).toBeUndefined();
    expect(result.recommendations).toEqual([
      'Solenie na sucho: po wymieszaniu warzyw z solą odczekaj 15-20 minut, a następnie mocno ugnieć, aż puszczą sok.',
      'Upewnij się, że po upakowaniu w naczyniu warzywa są całkowicie przykryte sokiem własnym.',
    ]);
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
    expect(result.totalMassGrams).toBe(2030);
    expect(result.calciumChlorideGrams).toBeUndefined();
    expect(result.recommendations).toEqual([
      'UWAGA: Solenie liczone wyłącznie od wody (3%) zostanie rozcieńczone przez wodę z warzyw!',
      `Rzeczywiste stężenie soli w słoiku spadnie do ok. ${result.effectiveSalinityPercent}%, co może spowodować mięknięcie ogórków.`,
      'Zalecamy przełączenie na tryb „Całkowita masa układu”, aby uzyskać 100% gwarancji chrupkości.',
    ]);
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
