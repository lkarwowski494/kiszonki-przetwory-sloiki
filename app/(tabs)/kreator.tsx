import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { calculateBrine } from '../../src/core/brine/brine-calculator';
import { evaluatePasteurizationSafety } from '../../src/core/safety/safety-guard';
import { dbStore } from '../../src/data/db/database';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { KitchenButton } from '../../src/ui/components/KitchenButton';

export default function WizardScreen() {
  const [produceWeight, setProduceWeight] = useState('1000');
  const [waterWeight, setWaterWeight] = useState('800');
  const [salinityPct, setSalinityPct] = useState(2.2);
  const [isDrySalting, setIsDrySalting] = useState(false);
  const [batchTitle, setBatchTitle] = useState('Moje Ogórki Chrupiące');
  const [foodPh, setFoodPh] = useState(3.8);

  const produceNum = Math.max(0, parseFloat(produceWeight) || 0);
  const waterNum = isDrySalting ? 0 : Math.max(0, parseFloat(waterWeight) || 0);

  const brineResult = calculateBrine({
    produceWeightGrams: produceNum,
    waterWeightGrams: waterNum,
    targetSalinityPercent: salinityPct,
    method: isDrySalting ? 'dry_salting' : 'total_mass',
  });

  const safetyResult = evaluatePasteurizationSafety({
    foodPh: foodPh,
    jarVolumeMl: 1000,
    method: 'water_bath',
  });

  const handleSaveToPantry = () => {
    const newBatch = dbStore.createBatch({
      recipeId: 'REC-CUSTOM',
      recipeTitle: batchTitle.trim() || 'Własny nastaw',
      culture: 'Domowa kuchnia',
      method: isDrySalting ? 'dry_salting' : 'lacto_fermentation',
      startedAt: Date.now(),
      targetFermentationDays: 7,
      produceWeightGrams: produceNum,
      waterWeightGrams: waterNum,
      saltWeightGrams: brineResult.saltGrams,
      salinityPercent: salinityPct,
      status: 'fermenting',
      notes: `Nastawiono: ${produceNum}g surowca, ${brineResult.saltGrams}g soli.`,
    });

    Alert.alert(
      'Partia zapisana! 🫙',
      `Nastawiono partię "${newBatch.recipeTitle}". Słoik dodano do aktywnego kalendarza fermentacji.`,
      [{ text: 'Świetnie!' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={theme.typography.heroTitle}>Kalkulator Solanki 🥒</Text>
          <Text style={styles.tagline}>
            Złota proporcja soli i chrupkości. Nigdy więcej miękkich ogórków!
          </Text>
        </View>

        {/* Formularz Nastawu */}
        <KitchenCard variant="elevated">
          <Text style={styles.label}>Nazwa partii / przetworu:</Text>
          <TextInput
            style={styles.input}
            value={batchTitle}
            onChangeText={setBatchTitle}
            placeholder="np. Ogórki z koperkiem"
            placeholderTextColor={theme.colors.textMuted}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Waga warzyw (g):</Text>
              <TextInput
                style={styles.input}
                value={produceWeight}
                onChangeText={setProduceWeight}
                keyboardType="numeric"
              />
            </View>

            {!isDrySalting && (
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Woda (ml / g):</Text>
                <TextInput
                  style={styles.input}
                  value={waterWeight}
                  onChangeText={setWaterWeight}
                  keyboardType="numeric"
                />
              </View>
            )}
          </View>

          {/* Przełącznik Dry Salting */}
          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() => setIsDrySalting(!isDrySalting)}
          >
            <Text style={{ fontSize: 18 }}>{isDrySalting ? '☑️' : '◻️'}</Text>
            <Text style={styles.toggleText}>
              Solenie na sucho (kapusta, kimchi — bez dodawania wody)
            </Text>
          </TouchableOpacity>

          {/* Wybór stężenia soli */}
          <Text style={[styles.label, { marginTop: 12 }]}>
            Docelowe zasolenie: <strong>{salinityPct}%</strong>
          </Text>
          <View style={styles.saltButtonsRow}>
            {[1.8, 2.0, 2.2, 2.5, 3.0].map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.saltChip,
                  salinityPct === val && styles.saltChipActive,
                ]}
                onPress={() => setSalinityPct(val)}
              >
                <Text
                  style={[
                    styles.saltChipText,
                    salinityPct === val && styles.saltChipTextActive,
                  ]}
                >
                  {val}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </KitchenCard>

        {/* WYNIK KALKULACJI */}
        <KitchenCard variant="highlight" style={styles.resultCard}>
          <Text style={styles.resultHeader}>⚖️ Recepta dla Twojego Słoika:</Text>
          
          <View style={styles.bigResultBox}>
            <Text style={styles.bigSaltNumber}>{brineResult.saltGrams} g</Text>
            <Text style={styles.bigSaltLabel}>SOLI KAMIENNEJ LUB MORSKIEJ</Text>
          </View>

          {brineResult.calciumChlorideGrams && (
            <Text style={styles.subResult}>
              ✨ Opcjonalnie dla super chrupkości: <strong>{brineResult.calciumChlorideGrams} g chlorku wapnia (CaCl₂)</strong> lub 2 liście dębu/chrzanu.
            </Text>
          )}

          <View style={styles.recommendationsBox}>
            {brineResult.recommendations.map((rec, idx) => (
              <Text key={idx} style={styles.recommendationItem}>
                • {rec}
              </Text>
            ))}
          </View>
        </KitchenCard>

        {/* SEKCJA PASTERYZACJI */}
        <KitchenCard variant="default">
          <Text style={styles.sectionTitle}>⏱️ Pasteryzacja i Bezpieczeństwo:</Text>
          {safetyResult.isSafeForWaterBath ? (
            <View>
              <Text style={styles.safeStatusText}>
                ✅ Bezpieczne do pasteryzacji w kąpieli wodnej (100°C)
              </Text>
              <Text style={styles.paramItem}>
                Zalecany czas gotowania słoika 1L: <strong>{safetyResult.targetMinutes} minut</strong>
              </Text>
            </View>
          ) : (
            <Text style={styles.dangerStatusText}>
              ⚠️ {safetyResult.safetyWarning}
            </Text>
          )}
        </KitchenCard>

        {/* Zapisz do spiżarni */}
        <KitchenButton
          title="Rozpocznij nastaw i zapisz słoik 🫙"
          onPress={handleSaveToPantry}
          style={{ marginTop: 16 }}
        />
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    height: 44,
    fontSize: 15,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  toggleText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  saltButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  saltChip: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 3,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  saltChipActive: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  saltChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  saltChipTextActive: {
    color: '#FFF',
  },
  resultCard: {
    marginVertical: theme.spacing.md,
  },
  resultHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    marginBottom: 10,
  },
  bigResultBox: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.pickleGreenLight,
  },
  bigSaltNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.pickleGreen,
  },
  bigSaltLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },
  subResult: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 18,
    marginBottom: 8,
  },
  recommendationsBox: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#CDE5CA',
    paddingTop: 8,
  },
  recommendationItem: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginVertical: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  safeStatusText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.pickleGreen,
    marginBottom: 4,
  },
  dangerStatusText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.danger,
    lineHeight: 18,
  },
  paramItem: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
});
