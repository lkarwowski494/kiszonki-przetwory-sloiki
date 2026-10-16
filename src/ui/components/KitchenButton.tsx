// ============================================================================
// Słoik (Jarwise) — KitchenButton (Powered by @apps4craft/ui CraftButton)
// Tactile, ergonomic button designed for kitchen workflow (min 52pt targets).
// ============================================================================

import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { CraftButton, CraftButtonVariant } from '@apps4craft/ui';
import { theme } from '../theme';

interface KitchenButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const KitchenButton: React.FC<KitchenButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  return (
    <CraftButton
      label={title}
      onPress={onPress}
      variant={variant as CraftButtonVariant}
      accentColor={theme.colors.pickleGreen}
      disabled={disabled}
      loading={loading}
      style={style}
      labelStyle={textStyle}
      icon={icon}
    />
  );
};
