import React, { useState } from 'react';
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
import { MasterRecipe, RecipeCategory } from '../../src/core/types';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { Badge } from '../../src/ui/components/Badge';

const CATEGORIES: { label: string; value: RecipeCategory | 'all' }[] = [
  { label: 'Wszystkie', value: 'all' },
  { label: 'Polska', value: 'poland_central_europe' },
  { label: 'Azja', value: 'east_asia' },
  { label: 'Bliski Wschód / Indie', value: 'mideast_maghreb_india' },
  { label: 'Ameryki', value: 'americas_mediterranean' },
  { label: 'Owoce & Dżemy', value: 'sweet_preserves' },
  { label: 'Napoje & Octy', value: 'drinks_vinegars' },
];

export default function RecipesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<MasterRecipe | null>(null);

  const filteredRecipes = MASTER_RECIPES.filter((r) => {
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
          <Text style={theme.typography.heroTitle}>Słoik (Jarwise) 🫙</Text>
          <Text style={styles.tagline}>
            Od chrupiących ogórków babci po kimchi i pikle ze świata.
          </Text>
        </View>

        {/* Wyszukiwarka */}
        <View style={styles.searchContainer}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Szukaj ogórków, kimchi, dżemu, octu..."
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
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Licznik receptur */}
        <Text style={styles.countText}>
          Znaleziono receptur: {filteredRecipes.length} z 24
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
                  ⚖️ Sól: <strong>{recipe.defaultSalinityPercent > 0 ? `${recipe.defaultSalinityPercent}%` : 'Bez soli'}</strong>
                </Text>
                <Text style={styles.paramText}>
                  ⏳ Czas: <strong>{recipe.fermentationDays > 0 ? `${recipe.fermentationDays} dni` : 'Pasteryzacja'}</strong>
                </Text>
              </View>

              {/* Rozwinięcie szczegółów receptury */}
              {selectedRecipe?.id === recipe.id && (
                <View style={styles.expandedDetails}>
                  <Text style={styles.detailSectionTitle}>🥬 Składniki na słoik 1L:</Text>
                  {recipe.ingredients.map((ing, idx) => (
                    <Text key={idx} style={styles.ingredientItem}>
                      • {ing.name}: {ing.amount} {ing.unit}
                    </Text>
                  ))}

                  <Text style={styles.detailSectionTitle}>✨ Sekret Chrupkości:</Text>
                  {recipe.crispnessSecrets.map((secret, idx) => (
                    <Text key={idx} style={styles.secretText}>
                      💡 {secret}
                    </Text>
                  ))}

                  <Text style={styles.detailSectionTitle}>📝 Przygotowanie krok po kroku:</Text>
                  {recipe.steps.map((step, idx) => (
                    <Text key={idx} style={styles.stepText}>
                      {idx + 1}. {step}
                    </Text>
                  ))}
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
});
