import { calculateFermentationTimeline } from '../timeline/fermentation-timeline';
import { getRecipeById } from '../recipes/recipes-data';

describe('Żywy Kalendarz Fermentacji i Silnik Harmonogramu (Q10 Temperature Adaptation)', () => {
  const malosolne = getRecipeById('REC-01')!;

  it('oblicza standardową oś czasu w temperaturze pokojowej 20°C', () => {
    const startedAt = Date.now();
    const timeline = calculateFermentationTimeline(malosolne, startedAt, 20);

    expect(timeline.speedMultiplier).toBe(1.0);
    expect(timeline.burpingDays.length).toBeGreaterThanOrEqual(2);
    expect(timeline.tastingCheckpointTimestamp).toBeDefined();
    expect(timeline.milestones.length).toBe(malosolne.sensoryMilestones.length);
  });

  it('przyspiesza fermentację w gorącej kuchni (25°C - 30°C)', () => {
    const startedAt = Date.now();
    const standard = calculateFermentationTimeline(malosolne, startedAt, 20);
    const hotKitchen = calculateFermentationTimeline(malosolne, startedAt, 26);

    expect(hotKitchen.speedMultiplier).toBeGreaterThan(1.3);
    // W cieplejszej kuchni zakończenie następuje wcześniej
    expect(hotKitchen.estimatedCompletionTimestamp).toBeLessThan(standard.estimatedCompletionTimestamp);
  });

  it('wydłuża czas fermentacji w chłodnym pomieszczeniu (15°C)', () => {
    const startedAt = Date.now();
    const standard = calculateFermentationTimeline(malosolne, startedAt, 20);
    const coldCellar = calculateFermentationTimeline(malosolne, startedAt, 15);

    expect(coldCellar.speedMultiplier).toBeLessThan(1.0);
    expect(coldCellar.estimatedCompletionTimestamp).toBeGreaterThan(standard.estimatedCompletionTimestamp);
  });

  it('generuje punkty kontrolne degustacji i zalecenia schłodzenia do lodówki', () => {
    const startedAt = Date.now();
    const timeline = calculateFermentationTimeline(malosolne, startedAt, 21);

    const tastingMilestone = timeline.milestones.find((m) => m.isTastingCheckpoint);
    expect(tastingMilestone).toBeDefined();
    expect(tastingMilestone?.title).toContain('Małosolny');
    expect(tastingMilestone?.formattedDate).toBeTruthy();
  });
});
