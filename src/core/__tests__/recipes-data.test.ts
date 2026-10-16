import {
  MASTER_RECIPES,
  getRecipeById,
  getRecipesByCategory,
} from '../recipes/recipes-data';

describe('Baza 24 Mistrzowskich Receptur Świata (Master Recipes)', () => {
  it('zawiera dokładnie 24 fabryczne receptury (REC-01 do REC-24)', () => {
    expect(MASTER_RECIPES.length).toBe(24);

    const ids = MASTER_RECIPES.map((r) => r.id);
    for (let i = 1; i <= 24; i++) {
      const expectedId = `REC-${i.toString().padStart(2, '0')}`;
      expect(ids).toContain(expectedId);
    }
  });

  it('każda receptura posiada kompletne i poprawne pola biznesowe', () => {
    for (const r of MASTER_RECIPES) {
      expect(r.title).toBeTruthy();
      expect(r.culture).toBeTruthy();
      expect(r.category).toBeTruthy();
      expect(r.method).toBeTruthy();
      expect(r.ingredients.length).toBeGreaterThan(0);
      expect(r.steps.length).toBeGreaterThan(0);
      expect(r.crispnessSecrets.length).toBeGreaterThan(0);
      expect(r.sensoryMilestones.length).toBeGreaterThan(0);
      expect(r.commonMistakes.length).toBeGreaterThan(0);
    }
  });

  it('poprawnie wyszukuje receptury po ID i kategorii', () => {
    const malosolne = getRecipeById('REC-01');
    expect(malosolne).toBeDefined();
    expect(malosolne?.title).toContain('Ogórki małosolne');

    const kimchi = getRecipeById('REC-07');
    expect(kimchi).toBeDefined();
    expect(kimchi?.title).toContain('Baechu-kimchi');

    const polishRecipes = getRecipesByCategory('poland_central_europe');
    expect(polishRecipes.length).toBe(5);

    const asianRecipes = getRecipesByCategory('east_asia');
    expect(asianRecipes.length).toBe(5);

    const sweetRecipes = getRecipesByCategory('sweet_preserves');
    expect(sweetRecipes.length).toBe(5);

    const drinksAndVinegars = getRecipesByCategory('drinks_vinegars');
    expect(drinksAndVinegars.length).toBe(2);
  });
});
