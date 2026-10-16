import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {
  DOCTOR_DECISION_TREE,
  DIAGNOSES,
  DoctorNode,
  Diagnosis,
} from '../../src/core/doctor/doctor-engine';
import {
  calculateBrineTopUp,
  EMERGENCY_PROCEDURES,
  RecoveryProcedure,
} from '../../src/core/doctor/emergency-recovery';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { KitchenButton } from '../../src/ui/components/KitchenButton';
import { Badge } from '../../src/ui/components/Badge';

export default function DoctorScreen() {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'emergency'>('diagnosis');

  // Stan dla drzewa diagnostycznego
  const [currentNodeId, setCurrentNodeId] = useState<string>('ROOT');
  const [activeDiagnosis, setActiveDiagnosis] = useState<Diagnosis | null>(null);

  // Stan dla kalkulatora solanki uzupełniającej
  const [missingVolumeMl, setMissingVolumeMl] = useState<number>(250);
  const [targetSalinity, setTargetSalinity] = useState<number>(2.0);

  // Stan dla rozwiniętych procedur ratunkowych
  const [expandedProcedureId, setExpandedProcedureId] = useState<string | null>('floating_produce');

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

  const brineCalculation = calculateBrineTopUp({
    missingVolumeMl,
    targetSalinityPercent: targetSalinity,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={theme.typography.heroTitle}>Słoikowy Ratownik 🩺</Text>
          <Text style={styles.tagline}>
            Diagnoza mikrobiologiczna i natychmiastowe procedury ratowania fermentacji.
          </Text>
        </View>

        {/* Segmented Control Zakładek */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'diagnosis' && styles.tabButtonActive]}
            onPress={() => setActiveTab('diagnosis')}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabButtonText, activeTab === 'diagnosis' && styles.tabButtonTextActive]}
            >
              🩺 Diagnoza Objawów
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'emergency' && styles.tabButtonActive]}
            onPress={() => setActiveTab('emergency')}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabButtonText, activeTab === 'emergency' && styles.tabButtonTextActive]}
            >
              🚨 Procedury Ratunkowe
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'diagnosis' ? (
          /* ZAKŁADKA 1: DRZEWO DIAGNOZY */
          !activeDiagnosis ? (
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
          )
        ) : (
          /* ZAKŁADKA 2: PROCEDURY RATUNKOWE I KALKULATOR DOLANIA SOLANKI */
          <View>
            {/* Kalkulator Dolania Solanki Uzupełniającej */}
            <KitchenCard variant="elevated" style={styles.calculatorCard}>
              <View style={styles.calcHeaderRow}>
                <Text style={styles.calcTitle}>💧 Kalkulator Solanki Uzupełniającej</Text>
                <Badge label="100% OFFLINE" variant="green" />
              </View>
              <Text style={styles.calcSubtitle}>
                Warzywa wystają lub solanka wykipiała? Przygotuj dolewkę o identycznym stężeniu %,
                aby nie dopuścić do zakażenia tlenowego.
              </Text>

              {/* Wybór objętości */}
              <Text style={styles.fieldLabel}>Brakująca objętość cieczy (ml):</Text>
              <View style={styles.presetRow}>
                {[100, 200, 250, 500, 750].map((vol) => (
                  <TouchableOpacity
                    key={vol}
                    onPress={() => setMissingVolumeMl(vol)}
                    style={[
                      styles.presetBtn,
                      missingVolumeMl === vol && styles.presetBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.presetText,
                        missingVolumeMl === vol && styles.presetTextActive,
                      ]}
                    >
                      {vol} ml
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={String(missingVolumeMl)}
                onChangeText={(val) => {
                  const num = parseInt(val, 10);
                  if (!isNaN(num) && num > 0) setMissingVolumeMl(num);
                  else if (val === '') setMissingVolumeMl(0);
                }}
                placeholder="Wpisz własną objętość w ml..."
                placeholderTextColor={theme.colors.textMuted}
              />

              {/* Wybór stężenia solanki */}
              <Text style={styles.fieldLabel}>Docelowe stężenie solanki (%):</Text>
              <View style={styles.presetRow}>
                {[1.8, 2.0, 2.5, 3.0, 3.5].map((sal) => (
                  <TouchableOpacity
                    key={sal}
                    onPress={() => setTargetSalinity(sal)}
                    style={[
                      styles.presetBtn,
                      targetSalinity === sal && styles.presetBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.presetText,
                        targetSalinity === sal && styles.presetTextActive,
                      ]}
                    >
                      {sal}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Wynik kalkulacji */}
              <View style={styles.resultBox}>
                <Text style={styles.resultHeader}>⚖️ Receptura dolewki:</Text>
                <View style={styles.resultRow}>
                  <Text style={styles.resultItem}>
                    🌊 Woda: <Text style={styles.resultBold}>{brineCalculation.waterMl} ml</Text>
                  </Text>
                  <Text style={styles.resultItem}>
                    🧂 Sól kamienna: <Text style={styles.resultBold}>{brineCalculation.saltGrams} g</Text>
                  </Text>
                </View>

                <View style={styles.prepStepsBox}>
                  {brineCalculation.preparationSteps.map((step, idx) => (
                    <Text key={idx} style={styles.prepStepText}>
                      • {step}
                    </Text>
                  ))}
                </View>

                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>
                    ⚠️ {brineCalculation.safetyWarning}
                  </Text>
                </View>
              </View>
            </KitchenCard>

            {/* Baza Dedykowanych Procedur Ratunkowych */}
            <Text style={styles.proceduresSectionTitle}>
              🛠️ Baza Złotych Procedur Ratunkowych
            </Text>

            {EMERGENCY_PROCEDURES.map((proc) => {
              const isExpanded = expandedProcedureId === proc.id;
              return (
                <KitchenCard key={proc.id} variant="default" style={styles.procedureCard}>
                  <TouchableOpacity
                    onPress={() => setExpandedProcedureId(isExpanded ? null : proc.id)}
                    activeOpacity={0.7}
                    style={styles.procedureHeader}
                  >
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Badge
                          label={
                            proc.urgency === 'high_critical'
                              ? 'PILNE ⚡'
                              : 'ŚREDNIE ⏳'
                          }
                          variant={proc.urgency === 'high_critical' ? 'red' : 'amber'}
                        />
                      </View>
                      <Text style={styles.procedureTitle}>{proc.title}</Text>
                      <Text style={styles.procedureSummary}>{proc.problemSummary}</Text>
                    </View>
                    <Text style={{ fontSize: 18, color: theme.colors.pickleGreen }}>
                      {isExpanded ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.procedureDetails}>
                      <Text style={styles.procSubhead}>📋 Kroki postępowania:</Text>
                      {proc.steps.map((st, i) => (
                        <Text key={i} style={styles.stepItem}>
                          {i + 1}. {st}
                        </Text>
                      ))}

                      <Text style={[styles.procSubhead, { color: theme.colors.pickleGreen }]}>
                        💡 Wskazówki mistrza przetwórstwa:
                      </Text>
                      {proc.proTips.map((tip, i) => (
                        <Text key={i} style={styles.tipItem}>
                          ✓ {tip}
                        </Text>
                      ))}

                      <Text style={[styles.procSubhead, { color: theme.colors.danger }]}>
                        🚫 Czego bezwzględnie unikać:
                      </Text>
                      {proc.mistakesToAvoid.map((mistake, i) => (
                        <Text key={i} style={styles.mistakeItem}>
                          ✗ {mistake}
                        </Text>
                      ))}
                    </View>
                  )}
                </KitchenCard>
              );
            })}
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bgSecondary,
    borderRadius: theme.borderRadius.md,
    padding: 4,
    marginBottom: theme.spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  tabButtonActive: {
    backgroundColor: theme.colors.bgCard,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  tabButtonTextActive: {
    color: theme.colors.pickleGreen,
    fontWeight: '700',
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
  calculatorCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  calcHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  calcTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  calcSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 10,
    marginBottom: 6,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  presetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  presetBtnActive: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  presetTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  resultBox: {
    marginTop: 14,
    backgroundColor: '#F3EFE6',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.pickleGreen,
  },
  resultHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    marginBottom: 6,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultItem: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  resultBold: {
    fontWeight: '800',
    color: theme.colors.pickleGreen,
  },
  prepStepsBox: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#DDD7CB',
    paddingTop: 6,
  },
  prepStepText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginVertical: 1,
  },
  warningBox: {
    marginTop: 8,
    backgroundColor: '#FFF1F0',
    padding: 8,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#FFCCC7',
  },
  warningText: {
    fontSize: 12,
    color: theme.colors.danger,
    lineHeight: 16,
    fontWeight: '600',
  },
  proceduresSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  procedureCard: {
    padding: theme.spacing.md,
    marginBottom: 10,
  },
  procedureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  procedureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  procedureSummary: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  procedureDetails: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 10,
  },
  procSubhead: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  tipItem: {
    fontSize: 12,
    color: theme.colors.pickleGreen,
    lineHeight: 17,
    marginVertical: 1,
    fontWeight: '500',
  },
  mistakeItem: {
    fontSize: 12,
    color: theme.colors.danger,
    lineHeight: 17,
    marginVertical: 1,
  },
});
