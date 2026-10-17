// ============================================================================
// Słoik (Jarwise) — Wiedza (Faza 1: Konsolidacja Receptur & Doktora)
// Segmented control:
// 1. 📖 Receptury Świata (24 mistrzowskie procedury + autorskie receptury użytkownika)
// 2. 🩺 Doktor Mikrobiologiczny (drzewo decyzyjne diagnozy + procedury ratunkowe)
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MASTER_RECIPES } from '../../src/core/recipes/recipes-data';
import { dbStore } from '../../src/data/db/database';
import { MasterRecipe, RecipeCategory, DoctorNode, Diagnosis } from '../../src/core/types';
import {
  DOCTOR_DECISION_TREE,
  DIAGNOSES,
} from '../../src/core/doctor/doctor-engine';
import {
  calculateBrineTopUp,
  EMERGENCY_PROCEDURES,
} from '../../src/core/doctor/emergency-recovery';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { KitchenButton } from '../../src/ui/components/KitchenButton';
import { Badge } from '../../src/ui/components/Badge';
import { ModalHeader } from '../../src/ui/components/ModalHeader';
import { CustomRecipeModal } from '../../src/ui/components/CustomRecipeModal';
import { SearchField, normSearch } from '../../src/ui/components/SearchField';
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

export default function WiedzaScreen() {
  const router = useRouter();
  useLang();

  // Główny przełącznik Wiedzy
  const [activeTab, setActiveTab] = useState<'recipes' | 'doctor'>('recipes');

  // Stan dla Receptur
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<MasterRecipe | null>(null);
  const [customRecipes, setCustomRecipes] = useState<MasterRecipe[]>([]);
  const [isCustomRecipeModalOpen, setIsCustomRecipeModalOpen] = useState(false);

  // Stan dla Doktora
  const [currentNodeId, setCurrentNodeId] = useState<string>('ROOT');
  const [activeDiagnosis, setActiveDiagnosis] = useState<Diagnosis | null>(null);
  const [missingVolumeMl, setMissingVolumeMl] = useState<number>(250);
  const [targetSalinity, setTargetSalinity] = useState<number>(2.0);
  const [expandedProcedureId, setExpandedProcedureId] = useState<string | null>('floating_produce');

  const reloadCustomRecipes = () => {
    setCustomRecipes(dbStore.getCustomRecipes());
  };

  useEffect(() => {
    reloadCustomRecipes();
  }, []);

  const allRecipes = [...customRecipes, ...MASTER_RECIPES];

  const filteredRecipes = allRecipes.filter((r) => {
    const matchesCategory =
      selectedCategory === 'all' || r.category === selectedCategory;
    const q = normSearch(searchQuery);
    const matchesSearch =
      !q ||
      normSearch(r.title).includes(q) ||
      normSearch(r.culture).includes(q) ||
      normSearch(r.subtitle).includes(q);
    return matchesCategory && matchesSearch;
  });

  const currentNode: DoctorNode =
    DOCTOR_DECISION_TREE[currentNodeId] || DOCTOR_DECISION_TREE['ROOT'];

  const handleSelectOption = (option: DoctorNode['options'][0]) => {
    if (option.diagnosisId) {
      setActiveDiagnosis(DIAGNOSES[option.diagnosisId] || null);
    } else if (option.nextNodeId) {
      setCurrentNodeId(option.nextNodeId);
    }
  };

  const handleResetDoctor = () => {
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
        {/* Nagłówek */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={theme.typography.heroTitle}>{t('Wiedza Rzemieślnicza 📖')}</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => router.push('/settings')}
                style={styles.iconButton}
                accessibilityLabel={t('Ustawienia')}
                hitSlop={theme.hitSlop}
              >
                <Text style={{ fontSize: 20 }}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.tagline}>
            {t('24 Receptury Świata oraz Doktor Mikrobiologiczny ratujący słoiki.')}
          </Text>
        </View>

        {/* Główny Segmented Control: Receptury vs Doktor */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeTab === 'recipes' && styles.segmentButtonActive,
            ]}
            onPress={() => setActiveTab('recipes')}
            activeOpacity={0.8}
            accessibilityLabel={t('Receptury Świata')}
          >
            <Text
              style={[
                styles.segmentButtonText,
                activeTab === 'recipes' && styles.segmentButtonTextActive,
              ]}
            >
              📖 {t('Receptury Świata')} ({allRecipes.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeTab === 'doctor' && styles.segmentButtonActive,
            ]}
            onPress={() => setActiveTab('doctor')}
            activeOpacity={0.8}
            accessibilityLabel={t('Doktor Mikrobiologiczny')}
          >
            <Text
              style={[
                styles.segmentButtonText,
                activeTab === 'doctor' && styles.segmentButtonTextActive,
              ]}
            >
              🩺 {t('Słoikowy Ratownik')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ============================================================== */}
        {/* ZAKŁADKA 1: 24 RECEPTURY ŚWIATA + AUTORSKIE RECEPTURY           */}
        {/* ============================================================== */}
        {activeTab === 'recipes' && (
          <View>
            <View style={styles.recipesActionRow}>
              <Text style={styles.sectionTitle}>{t('Katalog Receptur')}</Text>
              <TouchableOpacity
                style={styles.addRecipeBtn}
                onPress={() => setIsCustomRecipeModalOpen(true)}
                hitSlop={theme.hitSlop}
              >
                <Text style={styles.addRecipeText}>+ {t('Własna receptura')}</Text>
              </TouchableOpacity>
            </View>

            {/* Wyszukiwarka */}
            <SearchField
              placeholder={t('Szukaj: ogórki, kimchi, kapusta, cytryny...')}
              query={searchQuery}
              onChangeQuery={setSearchQuery}
              containerStyle={{ marginBottom: 12 }}
            />

            {/* Kategorie */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.catChip,
                    selectedCategory === cat.value && styles.catChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.value)}
                  hitSlop={theme.hitSlop}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      selectedCategory === cat.value && styles.catChipTextActive,
                    ]}
                  >
                    {t(cat.label)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Lista Receptur */}
            <View style={styles.recipesList}>
              {filteredRecipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.recipeCard}
                  onPress={() => setSelectedRecipe(recipe)}
                  activeOpacity={0.85}
                >
                  <View style={styles.recipeCardHeader}>
                    <Text style={styles.recipeCulture}>{recipe.culture}</Text>
                    <Badge
                      label={`${recipe.defaultSalinityPercent}% ${t('solanki')}`}
                      variant="green"
                    />
                  </View>
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  <Text style={styles.recipeSubtitle}>{recipe.subtitle}</Text>

                  <View style={styles.recipeFooter}>
                    <Text style={styles.recipeDays}>
                      ⏳ {recipe.fermentationDays} {t('dni')}
                    </Text>
                    <Text style={styles.recipeDetailPrompt}>
                      {t('Zobacz recepturę →')}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* ZAKŁADKA 2: DOKTOR MIKROBIOLOGICZNY (DRZEWO DIAGNOZY & RATUNEK) */}
        {/* ============================================================== */}
        {activeTab === 'doctor' && (
          <View>
            <Text style={styles.sectionTitle}>{t('Drzewo Diagnozy Mikrobiologicznej')}</Text>

            {!activeDiagnosis ? (
              <KitchenCard style={styles.diagnosisCard}>
                <Text style={styles.nodeQuestion}>{t(currentNode.question)}</Text>
                {currentNode.hint && (
                  <Text style={styles.nodeHint}>💡 {t(currentNode.hint)}</Text>
                )}

                <View style={styles.optionsList}>
                  {currentNode.options.map((opt: any, i: number) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.doctorOptionBtn}
                      onPress={() => handleSelectOption(opt)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.doctorOptionText}>{t(opt.label)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {currentNodeId !== 'ROOT' && (
                  <TouchableOpacity
                    style={styles.doctorResetBtn}
                    onPress={handleResetDoctor}
                    hitSlop={theme.hitSlop}
                  >
                    <Text style={styles.doctorResetText}>{t('Zacznij diagnozę od nowa ↺')}</Text>
                  </TouchableOpacity>
                )}
              </KitchenCard>
            ) : (
              <KitchenCard
                style={StyleSheet.flatten([
                  styles.diagnosisResultCard,
                  activeDiagnosis.severity === 'safe'
                    ? styles.safeCard
                    : activeDiagnosis.severity === 'caution'
                    ? styles.warningCard
                    : styles.dangerCard,
                ])}
              >
                <View style={styles.resultHeader}>
                  <Text style={styles.resultBadge}>
                    {activeDiagnosis.severity === 'safe'
                      ? t('BEZPIECZNE DO JEDZENIA ✅')
                      : activeDiagnosis.severity === 'caution'
                      ? t('WYMAGA UWAGI / DZIAŁANIA ⚠️')
                      : t('BEZWZGLĘDNIE WYRZUĆ ❌')}
                  </Text>
                  <Text style={styles.resultTitle}>{t(activeDiagnosis.title)}</Text>
                  <Text style={styles.resultBiology}>
                    🔬 {t(activeDiagnosis.biologicalExplanation || activeDiagnosis.detailedCause || activeDiagnosis.shortExplanation)}
                  </Text>
                </View>

                <View style={styles.actionBox}>
                  <Text style={styles.actionTitle}>🛠️ {t('Działanie ratunkowe:')}</Text>
                  <Text style={styles.actionText}>
                    {t(activeDiagnosis.actionRequired || activeDiagnosis.actionSteps.join('\n'))}
                  </Text>
                </View>

                {activeDiagnosis.tasteImpact && (
                  <Text style={styles.tasteImpactText}>
                    👅 {t('Wpływ na smak: ')}{t(activeDiagnosis.tasteImpact)}
                  </Text>
                )}

                <TouchableOpacity
                  style={styles.newDiagnosisBtn}
                  onPress={handleResetDoctor}
                  activeOpacity={0.8}
                >
                  <Text style={styles.newDiagnosisBtnText}>
                    {t('Sprawdź inny słoik / Zdiagnozuj ponownie ↺')}
                  </Text>
                </TouchableOpacity>
              </KitchenCard>
            )}

            {/* KALKULATOR UZUPEŁNIANIA SOLANKI (BRINE TOP-UP) */}
            <View style={styles.topUpBox}>
              <Text style={styles.topUpTitle}>
                🌊 {t('Kalkulator Uzupełnienia Solanki (Brine Top-up)')}
              </Text>
              <Text style={styles.topUpDesc}>
                {t('Warzywa wystają ponad zalewę? Uzupełnij sterylną solanką o identycznym stężeniu.')}
              </Text>

              <View style={styles.topUpRow}>
                <View style={styles.topUpCol}>
                  <Text style={styles.topUpLabel}>{t('Brakująca objętość (ml)')}</Text>
                  <TextInput
                    style={styles.topUpInput}
                    keyboardType="numeric"
                    value={String(missingVolumeMl)}
                    onChangeText={(v) => setMissingVolumeMl(parseInt(v, 10) || 0)}
                  />
                </View>
                <View style={styles.topUpCol}>
                  <Text style={styles.topUpLabel}>{t('Docelowe stężenie (%)')}</Text>
                  <TextInput
                    style={styles.topUpInput}
                    keyboardType="numeric"
                    value={String(targetSalinity)}
                    onChangeText={(v) => setTargetSalinity(parseFloat(v) || 2.0)}
                  />
                </View>
              </View>

              <View style={styles.calcResultBox}>
                <Text style={styles.calcResultText}>
                  {t('Rozpuść ')}
                  <Text style={styles.calcHighlight}>{brineCalculation.saltGrams.toFixed(1)}g</Text>
                  {t(' soli w ')}
                  <Text style={styles.calcHighlight}>{brineCalculation.waterMl}ml</Text>
                  {t(' ostudzonej, przegotowanej wody.')}
                </Text>
              </View>
            </View>

            {/* PROCEDURY RATUNKOWE */}
            <View style={styles.emergencyProceduresBox}>
              <Text style={styles.emergencyHeader}>🚨 {t('Procedury Ratunkowe')}</Text>
              {EMERGENCY_PROCEDURES.map((proc) => {
                const isExpanded = expandedProcedureId === proc.id;
                return (
                  <TouchableOpacity
                    key={proc.id}
                    style={styles.procCard}
                    onPress={() =>
                      setExpandedProcedureId(isExpanded ? null : proc.id)
                    }
                    activeOpacity={0.8}
                  >
                    <View style={styles.procHeader}>
                      <Text style={styles.procTitle}>{t(proc.title)}</Text>
                      <Text style={styles.procChevron}>{isExpanded ? '▲' : '▼'}</Text>
                    </View>
                    {isExpanded && (
                      <View style={styles.procBody}>
                        {proc.steps.map((st, i) => (
                          <Text key={i} style={styles.procStep}>
                            {i + 1}. {t(st)}
                          </Text>
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* MODAL: SZCZEGÓŁY RECEPTURY */}
        <Modal visible={!!selectedRecipe} animationType="slide">
          <SafeAreaView style={styles.recipeModalContainer}>
            <ModalHeader
              title={selectedRecipe?.title || ''}
              onClose={() => setSelectedRecipe(null)}
              closeLabel={t('Zamknij')}
              rightAction={
                <TouchableOpacity
                  onPress={() => {
                    setSelectedRecipe(null);
                    router.push('/(tabs)');
                  }}
                  hitSlop={theme.hitSlop}
                  style={styles.useInRitualHeaderBtn}
                >
                  <Text style={styles.useInRitualHeaderText}>🫙 {t('Użyj')}</Text>
                </TouchableOpacity>
              }
            />
            {selectedRecipe && (
              <ScrollView contentContainerStyle={styles.recipeModalContent}>
                <Text style={styles.modalRecipeSubtitle}>
                  {selectedRecipe.subtitle} · {selectedRecipe.culture}
                </Text>

                {/* Sacred Numbers Bar dla Receptury */}
                <View style={styles.recipeMetricsCard}>
                  <View style={styles.metricMini}>
                    <Text style={styles.metricMiniVal}>
                      {selectedRecipe.defaultProduceWeightGrams}g
                    </Text>
                    <Text style={styles.metricMiniLbl}>{t('Surowiec')}</Text>
                  </View>
                  <View style={styles.metricMini}>
                    <Text style={styles.metricMiniVal}>
                      {selectedRecipe.defaultSalinityPercent}%
                    </Text>
                    <Text style={styles.metricMiniLbl}>{t('Sól')}</Text>
                  </View>
                  <View style={styles.metricMini}>
                    <Text style={styles.metricMiniVal}>
                      {selectedRecipe.fermentationDays} {t('dni')}
                    </Text>
                    <Text style={styles.metricMiniLbl}>{t('Czas')}</Text>
                  </View>
                </View>

                {/* Sekret Chrupkości */}
                {selectedRecipe.crispnessSecrets.length > 0 && (
                  <View style={styles.secretBox}>
                    <Text style={styles.secretTitle}>✨ {t('Sekret Chrupkości:')}</Text>
                    {selectedRecipe.crispnessSecrets.map((s, i) => (
                      <Text key={i} style={styles.secretItem}>
                        • {t(s)}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Składniki */}
                <Text style={styles.modalSectionTitle}>📋 {t('Składniki')}</Text>
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <View key={idx} style={styles.ingItem}>
                    <Text style={styles.ingBullet}>•</Text>
                    <Text style={styles.ingNameModal}>{ing.name}</Text>
                    <Text style={styles.ingAmountModal}>
                      {ing.amount} {ing.unit !== 'do_smaku' ? ing.unit : ''}
                    </Text>
                  </View>
                ))}

                {/* Kroki Przygotowania */}
                <Text style={styles.modalSectionTitle}>👨‍🍳 {t('Procedura Rzemieślnicza')}</Text>
                {selectedRecipe.steps.map((step, idx) => (
                  <View key={idx} style={styles.stepItemRow}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.stepContentText}>{t(step)}</Text>
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.bigUseInRitualBtn}
                  onPress={() => {
                    setSelectedRecipe(null);
                    router.push('/(tabs)');
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.bigUseInRitualText}>
                    {t('Nastaw w Rytuale 🫙')}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </SafeAreaView>
        </Modal>

        {/* MODAL TWORZENIA AUTORSKIEJ RECEPTURY */}
        <CustomRecipeModal
          visible={isCustomRecipeModalOpen}
          onClose={() => setIsCustomRecipeModalOpen(false)}
          onSaved={() => reloadCustomRecipes()}
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    minHeight: 44,
    minWidth: 44,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 4,
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.pickleGreen,
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  recipesActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  addRecipeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addRecipeText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
  },
  searchInput: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  categoriesScroll: {
    gap: 8,
    paddingBottom: 10,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
  },
  catChipActive: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: theme.colors.pickleGreenMuted,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  catChipTextActive: {
    color: theme.colors.pickleGreenLight,
  },
  recipesList: {
    gap: 12,
    marginTop: 8,
  },
  recipeCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: 14,
  },
  recipeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  recipeCulture: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  recipeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  recipeSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  recipeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 8,
  },
  recipeDays: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.amberBrine,
  },
  recipeDetailPrompt: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.pickleGreen,
  },
  diagnosisCard: {
    backgroundColor: theme.colors.bgCard,
    padding: 16,
    marginTop: 8,
  },
  nodeQuestion: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  nodeHint: {
    fontSize: 13,
    color: theme.colors.amberBrine,
    marginBottom: 14,
  },
  optionsList: {
    gap: 10,
  },
  doctorOptionBtn: {
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    minHeight: 48,
    justifyContent: 'center',
  },
  doctorOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  doctorResetBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
  },
  doctorResetText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  diagnosisResultCard: {
    padding: 18,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    marginTop: 8,
  },
  safeCard: {
    backgroundColor: theme.colors.pickleGreenMuted,
    borderColor: theme.colors.pickleGreen,
  },
  warningCard: {
    backgroundColor: theme.colors.amberBrineMuted,
    borderColor: theme.colors.amberBrine,
  },
  dangerCard: {
    backgroundColor: theme.colors.berryRedMuted,
    borderColor: theme.colors.berryRed,
  },
  resultHeader: {
    marginBottom: 12,
  },
  resultBadge: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 6,
    color: theme.colors.textPrimary,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  resultBiology: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  actionBox: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  tasteImpactText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  newDiagnosisBtn: {
    backgroundColor: theme.colors.pickleGreen,
    minHeight: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  newDiagnosisBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  topUpBox: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    marginTop: 18,
  },
  topUpTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  topUpDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
    marginBottom: 12,
  },
  topUpRow: {
    flexDirection: 'row',
    gap: 10,
  },
  topUpCol: {
    flex: 1,
  },
  topUpLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  topUpInput: {
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  calcResultBox: {
    backgroundColor: theme.colors.pickleGreenMuted,
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    marginTop: 10,
  },
  calcResultText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 18,
  },
  calcHighlight: {
    fontWeight: '700',
    color: theme.colors.pickleGreenLight,
  },
  emergencyProceduresBox: {
    marginTop: 18,
  },
  emergencyHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  procCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    marginBottom: 8,
  },
  procHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  procTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
    paddingRight: 8,
  },
  procChevron: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  procBody: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 8,
    gap: 6,
  },
  procStep: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  recipeModalContainer: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  recipeModalContent: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  modalRecipeSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 14,
  },
  recipeMetricsCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    marginBottom: 16,
  },
  metricMini: {
    flex: 1,
    alignItems: 'center',
  },
  metricMiniVal: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  metricMiniLbl: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  secretBox: {
    backgroundColor: theme.colors.amberBrineMuted,
    borderWidth: 1,
    borderColor: theme.colors.amberBrine,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    marginBottom: 16,
  },
  secretTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.amberBrine,
    marginBottom: 6,
  },
  secretItem: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 18,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 14,
    marginBottom: 8,
  },
  ingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  ingBullet: {
    fontSize: 16,
    color: theme.colors.pickleGreen,
    marginRight: 8,
  },
  ingNameModal: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  ingAmountModal: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  stepItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.pickleGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepContentText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  bigUseInRitualBtn: {
    backgroundColor: theme.colors.pickleGreen,
    minHeight: 52,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  bigUseInRitualText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  useInRitualHeaderBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  useInRitualHeaderText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
  },
});
