// ============================================================================
// Apps4Brew / Słoik — Background-Resistant Timer Engine (RD-ENG-06, NFR-PERF-004)
// remainingTimerSec: calculates remaining seconds from target end timestamp
// endAtMs - Date.now(), fully immune to background suspension.
// ============================================================================

/**
 * Wyliczenie docelowego znacznika czasu zakończenia timera (ms)
 */
export function startTimerTimestamp(durationSeconds: number, startAtMs: number = Date.now()): number {
  return startAtMs + Math.max(0, durationSeconds) * 1000;
}

/**
 * Wyliczenie pozostałego czasu (w sekundach) odporne na uśpienie w tle (RD-ENG-06)
 * r = max(0, ceil((endAtMs - nowMs) / 1000))
 */
export function calculateRemainingTimerSec(endAtMs: number, nowMs: number = Date.now()): number {
  const diffMs = endAtMs - nowMs;
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / 1000);
}

/**
 * Zatrzymanie (pauza) timera: zwraca pozostały czas w sekundach
 */
export function pauseTimerTimestamp(endAtMs: number, pauseAtMs: number = Date.now()): number {
  const diffMs = endAtMs - pauseAtMs;
  return Math.max(0, Math.ceil(diffMs / 1000));
}
