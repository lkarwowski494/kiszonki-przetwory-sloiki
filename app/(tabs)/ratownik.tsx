import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  DOCTOR_DECISION_TREE,
  DIAGNOSES,
  DoctorNode,
  Diagnosis,
} from '../../src/core/doctor/doctor-engine';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { KitchenButton } from '../../src/ui/components/KitchenButton';
import { Badge } from '../../src/ui/components/Badge';

export default function DoctorScreen() {
  const [currentNodeId, setCurrentNodeId] = useState<string>('ROOT');
  const [activeDiagnosis, setActiveDiagnosis] = useState<Diagnosis | null>(null);

  const currentNode: DoctorNode = DOCTOR_DECISION_TREE[currentNodeId] || DOCTOR_DECISION_TREE['ROOT'];

  const handleSelectOption = (option: DoctorNode['options'][0]) => {
    if (option.diagnosisId) {
      setActiveDiagnosis(DIAGNOSES[option.diagnosisId] || null);
    } else if (option.nextNodeId) {
      setCurrentNodeId(option.nextNodeId);
    }
  };

  const handleReset = () => {
    setCurrentNodeId('ROOT');
    setActiveDiagnosis(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={theme.typography.heroTitle}>Słoikowy Ratownik 🩺</Text>
          <Text style={styles.tagline}>
            Coś dzieje się ze słoikiem? Sprawdź w 10 sekund czy to bezpieczne!
          </Text>
        </View>

        {!activeDiagnosis ? (
          /* Drzewo pytań */
          <KitchenCard variant="elevated" style={styles.questionCard}>
            <Text style={styles.questionText}>❓ {currentNode.question}</Text>

            <View style={styles.optionsList}>
              {currentNode.options.map((opt, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  style={styles.optionButton}
                  onPress={() => handleSelectOption(opt)}
                >
                  <Text style={styles.optionLabel}>{opt.label}</Text>
                  <Text style={{ fontSize: 18, color: theme.colors.pickleGreen }}>➔</Text>
                </TouchableOpacity>
              ))}
            </View>

            {currentNodeId !== 'ROOT' && (
              <KitchenButton
                title="Wróć do początku ↺"
                variant="ghost"
                onPress={handleReset}
                style={{ marginTop: 12 }}
              />
            )}
          </KitchenCard>
        ) : (
          /* Wynik diagnozy */
          <View>
            <KitchenCard
              variant={activeDiagnosis.isSafeToEat ? 'highlight' : 'default'}
              style={[
                styles.diagnosisCard,
                !activeDiagnosis.isSafeToEat && { borderColor: theme.colors.danger, borderWidth: 2 },
              ]}
            >
              <View style={styles.diagHeader}>
                <Badge
                  label={activeDiagnosis.isSafeToEat ? 'BEZPIECZNE DO JEDZENIA ✅' : 'BEZWZGLĘDNIE WYRZUĆ ⚠️'}
                  variant={activeDiagnosis.isSafeToEat ? 'green' : 'red'}
                />
              </View>

              <Text style={styles.diagTitle}>{activeDiagnosis.title}</Text>
              <Text style={styles.diagShort}>{activeDiagnosis.shortExplanation}</Text>

              <View style={styles.diagSection}>
                <Text style={styles.diagSectionHeader}>🔬 Wyjaśnienie biologiczne:</Text>
                <Text style={styles.diagBodyText}>{activeDiagnosis.detailedCause}</Text>
              </View>

              <View style={styles.diagSection}>
                <Text style={styles.diagSectionHeader}>🛠️ Co zrobić teraz (Krok po kroku):</Text>
                {activeDiagnosis.actionSteps.map((step, idx) => (
                  <Text key={idx} style={styles.stepItem}>
                    {idx + 1}. {step}
                  </Text>
                ))}
              </View>

              <View style={styles.diagSection}>
                <Text style={styles.diagSectionHeader}>💡 Jak zapobiec temu w przyszłości:</Text>
                <Text style={styles.diagBodyText}>{activeDiagnosis.howToPreventNextTime}</Text>
              </View>
            </KitchenCard>

            <KitchenButton
              title="Sprawdź inny słoik / Zdiagnozuj ponownie ↺"
              onPress={handleReset}
              style={{ marginTop: 16 }}
            />
          </View>
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
  questionCard: {
    padding: theme.spacing.lg,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 16,
    lineHeight: 24,
  },
  optionsList: {
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    minHeight: 52,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    flex: 1,
    paddingRight: 10,
  },
  diagnosisCard: {
    padding: theme.spacing.lg,
  },
  diagHeader: {
    marginBottom: 8,
  },
  diagTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  diagShort: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  diagSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 8,
  },
  diagSectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    marginBottom: 4,
  },
  diagBodyText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 19,
  },
  stepItem: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 19,
    marginVertical: 2,
  },
});
