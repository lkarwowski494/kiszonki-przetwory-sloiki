import { MASTER_RECIPES } from '../recipes/recipes-data';
import { calculateFermentationTimeline } from '../timeline/fermentation-timeline';

describe('Fermentation Kinetics Q10 Corpus Suite (1,248 Testów Kinetyki Arrheniusa)', () => {
  const temperatures: number[] = [];
  for (let t = 10; t <= 35; t++) {
    temperatures.push(t); // 26 temperatur
  }

  const timestamps = [1776333600000, 1780000000000]; // 2 punkty w czasie

  const grid: Array<[string, number, number]> = [];
  for (const r of MASTER_RECIPES) {
    for (const t of temperatures) {
      for (const ts of timestamps) {
        grid.push([r.id, t, ts]);
      }
    }
  }

  test.each(grid)(
    'Kinetyka fermentacji receptury %s w temperaturze %i°C przy starcie %i',
    (recipeId, ambientTemp, startTs) => {
      const recipe = MASTER_RECIPES.find((r) => r.id === recipeId)!;
      expect(recipe).toBeDefined();

      const result = calculateFermentationTimeline(recipe, startTs, ambientTemp);

      expect(result.recipeId).toBe(recipe.id);
      expect(result.speedMultiplier).toBeGreaterThan(0);
      expect(result.estimatedCompletionTimestamp).toBeGreaterThan(startTs);
      expect(result.burpingDays.length).toBeGreaterThanOrEqual(1);

      if (ambientTemp >= 30) {
        // Przy wyższej temperaturze tempo fermentacji jest co najmniej 1.5x szybsze
        expect(result.speedMultiplier).toBeGreaterThanOrEqual(1.5);
      } else if (ambientTemp <= 15) {
        // W chłodzie tempo fermentacji jest spowolnione
        expect(result.speedMultiplier).toBeLessThanOrEqual(0.8);
      }
    }
  );
});
