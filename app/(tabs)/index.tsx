// ============================================================================
// Słoik (Jarwise) — Rytuał (Główny Warsztat & Active Focus)
// Apps4Craft Studio — Czyste Rzemiosło, Ergonomia Blatu Kuchennego.
// 1-Tap waga, Święte Liczby, Zegar kuchenny, Sprzęt rzemieślnika.
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { calculateBrine } from '../../src/core/brine/brine-calculator';
import { evaluatePasteurizationSafety } from '../../src/core/safety/safety-guard';
import { scheduleFermentationAlerts } from '../../src/core/notifications/kitchen-notifications';
import { calculateFermentationTimeline } from '../../src/core/timeline/fermentation-timeline';
import { dbStore, CustomEquipmentRecord, BatchRecord } from '../../src/data/db/database';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { KitchenButton } from '../../src/ui/components/KitchenButton';
import { Badge } from '../../src/ui/components/Badge';
import { SacredNumbersBar } from '../../src/ui/components/SacredNumbersBar';
import { ActiveFocusTimer } from '../../src/ui/components/ActiveFocusTimer';
import { CraftOnboardingModal, CraftProfileId } from '../../src/ui/components/CraftOnboardingModal';
import { QuickStartGuideModal } from '../../src/ui/components/QuickStartGuideModal';
import { CustomEquipmentModal } from '../../src/ui/components/CustomEquipmentModal';
import { CustomRecipeModal } from '../../src/ui/components/CustomRecipeModal';
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

interface RitualPreset {
  id: string;
  name: string;
  profile: CraftProfileId | 'all';
  salinity: number;
  isDrySalting: boolean;
  waterRatio: number;
  herbs: string;
  defaultProduceGrams: number;
}

const RITUAL_PRESETS: RitualPreset[] = [
  // Klasyka Domowa
  {
    id: 'malosolne',
    name: '🥒 Ogórki małosolne (48h)',
    profile: 'classic_pickles',
    salinity: 2.0,
    isDrySalting: false,
    waterRatio: 0.8,
    herbs: 'Czosnek (2 ząbki), baldach kopru, kawałek chrzanu, liść dębu',
    defaultProduceGrams: 1000,
  },
  {
    id: 'ogorki_zima',
    name: '🥒 Ogórki kiszone na zimę',
    profile: 'classic_pickles',
    salinity: 2.5,
    isDrySalting: false,
    waterRatio: 0.8,
    herbs: 'Czosnek (3 ząbki), chrzan, koper, gorczyca, ziele angielskie',
    defaultProduceGrams: 1500,
  },
  {
    id: 'kapusta',
    name: '🥬 Kiszona kapusta z kminkiem',
    profile: 'classic_pickles',
    salinity: 2.0,
    isDrySalting: true,
    waterRatio: 0,
    herbs: 'Kminek całe ziarno, starta marchew (opcjonalnie)',
    defaultProduceGrams: 2000,
  },
  {
    id: 'buraki',
    name: '🟣 Zakwas z buraków',
    profile: 'classic_pickles',
    salinity: 2.0,
    isDrySalting: false,
    waterRatio: 1.0,
    herbs: 'Czosnek, liść laurowy, ziele angielskie, skórka chleba żytniego',
    defaultProduceGrams: 1000,
  },

  // Fermenty Świata
  {
    id: 'kimchi',
    name: '🌶️ Baechu-Kimchi',
    profile: 'world_ferments',
    salinity: 2.5,
    isDrySalting: true,
    waterRatio: 0,
    herbs: 'Gochugaru, imbir, czosnek, rzodkiew mu, dymka',
    defaultProduceGrams: 1500,
  },
  {
    id: 'tursu',
    name: '🧄 Tursu (Bliskowschodnie Pikle)',
    profile: 'world_ferments',
    salinity: 3.0,
    isDrySalting: false,
    waterRatio: 0.85,
    herbs: 'Kolendra w ziarnach, czosnek, ocet winny 1 łyżka, chili',
    defaultProduceGrams: 1200,
  },
  {
    id: 'jalapeno',
    name: '🔥 Fermentowane Jalapeño & Habanero',
    profile: 'world_ferments',
    salinity: 3.5,
    isDrySalting: false,
    waterRatio: 0.9,
    herbs: 'Ziele angielskie, czosnek, oregano meksykańskie',
    defaultProduceGrams: 600,
  },

  // Spiżarnia & Weki
  {
    id: 'dzem_truskawka',
    name: '🍓 Konfitura truskawkowa z pektyną',
    profile: 'canning_pantry',
    salinity: 0.0,
    isDrySalting: true,
    waterRatio: 0,
    herbs: 'Cukier trzcinowy 300g, sok z cytryny, pektyna jabłkowa',
    defaultProduceGrams: 1000,
  },
  {
    id: 'przecier_pomidor',
    name: '🍅 Passata pomidorowa na zimę',
    profile: 'canning_pantry',
    salinity: 1.0,
    isDrySalting: true,
    waterRatio: 0,
    herbs: 'Sól kamienna, świeża bazylia, oliwa z oliwek na wierzch',
    defaultProduceGrams: 2500,
  },
];

const RECIPE_CATEGORIES: { label: string; value: RecipeCategory | 'all' }[] = [
  { label: 'Wszystkie', value: 'all' },
  { label: 'Polska', value: 'poland_central_europe' },
  { label: 'Azja', value: 'east_asia' },
  { label: 'Bliski Wschód', value: 'mideast_maghreb_india' },
  { label: 'Ameryki', value: 'americas_mediterranean' },
  { label: 'Spiżarnia', value: 'sweet_preserves' },
  { label: 'Napoje', value: 'drinks_vinegars' },
];

export default function RitualScreen() {
  const router = useRouter();
  const { canCreate } = useAppAccess();
  useLang();
  const unitSystem = useUnitSystem();

  // Onboarding profile
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<CraftProfileId>(
    dbStore.getOnboardingProfile() || 'classic_pickles'
  );

  // Modale
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isCustomRecipeModalOpen, setIsCustomRecipeModalOpen] = useState(false);

  // Stan wybranego nastawu
  const [selectedPresetId, setSelectedPresetId] = useState<string>('malosolne');
  const [produceWeightNum, setProduceWeightNum] = useState<number>(1000);
  const [equipmentList, setEquipmentList] = useState<CustomEquipmentRecord[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('eq_weck_1000');

  // Zaawansowane opcje
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customSalinityPct, setCustomSalinityPct] = useState<number>(2.0);
  const [isDrySaltingCustom, setIsDrySaltingCustom] = useState<boolean>(false);

  // Przewodnik Pierwsze Kroki
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Tryb wyboru nastawu (Styl Dowolny / Receptury Mistrzów / Klasyczne Presety)
  const [ritualMode, setRitualMode] = useState<'freeform' | 'recipes' | 'presets'>('freeform');
  const [selectedProduce, setSelectedProduce] = useState<string[]>(['cucumber']);
  const [recipeCategory, setRecipeCategory] = useState<RecipeCategory | 'all'>('all');
  const [recipeSearch, setRecipeSearch] = useState<string>('');

  const freeformSuggestion = composeFreeformRecipe(selectedProduce, produceWeightNum);

  const handleToggleProduce = (id: string) => {
    setSelectedProduce((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((p) => p !== id);
      }
      return [...prev, id];
    });
  };

  const handleApplyFreeform = () => {
    setCustomTitle(freeformSuggestion.title);
    setCustomSalinityPct(freeformSuggestion.recommendedSalinityPercent);
    setIsDrySaltingCustom(freeformSuggestion.isDrySalting);
    setIsAdvancedOpen(true);
    Alert.alert(
      t('Zastosowano Styl Dowolny! 🫙'),
      t('Parametry autorskiego nastawu zostały załadowane do kalkulatora blatu kuchennego.')
    );
  };

  const handleSelectMasterRecipe = (recipe: MasterRecipe) => {
    setSelectedPresetId(`rec_${recipe.id.toLowerCase()}`);
    setCustomTitle(recipe.title);
    setCustomSalinityPct(recipe.defaultSalinityPercent);
    setProduceWeightNum(recipe.defaultProduceWeightGrams);
    const isDry =
      recipe.method === 'sweet_preserve' ||
      recipe.title.toLowerCase().includes('kapust') ||
      recipe.title.toLowerCase().includes('kimchi') ||
      recipe.title.toLowerCase().includes('cytryn');
    setIsDrySaltingCustom(isDry);
    setIsAdvancedOpen(true);
    Alert.alert(
      t('Receptura załadowana! 📖'),
      t('Nastaw "{title}" ({salinity}% soli) jest gotowy do odważenia.', {
        title: recipe.title,
        salinity: recipe.defaultSalinityPercent,
      })
    );
  };

  const filteredMasterRecipes = MASTER_RECIPES.filter((r) => {
    const matchesCat = recipeCategory === 'all' || r.category === recipeCategory;
    const q = normSearch(recipeSearch);
    const matchesSearch =
      !q ||
      normSearch(r.title).includes(q) ||
      normSearch(r.culture).includes(q) ||
      normSearch(r.subtitle).includes(q);
    return matchesCat && matchesSearch;
  });

  useEffect(() => {
    // Sprawdź onboarding
    if (!dbStore.isOnboardingCompleted()) {
      setIsOnboardingOpen(true);
    }
    const profile = dbStore.getOnboardingProfile();
    if (profile) setActiveProfile(profile);

    const eq = dbStore.getCustomEquipment();
    setEquipmentList(eq);
    if (eq.length > 0) setSelectedEquipmentId(eq[0].id);
  }, []);

  const currentPreset =
    RITUAL_PRESETS.find((p) => p.id === selectedPresetId) || RITUAL_PRESETS[0];

  // Filtruj presety według aktywnego profilu (lub pokaż wszystkie jeśli brak dopasowania)
  const visiblePresets = RITUAL_PRESETS.filter(
    (p) => p.profile === activeProfile || p.profile === 'all'
  );
  const displayPresets = visiblePresets.length > 0 ? visiblePresets : RITUAL_PRESETS;

  // Obliczenia solanki
  const activeSalinity = isAdvancedOpen ? customSalinityPct : currentPreset.salinity;
  const isDrySalting = isAdvancedOpen ? isDrySaltingCustom : currentPreset.isDrySalting;
  const waterRatio = isDrySalting ? 0 : currentPreset.waterRatio;

  const brineCalculation = calculateBrine({
    method: isDrySalting ? 'dry_salting' : 'total_mass',
    targetSalinityPercent: activeSalinity,
    produceWeightGrams: produceWeightNum,
    waterWeightGrams: isDrySalting ? 0 : Math.round(produceWeightNum * waterRatio),
  });

  const selectedEquipment =
    equipmentList.find((e) => e.id === selectedEquipmentId) || equipmentList[0];

  // Szybkie dodawanie wagi
  const handleAddWeight = (deltaGrams: number) => {
    setProduceWeightNum((prev) => Math.max(100, prev + deltaGrams));
  };

  // Rozpoczęcie nastawu i zapis do bazy
  const handleSaveBatch = () => {
    if (!canCreate) {
      setIsPaywallOpen(true);
      return;
    }

    const title = customTitle.trim() || currentPreset.name.replace(/^[^\s]+\s*/, '');
    const recipeId = isAdvancedOpen ? 'CUSTOM' : `REC_${currentPreset.id.toUpperCase()}`;
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newBatch: BatchRecord = {
      id: batchId,
      recipeId,
      recipeTitle: title,
      culture: activeProfile === 'world_ferments' ? 'Azja / Świat' : 'Polska',
      method: isDrySalting ? 'dry_salting' : 'lacto_fermentation',
      produceWeightGrams: produceWeightNum,
      waterWeightGrams: brineCalculation.waterGrams,
      saltWeightGrams: brineCalculation.saltGrams,
      salinityPercent: activeSalinity,
      targetFermentationDays: isDrySalting ? 14 : 4,
      status: 'fermenting',
      qrCodeUri: `sloik://batch/${batchId}`,
      createdAt: Date.now(),
      startedAt: Date.now(),
      notes: `Sprzęt: ${selectedEquipment?.name || 'Słoik 1000 ml'}`,
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
        recommendedJarType: 'Słoik 1000 ml',
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Baner odzyskiwania uszkodzonego stanu (BR-TEST-023 / NFR-INT-008) */}
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

        {/* Nagłówek Rytuału */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={theme.typography.heroTitle}>{t('Słoik (Jarwise) 🫙')}</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => router.push('/experiments')}
                style={styles.iconButton}
                accessibilityLabel={t('Laboratorium Eksperymentów')}
                accessibilityRole="button"
                hitSlop={theme.hitSlop}
              >
                <Text style={{ fontSize: 20 }}>🔬</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/pasteurizer')}
                style={styles.iconButton}
                accessibilityLabel={t('Stoper Pasteryzacji')}
                accessibilityRole="button"
                hitSlop={theme.hitSlop}
              >
                <Text style={{ fontSize: 20 }}>⏱️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/settings')}
                style={styles.iconButton}
                accessibilityLabel={t('Ustawienia i Warsztat')}
                accessibilityRole="button"
                hitSlop={theme.hitSlop}
              >
                <Text style={{ fontSize: 20 }}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.tagline}>
            {t('Rytuał przygotowania, precyzja soli i aktywny zegar blatu kuchennego.')}
          </Text>
        </View>

        {/* BANER PRZEWODNIKA: PIERWSZE KROKI */}
        <TouchableOpacity
          style={styles.guideBanner}
          onPress={() => setIsGuideOpen(true)}
          activeOpacity={0.85}
          accessibilityLabel={t('Pierwsze kroki w Słoiku')}
        >
          <Text style={styles.guideBannerEmoji}>✨</Text>
          <View style={styles.guideBannerTextCol}>
            <View style={styles.guideBannerBadgeRow}>
              <Text style={styles.guideBannerBadge}>{t('PIERWSZE KROKI')}</Text>
              <Text style={styles.guideBannerArrow}>→</Text>
            </View>
            <Text style={styles.guideBannerTitle}>{t('Przewodnik: Jak zacząć domowe przetwory?')}</Text>
            <Text style={styles.guideBannerSubtitle}>
              {t('5 złotych reguł: precyzja soli, beztlenowy słoik i idealna chrupkość.')}
            </Text>
          </View>
        </TouchableOpacity>

        {/* ============================================================== */}
        {/* ŚWIĘTE LICZBY FERMENTACJI (SACRED NUMBERS BAR)                 */}
        {/* ============================================================== */}
        <SacredNumbersBar
          produceWeightGrams={produceWeightNum}
          waterWeightGrams={brineCalculation.waterGrams}
          saltWeightGrams={brineCalculation.saltGrams}
          salinityPercent={activeSalinity}
          isDrySalting={isDrySalting}
        />

        {/* PRZYCISK TRYBU AKTYWNEGO SKUPIENIA (ACTIVE FOCUS TIMER) */}
        <TouchableOpacity
          style={styles.focusTimerLaunchBtn}
          onPress={() => setIsFocusTimerOpen(!isFocusTimerOpen)}
          activeOpacity={0.85}
        >
          <Text style={styles.focusTimerLaunchText}>
            ⏱️ {isFocusTimerOpen ? t('Ukryj Zegar Kuchenny') : t('Tryb Skupienia (Zegar Kuchenny)')}
          </Text>
        </TouchableOpacity>

        {isFocusTimerOpen && (
          <ActiveFocusTimer
            title={currentPreset.name}
            defaultSeconds={900}
            onClose={() => setIsFocusTimerOpen(false)}
          />
        )}

        {/* ============================================================== */}
        {/* WYBÓR NASTAWU RYTUAŁU (STYL DOWOLNY / RECEPTURY / KLASYKI)     */}
        {/* ============================================================== */}
        <Text style={styles.sectionTitle}>{t('Wybierz Nastaw Rytuału')}</Text>

        {/* PRZEŁĄCZNIK TRYBU */}
        <View style={styles.modeTabsRow}>
          <TouchableOpacity
            style={[styles.modeTabBtn, ritualMode === 'freeform' && styles.modeTabBtnActive]}
            onPress={() => setRitualMode('freeform')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.modeTabBtnText,
                ritualMode === 'freeform' && styles.modeTabBtnTextActive,
              ]}
            >
              🧪 {t('Styl Dowolny')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTabBtn, ritualMode === 'recipes' && styles.modeTabBtnActive]}
            onPress={() => setRitualMode('recipes')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.modeTabBtnText,
                ritualMode === 'recipes' && styles.modeTabBtnTextActive,
              ]}
            >
              📜 {t('Receptury (46)')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTabBtn, ritualMode === 'presets' && styles.modeTabBtnActive]}
            onPress={() => setRitualMode('presets')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.modeTabBtnText,
                ritualMode === 'presets' && styles.modeTabBtnTextActive,
              ]}
            >
              🥒 {t('Klasyki')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* TRYB 1: STYL DOWOLNY */}
        {ritualMode === 'freeform' && (
          <View style={styles.freeformBox}>
            <Text style={styles.freeformSubtitle}>
              {t('Zaznacz warzywa, które masz w kuchni — aplikacja wyliczy solankę, zioła i technikę:')}
            </Text>

            <View style={styles.produceGrid}>
              {FREEFORM_PRODUCE.map((prod) => {
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

            {/* KARTA WYNIKU KOMPOZYCJI */}
            <KitchenCard style={styles.freeformResultCard}>
              <Text style={styles.freeformTitle}>{freeformSuggestion.title}</Text>
              <Text style={styles.freeformSubtitleText}>{freeformSuggestion.subtitle}</Text>

              <View style={styles.freeformBadgesRow}>
                <Badge
                  label={freeformSuggestion.isDrySalting ? t('Solenie na sucho') : t('Solanka wodna')}
                  variant="green"
                />
                <Badge
                  label={`${freeformSuggestion.recommendedSalinityPercent}% ${t('sól')}`}
                  variant="amber"
                />
                <Badge
                  label={`⏳ ${freeformSuggestion.fermentationDays} ${t('dni')}`}
                  variant="gray"
                />
              </View>

              <Text style={styles.freeformHerbs}>
                🌿 <Text style={{ fontWeight: '700' }}>{t('Sugerowane zioła:')}</Text>{' '}
                {freeformSuggestion.suggestedHerbs.join(', ')}
              </Text>

              <Text style={styles.freeformTip}>
                💡 {freeformSuggestion.craftTips[0]}
              </Text>

              <TouchableOpacity
                style={styles.freeformApplyBtn}
                onPress={handleApplyFreeform}
                activeOpacity={0.85}
              >
                <Text style={styles.freeformApplyBtnText}>
                  {t('Zastosuj w kalkulatorze blatu 🫙')}
                </Text>
              </TouchableOpacity>
            </KitchenCard>
          </View>
        )}

        {/* TRYB 2: RECEPTURY MISTRZÓW */}
        {ritualMode === 'recipes' && (
          <View style={styles.recipesModeBox}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipeCatScroll}>
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
              placeholder={t('Szukaj wśród 46 receptur...')}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipesScroll}>
              {filteredMasterRecipes.slice(0, 15).map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.recipeCard}
                  onPress={() => handleSelectMasterRecipe(recipe)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.recipeCulture}>{recipe.culture}</Text>
                  <Text style={styles.recipeCardTitle} numberOfLines={2}>
                    {recipe.title}
                  </Text>
                  <Text style={styles.recipeCardSubtitle} numberOfLines={2}>
                    {recipe.subtitle}
                  </Text>
                  <View style={styles.recipeCardFooter}>
                    <Badge label={`${recipe.defaultSalinityPercent}%`} variant="green" />
                    <Text style={styles.recipeCardAction}>{t('Wybierz →')}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* TRYB 3: KLASYCZNE PRESETY */}
        {ritualMode === 'presets' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetsScroll}
          >
            {displayPresets.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <TouchableOpacity
                  key={preset.id}
                  style={[
                    styles.presetChip,
                    isSelected && styles.presetChipSelected,
                  ]}
                  onPress={() => {
                    setSelectedPresetId(preset.id);
                    setProduceWeightNum(preset.defaultProduceGrams);
                    setIsAdvancedOpen(false);
                    setCustomTitle('');
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.presetChipText,
                      isSelected && styles.presetChipTextSelected,
                    ]}
                  >
                    {preset.name}
                  </Text>
                  <Text
                    style={[
                      styles.presetChipSalinity,
                      isSelected && styles.presetChipSalinitySelected,
                    ]}
                  >
                    {preset.isDrySalting ? t('Solenie na sucho') : `${preset.salinity}% solanka`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* ============================================================== */}
        {/* KUCHENNA WAGA 1-TAP (PRODUCE WEIGHT BUTTONS)                    */}
        {/* ============================================================== */}
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
              onChangeText={(v) => setProduceWeightNum(parseInt(v.replace(/,/g, '.'), 10) || 0)}
              accessibilityLabel={t('Waga surowca na szalce')}
              accessibilityRole="text"
              hitSlop={theme.hitSlop}
            />
            <Text style={styles.weightUnitText}>
              {unitSystem === 'imperial' ? 'oz' : 'g'}
            </Text>
          </View>

          <View style={styles.quickWeightButtons}>
            <TouchableOpacity
              style={styles.weightDeltaBtn}
              onPress={() => handleAddWeight(100)}
              hitSlop={theme.hitSlop}
            >
              <Text style={styles.weightDeltaText}>+100 g</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.weightDeltaBtn}
              onPress={() => handleAddWeight(250)}
              hitSlop={theme.hitSlop}
            >
              <Text style={styles.weightDeltaText}>+250 g</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.weightDeltaBtn}
              onPress={() => handleAddWeight(500)}
              hitSlop={theme.hitSlop}
            >
              <Text style={styles.weightDeltaText}>+500 g</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.weightDeltaBtn}
              onPress={() => handleAddWeight(1000)}
              hitSlop={theme.hitSlop}
            >
              <Text style={styles.weightDeltaText}>+1 kg</Text>
            </TouchableOpacity>
          </View>
        </KitchenCard>

        {/* ============================================================== */}
        {/* SPRZĘT I SŁOIKI RZEMIEŚLNIKA                                    */}
        {/* ============================================================== */}
        <KitchenCard style={styles.equipmentCard}>
          <View style={styles.weightHeaderRow}>
            <Text style={styles.cardHeaderTitle}>{t('Słoik / Naczynie')}</Text>
            <TouchableOpacity
              onPress={() => setIsEquipmentModalOpen(true)}
              hitSlop={theme.hitSlop}
            >
              <Text style={styles.resetWeightText}>⚙️ {t('Warsztat sprzętu')}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            {equipmentList.map((eq) => {
              const isSelected = selectedEquipmentId === eq.id;
              return (
                <TouchableOpacity
                  key={eq.id}
                  style={[
                    styles.eqChip,
                    isSelected && styles.eqChipSelected,
                  ]}
                  onPress={() => setSelectedEquipmentId(eq.id)}
                  hitSlop={theme.hitSlop}
                >
                  <Text style={[styles.eqChipText, isSelected && styles.eqChipTextSelected]}>
                    {eq.name}
                  </Text>
                  <Text style={styles.eqChipSub}>
                    {eq.jarVolumeMl} ml · {eq.sealType}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </KitchenCard>

        {/* Wskazówki Rzemieślnika */}
        <View style={styles.herbsTipBox}>
          <Text style={styles.herbsTipTitle}>🌿 {t('Sugerowane zioła i przyprawy:')}</Text>
          <Text style={styles.herbsTipText}>{currentPreset.herbs}</Text>
        </View>

        {/* ============================================================== */}
        {/* GŁÓWNY PRZYCISK: ROZPOCZNIJ NASTAW I ZAPISZ SŁOIK             */}
        {/* ============================================================== */}
        <TouchableOpacity
          style={styles.mainStartButton}
          onPress={handleSaveBatch}
          activeOpacity={0.85}
          accessibilityLabel={t('Rozpocznij nastaw i zapisz słoik 🫙')}
        >
          <Text style={styles.mainStartButtonText}>
            {t('Rozpocznij nastaw i zapisz słoik 🫙')}
          </Text>
        </TouchableOpacity>

        {/* PRZYCISK: WŁASNA PROCEDURA KROK PO KROKU */}
        <TouchableOpacity
          style={styles.customProcedureButton}
          onPress={() => setIsCustomRecipeModalOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.customProcedureText}>
            📝 {t('Zdefiniuj własną procedurę krok po kroku')}
          </Text>
        </TouchableOpacity>

        {/* MODAL ONBOARDINGU (PIERWSZE URUCHOMIENIE LUB ZMIANA) */}
        <CraftOnboardingModal
          visible={isOnboardingOpen}
          canDismiss={dbStore.isOnboardingCompleted()}
          onClose={() => setIsOnboardingOpen(false)}
          onComplete={(profile) => {
            setActiveProfile(profile);
            setIsOnboardingOpen(false);
          }}
        />

        {/* MODAL PRZEWODNIKA: PIERWSZE KROKI */}
        <QuickStartGuideModal
          visible={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
          onStartRitual={() => setIsGuideOpen(false)}
        />

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
        <PaywallModal
          visible={isPaywallOpen}
          onClose={() => setIsPaywallOpen(false)}
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
    marginBottom: 12,
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
  focusTimerLaunchBtn: {
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.amberBrine,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  focusTimerLaunchText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.amberBrine,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 14,
    marginBottom: 8,
  },
  presetsScroll: {
    gap: 10,
    paddingBottom: 6,
  },
  presetChip: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 160,
  },
  presetChipSelected: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: theme.colors.pickleGreenMuted,
  },
  presetChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  presetChipTextSelected: {
    color: theme.colors.pickleGreenLight,
  },
  presetChipSalinity: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  presetChipSalinitySelected: {
    color: theme.colors.pickleGreenLight,
    fontWeight: '600',
  },
  weightCard: {
    backgroundColor: theme.colors.bgCard,
    padding: 16,
    marginTop: 14,
  },
  weightHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  resetWeightText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.pickleGreen,
  },
  weightDisplayRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginVertical: 10,
  },
  weightInput: {
    fontSize: 48,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    minWidth: 140,
  },
  weightUnitText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  quickWeightButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 6,
  },
  weightDeltaBtn: {
    flex: 1,
    minHeight: 40,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightDeltaText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  equipmentCard: {
    backgroundColor: theme.colors.bgCard,
    padding: 14,
    marginTop: 12,
  },
  eqChip: {
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  eqChipSelected: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: theme.colors.pickleGreenMuted,
  },
  eqChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  eqChipTextSelected: {
    color: theme.colors.pickleGreenLight,
  },
  eqChipSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  herbsTipBox: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    marginVertical: 12,
  },
  herbsTipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    marginBottom: 4,
  },
  herbsTipText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  mainStartButton: {
    backgroundColor: theme.colors.pickleGreen,
    minHeight: 54,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  mainStartButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  customProcedureButton: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  customProcedureText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  corruptBanner: {
    backgroundColor: '#3A1A1A',
    borderColor: '#D32F2F',
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  corruptBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFCDD2',
    marginBottom: 2,
  },
  corruptBannerSubtitle: {
    fontSize: 12,
    color: '#EF9A9A',
    lineHeight: 16,
  },
  corruptBannerButton: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.sm,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corruptBannerButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  guideBanner: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1.5,
    borderColor: theme.colors.pickleGreen,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guideBannerEmoji: {
    fontSize: 28,
  },
  guideBannerTextCol: {
    flex: 1,
  },
  guideBannerBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guideBannerBadge: {
    color: theme.colors.pickleGreen,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  guideBannerArrow: {
    color: theme.colors.pickleGreen,
    fontSize: 16,
    fontWeight: '700',
  },
  guideBannerTitle: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  guideBannerSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  modeTabsRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.borderRadius.md,
    padding: 4,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 4,
  },
  modeTabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  modeTabBtnActive: {
    backgroundColor: theme.colors.pickleGreen,
  },
  modeTabBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  modeTabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  freeformBox: {
    marginBottom: 8,
  },
  freeformSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 10,
    lineHeight: 16,
  },
  produceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  produceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  produceChipSelected: {
    backgroundColor: theme.colors.pickleGreenMuted,
    borderColor: theme.colors.pickleGreen,
  },
  produceChipText: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  produceChipTextSelected: {
    color: theme.colors.pickleGreenLight,
    fontWeight: '700',
  },
  produceCheck: {
    color: theme.colors.pickleGreen,
    fontWeight: '800',
    fontSize: 12,
    marginLeft: 4,
  },
  freeformResultCard: {
    backgroundColor: theme.colors.bgCardElevated,
    padding: 16,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 10,
  },
  freeformTitle: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  freeformSubtitleText: {
    color: theme.colors.pickleGreen,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  freeformBadgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  freeformHerbs: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  freeformTip: {
    color: theme.colors.amberBrine,
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 17,
    marginBottom: 14,
  },
  freeformApplyBtn: {
    backgroundColor: theme.colors.pickleGreen,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  freeformApplyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  recipesModeBox: {
    marginBottom: 10,
  },
  recipeCatScroll: {
    gap: 8,
    marginBottom: 10,
  },
  recipeCatChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 6,
  },
  recipeCatChipActive: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  recipeCatChipText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  recipeCatChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  recipesScroll: {
    gap: 10,
    paddingBottom: 6,
    marginTop: 8,
  },
  recipeCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    width: 220,
  },
  recipeCulture: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  recipeCardTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  recipeCardSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  recipeCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeCardAction: {
    color: theme.colors.pickleGreen,
    fontSize: 12,
    fontWeight: '700',
  },
});

