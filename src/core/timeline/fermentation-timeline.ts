import { MasterRecipe, SensoryMilestone } from '../types';

export interface CalculatedMilestone extends SensoryMilestone {
  estimatedTimestamp: number;
  formattedDate: string;
  isUrgentAction: boolean;
}

export interface TimelineCalculationResult {
  recipeId: string;
  recipeTitle: string;
  startedAt: number;
  ambientTempCelsius: number;
  speedMultiplier: number;
  estimatedCompletionTimestamp: number;
  burpingDays: number[];
  milestones: CalculatedMilestone[];
  tastingCheckpointTimestamp?: number;
  coldStorageRecommendedTimestamp?: number;
}

/**
 * Przelicza harmonogram fermentacji z uwzględnieniem temperatury w kuchni (kinetyka Arrheniusa / Q10 = 2.0)
 * Temperatura bazowa: 20°C.
 */
export function calculateFermentationTimeline(
  recipe: MasterRecipe,
  startedAtTimestamp: number,
  ambientTempCelsius: number = 20
): TimelineCalculationResult {
  // Ograniczenie temperatury do realnych warunków domowych (12°C - 32°C)
  const clampedTemp = Math.max(12, Math.min(32, ambientTempCelsius));

  // Współczynnik przyspieszenia kinetyki Q10 = 2.0 (wzrost o 10°C podwaja tempo)
  const tempDelta = clampedTemp - 20;
  const speedMultiplier = Math.pow(2.0, tempDelta / 10);

  const baseDays = Math.max(1, recipe.fermentationDays);
  const adjustedTotalDays = Math.max(1, Math.round((baseDays / speedMultiplier) * 10) / 10);
  const totalDurationMs = adjustedTotalDays * 24 * 60 * 60 * 1000;
  const estimatedCompletionTimestamp = startedAtTimestamp + totalDurationMs;

  const calculatedMilestones: CalculatedMilestone[] = [];
  const burpingDays: number[] = [];
  let tastingCheckpointTimestamp: number | undefined;
  let coldStorageRecommendedTimestamp: number | undefined;

  // Dni burzliwe wymagające odgazowywania (zwykle pierwsze 4 dni przeliczone wg temperatury)
  const activeBurpingCutoffDay = Math.min(adjustedTotalDays, Math.max(2, Math.round(4 / speedMultiplier)));
  for (let d = 1; d <= activeBurpingCutoffDay; d++) {
    burpingDays.push(d);
  }

  for (const m of recipe.sensoryMilestones) {
    const adjustedDay = Math.max(1, Math.round((m.day / speedMultiplier) * 10) / 10);
    const milestoneTimestamp = startedAtTimestamp + adjustedDay * 24 * 60 * 60 * 1000;

    const dateObj = new Date(milestoneTimestamp);
    const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}.${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;

    const isUrgent = Boolean(m.actionRequired || m.isTastingCheckpoint);

    calculatedMilestones.push({
      ...m,
      day: adjustedDay,
      estimatedTimestamp: milestoneTimestamp,
      formattedDate,
      isUrgentAction: isUrgent,
    });

    if (m.isTastingCheckpoint && !tastingCheckpointTimestamp) {
      tastingCheckpointTimestamp = milestoneTimestamp;
    }

    if (m.actionRequired?.toLowerCase().includes('lodów') || m.actionRequired?.toLowerCase().includes('piwnic')) {
      coldStorageRecommendedTimestamp = milestoneTimestamp;
    }
  }

  return {
    recipeId: recipe.id,
    recipeTitle: recipe.title,
    startedAt: startedAtTimestamp,
    ambientTempCelsius: clampedTemp,
    speedMultiplier: Math.round(speedMultiplier * 100) / 100,
    estimatedCompletionTimestamp,
    burpingDays,
    milestones: calculatedMilestones,
    tastingCheckpointTimestamp,
    coldStorageRecommendedTimestamp,
  };
}
