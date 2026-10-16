import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { dbStore } from '../src/data/db/database';
import { theme } from '../src/ui/theme';
import { KitchenCard } from '../src/ui/components/KitchenCard';
import { KitchenButton } from '../src/ui/components/KitchenButton';
import { ModalHeader } from '../src/ui/components/ModalHeader';

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { Badge } from '../src/ui/components/Badge';
import { useAppAccess } from '../src/core/access/app-access';
import { PaywallModal } from '../src/ui/components/PaywallModal';

export default function SettingsScreen() {
  const router = useRouter();
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  const { status, isSubscribed, isTrialActive, isTrialExpired, daysLeftInTrial, setDebugState } = useAppAccess();

  const batches = dbStore.getAllBatches();
  const activeFerments = dbStore.getActiveFerments();
  const pantryItems = dbStore.getPantryItems();

  const handleExportJson = async () => {
    const jsonStr = dbStore.exportBackupJson();
    try {
      if (FileSystem.documentDirectory) {
        const fileUri = `${FileSystem.documentDirectory}sloik_backup_${Date.now()}.json`;
        await FileSystem.writeAsStringAsync(fileUri, jsonStr, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/json',
            dialogTitle: 'Eksport kopii zapasowej Słoika',
            UTI: 'public.json',
          });
          return;
        }
      }
    } catch {
      // Fallback do schowka
    }

    await Clipboard.setStringAsync(jsonStr);
    Alert.alert(
      'Skopiowano do schowka! 📋',
      `Kopia zapasowa (${batches.length} partii, ${pantryItems.length} słoików) została zapisana w schowku systemowym.`
    );
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setImportJsonText(text);
      }
    } catch {
      // no-op
    }
  };

  const handleImportJson = () => {
    if (!importJsonText.trim()) {
      Alert.alert('Błąd', 'Wklej poprawny ciąg znaków JSON przed importem.');
      return;
    }

    const success = dbStore.importBackupJson(importJsonText);
    if (success) {
      Alert.alert('Sukces! 🎉', 'Baza danych została pomyślnie przywrócona z kopii zapasowej.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Błąd importu', 'Podany tekst nie jest prawidłowym plikiem kopii zapasowej Słoika.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ModalHeader
        title="Ustawienia & Kopia"
        onClose={() => router.back()}
        closeLabel="Zamknij"
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* STATYSTYKI SPIŻARNI */}
        <KitchenCard variant="highlight" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📊 Twoja Spiżarnia w Liczbach</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{batches.length}</Text>
              <Text style={styles.statLabel}>Nastawionych partii</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{activeFerments.length}</Text>
              <Text style={styles.statLabel}>Aktywne na blacie</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{pantryItems.length}</Text>
              <Text style={styles.statLabel}>Słoiki w piwnicy</Text>
            </View>
          </View>
        </KitchenCard>

        {/* MODEL MONETYZACJI & DOSTĘP APPS4BREW */}
        <KitchenCard variant={isSubscribed ? 'highlight' : 'elevated'} style={styles.sectionCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Text style={styles.sectionTitle}>💎 Model „Taniej niż espresso”</Text>
            <Badge
              label={
                isSubscribed
                  ? 'PEŁNY DOSTĘP (PRO)'
                  : isTrialActive
                  ? `TRIAL (${daysLeftInTrial} DNI)`
                  : 'TRYB READ-ONLY'
              }
              variant={isSubscribed ? 'green' : isTrialActive ? 'amber' : 'red'}
            />
          </View>

          <Text style={styles.sectionDesc}>
            {isSubscribed
              ? 'Posiadasz nielimitowany dostęp do tworzenia partii, etykiet PDF, radaru i laboratorium eksperymentów.'
              : isTrialActive
              ? `W okresie próbnym (pozostało ${daysLeftInTrial} dni) masz dostęp do 100% możliwości aplikacji. Twoja historia jest zawsze czytelna!`
              : 'Twój okres próbny dobiegł końca. Wszystkie archiwalne słoiki i spiżarnia są w 100% bezpieczne w trybie Read-Only. Odblokuj tworzenie nowych partii taniej niż kawa espresso.'}
          </Text>

          {!isSubscribed && (
            <KitchenButton
              title="Zobacz plany ($0.99 / $4.99 / $14.99) ✨"
              onPress={() => setIsPaywallOpen(true)}
              style={{ marginVertical: 8 }}
            />
          )}

          {/* Tester stanów (Developer / Offline QA) */}
          <View style={{ marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: theme.colors.border }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary, marginBottom: 6 }}>
              🧪 Tester stanów dostępu (Offline QA):
            </Text>
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
              <TouchableOpacity
                onPress={() => setDebugState('trial_active')}
                style={[styles.debugChip, isTrialActive && styles.debugChipActive]}
              >
                <Text style={styles.debugChipText}>Trial Aktywny</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDebugState('trial_expired')}
                style={[styles.debugChip, isTrialExpired && styles.debugChipActive]}
              >
                <Text style={styles.debugChipText}>Trial Wygasł</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDebugState('subscribed')}
                style={[styles.debugChip, isSubscribed && styles.debugChipActive]}
              >
                <Text style={styles.debugChipText}>Subskrypcja</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDebugState('reset')}
                style={styles.debugChip}
              >
                <Text style={styles.debugChipText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KitchenCard>

        {/* KOPIA ZAPASOWA (ZERO DATA LOSS) */}
        <KitchenCard variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>💾 Kopia Zapasowa (Zero Data Loss)</Text>
          <Text style={styles.sectionDesc}>
            Wszystkie Twoje receptury, czasy fermentacji i stany spiżarni są przechowywane w 100% lokalnie na Twoim urządzeniu. Możesz je w każdej chwili wyeksportować.
          </Text>

          <KitchenButton
            title="Eksportuj bazę do JSON 📤"
            variant="secondary"
            onPress={handleExportJson}
            style={{ marginVertical: 6 }}
          />

          <KitchenButton
            title={showImportBox ? "Ukryj pole importu" : "Przywróć bazę z pliku JSON 📥"}
            variant="ghost"
            onPress={() => setShowImportBox(!showImportBox)}
          />

          {showImportBox && (
            <View style={styles.importBox}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={styles.importPrompt}>Wklej kopię JSON:</Text>
                <TouchableOpacity onPress={handlePasteFromClipboard} style={{ padding: 4 }}>
                  <Text style={{ fontSize: 13, color: theme.colors.pickleGreen, fontWeight: '600' }}>Wklej ze schowka 📋</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.importInput}
                multiline
                numberOfLines={4}
                value={importJsonText}
                onChangeText={setImportJsonText}
                placeholder="Wklej JSON..."
                placeholderTextColor={theme.colors.textMuted}
              />
              <KitchenButton
                title="Zatwierdź i przywróć dane"
                variant="primary"
                onPress={handleImportJson}
                style={{ marginTop: 8 }}
              />
            </View>
          )}
        </KitchenCard>

        {/* DOKUMENTY PRAWNE I PRYWATNOŚĆ (APPLE APP STORE REQUIREMENT) */}
        <KitchenCard variant="default" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚖️ Prywatność i Regulamin</Text>
          <Text style={styles.sectionDesc}>
            Aplikacja Słoik jest w 100% Offline-First. Twoje receptury, historia i zdjęcia pozostają wyłącznie na Twoim urządzeniu.
          </Text>

          <TouchableOpacity
            style={styles.legalRow}
            onPress={() =>
              Alert.alert(
                'Polityka Prywatności 🛡️',
                'Zasada 100% Offline-First:\n• Zero trackerów, zero analityki (Data Not Collected)\n• Wszystkie słoiki i receptury są zapisywane wyłącznie w lokalnej bazie SQLite\n• Zero logowania i brak zewnętrznych serwerów bazy danych.\n\nSzczegóły: docs/PRIVACY_POLICY.md'
              )
            }
          >
            <Text style={styles.legalLink}>🛡️ Polityka Prywatności (Data Not Collected)</Text>
            <Text style={styles.legalArrow}>➔</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.legalRow}
            onPress={() =>
              Alert.alert(
                'Regulamin i Warunki Subskrypcji 📜',
                'Model „Taniej niż espresso”:\n• 100% funkcji odblokowanych w okresie próbnym\n• Po zakończeniu trialu Twoja historia jest ZAWSZE w 100% dostępna w trybie Read-Only\n• Subskrypcje: $0.99/msc (~4,49 zł), $4.99/rok (~22,99 zł z 7-dniowym trialem), $14.99 Lifetime (~69,99 zł na zawsze).\n\nSzczegóły: docs/TERMS_OF_SERVICE.md'
              )
            }
          >
            <Text style={styles.legalLink}>📜 Warunki Korzystania i Subskrypcji (EULA)</Text>
            <Text style={styles.legalArrow}>➔</Text>
          </TouchableOpacity>
        </KitchenCard>

        {/* O APLIKACJI I STANDARDY APPS4BREW */}
        <KitchenCard variant="default" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>ℹ️ O Aplikacji</Text>
          <Text style={styles.aboutText}>
            <Text style={{ fontWeight: '700' }}>Słoik (Jarwise)</Text> — Wersja 1.0.0 (Wydanie produkcyjne)
          </Text>
          <Text style={styles.aboutText}>
            Ekosystem: <Text style={{ fontWeight: '700' }}>Apps4Brew Studio</Text> (Napar, Piekarz, Organizer, Słoik)
          </Text>
          <Text style={styles.aboutText}>
            Architektura: <Text style={{ fontWeight: '700' }}>100% Offline-First SQLite WAL</Text>
          </Text>
          <Text style={styles.aboutText}>
            Prywatność: <Text style={{ fontWeight: '700' }}>Data Not Collected</Text> (Zero SDKs, zero telemetry)
          </Text>
        </KitchenCard>
      </ScrollView>

      <PaywallModal
        visible={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  debugChip: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  debugChipActive: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  debugChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  container: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  sectionCard: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  sectionDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.sm,
    marginHorizontal: 3,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.pickleGreen,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  importBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  importPrompt: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  importInput: {
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    fontSize: 12,
    fontFamily: 'monospace',
    color: theme.colors.textPrimary,
    height: 80,
    textAlignVertical: 'top',
  },
  proBox: {
    marginTop: 6,
  },
  proHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    marginBottom: 4,
  },
  proItem: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 20,
    paddingLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  priceChip: {
    flex: 1,
    padding: 10,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  priceChipActive: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  priceDuration: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  priceAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  aboutText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginVertical: 2,
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 6,
  },
  legalLink: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.pickleGreen,
  },
  legalArrow: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
});
