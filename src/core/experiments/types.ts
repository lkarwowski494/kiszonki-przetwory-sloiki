// ============================================================================
// Słoik (Jarwise) — Multi-Jar Split-Batch Lab Types (BR-EXP-001…006)
// Apps4Brew Studio.
// ============================================================================

export type ExperimentAxis =
  | 'tannins_crispness'
  | 'salinity'
  | 'spices_herbs'
  | 'acid_sugar'
  | 'starter_microbiology'
  | 'custom';

export interface SensoryEvaluation {
  textureCrispness: number;    // 0 - 35 pkt (Chrupkość i jędrność tkanki)
  flavorAcidBalance: number;   // 0 - 35 pkt (Balans kwasu, soli i głębia umami)
  aroma: number;               // 0 - 20 pkt (Czystość bukietu fermentacyjnego)
  appearance: number;          // 0 - 10 pkt (Klarowność solanki, barwa)
  totalScore: number;          // 0 - 100 pkt
  tastingNotes?: string;       // Uwagi degustatora
  tastedAt: number;            // Timestamp
}

export interface ExperimentVariant {
  id: string;
  seriesId: string;
  variantLetter: string;       // 'A', 'B', 'C', 'D', 'E', etc.
  name: string;                // np. "Wariant A (Liść dębu)"
  parameterDelta: string;      // Dokładny opis zmiennej: np. "3 liście dębu, sól 2.0%"
  produceGrams: number;        // Gramatura wsadu warzywnego
  waterGrams: number;          // Woda w solance
  saltGrams: number;           // Sól w solance
  salinityPercent: number;     // Zasolenie %
  specialAdditions: string[];  // Unikalne dodatki dla tego słoika
  batchId?: string;            // Powiązanie z ID partii w tabeli batches
  sensoryScore?: SensoryEvaluation;
  isWinner?: boolean;          // Czy oznaczony jako zwycięski
}

export interface ExperimentSeries {
  id: string;
  title: string;               // Tytuł eksperymentu
  baseProduceName: string;     // Nazwa surowca (np. Ogórki gruntowe)
  totalProduceGrams: number;   // Łączna waga surowca do podziału
  jarCount: number;            // Liczba słoików (2 - 8)
  hypothesis: string;          // Hipoteza badawcza
  axis: ExperimentAxis;        // Oś testowa
  status: 'draft' | 'fermenting' | 'cupping_ready' | 'completed';
  variants: ExperimentVariant[];
  blindCuppingEnabled: boolean;// Czy ślepa degustacja jest aktywna
  createdAt: number;
  completedAt?: number;
}
