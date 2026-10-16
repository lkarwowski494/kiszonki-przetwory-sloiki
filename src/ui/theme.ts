// ============================================================================
// Słoik (Jarwise) — Theme & Design Tokens
// Rzemieślniczy, ciepły design kuchenny (Apps4Brew Studio)
// Zgodny z WCAG AAA, Dynamic Type i Apple Human Interface Guidelines
// ============================================================================

export const theme = {
  colors: {
    // Tła kuchenne (jasny pergamin / ciemna ceramika)
    bg: '#F7F5F0',
    bgCard: '#FFFFFF',
    bgCardElevated: '#FFFFFF',
    bgSecondary: '#EDE9DF',
    border: '#DDD7CB',
    borderFocus: '#4A853D',

    // Kolory natury przetwórczej
    pickleGreen: '#2D5A27',
    pickleGreenLight: '#4A853D',
    pickleGreenMuted: '#EBF5E9',

    amberBrine: '#D9822B',
    amberBrineLight: '#F7D19E',
    amberBrineMuted: '#FFF6EB',

    berryRed: '#B83A38',
    berryRedLight: '#E06D6B',
    berryRedMuted: '#FDEEEF',

    // Typografia i kontrasty (WCAG AAA)
    textPrimary: '#1C1A17',
    textSecondary: '#59544D',
    textMuted: '#8C8477',

    // Statusy partii i ostrzeżenia
    statusFermenting: '#D9822B',
    statusReady: '#2D5A27',
    statusConsumed: '#8C8477',
    danger: '#B83A38',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 14,
    lg: 20,
    full: 999,
  },
  touchTarget: {
    minHeight: 48, // Wymóg Apps4Brew dla rąk kuchennych
    minWidth: 48,
  },
  typography: {
    heroTitle: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: '#1C1A17',
    },
    screenTitle: {
      fontSize: 22,
      fontWeight: '700' as const,
      color: '#1C1A17',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: '#1C1A17',
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#1C1A17',
    },
    body: {
      fontSize: 15,
      fontWeight: '400' as const,
      color: '#1C1A17',
      lineHeight: 22,
    },
    caption: {
      fontSize: 13,
      fontWeight: '500' as const,
      color: '#59544D',
    },
    badge: {
      fontSize: 11,
      fontWeight: '700' as const,
      textTransform: 'uppercase' as const,
    },
  },
};
