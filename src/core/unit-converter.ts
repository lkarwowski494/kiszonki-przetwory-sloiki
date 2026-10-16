// ============================================================================
// Słoik (Jarwise) — Unit Converter (Metric / Imperial — Apps4Brew Parity)
// Obsługa jednostek metrycznych (°C, g, kg, ml, l) i imperialnych (°F, oz, lbs, fl oz, qt)
// 100% Offline-First, Deterministyczna matematyka kuchenna.
// ============================================================================

export type UnitSystem = 'metric' | 'imperial';

/**
 * Przelicza stopnie Celsjusza na Fahrenheita
 */
export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

/**
 * Przelicza stopnie Fahrenheita na Celsjusza
 */
export function fahrenheitToCelsius(f: number): number {
  return Math.round(((f - 32) * 5) / 9);
}

/**
 * Przelicza gramy na uncje wagowe (oz)
 */
export function gramsToOunces(g: number): number {
  return parseFloat((g * 0.03527396195).toFixed(2));
}

/**
 * Przelicza uncje wagowe (oz) na gramy
 */
export function ouncesToGrams(oz: number): number {
  return Math.round(oz / 0.03527396195);
}

/**
 * Przelicza kilogramy na funty (lbs)
 */
export function kgToPounds(kg: number): number {
  return parseFloat((kg * 2.20462262).toFixed(2));
}

/**
 * Przelicza funty (lbs) na kilogramy
 */
export function poundsToKg(lbs: number): number {
  return parseFloat((lbs / 2.20462262).toFixed(2));
}

/**
 * Przelicza mililitry / gramy wody na uncje objętościowe (fl oz)
 */
export function mlToFluidOunces(ml: number): number {
  return parseFloat((ml * 0.0338140227).toFixed(2));
}

/**
 * Przelicza uncje objętościowe (fl oz) na mililitry / gramy wody
 */
export function fluidOuncesToMl(flOz: number): number {
  return Math.round(flOz / 0.0338140227);
}

/**
 * Przelicza litry na kwarty amerykańskie (quarts)
 */
export function litersToQuarts(l: number): number {
  return parseFloat((l * 1.05668821).toFixed(2));
}

/**
 * Formatuje temperaturę zgodnie z wybranym układem jednostek
 */
export function formatTemperature(celsius: number, unitSystem: UnitSystem = 'metric'): string {
  if (unitSystem === 'imperial') {
    return `${celsiusToFahrenheit(celsius)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

/**
 * Formatuje wagę surowca warzywnego (g lub oz/lbs)
 */
export function formatProduceWeight(grams: number, unitSystem: UnitSystem = 'metric'): string {
  if (unitSystem === 'imperial') {
    if (grams >= 453.592) {
      return `${kgToPounds(grams / 1000)} lbs`;
    }
    return `${gramsToOunces(grams)} oz`;
  }
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)} kg`;
  }
  return `${grams}g`;
}

/**
 * Formatuje wagę soli (g lub oz)
 */
export function formatSaltWeight(grams: number, unitSystem: UnitSystem = 'metric'): string {
  if (unitSystem === 'imperial') {
    return `${gramsToOunces(grams)} oz`;
  }
  return `${grams}g`;
}

/**
 * Formatuje objętość wody / solanki
 */
export function formatBrineVolume(ml: number, unitSystem: UnitSystem = 'metric'): string {
  if (unitSystem === 'imperial') {
    if (ml >= 946.353) {
      return `${litersToQuarts(ml / 1000)} qt`;
    }
    return `${mlToFluidOunces(ml)} fl oz`;
  }
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(1)} L`;
  }
  return `${ml} ml`;
}
