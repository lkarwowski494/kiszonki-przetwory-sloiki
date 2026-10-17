// ============================================================================
// Apps4Brew / Słoik — Unified Kitchen Search Field (SearchField)
// (RD-ENG-07, NFR-INT-015)
// Zapewnia normalizację polskich znaków diakrytycznych (ł -> l, ą -> a, etc.)
// ============================================================================

import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { theme } from '../theme';

export interface SearchFieldProps {
  query: string;
  onChangeQuery: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Normalizuje tekst wyszukiwania poprzez usunięcie polskich i europejskich znaków diakrytycznych
 * oraz konwersję do małych liter. Gwarantuje, że wpisanie "ogorki" znajdzie "Ogórki", a "losos" -> "Łosoś".
 */
export function normSearch(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'l')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export const SearchField: React.FC<SearchFieldProps> = ({
  query,
  onChangeQuery,
  placeholder = 'Szukaj...',
  onClear,
  containerStyle,
  testID = 'search-field',
}) => {
  const handleClear = () => {
    onChangeQuery('');
    if (onClear) onClear();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        testID={testID}
        style={styles.input}
        value={query}
        onChangeText={onChangeQuery}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityRole="search"
        accessibilityLabel={placeholder}
      />
      {query.length > 0 && (
        <TouchableOpacity
          testID="search-clear-btn"
          style={styles.clearBtn}
          onPress={handleClear}
          hitSlop={theme.hitSlop}
          accessibilityRole="button"
          accessibilityLabel="Wyczyść wyszukiwanie"
        >
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    minHeight: 44, // Gwarancja minimalnego celu dotykowego
    marginVertical: 4,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textPrimary,
    minHeight: 44,
    paddingVertical: 8,
  },
  clearBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
});
