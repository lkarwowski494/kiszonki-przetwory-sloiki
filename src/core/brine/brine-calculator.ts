import { BrineCalculationInput, BrineCalculationOutput } from '../types';

/**
 * Kalkulator Solanek i Chrupkości Słoika
 * Zgodny z normą RD-01 (Total Salinity Rule) Apps4Brew
 */
export function calculateBrine(input: BrineCalculationInput): BrineCalculationOutput {
  const { produceWeightGrams, waterWeightGrams, targetSalinityPercent, method } = input;

  if (targetSalinityPercent <= 0 || targetSalinityPercent > 20) {
    throw new Error('Zasolenie docelowe musi mieścić się w przedziale 0.5% - 20%.');
  }
  if (produceWeightGrams < 0 || waterWeightGrams < 0) {
    throw new Error('Masa surowca i wody nie może być ujemna.');
  }

  const recommendations: string[] = [];

  if (method === 'dry_salting') {
    // Solenie na sucho (kapusta, kimchi)
    // Sól liczona wyłącznie od masy warzyw: M_sol = (p / (100 - p)) * M_produce
    const salt = (targetSalinityPercent / (100 - targetSalinityPercent)) * produceWeightGrams;
    const roundedSalt = Math.round(salt * 10) / 10;
    const totalMass = produceWeightGrams + roundedSalt;

    recommendations.push(
      'Solenie na sucho: po wymieszaniu warzyw z solą odczekaj 15-20 minut, a następnie mocno ugnieć, aż puszczą sok.',
      'Upewnij się, że po upakowaniu w naczyniu warzywa są całkowicie przykryte sokiem własnym.'
    );

    return {
      saltGrams: roundedSalt,
      totalMassGrams: Math.round(totalMass),
      effectiveSalinityPercent: targetSalinityPercent,
      waterGrams: 0,
      recommendations,
    };
  }

  if (method === 'total_mass') {
    // Złota reguła całkowitej masy układu (RD-01):
    // M_sol = (p / (100 - p)) * (M_produce + M_water)
    const baseMass = produceWeightGrams + waterWeightGrams;
    const salt = (targetSalinityPercent / (100 - targetSalinityPercent)) * baseMass;
    const roundedSalt = Math.round(salt * 10) / 10;
    const totalMass = baseMass + roundedSalt;

    // Chlorek wapnia (CaCl2) dla super chrupkości (0.05% - 0.1% masy całkowitej)
    const caCl2 = Math.round(totalMass * 0.0008 * 10) / 10;

    recommendations.push(
      `Obliczono sól dla CAŁKOWITEJ masy słoika (${produceWeightGrams}g warzyw + ${waterWeightGrams}g wody).`,
      'Dzięki temu stężenie soli nie spadnie po wyjściu soków z warzyw, a kiszonka zachowa idealną chrupkość.'
    );

    if (produceWeightGrams > 0) {
      recommendations.push(
        'Dla dodatkowej chrupkości dodaj liść dębu, wiśni lub chrzanu (zawierają naturalne taniny).'
      );
    }

    return {
      saltGrams: roundedSalt,
      totalMassGrams: Math.round(totalMass),
      effectiveSalinityPercent: targetSalinityPercent,
      waterGrams: waterWeightGrams,
      calciumChlorideGrams: caCl2 > 0 ? caCl2 : undefined,
      recommendations,
    };
  }

  // Metoda tradycyjna (tylko od wody) - ostrzegamy przed błędem rozcieńczenia
  const saltWaterOnly = (targetSalinityPercent / 100) * waterWeightGrams;
  const roundedSaltWaterOnly = Math.round(saltWaterOnly * 10) / 10;
  const totalBase = produceWeightGrams + waterWeightGrams;
  const actualEffectivePercent = Math.round((roundedSaltWaterOnly / totalBase) * 1000) / 10;

  recommendations.push(
    `UWAGA: Solenie liczone wyłącznie od wody (${targetSalinityPercent}%) zostanie rozcieńczone przez wodę z warzyw!`,
    `Rzeczywiste stężenie soli w słoiku spadnie do ok. ${actualEffectivePercent}%, co może spowodować mięknięcie ogórków.`,
    'Zalecamy przełączenie na tryb „Całkowita masa układu”, aby uzyskać 100% gwarancji chrupkości.'
  );

  return {
    saltGrams: roundedSaltWaterOnly,
    totalMassGrams: Math.round(totalBase + roundedSaltWaterOnly),
    effectiveSalinityPercent: actualEffectivePercent,
    waterGrams: waterWeightGrams,
    recommendations,
  };
}
