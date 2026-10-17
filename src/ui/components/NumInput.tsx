// ============================================================================
// Apps4Brew / Słoik — Ergonomic Kitchen Number Input (NumInput)
// (RD-ENG-01, NFR-INT-003, NFR-A11Y-002, BR-TEST-005)
// - Obsługuje przecinek i kropkę dziesiętną ("12,5" === "12.5")
// - Prop stored={prevBase} zapobiega dryfowi zaokrągleń przez wInKeep
// - Minimalny rozmiar celu dotykowego >= 44 pt (standard 48 pt dla rąk kuchennych)
// ============================================================================

import React from 'react';
import {
  TextInput,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  View,
  Text,
} from 'react-native';
import { theme } from '../theme';
import { wInKeep, normalizeNumString } from '../../core/units/unit-keep';

export interface NumInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onChangeNumber?: (num: number) => void;
  stored?: number;
  unit?: string;
  placeholder?: string;
  label?: string;
  unitLabel?: string;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  editable?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

export const NumInput: React.FC<NumInputProps> = ({
  value,
  onChangeText,
  onChangeNumber,
  stored,
  unit,
  placeholder,
  label,
  unitLabel,
  style,
  containerStyle,
  editable = true,
  accessibilityLabel,
  testID = 'num-input-field',
}) => {
  const handleChangeText = (text: string) => {
    // Normalizacja przecinka na kropkę, usunięcie niedozwolonych znaków
    const cleanText = text.replace(/,/g, '.').replace(/[^0-9.-]/g, '');
    onChangeText(cleanText);

    if (onChangeNumber) {
      if (unit) {
        const kept = wInKeep(cleanText, unit, stored);
        onChangeNumber(kept);
      } else {
        const parsed = parseFloat(cleanText);
        onChangeNumber(isNaN(parsed) ? 0 : parsed);
      }
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputRow}>
        <TextInput
          testID={testID}
          style={[styles.input, style]}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="decimal-pad"
          editable={editable}
          accessibilityLabel={accessibilityLabel || label || placeholder || 'Pole liczbowe'}
          accessibilityRole="text"
          hitSlop={theme.hitSlop}
        />
        {unitLabel && <Text style={styles.unitText}>{unitLabel}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    minHeight: 48, // Gwarancja >= 44 pt
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    minHeight: 48,
    paddingVertical: 10,
    fontVariant: ['tabular-nums'],
  },
  unitText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginLeft: 8,
  },
});
