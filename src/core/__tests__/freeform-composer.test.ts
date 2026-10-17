import {
  FREEFORM_PRODUCE,
  composeFreeformRecipe,
} from '../recipes/freeform-composer';

describe('Freeform Composer (Styl Dowolny)', () => {
  test('posiada 20 predefiniowanych warzyw i owoców rzemieślniczych', () => {
    expect(FREEFORM_PRODUCE.length).toBe(20);
    const ids = FREEFORM_PRODUCE.map((p) => p.id);
    expect(ids).toContain('cucumber');
    expect(ids).toContain('cabbage_white');
    expect(ids).toContain('garlic');
    expect(ids).toContain('hot_pepper');
    expect(ids).toContain('lemon');
  });

  test('zwraca bezpieczną zachętę i domyślne parametry dla pustej selekcji', () => {
    const res = composeFreeformRecipe([]);
    expect(res.title).toContain('Styl Dowolny');
    expect(res.isDrySalting).toBe(false);
    expect(res.recommendedSalinityPercent).toBe(2.5);
    expect(res.calculatedWaterMl).toBe(800);
    expect(res.calculatedSaltGrams).toBe(20);
    expect(res.selectedItems).toHaveLength(0);
    expect(res.steps).toHaveLength(2);
  });

  test('pojedynczy składnik kapustny -> metoda na sucho 2.0%', () => {
    const res = composeFreeformRecipe(['cabbage_white'], 1500);
    expect(res.title).toBe('Autorski nastaw: Kapusta biała / włoska');
    expect(res.isDrySalting).toBe(true);
    expect(res.recommendedSalinityPercent).toBe(2.0);
    expect(res.calculatedWaterMl).toBe(0);
    expect(res.calculatedSaltGrams).toBe(30); // 1500 * 0.02
    expect(res.produceWeightGrams).toBe(1500);
    expect(res.steps[1]).toContain('Poszatkuj warzywa');
  });

  test('pojedynczy składnik ogórek -> solanka wodna 2.5% i szybka fermentacja', () => {
    const res = composeFreeformRecipe(['cucumber'], 1000);
    expect(res.title).toBe('Autorski nastaw: Ogórki gruntowe');
    expect(res.isDrySalting).toBe(false);
    expect(res.recommendedSalinityPercent).toBe(2.5);
    expect(res.calculatedWaterMl).toBe(800); // 1000 * 0.8
    expect(res.calculatedSaltGrams).toBe(20); // 800 * 0.025
    expect(res.fermentationDays).toBe(4);
    expect(res.suggestedHerbs).toContain('Czosnek (3 ząbki)');
  });

  test('duet warzyw generuje poprawny tytuł', () => {
    const res = composeFreeformRecipe(['cucumber', 'carrot'], 1200);
    expect(res.title).toBe('Autorski duet: Ogórki gruntowe & Marchew');
    expect(res.isDrySalting).toBe(false);
    expect(res.recommendedSalinityPercent).toBe(2.5);
    expect(res.calculatedWaterMl).toBe(960);
  });

  test('miks 3 lub więcej warzyw generuje kompozycję spiżarni', () => {
    const res = composeFreeformRecipe(['cauliflower', 'carrot', 'bell_pepper', 'garlic'], 1000);
    expect(res.title).toBe('Miks spiżarni: Kalafior, Marchew i 2 inne');
    expect(res.isDrySalting).toBe(false);
    expect(res.suggestedHerbs.length).toBeGreaterThan(0);
    expect(res.craftTips.length).toBeGreaterThan(0);
  });

  test('ostre papryczki podnoszą stężenie soli do 3.5%', () => {
    const res = composeFreeformRecipe(['hot_pepper', 'garlic'], 800);
    expect(res.recommendedSalinityPercent).toBe(3.5);
  });

  test('cytryny wymuszają sól 5.0% i długi czas fermentacji', () => {
    const res = composeFreeformRecipe(['lemon'], 1000);
    expect(res.recommendedSalinityPercent).toBe(5.0);
    expect(res.isDrySalting).toBe(true);
    expect(res.fermentationDays).toBe(14);
  });

  test('buraki dają długi czas fermentacji 14 dni', () => {
    const res = composeFreeformRecipe(['beet'], 1000);
    expect(res.fermentationDays).toBe(14);
  });

  test('kapusta z marchwią we własnym soku (sucha fermentacja)', () => {
    const res = composeFreeformRecipe(['cabbage_red', 'cabbage_white'], 2000);
    expect(res.isDrySalting).toBe(true);
    expect(res.fermentationDays).toBe(10);
    expect(res.calculatedWaterMl).toBe(0);
    expect(res.calculatedSaltGrams).toBe(40);
  });

  test('kapusta z wieloma warzywami mokrymi przechodzi na solankę wodną', () => {
    const res = composeFreeformRecipe(['cabbage_white', 'cucumber', 'carrot', 'radish'], 1000);
    expect(res.isDrySalting).toBe(false);
  });

  test('kapusta w proporcji 1 do 1 z marchwią zachowuje fermentację na sucho', () => {
    const res = composeFreeformRecipe(['cabbage_white', 'carrot'], 1000);
    expect(res.isDrySalting).toBe(true);
  });

  test('ignoruje nieistniejące identyfikatory warzyw', () => {
    const res = composeFreeformRecipe(['nieistniejacy_skladnik']);
    expect(res.title).toContain('Styl Dowolny');
    expect(res.selectedItems).toHaveLength(0);
  });

  test('obsługuje brak wagi surowca i wartości minimalne', () => {
    const res = composeFreeformRecipe(['radish'], 50);
    expect(res.produceWeightGrams).toBe(100);
  });

  test('domyślna waga to 1000g gdy nie podano', () => {
    const res = composeFreeformRecipe(['radish']);
    expect(res.produceWeightGrams).toBe(1000);
  });
});
