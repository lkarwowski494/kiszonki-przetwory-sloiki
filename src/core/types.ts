export type RecipeCategory =
  | 'poland_central_europe'
  | 'east_asia'
  | 'mideast_maghreb_india'
  | 'americas_mediterranean'
  | 'sweet_preserves'
  | 'drinks_vinegars';

export type PreserveMethod =
  | 'lacto_fermentation'
  | 'vinegar_pickling'
  | 'sweet_preserve'
  | 'oil_cure'
  | 'beverage_ferment';

export interface Ingredient {
  name: string;
  amount: number;
  unit: 'g' | 'ml' | 'szt' | 'łyżka' | 'łyżeczka' | 'do_smaku';
  isMandatory: boolean;
  notes?: string;
}

export interface SensoryMilestone {
  day: number;
  title: string;
  sensoryDescription: string;
  actionRequired?: string;
  isTastingCheckpoint?: boolean;
}

export interface MasterRecipe {
  id: string;
  title: string;
  subtitle: string;
  culture: string;
  category: RecipeCategory;
  method: PreserveMethod;
  defaultProduceWeightGrams: number;
  defaultSalinityPercent: number;
  fermentationDays: number;
  shelfLifeMonths: number;
  recommendedJarType: string;
  ingredients: Ingredient[];
  steps: string[];
  crispnessSecrets: string[];
  sensoryMilestones: SensoryMilestone[];
  commonMistakes: string[];
}

export interface BrineCalculationInput {
  produceWeightGrams: number;
  waterWeightGrams: number;
  targetSalinityPercent: number; // np. 2.5
  method: 'total_mass' | 'water_only' | 'dry_salting';
}

export interface BrineCalculationOutput {
  saltGrams: number;
  totalMassGrams: number;
  effectiveSalinityPercent: number;
  waterGrams: number;
  calciumChlorideGrams?: number;
  recommendations: string[];
}

export interface PasteurizationInput {
  foodPh: number;
  jarVolumeMl: number;
  method: 'water_bath' | 'oven' | 'sous_vide' | 'tyndallization';
  targetP0?: number;
}

export interface PasteurizationOutput {
  isSafeForWaterBath: boolean;
  requiresPressureCanning: boolean;
  targetMinutes: number;
  temperatureCelsius: number;
  safetyWarning?: string;
  testSteps: string[];
}

export interface DoctorNode {
  id: string;
  question: string;
  options: {
    label: string;
    nextNodeId?: string;
    diagnosisId?: string;
  }[];
}

export interface Diagnosis {
  id: string;
  title: string;
  isSafeToEat: boolean;
  severity: 'safe' | 'caution' | 'danger_discard';
  shortExplanation: string;
  detailedCause: string;
  actionSteps: string[];
  howToPreventNextTime: string;
}
