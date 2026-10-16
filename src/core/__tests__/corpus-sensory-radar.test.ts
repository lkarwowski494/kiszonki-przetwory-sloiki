import { calculateRadarCoordinates } from '../sensory-radar';

describe('Sensory Radar Corpus Suite (3,125 Permutacji 5 Osi Kiszonki)', () => {
  const values = [1, 2, 3, 4, 5];
  const permutations: Array<[number, number, number, number, number]> = [];

  for (const a of values) {
    for (const s of values) {
      for (const c of values) {
        for (const e of values) {
          for (const ar of values) {
            permutations.push([a, s, c, e, ar]);
          }
        }
      }
    }
  }

  test.each(permutations)(
    'Profil [Kwas:%i, Słon:%i, Chrup:%i, Mus:%i, Arom:%i] generuje poprawny wielokąt SVG wewnątrz promienia',
    (acidity, salinity, crispness, effervescence, aroma) => {
      const coords = calculateRadarCoordinates(
        { acidity, salinity, crispness, effervescence, aroma },
        200
      );

      expect(coords.center).toBe(100);
      expect(coords.maxRadius).toBe(70);
      expect(coords.dataPoints).toHaveLength(5);

      for (const pt of coords.dataPoints) {
        expect(Number.isFinite(pt.x)).toBe(true);
        expect(Number.isFinite(pt.y)).toBe(true);
        const dist = Math.hypot(pt.x - 100, pt.y - 100);
        expect(dist).toBeLessThanOrEqual(70.1);
        expect(dist).toBeGreaterThanOrEqual(13.9);
      }
    }
  );
});
