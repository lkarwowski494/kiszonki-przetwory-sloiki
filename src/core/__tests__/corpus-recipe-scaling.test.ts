import { MASTER_RECIPES } from '../recipes/recipes-data';
import { calculateBrine } from '../brine/brine-calculator';

describe('Master Recipes Scaling Corpus Suite (1,200 Testów Skalowania)', () => {
  const weights: number[] = [];
  for (let w = 200; w <= 10000; w += 200) {
    weights.push(w); // 50 wag surowca
  }

  const recipeScalingGrid: Array<[string, number]> = [];
  for (const recipe of MASTER_RECIPES) {
    for (const w of weights) {
      recipeScalingGrid.push([recipe.id, w]);
    }
  }

  test.each(recipeScalingGrid)(
    'Skalowanie receptury %s dla wagi warzyw: %i g zachowuje niezmienniki rzemieślnicze',
    (recipeId, produceWeight) => {
      const recipe = MASTER_RECIPES.find((r) => r.id === recipeId)!;
      expect(recipe).toBeDefined();

      const salinity = recipe.defaultSalinityPercent > 0 ? recipe.defaultSalinityPercent : 2.0;
      const isDry =
        recipe.title.toLowerCase().includes('kapusta') ||
        recipe.title.toLowerCase().includes('kimchi');
      const waterWeight = isDry ? 0 : Math.round(produceWeight * 0.75);

      const brine = calculateBrine({
        produceWeightGrams: produceWeight,
        waterWeightGrams: waterWeight,
        targetSalinityPercent: salinity,
        method: isDry ? 'dry_salting' : 'total_mass',
      });

      expect(brine.saltGrams).toBeGreaterThan(0);
      expect(brine.totalMassGrams).toBeGreaterThanOrEqual(produceWeight);
      expect(brine.effectiveSalinityPercent).toBe(salinity);
      expect(brine.recommendations.length).toBeGreaterThan(0);
      expect(recipe.title.length).toBeGreaterThan(3);
    }
  );
});
