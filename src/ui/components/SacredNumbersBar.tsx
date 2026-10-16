// ============================================================================
// Słoik (Jarwise) — Sacred Numbers Bar (Ergonomia Blatu Kuchennego)
// Święte Liczby Fermentacji widoczne od razu z blatu kuchennego:
// 🥒 Waga Surowca · 💧 Woda · 🧂 Sól Kamienna · 🌊 Stężenie Solanki %
// Oparte na oficjalnym CraftStatDisplay z @apps4craft/ui
// ============================================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CraftStatDisplay, CraftCard } from '@apps4craft/ui';
import { theme } from '../theme';
import { t } from '../../lib/i18n';

interface SacredNumbersBarProps {
  produceWeightGrams: number;
  waterWeightGrams: number;
  saltWeightGrams: number;
  salinityPercent: number;
  isDrySalting?: boolean;
}

export const SacredNumbersBar: React.FC<SacredNumbersBarProps> = ({
  produceWeightGrams,
  waterWeightGrams,
  saltWeightGrams,
  salinityPercent,
  isDrySalting = false,
}) => {
  const produceVal =
    produceWeightGrams >= 1000
      ? `${(produceWeightGrams / 1000).toFixed(produceWeightGrams % 1000 === 0 ? 0 : 1)}`
      : `${Math.round(produceWeightGrams)}`;
  const produceUnit = produceWeightGrams >= 1000 ? 'kg' : 'g';

  const waterVal = isDrySalting
    ? t('SUCHA')
    : waterWeightGrams >= 1000
    ? `${(waterWeightGrams / 1000).toFixed(waterWeightGrams % 1000 === 0 ? 0 : 1)}`
    : `${Math.round(waterWeightGrams)}`;
  const waterUnit = isDrySalting ? '' : waterWeightGrams >= 1000 ? 'L' : 'ml';

  return (
    <CraftCard style={styles.cardContainer}>
      <View
        style={styles.container}
        accessibilityRole="summary"
        accessibilityLabel={t('Święte Liczby Fermentacji')}
      >
        <CraftStatDisplay
          label={t('SUROWIEC')}
          value={produceVal}
          unit={produceUnit}
          subtext={t('warzywa / owoce')}
          size="md"
          style={styles.statItem}
        />

        <View style={styles.separator} />

        <CraftStatDisplay
          label={isDrySalting ? t('METODA') : t('WODA')}
          value={waterVal}
          unit={waterUnit}
          subtext={isDrySalting ? t('sok własny') : t('przegotowana')}
          size="md"
          style={styles.statItem}
        />

        <View style={styles.separator} />

        <CraftStatDisplay
          label={t('SÓL')}
          value={saltWeightGrams.toFixed(1)}
          unit="g"
          accentColor={theme.colors.pickleGreen}
          subtext={`${salinityPercent.toFixed(1)}% ${t('solanki')}`}
          size="md"
          style={StyleSheet.flatten([styles.statItem, styles.highlightStat])}
        />
      </View>
    </CraftCard>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: theme.spacing.sm,
    padding: 6,
    backgroundColor: theme.colors.bgCardElevated,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  highlightStat: {
    backgroundColor: theme.colors.pickleGreenMuted,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 4,
  },
  separator: {
    width: 1,
    height: 44,
    backgroundColor: theme.colors.border,
  },
});
