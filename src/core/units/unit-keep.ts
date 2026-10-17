// ============================================================================
// Apps4Brew / Słoik — Unit Conversion Without Drift (RD-ENG-01, BR-TEST-005)
// wInKeep: preserves exact stored base value when user re-enters or confirms
// the same displayed rounded value.
// ============================================================================

export type WeightUnit = 'kg' | 'lb' | 'g' | 'oz';
export type VolumeUnit = 'ml' | 'fl_oz' | 'l';
export type TempUnit = 'C' | 'F';

export const CONVERSION_FACTORS: Record<string, number> = {
  // Base: kg
  kg: 1.0,
  lb: 2.20462262185,
  // Base: g
  g: 1.0,
  oz: 0.03527396195,
  // Base: ml
  ml: 1.0,
  fl_oz: 0.033814,
  l: 0.001,
};

/**
 * Normalizacja wejścia numerycznego (zamiana przecinka na kropkę, usunięcie spacji)
 */
export function normalizeNumString(txt: string): string {
  return txt.trim().replace(/\s+/g, '').replace(',', '.');
}

/**
 * Zaokrąglenie do 1 miejsca po przecinku
 */
export function round1(val: number): number {
  return Math.round(val * 10) / 10;
}

/**
 * Zaokrąglenie do 2 miejsc po przecinku
 */
export function round2(val: number): number {
  return Math.round(val * 100) / 100;
}

/**
 * Wyświetlana wartość dla danej jednostki
 */
export function formatValueForUnit(baseVal: number, unit: string): number {
  const factor = CONVERSION_FACTORS[unit] ?? 1.0;
  return round1(baseVal * factor);
}

/**
 * Główna reguła inżynieryjna RD-ENG-01:
 * wInKeep(txt, unit, prevBase)
 * 
 * Jeśli wpisana wartość zgadza się po zaokrągleniu z reprezentacją poprzedniej
 * wartości bazowej, zwraca dokładnie prevBase (zero dryfu zaokrągleń).
 */
export function wInKeep(txt: string, unit: string, prevBase?: number): number {
  const normalized = normalizeNumString(txt);
  const parsed = parseFloat(normalized);
  if (isNaN(parsed)) {
    return prevBase ?? 0;
  }

  const factor = CONVERSION_FACTORS[unit] ?? 1.0;

  if (prevBase != null && prevBase > 0) {
    const displayedPrev = formatValueForUnit(prevBase, unit);
    if (round1(parsed) === displayedPrev) {
      return prevBase;
    }
  }

  // Nowa wartość przeliczona na bazową (zaokrąglona do 2 miejsc po przecinku)
  return round2(parsed / factor);
}
