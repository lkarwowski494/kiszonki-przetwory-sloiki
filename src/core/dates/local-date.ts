// ============================================================================
// Apps4Brew / Słoik — DST-Resilient Local Date Handling (RD-ENG-05, BR-TEST-015)
// Operacje na lokalnych datach kalendarzowych odporne na przesunięcia czasu letniego/zimowego.
// ============================================================================

/**
 * Zwraca lokalny klucz daty w formacie YYYY-MM-DD
 */
export function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Parsuje klucz YYYY-MM-DD na obiekt Date ustawiony na godzinę 12:00:00 lokalnego czasu.
 * Ustawienie na południe (12:00:00) chroni przed przesunięciem o +-1h w dniu zmiany czasu DST.
 */
export function parseLocalDateKey(key: string): Date {
  const parts = key.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

/**
 * Dodaje zadaną liczbę dni kalendarzowych do klucza YYYY-MM-DD w sposób odporny na DST.
 */
export function addDaysLocal(key: string, days: number): string {
  const date = parseLocalDateKey(key);
  date.setDate(date.getDate() + days);
  return localDateKey(date);
}

/**
 * Formatuje klucz daty do czytelnego DD.MM
 */
export function formatDayMonthKey(key: string): string {
  const parts = key.split('-');
  return `${parts[2]}.${parts[1]}`;
}
