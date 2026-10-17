// ============================================================================
// Słoik (Jarwise) — Craft Procedure Modal (Procedura Nastawu Krok po Kroku)
// (RD-ENG-07, BRD-FEAT-PROCEDURE)
// Asystent kuchenny:
// - Pasek postępu i miniatury wszystkich kroków na liście
// - Aktualny krok wielką, czytelną czcionką (ergonomia mokrych dłoni blatu)
// - Przyciski: [Poprzedni krok] / [Krok zrobiony ✓] / [Zakończ i zapisz słoik 🫙]
// - Trzyma włączony ekran (useKeepAwake)
// ============================================================================

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { theme } from '../theme';
import { t } from '../../lib/i18n';
import { CloseIcon } from '@apps4craft/ui';

export interface CraftProcedureModalProps {
  visible: boolean;
  onClose: () => void;
  recipeTitle: string;
  culture?: string;
  produceWeightGrams: number;
  saltWeightGrams: number;
  waterWeightGrams: number;
  salinityPercent: number;
  isDrySalting: boolean;
  herbs: string;
  steps: string[];
  craftTips?: string[];
  onCompleteAndSave: () => void;
}

export const CraftProcedureModal: React.FC<CraftProcedureModalProps> = ({
  visible,
  onClose,
  recipeTitle,
  culture,
  produceWeightGrams,
  saltWeightGrams,
  waterWeightGrams,
  salinityPercent,
  isDrySalting,
  herbs,
  steps,
  craftTips = [],
  onCompleteAndSave,
}) => {
  // Trzymaj ekran aktywny podczas pracy przy blacie kuchennym
  useKeepAwake();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Domyślne profesjonalne kroki rzemieślnicze, jeśli przepis nie ma własnych
  const defaultSteps = isDrySalting
    ? [
        t('Umyj dokładnie warzywa i przygotuj czyste, wyparzone słoiki lub naczynie kamionkowe.'),
        t('Poszatkuj warzywa drobno, wrzuć do dużej miski i zasyp odważoną solą kamienną ({salt}g na {produce}g warzyw).', {
          salt: saltWeightGrams,
          produce: produceWeightGrams,
        }),
        t('Energicznie ugniataj dłońmi przez 10–15 minut, aż warzywa zmiękną i puszczą obfity sok komórkowy.'),
        t('Dodaj przyprawy i zioła ({herbs}), po czym dokładnie wymieszaj z surowcem.', { herbs }),
        t('Upakuj warzywa ciasno w słoiku warstwa po warstwie, ubijając pięścią, by usunąć wszelkie pęcherzyki powietrza.'),
        t('Dociśnij warzywa dociskiem lub liściem poniżej lustra soku. Pozostaw 2–3 cm wolnej przestrzeni pod wieczkiem i zamknij słoik.'),
      ]
    : [
        t('Umyj dokładnie warzywa. W przypadku ogórków odetnij 2 mm końcówki od strony kwiatu (tam kryją się enzymy zmiękczające).'),
        t('Kąpiel lodowa: zanurz warzywa w bardzo zimnej wodzie z lodem na 15–30 minut, aby nasycić komórki turgorem i zapewnić żelazną chrupkość.'),
        t('Przygotuj solankę: rozpuść dokładnie {salt}g soli kamiennej w {water}ml niechlorowanej wody ({salinity}% stężenia).', {
          salt: saltWeightGrams,
          water: waterWeightGrams,
          salinity: salinityPercent,
        }),
        t('Na dnie czystego słoika ułóż część ziół i aromatów ({herbs}).', { herbs }),
        t('Ułóż warzywa ciasno w pozycji pionowej, przekładając resztą ziół, czosnku i chrzanu.'),
        t('Zalej słoik przygotowaną solanką tak, aby całkowicie przykryła warzywa. Pozostaw 2 cm wolnej przestrzeni pod wieczkiem i zamknij słoik.'),
      ];

  const resolvedSteps = steps && steps.length > 0 ? steps : defaultSteps;
  const totalSteps = resolvedSteps.length;
  const currentStep = resolvedSteps[currentStepIndex] || resolvedSteps[0];
  const isLastStep = currentStepIndex === totalSteps - 1;

  const handleNext = () => {
    if (isLastStep) {
      onCompleteAndSave();
    } else {
      setCurrentStepIndex((prev) => Math.min(totalSteps - 1, prev + 1));
    }
  };

  const handlePrev = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* NAGŁÓWEK */}
        <View style={styles.header}>
          <View style={styles.headerTitleCol}>
            <View style={styles.badgeRow}>
              <Text style={styles.badgeText}>{t('ASYSTENT BLATU KUCHENNEGO')}</Text>
              <Text style={styles.stepCounterText}>
                {t('Krok {current} z {total}', {
                  current: currentStepIndex + 1,
                  total: totalSteps,
                })}
              </Text>
            </View>
            <Text style={styles.recipeTitle} numberOfLines={1}>
              {recipeTitle}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            accessibilityLabel={t('Zamknij procedurę')}
            hitSlop={theme.hitSlop}
          >
            <CloseIcon size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* BELKA SKŁADNIKÓW / ŚWIĘTE LICZBY */}
        <View style={styles.ingredientsStrip}>
          <View style={styles.stripItem}>
            <Text style={styles.stripLabel}>{t('Surowiec')}</Text>
            <Text style={styles.stripValue}>{produceWeightGrams} g</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripItem}>
            <Text style={styles.stripLabel}>{t('Sól kamienna')}</Text>
            <Text style={styles.stripValue}>
              {saltWeightGrams} g ({salinityPercent}%)
            </Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripItem}>
            <Text style={styles.stripLabel}>{t('Płyn')}</Text>
            <Text style={styles.stripValue}>
              {isDrySalting ? t('Sok własny') : `${waterWeightGrams} ml`}
            </Text>
          </View>
        </View>

        {/* PASEK POSTĘPU */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((currentStepIndex + 1) / totalSteps) * 100}%` },
            ]}
          />
        </View>

        {/* LISTA KROKÓW (MINIATURY) */}
        <View style={styles.stepsCarouselContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stepsCarousel}
          >
            {resolvedSteps.map((_, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.stepPill,
                    isCurrent && styles.stepPillCurrent,
                    isPast && styles.stepPillPast,
                  ]}
                  onPress={() => setCurrentStepIndex(idx)}
                  hitSlop={theme.hitSlop}
                >
                  <Text
                    style={[
                      styles.stepPillText,
                      isCurrent && styles.stepPillTextCurrent,
                      isPast && styles.stepPillTextPast,
                    ]}
                  >
                    {isPast ? `✓ ${idx + 1}` : `${idx + 1}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* KARTA GŁÓWNEGO KROKU (DUŻA CZCIONKA BLATU) */}
        <ScrollView
          style={styles.mainContent}
          contentContainerStyle={styles.mainContentInner}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroStepCard}>
            <View style={styles.heroStepBadgeRow}>
              <View style={styles.stepNumBubble}>
                <Text style={styles.stepNumBubbleText}>{currentStepIndex + 1}</Text>
              </View>
              <Text style={styles.heroStepLabel}>
                {t('KROK {num} Z {total}', {
                  num: currentStepIndex + 1,
                  total: totalSteps,
                })}
              </Text>
            </View>

            {/* WIELKA CZYTELNA TREŚĆ KROKU */}
            <Text style={styles.heroStepInstruction}>{currentStep}</Text>

            {/* WSKAZÓWKA LUB AROMATY */}
            {herbs ? (
              <View style={styles.tipBox}>
                <Text style={styles.tipTitle}>🌿 {t('Przyprawy do tego etapu:')}</Text>
                <Text style={styles.tipText}>{herbs}</Text>
              </View>
            ) : null}

            {craftTips && craftTips.length > 0 && craftTips[currentStepIndex % craftTips.length] ? (
              <View style={styles.craftTipBox}>
                <Text style={styles.craftTipTitle}>💡 {t('Wskazówka Mistrza Rzemiosła:')}</Text>
                <Text style={styles.craftTipText}>
                  {craftTips[currentStepIndex % craftTips.length]}
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>

        {/* DOLNY PASEK STEROWANIA */}
        <View style={styles.footer}>
          <View style={styles.footerNav}>
            {currentStepIndex > 0 ? (
              <TouchableOpacity
                onPress={handlePrev}
                style={styles.prevBtn}
                accessibilityLabel={t('Poprzedni krok')}
                hitSlop={theme.hitSlop}
              >
                <Text style={styles.prevBtnText}>← {t('Poprzedni krok')}</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 100 }} />
            )}

            {isLastStep ? (
              <TouchableOpacity
                onPress={handleNext}
                style={styles.finishBtn}
                accessibilityLabel={t('Zakończ: Rozpocznij nastaw i zapisz słoik 🫙')}
              >
                <Text style={styles.finishBtnText}>
                  {t('Zakończ i zapisz słoik 🫙')}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleNext}
                style={styles.nextBtn}
                accessibilityLabel={t('Krok zrobiony')}
              >
                <Text style={styles.nextBtnText}>
                  {t('Krok zrobiony ✓ (Dalej →)')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitleCol: {
    flex: 1,
    marginRight: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  badgeText: {
    color: theme.colors.pickleGreen,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  stepCounterText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  recipeTitle: {
    color: theme.colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientsStrip: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bgCardElevated,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  stripItem: {
    alignItems: 'center',
  },
  stripLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  stripValue: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  stripDivider: {
    width: 1,
    height: 22,
    backgroundColor: theme.colors.border,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: theme.colors.bgCard,
    width: '100%',
  },
  progressBarFill: {
    height: 4,
    backgroundColor: theme.colors.pickleGreen,
  },
  stepsCarouselContainer: {
    backgroundColor: theme.colors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 8,
  },
  stepsCarousel: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stepPillCurrent: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  stepPillPast: {
    backgroundColor: theme.colors.pickleGreenMuted,
    borderColor: theme.colors.pickleGreen,
  },
  stepPillText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  stepPillTextCurrent: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  stepPillTextPast: {
    color: theme.colors.pickleGreenLight,
    fontWeight: '700',
  },
  mainContent: {
    flex: 1,
  },
  mainContentInner: {
    padding: 20,
    paddingBottom: 36,
  },
  heroStepCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  heroStepBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  stepNumBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.pickleGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumBubbleText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  heroStepLabel: {
    color: theme.colors.pickleGreen,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroStepInstruction: {
    color: theme.colors.textPrimary,
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 20,
    letterSpacing: 0.2,
  },
  tipBox: {
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  tipTitle: {
    color: theme.colors.pickleGreen,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  tipText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  craftTipBox: {
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.amberBrine,
    borderRadius: 12,
    padding: 14,
  },
  craftTipTitle: {
    color: theme.colors.amberBrine,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  craftTipText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.bgCard,
  },
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  prevBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  prevBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  nextBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.pickleGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  finishBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.pickleGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#7FD655',
  },
  finishBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
