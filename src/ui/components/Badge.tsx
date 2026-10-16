import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface BadgeProps {
  label: string;
  variant?: 'green' | 'amber' | 'red' | 'gray';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'green' }) => {
  const getColors = () => {
    switch (variant) {
      case 'amber':
        return { bg: theme.colors.amberBrineMuted, text: theme.colors.amberBrine };
      case 'red':
        return { bg: theme.colors.berryRedMuted, text: theme.colors.berryRed };
      case 'gray':
        return { bg: theme.colors.bgSecondary, text: theme.colors.textMuted };
      default:
        return { bg: theme.colors.pickleGreenMuted, text: theme.colors.pickleGreen };
    }
  };

  const { bg, text } = getColors();

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
