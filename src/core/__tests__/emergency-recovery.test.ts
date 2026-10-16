import {
  calculateBrineTopUp,
  EMERGENCY_PROCEDURES,
  getRecoveryProcedureById,
} from '../doctor/emergency-recovery';

describe('Emergency Recovery Procedures Engine (Apps4Brew Parity S5)', () => {
  describe('calculateBrineTopUp', () => {
    it('oblicza precyzyjną wagę soli dla brakującej objętości solanki 250 ml i stężenia 2.5%', () => {
      const res = calculateBrineTopUp({
        missingVolumeMl: 250,
        targetSalinityPercent: 2.5,
      });

      expect(res.waterMl).toBe(250);
      expect(res.saltGrams).toBe(6.3); // 250 * 0.025 = 6.25 -> rounded to 6.3
      expect(res.effectiveSalinityPercent).toBe(2.5);
      expect(res.preparationSteps.length).toBeGreaterThanOrEqual(4);
      expect(res.safetyWarning).toContain('Nigdy nie dolewaj czystej wody');
    });

    it('zabezpiecza przed skrajnymi wartościami (clamping)', () => {
      const resLow = calculateBrineTopUp({
        missingVolumeMl: -50,
        targetSalinityPercent: 0.2,
      });

      expect(resLow.waterMl).toBe(10);
      expect(resLow.effectiveSalinityPercent).toBe(1.0);

      const resHigh = calculateBrineTopUp({
        missingVolumeMl: 5000,
        targetSalinityPercent: 25,
      });

      expect(resHigh.effectiveSalinityPercent).toBe(10.0);
    });

    it('generuje instrukcję ostudzenia solanki', () => {
      const res = calculateBrineTopUp({
        missingVolumeMl: 500,
        targetSalinityPercent: 2.0,
      });
      const step = res.preparationSteps.find((s) => s.includes('Ostudź'));
      expect(step).toBeDefined();
      expect(step).toContain('bakterii kwasu mlekowego');
    });
  });

  describe('EMERGENCY_PROCEDURES', () => {
    it('zawiera 3 fundamentalne procedury ratunkowe', () => {
      expect(EMERGENCY_PROCEDURES.length).toBe(3);
      const ids = EMERGENCY_PROCEDURES.map((p) => p.id);
      expect(ids).toContain('floating_produce');
      expect(ids).toContain('kahm_yeast_removal');
      expect(ids).toContain('soft_mushy_vegetables');
    });

    it('pobiera procedurę po ID', () => {
      const proc = getRecoveryProcedureById('kahm_yeast_removal');
      expect(proc).toBeDefined();
      expect(proc?.title).toContain('kożucha');
      expect(proc?.steps.length).toBeGreaterThan(0);
      expect(proc?.proTips.length).toBeGreaterThan(0);
      expect(proc?.mistakesToAvoid.length).toBeGreaterThan(0);
    });

    it('zwraca undefined dla nieistniejącej procedury', () => {
      expect(getRecoveryProcedureById('non_existent')).toBeUndefined();
    });
  });
});
