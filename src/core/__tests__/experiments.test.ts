import {
  calculateSensoryScore,
  createSplitBatchExperiment,
  rankVariants,
  promoteVariantToCustomRecipe,
} from '../experiments/experiment-engine';
import { dbStore } from '../../data/db/database';

describe('Laboratorium Eksperymentów & Panel Sensoryczny (Multi-Jar Split-Batch Lab)', () => {
  beforeEach(() => {
    dbStore.clearAllForTesting();
    dbStore.init();
  });

  describe('createSplitBatchExperiment (BR-EXP-001 & BR-EXP-002)', () => {
    it('tworzy split-batch na 4 słoiki z równomiernym podziałem wsadu warzywnego', () => {
      const exp = createSplitBatchExperiment({
        title: 'Wielki Test Chrupkości Ogórka',
        baseProduceName: 'Ogórki gruntowe',
        totalProduceGrams: 2000,
        jarCount: 4,
        hypothesis: 'Wpływ źródeł tanin na chrupkość',
        axis: 'tannins_crispness',
        baseSalinityPercent: 2.0,
      });

      expect(exp.id).toBeTruthy();
      expect(exp.jarCount).toBe(4);
      expect(exp.variants.length).toBe(4);
      expect(exp.variants[0].variantLetter).toBe('A');
      expect(exp.variants[1].variantLetter).toBe('B');
      expect(exp.variants[2].variantLetter).toBe('C');
      expect(exp.variants[3].variantLetter).toBe('D');

      for (const v of exp.variants) {
        expect(v.produceGrams).toBe(500); // 2000 / 4
        expect(v.waterGrams).toBe(400); // 80% z 500
        expect(v.salinityPercent).toBe(2.0);
        expect(v.saltGrams).toBe(18); // (500 + 400) * 0.02 = 18g
      }
    });

    it('wymusza zakres od 2 do 8 słoików', () => {
      const expMin = createSplitBatchExperiment({
        title: 'Test Min',
        baseProduceName: 'Kapusta',
        totalProduceGrams: 1000,
        jarCount: 1, // mniej niż 2
        hypothesis: 'Hipoteza',
        axis: 'salinity',
      });
      expect(expMin.jarCount).toBe(2);
      expect(expMin.variants.length).toBe(2);

      const expMax = createSplitBatchExperiment({
        title: 'Test Max',
        baseProduceName: 'Papryka',
        totalProduceGrams: 4000,
        jarCount: 12, // więcej niż 8
        hypothesis: 'Hipoteza',
        axis: 'spices_herbs',
      });
      expect(expMax.jarCount).toBe(8);
      expect(expMax.variants.length).toBe(8);
      expect(expMax.variants[7].variantLetter).toBe('H');
    });

    it('uwzględnia indywidualne warianty zmiennych (deltas) dla słoików', () => {
      const exp = createSplitBatchExperiment({
        title: 'Test Solanki',
        baseProduceName: 'Ogórki',
        totalProduceGrams: 1500,
        jarCount: 3,
        hypothesis: 'Które zasolenie jest optymalne?',
        axis: 'salinity',
        variantDeltas: [
          { parameterDelta: 'Solanka 1.8%', salinityPercent: 1.8 },
          { parameterDelta: 'Solanka 2.2%', salinityPercent: 2.2 },
          { parameterDelta: 'Solanka 2.8%', salinityPercent: 2.8 },
        ],
      });

      expect(exp.variants[0].salinityPercent).toBe(1.8);
      expect(exp.variants[1].salinityPercent).toBe(2.2);
      expect(exp.variants[2].salinityPercent).toBe(2.8);
    });
  });

  describe('calculateSensoryScore (BR-EXP-004)', () => {
    it('oblicza całkowitą ocenę 100-punktową z wagami składowych', () => {
      const score = calculateSensoryScore({
        textureCrispness: 32, // max 35
        flavorAcidBalance: 30, // max 35
        aroma: 18, // max 20
        appearance: 9, // max 10
        tastingNotes: 'Wybitna chrupkość i doskonały balans kwasowości.',
      });

      expect(score.totalScore).toBe(89);
      expect(score.textureCrispness).toBe(32);
      expect(score.flavorAcidBalance).toBe(30);
      expect(score.aroma).toBe(18);
      expect(score.appearance).toBe(9);
      expect(score.tastingNotes).toBe('Wybitna chrupkość i doskonały balans kwasowości.');
    });

    it('bezpiecznie obcina (clampuje) wartości przekraczające dozwolone maksima', () => {
      const score = calculateSensoryScore({
        textureCrispness: 45, // limit 35
        flavorAcidBalance: 40, // limit 35
        aroma: 25, // limit 20
        appearance: 15, // limit 10
      });

      expect(score.textureCrispness).toBe(35);
      expect(score.flavorAcidBalance).toBe(35);
      expect(score.aroma).toBe(20);
      expect(score.appearance).toBe(10);
      expect(score.totalScore).toBe(100);
    });
  });

  describe('rankVariants (BR-EXP-005)', () => {
    it('poprawnie szereguje słoiki od najwyższej do najniższej oceny sensorycznej', () => {
      const exp = createSplitBatchExperiment({
        title: 'Konkurs 3 słoików',
        baseProduceName: 'Cukinia',
        totalProduceGrams: 1500,
        jarCount: 3,
        hypothesis: 'Porównanie dodatków',
        axis: 'spices_herbs',
      });

      exp.variants[0].sensoryScore = calculateSensoryScore({
        textureCrispness: 25,
        flavorAcidBalance: 25,
        aroma: 15,
        appearance: 7,
      }); // 72 pkt

      exp.variants[1].sensoryScore = calculateSensoryScore({
        textureCrispness: 34,
        flavorAcidBalance: 33,
        aroma: 19,
        appearance: 9,
      }); // 95 pkt

      exp.variants[2].sensoryScore = calculateSensoryScore({
        textureCrispness: 28,
        flavorAcidBalance: 30,
        aroma: 16,
        appearance: 8,
      }); // 82 pkt

      const leaderboard = rankVariants(exp.variants);
      expect(leaderboard[0].variant.variantLetter).toBe('B');
      expect(leaderboard[0].totalScore).toBe(95);
      expect(leaderboard[0].rank).toBe(1);
      expect(leaderboard[0].isWinner).toBe(true);

      expect(leaderboard[1].variant.variantLetter).toBe('C');
      expect(leaderboard[1].totalScore).toBe(82);
      expect(leaderboard[1].rank).toBe(2);

      expect(leaderboard[2].variant.variantLetter).toBe('A');
      expect(leaderboard[2].totalScore).toBe(72);
      expect(leaderboard[2].rank).toBe(3);
    });

    it('obsługuje remisy bez przeskakiwania numeracji', () => {
      const exp = createSplitBatchExperiment({
        title: 'Remis',
        baseProduceName: 'Ogórki',
        totalProduceGrams: 1000,
        jarCount: 2,
        hypothesis: 'Remis',
        axis: 'tannins_crispness',
      });

      const tiedScore = calculateSensoryScore({
        textureCrispness: 30,
        flavorAcidBalance: 30,
        aroma: 15,
        appearance: 10,
      });

      exp.variants[0].sensoryScore = tiedScore;
      exp.variants[1].sensoryScore = tiedScore;

      const leaderboard = rankVariants(exp.variants);
      expect(leaderboard[0].rank).toBe(1);
      expect(leaderboard[1].rank).toBe(1);
      expect(leaderboard[0].totalScore).toBe(85);
      expect(leaderboard[1].totalScore).toBe(85);
    });
  });

  describe('promoteVariantToCustomRecipe (BR-EXP-006)', () => {
    it('skaluje zwycięski wariant słoika do uniwersalnego standardu 1000g wsadu', () => {
      const exp = createSplitBatchExperiment({
        title: 'Test Dębu',
        baseProduceName: 'Ogórki',
        totalProduceGrams: 2000,
        jarCount: 4,
        hypothesis: 'Taniny',
        axis: 'tannins_crispness',
      });

      const winnerVariant = exp.variants[1]; // 500g wsadu, 400g wody, 18g soli (2.0%)
      winnerVariant.specialAdditions = ['Liście dębu: 2 szt.', 'Czosnek: 2 ząbki'];
      winnerVariant.sensoryScore = calculateSensoryScore({
        textureCrispness: 35,
        flavorAcidBalance: 35,
        aroma: 20,
        appearance: 10,
        tastingNotes: 'Idealny słoik.',
      });

      const masterRecipe = promoteVariantToCustomRecipe(
        winnerVariant,
        exp.title,
        'Mistrzowskie Ogórki z Dębem 2026'
      );

      expect(masterRecipe.title).toBe('Mistrzowskie Ogórki z Dębem 2026');
      expect(masterRecipe.defaultProduceWeightGrams).toBe(1000);
      expect(masterRecipe.defaultSalinityPercent).toBe(2.0);

      // Skalowanie: 500g wsadu -> 1000g wsadu (mnożnik 2x)
      const waterIng = masterRecipe.ingredients.find((i) => i.name.includes('Woda'));
      expect(waterIng?.amount).toBe(800); // 400 * 2

      const saltIng = masterRecipe.ingredients.find((i) => i.name.includes('Sól'));
      expect(saltIng?.amount).toBe(36); // 18 * 2

      expect(masterRecipe.crispnessSecrets.length).toBeGreaterThan(0);
      expect(masterRecipe.crispnessSecrets[1]).toContain('Idealny słoik.');
    });
  });

  describe('Baza danych i trwałość lokalna (dbStore)', () => {
    it('poprawnie zapisuje serię eksperymentów i promuje zwycięzcę do bazy przepisów', () => {
      const initialSeries = dbStore.getAllExperimentSeries();
      expect(initialSeries.length).toBeGreaterThan(0);

      const exp = createSplitBatchExperiment({
        title: 'Nowy Test Kiszonej Kapusty',
        baseProduceName: 'Kapusta biała',
        totalProduceGrams: 3000,
        jarCount: 3,
        hypothesis: 'Wpływ dodatku kminku i jabłek',
        axis: 'spices_herbs',
      });

      dbStore.createExperimentSeries(exp);
      const found = dbStore.getExperimentSeriesById(exp.id);
      expect(found).toBeDefined();
      expect(found?.title).toBe('Nowy Test Kiszonej Kapusty');

      // Aktualizacja oceny sensorycznej
      const score = calculateSensoryScore({
        textureCrispness: 33,
        flavorAcidBalance: 34,
        aroma: 19,
        appearance: 9,
      });
      const updated = dbStore.updateVariantSensoryScore(exp.id, exp.variants[0].id, score);
      expect(updated).toBe(true);

      // Promocja do przepisu mistrzowskiego
      const master = dbStore.promoteVariantToMasterRecipe(
        exp.id,
        exp.variants[0].id,
        'Kapusta Zwycięska 2026'
      );
      expect(master).toBeDefined();
      expect(master?.title).toBe('Kapusta Zwycięska 2026');

      const customRecipes = dbStore.getCustomRecipes();
      expect(customRecipes.some((r) => r.id === master?.id)).toBe(true);

      // Test backupu JSON (Zero Data Loss)
      const backupJson = dbStore.exportBackupJson();
      expect(backupJson).toContain('Nowy Test Kiszonej Kapusty');
      expect(backupJson).toContain('Kapusta Zwycięska 2026');

      dbStore.clearAllForTesting();
      expect(dbStore.getAllExperimentSeries().length).toBe(0);

      const restored = dbStore.importBackupJson(backupJson);
      expect(restored).toBe(true);
      expect(dbStore.getAllExperimentSeries().length).toBe(initialSeries.length + 1);
    });
  });
});
