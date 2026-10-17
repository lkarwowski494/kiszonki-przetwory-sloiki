// ============================================================================
// Słoik (Jarwise) — Rytuał 2.0 (Kompaktowa Checklista 4 Kroków + Okna Modalne)
// Każdy krok procesu jest zwięzłą kartą na jednym ekranie, a wybór i edycja
// parametrów otwierają się w dedykowanym oknie z przyciskami Powrót / Zatwierdź.
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
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { calculateBrine } from '../../src/core/brine/brine-calculator';
import { scheduleFermentationAlerts } from '../../src/core/notifications/kitchen-notifications';
import { calculateFermentationTimeline } from '../../src/core/timeline/fermentation-timeline';
import { dbStore, CustomEquipmentRecord, BatchRecord } from '../../src/data/db/database';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { Badge } from '../../src/ui/components/Badge';
import { SacredNumbersBar } from '../../src/ui/components/SacredNumbersBar';
import { CraftOnboardingModal, CraftProfileId } from '../../src/ui/components/CraftOnboardingModal';
import { QuickStartGuideModal } from '../../src/ui/components/QuickStartGuideModal';
import { AppTourModal } from '../../src/ui/components/AppTourModal';
import { CustomEquipmentModal } from '../../src/ui/components/CustomEquipmentModal';
import { CustomRecipeModal } from '../../src/ui/components/CustomRecipeModal';
import { CraftProcedureModal } from '../../src/ui/components/CraftProcedureModal';
import { useAppAccess } from '../../src/core/access/app-access';
import { PaywallModal } from '../../src/ui/components/PaywallModal';
import { t, useLang } from '../../src/lib/i18n';
import {
  FREEFORM_PRODUCE,
  composeFreeformRecipe,
} from '../../src/core/recipes/freeform-composer';
import { MASTER_RECIPES } from '../../src/core/recipes/recipes-data';
import { MasterRecipe, RecipeCategory } from '../../src/core/types';
import { SearchField, normSearch } from '../../src/ui/components/SearchField';
import {
  useUnitSystem,
  formatProduceWeight,
  formatSaltWeight,
  formatBrineVolume,
} from '../../src/core/unit-converter';

export type ProduceFilterCategory = 'all' | 'leafy' | 'veggies' | 'root' | 'aroma';

export const PRODUCE_CATEGORIES: { id: ProduceFilterCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'Wszystkie', icon: '🌟' },
  { id: 'leafy', label: 'Kapusty & Liście', icon: '🥬' },
  { id: 'veggies', label: 'Warzywa', icon: '🥒' },
  { id: 'root', label: 'Korzenie', icon: '🥕' },
  { id: 'aroma', label: 'Aromaty & Inne', icon: '🧄' },
];

export const getProduceCategory = (id: string): 'leafy' | 'veggies' | 'root' | 'aroma' => {
  if (['cabbage_white', 'cabbage_red', 'cabbage_napa'].includes(id)) return 'leafy';
  if (
    [
      'cucumber',
      'bell_pepper',
      'hot_pepper',
      'cauliflower',
      'radish',
      'tomato',
      'zucchini',
      'green_beans',
    ].includes(id)
  )
    return 'veggies';
  if (['carrot', 'beet', 'ginger', 'pumpkin'].includes(id)) return 'root';
  return 'aroma';
};

const CLASSIC_RECIPE_IDS = new Set([
  'REC-01',
  'REC-02',
  'REC-03',
  'REC-04',
  'REC-05',
  'REC-06',
  'REC-07',
  'REC-08',
  'REC-09',
  'REC-10',
  'REC-11',
  'REC-12',
]);

const RECIPE_CATEGORIES: { label: string; value: RecipeCategory | 'all' | 'classics' }[] = [
  { label: '⭐ Klasyki', value: 'classics' },
  { label: 'Wszystkie', value: 'all' },
  { label: 'Polska', value: 'poland_central_europe' },
  { label: 'Azja', value: 'east_asia' },
  { label: 'Bliski Wschód', value: 'mideast_maghreb_india' },
  { label: 'Ameryki', value: 'americas_mediterranean' },
  { label: 'Spiżarnia', value: 'sweet_preserves' },
  { label: 'Napoje', value: 'drinks_vinegars' },
];

const QUICK_HERB_CHIPS = [
  'Czosnek (3 ząbki)',
  'Baldach kopru',
  'Korzeń chrzanu',
  'Liść dębu / wiśni',
  'Gorczyca biała',
  'Ziele angielskie',
  'Liść laurowy',
  'Kminek cały',
  'Imbir świeży',
  'Płatki chili / Gochugaru',
];

export default function RitualScreen() {
  const router = useRouter();
  const { canCreate } = useAppAccess();
  useLang();
  const unitSystem = useUnitSystem();

  // Onboarding i przewodniki
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [, setActiveProfile] = useState<CraftProfileId>(
    dbStore.getOnboardingProfile() || 'classic_pickles'
  );
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isCustomRecipeModalOpen, setIsCustomRecipeModalOpen] = useState(false);
  const [isProcedureModalOpen, setIsProcedureModalOpen] = useState(false);

  // Nowe okna wyboru dla poszczególnych kroków (żeby nie rozciągać ekranu głównego)
  const [isFreeformModalOpen, setIsFreeformModalOpen] = useState(false);
  const [isRecipesModalOpen, setIsRecipesModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);

  // Stan KROKU 1: Co kisimy? ('freeform' lub 'recipe')
  const [ritualMode, setRitualMode] = useState<'freeform' | 'recipes'>('freeform');
  const [selectedProduce, setSelectedProduce] = useState<string[]>(['cucumber']);
  const [produceCategory, setProduceCategory] = useState<ProduceFilterCategory>('all');
  const [recipeCategory, setRecipeCategory] = useState<RecipeCategory | 'all' | 'classics'>('classics');
  const [recipeSearch, setRecipeSearch] = useState<string>('');
  const [selectedMasterRecipeId, setSelectedMasterRecipeId] = useState<string>('REC-01');

  // Stan parametrów nastawu (w pełni edytowalny zarowno dla Stylu Dowolnego jak i Receptury!)
  const [produceWeightNum, setProduceWeightNum] = useState<number>(1000);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customSalinityPct, setCustomSalinityPct] = useState<number>(2.0);
  const [isDrySaltingCustom, setIsDrySaltingCustom] = useState<boolean>(false);
  const [customFermentationDays, setCustomFermentationDays] = useState<number>(4);
  const [customHerbsText, setCustomHerbsText] = useState<string>('');
  const [hasCustomizedParams, setHasCustomizedParams] = useState<boolean>(false);

  // Sprzęt
  const [equipmentList, setEquipmentList] = useState<CustomEquipmentRecord[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('eq_weck_1000');

  useEffect(() => {
    const profile = dbStore.getOnboardingProfile();
    if (profile) setActiveProfile(profile);

    const eq = dbStore.getCustomEquipment();
    setEquipmentList(eq);
    if (eq.length > 0) setSelectedEquipmentId(eq[0].id);
  }, []);

  const freeformSuggestion = composeFreeformRecipe(selectedProduce, produceWeightNum);
  const allAvailableRecipes = [...dbStore.getCustomRecipes(), ...MASTER_RECIPES];
  const selectedMasterRecipe: MasterRecipe =
    allAvailableRecipes.find((r) => r.id === selectedMasterRecipeId) || MASTER_RECIPES[0];

  // Wyliczenie aktywnych parametrów (uwzględniające ręczne modyfikacje użytkownika)
  const activeSalinity = hasCustomizedParams
    ? customSalinityPct
    : ritualMode === 'freeform'
    ? freeformSuggestion.recommendedSalinityPercent
    : selectedMasterRecipe.defaultSalinityPercent;

  const isDrySalting = hasCustomizedParams
    ? isDrySaltingCustom
    : ritualMode === 'freeform'
    ? freeformSuggestion.isDrySalting
    : selectedMasterRecipe.method === 'sweet_preserve' ||
      selectedMasterRecipe.title.toLowerCase().includes('kapust') ||
      selectedMasterRecipe.title.toLowerCase().includes('kimchi') ||
      selectedMasterRecipe.title.toLowerCase().includes('cytryn');

  const activeFermentationDays = hasCustomizedParams
    ? customFermentationDays
    : ritualMode === 'freeform'
    ? freeformSuggestion.fermentationDays
    : selectedMasterRecipe.fermentationDays;

  const waterRatio = isDrySalting ? 0 : ritualMode === 'freeform' ? 0.6 : 0.8;

  const brineCalculation = calculateBrine({
    method: isDrySalting ? 'dry_salting' : 'total_mass',
    targetSalinityPercent: activeSalinity,
    produceWeightGrams: produceWeightNum,
    waterWeightGrams: isDrySalting ? 0 : Math.round(produceWeightNum * waterRatio),
  });

  const selectedEquipment =
    equipmentList.find((e) => e.id === selectedEquipmentId) || equipmentList[0];

  const activeRecipeTitle =
    customTitle.trim() ||
    (ritualMode === 'freeform' ? freeformSuggestion.title : selectedMasterRecipe.title);

  const activeRecipeCulture =
    ritualMode === 'freeform' ? t('Styl Dowolny') : selectedMasterRecipe.culture;

  const activeRecipeHerbs =
    customHerbsText.trim() ||
    (ritualMode === 'freeform'
      ? freeformSuggestion.suggestedHerbs.join(', ')
      : selectedMasterRecipe.ingredients.map((i) => `${i.name} (${i.amount})`).join(', '));

  const activeRecipeSteps =
    ritualMode === 'freeform' ? freeformSuggestion.steps : selectedMasterRecipe.steps;

  const activeRecipeCraftTips =
    ritualMode === 'freeform'
      ? freeformSuggestion.craftTips
      : selectedMasterRecipe.crispnessSecrets;

  // Przełączanie warzyw w oknie Stylu Dowolnego
  const handleToggleProduce = (id: string) => {
    setSelectedProduce((prev) => {
      const next = prev.includes(id)
        ? prev.length === 1
          ? prev
          : prev.filter((p) => p !== id)
        : [...prev, id];
      const nextSuggestion = composeFreeformRecipe(next, produceWeightNum);
      if (!hasCustomizedParams) {
        setCustomSalinityPct(nextSuggestion.recommendedSalinityPercent);
        setIsDrySaltingCustom(nextSuggestion.isDrySalting);
        setCustomFermentationDays(nextSuggestion.fermentationDays);
        setCustomHerbsText(nextSuggestion.suggestedHerbs.join(', '));
      }
      return next;
    });
  };

  // Otwarcie okna Stylu Dowolnego z inicjalizacją pól edycji
  const openFreeformModal = () => {
    setRitualMode('freeform');
    if (!hasCustomizedParams) {
      setCustomSalinityPct(freeformSuggestion.recommendedSalinityPercent);
      setIsDrySaltingCustom(freeformSuggestion.isDrySalting);
      setCustomFermentationDays(freeformSuggestion.fermentationDays);
      setCustomHerbsText(freeformSuggestion.suggestedHerbs.join(', '));
    }
    setIsFreeformModalOpen(true);
  };

  // Otwarcie okna Gotowych Receptur
  const openRecipesModal = () => {
    setIsRecipesModalOpen(true);
  };

  // Wybór gotowej receptury w oknie modalnym
  const handlePickMasterRecipeInModal = (recipe: MasterRecipe) => {
    setRitualMode('recipes');
    setSelectedMasterRecipeId(recipe.id);
    setCustomTitle(recipe.title);
    setCustomSalinityPct(recipe.defaultSalinityPercent);
    setProduceWeightNum(recipe.defaultProduceWeightGrams);
    const isDry =
      recipe.method === 'sweet_preserve' ||
      recipe.title.toLowerCase().includes('kapust') ||
      recipe.title.toLowerCase().includes('kimchi') ||
      recipe.title.toLowerCase().includes('cytryn');
    setIsDrySaltingCustom(isDry);
    setCustomFermentationDays(recipe.fermentationDays);
    setCustomHerbsText(recipe.ingredients.map((i) => `${i.name} (${i.amount})`).join(', '));
    setHasCustomizedParams(true);
  };

  const filteredMasterRecipes = allAvailableRecipes.filter((r) => {
    const matchesCat =
      recipeCategory === 'all'
        ? true
        : recipeCategory === 'classics'
        ? CLASSIC_RECIPE_IDS.has(r.id) || r.id.startsWith('CUSTOM')
        : r.category === recipeCategory;
    const q = normSearch(recipeSearch);
    const matchesSearch =
      !q ||
      normSearch(r.title).includes(q) ||
      normSearch(r.culture).includes(q) ||
      normSearch(r.subtitle).includes(q);
    return matchesCat && matchesSearch;
  });

  const handleAddWeight = (deltaGrams: number) => {
    setProduceWeightNum((prev) => Math.max(100, prev + deltaGrams));
  };

  const handleAdjustSalinity = (delta: number) => {
    setHasCustomizedParams(true);
    setCustomSalinityPct((prev) => {
      const base = hasCustomizedParams ? prev : activeSalinity;
      return Math.round(Math.min(8.0, Math.max(0.5, base + delta)) * 10) / 10;
    });
  };

  const handleAdjustDays = (delta: number) => {
    setHasCustomizedParams(true);
    setCustomFermentationDays((prev) => {
      const base = hasCustomizedParams ? prev : activeFermentationDays;
      return Math.max(1, Math.min(90, base + delta));
    });
  };

  const handleToggleHerbChip = (herb: string) => {
    setHasCustomizedParams(true);
    const current = (customHerbsText || activeRecipeHerbs)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (current.includes(herb)) {
      setCustomHerbsText(current.filter((h) => h !== herb).join(', '));
    } else {
      setCustomHerbsText([...current, herb].join(', '));
    }
  };

  // Zapis słoika do bazy
  const handleSaveBatch = () => {
    if (!canCreate) {
      setIsPaywallOpen(true);
      return;
    }

    const title = activeRecipeTitle;
    const recipeId = ritualMode === 'recipes' ? selectedMasterRecipe.id : 'CUSTOM_FREEFORM';
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newBatch: BatchRecord = {
      id: batchId,
      recipeId,
      recipeTitle: title,
      culture: activeRecipeCulture,
      method: isDrySalting ? 'dry_salting' : 'lacto_fermentation',
      produceWeightGrams: produceWeightNum,
      waterWeightGrams: brineCalculation.waterGrams,
      saltWeightGrams: brineCalculation.saltGrams,
      salinityPercent: activeSalinity,
      targetFermentationDays: activeFermentationDays,
      status: 'fermenting',
      qrCodeUri: `sloik://batch/${batchId}`,
      createdAt: Date.now(),
      startedAt: Date.now(),
      notes: `Sprzęt: ${selectedEquipment?.name || 'Słoik 1000 ml'} | Przyprawy: ${activeRecipeHerbs}`,
    };
    dbStore.saveBatch(newBatch);

    const timeline = calculateFermentationTimeline(
      {
        id: recipeId,
        title,
        subtitle: '',
        culture: newBatch.culture,
        category: 'poland_central_europe',
        method: (newBatch.method === 'dry_salting' ? 'lacto_fermentation' : newBatch.method) as any,
        defaultProduceWeightGrams: newBatch.produceWeightGrams,
        defaultSalinityPercent: newBatch.salinityPercent,
        fermentationDays: newBatch.targetFermentationDays,
        shelfLifeMonths: 12,
        recommendedJarType: selectedEquipment?.name || 'Słoik 1000 ml',
        ingredients: [],
        steps: [],
        crispnessSecrets: [],
        sensoryMilestones: [],
        commonMistakes: [],
      },
      newBatch.startedAt
    );
    scheduleFermentationAlerts(newBatch.id, timeline).catch(() => {});

    Alert.alert(
      t('Partia zapisana! 🫙'),
      t('Nastawiono "{title}". Słoik trafił na Twój blat w Dojrzewalni.', { title }),
      [
        { text: t('Świetnie!'), style: 'default' },
        {
          text: t('Przejdź do Dojrzewalni →'),
          onPress: () => router.push('/(tabs)/dojrzewalnia'),
        },
      ]
    );
  };

  const saltTeaspoons = (brineCalculation.saltGrams / 6).toFixed(1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Baner odzyskiwania uszkodzonego stanu */}
        {dbStore.isCorrupt() && (
          <View style={styles.corruptBanner} testID="corrupt-recovery-banner">
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.corruptBannerTitle}>
                {t('⚠️ Wykryto problem ze stanem danych')}
              </Text>
              <Text style={styles.corruptBannerSubtitle}>
                {t('Twoje dane zabezpieczono w kopii awaryjnej. Możesz przywrócić kopię w Ustawieniach.')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.corruptBannerButton}
              onPress={() => router.push('/settings')}
              accessibilityRole="button"
              accessibilityLabel={t('Otwórz Ustawienia kopii zapasowych')}
            >
              <Text style={styles.corruptBannerButtonText}>{t('Kopie →')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Nagłówek Rytuału — Czysty prawy górny róg */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitleText} numberOfLines={1}>
              {t('Słoik (Jarwise) 🫙')}
            </Text>
            <TouchableOpacity
              onPress={() => setIsTourOpen(true)}
              style={styles.tourHeaderBtn}
              accessibilityLabel={t('Przewodnik po funkcjach aplikacji')}
              accessibilityRole="button"
              hitSlop={theme.hitSlop}
            >
              <Text style={styles.iconButtonEmoji}>🧭</Text>
              <Text style={styles.tourHeaderBtnText}>{t('Jak działa aplikacja?')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.tagline}>
            {t('Checklista nastawu: przejrzyj 4 kroki i edytuj każdy w osobnym oknie.')}
          </Text>
        </View>

        {/* ZŁOTE ZASADY KISZENIA — ZWARTY BANER NA GÓRZE */}
        <TouchableOpacity
          style={styles.goldenRulesBanner}
          onPress={() => setIsGuideOpen(true)}
          activeOpacity={0.85}
          accessibilityLabel={t('Złote Zasady Kiszenia: 5 Reguł Mistrza')}
        >
          <Text style={styles.goldenRulesEmoji}>📜</Text>
          <View style={styles.goldenRulesTextCol}>
            <Text style={styles.goldenRulesTitle}>
              {t('Złote Zasady Kiszenia: 5 Reguł Mistrza')}
            </Text>
            <Text style={styles.goldenRulesSubtitle} numberOfLines={1}>
              {t('Sól 2–3%, brak tlenu, temp. 18–22°C, odgazowanie, czysty słoik.')}
            </Text>
          </View>
          <Text style={styles.goldenRulesArrow}>{t('Otwórz →')}</Text>
        </TouchableOpacity>

        {/* ============================================================== */}
        {/* KARTA CHECKLISTY 1: CO DZISIAJ KISIMY?                          */}
        {/* ============================================================== */}
        <KitchenCard style={styles.checklistCard}>
          <View style={styles.checklistHeaderRow}>
            <View style={styles.stepCheckBadge}>
              <Text style={styles.stepCheckBadgeText}>1</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.checklistStepTitle}>{t('Krok 1: Co dzisiaj kisimy?')}</Text>
              <Text style={styles.checklistStepSub}>
                {t('Wybierz warzywa w Stylu Dowolnym lub gotową recepturę w nowym oknie.')}
              </Text>
            </View>
            <Badge
              label={ritualMode === 'freeform' ? t('Styl Dowolny') : t('Receptura')}
              variant="green"
            />
          </View>

          {/* Podsumowanie aktualnie wybranego nastawu */}
          <View style={styles.currentSummaryBox}>
            <Text style={styles.currentSummaryLabel}>{t('AKTYWNY NASTAW:')}</Text>
            <Text style={styles.currentSummaryTitle}>{activeRecipeTitle}</Text>
            <View style={styles.currentSummaryPills}>
              <Text style={styles.currentSummaryMeta}>
                {isDrySalting ? `🥬 ${t('Solenie na sucho')}` : `💧 ${t('Solanka wodna')}`}
              </Text>
              <Text style={styles.currentSummaryDot}>•</Text>
              <Text style={styles.currentSummaryMeta}>
                🧂 {activeSalinity}% {t('soli')}
              </Text>
              <Text style={styles.currentSummaryDot}>•</Text>
              <Text style={styles.currentSummaryMeta}>
                ⏳ {activeFermentationDays} {t('dni')}
              </Text>
            </View>
          </View>

          {/* 2 Przyciski otwierające osobne okna wyboru */}
          <View style={styles.twoModalButtonsRow}>
            <TouchableOpacity
              style={[
                styles.modalTriggerBtn,
                ritualMode === 'freeform' && styles.modalTriggerBtnActive,
              ]}
              onPress={openFreeformModal}
              activeOpacity={0.85}
            >
              <Text style={styles.modalTriggerEmoji}>🧪</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.modalTriggerTitle,
                    ritualMode === 'freeform' && styles.modalTriggerTitleActive,
                  ]}
                >
                  {t('Styl Dowolny')}
                </Text>
                <Text style={styles.modalTriggerSub}>
                  {t('Zaznacz warzywa i parametry →')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalTriggerBtn,
                ritualMode === 'recipes' && styles.modalTriggerBtnActive,
              ]}
              onPress={openRecipesModal}
              activeOpacity={0.85}
            >
              <Text style={styles.modalTriggerEmoji}>📜</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.modalTriggerTitle,
                    ritualMode === 'recipes' && styles.modalTriggerTitleActive,
                  ]}
                >
                  {t('Gotowe Receptury')}
                </Text>
                <Text style={styles.modalTriggerSub}>
                  {t('Wybierz z 155 przepisów →')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </KitchenCard>

        {/* ============================================================== */}
        {/* KARTA CHECKLISTY 2: WAGA SUROWCA I PARAMETRY SŁOIKA             */}
        {/* ============================================================== */}
        <KitchenCard style={styles.checklistCard}>
          <View style={styles.checklistHeaderRow}>
            <View style={styles.stepCheckBadge}>
              <Text style={styles.stepCheckBadgeText}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.checklistStepTitle}>{t('Waga Surowca na Szalce')}</Text>
              <Text style={styles.checklistStepSub}>
                {t('Krok 2: Waga warzyw, rozmiar słoika oraz parametry solanki.')}
              </Text>
            </View>
          </View>

          <View style={styles.compactMetricsRow}>
            <View style={styles.compactMetricItem}>
              <Text style={styles.compactMetricLabel}>{t('WAGA WARZYW')}</Text>
              <Text style={styles.compactMetricValue}>
                {formatProduceWeight(produceWeightNum, unitSystem)}
              </Text>
            </View>
            <View style={styles.compactMetricDivider} />
            <View style={styles.compactMetricItem}>
              <Text style={styles.compactMetricLabel}>{t('NACZYNIE')}</Text>
              <Text style={styles.compactMetricValue} numberOfLines={1}>
                {selectedEquipment ? `${selectedEquipment.jarVolumeMl} ml` : '1000 ml'}
              </Text>
            </View>
            <View style={styles.compactMetricDivider} />
            <View style={styles.compactMetricItem}>
              <Text style={styles.compactMetricLabel}>{t('STĘŻENIE / CZAS')}</Text>
              <Text style={styles.compactMetricValue}>
                {activeSalinity}% · {activeFermentationDays}d
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.openStepWindowBtn}
            onPress={() => setIsWeightModalOpen(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.openStepWindowBtnText}>
              ⚖️ {t('Zmień wagę surowca, słoik i parametry nastawu →')}
            </Text>
          </TouchableOpacity>
        </KitchenCard>

        {/* ============================================================== */}
        {/* KARTA CHECKLISTY 3: GRAMATURA SKŁADNIKÓW (ŚWIĘTE PROPORCJE)     */}
        {/* ============================================================== */}
        <KitchenCard style={styles.checklistCard}>
          <View style={styles.checklistHeaderRow}>
            <View style={styles.stepCheckBadge}>
              <Text style={styles.stepCheckBadgeText}>3</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.checklistStepTitle}>
                {t('Krok 3: Święte Proporcje dla Twojej Wagi')}
              </Text>
              <Text style={styles.checklistStepSub}>
                {t('Przeliczona gramatura składników dla wybranego przepisu i ilości surowca.')}
              </Text>
            </View>
          </View>

          <SacredNumbersBar
            produceWeightGrams={produceWeightNum}
            waterWeightGrams={brineCalculation.waterGrams}
            saltWeightGrams={brineCalculation.saltGrams}
            salinityPercent={activeSalinity}
            isDrySalting={isDrySalting}
          />

          <View style={styles.compactHerbsRow}>
            <Text style={styles.compactHerbsText} numberOfLines={2}>
              🌿 <Text style={{ fontWeight: '700' }}>{t('Przyprawy:')}</Text> {activeRecipeHerbs}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.openStepWindowBtn}
            onPress={() => setIsIngredientsModalOpen(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.openStepWindowBtnText}>
              🌿 {t('Podgląd gramatury i edycja przypraw w nowym oknie →')}
            </Text>
          </TouchableOpacity>
        </KitchenCard>

        {/* ============================================================== */}
        {/* KARTA CHECKLISTY 4: PROCEDURA NASTAWU I ZAPIS SŁOIKA            */}
        {/* ============================================================== */}
        <KitchenCard style={styles.checklistCard}>
          <View style={styles.checklistHeaderRow}>
            <View style={styles.stepCheckBadge}>
              <Text style={styles.stepCheckBadgeText}>4</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.checklistStepTitle}>
                {t('Krok 4: Procedura i zapis słoika')}
              </Text>
              <Text style={styles.checklistStepSub}>
                {t('Otwórz okno krok po kroku z automatycznym stoperem lub zapisz od razu.')}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.procedureLaunchBtn}
            onPress={() => setIsProcedureModalOpen(true)}
            activeOpacity={0.85}
            accessibilityLabel={t('Zacznij procedurę nastawu krok po kroku')}
          >
            <View style={styles.procedureLaunchLeft}>
              <Text style={styles.procedureLaunchEmoji}>🚀</Text>
              <View style={styles.procedureLaunchTextCol}>
                <Text style={styles.procedureLaunchTitle}>
                  {t('Zacznij procedurę nastawu krok po kroku →')}
                </Text>
                <Text style={styles.procedureLaunchSub}>
                  {t('Nowe okno: duże kroki, auto-stoper oraz przycisk Zakończ i zapisz słoik.')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainStartButton}
            onPress={handleSaveBatch}
            activeOpacity={0.85}
            accessibilityLabel={t('Szybki zapis słoika (bez asystenta)')}
          >
            <Text style={styles.mainStartButtonText}>
              {t('🫙 Szybki zapis słoika (bez asystenta)')}
            </Text>
          </TouchableOpacity>
        </KitchenCard>

        {/* ============================================================== */}
        {/* OKNO MODALNE 1A: KREATOR STYLU DOWOLNEGO (WARZYWA + PARAMETRY)  */}
        {/* ============================================================== */}
        <Modal
          visible={isFreeformModalOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsFreeformModalOpen(false)}
        >
          <SafeAreaView style={styles.stepModalSafeArea}>
            <View style={styles.stepModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepModalKicker}>{t('KROK 1 • STYL DOWOLNY')}</Text>
                <Text style={styles.stepModalTitle}>
                  {t('Zaznacz warzywa i dostosuj parametry')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.stepModalCloseIcon}
                onPress={() => setIsFreeformModalOpen(false)}
                hitSlop={theme.hitSlop}
              >
                <Text style={styles.stepModalCloseIconText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.stepModalScroll}
              keyboardShouldPersistTaps="handled"
            >
              {/* SEKCJA A: ZAZNACZ WARZYWA */}
              <Text style={styles.modalSectionHeading}>
                1. {t('Jakie warzywa masz na blacie?')}
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.produceCategoryScroll}
              >
                {PRODUCE_CATEGORIES.map((cat) => {
                  const isActive = produceCategory === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.produceCatChip,
                        isActive && styles.produceCatChipActive,
                      ]}
                      onPress={() => setProduceCategory(cat.id)}
                    >
                      <Text style={styles.produceCatIcon}>{cat.icon}</Text>
                      <Text
                        style={[
                          styles.produceCatText,
                          isActive && styles.produceCatTextActive,
                        ]}
                      >
                        {t(cat.label)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.produceGrid}>
                {FREEFORM_PRODUCE.filter(
                  (p) => produceCategory === 'all' || getProduceCategory(p.id) === produceCategory
                ).map((prod) => {
                  const isSelected = selectedProduce.includes(prod.id);
                  return (
                    <TouchableOpacity
                      key={prod.id}
                      style={[styles.produceChip, isSelected && styles.produceChipSelected]}
                      onPress={() => handleToggleProduce(prod.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={{ fontSize: 16 }}>{prod.emoji}</Text>
                      <Text
                        style={[
                          styles.produceChipText,
                          isSelected && styles.produceChipTextSelected,
                        ]}
                      >
                        {t(prod.name)}
                      </Text>
                      {isSelected && <Text style={styles.produceCheck}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* SEKCJA B: EDYCJA PARAMETRÓW AUTORSKIEGO NASTAWU */}
              <Text style={[styles.modalSectionHeading, { marginTop: 18 }]}>
                2. {t('Dostosuj parametry autorskiego nastawu')}
              </Text>

              <KitchenCard style={styles.modalEditCard}>
                <Text style={styles.modalFieldLabel}>{t('Nazwa Twojego nastawu:')}</Text>
                <TextInput
                  style={styles.modalTextInput}
                  value={customTitle}
                  onChangeText={(txt) => {
                    setHasCustomizedParams(true);
                    setCustomTitle(txt);
                  }}
                  placeholder={freeformSuggestion.title}
                  placeholderTextColor={theme.colors.textMuted}
                />

                <Text style={[styles.modalFieldLabel, { marginTop: 12 }]}>
                  {t('Metoda kiszenia:')}
                </Text>
                <View style={styles.methodToggleRow}>
                  <TouchableOpacity
                    style={[
                      styles.methodOptionBtn,
                      !isDrySalting && styles.methodOptionBtnActive,
                    ]}
                    onPress={() => {
                      setHasCustomizedParams(true);
                      setIsDrySaltingCustom(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.methodOptionText,
                        !isDrySalting && styles.methodOptionTextActive,
                      ]}
                    >
                      💧 {t('Solanka wodna (Zalewa)')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.methodOptionBtn,
                      isDrySalting && styles.methodOptionBtnActive,
                    ]}
                    onPress={() => {
                      setHasCustomizedParams(true);
                      setIsDrySaltingCustom(true);
                    }}
                  >
                    <Text
                      style={[
                        styles.methodOptionText,
                        isDrySalting && styles.methodOptionTextActive,
                      ]}
                    >
                      🥬 {t('Solenie na sucho (Własny sok)')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.modalFieldLabel, { marginTop: 12 }]}>
                  {t('Stężenie soli (%):')}
                </Text>
                <View style={styles.stepperControlRow}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleAdjustSalinity(-0.5)}
                  >
                    <Text style={styles.stepperBtnText}>-0.5%</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValueText}>{activeSalinity.toFixed(1)}%</Text>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleAdjustSalinity(0.5)}
                  >
                    <Text style={styles.stepperBtnText}>+0.5%</Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.modalFieldLabel, { marginTop: 12 }]}>
                  {t('Docelowy czas fermentacji (dni):')}
                </Text>
                <View style={styles.stepperControlRow}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleAdjustDays(-1)}
                  >
                    <Text style={styles.stepperBtnText}>-1 {t('dzień')}</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValueText}>
                    {activeFermentationDays} {t('dni')}
                  </Text>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleAdjustDays(1)}
                  >
                    <Text style={styles.stepperBtnText}>+1 {t('dzień')}</Text>
                  </TouchableOpacity>
                </View>
              </KitchenCard>
            </ScrollView>

            {/* DOLNY PASEK AKCJI OKNA: POWRÓT / ZATWIERDŹ */}
            <View style={styles.stepModalFooter}>
              <TouchableOpacity
                style={styles.stepModalBackBtn}
                onPress={() => setIsFreeformModalOpen(false)}
              >
                <Text style={styles.stepModalBackBtnText}>← {t('Powrót')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.stepModalConfirmBtn}
                onPress={() => {
                  setRitualMode('freeform');
                  setIsFreeformModalOpen(false);
                }}
              >
                <Text style={styles.stepModalConfirmBtnText}>
                  ✓ {t('Zatwierdź wybór')}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/* ============================================================== */}
        {/* OKNO MODALNE 1B: KATALOG GOTOWYCH RECEPTUR (155)                */}
        {/* ============================================================== */}
        <Modal
          visible={isRecipesModalOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsRecipesModalOpen(false)}
        >
          <SafeAreaView style={styles.stepModalSafeArea}>
            <View style={styles.stepModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepModalKicker}>{t('KROK 1 • GOTOWE RECEPTURY')}</Text>
                <Text style={styles.stepModalTitle}>
                  {t('Wybierz przepis z katalogu (155)')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.stepModalCloseIcon}
                onPress={() => setIsRecipesModalOpen(false)}
                hitSlop={theme.hitSlop}
              >
                <Text style={styles.stepModalCloseIconText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.recipeCatScroll}
              >
                {RECIPE_CATEGORIES.map((cat) => {
                  const isActive = recipeCategory === cat.value;
                  return (
                    <TouchableOpacity
                      key={cat.value}
                      style={[styles.recipeCatChip, isActive && styles.recipeCatChipActive]}
                      onPress={() => setRecipeCategory(cat.value)}
                    >
                      <Text
                        style={[
                          styles.recipeCatChipText,
                          isActive && styles.recipeCatChipTextActive,
                        ]}
                      >
                        {t(cat.label)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <SearchField
                query={recipeSearch}
                onChangeQuery={setRecipeSearch}
                placeholder={t('Szukaj wśród 155 receptur...')}
              />

              <TouchableOpacity
                style={styles.addOwnRecipeInlineBtn}
                onPress={() => {
                  setIsRecipesModalOpen(false);
                  setIsCustomRecipeModalOpen(true);
                }}
              >
                <Text style={styles.addOwnRecipeInlineText}>
                  + {t('Stwórz własną recepturę krok po kroku')}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.stepModalScroll}
              keyboardShouldPersistTaps="handled"
            >
              {filteredMasterRecipes.slice(0, 40).map((recipe) => {
                const isSelected =
                  ritualMode === 'recipes' && selectedMasterRecipeId === recipe.id;
                return (
                  <TouchableOpacity
                    key={recipe.id}
                    style={[
                      styles.modalRecipeListItem,
                      isSelected && styles.modalRecipeListItemSelected,
                    ]}
                    onPress={() => handlePickMasterRecipeInModal(recipe)}
                    activeOpacity={0.85}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.recipeCulture}>{recipe.culture}</Text>
                      <Text style={styles.modalRecipeTitle}>{recipe.title}</Text>
                      <Text style={styles.modalRecipeSubtitle} numberOfLines={2}>
                        {recipe.subtitle}
                      </Text>
                      <View style={styles.modalRecipeBadges}>
                        <Badge label={`${recipe.defaultSalinityPercent}% soli`} variant="green" />
                        <Badge label={`⏳ ${recipe.fermentationDays} dni`} variant="amber" />
                      </View>
                    </View>
                    <View
                      style={[
                        styles.recipeRadioCircle,
                        isSelected && styles.recipeRadioCircleActive,
                      ]}
                    >
                      {isSelected && <Text style={styles.recipeRadioCheck}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.stepModalFooter}>
              <TouchableOpacity
                style={styles.stepModalBackBtn}
                onPress={() => setIsRecipesModalOpen(false)}
              >
                <Text style={styles.stepModalBackBtnText}>← {t('Powrót')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.stepModalConfirmBtn}
                onPress={() => {
                  setRitualMode('recipes');
                  setIsRecipesModalOpen(false);
                }}
              >
                <Text style={styles.stepModalConfirmBtnText}>
                  ✓ {t('Zatwierdź recepturę')}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/* ============================================================== */}
        {/* OKNO MODALNE 2: WAGA SUROWCA, SŁOIK I PARAMETRY NASTAWU         */}
        {/* ============================================================== */}
        <Modal
          visible={isWeightModalOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsWeightModalOpen(false)}
        >
          <SafeAreaView style={styles.stepModalSafeArea}>
            <View style={styles.stepModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepModalKicker}>{t('KROK 2 • WAGA I PARAMETRY')}</Text>
                <Text style={styles.stepModalTitle}>
                  {t('Waga Surowca na Szalce i Słoik')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.stepModalCloseIcon}
                onPress={() => setIsWeightModalOpen(false)}
                hitSlop={theme.hitSlop}
              >
                <Text style={styles.stepModalCloseIconText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.stepModalScroll}
              keyboardShouldPersistTaps="handled"
            >
              <KitchenCard style={styles.weightCard}>
                <View style={styles.weightHeaderRow}>
                  <Text style={styles.cardHeaderTitle}>{t('Waga Surowca na Szalce')}</Text>
                  <TouchableOpacity
                    onPress={() => setProduceWeightNum(1000)}
                    hitSlop={theme.hitSlop}
                  >
                    <Text style={styles.resetWeightText}>{t('Zresetuj 1 kg')}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.weightDisplayRow}>
                  <TextInput
                    style={styles.weightInput}
                    keyboardType="decimal-pad"
                    value={String(produceWeightNum)}
                    onChangeText={(v) =>
                      setProduceWeightNum(parseInt(v.replace(/,/g, '.'), 10) || 0)
                    }
                    accessibilityLabel={t('Waga surowca na szalce')}
                  />
                  <Text style={styles.weightUnitText}>
                    {unitSystem === 'imperial' ? 'oz' : 'g'}
                  </Text>
                </View>

                <View style={styles.quickWeightButtons}>
                  <TouchableOpacity
                    style={styles.weightDeltaBtn}
                    onPress={() => handleAddWeight(-250)}
                  >
                    <Text style={styles.weightDeltaText}>-250 g</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.weightDeltaBtn}
                    onPress={() => handleAddWeight(100)}
                  >
                    <Text style={styles.weightDeltaText}>+100 g</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.weightDeltaBtn}
                    onPress={() => handleAddWeight(250)}
                  >
                    <Text style={styles.weightDeltaText}>+250 g</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.weightDeltaBtn}
                    onPress={() => handleAddWeight(500)}
                  >
                    <Text style={styles.weightDeltaText}>+500 g</Text>
                  </TouchableOpacity>
                </View>
              </KitchenCard>

              <KitchenCard style={styles.equipmentCard}>
                <View style={styles.weightHeaderRow}>
                  <Text style={styles.cardHeaderTitle}>{t('Słoik / Naczynie')}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setIsWeightModalOpen(false);
                      setIsEquipmentModalOpen(true);
                    }}
                  >
                    <Text style={styles.resetWeightText}>⚙️ {t('Warsztat sprzętu')}</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ gap: 8, marginTop: 10 }}>
                  {equipmentList.map((eq) => {
                    const isSelected = selectedEquipmentId === eq.id;
                    return (
                      <TouchableOpacity
                        key={eq.id}
                        style={[styles.eqChip, isSelected && styles.eqChipSelected]}
                        onPress={() => setSelectedEquipmentId(eq.id)}
                      >
                        <Text
                          style={[styles.eqChipText, isSelected && styles.eqChipTextSelected]}
                        >
                          {eq.name}
                        </Text>
                        <Text style={styles.eqChipSub}>
                          {eq.jarVolumeMl} ml · {eq.sealType}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </KitchenCard>

              <KitchenCard style={styles.modalEditCard}>
                <Text style={styles.cardHeaderTitle}>{t('Korekta stężenia soli i czasu')}</Text>
                <Text style={[styles.modalFieldLabel, { marginTop: 10 }]}>
                  {t('Stężenie soli (%):')}
                </Text>
                <View style={styles.stepperControlRow}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleAdjustSalinity(-0.5)}
                  >
                    <Text style={styles.stepperBtnText}>-0.5%</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValueText}>{activeSalinity.toFixed(1)}%</Text>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleAdjustSalinity(0.5)}
                  >
                    <Text style={styles.stepperBtnText}>+0.5%</Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.modalFieldLabel, { marginTop: 12 }]}>
                  {t('Czas fermentacji (dni):')}
                </Text>
                <View style={styles.stepperControlRow}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleAdjustDays(-1)}
                  >
                    <Text style={styles.stepperBtnText}>-1 {t('dzień')}</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValueText}>
                    {activeFermentationDays} {t('dni')}
                  </Text>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleAdjustDays(1)}
                  >
                    <Text style={styles.stepperBtnText}>+1 {t('dzień')}</Text>
                  </TouchableOpacity>
                </View>
              </KitchenCard>
            </ScrollView>

            <View style={styles.stepModalFooter}>
              <TouchableOpacity
                style={styles.stepModalBackBtn}
                onPress={() => setIsWeightModalOpen(false)}
              >
                <Text style={styles.stepModalBackBtnText}>← {t('Powrót')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.stepModalConfirmBtn}
                onPress={() => setIsWeightModalOpen(false)}
              >
                <Text style={styles.stepModalConfirmBtnText}>
                  ✓ {t('Zatwierdź parametry')}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/* ============================================================== */}
        {/* OKNO MODALNE 3: GRAMATURA SKŁADNIKÓW I EDYCJA PRZYPRAW          */}
        {/* ============================================================== */}
        <Modal
          visible={isIngredientsModalOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsIngredientsModalOpen(false)}
        >
          <SafeAreaView style={styles.stepModalSafeArea}>
            <View style={styles.stepModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepModalKicker}>{t('KROK 3 • ŚWIĘTE PROPORCJE')}</Text>
                <Text style={styles.stepModalTitle}>
                  {t('Gramatura składników i przyprawy')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.stepModalCloseIcon}
                onPress={() => setIsIngredientsModalOpen(false)}
                hitSlop={theme.hitSlop}
              >
                <Text style={styles.stepModalCloseIconText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.stepModalScroll}
              keyboardShouldPersistTaps="handled"
            >
              <SacredNumbersBar
                produceWeightGrams={produceWeightNum}
                waterWeightGrams={brineCalculation.waterGrams}
                saltWeightGrams={brineCalculation.saltGrams}
                salinityPercent={activeSalinity}
                isDrySalting={isDrySalting}
              />

              <KitchenCard style={styles.modalEditCard}>
                <Text style={styles.cardHeaderTitle}>{t('Przelicznik kuchenny dla Twojej wagi')}</Text>
                <Text style={styles.kitchenMeasureLine}>
                  • <Text style={{ fontWeight: '800' }}>{t('Surowiec:')}</Text>{' '}
                  {formatProduceWeight(produceWeightNum, unitSystem)}
                </Text>
                <Text style={styles.kitchenMeasureLine}>
                  • <Text style={{ fontWeight: '800' }}>{t('Sól kamienna niejodowana:')}</Text>{' '}
                  {formatSaltWeight(brineCalculation.saltGrams, unitSystem)} (ok. {saltTeaspoons}{' '}
                  {t('płaskiej łyżeczki')})
                </Text>
                <Text style={styles.kitchenMeasureLine}>
                  • <Text style={{ fontWeight: '800' }}>{t('Woda do solanki:')}</Text>{' '}
                  {isDrySalting
                    ? t('0 ml (kiszenie we własnym soku)')
                    : formatBrineVolume(brineCalculation.waterGrams, unitSystem)}
                </Text>
              </KitchenCard>

              <KitchenCard style={styles.modalEditCard}>
                <Text style={styles.cardHeaderTitle}>{t('Zioła i przyprawy do słoika')}</Text>
                <Text style={styles.modalFieldLabel}>
                  {t('Kliknij, aby dodać lub usunąć przyprawę, lub wpisz własne:')}
                </Text>
                <View style={styles.produceGrid}>
                  {QUICK_HERB_CHIPS.map((herb) => {
                    const isIncluded = (customHerbsText || activeRecipeHerbs).includes(herb);
                    return (
                      <TouchableOpacity
                        key={herb}
                        style={[styles.produceChip, isIncluded && styles.produceChipSelected]}
                        onPress={() => handleToggleHerbChip(herb)}
                      >
                        <Text
                          style={[
                            styles.produceChipText,
                            isIncluded && styles.produceChipTextSelected,
                          ]}
                        >
                          {t(herb)}
                        </Text>
                        {isIncluded && <Text style={styles.produceCheck}>✓</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TextInput
                  style={[styles.modalTextInput, { marginTop: 12 }]}
                  value={customHerbsText || activeRecipeHerbs}
                  onChangeText={(txt) => {
                    setHasCustomizedParams(true);
                    setCustomHerbsText(txt);
                  }}
                  multiline
                />
              </KitchenCard>

              {activeRecipeCraftTips && activeRecipeCraftTips.length > 0 && (
                <View style={styles.herbsTipBox}>
                  <Text style={styles.herbsTipTitle}>💡 {t('Sekrety chrupkości Mistrza:')}</Text>
                  {activeRecipeCraftTips.map((tip, idx) => (
                    <Text key={idx} style={styles.herbsTipText}>
                      • {tip}
                    </Text>
                  ))}
                </View>
              )}
            </ScrollView>

            <View style={styles.stepModalFooter}>
              <TouchableOpacity
                style={styles.stepModalBackBtn}
                onPress={() => setIsIngredientsModalOpen(false)}
              >
                <Text style={styles.stepModalBackBtnText}>← {t('Powrót')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.stepModalConfirmBtn}
                onPress={() => setIsIngredientsModalOpen(false)}
              >
                <Text style={styles.stepModalConfirmBtnText}>
                  ✓ {t('Zatwierdź składniki')}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/* MODAL PROCEDURY NASTAWU KROK PO KROKU */}
        <CraftProcedureModal
          visible={isProcedureModalOpen}
          onClose={() => setIsProcedureModalOpen(false)}
          recipeTitle={activeRecipeTitle}
          culture={activeRecipeCulture}
          produceWeightGrams={produceWeightNum}
          saltWeightGrams={brineCalculation.saltGrams}
          waterWeightGrams={brineCalculation.waterGrams}
          salinityPercent={activeSalinity}
          isDrySalting={isDrySalting}
          herbs={activeRecipeHerbs}
          steps={activeRecipeSteps}
          craftTips={activeRecipeCraftTips}
          onCompleteAndSave={() => {
            setIsProcedureModalOpen(false);
            handleSaveBatch();
          }}
        />

        {/* MODAL ONBOARDINGU */}
        <CraftOnboardingModal
          visible={isOnboardingOpen}
          canDismiss={dbStore.isOnboardingCompleted()}
          onClose={() => setIsOnboardingOpen(false)}
          onComplete={(profile) => {
            setActiveProfile(profile);
            setIsOnboardingOpen(false);
          }}
        />

        {/* MODAL ZŁOTYCH ZASAD KISZENIA */}
        <QuickStartGuideModal
          visible={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
          onStartRitual={() => setIsGuideOpen(false)}
        />

        {/* MODAL PRZEWODNIKA PO APLIKACJI */}
        <AppTourModal visible={isTourOpen} onClose={() => setIsTourOpen(false)} />

        {/* MODAL SPRZĘTU */}
        <CustomEquipmentModal
          visible={isEquipmentModalOpen}
          onClose={() => setIsEquipmentModalOpen(false)}
          onUpdated={() => {
            const eq = dbStore.getCustomEquipment();
            setEquipmentList(eq);
          }}
        />

        {/* MODAL WŁASNEJ PROCEDURY */}
        <CustomRecipeModal
          visible={isCustomRecipeModalOpen}
          onClose={() => setIsCustomRecipeModalOpen(false)}
          onSaved={() => {
            Alert.alert(t('Gotowe!'), t('Receptura została zapisana w Wiedzy.'));
          }}
        />

        {/* PAYWALL */}
        <PaywallModal visible={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} />
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
    marginBottom: 10,
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
  tourHeaderBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.amberBrine,
  },
  iconButtonEmoji: {
    fontSize: 15,
  },
  tagline: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 3,
  },
  goldenRulesBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.pickleGreen,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 10,
  },
  goldenRulesEmoji: {
    fontSize: 20,
  },
  goldenRulesTextCol: {
    flex: 1,
  },
  goldenRulesTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  goldenRulesSubtitle: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  goldenRulesArrow: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.pickleGreenLight,
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
  stepCheckBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.pickleGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCheckBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  checklistStepTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  checklistStepSub: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  currentSummaryBox: {
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 10,
  },
  currentSummaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.pickleGreenLight,
    letterSpacing: 0.6,
  },
  currentSummaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginVertical: 2,
  },
  currentSummaryPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  currentSummaryMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  currentSummaryDot: {
    color: theme.colors.textMuted,
  },
  twoModalButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modalTriggerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  modalTriggerBtnActive: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: theme.colors.pickleGreenMuted,
  },
  modalTriggerEmoji: {
    fontSize: 20,
  },
  modalTriggerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  modalTriggerTitleActive: {
    color: theme.colors.pickleGreenLight,
  },
  modalTriggerSub: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  compactMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 10,
  },
  compactMetricItem: {
    flex: 1,
    alignItems: 'center',
  },
  compactMetricDivider: {
    width: 1,
    height: 26,
    backgroundColor: theme.colors.border,
  },
  compactMetricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  compactMetricValue: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  openStepWindowBtn: {
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.amberBrine,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  openStepWindowBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.amberBrine,
  },
  compactHerbsRow: {
    marginVertical: 8,
    paddingHorizontal: 4,
  },
  compactHerbsText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
  },
  procedureLaunchBtn: {
    backgroundColor: theme.colors.pickleGreen,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    marginBottom: 8,
  },
  procedureLaunchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  procedureLaunchEmoji: {
    fontSize: 24,
  },
  procedureLaunchTextCol: {
    flex: 1,
  },
  procedureLaunchTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  procedureLaunchSub: {
    fontSize: 11,
    color: '#E8F5E9',
    marginTop: 2,
  },
  mainStartButton: {
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.pickleGreen,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 11,
    alignItems: 'center',
  },
  mainStartButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.pickleGreenLight,
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
  modalSectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  produceCategoryScroll: {
    gap: 8,
    paddingBottom: 10,
  },
  produceCatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  produceCatChipActive: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: theme.colors.pickleGreenMuted,
  },
  produceCatIcon: {
    fontSize: 14,
  },
  produceCatText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  produceCatTextActive: {
    color: theme.colors.pickleGreenLight,
    fontWeight: '800',
  },
  produceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  produceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  produceChipSelected: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: theme.colors.pickleGreenMuted,
  },
  produceChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  produceChipTextSelected: {
    color: theme.colors.textPrimary,
    fontWeight: '800',
  },
  produceCheck: {
    fontSize: 12,
    fontWeight: '900',
    color: theme.colors.pickleGreenLight,
  },
  modalEditCard: {
    backgroundColor: theme.colors.bgCard,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  modalTextInput: {
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  methodToggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  methodOptionBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  methodOptionBtnActive: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: theme.colors.pickleGreenMuted,
  },
  methodOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  methodOptionTextActive: {
    color: theme.colors.pickleGreenLight,
    fontWeight: '800',
  },
  stepperControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.sm,
    padding: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stepperBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stepperBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.amberBrine,
  },
  stepperValueText: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  recipeCatScroll: {
    marginBottom: 10,
  },
  recipeCatChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 8,
  },
  recipeCatChipActive: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: theme.colors.pickleGreenMuted,
  },
  recipeCatChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  recipeCatChipTextActive: {
    color: theme.colors.pickleGreenLight,
  },
  addOwnRecipeInlineBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
  },
  addOwnRecipeInlineText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.pickleGreenLight,
  },
  modalRecipeListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    marginBottom: 10,
    gap: 10,
  },
  modalRecipeListItemSelected: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: theme.colors.pickleGreenMuted,
  },
  recipeCulture: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
  },
  modalRecipeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginVertical: 2,
  },
  modalRecipeSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  modalRecipeBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  recipeRadioCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeRadioCircleActive: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: theme.colors.pickleGreen,
  },
  recipeRadioCheck: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  weightCard: {
    backgroundColor: theme.colors.bgCard,
    padding: 14,
    marginBottom: 14,
  },
  weightHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  resetWeightText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.amberBrine,
  },
  weightDisplayRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 8,
  },
  weightInput: {
    fontSize: 38,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.pickleGreen,
    minWidth: 120,
    textAlign: 'center',
    paddingVertical: 4,
  },
  weightUnitText: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textSecondary,
  },
  quickWeightButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  weightDeltaBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  weightDeltaText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  equipmentCard: {
    backgroundColor: theme.colors.bgCard,
    padding: 14,
    marginBottom: 14,
  },
  eqChip: {
    padding: 12,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  eqChipSelected: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: theme.colors.pickleGreenMuted,
  },
  eqChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  eqChipTextSelected: {
    color: theme.colors.pickleGreenLight,
  },
  eqChipSub: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  kitchenMeasureLine: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginTop: 6,
  },
  herbsTipBox: {
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.pickleGreen,
  },
  herbsTipTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.pickleGreenLight,
    marginBottom: 6,
  },
  herbsTipText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginBottom: 4,
  },
  corruptBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A1D1D',
    borderWidth: 1,
    borderColor: theme.colors.danger,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    marginBottom: 12,
  },
  corruptBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FF8A80',
  },
  corruptBannerSubtitle: {
    fontSize: 11,
    color: '#FFCDD2',
    marginTop: 2,
  },
  corruptBannerButton: {
    backgroundColor: theme.colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  corruptBannerButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
});
