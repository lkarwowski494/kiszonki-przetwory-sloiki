// ============================================================================
// Apps4Brew / Słoik — Domain Coverage 100/100/100/100 (BR-TEST-002..003)
// Systematyczne testy gałęzi i funkcji czystej logiki kuchennej
// ============================================================================

import { Alert } from 'react-native';
import { cancelButton, okButton, confirmAction } from '../src/core/confirm';
import { calculateRadarCoordinates, DEFAULT_FERMENT_SENSORY_PROFILE } from '../src/core/sensory-radar';
import {
  setUnitSystem,
  getUnitSystem,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
} from '../src/core/unit-converter';
import { calculateBrine } from '../src/core/brine/brine-calculator';
import {
  calculateBrineTopUp,
  getRecoveryProcedureById,
} from '../src/core/doctor/emergency-recovery';
import {
  calculateSensoryScore,
  createSplitBatchExperiment,
  rankVariants,
  promoteVariantToCustomRecipe,
} from '../src/core/experiments/experiment-engine';
import { calculateJarBatchCost } from '../src/core/pantry/cost-calculator';
import { calculateFermentationTimeline } from '../src/core/timeline/fermentation-timeline';
import {
  startTimerTimestamp,
  calculateRemainingTimerSec,
  pauseTimerTimestamp,
} from '../src/core/timer/background-timer';
import { wInKeep } from '../src/core/units/unit-keep';
import { dbStore } from '../src/data/db/database';
import { MasterRecipe } from '../src/core/types';

describe('Domain Coverage 100/100/100/100 (BR-TEST-002)', () => {
  beforeEach(() => {
    dbStore.clearAllForTesting();
    dbStore.init();
    jest.clearAllMocks();
  });

  // --------------------------------------------------------------------------
  // 1. Confirm & Dialogs
  // --------------------------------------------------------------------------
  describe('confirm.ts', () => {
    test('cancelButton z callbackiem i bez callbacka', () => {
      const cb = jest.fn();
      const btn1 = cancelButton(cb);
      expect(btn1.text).toBe('Anuluj');
      expect(btn1.style).toBe('cancel');
      btn1.onPress?.();
      expect(cb).toHaveBeenCalledTimes(1);

      const btn2 = cancelButton();
      expect(btn2.onPress).toBeUndefined();
    });

    test('okButton zwraca poprawny obiekt cancel style', () => {
      const btn = okButton();
      expect(btn.text).toBe('OK');
      expect(btn.style).toBe('cancel');
    });

    test('confirmAction wywołuje Alert.alert z destruktorem i bez', () => {
      const onConfirm = jest.fn();
      const onCancel = jest.fn();

      // destructive = true
      confirmAction({
        title: 'Usuń słoik',
        message: 'Czy na pewno?',
        actionText: 'Usuń',
        destructive: true,
        onConfirm,
        onCancel,
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Usuń słoik',
        'Czy na pewno?',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Anuluj' }),
          expect.objectContaining({ text: 'Usuń', style: 'destructive' }),
        ])
      );

      // destructive = false, brak message, brak onCancel
      confirmAction({
        title: 'Zapisz',
        actionText: 'Zapisz',
        onConfirm,
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Zapisz',
        undefined,
        expect.arrayContaining([
          expect.objectContaining({ text: 'Anuluj' }),
          expect.objectContaining({ text: 'Zapisz' }),
        ])
      );
    });
  });

  // --------------------------------------------------------------------------
  // 2. Sensory Radar
  // --------------------------------------------------------------------------
  describe('sensory-radar.ts', () => {
    test('calculateRadarCoordinates z domyślnym rozmiarem i skrajnymi wartościami', () => {
      // Domyślny rozmiar (220)
      const resDefault = calculateRadarCoordinates(DEFAULT_FERMENT_SENSORY_PROFILE);
      expect(resDefault.center).toBe(110);
      expect(resDefault.levels.length).toBe(5);
      expect(resDefault.dataPoints.length).toBe(5);

      // Wartości < 1 oraz > 5 (clamping) oraz częściowe dane
      const partialProfile: any = { acidity: -2, salinity: 10 };
      const resClamped = calculateRadarCoordinates(partialProfile, 300);
      expect(resClamped.center).toBe(150);
      const acidPoint = resClamped.dataPoints.find((p) => p.key === 'acidity');
      expect(acidPoint?.value).toBe(1);
      const salPoint = resClamped.dataPoints.find((p) => p.key === 'salinity');
      expect(salPoint?.value).toBe(5);
      const crispPoint = resClamped.dataPoints.find((p) => p.key === 'crispness');
      expect(crispPoint?.value).toBe(1); // fallback do 1
    });
  });

  // --------------------------------------------------------------------------
  // 3. Unit Converter
  // --------------------------------------------------------------------------
  describe('unit-converter.ts', () => {
    test('getUnitSystem i setUnitSystem z utrwalaniem i bez', () => {
      setUnitSystem('imperial', false);
      expect(getUnitSystem()).toBe('imperial');

      setUnitSystem('metric', true);
      expect(getUnitSystem()).toBe('metric');
      expect(dbStore.getSetting('app_unit_system')).toBe('metric');

      dbStore.setSetting('app_unit_system', 'imperial');
      expect(getUnitSystem()).toBe('imperial');

      dbStore.setSetting('app_unit_system', 'invalid_value');
      expect(getUnitSystem()).toBe('imperial'); // nie zmienia
    });

    test('przeliczanie temperatur Celsjusz <-> Fahrenheit', () => {
      expect(celsiusToFahrenheit(20)).toBe(68);
      expect(celsiusToFahrenheit(0)).toBe(32);
      expect(celsiusToFahrenheit(100)).toBe(212);

      expect(fahrenheitToCelsius(68)).toBe(20);
      expect(fahrenheitToCelsius(32)).toBe(0);
      expect(fahrenheitToCelsius(212)).toBe(100);
    });
  });

  // --------------------------------------------------------------------------
  // 4. Brine Calculator
  // --------------------------------------------------------------------------
  describe('brine-calculator.ts', () => {
    test('calculateBrine z total_mass przy produceWeightGrams = 0 i caCl2 = 0', () => {
      const res = calculateBrine({
        produceWeightGrams: 0,
        waterWeightGrams: 0,
        targetSalinityPercent: 2,
        method: 'total_mass',
      });
      expect(res.saltGrams).toBe(0);
      expect(res.calciumChlorideGrams).toBeUndefined();
      expect(res.recommendations.some((r) => r.includes('taniny'))).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // 5. Emergency Recovery Engine
  // --------------------------------------------------------------------------
  describe('emergency-recovery.ts', () => {
    test('calculateBrineTopUp z zerowymi danymi wejściowymi (domyślne wartości)', () => {
      const res = calculateBrineTopUp({ missingVolumeMl: 0, targetSalinityPercent: 0 });
      expect(res.waterMl).toBe(100); // 0 || 100 -> 100 ml
      expect(res.effectiveSalinityPercent).toBe(2.0); // 0 || 2.0 -> 2.0%
      expect(res.saltGrams).toBe(2.0);
    });

    test('getRecoveryProcedureById dla nieistniejącego id zwraca undefined', () => {
      expect(getRecoveryProcedureById('non_existent_proc')).toBeUndefined();
      expect(getRecoveryProcedureById('floating_produce')).toBeDefined();
    });
  });

  // --------------------------------------------------------------------------
  // 6. Experiment Engine
  // --------------------------------------------------------------------------
  describe('experiment-engine.ts', () => {
    test('calculateSensoryScore z domyślnym tastedAt i brakiem notatek', () => {
      const now = Date.now();
      const evalResult = calculateSensoryScore({
        textureCrispness: 30,
        flavorAcidBalance: 30,
        aroma: 15,
        appearance: 8,
      });
      expect(evalResult.tastedAt).toBeGreaterThanOrEqual(now - 100);
      expect(evalResult.tastingNotes).toBeUndefined();
      expect(evalResult.totalScore).toBe(83);
    });

    test('createSplitBatchExperiment z wartościami domyślnymi i brakiem deltas', () => {
      const exp = createSplitBatchExperiment({
        title: '',
        baseProduceName: '',
        totalProduceGrams: 0,
        jarCount: 0,
        hypothesis: '',
        axis: 'salinity',
      });
      expect(exp.title).toBe('Eksperyment: ');
      expect(exp.baseProduceName).toBe('Ogórki');
      expect(exp.totalProduceGrams).toBe(1000);
      expect(exp.jarCount).toBe(2);
      expect(exp.hypothesis).toBe('Weryfikacja optymalnych parametrów');
      expect(exp.variants[0].parameterDelta).toBe('Wariant kontrolny (baza)');
      expect(exp.variants[1].parameterDelta).toBe('Wariant testowy #2');
    });

    test('createSplitBatchExperiment z custom deltas i nazwami', () => {
      const exp = createSplitBatchExperiment({
        title: 'Test papryk',
        baseProduceName: 'Papryka',
        totalProduceGrams: 1200,
        jarCount: 2,
        hypothesis: 'Wpływ soli',
        axis: 'salinity',
        variantDeltas: [
          { name: 'Słoik Alfa', parameterDelta: 'Baza 2%', salinityPercent: 2.0 },
          { name: 'Słoik Beta', parameterDelta: 'Sól 3.5%', salinityPercent: 3.5, specialAdditions: ['Kminek'] },
        ],
      });
      expect(exp.variants[0].name).toBe('Słoik Alfa');
      expect(exp.variants[1].name).toBe('Słoik Beta');
      expect(exp.variants[1].specialAdditions).toEqual(['Kminek']);
    });

    test('rankVariants z remisami i brakami sensoryScore', () => {
      const exp = createSplitBatchExperiment({
        title: 'Ranking Test',
        baseProduceName: 'Kapusta',
        totalProduceGrams: 1000,
        jarCount: 3,
        hypothesis: 'H',
        axis: 'spices_herbs',
      });

      // Bez sensoryScore
      const rankedNoScore = rankVariants(exp.variants);
      expect(rankedNoScore.length).toBe(3);
      expect(rankedNoScore[0].isWinner).toBe(false);

      // Remis na 1 miejscu
      exp.variants[0].sensoryScore = {
        textureCrispness: 30,
        flavorAcidBalance: 30,
        aroma: 15,
        appearance: 10,
        totalScore: 85,
        tastedAt: 1,
      };
      exp.variants[1].sensoryScore = {
        textureCrispness: 30,
        flavorAcidBalance: 30,
        aroma: 15,
        appearance: 10,
        totalScore: 85,
        tastedAt: 1,
      };
      exp.variants[2].sensoryScore = {
        textureCrispness: 20,
        flavorAcidBalance: 20,
        aroma: 10,
        appearance: 5,
        totalScore: 55,
        tastedAt: 1,
      };

      const rankedTied = rankVariants(exp.variants);
      expect(rankedTied[0].rank).toBe(1);
      expect(rankedTied[1].rank).toBe(1);
      expect(rankedTied[2].rank).toBe(3);
      expect(rankedTied[0].isWinner).toBe(true);
      expect(rankedTied[1].isWinner).toBe(true);
      expect(rankedTied[2].isWinner).toBe(false);
    });

    test('promoteVariantToCustomRecipe z produceGrams = 0 i customTitle', () => {
      const exp = createSplitBatchExperiment({
        title: 'Dynia',
        baseProduceName: 'Dynia',
        totalProduceGrams: 1000,
        jarCount: 2,
        hypothesis: 'H',
        axis: 'spices_herbs',
      });
      const variant = { ...exp.variants[0], produceGrams: 0 };
      const recipe = promoteVariantToCustomRecipe(variant, 'Dynia w occie', 'Moja Dynia');
      expect(recipe.title).toBe('Moja Dynia');
      expect(recipe.ingredients[0].amount).toBe(1000);

      // Z notatką degustacyjną
      variant.sensoryScore = {
        textureCrispness: 30,
        flavorAcidBalance: 30,
        aroma: 15,
        appearance: 10,
        totalScore: 85,
        tastingNotes: 'Wybitna chrupkość',
        tastedAt: 1,
      };
      const recipeWithNotes = promoteVariantToCustomRecipe(variant, 'Dynia w occie');
      expect(recipeWithNotes.crispnessSecrets.some((s) => s.includes('Wybitna chrupkość'))).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // 7. Cost Calculator
  // --------------------------------------------------------------------------
  describe('cost-calculator.ts', () => {
    test('calculateJarBatchCost z różnymi metodami pasteryzacji i benchmark = 0', () => {
      // Pasteryzacja water_bath z custom czasem
      const resBath = calculateJarBatchCost({
        produceWeightGrams: 1000,
        waterWeightGrams: 800,
        saltWeightGrams: 40,
        jarsCount: 2,
        pasteurizationMethod: 'water_bath',
        cookingTimeHours: 1.0,
      });
      expect(resBath.energyKwh).toBeGreaterThan(0);

      // Pasteryzacja none i benchmark = 0
      const resNone = calculateJarBatchCost({
        produceWeightGrams: 1000,
        waterWeightGrams: 800,
        saltWeightGrams: 40,
        jarsCount: 2,
        pasteurizationMethod: 'none',
        storeRetailBenchmarkPerJar: 0,
      });
      expect(resNone.savingsPercent).toBe(0);
      expect(resNone.storeBenchmarkTotalCost).toBe(0);
    });
  });

  // --------------------------------------------------------------------------
  // 8. Fermentation Timeline
  // --------------------------------------------------------------------------
  describe('fermentation-timeline.ts', () => {
    test('calculateFermentationTimeline z domyślną temperaturą i wieloma punktami degustacji', () => {
      const sampleRecipe: MasterRecipe = {
        id: 'rec_timeline_test',
        title: 'Ogórek Test',
        subtitle: '',
        culture: 'Polska',
        category: 'poland_central_europe',
        method: 'lacto_fermentation',
        defaultProduceWeightGrams: 1000,
        defaultSalinityPercent: 2,
        fermentationDays: 5,
        shelfLifeMonths: 12,
        recommendedJarType: 'Słoik 1000 ml',
        ingredients: [],
        steps: [],
        crispnessSecrets: [],
        commonMistakes: [],
        sensoryMilestones: [
          { day: 2, title: 'Próbka 1', sensoryDescription: 'Gaz', isTastingCheckpoint: true },
          { day: 4, title: 'Próbka 2', sensoryDescription: 'Gaz', isTastingCheckpoint: true },
          { day: 5, title: 'Piwnica', sensoryDescription: 'Znieś', actionRequired: 'Znieś do chłodnej piwnicy' },
        ],
      };

      // Domyślna temperatura 20°C (brak 3. argumentu)
      const res = calculateFermentationTimeline(sampleRecipe, 1700000000000);
      expect(res.ambientTempCelsius).toBe(20);
      expect(res.tastingCheckpointTimestamp).toBeDefined();
      expect(res.coldStorageRecommendedTimestamp).toBeDefined();
    });
  });

  // --------------------------------------------------------------------------
  // 9. Background Timer
  // --------------------------------------------------------------------------
  describe('background-timer.ts', () => {
    test('funkcje timera z domyślnymi parametrami czasu (Date.now())', () => {
      const end = startTimerTimestamp(60);
      expect(end).toBeGreaterThan(Date.now() - 100);

      const remaining = calculateRemainingTimerSec(end);
      expect(remaining).toBeGreaterThanOrEqual(59);

      const zeroRemaining = calculateRemainingTimerSec(Date.now() - 1000);
      expect(zeroRemaining).toBe(0);

      const paused = pauseTimerTimestamp(end);
      expect(paused).toBeGreaterThanOrEqual(59);
    });
  });

  // --------------------------------------------------------------------------
  // 10. Unit Keep & Converter
  // --------------------------------------------------------------------------
  describe('unit-keep.ts & cost calculator full branch coverage', () => {
    test('wInKeep z niepoprawnym tekstem, zerowym prevBase i nieznaną jednostką', () => {
      expect(wInKeep('abc', 'kg')).toBe(0);
      expect(wInKeep('abc', 'kg', 5.5)).toBe(5.5);
      expect(wInKeep('10', 'unknown_unit', 0)).toBe(10);
      expect(wInKeep('10.0', 'kg', 10.0)).toBe(10.0);
      expect(wInKeep('15.5', 'oz', 439.42)).toBe(439.42);
    });

    test('formatValueForUnit z nieznaną jednostką', () => {
      const { formatValueForUnit } = require('../src/core/units/unit-keep');
      expect(formatValueForUnit(10, 'nieznana_jednostka')).toBe(10);
    });

    test('calculateJarBatchCost z wszystkimi parametrami nadpisanymi (brak fallbacków ?? )', () => {
      const allExplicit = calculateJarBatchCost({
        produceWeightGrams: 1000,
        waterWeightGrams: 800,
        saltWeightGrams: 40,
        jarsCount: 2,
        producePricePerKg: 10,
        waterPricePerM3: 15,
        saltPricePerKg: 4,
        herbsAndSpicesCost: 3,
        jarAndLidCostPerUnit: 2,
        stovePowerKw: 1.5,
        cookingTimeHours: 0.8,
        electricityPricePerKwh: 1.2,
        storeRetailBenchmarkPerJar: 20,
        pasteurizationMethod: 'oven',
      });
      expect(allExplicit.totalBatchCost).toBeGreaterThan(0);
      expect(allExplicit.totalSavings).toBeGreaterThan(0);
    });

    test('createSplitBatchExperiment z wariantem delta bez zadeklarowanego salinityPercent', () => {
      const exp = createSplitBatchExperiment({
        title: 'Czosnek',
        baseProduceName: 'Czosnek',
        totalProduceGrams: 500,
        jarCount: 2,
        hypothesis: 'H',
        axis: 'spices_herbs',
        variantDeltas: [
          { parameterDelta: 'Delta bez salinity' },
        ],
      });
      expect(exp.variants[0].salinityPercent).toBe(2.0); // fallback do baseSalinity
    });

    test('wInKeep gdy wartość nie pasuje do prevBase', () => {
      expect(wInKeep('25.0', 'kg', 10.0)).toBe(25.0);
    });

    test('calculateJarBatchCost z jarsCount = 0 i pasteurizationMethod water_bath z domyślnym czasem', () => {
      const res = calculateJarBatchCost({
        produceWeightGrams: 500,
        waterWeightGrams: 500,
        saltWeightGrams: 20,
        jarsCount: 0,
        pasteurizationMethod: 'water_bath',
      });
      expect(res.jarsCost).toBeGreaterThan(0);
      expect(res.energyKwh).toBeGreaterThan(0);
    });

    test('calculateSensoryScore z wartością NaN (Number.isFinite branch)', () => {
      const evalRes = calculateSensoryScore({
        textureCrispness: NaN,
        flavorAcidBalance: 20,
        aroma: 10,
        appearance: 5,
      });
      expect(evalRes.textureCrispness).toBe(0);
    });

    test('useUnitSystem w komponencie React z odmontowaniem i stanem imperial', () => {
      const React = require('react');
      const renderer = require('react-test-renderer');
      const { useUnitSystem } = require('../src/core/unit-converter');

      dbStore.setSetting('app_unit_system', 'imperial');
      function TestUnitComp() {
        const u = useUnitSystem();
        return React.createElement('Text', null, u);
      }

      let testRoot: any;
      renderer.act(() => {
        testRoot = renderer.create(React.createElement(TestUnitComp));
      });
      expect(testRoot.toJSON()?.children).toContain('imperial');

      renderer.act(() => {
        testRoot.unmount();
      });
    });
  });
});
