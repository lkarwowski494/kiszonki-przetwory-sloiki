// ============================================================================
// Słoik (Jarwise) — Craft Procedure Modal (Procedura Nastawu Krok po Kroku)
// (RD-ENG-07, BRD-FEAT-PROCEDURE)
// Asystent kuchenny:
// - Pasek postępu i miniatury wszystkich kroków na liście
// - Aktualny krok wielką, czytelną czcionką (ergonomia mokrych dłoni blatu)
// - AUTOMATYCZNY STOPER KROKU (jak przerwa między seriami): wykrywa czas w kroku
//   i automatycznie rozpoczyna odliczanie po wejściu w krok (z obsługą tła)
// - Przyciski: [Poprzedni krok] / [Krok zrobiony ✓] / [Zakończ i zapisz słoik 🫙]
// - Trzyma włączony ekran (useKeepAwake)
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  AppState,
} from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { theme } from '../theme';
import { t } from '../../lib/i18n';
import { CloseIcon } from '@apps4craft/ui';
import { notifyTimerFinished } from '../../core/timer-audio';
import {
  calculateRemainingTimerSec,
  pauseTimerTimestamp,
} from '../../core/timer/background-timer';

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

/**
 * Wykrywa czas trwania czynności z tekstu kroku (w sekundach).
 * Np. "10–15 minut" -> 600s, "15–30 minut" -> 900s, "20 min" -> 1200s.
 */
export function extractStepDurationSeconds(stepText: string): number | null {
  if (!stepText) return null;
  const lower = stepText.toLowerCase();

  // Zakres minut np. "10–15 minut", "15-30 min"
  const rangeMinMatch = lower.match(/(\d+)\s*[–-]\s*(\d+)\s*(?:minut|min|minutes)/);
  if (rangeMinMatch) {
    const mins = parseInt(rangeMinMatch[1], 10);
    if (mins > 0 && mins <= 240) return mins * 60;
  }

  // Pojedyncze minuty np. "20 minut", "15 min"
  const singleMinMatch = lower.match(/(\d+)\s*(?:minut|min|minutes)/);
  if (singleMinMatch) {
    const mins = parseInt(singleMinMatch[1], 10);
    if (mins > 0 && mins <= 240) return mins * 60;
  }

  // Sekundy np. "30 sekund", "45 sek"
  const secMatch = lower.match(/(\d+)\s*(?:sekund|sek|seconds|sec)/);
  if (secMatch) {
    const secs = parseInt(secMatch[1], 10);
    if (secs > 0 && secs <= 3600) return secs;
  }

  return null;
}

export const CraftProcedureModal: React.FC<CraftProcedureModalProps> = ({
  visible,
  onClose,
  recipeTitle,
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

  // Stan automatycznego stopera kroku (styl przerwy między seriami)
  const [stepDurationSec, setStepDurationSec] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isTimerFinished, setIsTimerFinished] = useState<boolean>(false);
  const endAtMsRef = useRef<number | null>(null);

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

  // Reset do kroku 0 przy otwarciu modalu
  useEffect(() => {
    if (visible) {
      setCurrentStepIndex(0);
    } else {
      setIsTimerRunning(false);
      endAtMsRef.current = null;
    }
  }, [visible]);

  // Automatyczne wykrywanie i auto-start stopera przy wejściu w krok (jak przerwa między seriami!)
  useEffect(() => {
    if (!visible) return;
    const detectedSec = extractStepDurationSeconds(currentStep);
    if (detectedSec && detectedSec > 0) {
      setStepDurationSec(detectedSec);
      setRemainingSeconds(detectedSec);
      setIsTimerFinished(false);
      endAtMsRef.current = Date.now() + detectedSec * 1000;
      setIsTimerRunning(true);
    } else {
      setStepDurationSec(0);
      setRemainingSeconds(0);
      setIsTimerRunning(false);
      setIsTimerFinished(false);
      endAtMsRef.current = null;
    }
  }, [currentStepIndex, currentStep, visible]);

  // Odliczanie czasu w interwale
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        if (endAtMsRef.current) {
          const rem = calculateRemainingTimerSec(endAtMsRef.current);
          setRemainingSeconds(rem);
          if (rem <= 0) {
            setIsTimerRunning(false);
            setIsTimerFinished(true);
            endAtMsRef.current = null;
            notifyTimerFinished(recipeTitle);
          }
        }
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, remainingSeconds, recipeTitle]);

  // Obsługa wybudzenia z tła (RD-ENG-06)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && isTimerRunning && endAtMsRef.current) {
        const rem = calculateRemainingTimerSec(endAtMsRef.current);
        setRemainingSeconds(rem);
        if (rem <= 0) {
          setIsTimerRunning(false);
          setIsTimerFinished(true);
          endAtMsRef.current = null;
          notifyTimerFinished(recipeTitle);
        }
      }
    });
    return () => sub.remove();
  }, [isTimerRunning, recipeTitle]);

  const handleToggleTimer = () => {
    if (!isTimerRunning) {
      const startSec = remainingSeconds > 0 ? remainingSeconds : stepDurationSec || 300;
      if (stepDurationSec === 0) setStepDurationSec(startSec);
      setRemainingSeconds(startSec);
      endAtMsRef.current = Date.now() + startSec * 1000;
      setIsTimerRunning(true);
      setIsTimerFinished(false);
    } else {
      if (endAtMsRef.current) {
        const left = pauseTimerTimestamp(endAtMsRef.current);
        setRemainingSeconds(left);
        endAtMsRef.current = null;
      }
      setIsTimerRunning(false);
    }
  };

  const handleAdjustTimer = (deltaSeconds: number) => {
    const nextSec = Math.max(10, remainingSeconds + deltaSeconds);
    setRemainingSeconds(nextSec);
    setStepDurationSec((prev) => Math.max(prev, nextSec));
    setIsTimerFinished(false);
    if (isTimerRunning) {
      endAtMsRef.current = Date.now() + nextSec * 1000;
    }
  };

  const handleResetTimer = () => {
    const base = stepDurationSec || 300;
    setRemainingSeconds(base);
    setIsTimerFinished(false);
    endAtMsRef.current = Date.now() + base * 1000;
    setIsTimerRunning(true);
  };

  const handleStartManualTimer = (mins: number) => {
    const secs = mins * 60;
    setStepDurationSec(secs);
    setRemainingSeconds(secs);
    setIsTimerFinished(false);
    endAtMsRef.current = Date.now() + secs * 1000;
    setIsTimerRunning(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
            {resolvedSteps.map((stepStr, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const hasTimer = extractStepDurationSeconds(stepStr) !== null;
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
                    {isPast ? `✓ ${idx + 1}` : `${idx + 1}${hasTimer ? ' ⏱️' : ''}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* KARTA GŁÓWNEGO KROKU (DUŻA CZCIONKA BLATU + AUTO-STOPER) */}
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

            {/* ============================================================ */}
            {/* WBUDOWANY AUTOMATYCZNY STOPER KROKU (JAK PRZERWA MIĘDZY SERIAMI) */}
            {/* ============================================================ */}
            {stepDurationSec > 0 ? (
              <View
                style={[
                  styles.autoTimerCard,
                  isTimerFinished && styles.autoTimerCardFinished,
                ]}
              >
                <View style={styles.autoTimerHeader}>
                  <Text style={styles.autoTimerBadge}>
                    {isTimerFinished
                      ? t('🔔 CZAS KROKU MINĄŁ!')
                      : isTimerRunning
                      ? t('⚡ AUTO-STOPER KROKU (ODLICZANIE)')
                      : t('⏸️ STOPER KROKU WSTRZYMANY')}
                  </Text>
                </View>

                <Text style={styles.autoTimerDigits}>{formatTime(remainingSeconds)}</Text>

                <View style={styles.autoTimerControls}>
                  <TouchableOpacity
                    style={styles.timerDeltaBtn}
                    onPress={() => handleAdjustTimer(-60)}
                    hitSlop={theme.hitSlop}
                  >
                    <Text style={styles.timerDeltaText}>-1 min</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.timerMainBtn,
                      isTimerRunning && styles.timerMainBtnPause,
                    ]}
                    onPress={handleToggleTimer}
                    hitSlop={theme.hitSlop}
                  >
                    <Text style={styles.timerMainBtnText}>
                      {isTimerRunning ? t('⏸️ Pauza') : t('▶️ Wznów')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.timerDeltaBtn}
                    onPress={() => handleAdjustTimer(60)}
                    hitSlop={theme.hitSlop}
                  >
                    <Text style={styles.timerDeltaText}>+1 min</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.timerDeltaBtn}
                    onPress={handleResetTimer}
                    hitSlop={theme.hitSlop}
                  >
                    <Text style={styles.timerDeltaText}>↺</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.manualTimerRow}>
                <Text style={styles.manualTimerHint}>{t('Potrzebujesz minutnika na ten etap?')}</Text>
                <View style={styles.manualTimerBtns}>
                  {[5, 10, 15, 20].map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={styles.manualTimerChip}
                      onPress={() => handleStartManualTimer(m)}
                      hitSlop={theme.hitSlop}
                    >
                      <Text style={styles.manualTimerChipText}>⏱️ {m} min</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

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
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.bgCard,
  },
  headerTitleCol: {
    flex: 1,
    marginRight: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.pickleGreen,
  },
  stepCounterText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.bgCardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientsStrip: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bgCardElevated,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stripItem: {
    alignItems: 'center',
  },
  stripLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  stripValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '800',
    marginTop: 2,
  },
  stripDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: theme.colors.bgCard,
    width: '100%',
  },
  progressBarFill: {
    height: 5,
    backgroundColor: theme.colors.pickleGreen,
  },
  stepsCarouselContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  stepsCarousel: {
    paddingHorizontal: 16,
    gap: 8,
  },
  stepPill: {
    minWidth: 44,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textSecondary,
  },
  stepPillTextCurrent: {
    color: '#FFFFFF',
  },
  stepPillTextPast: {
    color: theme.colors.pickleGreenLight,
  },
  mainContent: {
    flex: 1,
  },
  mainContentInner: {
    padding: 18,
    paddingBottom: 32,
  },
  heroStepCard: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.pickleGreen,
    padding: 22,
  },
  heroStepBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  stepNumBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.pickleGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumBubbleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  heroStepLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.pickleGreen,
  },
  heroStepInstruction: {
    fontSize: 21,
    lineHeight: 31,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 18,
  },
  autoTimerCard: {
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1.5,
    borderColor: theme.colors.amberBrine,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  autoTimerCardFinished: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: theme.colors.pickleGreenMuted,
  },
  autoTimerHeader: {
    marginBottom: 6,
  },
  autoTimerBadge: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: theme.colors.amberBrine,
  },
  autoTimerDigits: {
    fontSize: 48,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    fontVariant: ['tabular-nums'],
    marginVertical: 6,
  },
  autoTimerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  timerDeltaBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerDeltaText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textSecondary,
  },
  timerMainBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.pickleGreen,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerMainBtnPause: {
    backgroundColor: theme.colors.amberBrine,
  },
  timerMainBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  manualTimerRow: {
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  manualTimerHint: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  manualTimerBtns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  manualTimerChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  manualTimerChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  tipBox: {
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.pickleGreen,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSecondary,
  },
  craftTipBox: {
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.amberBrine,
  },
  craftTipTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.amberBrine,
    marginBottom: 4,
  },
  craftTipText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSecondary,
  },
  footer: {
    padding: 16,
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 52,
    justifyContent: 'center',
  },
  prevBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  nextBtn: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.pickleGreen,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  finishBtn: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.pickleGreen,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  finishBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
