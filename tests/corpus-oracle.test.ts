import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { calculateBrine } from '../src/core/brine/brine-calculator';
import { evaluatePasteurizationSafety } from '../src/core/safety/safety-guard';

describe('Python Truth Oracle Corpus (BR-TEST-011..014)', () => {
  const fixturesDir = join(process.cwd(), 'tests', 'fixtures');

  test('brine and pasteurization calculations match Python oracle corpus (270 solanek + 140 pasteryzacji)', () => {
    const filePath = join(fixturesDir, 'brine-oracle-corpus.json');
    expect(existsSync(filePath)).toBe(true);

    const corpus = JSON.parse(readFileSync(filePath, 'utf8'));
    expect(corpus.brine_cases.length).toBeGreaterThanOrEqual(270);
    expect(corpus.pasteur_cases.length).toBeGreaterThanOrEqual(140);

    for (const c of corpus.brine_cases) {
      const res = calculateBrine({
        produceWeightGrams: c.produce_g,
        waterWeightGrams: c.water_g,
        targetSalinityPercent: c.target_pct,
        method: c.method,
      });

      expect(res.saltGrams).toBeCloseTo(c.salt_g, 1);
      expect(res.effectiveSalinityPercent).toBeCloseTo(c.effective_pct, 1);
    }

    for (const p of corpus.pasteur_cases) {
      const res = evaluatePasteurizationSafety({
        foodPh: p.food_ph,
        jarVolumeMl: p.jar_volume_ml,
        method: p.method,
      });

      expect(res.isSafeForWaterBath).toBe(p.is_safe_for_water_bath);
      expect(res.requiresPressureCanning).toBe(p.requires_pressure_canning);
      expect(res.targetMinutes).toBe(p.target_minutes);
    }
  });

  test('theme color tokens satisfy WCAG 2.1 AA/AAA contrast ratios according to Python oracle (BR-TEST-014, RD-ENG-02)', () => {
    const filePath = join(fixturesDir, 'theme-contrast-corpus.json');
    expect(existsSync(filePath)).toBe(true);

    const corpus = JSON.parse(readFileSync(filePath, 'utf8'));
    expect(corpus.results.length).toBeGreaterThanOrEqual(10);

    for (const item of corpus.results) {
      expect(item.passed).toBe(true);
      expect(item.ratio).toBeGreaterThanOrEqual(item.min_required);
    }
  });
});
