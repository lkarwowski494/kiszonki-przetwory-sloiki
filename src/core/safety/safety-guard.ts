import { PasteurizationInput, PasteurizationOutput } from '../types';

export const BOTULISM_PH_CRITICAL = 4.60;
export const DOMESTIC_SAFETY_PH_BUFFER = 4.20;

/**
 * Strażnik Bezpieczeństwa Pasteryzacji i Bariery Botulinowej (USDA AI-539 / FDA BAM)
 */
export function evaluatePasteurizationSafety(input: PasteurizationInput): PasteurizationOutput {
  const { foodPh, jarVolumeMl, method } = input;

  const testSteps = [
    'Po zakończeniu pasteryzacji wyjmij słoiki i odstaw na ściereczkę do powolnego ostygnięcia (nie stawiaj na zimnym blacie).',
    'Nie dociskaj wieczek Twist-Off na siłę podczas stygnięcia — podciśnienie musi wytworzyć się samoistnie.',
    'Po 12–24 godzinach sprawdź kliknięcie wieczka: środek pokrywki musi być wklęsły i sztywny.',
    'Jeśli wieczko sprężynuje („klika”), słoik nie trzyma próżni — wstaw go do lodówki i zjedz w ciągu kilku dni.'
  ];

  if (foodPh >= BOTULISM_PH_CRITICAL) {
    // Żywność o niskiej kwasowości (warzywa bez octu, czosnek w oliwie, mięsa, grzyby słodkowodne)
    if (method === 'water_bath' || method === 'oven') {
      return {
        isSafeForWaterBath: false,
        requiresPressureCanning: true,
        targetMinutes: 0,
        temperatureCelsius: 100,
        safetyWarning:
          'KRYTYCZNE OSTRZEŻENIE BEZPIECZEŃSTWA: Produkt ma pH ≥ 4.60 (niska kwasowość). Zwykłe gotowanie w wodzie (100°C) nie zabija przetrwalników Clostridium botulinum (jadu kiełbasianego). Wymagana jest sterylizacja ciśnieniowa (szybkowar/kocioł ciśnieniowy 121°C / 15 PSI) lub 3-krotna tyndalizacja w odstępach 24h!',
        testSteps,
      };
    }

    if (method === 'tyndallization') {
      return {
        isSafeForWaterBath: true,
        requiresPressureCanning: false,
        targetMinutes: 60, // 3 x 60 min
        temperatureCelsius: 100,
        safetyWarning:
          'Tyndalizacja (frakcjonowana pasteryzacja): gotuj słoiki 3 razy w odstępach dokładnie 24 godzin (Dzień 1: 60 min, Dzień 2: 40 min, Dzień 3: 30 min). Przetrzymuj między gotowaniami w temperaturze pokojowej, aby przetrwalniki skiełkowały.',
        testSteps,
      };
    }
  }

  // Żywność kwasowa (pH < 4.60: kiszonki, pikle octowe, dżemy, powidła, pomidory)
  let baseMinutes = 15;
  if (jarVolumeMl <= 350) {
    baseMinutes = 10;
  } else if (jarVolumeMl <= 550) {
    baseMinutes = 15;
  } else if (jarVolumeMl <= 1000) {
    baseMinutes = 20;
  } else {
    baseMinutes = 30;
  }

  if (method === 'oven') {
    return {
      isSafeForWaterBath: true,
      requiresPressureCanning: false,
      targetMinutes: baseMinutes + 15, // Piekarnik wolniej penetruje ciepłem
      temperatureCelsius: 120,
      testSteps,
    };
  }

  if (method === 'sous_vide') {
    return {
      isSafeForWaterBath: true,
      requiresPressureCanning: false,
      targetMinutes: baseMinutes * 2,
      temperatureCelsius: 85,
      testSteps,
    };
  }

  return {
    isSafeForWaterBath: true,
    requiresPressureCanning: false,
    targetMinutes: baseMinutes,
    temperatureCelsius: 100,
    testSteps,
  };
}
