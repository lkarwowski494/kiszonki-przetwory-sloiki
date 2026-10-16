import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { dbStore, BatchRecord } from '../../src/data/db/database';
import { getRecipeById } from '../../src/core/recipes/recipes-data';
import { calculateFermentationTimeline } from '../../src/core/timeline/fermentation-timeline';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { KitchenButton } from '../../src/ui/components/KitchenButton';
import { Badge } from '../../src/ui/components/Badge';

export default function FermentTimelineScreen() {
  const [activeBatches, setActiveBatches] = useState<BatchRecord[]>([]);

  const reloadData = () => {
    setActiveBatches(dbStore.getActiveFerments());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleBurp = (batchId: string) => {
    dbStore.addFermentationLog({
      batchId,
      dayNumber: 2,
      sensoryNote: 'Słoik odgazowany (uwolniono CO2).',
      burped: true,
      tasted: false,
    });
    Alert.alert('Słoik odgazowany! 🫧', 'Ciśnienie gazu CO₂ zostało bezpiecznie uwolnione.');
    reloadData();
  };

  const handleMoveToPantry = (batchId: string) => {
    Alert.alert(
      'Koniec fermentacji! 🫙',
      'Czy smak jest idealny i chcesz przenieść ten słoik do spiżarni lub lodówki?',
      [
        { text: 'Jeszcze nie', style: 'cancel' },
        {
          text: 'Tak, przenieś do spiżarki',
          onPress: () => {
            dbStore.updateBatchStatus(batchId, 'pantry', 5);
            dbStore.addPantryItem({
              batchId,
              label: 'Ogórki małosolne chrupiące',
              jarVolumeMl: 1000,
              location: 'fridge',
              quantity: 1,
              sealedAt: Date.now(),
              bestBefore: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 dni w lodówce
            });
            reloadData();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={theme.typography.heroTitle}>Fermentacja 🫧</Text>
          <Text style={styles.tagline}>
            Żywy kalendarz słoików stojących na Twoim blacie kuchennym.
          </Text>
        </View>

        {activeBatches.length === 0 ? (
          <KitchenCard style={styles.emptyCard}>
            <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 8 }}>🥒</Text>
            <Text style={styles.emptyTitle}>Brak aktywnych kiszonek na blacie</Text>
            <Text style={styles.emptySubtitle}>
              Przejdź do zakładki Receptury lub Kreatora, aby nastawić swój pierwszy pyszny słoik!
            </Text>
          </KitchenCard>
        ) : (
          activeBatches.map((batch) => {
            const recipe = getRecipeById(batch.recipeId) || {
              id: batch.recipeId,
              title: batch.recipeTitle,
              subtitle: '',
              culture: batch.culture,
              category: 'poland_central_europe' as const,
              method: 'lacto_fermentation' as const,
              defaultProduceWeightGrams: batch.produceWeightGrams,
              defaultSalinityPercent: batch.salinityPercent,
              fermentationDays: batch.targetFermentationDays,
              shelfLifeMonths: 6,
              recommendedJarType: 'Słoik 1L',
              ingredients: [],
              steps: [],
              crispnessSecrets: [],
              sensoryMilestones: [
                { day: 1, title: 'Adaptacja', sensoryDescription: 'Zalewa mętnieje.' },
                { day: 2, title: 'Bąbelkowanie', sensoryDescription: 'Gazowanie CO2.' },
                { day: 3, title: 'Złoty Punkt!', sensoryDescription: 'Spróbuj widelczykiem!', isTastingCheckpoint: true },
              ],
              commonMistakes: [],
            };

            const timeline = calculateFermentationTimeline(recipe, batch.startedAt, 21);

            return (
              <KitchenCard key={batch.id} variant="elevated" style={styles.batchCard}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.batchTitle}>{batch.recipeTitle}</Text>
                    <Text style={styles.batchSub}>
                      Nastawiono: {new Date(batch.startedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Badge label="BĄBELKUJE" variant="amber" />
                </View>

                {/* Statusy sensoryczne */}
                <View style={styles.milestoneBox}>
                  <Text style={styles.milestoneHeader}>📅 Etapy sensoryczne:</Text>
                  {timeline.milestones.map((m, idx) => (
                    <View key={idx} style={styles.milestoneRow}>
                      <Text style={styles.milestoneDay}>Dzień {m.day}:</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.milestoneTitle}>
                          {m.title} {m.isTastingCheckpoint && '🍴'}
                        </Text>
                        <Text style={styles.milestoneDesc}>{m.sensoryDescription}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Przyciski Akcji Kuchennych */}
                <View style={styles.actionsRow}>
                  <KitchenButton
                    title="Odgazuj słoik (Burp) 💨"
                    variant="secondary"
                    onPress={() => handleBurp(batch.id)}
                    style={{ flex: 1, marginRight: 6 }}
                  />
                  <KitchenButton
                    title="Do lodówki / piwnicy ❄️"
                    variant="primary"
                    onPress={() => handleMoveToPantry(batch.id)}
                    style={{ flex: 1, marginLeft: 6 }}
                  />
                </View>
              </KitchenCard>
            );
          })
        )}
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
  emptyCard: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  batchCard: {
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  batchTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  batchSub: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  milestoneBox: {
    backgroundColor: theme.colors.bgSecondary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginVertical: 10,
  },
  milestoneHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  milestoneRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  milestoneDay: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    width: 60,
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  milestoneDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
});
