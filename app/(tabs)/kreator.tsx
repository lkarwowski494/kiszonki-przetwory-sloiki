// ============================================================================
// Słoik (Jarwise) — Kreator Solanki & Szybki Start 1-Tap (Kitchen-Proof UI)
// Apps4Brew Studio — Progressive Disclosure & Dirty Thumb standard.
// ============================================================================

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
import { scheduleFermentationAlerts } from '../../src/core/notifications/kitchen-notifications';
import { calculateFermentationTimeline } from '../../src/core/timeline/fermentation-timeline';
import { MASTER_RECIPES } from '../../src/core/recipes/recipes-data';
import { dbStore } from '../../src/data/db/database';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { KitchenButton } from '../../src/ui/components/KitchenButton';
import { Badge } from '../../src/ui/components/Badge';
import { useAppAccess } from '../../src/core/access/app-access';
import { PaywallModal } from '../../src/ui/components/PaywallModal';
import { t, useLang } from '../../src/lib/i18n';
import {
  useUnitSystem,
  formatProduceWeight,
  formatSaltWeight,
  formatBrineVolume,
} from '../../src/core/unit-converter';

interface QuickPreset {
  id: string;
  name: string;
  salinity: number;
  isDrySalting: boolean;
  waterRatio: number; // np. 0.8
  herbs: string;
  defaultProduceGrams: number;
}

const QUICK_PRESETS: QuickPreset[] = [
  {
    id: 'malosolne',
    name: '🥒 Ogórki małosolne (48h)',
    salinity: 2.0,
    isDrySalting: false,
    waterRatio: 0.8,
    herbs: 'Czosnek (2 ząbki), baldach kopru, kawałek chrzanu, liść dębu',
    defaultProduceGrams: 1000,
  },
  {
    id: 'ogorki_zima',
    name: '🥒 Ogórki kiszone na zimę',
    salinity: 2.5,
    isDrySalting: false,
    waterRatio: 0.8,
    herbs: 'Czosnek (3 ząbki), chrzan, koper, gorczyca, ziele angielskie',
    defaultProduceGrams: 1500,
  },
  {
    id: 'kapusta',
    name: '🥬 Kiszona kapusta z kminkiem',
    salinity: 2.0,
    isDrySalting: true,
    waterRatio: 0,
    herbs: 'Kminek całe ziarno, starta marchew (opcjonalnie)',
    defaultProduceGrams: 2000,
  },
  {
    id: 'kimchi',
    name: '🌶️ Baechu-Kimchi',
    salinity: 2.5,
    isDrySalting: true,
    waterRatio: 0,
    herbs: 'Gochugaru, imbir, czosnek, rzodkiew mu, dymka',
    defaultProduceGrams: 1500,
  },
];

export default function WizardScreen() {
  const { canCreate } = useAppAccess();
  useLang();
  const unitSystem = useUnitSystem();
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // Stan szybkiego startu
  const [selectedPresetId, setSelectedPresetId] = useState<string>('malosolne');
  const [produceWeightNum, setProduceWeightNum] = useState<number>(1000);

  // Stan zaawansowany (Progressive Disclosure)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customSalinityPct, setCustomSalinityPct] = useState<number>(2.0);
  const [isDrySaltingCustom, setIsDrySaltingCustom] = useState<boolean>(false);
  const [customWaterWeight, setCustomWaterWeight] = useState<number>(800);
  const [foodPh, setFoodPh] = useState(3.8);

  const activePreset = QUICK_PRESETS.find((p) => p.id === selectedPresetId);

  // Aktualne parametry w zależności od trybu
  const effectiveSalinity = isAdvancedOpen ? customSalinityPct : activePreset?.salinity || 2.0;
  const effectiveDrySalting = isAdvancedOpen ? isDrySaltingCustom : activePreset?.isDrySalting || false;
  const effectiveWaterWeight = effectiveDrySalting
    ? 0
    : isAdvancedOpen
    ? customWaterWeight
    : Math.round(produceWeightNum * (activePreset?.waterRatio || 0.8));

  const effectiveTitle =
    customTitle.trim() || activePreset?.name || t('Własny nastaw rzemieślniczy');

  const brineResult = calculateBrine({
    produceWeightGrams: produceWeightNum,
    waterWeightGrams: effectiveWaterWeight,
    targetSalinityPercent: effectiveSalinity,
    method: effectiveDrySalting ? 'dry_salting' : 'total_mass',
  });

  const safetyResult = evaluatePasteurizationSafety({
    foodPh: foodPh,
    jarVolumeMl: 1000,
    method: 'water_bath',
  });

  const handleSelectPreset = (preset: QuickPreset) => {
    setSelectedPresetId(preset.id);
    setProduceWeightNum(preset.defaultProduceGrams);
    setCustomSalinityPct(preset.salinity);
    setIsDrySaltingCustom(preset.isDrySalting);
    setCustomWaterWeight(Math.round(preset.defaultProduceGrams * preset.waterRatio));
  };

  const handleAdjustWeight = (delta: number) => {
    setProduceWeightNum((prev) => {
      const next = Math.max(100, Math.min(25000, prev + delta));
      if (!effectiveDrySalting) {
        setCustomWaterWeight(Math.round(next * 0.8));
      }
      return next;
    });
  };

  const handleSaveToPantry = () => {
    // 🛡️ Sprawdzenie dostępu: jeśli trial wygasł, wymuś Paywall
    if (!canCreate) {
      setIsPaywallOpen(true);
      return;
    }

    const newBatch = dbStore.createBatch({
      recipeId: activePreset ? `REC-${activePreset.id.toUpperCase()}` : 'REC-CUSTOM',
      recipeTitle: effectiveTitle,
      culture: 'Domowa kuchnia rzemieślnicza',
      method: effectiveDrySalting ? 'dry_salting' : 'lacto_fermentation',
      startedAt: Date.now(),
      targetFermentationDays: activePreset?.id === 'malosolne' ? 2 : 7,
      produceWeightGrams: produceWeightNum,
      waterWeightGrams: effectiveWaterWeight,
      saltWeightGrams: brineResult.saltGrams,
      salinityPercent: effectiveSalinity,
      status: 'fermenting',
      notes: `Nastaw 1-Tap: ${produceWeightNum}g surowca, ${brineResult.saltGrams}g soli (${effectiveSalinity}%).`,
    });

    const timeline = calculateFermentationTimeline(MASTER_RECIPES[0], Date.now(), 21);
    scheduleFermentationAlerts(newBatch.id, timeline).catch(() => {});

    Alert.alert(
      t('Partia nastawiona! 🫙'),
      t('Słoik "{title}" trafił do aktywnego kalendarza fermentacji. Zaplanowano przypomnienia o odgazowaniu (burping).', { title: newBatch.recipeTitle }),
      [{ text: t('Wspaniale!') }]
    );
  };

  const spoonsOfSalt = Math.round((brineResult.saltGrams / 15) * 10) / 10;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Nagłówek */}
        <View style={styles.header}>
          <Text style={theme.typography.heroTitle}>{t('Kalkulator Solanki 🥒')}</Text>
          <Text style={styles.tagline}>
            {t('Tryb 1-Tap „Do Słoika na Wagę”. Idealna chrupkość w mniej niż 20 sekund.')}
          </Text>
        </View>

        {/* 1. SELEKTOR SZYBKIEGO NASTAWU */}
        <Text style={styles.sectionLabel}>{t('Co dzisiaj kisisz?')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
          {QUICK_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <TouchableOpacity
                key={preset.id}
                onPress={() => handleSelectPreset(preset)}
                activeOpacity={0.7}
                style={[styles.presetChip, isSelected && styles.presetChipActive]}
              >
                <Text style={[styles.presetChipText, isSelected && styles.presetChipTextActive]}>
                  {t(preset.name)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 2. KROK 1: ILE MASZ WARZYW? (ZASADA BRUDNEGO KCIUKA - STEPPERY >= 52PT) */}
        <KitchenCard variant="elevated" style={styles.card}>
          <Text style={styles.cardHeaderTitle}>{t('1. Ile masz warzyw na wadze kuchennej?')}</Text>

          <View style={styles.stepperContainer}>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                onPress={() => handleAdjustWeight(-500)}
                style={styles.stepBtnLarge}
                activeOpacity={0.7}
              >
                <Text style={styles.stepBtnText}>-500g</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleAdjustWeight(-100)}
                style={styles.stepBtnSmall}
                activeOpacity={0.7}
              >
                <Text style={styles.stepBtnText}>-100g</Text>
              </TouchableOpacity>

              <View style={styles.weightDisplayBox}>
                <Text style={styles.weightNumber}>
                  {unitSystem === 'imperial'
                    ? formatProduceWeight(produceWeightNum, 'imperial')
                    : produceWeightNum >= 1000
                    ? `${(produceWeightNum / 1000).toFixed(1)} kg`
                    : `${produceWeightNum} g`}
                </Text>
                <Text style={styles.weightSublabel}>({produceWeightNum} g)</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleAdjustWeight(100)}
                style={styles.stepBtnSmall}
                activeOpacity={0.7}
              >
                <Text style={styles.stepBtnText}>+100g</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleAdjustWeight(500)}
                style={styles.stepBtnLarge}
                activeOpacity={0.7}
              >
                <Text style={styles.stepBtnText}>+500g</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KitchenCard>

        {/* 3. KROK 2: NATYCHMIASTOWA RECEPTA KUCHENNA */}
        <KitchenCard variant="highlight" style={styles.recipeBox}>
          <Text style={styles.recipeHeader}>{t('2. Wsyp dokładnie do słoika:')}</Text>

          <View style={styles.ingredientRow}>
            <Text style={styles.ingEmoji}>🧂</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.ingMain}>
                {t('Sól kamienna niejodowana:')}{' '}
                <Text style={styles.ingBold}>
                  {unitSystem === 'imperial'
                    ? `${formatSaltWeight(brineResult.saltGrams, 'imperial')} (${brineResult.saltGrams} g)`
                    : `${brineResult.saltGrams} g`}
                </Text>
              </Text>
              <Text style={styles.ingSub}>
                {t('(~{spoons} płaskiej łyżki stołowej · stężenie {salinity}%)', { spoons: spoonsOfSalt, salinity: effectiveSalinity })}
              </Text>
            </View>
          </View>

          <View style={styles.ingredientRow}>
            <Text style={styles.ingEmoji}>💧</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.ingMain}>
                {t('Woda przegotowana / przefiltrowana:')}{' '}
                <Text style={styles.ingBold}>
                  {effectiveDrySalting
                    ? t('0 ml (Sok własny)')
                    : unitSystem === 'imperial'
                    ? `${formatBrineVolume(effectiveWaterWeight, 'imperial')} (${effectiveWaterWeight} ml)`
                    : `${effectiveWaterWeight} ml`}
                </Text>
              </Text>
              <Text style={styles.ingSub}>
                {effectiveDrySalting
                  ? t('Solenie na sucho: po 20 min mocno ugnieć warzywa, aż puszczą sok')
                  : t('Ostudź do temperatury pokojowej (<22°C) przed zalaniem')}
              </Text>
            </View>
          </View>

          <View style={styles.ingredientRow}>
            <Text style={styles.ingEmoji}>🌿</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.ingMain}>{t('Dodatki rzemieślnika (Chrupkość i aromat):')}</Text>
              <Text style={styles.ingSub}>
                {activePreset?.herbs ? t(activePreset.herbs) : t('Czosnek, baldach kopru, kawałek chrzanu, liść dębu')}
              </Text>
            </View>
          </View>

          {/* PRZYCISK GŁÓWNY 1-TAP (52pt) */}
          <KitchenButton
            title={t('🫙 NASTAW SŁOIK W 1 TAP')}
            onPress={handleSaveToPantry}
            style={styles.oneTapButton}
          />
        </KitchenCard>

        {/* 4. PROGRESSIVE DISCLOSURE: AKORDEON DLA ZAAWANSOWANYCH */}
        <KitchenCard variant="default" style={styles.advancedAccordion}>
          <TouchableOpacity
            onPress={() => setIsAdvancedOpen(!isAdvancedOpen)}
            activeOpacity={0.7}
            style={styles.accordionHeader}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.accordionTitle}>
                {t('🔬 Parametry Rzemieślnicze & Chemia Kiszonki')}
              </Text>
              <Text style={styles.accordionSubtitle}>
                {t('Dla zaawansowanych: własne stężenie soli %, solenie na sucho, chlorki, pH')}
              </Text>
            </View>
            <Text style={styles.accordionArrow}>{isAdvancedOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {isAdvancedOpen && (
            <View style={styles.accordionBody}>
              <Text style={styles.advLabel}>{t('Własna nazwa partii:')}</Text>
              <TextInput
                style={styles.advInput}
                value={customTitle}
                onChangeText={setCustomTitle}
                placeholder={t('np. Ogórki z imbirem i chili')}
                placeholderTextColor={theme.colors.textMuted}
              />

              <View style={{ flexDirection: 'row', gap: 10, marginVertical: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.advLabel}>{t('Własna woda (ml):')}</Text>
                  <TextInput
                    style={styles.advInput}
                    keyboardType="numeric"
                    value={String(customWaterWeight)}
                    onChangeText={(tVal) => setCustomWaterWeight(parseInt(tVal, 10) || 0)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.advLabel}>{t('Pomiar pH:')}</Text>
                  <TextInput
                    style={styles.advInput}
                    keyboardType="numeric"
                    value={String(foodPh)}
                    onChangeText={(tVal) => setFoodPh(parseFloat(tVal) || 3.8)}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setIsDrySaltingCustom(!isDrySaltingCustom)}
              >
                <Text style={{ fontSize: 18 }}>{isDrySaltingCustom ? '☑️' : '◻️'}</Text>
                <Text style={styles.toggleText}>
                  {t('Wymuś solenie na sucho (Dry Salting — bez wody)')}
                </Text>
              </TouchableOpacity>

              <Text style={[styles.advLabel, { marginTop: 8 }]}>
                {t('Precyzyjne stężenie soli (%):')}
              </Text>
              <View style={styles.saltChipsRow}>
                {[1.8, 2.0, 2.2, 2.5, 3.0, 3.5].map((sal) => (
                  <TouchableOpacity
                    key={sal}
                    onPress={() => setCustomSalinityPct(sal)}
                    style={[
                      styles.saltChip,
                      customSalinityPct === sal && styles.saltChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.saltChipText,
                        customSalinityPct === sal && styles.saltChipTextActive,
                      ]}
                    >
                      {sal}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {brineResult.calciumChlorideGrams && (
                <Text style={styles.advTip}>
                  💡 Wzmocnienie mostków pektynowych: dodaj{' '}
                  <Text style={{ fontWeight: '700' }}>
                    {brineResult.calciumChlorideGrams} g CaCl₂
                  </Text>{' '}
                  lub świeży liść dębu szypułkowego.
                </Text>
              )}

              <View style={styles.safetyBox}>
                <Text style={styles.safetyHeader}>
                  {safetyResult.isSafeForWaterBath ? t('✅ Bezpieczeństwo biologiczne USDA') : t('⚠️ Ostrzeżenie USDA')}
                </Text>
                <Text style={styles.safetyText}>
                  {safetyResult.isSafeForWaterBath
                    ? t('Produkt kwaśny (pH < 4.60). Czas pasteryzacji słoika 1L: {minutes} minut.', { minutes: safetyResult.targetMinutes })
                    : safetyResult.safetyWarning}
                </Text>
              </View>
            </View>
          )}
        </KitchenCard>
      </ScrollView>

      {/* Paywall przy próbie tworzenia po wygaśnięciu trialu */}
      <PaywallModal
        visible={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        reasonTitle={t('Okres próbny wygasł 🫙')}
        reasonSubtitle={t('Twoja dotychczasowa spiżarnia i przepisy są zawsze bezpieczne w trybie Read-Only. Odblokuj tworzenie nowych słoików taniej niż kawa espresso ($0.99 / $4.99)!')}
      />
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
    marginBottom: theme.spacing.md,
  },
  tagline: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  presetScroll: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.bgSecondary,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 44,
    justifyContent: 'center',
  },
  presetChipActive: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  presetChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  presetChipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  card: {
    padding: theme.spacing.md,
    marginBottom: 12,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  stepperContainer: {
    alignItems: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
  },
  stepBtnLarge: {
    minHeight: 52,
    minWidth: 54,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnSmall: {
    minHeight: 52,
    minWidth: 48,
    paddingHorizontal: 6,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  weightDisplayBox: {
    minHeight: 52,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.pickleGreen,
    marginHorizontal: 4,
  },
  weightNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.pickleGreen,
  },
  weightSublabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  recipeBox: {
    padding: theme.spacing.md,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.pickleGreen,
  },
  recipeHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.pickleGreen,
    marginBottom: 12,
  },
  ingredientRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  ingEmoji: {
    fontSize: 22,
    marginRight: 10,
    width: 26,
  },
  ingMain: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  ingBold: {
    fontWeight: '800',
    color: theme.colors.pickleGreen,
  },
  ingSub: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  oneTapButton: {
    marginTop: 14,
    minHeight: 52,
  },
  advancedAccordion: {
    padding: theme.spacing.md,
    marginBottom: 20,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  accordionSubtitle: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  accordionArrow: {
    fontSize: 16,
    color: theme.colors.pickleGreen,
    paddingLeft: 8,
  },
  accordionBody: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  advLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  advInput: {
    backgroundColor: theme.colors.bgSecondary,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  toggleText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    marginLeft: 8,
    fontWeight: '600',
  },
  saltChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  saltChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  saltChipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  advTip: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
    marginTop: 4,
    marginBottom: 8,
  },
  safetyBox: {
    backgroundColor: '#F3EFE6',
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    marginTop: 6,
  },
  safetyHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    marginBottom: 2,
  },
  safetyText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
});
