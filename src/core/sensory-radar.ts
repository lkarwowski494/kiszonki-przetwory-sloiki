// ============================================================================
// Słoik (Jarwise) — Dziennik Sensoryczny & Wektorowy Radar Kiszonki (Parity S3)
// 5 kluczowych osi rzemiosła przetwórczego:
// 1. Kwasowość (Acidity)
// 2. Słoność (Salinity)
// 3. Chrupkość / Tekstura (Crispness)
// 4. Musowanie / Gaz (Effervescence)
// 5. Aromat / Bukiet ziół (Aroma)
// Skala 1 do 5. Pure TypeScript domain logic.
// ============================================================================

export interface FermentSensoryProfile {
  acidity: number;       // 1 - 5 (1: mdła/płaska, 3: zbalansowana, 5: bardzo mocno zakwaszona)
  salinity: number;      // 1 - 5 (1: niedosolona, 3: idealnie zbalansowana, 5: przesolona)
  crispness: number;     // 1 - 5 (1: gąbczasta/miękka, 3: sprężysta, 5: wybitnie chrupiąca z trzaskiem)
  effervescence: number; // 1 - 5 (1: spokojna/martwa, 3: orzeźwiające bąbelki, 5: silne musowanie probiotyczne)
  aroma: number;         // 1 - 5 (1: brak aromatu, 3: czysty koper i czosnek, 5: bogaty, wielowymiarowy bukiet)
}

export const DEFAULT_FERMENT_SENSORY_PROFILE: FermentSensoryProfile = {
  acidity: 3,
  salinity: 3,
  crispness: 4,
  effervescence: 2,
  aroma: 4,
};

export interface SensoryAxisDefinition {
  key: keyof FermentSensoryProfile;
  labelPl: string;
  labelEn: string;
}

export const FERMENT_SENSORY_AXES: SensoryAxisDefinition[] = [
  { key: 'acidity', labelPl: 'Kwasowość', labelEn: 'Acidity' },
  { key: 'salinity', labelPl: 'Słoność', labelEn: 'Salinity' },
  { key: 'crispness', labelPl: 'Chrupkość', labelEn: 'Crispness' },
  { key: 'effervescence', labelPl: 'Musowanie', labelEn: 'Effervescence' },
  { key: 'aroma', labelPl: 'Aromat', labelEn: 'Aroma' },
];

/**
 * Zwraca znormalizowane współrzędne wierzchołków wielokąta dla wykresu radarowego
 */
export function calculateRadarCoordinates(
  profile: FermentSensoryProfile,
  size: number = 220
): {
  center: number;
  maxRadius: number;
  levels: Array<{ level: number; points: Array<{ x: number; y: number }> }>;
  dataPoints: Array<{ key: keyof FermentSensoryProfile; x: number; y: number; value: number }>;
} {
  const center = size / 2;
  const maxRadius = (size / 2) * 0.70;
  const numAxes = FERMENT_SENSORY_AXES.length;

  const getCoord = (index: number, radius: number) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / numAxes;
    return {
      x: parseFloat((center + radius * Math.cos(angle)).toFixed(1)),
      y: parseFloat((center + radius * Math.sin(angle)).toFixed(1)),
    };
  };

  const levels = [1, 2, 3, 4, 5].map((level) => {
    const r = (level / 5) * maxRadius;
    const points = FERMENT_SENSORY_AXES.map((_, i) => getCoord(i, r));
    return { level, points };
  });

  const dataPoints = FERMENT_SENSORY_AXES.map((axis, i) => {
    const rawVal = profile[axis.key] ?? 1;
    const clampedVal = Math.min(5, Math.max(1, rawVal));
    const r = (clampedVal / 5) * maxRadius;
    const coord = getCoord(i, r);
    return {
      key: axis.key,
      x: coord.x,
      y: coord.y,
      value: clampedVal,
    };
  });

  return { center, maxRadius, levels, dataPoints };
}
