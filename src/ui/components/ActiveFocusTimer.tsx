// ============================================================================
// Słoik (Jarwise) — Active Focus Timer (Tryb Skupienia Blatu Kuchennego)
// Ergonomia rąk kuchennych:
// - Gigantyczny zegar widoczny z odległości 2-3 metrów
// - Ekran nie gaśnie (expo-keep-awake)
// - Sygnalizacja dźwiękowa i haptyczna po ukończeniu (expo-audio)
// - Wskazówki krok po kroku
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { theme } from '../theme';
import { t } from '../../lib/i18n';
import { notifyTimerFinished } from '../../core/timer-audio';
import { CloseIcon } from '@apps4craft/ui';

interface ActiveFocusTimerProps {
  title: string;
  defaultSeconds?: number;
  steps?: string[];
  onFinish?: () => void;
  onClose?: () => void;
}

export const ActiveFocusTimer: React.FC<ActiveFocusTimerProps> = ({
  title,
  defaultSeconds = 900, // 15 minut domyślnie
  steps = [
    t('Umyj warzywa i przygotuj czyste słoiki.'),
    t('Odważ dokładnie sól kamienną lub morską.'),
    t('Ułóż przyprawy i zalej solanką lub ugnieć do puszczenia soku.'),
    t('Dociśnij surowiec poniżej lustra płynu i zamknij słoik.'),
  ],
  onFinish,
  onClose,
}) => {
  // Trzymaj ekran aktywny podczas pracy przy blacie
  useKeepAwake();

  const [secondsLeft, setSecondsLeft] = useState<number>(defaultSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            notifyTimerFinished(title).catch(() => {});
            if (onFinish) onFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, title, onFinish]);

  const toggleRunning = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(defaultSeconds);
  };

  const addMinutes = (mins: number) => {
    setSecondsLeft((prev) => Math.max(0, prev + mins * 60));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container} accessibilityRole="timer">
      <View style={styles.headerRow}>
        <Text style={styles.focusBadge}>🔥 {t('TRYB AKTYWNEGO SKUPIENIA')}</Text>
        {onClose && (
          <TouchableOpacity
            onPress={onClose}
            hitSlop={theme.hitSlop}
            style={styles.closeBtn}
            accessibilityLabel={t('Zwiń zegar')}
          >
            <CloseIcon size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.timerTitle} numberOfLines={2}>
        {title}
      </Text>

      {/* Gigantyczny Zegar Kuchenny */}
      <View style={styles.clockBox}>
        <Text
          style={[
            styles.clockDigits,
            secondsLeft === 0 && styles.clockDigitsFinished,
          ]}
          accessibilityLabel={`${Math.floor(secondsLeft / 60)} minut ${secondsLeft % 60} sekund`}
        >
          {formatTime(secondsLeft)}
        </Text>
        <Text style={styles.keepAwakeHint}>
          💡 {t('Ekran pozostanie włączony podczas przygotowania')}
        </Text>
      </View>

      {/* Przyciski Szybkiego Dodawania Czasu */}
      <View style={styles.presetButtonsRow}>
        <TouchableOpacity
          style={styles.timeAdjBtn}
          onPress={() => addMinutes(1)}
          hitSlop={theme.hitSlop}
        >
          <Text style={styles.timeAdjText}>+1 min</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.timeAdjBtn}
          onPress={() => addMinutes(5)}
          hitSlop={theme.hitSlop}
        >
          <Text style={styles.timeAdjText}>+5 min</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.timeAdjBtn}
          onPress={() => addMinutes(10)}
          hitSlop={theme.hitSlop}
        >
          <Text style={styles.timeAdjText}>+10 min</Text>
        </TouchableOpacity>
      </View>

      {/* Przyciski Sterowania (48pt+ Ergonomia) */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[
            styles.primaryActionBtn,
            isRunning ? styles.pauseBtn : styles.startBtn,
          ]}
          onPress={toggleRunning}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryActionText}>
            {isRunning ? t('Wstrzymaj ⏸️') : t('Rozpocznij ▶️')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryActionBtn}
          onPress={handleReset}
          activeOpacity={0.8}
          hitSlop={theme.hitSlop}
        >
          <Text style={styles.secondaryActionText}>{t('Zresetuj ↺')}</Text>
        </TouchableOpacity>
      </View>

      {/* Wskazówki Krok po Kroku */}
      {steps.length > 0 && (
        <View style={styles.stepsCard}>
          <Text style={styles.stepsHeader}>📋 {t('Procedura Krok po Kroku:')}</Text>
          <ScrollView style={styles.stepsScroll} nestedScrollEnabled>
            {steps.map((stepText, idx) => {
              const isCurrent = idx === activeStepIndex;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.stepItem, isCurrent && styles.stepItemActive]}
                  onPress={() => setActiveStepIndex(idx)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.stepNumberBadge,
                      isCurrent && styles.stepNumberBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepNumberText,
                        isCurrent && styles.stepNumberTextActive,
                      ]}
                    >
                      {idx + 1}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.stepText,
                      isCurrent && styles.stepTextActive,
                    ]}
                  >
                    {stepText}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  focusBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.amberBrine,
    letterSpacing: 0.6,
  },
  closeBtn: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
  timerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  clockBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bgSecondary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 18,
    marginVertical: 4,
  },
  clockDigits: {
    fontSize: 60,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  clockDigitsFinished: {
    color: theme.colors.berryRed,
  },
  keepAwakeHint: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 6,
    fontWeight: '500',
  },
  presetButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 12,
  },
  timeAdjBtn: {
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 6,
    paddingHorizontal: 14,
    minHeight: 36,
    justifyContent: 'center',
  },
  timeAdjText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    marginBottom: 12,
  },
  primaryActionBtn: {
    flex: 2,
    minHeight: theme.touchTarget.minHeight,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtn: {
    backgroundColor: theme.colors.pickleGreen,
  },
  pauseBtn: {
    backgroundColor: theme.colors.amberBrine,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryActionBtn: {
    flex: 1,
    minHeight: theme.touchTarget.minHeight,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  stepsCard: {
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    marginTop: 6,
  },
  stepsHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  stepsScroll: {
    maxHeight: 160,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: theme.borderRadius.sm,
  },
  stepItemActive: {
    backgroundColor: theme.colors.pickleGreenMuted,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepNumberBadgeActive: {
    backgroundColor: theme.colors.pickleGreen,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  stepNumberTextActive: {
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  stepTextActive: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
});
