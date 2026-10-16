import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  closeLabel?: string;
  rightAction?: React.ReactNode;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  onClose,
  closeLabel = 'Anuluj',
  rightAction,
}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={onClose}
        style={styles.closeButton}
        accessibilityRole="button"
        accessibilityLabel={closeLabel}
      >
        <Text style={styles.closeText}>{closeLabel}</Text>
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.rightContainer}>{rightAction || <View style={styles.placeholder} />}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.bgCard,
  },
  closeButton: {
    minHeight: theme.touchTarget.minHeight,
    minWidth: theme.touchTarget.minWidth,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  closeText: {
    fontSize: 16,
    color: theme.colors.pickleGreen,
    fontWeight: '500',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  rightContainer: {
    minWidth: theme.touchTarget.minWidth,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  placeholder: {
    width: theme.touchTarget.minWidth,
  },
});
