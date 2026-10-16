// ============================================================================
// Słoik (Jarwise) — Theme & Design Tokens
// Apps4Craft Studio — Ciemna estetyka ceramiczna (Basalt Ceramic Dark)
// Zgodny z WCAG AAA, Dynamic Type i Apple Human Interface Guidelines
// ============================================================================

import { sharedCraftTokens, getCraftTheme } from '@apps4craft/ui';

const sloikTheme = getCraftTheme('sloik');

export const theme = {
  colors: {
    // Tła kuchenne bazaltowe i ceramika
    bg: sharedCraftTokens.colors.bgBasalt, // #121214
    bgCard: sharedCraftTokens.colors.bgCard, // #1C1C1F
    bgCardElevated: sharedCraftTokens.colors.bgCardSecondary, // #242428
    bgSecondary: '#18181A',
    border: sharedCraftTokens.colors.border, // #2E2E34
    borderLight: sharedCraftTokens.colors.borderLight, // #3E3E46
    borderFocus: sloikTheme.accent, // #5B8A61

    // Unikalne akcenty Słoika (Apps4Craft Dill Herb Green & Brine)
    pickleGreen: sloikTheme.accent, // #5B8A61
    pickleGreenLight: sloikTheme.accentLight, // #D9E8D2
    pickleGreenMuted: sloikTheme.accentMuted, // rgba(91, 138, 97, 0.15)

    amberBrine: sloikTheme.secondaryAccent, // #9E8747 Mustard Seed
    amberBrineLight: '#E5C678',
    amberBrineMuted: 'rgba(158, 135, 71, 0.15)',

    berryRed: sharedCraftTokens.colors.danger, // #D9534F
    berryRedLight: '#FF7875',
    berryRedMuted: sharedCraftTokens.colors.dangerMuted,

    // Typografia szwajcarska i wysoki kontrast (WCAG AAA)
    textPrimary: sharedCraftTokens.colors.textPrimary, // #F4EFEA
    textSecondary: sharedCraftTokens.colors.textSecondary, // #A09C96
    textMuted: sharedCraftTokens.colors.textMuted, // #686561

    // Statusy partii i oznaczenia
    statusFermenting: sloikTheme.secondaryAccent, // #9E8747
    statusReady: sloikTheme.accent, // #5B8A61
    statusConsumed: sharedCraftTokens.colors.textMuted,
    danger: sharedCraftTokens.colors.danger,
  },
  spacing: sharedCraftTokens.spacing,
  borderRadius: sharedCraftTokens.borderRadius,
  touchTarget: {
    minHeight: sharedCraftTokens.touchTargetMin, // 48 pt
    minWidth: sharedCraftTokens.touchTargetMin,
  },
  hitSlop: sharedCraftTokens.hitSlopStandard,
  typography: {
    heroTitle: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: sharedCraftTokens.colors.textPrimary,
    },
    screenTitle: {
      fontSize: 22,
      fontWeight: '700' as const,
      color: sharedCraftTokens.colors.textPrimary,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: sharedCraftTokens.colors.textPrimary,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: sharedCraftTokens.colors.textPrimary,
    },
    body: {
      fontSize: 15,
      fontWeight: '400' as const,
      color: sharedCraftTokens.colors.textPrimary,
      lineHeight: 22,
    },
    caption: {
      fontSize: 13,
      fontWeight: '500' as const,
      color: sharedCraftTokens.colors.textSecondary,
    },
    badge: {
      fontSize: 11,
      fontWeight: '700' as const,
      textTransform: 'uppercase' as const,
    },
    displayHero: sharedCraftTokens.typography.displayHero,
    displayLarge: sharedCraftTokens.typography.displayLarge,
    monoNumber: sharedCraftTokens.typography.monoNumber,
  },
};
