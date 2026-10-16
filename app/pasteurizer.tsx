import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../src/ui/theme';
import { KitchenCard } from '../src/ui/components/KitchenCard';
import { KitchenButton } from '../src/ui/components/KitchenButton';
import { ModalHeader } from '../src/ui/components/ModalHeader';

import { notifyTimerFinished } from '../src/core/timer-audio';
import { useAppAccess } from '../src/core/access/app-access';
import { PaywallModal } from '../src/ui/components/PaywallModal';

export default function PasteurizerTimerScreen() {
  const router = useRouter();
  const { canCreate } = useAppAccess();
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(20);
  const [remainingSeconds, setRemainingSeconds] = useState(20 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    } else if (remainingSeconds === 0 && isRunning) {
      setIsRunning(false);
      setIsFinished(true);
      notifyTimerFinished(`Gotowanie ${selectedMinutes} minut`);
      Alert.alert(
        'Czas minął! 🔔',
        'Zakończono pasteryzację! Wyjmij słoiki na ściereczkę i pozostaw do powolnego ostygnięcia dnem do góry.',
        [{ text: 'Zrozumiałem' }]
      );
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds]);

  const handleSetTime = (minutes: number) => {
    setIsRunning(false);
    setIsFinished(false);
    setSelectedMinutes(minutes);
    setRemainingSeconds(minutes * 60);
  };

  const toggleTimer = () => {
    if (!isRunning && !canCreate) {
      setIsPaywallOpen(true);
      return;
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsFinished(false);
    setRemainingSeconds(selectedMinutes * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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

      <PaywallModal
        visible={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        reasonTitle="Okres próbny wygasł ⏱️"
        reasonSubtitle="Twoja historia przetworów i spiżarnia pozostają zawsze dostępne (Read-Only). Odblokuj stoper pasteryzacji i nielimitowane nastawy subskrybując taniej niż kawa espresso ($0.99 / $4.99)!"
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
