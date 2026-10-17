import {
  buildBackup,
  parseAndValidateBackup,
  exportBatchesToCsv,
  exportPantryToCsv,
  autoBackup,
  safetyBackup,
  SloikBackupData,
} from '../backup';
import { BatchRecord, PantryItemRecord } from '../../data/db/database';

describe('Backup & CSV System (Apps4Brew SEC-09 / Parity S2)', () => {
  const sampleState: SloikBackupData = {
    batches: [
      {
        id: 'batch_test_01',
        recipeId: 'REC-01',
        recipeTitle: 'Ogórki kiszone tradycyjne',
        culture: 'Polska',
        method: 'lacto_fermentation',
        startedAt: 1776333600000,
        targetFermentationDays: 7,
        produceWeightGrams: 2000,
        waterWeightGrams: 1500,
        saltWeightGrams: 30,
        salinityPercent: 2.0,
        status: 'fermenting',
        qrCodeUri: 'sloik://batch/batch_test_01',
        createdAt: 1776333600000,
        notes: 'Dobre, jędrne ogórki gruntowe.',
      },
    ],
    pantryItems: [
      {
        id: 'pantry_test_01',
        batchId: 'batch_test_01',
        label: 'Ogórki kiszone tradycyjne',
        jarVolumeMl: 900,
        location: 'cellar',
        quantity: 3,
        sealedAt: 1776333600000,
        bestBefore: 1807869600000,
        isConsumed: false,
      },
    ],
    fermentationLogs: [],
    experimentSeries: [],
    customRecipes: [],
  };

  describe('Envelope creation and validation', () => {
    it('tworzy poprawną kopertę z formatem sloik-backup i wersją schematu', () => {
      const envelope = buildBackup(sampleState);

      expect(envelope.format).toBe('sloik-backup');
      expect(envelope.schemaVersion).toBe(1);
      expect(envelope.exportedAt).toBeDefined();
      expect(envelope.state.batches.length).toBe(1);
    });

    it('poprawnie parsuje i waliduje poprawny JSON kopii', () => {
      const envelope = buildBackup(sampleState);
      const jsonStr = JSON.stringify(envelope);

      const parsed = parseAndValidateBackup(jsonStr);
      expect(parsed.format).toBe('sloik-backup');
      expect(parsed.state.batches[0].recipeTitle).toBe('Ogórki kiszone tradycyjne');
    });

    it('odrzuca nieprawidłowy format lub uszkodzony JSON', () => {
      expect(() => parseAndValidateBackup('invalid json string')).toThrow('Nieprawidłowy format JSON');
      expect(() => parseAndValidateBackup(JSON.stringify({ format: 'other-app' }))).toThrow('Nieznany format');
      expect(() => parseAndValidateBackup(JSON.stringify({ format: 'sloik-backup', schemaVersion: 0 }))).toThrow('Nieprawidłowa wersja schematu');
    });
  });

  describe('CSV Exports', () => {
    it('eksportuje partie do formatu CSV z nagłówkami i ucieczką znaków', () => {
      const csv = exportBatchesToCsv(sampleState.batches);

      expect(csv).toContain('ID,Tytul,Kultura,Metoda');
      expect(csv).toContain('"batch_test_01"');
      expect(csv).toContain('"Ogórki kiszone tradycyjne"');
      expect(csv).toContain('2000');
    });

    it('eksportuje spiżarnię do formatu CSV', () => {
      const csv = exportPantryToCsv(sampleState.pantryItems);

      expect(csv).toContain('ID,Partia_ID,Etykieta,Pojemnosc_ml');
      expect(csv).toContain('"pantry_test_01"');
      expect(csv).toContain('"cellar"');
      expect(csv).toContain('900');
      expect(csv).toContain('"NIE"');
    });

    it('zabezpiecza komórki CSV przed Formula Injection (RD-ENG-10)', () => {
      const maliciousBatches = [
        {
          ...sampleState.batches[0],
          notes: '=cmd|/c calc.exe',
          recipeTitle: '+Podatny Tytuł',
        },
      ];
      const csv = exportBatchesToCsv(maliciousBatches);
      expect(csv).toContain('"\'=cmd|/c calc.exe"');
      expect(csv).toContain('"\'+Podatny Tytuł"');
    });
  });

  describe('AutoBackup & SafetyBackup', () => {
    it('wykonuje autoBackup i safetyBackup bez rzucania wyjątków i obsługuje kolizję -2', async () => {
      const autoPath1 = await autoBackup(sampleState);
      expect(typeof autoPath1).toBe('string');

      // Druga kopia w tym samym czasie dostaje przyrostek -2 (RD-ENG-12)
      const autoPath2 = await autoBackup(sampleState);
      expect(typeof autoPath2).toBe('string');
      expect(autoPath2).toContain('-2.json');

      const safetyPath = await safetyBackup('import', sampleState);
      expect(typeof safetyPath).toBe('string');
      expect(safetyPath).toContain('sloik-przed-importem-');
    });
  });
});
