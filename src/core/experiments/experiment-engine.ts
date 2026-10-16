// ============================================================================
// Słoik (Jarwise) — Multi-Jar Split-Batch Lab & Sensory Engine (BR-EXP-001…006)
// Apps4Brew Studio. Pure TypeScript, zero external dependencies, 100% testable.
// ============================================================================

import { MasterRecipe } from '../types';
import {
  ExperimentAxis,
  ExperimentSeries,
  ExperimentVariant,
  SensoryEvaluation,
} from './types';

export interface CreateSplitBatchInput {
  title: string;
  baseProduceName: string;
  totalProduceGrams: number;
  jarCount: number; // 2..8
  hypothesis: string;
  axis: ExperimentAxis;
  baseSalinityPercent?: number;
  variantDeltas?: Array<{
    name?: string;
    parameterDelta: string;
    specialAdditions?: string[];
    salinityPercent?: number;
  }>;
}

export interface RankedVariant {
  variant: ExperimentVariant;
  rank: number;
  totalScore: number;
  isWinner: boolean;
}

/**
 * BR-EXP-004: Standardowy arkusz sensoryczny (100 punktów):
 * - Tekstura i chrupkość: 0..35 pkt
 * - Balans kwasowości i smaku: 0..35 pkt
 * - Aromat i bukiet fermentacji: 0..20 pkt
 * - Wygląd i barwa solanki: 0..10 pkt
 */
export function calculateSensoryScore(
  input: {
    textureCrispness: number;
    flavorAcidBalance: number;
    aroma: number;
    appearance: number;
    tastingNotes?: string;
  },
  tastedAt: number = Date.now()
): SensoryEvaluation {
  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, Number.isFinite(val) ? val : 0));

  const textureCrispness = clamp(Math.round(input.textureCrispness * 10) / 10, 0, 35);
  const flavorAcidBalance = clamp(Math.round(input.flavorAcidBalance * 10) / 10, 0, 35);
  const aroma = clamp(Math.round(input.aroma * 10) / 10, 0, 20);
  const appearance = clamp(Math.round(input.appearance * 10) / 10, 0, 10);

  const totalScore =
    Math.round((textureCrispness + flavorAcidBalance + aroma + appearance) * 10) / 10;

  return {
    textureCrispness,
    flavorAcidBalance,
    aroma,
    appearance,
    totalScore,
    tastingNotes: input.tastingNotes ? input.tastingNotes.trim() : undefined,
    tastedAt,
  };
}

/**
 * BR-EXP-001: Kreator Split-Batch (2 do 8 słoików równomiernie podzielonych).
 */
export function createSplitBatchExperiment(input: CreateSplitBatchInput): ExperimentSeries {
  const jarCount = Math.max(2, Math.min(8, Math.floor(input.jarCount || 2)));
  const totalProduce = Math.max(100, Math.round(input.totalProduceGrams || 1000));
  const producePerJar = Math.round(totalProduce / jarCount);
  const baseSalinity = input.baseSalinityPercent ?? 2.0;

  const seriesId = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // Szacunkowa pojemność solanki na słoik: ok. 80% masy wsadu
  const waterPerJar = Math.round(producePerJar * 0.8);

  const variants: ExperimentVariant[] = [];
  for (let i = 0; i < jarCount; i++) {
    const letter = letters[i];
    const userDelta = input.variantDeltas?.[i];
    const salinity = userDelta?.salinityPercent ?? baseSalinity;

    // Sól wg metody całkowitej masy: (Produce + Water) * (salinity / 100)
    const saltGrams = Math.round((producePerJar + waterPerJar) * (salinity / 100) * 10) / 10;

    const deltaDesc =
      userDelta?.parameterDelta ||
      (i === 0 ? 'Wariant kontrolny (baza)' : `Wariant testowy #${i + 1}`);
    const variantName = userDelta?.name || `Słoik ${letter} (${deltaDesc})`;

    variants.push({
      id: `${seriesId}_var_${letter.toLowerCase()}`,
      seriesId,
      variantLetter: letter,
      name: variantName,
      parameterDelta: deltaDesc,
      produceGrams: producePerJar,
      waterGrams: waterPerJar,
      saltGrams,
      salinityPercent: salinity,
      specialAdditions: userDelta?.specialAdditions || [],
    });
  }

  return {
    id: seriesId,
    title: input.title.trim() || `Eksperyment: ${input.baseProduceName}`,
    baseProduceName: input.baseProduceName.trim() || 'Ogórki',
    totalProduceGrams: totalProduce,
    jarCount,
    hypothesis: input.hypothesis.trim() || 'Weryfikacja optymalnych parametrów',
    axis: input.axis,
    status: 'draft',
    variants,
    blindCuppingEnabled: false,
    createdAt: Date.now(),
  };
}

/**
 * BR-EXP-005: Ranking wielosłoikowy (Side-by-Side Showdown).
 * Sortuje warianty wg oceny sensorycznej z obsługą remisów.
 */
export function rankVariants(variants: ExperimentVariant[]): RankedVariant[] {
  const sorted = [...variants].sort((a, b) => {
    const scoreA = a.sensoryScore?.totalScore ?? -1;
    const scoreB = b.sensoryScore?.totalScore ?? -1;
    return scoreB - scoreA;
  });

  let currentRank = 1;
  const result: RankedVariant[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const currentScore = current.sensoryScore?.totalScore ?? 0;

    if (i > 0) {
      const prevScore = sorted[i - 1].sensoryScore?.totalScore ?? 0;
      if (currentScore < prevScore) {
        currentRank = i + 1;
      }
    }

    result.push({
      variant: current,
      rank: currentRank,
      totalScore: currentScore,
      isWinner: currentRank === 1 && currentScore > 0,
    });
  }

  return result;
}

/**
 * BR-EXP-006: Promocja wariantu do Przepisu Mistrzowskiego (Master Recipe).
 * Skaluje proporcje pojedynczego słoika do uniwersalnego standardu 1000g wsadu bazowego.
 */
export function promoteVariantToCustomRecipe(
  variant: ExperimentVariant,
  seriesTitle: string,
  customTitle?: string
): MasterRecipe {
  const scale = variant.produceGrams > 0 ? 1000 / variant.produceGrams : 1;
  const scaledWater = Math.round(variant.waterGrams * scale);
  const scaledSalt = Math.round(variant.saltGrams * scale * 10) / 10;

  const ingredients = [
    {
      name: 'Warzywo bazowe (zwycięska formuła)',
      amount: 1000,
      unit: 'g' as const,
      isMandatory: true,
    },
    {
      name: 'Woda filtrowana / źródlana',
      amount: scaledWater,
      unit: 'ml' as const,
      isMandatory: true,
    },
    {
      name: 'Sól kamienna niejodowana (Kłodawa)',
      amount: scaledSalt,
      unit: 'g' as const,
      isMandatory: true,
      notes: `Zasolenie: ${variant.salinityPercent}%`,
    },
    ...variant.specialAdditions.map((addition) => ({
      name: addition,
      amount: 1,
      unit: 'do_smaku' as const,
      isMandatory: false,
    })),
  ];

  const title =
    customTitle?.trim() || `Mistrzowski: ${seriesTitle} (Wariant ${variant.variantLetter})`;

  return {
    id: `custom_recipe_${Date.now()}_${variant.variantLetter.toLowerCase()}`,
    title,
    subtitle: `Wyłoniony w konkursie split-batch (Ocena: ${variant.sensoryScore?.totalScore ?? 0}/100 pkt)`,
    culture: 'Autorski przepis Apps4Brew',
    category: 'poland_central_europe',
    method: 'lacto_fermentation',
    defaultProduceWeightGrams: 1000,
    defaultSalinityPercent: variant.salinityPercent,
    fermentationDays: 5,
    shelfLifeMonths: 12,
    recommendedJarType: 'Słoik Weck / Twist-off 1000 ml z uszczelką',
    ingredients,
    steps: [
      'Przygotuj surowiec bazowy, starannie umyj i osusz.',
      `Przygotuj solankę: rozpuść ${scaledSalt} g soli w ${scaledWater} ml wody (${variant.salinityPercent}%).`,
      `Dodaj unikalne składniki wariantu mistrzowskiego: ${variant.parameterDelta}.`,
      'Zalej warzywa, upewnij się, że są całkowicie zanurzone pod dociskiem.',
      'Fermentuj w temperaturze 18-22°C, kontrolując kwasowość.',
    ],
    crispnessSecrets: [
      `Zwycięska formuła z laboratorium: ${variant.parameterDelta}`,
      ...(variant.sensoryScore?.tastingNotes
        ? [`Notatka degustacyjna panelu: "${variant.sensoryScore.tastingNotes}"`]
        : []),
    ],
    sensoryMilestones: [
      {
        day: 1,
        title: 'Start fermentacji',
        sensoryDescription: 'Pojawienie się pierwszych pęcherzyków CO2.',
      },
      {
        day: 3,
        title: 'Aktywne zakwaszanie',
        sensoryDescription: 'Zapach orzeźwiający, lekko mlekowy, solanka mętna.',
        isTastingCheckpoint: true,
      },
      {
        day: 5,
        title: 'Pełnia smaku mistrzowskiego',
        sensoryDescription:
          'Idealna chrupkość i zbalansowana kwasowość potwierdzona w laboratorium.',
        isTastingCheckpoint: true,
      },
    ],
    commonMistakes: [
      'Użycie soli jodowanej lub z antyzbrylaczem (zmiękcza tkankę roślinną).',
      'Niewystarczające zanurzenie warzyw w solance.',
    ],
  };
}
