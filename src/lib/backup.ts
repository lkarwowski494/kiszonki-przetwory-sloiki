// ============================================================================
// Słoik (Jarwise) — Auto-Backup Rotacyjny & Eksport CSV (Apps4Brew SEC-09 / Parity)
// 10 najnowszych kopii automatycznych w Documents/Backup/ + Kopia bezpieczeństwa
// przed operacjami niszczącymi + Eksport CSV. 100% Offline-First.
// ============================================================================

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  BatchRecord,
  PantryItemRecord,
  FermentationLogRecord,
} from '../data/db/database';
import { ExperimentSeries } from '../core/experiments/types';
import { MasterRecipe } from '../core/types';

export const SCHEMA_VERSION = 1;
export const AUTO_DIR = 'Backup/';
export const AUTO_KEEP = 10;

export const AUTO_RE = /^sloik-(\d{4}-\d{2}-\d{2}-\d{6})(?:-(\d{1,3}))?\.json$/;
export const SAFETY_RE =
  /^sloik-przed-(?:importem|czyszczeniem)-(\d{4}-\d{2}-\d{2}-\d{6})(?:-(\d{1,3}))?\.json$/;

export interface SloikBackupData {
  batches: BatchRecord[];
  pantryItems: PantryItemRecord[];
  fermentationLogs: FermentationLogRecord[];
  experimentSeries?: ExperimentSeries[];
  customRecipes?: MasterRecipe[];
  settings?: Record<string, unknown>;
}

export interface SloikBackupEnvelope {
  format: 'sloik-backup';
  schemaVersion: number;
  exportedAt: string;
  state: SloikBackupData;
}

export function buildBackup(state: SloikBackupData): SloikBackupEnvelope {
  return {
    format: 'sloik-backup',
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    state,
  };
}

export function localISODate(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function stampOf(d: Date = new Date()): string {
  const iso = localISODate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${iso}-${hours}${minutes}${seconds}`;
}

const poolKey = (m: RegExpExecArray) => `${m[1]}-${(m[2] ?? '1').padStart(3, '0')}`;

async function shareTemp(
  name: string,
  body: string,
  opts: { mimeType: string; dialogTitle: string }
): Promise<boolean> {
  const baseDir =
    (FileSystem as any).cacheDirectory ||
    (FileSystem as any).documentDirectory ||
    'file:///tmp/';
  const path = `${baseDir}${name}`;
  try {
    await FileSystem.writeAsStringAsync(path, body);
    if (!(await Sharing.isAvailableAsync())) {
      return false;
    }
    await Sharing.shareAsync(path, opts);
    return true;
  } finally {
    try {
      if (FileSystem.deleteAsync) {
        await FileSystem.deleteAsync(path, { idempotent: true });
      }
    } catch {
      // Ignoruj błąd usuwania cache
    }
  }
}

/**
 * Eksport kopii zapasowej JSON do pliku
 */
export async function exportBackup(state: SloikBackupData): Promise<boolean> {
  const envelope = buildBackup(state);
  const fileName = `sloik-backup-${localISODate()}.json`;
  return await shareTemp(fileName, JSON.stringify(envelope, null, 2), {
    mimeType: 'application/json',
    dialogTitle: 'Kopia zapasowa spiżarni',
  });
}

/**
 * Zapis kopii zapasowej w Documents/Backup/ z rotacją do AUTO_KEEP (10 kopii)
 */
async function writeBackupFile(
  prefix: string,
  re: RegExp,
  state: SloikBackupData
): Promise<string> {
  const docDir = (FileSystem as any).documentDirectory || 'file:///documents/';
  const dir = `${docDir}${AUTO_DIR}`;

  if (FileSystem.getInfoAsync && FileSystem.makeDirectoryAsync) {
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  }

  const stamp = stampOf(new Date());
  let name = `${prefix}${stamp}.json`;

  const envelope = buildBackup(state);
  const targetPath = `${dir}${name}`;

  await FileSystem.writeAsStringAsync(targetPath, JSON.stringify(envelope, null, 2));

  // Rotacja puli kopii do 10 plików
  try {
    if (FileSystem.readDirectoryAsync && FileSystem.deleteAsync) {
      const files = await FileSystem.readDirectoryAsync(dir);
      const pool = files
        .map((f) => [f, re.exec(f)] as const)
        .filter((x): x is readonly [string, RegExpExecArray] => !!x[1]);

      const oldFiles = pool
        .map(([f, m]) => [f, poolKey(m)] as const)
        .sort((a, b) => (a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0))
        .slice(AUTO_KEEP);

      for (const [f] of oldFiles) {
        await FileSystem.deleteAsync(`${dir}${f}`, { idempotent: true });
      }
    }
  } catch {
    // Ignoruj błąd porządkowania rotacji
  }

  return targetPath;
}

/**
 * Automatyczna rotacyjna kopia po zakończeniu partii fermentacji lub pasteryzacji
 */
export async function autoBackup(state: SloikBackupData): Promise<string | null> {
  try {
    return await writeBackupFile('sloik-', AUTO_RE, state);
  } catch {
    return null;
  }
}

/**
 * Kopia bezpieczeństwa przed operacjami niszczącymi (import, czyszczenie)
 */
export async function safetyBackup(
  kind: 'import' | 'reset',
  state: SloikBackupData
): Promise<string> {
  const prefix = kind === 'import' ? 'sloik-przed-importem-' : 'sloik-przed-czyszczeniem-';
  return await writeBackupFile(prefix, SAFETY_RE, state);
}

/**
 * Walidacja kopii zapasowej
 */
export function parseAndValidateBackup(rawJson: string): SloikBackupEnvelope {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    throw new Error('Nieprawidłowy format JSON');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Plik kopii musi być obiektem JSON');
  }

  const envelope = parsed as Partial<SloikBackupEnvelope>;

  if (envelope.format !== 'sloik-backup') {
    throw new Error('Nieznany format pliku (oczekiwano "sloik-backup")');
  }

  if (typeof envelope.schemaVersion !== 'number' || envelope.schemaVersion <= 0) {
    throw new Error('Nieprawidłowa wersja schematu kopii');
  }

  if (envelope.schemaVersion > SCHEMA_VERSION) {
    throw new Error(
      `Kopia pochodzi z nowszej wersji aplikacji (v${envelope.schemaVersion}). Zaktualizuj aplikację.`
    );
  }

  if (!envelope.state || typeof envelope.state !== 'object') {
    throw new Error('Brak danych stanu (sekcja "state") w pliku kopii');
  }

  const state = envelope.state;
  if (!Array.isArray(state.batches)) {
    throw new Error('Nieprawidłowa struktura partii ("batches" musi być tablicą)');
  }
  if (!Array.isArray(state.pantryItems)) {
    throw new Error('Nieprawidłowa struktura spiżarni ("pantryItems" musi być tablicą)');
  }

  return envelope as SloikBackupEnvelope;
}

/**
 * Eksport historii partii do formatu CSV
 */
export function exportBatchesToCsv(batches: BatchRecord[]): string {
  const headers = [
    'ID',
    'Tytul',
    'Kultura',
    'Metoda',
    'Data_Startu',
    'Waga_Warzyw_g',
    'Woda_ml',
    'Sol_g',
    'Zasolenie_proc',
    'Status',
    'Ocena_Gwiazdki',
    'Notatki',
  ];

  const escapeCsv = (val: any) => {
    const s = String(val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = batches.map((b) =>
    [
      b.id,
      b.recipeTitle,
      b.culture,
      b.method,
      new Date(b.startedAt).toISOString(),
      b.produceWeightGrams,
      b.waterWeightGrams,
      b.saltWeightGrams,
      b.salinityPercent,
      b.status,
      b.ratingStars ?? '',
      b.notes ?? '',
    ]
      .map(escapeCsv)
      .join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Eksport stanu spiżarni do formatu CSV
 */
export function exportPantryToCsv(items: PantryItemRecord[]): string {
  const headers = [
    'ID',
    'Partia_ID',
    'Etykieta',
    'Pojemnosc_ml',
    'Lokalizacja',
    'Ilosc_Sztuk',
    'Data_Zapieczetowania',
    'Najlepiej_Spozyc_Do',
    'Czy_Zjedzony',
  ];

  const escapeCsv = (val: any) => {
    const s = String(val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = items.map((i) =>
    [
      i.id,
      i.batchId,
      i.label,
      i.jarVolumeMl,
      i.location,
      i.quantity,
      new Date(i.sealedAt).toISOString(),
      new Date(i.bestBefore).toISOString(),
      i.isConsumed ? 'TAK' : 'NIE',
    ]
      .map(escapeCsv)
      .join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}
