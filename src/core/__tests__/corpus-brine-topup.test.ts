import { calculateBrineTopUp } from '../doctor/emergency-recovery';

describe('Emergency Brine Top-Up Corpus Suite (600 Testów Receptur Ratunkowych)', () => {
  const volumes: number[] = [];
  for (let v = 50; v <= 2000; v += 50) {
    volumes.push(v); // 40 objętości
  }

  const salinities: number[] = [];
  for (let s = 1.5; s <= 5.01; s += 0.25) {
    salinities.push(Math.round(s * 100) / 100); // 15 stężeń soli
  }

  const grid: Array<[number, number]> = [];
  for (const v of volumes) {
    for (const s of salinities) {
      grid.push([v, s]);
    }
  }

  test.each(grid)(
    'Dolewka solanki ratunkowej: %i ml przy stężeniu %s%% zachowuje precyzyjną wagę soli',
    (vol, salinity) => {
      const res = calculateBrineTopUp({
        missingVolumeMl: vol,
        targetSalinityPercent: salinity,
      });

      expect(res.waterMl).toBe(vol);
      expect(res.effectiveSalinityPercent).toBe(salinity);

      const expectedSalt = Math.round(vol * (salinity / 100) * 10) / 10;
      expect(res.saltGrams).toBe(expectedSalt);
      expect(res.preparationSteps.length).toBeGreaterThanOrEqual(4);
      expect(res.safetyWarning.length).toBeGreaterThan(10);
    }
  );
});
