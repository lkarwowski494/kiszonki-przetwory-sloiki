import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface KitchenCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'highlight';
}

export const KitchenCard: React.FC<KitchenCardProps> = ({ children, style, variant = 'default' }) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'highlight':
        return styles.highlight;
      case 'elevated':
        return styles.elevated;
      default:
        return styles.default;
    }
  };

  return <View style={[styles.base, getVariantStyle(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.xs,
  },
  default: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  elevated: {
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  highlight: {
    backgroundColor: theme.colors.pickleGreenMuted,
    borderWidth: 1,
    borderColor: theme.colors.pickleGreenLight,
  },
});
