import { generateJarLabel } from '../pantry/label-generator';

describe('Generator Etykiet na Słoiki i Paszport Partii', () => {
  it('generuje poprawną okrągłą etykietę na wieczko (55 mm)', () => {
    const label = generateJarLabel({
      batchId: 'batch_ogorki_2026',
      recipeTitle: 'Ogórki małosolne chrupiące',
      preparedDate: '15.07.2026',
      salinityOrSugarInfo: 'Sól kamienna: 2.0%',
      format: 'round_lid_55mm',
    });

    expect(label.batchId).toBe('batch_ogorki_2026');
    expect(label.qrPayload).toBe('sloik://batch/batch_ogorki_2026');
    expect(label.svgContent).toContain('<circle');
    expect(label.svgContent).toContain('Ogórki małosolne chrupiące');
    expect(label.svgContent).toContain('55mm');
    expect(label.htmlPrintableContent).toContain('<!DOCTYPE html>');
  });

  it('generuje poprawną prostokątną etykietę boczną (80x50 mm)', () => {
    const label = generateJarLabel({
      batchId: 'batch_kimchi_01',
      recipeTitle: 'Baechu-kimchi',
      preparedDate: '20.10.2026',
      bestBeforeDate: '20.04.2027',
      salinityOrSugarInfo: 'Zasolenie: 2.5% + Gochugaru',
      format: 'side_rectangle_80x50mm',
    });

    expect(label.svgContent).toContain('<rect');
    expect(label.svgContent).toContain('Baechu-kimchi');
    expect(label.svgContent).toContain('80mm');
    expect(label.svgContent).toContain('Najlepiej spożyć przed: 20.04.2027');
  });

  it('bezpiecznie escapuje znaki XML/HTML w nazwach i parametrach', () => {
    const label = generateJarLabel({
      batchId: 'batch_unsafe',
      recipeTitle: 'Dżem <Truskawka & Malina>',
      preparedDate: '01.08.2026',
      salinityOrSugarInfo: 'Cukier "eko" 30%',
      format: 'round_lid_55mm',
    });

    expect(label.svgContent).toContain('&lt;Truskawka &amp; Malina&gt;');
    expect(label.svgContent).toContain('&quot;eko&quot;');
    expect(label.svgContent).not.toContain('<Truskawka');
  });
});
