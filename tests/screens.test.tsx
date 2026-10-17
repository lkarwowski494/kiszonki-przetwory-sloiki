// ============================================================================
// Apps4Brew / Słoik — RNTL Screen Tests for all 7 routes (BR-TEST-016..020)
// 1. app/(tabs)/index.tsx (Rytuał)
// 2. app/(tabs)/dojrzewalnia.tsx (Dojrzewalnia & Spiżarnia)
// 3. app/(tabs)/wiedza.tsx (Wiedza: Receptury & Doktor)
// 4. app/experiments.tsx (Laboratorium Eksperymentów)
// 5. app/settings.tsx (Ustawienia & Kopia)
// 6. app/pasteurizer.tsx (Stoper Pasteryzacji)
// 7. app/batch/[id].tsx (Paszport Partii & Missing)
// ============================================================================

import React from 'react';
import { renderApp, createSampleBatch } from './helpers';
import { dbStore } from '../src/data/db/database';

describe('RNTL Screen Tests (7 Tras Aplikacji, BR-TEST-016..020)', () => {
  beforeEach(() => {
    dbStore.clearAllForTesting();
    dbStore.init();
  });

  // --------------------------------------------------------------------------
  // Trasa 1: app/(tabs)/index.tsx (Rytuał)
  // --------------------------------------------------------------------------
  test('Trasa 1: / (Rytuał) renderuje się poprawnie z paskiem świętych liczb i presetami', async () => {
    const { toJSON } = await renderApp({ route: '/(tabs)/index', lang: 'pl' });
    const jsonStr = JSON.stringify(toJSON());
    expect(jsonStr).toContain('Waga Surowca na Szalce');
    expect(jsonStr).toContain('SUROWIEC');
  });

  // --------------------------------------------------------------------------
  // Trasa 2: app/(tabs)/dojrzewalnia.tsx (Dojrzewalnia & Spiżarnia)
  // --------------------------------------------------------------------------
  test('Trasa 2: /(tabs)/dojrzewalnia renderuje listę partii i spiżarnię lub puste stany', async () => {
    const sampleBatch = createSampleBatch({ id: 'batch_dojrzewalnia_01', recipeTitle: 'Czosnek kiszony' });
    const { toJSON } = await renderApp({
      route: '/(tabs)/dojrzewalnia',
      saved: { batches: [sampleBatch] },
    });
    const jsonStr = JSON.stringify(toJSON());
    expect(jsonStr).toContain('Czosnek kiszony');
  });

  // --------------------------------------------------------------------------
  // Trasa 3: app/(tabs)/wiedza.tsx (Receptury & Doktor)
  // --------------------------------------------------------------------------
  test('Trasa 3: /(tabs)/wiedza renderuje 24 receptury świata i drzewo decyzyjne Doktora', async () => {
    const { toJSON } = await renderApp({ route: '/(tabs)/wiedza' });
    const jsonStr = JSON.stringify(toJSON());
    expect(jsonStr).toContain('Ogórki małosolne chrupiące');
    expect(jsonStr).toContain('Receptury Świata');
  });

  // --------------------------------------------------------------------------
  // Trasa 4: app/experiments.tsx (Laboratorium)
  // --------------------------------------------------------------------------
  test('Trasa 4: /experiments renderuje warsztat split-batch i porównanie słoików', async () => {
    const { toJSON } = await renderApp({ route: '/experiments' });
    const jsonStr = JSON.stringify(toJSON());
    expect(jsonStr).toContain('Laboratorium & Konkurs');
  });

  // --------------------------------------------------------------------------
  // Trasa 5: app/settings.tsx (Ustawienia & Kopia)
  // --------------------------------------------------------------------------
  test('Trasa 5: /settings renderuje przełącznik jednostek i zarządzanie kopiami', async () => {
    const { toJSON } = await renderApp({ route: '/settings' });
    const jsonStr = JSON.stringify(toJSON());
    expect(jsonStr).toContain('Język & Jednostki');
  });

  // --------------------------------------------------------------------------
  // Trasa 6: app/pasteurizer.tsx (Stoper Pasteryzacji)
  // --------------------------------------------------------------------------
  test('Trasa 6: /pasteurizer renderuje kalkulator czasu pasteryzacji i stoper', async () => {
    const { toJSON } = await renderApp({ route: '/pasteurizer' });
    const jsonStr = JSON.stringify(toJSON());
    expect(jsonStr).toContain('Stoper Pasteryzacji');
  });

  // --------------------------------------------------------------------------
  // Trasa 7: app/batch/[id].tsx (Paszport Partii & Missing)
  // --------------------------------------------------------------------------
  test('Trasa 7a: /batch/[id] renderuje komponent Missing gdy partia nie istnieje w bazie', async () => {
    const { toJSON } = await renderApp({
      route: '/batch/nieistniejacy_kod',
      params: { id: 'nieistniejacy_kod' },
    });
    const jsonStr = JSON.stringify(toJSON());
    expect(jsonStr).toContain('Nie znaleziono słoika');
    expect(jsonStr).toContain('Przejdź do spiżarni');
  });

  test('Trasa 7b: /batch/[id] renderuje paszport partii ze statusem i radarem sensorycznym', async () => {
    const batch = createSampleBatch({
      id: 'batch_sample_77',
      recipeTitle: 'Kimchi Rzemieślnicze',
    });

    const { toJSON } = await renderApp({
      route: '/batch/batch_sample_77',
      params: { id: 'batch_sample_77' },
      saved: { batches: [batch] },
    });
    const jsonStr = JSON.stringify(toJSON());
    expect(jsonStr).toContain('Kimchi Rzemieślnicze');
  });
});
