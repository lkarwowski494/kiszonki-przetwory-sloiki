import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  AppState,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { theme } from '../src/ui/theme';
import { KitchenCard } from '../src/ui/components/KitchenCard';
import { KitchenButton } from '../src/ui/components/KitchenButton';
import { ModalHeader } from '../src/ui/components/ModalHeader';
import { notifyTimerFinished } from '../src/core/timer-audio';
import {
  calculateRemainingTimerSec,
  pauseTimerTimestamp,
  startTimerTimestamp,
} from '../src/core/timer/background-timer';

export default function PasteurizerTimerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedMinutes, setSelectedMinutes] = useState(20);
  const [remainingSeconds, setRemainingSeconds] = useState(20 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const endAtMsRef = useRef<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        if (endAtMsRef.current) {
          const rem = calculateRemainingTimerSec(endAtMsRef.current);
          setRemainingSeconds(rem);
          if (rem <= 0) {
            setIsRunning(false);
            setIsFinished(true);
            endAtMsRef.current = null;
            notifyTimerFinished(`Gotowanie ${selectedMinutes} minut`);
            Alert.alert(
              'Czas minął! 🔔',
              'Zakończono pasteryzację! Wyjmij słoiki na ściereczkę i pozostaw do powolnego ostygnięcia dnem do góry.',
              [{ text: 'Zrozumiałem' }]
            );
          }
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds, selectedMinutes]);

  // Obsługa wybudzenia z tła (RD-ENG-06, NFR-PERF-004)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && isRunning && endAtMsRef.current) {
        const rem = calculateRemainingTimerSec(endAtMsRef.current);
        setRemainingSeconds(rem);
        if (rem <= 0) {
          setIsRunning(false);
          setIsFinished(true);
          endAtMsRef.current = null;
          notifyTimerFinished(`Gotowanie ${selectedMinutes} minut`);
        }
      }
    });
    return () => sub.remove();
  }, [isRunning, selectedMinutes]);

  const handleSetTime = (minutes: number) => {
    setIsRunning(false);
    setIsFinished(false);
    endAtMsRef.current = null;
    setSelectedMinutes(minutes);
    setRemainingSeconds(minutes * 60);
  };

  const toggleTimer = () => {
    if (!isRunning) {
      endAtMsRef.current = Date.now() + remainingSeconds * 1000;
      setIsRunning(true);
      setIsFinished(false);
    } else {
      if (endAtMsRef.current) {
        const left = pauseTimerTimestamp(endAtMsRef.current);
        setRemainingSeconds(left);
        endAtMsRef.current = null;
      }
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsFinished(false);
    endAtMsRef.current = null;
    setRemainingSeconds(selectedMinutes * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ModalHeader
        title="Stoper Pasteryzacji"
        onClose={() => router.back()}
        closeLabel="Zamknij"
      />

      <View style={styles.container}>
        {/* Wybór pojemności słoika */}
        <Text style={styles.pickerLabel}>Wybierz czas dla pojemności słoika:</Text>
        <View style={styles.timeButtonsRow}>
          {[
            { label: 'Słoik 350ml (10 min)', min: 10 },
            { label: 'Słoik 500ml (15 min)', min: 15 },
            { label: 'Słoik 1L (20 min)', min: 20 },
            { label: 'Słoik duży (30 min)', min: 30 },
          ].map((item) => (
            <TouchableOpacity
              key={item.min}
              onPress={() => handleSetTime(item.min)}
              style={[
                styles.timeChip,
                selectedMinutes === item.min && styles.timeChipActive,
              ]}
            >
              <Text
                style={[
                  styles.timeChipText,
                  selectedMinutes === item.min && styles.timeChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Wielki Cyfrowy Zegar Kuchenny */}
        <KitchenCard variant="highlight" style={styles.timerCard}>
          <Text style={styles.timerDigits}>{formatTime(remainingSeconds)}</Text>
          <Text style={styles.timerState}>
            {isRunning ? '🔥 GOTOWANIE W TOKU...' : isFinished ? '✅ GOTOWE!' : '⏸️ WSTRZYMANO'}
          </Text>
        </KitchenCard>

        {/* Przyciski Sterowania */}
        <View style={styles.controlsRow}>
          <KitchenButton
            title={isRunning ? 'Pauza ⏸️' : 'Start Pasteryzacji ▶️'}
            variant={isRunning ? 'secondary' : 'primary'}
            onPress={toggleTimer}
            style={{ flex: 2, marginRight: 8 }}
          />
          <KitchenButton
            title="Reset ↺"
            variant="ghost"
            onPress={resetTimer}
            style={{ flex: 1 }}
          />
        </View>

        {/* Porada po pasteryzacji */}
        <KitchenCard variant="default" style={styles.tipCard}>
          <Text style={styles.tipHeader}>🔍 Test Wieczka (Po 12–24h):</Text>
          <Text style={styles.tipBody}>
            Gdy słoiki całkowicie ostygną, naciśnij palcem środek wieczka Twist-Off. Musi być wklęsłe i sztywne. Jeśli sprężynuje („klika”), słoik nie trzyma próżni i należy go zużyć w pierwszej kolejności.
          </Text>
        </KitchenCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  container: {
    padding: theme.spacing.lg,
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  timeButtonsRow: {
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  timeChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  timeChipActive: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  timeChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  timeChipTextActive: {
    color: '#FFF',
  },
  timerCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    marginVertical: theme.spacing.md,
  },
  timerDigits: {
    fontSize: 64,
    fontWeight: '800',
    color: theme.colors.pickleGreen,
    fontVariant: ['tabular-nums'],
  },
  timerState: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginTop: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  tipCard: {
    marginTop: 'auto',
  },
  tipHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    marginBottom: 4,
  },
  tipBody: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
