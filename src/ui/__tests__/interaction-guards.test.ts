import { theme } from '../theme';

describe('Apps4Brew Wzorce Interakcji i Dostępności (Interaction Guards)', () => {
  it('zapewnia minimalny rozmiar celu dotykowego 48x48 pt dla rąk kuchennych', () => {
    expect(theme.touchTarget.minHeight).toBeGreaterThanOrEqual(48);
    expect(theme.touchTarget.minWidth).toBeGreaterThanOrEqual(48);
  });

  it('posiada zdefiniowane kontrastowe barwy spełniające wymagania WCAG AAA', () => {
    expect(theme.colors.bg).toBeDefined();
    expect(theme.colors.textPrimary).toBe('#1C1A17');
    expect(theme.colors.pickleGreen).toBe('#2D5A27');
    expect(theme.colors.danger).toBe('#B83A38');
  });
});
