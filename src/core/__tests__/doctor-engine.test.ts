import {
  DOCTOR_DECISION_TREE,
  DIAGNOSES,
  getDiagnosis,
} from '../doctor/doctor-engine';

describe('Słoikowy Ratownik / Jar Doctor Decision Tree', () => {
  it('posiada zdefiniowany węzeł główny ROOT ze wszystkimi typowymi objawami', () => {
    const root = DOCTOR_DECISION_TREE['ROOT'];
    expect(root).toBeDefined();
    expect(root.options.length).toBeGreaterThanOrEqual(4);
  });

  it('jednoznacznie odróżnia bezpieczne drożdże kożuchujące (Kahm) od toksycznej pleśni', () => {
    const kahm = getDiagnosis('KAHM_YEAST');
    const mold = getDiagnosis('TOXIC_MOLD');

    expect(kahm).toBeDefined();
    expect(kahm?.isSafeToEat).toBe(true);
    expect(kahm?.severity).toBe('safe');

    expect(mold).toBeDefined();
    expect(mold?.isSafeToEat).toBe(false);
    expect(mold?.severity).toBe('danger_discard');
  });

  it('poprawnie diagnozuje niebieski czosnek jako bezpieczny', () => {
    const blueGarlic = getDiagnosis('BLUE_GARLIC');
    expect(blueGarlic).toBeDefined();
    expect(blueGarlic?.isSafeToEat).toBe(true);
    expect(blueGarlic?.actionSteps.length).toBeGreaterThan(0);
  });

  it('rozróżnia wybrzuszone wieczko podczas fermentacji od zepsucia w spiżarni', () => {
    const fermentLid = getDiagnosis('SWOLLEN_LID_FERMENT');
    const storageLid = getDiagnosis('SWOLLEN_LID_STORAGE');

    expect(fermentLid?.isSafeToEat).toBe(true); // Normalny CO2
    expect(storageLid?.isSafeToEat).toBe(false); // Zepsucie mikrobiologiczne
  });
});
