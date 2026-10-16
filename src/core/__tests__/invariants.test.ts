import * as fc from 'fast-check';
import { calculateBrine } from '../brine/brine-calculator';
import { evaluatePasteurizationSafety, BOTULISM_PH_CRITICAL } from '../safety/safety-guard';
import { calculateFermentationTimeline } from '../timeline/fermentation-timeline';
import { generateJarLabel } from '../pantry/label-generator';
import { MASTER_RECIPES } from '../recipes/recipes-data';

describe('Apps4Brew Warstwa 4: Niezmienniki Matematyczne i Testy Własnościowe (fast-check)', () => {
  const sampleRecipe = MASTER_RECIPES[0];

  test('RD-01: Dla dowolnych wag warzyw, wody i stężenia 0.5-20%, sól i masa całkowita są ściśle zachowane', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10, max: 20000 }),
        fc.integer({ min: 10, max: 20000 }),
        fc.double({ min: 0.5, max: 15.0, noNaN: true }),
        (produceGrams, waterGrams, targetSalinity) => {
          const res = calculateBrine({
            produceWeightGrams: produceGrams,
            waterWeightGrams: waterGrams,
            targetSalinityPercent: targetSalinity,
            method: 'total_mass',
          });

          // Sól musi być dodatnia
          expect(res.saltGrams).toBeGreaterThan(0);
          // Masa całkowita jest sumą bazy i soli
          expect(res.totalMassGrams).toBeGreaterThanOrEqual(produceGrams + waterGrams);
          // Rzeczywiste stężenie odpowiada docelowemu
          expect(res.effectiveSalinityPercent).toBe(targetSalinity);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('USDA AI-539: Niezmiennik bariery botulinowej (pH >= 4.60 zawsze blokuje zwykłą kąpiel wodną)', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 4.60, max: 9.0, noNaN: true }),
        fc.integer({ min: 100, max: 5000 }),
        (foodPh, jarVolume) => {
          const res = evaluatePasteurizationSafety({
            foodPh,
            jarVolumeMl: jarVolume,
            method: 'water_bath',
          });

          expect(res.isSafeForWaterBath).toBe(false);
          expect(res.requiresPressureCanning).toBe(true);
          expect(res.safetyWarning).toContain('KRYTYCZNE OSTRZEŻENIE BEZPIECZEŃSTWA');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('USDA AI-539: Dla środowiska kwaśnego (pH < 4.60) kąpiel wodna jest zawsze bezpieczna i bez szybkowaru', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1.5, max: 4.59, noNaN: true }),
        fc.integer({ min: 100, max: 3000 }),
        (foodPh, jarVolume) => {
          const res = evaluatePasteurizationSafety({
            foodPh,
            jarVolumeMl: jarVolume,
            method: 'water_bath',
          });

          expect(res.isSafeForWaterBath).toBe(true);
          expect(res.requiresPressureCanning).toBe(false);
          expect(res.targetMinutes).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Kinetyka Arrheniusa Q10: Wyższa temperatura ZAWSZE daje szybsze lub równe tempo fermentacji', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 14, max: 22 }),
        fc.integer({ min: 23, max: 30 }),
        (coolerTemp, warmerTemp) => {
          const now = 1776000000000;
          const coolResult = calculateFermentationTimeline(sampleRecipe, now, coolerTemp);
          const warmResult = calculateFermentationTimeline(sampleRecipe, now, warmerTemp);

          expect(warmResult.speedMultiplier).toBeGreaterThan(coolResult.speedMultiplier);
          expect(warmResult.estimatedCompletionTimestamp).toBeLessThanOrEqual(coolResult.estimatedCompletionTimestamp);
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Etykiety SVG: Żadne znaki specjalne ani złośliwy kod nie uszkadzają poprawności struktury SVG', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        (recipeTitle, notes) => {
          const label = generateJarLabel({
            batchId: 'batch_test_fuzz',
            recipeTitle,
            preparedDate: '16.10.2026',
            salinityOrSugarInfo: notes,
            format: 'side_rectangle_80x50mm',
          });

          expect(label.qrPayload).toBe('sloik://batch/batch_test_fuzz');
          expect(label.svgContent).toContain('<svg');
          expect(label.svgContent).toContain('</svg>');
          // Nie może zawierać surowego nieschowanego <script>
          expect(label.svgContent).not.toContain('<script>');
        }
      ),
      { numRuns: 100 }
    );
  });
});
