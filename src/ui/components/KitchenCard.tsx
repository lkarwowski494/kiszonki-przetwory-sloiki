// ============================================================================
// Słoik (Jarwise) — KitchenCard (Powered by @apps4craft/ui CraftCard)
// Dark ceramic card container with tactile depth and artisanal borders.
// ============================================================================

import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { CraftCard } from '@apps4craft/ui';
import { theme } from '../theme';

interface KitchenCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'highlight';
  headerTitle?: string;
  onPress?: () => void;
}

export const KitchenCard: React.FC<KitchenCardProps> = ({
  children,
  style,
  variant = 'default',
  headerTitle,
  onPress,
}) => {
  const accentBorder = variant === 'highlight' ? theme.colors.pickleGreen : undefined;
  const elevatedStyle: ViewStyle =
    variant === 'elevated' ? { backgroundColor: theme.colors.bgCardElevated } : {};

  return (
    <CraftCard
      headerTitle={headerTitle}
      accentBorder={accentBorder}
      onPress={onPress}
      style={StyleSheet.flatten([elevatedStyle, style])}
    >
      {children}
    </CraftCard>
  );
};
