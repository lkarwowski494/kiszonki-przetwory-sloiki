// ============================================================================
// Apps4Brew / Słoik — Missing Resource State Component (Missing)
// (S13, NFR-INT-013)
// Renderowany w przypadku odwołania do nieistniejącego rekordu / partii / receptury.
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { CraftButton } from '@apps4craft/ui';

export interface MissingProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
  testID?: string;
}

export const Missing: React.FC<MissingProps> = ({
  title = 'Nie znaleziono elementu',
  description = 'Szukany rekord nie istnieje lub został usunięty z lokalnej bazy.',
  actionLabel = 'Wróć',
  onAction,
  icon = '🔍',
  testID = 'missing-view',
}) => {
  return (
    <View
      testID={testID}
      style={styles.container}
      accessibilityRole="alert"
      accessibilityLabel={`${title}. ${description}`}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onAction && (
        <View style={styles.buttonContainer}>
          <CraftButton
            label={actionLabel}
            variant="primary"
            onPress={onAction}
            accentColor={theme.colors.pickleGreen}
            testID="missing-action-btn"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.bg,
  },
  icon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 260,
  },
});
