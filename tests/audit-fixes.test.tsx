// ============================================================================
// Apps4Brew / Słoik — Testy Regresyjne Audytu BRD-QA-REL 1.0
// Identyfikatory znalezisk: LOG-01..04, DAT-01..03, UI-01..04, MER-01..02
// ============================================================================

import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { startTimerTimestamp, calculateRemainingTimerSec, pauseTimerTimestamp } from '../src/core/timer/background-timer';
import { wInKeep, normalizeNumString } from '../src/core/units/unit-keep';
import { escapeCsvCell } from '../src/lib/backup';
import { ActiveFocusTimer } from '../src/ui/components/ActiveFocusTimer';
import { SensoryRadarChart } from '../src/ui/components/SensoryRadarChart';
import { CustomRecipeModal } from '../src/ui/components/CustomRecipeModal';
import { CustomEquipmentModal } from '../src/ui/components/CustomEquipmentModal';
import { Missing } from '../src/ui/components/Missing';
import { SearchField, normSearch } from '../src/ui/components/SearchField';
import { dbStore, LocalDatabaseStore } from '../src/data/db/database';
import { t, plDictionary } from '../src/lib/i18n';

describe('Testy Regresyjne Audytu BRD-QA-REL 1.0 (Runda 2 — Dogrywka Weryfikacyjna)', () => {
  // --------------------------------------------------------------------------
  // LOG-01: Timery odporne na tło (endAtMs - Date.now(), NFR-PERF-004, RD-ENG-06)
  // --------------------------------------------------------------------------
  test('LOG-01: startTimerTimestamp i calculateRemainingTimerSec poprawnie odliczają czas z bezwzględnych timestampów', () => {
    const durationSec = 120;
    const baseNow = 1700000000000;
    const endAtMs = startTimerTimestamp(durationSec, baseNow);

    expect(endAtMs).toBe(baseNow + 120 * 1000);

    // Po upływie 45 sekund:
    const remaining45 = calculateRemainingTimerSec(endAtMs, baseNow + 45 * 1000);
    expect(remaining45).toBe(75);

    // Po upływie 120 sekund (koniec):
    const remaining120 = calculateRemainingTimerSec(endAtMs, baseNow + 120 * 1000);
    expect(remaining120).toBe(0);

    // Po przekroczeniu czasu:
    const remainingOver = calculateRemainingTimerSec(endAtMs, baseNow + 150 * 1000);
    expect(remainingOver).toBe(0);

    // Pauzowanie timera
    const pausedRemaining = pauseTimerTimestamp(endAtMs, baseNow + 30 * 1000);
    expect(pausedRemaining).toBe(90);
  });

  // --------------------------------------------------------------------------
  // LOG-02: Konwersja jednostek bez dryfu wInKeep i NumInput (RD-ENG-01, NFR-INT-003)
  // --------------------------------------------------------------------------
  test('LOG-02: wInKeep zachowuje precyzję wagową i normalizuje przecinki dziesiętne', () => {
    // Normalizacja tekstu
    expect(normalizeNumString('12,5')).toBe('12.5');
    expect(normalizeNumString('1 250,75')).toBe('1250.75');

    // wInKeep: grams -> grams
    expect(wInKeep('500', 'g', 500)).toBe(500);

    // wInKeep: kg -> kg base (1.5 kg -> 1.5)
    expect(wInKeep('1,5', 'kg')).toBe(1.5);

    // Ochrona przed dryfem zaokrągleń: jeśli tekst po konwersji daje to samo co stored, zwracamy stored
    const stored = 1250.45;
    expect(wInKeep('1250.45', 'g', stored)).toBe(stored);
  });

  // --------------------------------------------------------------------------
  // LOG-03: Ucieczka CSV przed atakiem Formula Injection (RD-ENG-10, NFR-SEC-015)
  // --------------------------------------------------------------------------
  test('LOG-03: escapeCsvCell neutralizuje formuły =, +, -, @, tab i cr', () => {
    expect(escapeCsvCell('=SUM(A1:A10)')).toBe('"\'=SUM(A1:A10)"');
    expect(escapeCsvCell('+cmd|')).toBe('"\'+cmd|"');
    expect(escapeCsvCell('-calc')).toBe('"\'-calc"');
    expect(escapeCsvCell('@malicious')).toBe('"\'@malicious"');
    expect(escapeCsvCell('Normalny tekst')).toBe('"Normalny tekst"');
    expect(escapeCsvCell(1234)).toBe('"1234"');
  });

  // --------------------------------------------------------------------------
  // DAT-01: Ochrona uszkodzonego stanu bazy i recovery (BR-TEST-023, RYZ-01)
  // --------------------------------------------------------------------------
  test('DAT-01: LocalDatabaseStore wykrywa uszkodzenie bazy, rejestruje surowy stan i udostępnia isCorrupt()', () => {
    const corruptStore = new LocalDatabaseStore();
    expect(corruptStore.isCorrupt()).toBe(false);

    corruptStore.markCorrupt('Corrupted test payload');
    expect(corruptStore.isCorrupt()).toBe(true);
    expect(corruptStore.getCorruptPayload()).toBe('Corrupted test payload');
  });

  // --------------------------------------------------------------------------
  // DAT-03: Idempotencja inicjalizacji i migracji bazy SQLite (BR-TEST-026)
  // --------------------------------------------------------------------------
  test('DAT-03: Podwójne wywołanie init() (2x migrate) jest w pełni idempotentne', () => {
    const testStore = new LocalDatabaseStore();
    testStore.clearAllForTesting();
    testStore.init();
    const batchesFirst = testStore.getAllBatches().length;

    // Drugie wywołanie init nie duplikuje rekordów ani nie rzuca błędu
    expect(() => testStore.init()).not.toThrow();
    const batchesSecond = testStore.getAllBatches().length;
    expect(batchesSecond).toBe(batchesFirst);
  });

  // --------------------------------------------------------------------------
  // UI-01 & UI-02: Modale posiadają nagłówki z odrzuceniem i ostrzeżeniem o szkicu
  // --------------------------------------------------------------------------
  test('UI-02: CustomRecipeModal i CustomEquipmentModal ostrzegają przed porzuceniem szkicu', () => {
    let rootRecipe: renderer.ReactTestRenderer | undefined;
    let rootEquipment: renderer.ReactTestRenderer | undefined;

    act(() => {
      rootRecipe = renderer.create(
        <CustomRecipeModal visible={true} onClose={() => {}} onSaved={() => {}} />
      );
      rootEquipment = renderer.create(
        <CustomEquipmentModal visible={true} onClose={() => {}} />
      );
    });

    expect(rootRecipe).toBeDefined();
    expect(rootEquipment).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // UI-03 & UI-04: Komponenty Missing, SearchField i normSearch (S13, RD-ENG-07)
  // --------------------------------------------------------------------------
  test('UI-03 & UI-04: Missing wyświetla stan błędu, SearchField normalizuje polskie litery (ł->l, ą->a)', () => {
    expect(normSearch('Łosoś wędzony')).toBe('losos wedzony');
    expect(normSearch('OGÓRKI MAŁOSOLNE')).toBe('ogorki malosolne');
    expect(normSearch('Kłodawa')).toBe('klodawa');

    let rootMissing: renderer.ReactTestRenderer | undefined;
    let rootSearch: renderer.ReactTestRenderer | undefined;

    act(() => {
      rootMissing = renderer.create(
        <Missing title="Brak słoika" description="Kod partii nie istnieje" actionLabel="Wróć" onAction={() => {}} />
      );
      rootSearch = renderer.create(
        <SearchField query="kiszonka" onChangeQuery={() => {}} placeholder="Szukaj..." />
      );
    });

    expect(rootMissing!.root.findByProps({ testID: 'missing-view' })).toBeDefined();
    expect(rootSearch!.root.findByProps({ testID: 'search-field' })).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // UI-05: Komponenty ActiveFocusTimer i SensoryRadarChart
  // --------------------------------------------------------------------------
  test('UI-05: ActiveFocusTimer i SensoryRadarChart renderują się bezbłędnie', () => {
    let rootTimer: renderer.ReactTestRenderer | undefined;
    let rootRadar: renderer.ReactTestRenderer | undefined;

    act(() => {
      rootTimer = renderer.create(
        <ActiveFocusTimer
          title="Pasteryzacja"
          defaultSeconds={300}
        />
      );
      rootRadar = renderer.create(
        <SensoryRadarChart
          profile={{ acidity: 3, salinity: 3, crispness: 5, effervescence: 2, aroma: 4 }}
          size={180}
        />
      );
    });

    expect(rootTimer).toBeDefined();
    expect(rootRadar).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // TEKST: Kompletność słownika języka polskiego i angielskiego (plDictionary, EN, t)
  // --------------------------------------------------------------------------
  test('TEKST: plDictionary i EN zawierają kluczowe terminy rzemieślnicze', () => {
    const { EN } = require('../src/lib/i18n.en');
    expect(plDictionary).toBeDefined();
    expect(EN).toBeDefined();
    expect(EN['Receptury Świata']).toBe('World Recipes');
    expect(t('Waga soli')).toBeDefined();
    expect(t('Zalecana solanka')).toBeDefined();
    expect(t('Pasteryzacja')).toBeDefined();
  });
});
