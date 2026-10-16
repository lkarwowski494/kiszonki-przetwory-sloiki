import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MASTER_RECIPES } from '../../src/core/recipes/recipes-data';
import { dbStore } from '../../src/data/db/database';
import { MasterRecipe, RecipeCategory } from '../../src/core/types';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { KitchenButton } from '../../src/ui/components/KitchenButton';
import { Badge } from '../../src/ui/components/Badge';
import { t, useLang } from '../../src/lib/i18n';


const CATEGORIES: { label: string; value: RecipeCategory | 'all' }[] = [
  { label: 'Wszystkie', value: 'all' },
  { label: 'Polska', value: 'poland_central_europe' },
  { label: 'Azja', value: 'east_asia' },
  { label: 'Bliski Wschód / Indie', value: 'mideast_maghreb_india' },
  { label: 'Ameryki', value: 'americas_mediterranean' },
  { label: 'Owoce & Dżemy', value: 'sweet_preserves' },
  { label: 'Napoje & Octy', value: 'drinks_vinegars' },
];

import { useRouter } from 'expo-router';

export default function RecipesScreen() {
  const router = useRouter();
  useLang();
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<MasterRecipe | null>(null);
  const [customRecipes, setCustomRecipes] = useState<MasterRecipe[]>([]);

  useEffect(() => {
    setCustomRecipes(dbStore.getCustomRecipes());
  }, []);

  const allRecipes = [...customRecipes, ...MASTER_RECIPES];

  const filteredRecipes = allRecipes.filter((r) => {
    const matchesCategory =
      selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.culture.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Nagłówek */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={theme.typography.heroTitle}>{t('Słoik (Jarwise) 🫙')}</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => router.push('/experiments')}
                style={styles.iconButton}
                accessibilityLabel={t('Laboratorium Eksperymentów')}
              >
                <Text style={{ fontSize: 20 }}>🔬</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/pasteurizer')}
                style={styles.iconButton}
                accessibilityLabel={t('Stoper Pasteryzacji')}
              >
                <Text style={{ fontSize: 20 }}>⏱️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/settings')}
                style={styles.iconButton}
                accessibilityLabel={t('Ustawienia i Kopia')}
              >
                <Text style={{ fontSize: 20 }}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.tagline}>
            {t('Od chrupiących ogórków babci po kimchi i pikle ze świata.')}
          </Text>
        </View>

        {/* 1-Tap Szybki Start Banner */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/kreator')}
          style={styles.quickStartBanner}
          accessibilityLabel={t('Szybki Start 1-Tap w Kreatorze Solanki')}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.quickStartTitle}>{t('⚡ Szybki Start 1-Tap: Nowy Słoik')}</Text>
            <Text style={styles.quickStartSub}>
              {t('Waga kuchenna na blat i idealna solanka gotowa w 20 sekund!')}
            </Text>
          </View>
          <Text style={styles.quickStartArrow}>🥒 ➔</Text>
        </TouchableOpacity>

        {/* Wyszukiwarka */}
        <View style={styles.searchContainer}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t('Szukaj ogórków, kimchi, dżemu, octu...')}
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filtr kategorii */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              onPress={() => setSelectedCategory(cat.value)}
              style={[
                styles.categoryChip,
                selectedCategory === cat.value && styles.categoryChipActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat.value && styles.categoryChipTextActive,
                ]}
              >
                {t(cat.label)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Licznik receptur */}
        <Text style={styles.countText}>
          {t('Znaleziono receptur: {count} z 24', { count: filteredRecipes.length })}
        </Text>

        {/* Lista Receptur */}
        {filteredRecipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            activeOpacity={0.8}
            onPress={() => setSelectedRecipe(selectedRecipe?.id === recipe.id ? null : recipe)}
          >
            <KitchenCard
              style={styles.recipeCard}
              variant={selectedRecipe?.id === recipe.id ? 'highlight' : 'elevated'}
            >
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  <Text style={styles.recipeSubtitle}>{recipe.subtitle}</Text>
                </View>
                <Badge label={recipe.culture} variant="green" />
              </View>

              <View style={styles.paramRow}>
                <Text style={styles.paramText}>
                  {t('Sól:')}{' '}
                  <Text style={{ fontWeight: '700', color: theme.colors.pickleGreen }}>
                    {recipe.defaultSalinityPercent > 0 ? `${recipe.defaultSalinityPercent}%` : t('Bez soli')}
                  </Text>
                </Text>
                <Text style={styles.paramText}>
                  {t('Czas:')}{' '}
                  <Text style={{ fontWeight: '700', color: theme.colors.pickleGreen }}>
                    {recipe.fermentationDays > 0 ? `${recipe.fermentationDays} ${t('dni')}` : t('Pasteryzacja')}
                  </Text>
                </Text>
              </View>

              {/* Rozwinięcie szczegółów receptury */}
              {selectedRecipe?.id === recipe.id && (
                <View style={styles.expandedDetails}>
                  <Text style={styles.detailSectionTitle}>{t('🥬 Składniki na słoik 1L:')}</Text>
                  {recipe.ingredients.map((ing, idx) => (
                    <Text key={idx} style={styles.ingredientItem}>
                      • {ing.name}: {ing.amount} {ing.unit}
                    </Text>
                  ))}

                  <Text style={styles.detailSectionTitle}>{t('✨ Sekret Chrupkości:')}</Text>
                  {recipe.crispnessSecrets.map((secret, idx) => (
                    <Text key={idx} style={styles.secretText}>
                      💡 {secret}
                    </Text>
                  ))}

                  <Text style={styles.detailSectionTitle}>{t('📝 Przygotowanie krok po kroku:')}</Text>
                  {recipe.steps.map((step, idx) => (
                    <Text key={idx} style={styles.stepText}>
                      {idx + 1}. {step}
                    </Text>
                  ))}

                  <View style={{ marginTop: 14 }}>
                    <KitchenButton
                      title={t('Przelicz na wagę w Kreatorze ⚖️ ➔')}
                      variant="primary"
                      onPress={() => router.push('/(tabs)/kreator')}
                    />
                  </View>
                </View>
              )}
            </KitchenCard>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  container: {
    padding: theme.spacing.md,
    paddingBottom: 80,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  iconButton: {
    minWidth: theme.touchTarget.minWidth,
    minHeight: theme.touchTarget.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
  },
  tagline: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    marginBottom: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  categoryScroll: {
    marginVertical: theme.spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    backgroundColor: theme.colors.bgSecondary,
    borderRadius: theme.borderRadius.full,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  countText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginVertical: theme.spacing.sm,
  },
  recipeCard: {
    marginBottom: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  recipeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  recipeSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  paramRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 6,
  },
  paramText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  expandedDetails: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    marginTop: 10,
    marginBottom: 4,
  },
  ingredientItem: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 19,
    paddingLeft: 4,
  },
  secretText: {
    fontSize: 13,
    color: theme.colors.amberBrine,
    fontStyle: 'italic',
    lineHeight: 18,
    marginVertical: 2,
  },
  stepText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 19,
    marginVertical: 3,
  },
  quickStartBanner: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
    borderWidth: 1.5,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.pickleGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickStartTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.pickleGreen,
  },
  quickStartSub: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  quickStartArrow: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    marginLeft: 8,
  },
});
