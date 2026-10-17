// ============================================================================
// Słoik (Jarwise) — Wiedza & Doktor 2.0 (Kompaktowa Checklista + Okna Modalne)
// Brak nieskończonego przewijania: każdy moduł (Katalog 155 Receptur, Drzewo
// Diagnozy, Kalkulator Dolewki, Procedury Ratunkowe) jest zwartą kartą na
// ekranie głównym i otwiera się w osobnym oknie z przyciskami Powrót / Zatwierdź.
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
import { Badge } from '../../src/ui/components/Badge';
import { ModalHeader } from '../../src/ui/components/ModalHeader';
import { CustomRecipeModal } from '../../src/ui/components/CustomRecipeModal';
import { QuickStartGuideModal } from '../../src/ui/components/QuickStartGuideModal';
import { AppTourModal } from '../../src/ui/components/AppTourModal';
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

  // Główny przełącznik: Doktor vs Receptury (domyślnie 'recipes' dla kompatybilności z testami ekranowymi)
  const [activeTab, setActiveTab] = useState<'recipes' | 'doctor'>('recipes');

  // Stan dla Receptur
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<MasterRecipe | null>(null);
  const [customRecipes, setCustomRecipes] = useState<MasterRecipe[]>([]);
  const [isCustomRecipeModalOpen, setIsCustomRecipeModalOpen] = useState(false);
  const [isRecipesCatalogModalOpen, setIsRecipesCatalogModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Stan dla Doktora i jego okien modalnych
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [activeProcedureModalId, setActiveProcedureModalId] = useState<string | null>(null);

  const [currentNodeId, setCurrentNodeId] = useState<string>('ROOT');
  const [activeDiagnosis, setActiveDiagnosis] = useState<Diagnosis | null>(null);
  const [missingVolumeMl, setMissingVolumeMl] = useState<number>(250);
  const [targetSalinity, setTargetSalinity] = useState<number>(2.0);

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

  const activeProcedure = EMERGENCY_PROCEDURES.find(
    (p) => p.id === activeProcedureModalId
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Nagłówek — czysta nawigacja (1 przycisk w prawym górnym rogu) */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitleText} numberOfLines={1}>
              {t('Wiedza Rzemieślnicza 📖')}
            </Text>
            <TouchableOpacity
              onPress={() => setIsTourOpen(true)}
              style={styles.tourHeaderBtn}
              accessibilityLabel={t('Przewodnik po funkcjach aplikacji')}
              hitSlop={theme.hitSlop}
              activeOpacity={0.85}
            >
              <Text style={styles.tourHeaderBtnEmoji}>🧭</Text>
              <Text style={styles.tourHeaderBtnText}>{t('Jak działa aplikacja?')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.tagline}>
            {t('Checklista ratunkowa Doktora oraz katalog 155 Receptur Świata.')}
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
        {/* ZAKŁADKA 1: KOMPAKTOWA CHECKLISTA RECEPTUR + OKNO KATALOGU       */}
        {/* ============================================================== */}
        {activeTab === 'recipes' && (
          <View>
            {/* Karta 1: Katalog 155 Receptur Świata */}
            <KitchenCard style={styles.checklistCard}>
              <View style={styles.checklistHeaderRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>1</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.checklistTitle}>{t('Katalog Receptur')}</Text>
                  <Text style={styles.checklistSub}>
                    {t('Przeglądaj i filtruj wszystkie 155 receptur w dedykowanym oknie.')}
                  </Text>
                </View>
              </View>

              {/* Zwarty podgląd 3 najpopularniejszych receptur na karcie głównej */}
              <View style={styles.compactPreviewList}>
                {allRecipes.slice(0, 3).map((recipe) => (
                  <TouchableOpacity
                    key={recipe.id}
                    style={styles.compactRecipeRow}
                    onPress={() => setSelectedRecipe(recipe)}
                    activeOpacity={0.8}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.compactRecipeTitle}>{recipe.title}</Text>
                      <Text style={styles.compactRecipeMeta}>
                        {recipe.culture} · {recipe.defaultSalinityPercent}% soli · ⏳{' '}
                        {recipe.fermentationDays} {t('dni')}
                      </Text>
                    </View>
                    <Text style={styles.compactRecipeArrow}>{t('Podgląd →')}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.primaryModalBtn}
                onPress={() => setIsRecipesCatalogModalOpen(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryModalBtnText}>
                  📖 {t('Otwórz pełny katalog receptur w nowym oknie →')}
                </Text>
              </TouchableOpacity>
            </KitchenCard>

            {/* Karta 2: Własne Receptury Rzemieślnika */}
            <KitchenCard style={styles.checklistCard}>
              <View style={styles.checklistHeaderRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>2</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.checklistTitle}>{t('Własna receptura')}</Text>
                  <Text style={styles.checklistSub}>
                    {t('Zapisz własny przepis z krokami i stężeniem soli ({count} zapisanych).', {
                      count: customRecipes.length,
                    })}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.secondaryModalBtn}
                onPress={() => setIsCustomRecipeModalOpen(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.secondaryModalBtnText}>
                  + {t('Dodaj własną recepturę w nowym oknie →')}
                </Text>
              </TouchableOpacity>
            </KitchenCard>
          </View>
        )}

        {/* ============================================================== */}
        {/* ZAKŁADKA 2: KOMPAKTOWA CHECKLISTA DOKTORA (3 KROKI W OKNACH)     */}
        {/* ============================================================== */}
        {activeTab === 'doctor' && (
          <View>
            {/* KROK 1: DRZEWO DIAGNOZY MIKROBIOLOGICZNEJ */}
            <KitchenCard style={styles.checklistCard}>
              <View style={styles.checklistHeaderRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>1</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.checklistTitle}>
                    {t('Drzewo Diagnozy Mikrobiologicznej')}
                  </Text>
                  <Text style={styles.checklistSub}>
                    {t('Krok 1: Odpowiedz na pytania w nowym oknie, aby odróżnić Kahm od pleśni.')}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryPillBox}>
                <Text style={styles.summaryPillLabel}>{t('STAN DIAGNOZY:')}</Text>
                <Text style={styles.summaryPillValue}>
                  {activeDiagnosis
                    ? `${t(activeDiagnosis.title)} (${
                        activeDiagnosis.severity === 'safe'
                          ? t('Bezpieczne ✅')
                          : activeDiagnosis.severity === 'caution'
                          ? t('Wymaga działania ⚠️')
                          : t('Wyrzuć słoik ❌')
                      })`
                    : t('Gotowy do przeprowadzenia wywiadu krok po kroku')}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.primaryModalBtn}
                onPress={() => setIsDiagnosisModalOpen(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryModalBtnText}>
                  🔍 {t('Rozpocznij diagnozę słoika w nowym oknie →')}
                </Text>
              </TouchableOpacity>
            </KitchenCard>

            {/* KROK 2: KALKULATOR UZUPEŁNIANIA SOLANKI */}
            <KitchenCard style={styles.checklistCard}>
              <View style={styles.checklistHeaderRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>2</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.checklistTitle}>
                    {t('Kalkulator Uzupełnienia Solanki (Brine Top-up)')}
                  </Text>
                  <Text style={styles.checklistSub}>
                    {t('Krok 2: Wylicz dokładną dolewkę, gdy warzywa wystają ponad lustro wody.')}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryPillBox}>
                <Text style={styles.summaryPillLabel}>{t('AKTUALNE WYLICZENIE DOLEWKI:')}</Text>
                <Text style={styles.summaryPillValue}>
                  {t('Rozpuść ')}
                  <Text style={styles.calcHighlight}>
                    {brineCalculation.saltGrams.toFixed(1)}g
                  </Text>
                  {t(' soli w ')}
                  <Text style={styles.calcHighlight}>{brineCalculation.waterMl}ml</Text>
                  {t(' wody ({salinity}%).', { salinity: targetSalinity })}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.secondaryModalBtn}
                onPress={() => setIsTopUpModalOpen(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.secondaryModalBtnText}>
                  🌊 {t('Zmień parametry dolewki w nowym oknie →')}
                </Text>
              </TouchableOpacity>
            </KitchenCard>

            {/* KROK 3: PROCEDURY RATUNKOWE (OTWIERANE W OSOBNYM OKNIE) */}
            <KitchenCard style={styles.checklistCard}>
              <View style={styles.checklistHeaderRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>3</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.checklistTitle}>🚨 {t('Procedury Ratunkowe')}</Text>
                  <Text style={styles.checklistSub}>
                    {t('Krok 3: Wybierz problem, aby otworzyć instrukcję ratunkową w nowym oknie.')}
                  </Text>
                </View>
              </View>

              <View style={{ gap: 8 }}>
                {EMERGENCY_PROCEDURES.map((proc) => (
                  <TouchableOpacity
                    key={proc.id}
                    style={styles.compactRecipeRow}
                    onPress={() => setActiveProcedureModalId(proc.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.compactRecipeTitle}>{t(proc.title)}</Text>
                    <Text style={styles.compactRecipeArrow}>{t('Otwórz →')}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </KitchenCard>
          </View>
        )}

        {/* ============================================================== */}
        {/* OKNO MODALNE: PEŁNY KATALOG 155 RECEPTUR ŚWIATA                 */}
        {/* ============================================================== */}
        <Modal
          visible={isRecipesCatalogModalOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsRecipesCatalogModalOpen(false)}
        >
          <SafeAreaView style={styles.stepModalSafeArea}>
            <View style={styles.stepModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepModalKicker}>{t('KATALOG RECEPTUR ŚWIATA')}</Text>
                <Text style={styles.stepModalTitle}>
                  {t('155 Sprawdzonych Procedur')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.stepModalCloseIcon}
                onPress={() => setIsRecipesCatalogModalOpen(false)}
              >
                <Text style={styles.stepModalCloseIconText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
              <SearchField
                placeholder={t('Szukaj: ogórki, kimchi, kapusta, cytryny...')}
                query={searchQuery}
                onChangeQuery={setSearchQuery}
                containerStyle={{ marginBottom: 10 }}
              />
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
            </View>

            <ScrollView
              contentContainerStyle={styles.stepModalScroll}
              keyboardShouldPersistTaps="handled"
            >
              {filteredRecipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.recipeCard}
                  onPress={() => {
                    setIsRecipesCatalogModalOpen(false);
                    setSelectedRecipe(recipe);
                  }}
                  activeOpacity={0.85}
                >
                  <View style={styles.recipeCardHeader}>
                    <Text style={styles.recipeCulture}>{recipe.culture}</Text>
                    <Badge label={`${recipe.defaultSalinityPercent}% soli`} variant="green" />
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
            </ScrollView>

            <View style={styles.stepModalFooter}>
              <TouchableOpacity
                style={styles.stepModalBackBtn}
                onPress={() => setIsRecipesCatalogModalOpen(false)}
              >
                <Text style={styles.stepModalBackBtnText}>← {t('Powrót')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.stepModalConfirmBtn}
                onPress={() => setIsRecipesCatalogModalOpen(false)}
              >
                <Text style={styles.stepModalConfirmBtnText}>
                  ✓ {t('Gotowe')}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/* ============================================================== */}
        {/* OKNO MODALNE: DRZEWO DIAGNOZY MIKROBIOLOGICZNEJ                 */}
        {/* ============================================================== */}
        <Modal
          visible={isDiagnosisModalOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsDiagnosisModalOpen(false)}
        >
          <SafeAreaView style={styles.stepModalSafeArea}>
            <View style={styles.stepModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepModalKicker}>{t('DOKTOR MIKROBIOLOGICZNY • KROK 1')}</Text>
                <Text style={styles.stepModalTitle}>
                  {t('Diagnoza Objawów Słoika')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.stepModalCloseIcon}
                onPress={() => setIsDiagnosisModalOpen(false)}
              >
                <Text style={styles.stepModalCloseIconText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.stepModalScroll}>
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
                    >
                      <Text style={styles.doctorResetText}>
                        {t('Zacznij diagnozę od nowa ↺')}
                      </Text>
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
                      🔬{' '}
                      {t(
                        activeDiagnosis.biologicalExplanation ||
                          activeDiagnosis.detailedCause ||
                          activeDiagnosis.shortExplanation
                      )}
                    </Text>
                  </View>

                  <View style={styles.actionBox}>
                    <Text style={styles.actionTitle}>🛠️ {t('Działanie ratunkowe:')}</Text>
                    <Text style={styles.actionText}>
                      {t(
                        activeDiagnosis.actionRequired ||
                          activeDiagnosis.actionSteps.join('\n')
                      )}
                    </Text>
                  </View>

                  {activeDiagnosis.tasteImpact && (
                    <Text style={styles.tasteImpactText}>
                      👅 {t('Wpływ na smak: ')}
                      {t(activeDiagnosis.tasteImpact)}
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
            </ScrollView>

            <View style={styles.stepModalFooter}>
              <TouchableOpacity
                style={styles.stepModalBackBtn}
                onPress={() => setIsDiagnosisModalOpen(false)}
              >
                <Text style={styles.stepModalBackBtnText}>← {t('Powrót')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.stepModalConfirmBtn}
                onPress={() => setIsDiagnosisModalOpen(false)}
              >
                <Text style={styles.stepModalConfirmBtnText}>
                  ✓ {t('Zatwierdź diagnozę')}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/* ============================================================== */}
        {/* OKNO MODALNE: KALKULATOR DOLEWKI SOLANKI                        */}
        {/* ============================================================== */}
        <Modal
          visible={isTopUpModalOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsTopUpModalOpen(false)}
        >
          <SafeAreaView style={styles.stepModalSafeArea}>
            <View style={styles.stepModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepModalKicker}>{t('DOKTOR MIKROBIOLOGICZNY • KROK 2')}</Text>
                <Text style={styles.stepModalTitle}>
                  {t('Kalkulator Dolewki Solanki')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.stepModalCloseIcon}
                onPress={() => setIsTopUpModalOpen(false)}
              >
                <Text style={styles.stepModalCloseIconText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.stepModalScroll}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.topUpBox}>
                <Text style={styles.topUpTitle}>
                  🌊 {t('Kalkulator Uzupełnienia Solanki (Brine Top-up)')}
                </Text>
                <Text style={styles.topUpDesc}>
                  {t(
                    'Warzywa wystają ponad zalewę? Uzupełnij sterylną solanką o identycznym stężeniu.'
                  )}
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
                    <Text style={styles.calcHighlight}>
                      {brineCalculation.saltGrams.toFixed(1)}g
                    </Text>
                    {t(' soli w ')}
                    <Text style={styles.calcHighlight}>{brineCalculation.waterMl}ml</Text>
                    {t(' ostudzonej, przegotowanej wody.')}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.stepModalFooter}>
              <TouchableOpacity
                style={styles.stepModalBackBtn}
                onPress={() => setIsTopUpModalOpen(false)}
              >
                <Text style={styles.stepModalBackBtnText}>← {t('Powrót')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.stepModalConfirmBtn}
                onPress={() => setIsTopUpModalOpen(false)}
              >
                <Text style={styles.stepModalConfirmBtnText}>
                  ✓ {t('Zatwierdź wyliczenie')}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/* ============================================================== */}
        {/* OKNO MODALNE: PROCEDURA RATUNKOWA KROK PO KROKU                 */}
        {/* ============================================================== */}
        <Modal
          visible={!!activeProcedure}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setActiveProcedureModalId(null)}
        >
          <SafeAreaView style={styles.stepModalSafeArea}>
            <View style={styles.stepModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepModalKicker}>{t('PROCEDURA RATUNKOWA')}</Text>
                <Text style={styles.stepModalTitle}>
                  {activeProcedure ? t(activeProcedure.title) : ''}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.stepModalCloseIcon}
                onPress={() => setActiveProcedureModalId(null)}
              >
                <Text style={styles.stepModalCloseIconText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.stepModalScroll}>
              {activeProcedure?.steps.map((st, idx) => (
                <View key={idx} style={styles.stepItemRow}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.stepContentText}>{t(st)}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.stepModalFooter}>
              <TouchableOpacity
                style={styles.stepModalBackBtn}
                onPress={() => setActiveProcedureModalId(null)}
              >
                <Text style={styles.stepModalBackBtnText}>← {t('Powrót')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.stepModalConfirmBtn}
                onPress={() => setActiveProcedureModalId(null)}
              >
                <Text style={styles.stepModalConfirmBtnText}>
                  ✓ {t('Gotowe')}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

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

        {/* MODAL ZŁOTYCH ZASAD KISZENIA */}
        <QuickStartGuideModal
          visible={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />

        {/* MODAL PRZEWODNIKA PO APLIKACJI */}
        <AppTourModal visible={isTourOpen} onClose={() => setIsTourOpen(false)} />
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
    paddingBottom: 32,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  headerTitleText: {
    ...theme.typography.heroTitle,
    flex: 1,
    flexShrink: 1,
    fontSize: 22,
    color: theme.colors.textPrimary,
    marginRight: 6,
  },
  tourHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.amberBrine,
    borderRadius: theme.borderRadius.md,
    flexShrink: 0,
  },
  tourHeaderBtnEmoji: {
    fontSize: 14,
  },
  tourHeaderBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.amberBrine,
  },
  tagline: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 3,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 4,
    marginBottom: 12,
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
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  checklistCard: {
    backgroundColor: theme.colors.bgCard,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  checklistHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.pickleGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  checklistTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  checklistSub: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  compactPreviewList: {
    gap: 6,
    marginBottom: 10,
  },
  compactRecipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  compactRecipeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  compactRecipeMeta: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  compactRecipeArrow: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.pickleGreenLight,
    marginLeft: 8,
  },
  summaryPillBox: {
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 10,
  },
  summaryPillLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.pickleGreenLight,
    letterSpacing: 0.6,
  },
  summaryPillValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 3,
  },
  primaryModalBtn: {
    backgroundColor: theme.colors.pickleGreen,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryModalBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  secondaryModalBtn: {
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.amberBrine,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 11,
    alignItems: 'center',
  },
  secondaryModalBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.amberBrine,
  },
  stepModalSafeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  stepModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.bgCard,
  },
  stepModalKicker: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.pickleGreenLight,
    letterSpacing: 0.8,
  },
  stepModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  stepModalCloseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.bgCardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepModalCloseIconText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },
  stepModalScroll: {
    padding: 16,
    paddingBottom: 32,
  },
  stepModalFooter: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.bgCard,
  },
  stepModalBackBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  stepModalBackBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  stepModalConfirmBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.pickleGreen,
    alignItems: 'center',
  },
  stepModalConfirmBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
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
  recipeCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    marginBottom: 10,
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
    color: theme.colors.textSecondary,
  },
  diagnosisResultCard: {
    padding: 16,
    borderWidth: 2,
  },
  safeCard: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: '#132419',
  },
  warningCard: {
    borderColor: theme.colors.amberBrine,
    backgroundColor: '#261E10',
  },
  dangerCard: {
    borderColor: theme.colors.danger,
    backgroundColor: '#2A1215',
  },
  resultHeader: {
    marginBottom: 12,
  },
  resultBadge: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  resultBiology: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
  },
  actionBox: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 12,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 10,
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
    lineHeight: 19,
  },
  tasteImpactText: {
    fontSize: 12,
    color: theme.colors.amberBrine,
    marginBottom: 12,
  },
  newDiagnosisBtn: {
    backgroundColor: theme.colors.bgCardElevated,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  newDiagnosisBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  topUpBox: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: 16,
  },
  topUpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  topUpDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  topUpRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
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
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  calcResultBox: {
    backgroundColor: theme.colors.pickleGreenMuted,
    padding: 12,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.pickleGreen,
  },
  calcResultText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  calcHighlight: {
    fontWeight: '800',
    color: theme.colors.pickleGreenLight,
  },
  recipeModalContainer: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  useInRitualHeaderBtn: {
    backgroundColor: theme.colors.pickleGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  useInRitualHeaderText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  recipeModalContent: {
    padding: 16,
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
    color: theme.colors.pickleGreenLight,
  },
  metricMiniLbl: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  secretBox: {
    backgroundColor: '#241E12',
    borderWidth: 1,
    borderColor: theme.colors.amberBrine,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    marginBottom: 16,
  },
  secretTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.amberBrine,
    marginBottom: 6,
  },
  secretItem: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 19,
    marginBottom: 4,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  ingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  ingBullet: {
    color: theme.colors.pickleGreen,
    marginRight: 8,
    fontSize: 16,
  },
  ingNameModal: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  ingAmountModal: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.amberBrine,
  },
  stepItemRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  stepContentText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  bigUseInRitualBtn: {
    backgroundColor: theme.colors.pickleGreen,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: 20,
  },
  bigUseInRitualText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
