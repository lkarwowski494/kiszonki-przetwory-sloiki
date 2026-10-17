import {
  MASTER_RECIPES,
  getRecipeById,
  getRecipesByCategory,
} from '../recipes/recipes-data';

describe('Baza 155 Mistrzowskich Receptur Świata (Master Recipes)', () => {
  it('zawiera dokładnie 155 fabrycznych receptur (REC-01 do REC-155)', () => {
    expect(MASTER_RECIPES.length).toBe(155);

    const ids = MASTER_RECIPES.map((r) => r.id);
    for (let i = 1; i <= 155; i++) {
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

    const tepache = getRecipeById('REC-45');
    expect(tepache).toBeDefined();
    expect(tepache?.title).toContain('Tepache');

    const umeboshi = getRecipeById('REC-78');
    expect(umeboshi).toBeDefined();
    expect(umeboshi?.title).toContain('Umeboshi');

    const spruceBeer = getRecipeById('REC-155');
    expect(spruceBeer).toBeDefined();
    expect(spruceBeer?.title).toContain('Piwo świerkowe');

    const polishRecipes = getRecipesByCategory('poland_central_europe');
    expect(polishRecipes.length).toBe(30);

    const asianRecipes = getRecipesByCategory('east_asia');
    expect(asianRecipes.length).toBe(28);

    const mideastRecipes = getRecipesByCategory('mideast_maghreb_india');
    expect(mideastRecipes.length).toBe(26);

    const americasRecipes = getRecipesByCategory('americas_mediterranean');
    expect(americasRecipes.length).toBe(28);

    const sweetRecipes = getRecipesByCategory('sweet_preserves');
    expect(sweetRecipes.length).toBe(23);

    const drinksAndVinegars = getRecipesByCategory('drinks_vinegars');
    expect(drinksAndVinegars.length).toBe(20);
  });
});
