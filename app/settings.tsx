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

export default function SettingsScreen() {
  const router = useRouter();
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

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

        {/* WERSJA PRO APPS4BREW */}
        <KitchenCard variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⭐ Słoik Pro (Apps4Brew)</Text>
          <Text style={styles.sectionDesc}>
            Aplikacja Słoik jest wolna od reklam, trackerów i zewnętrznych chmur. Podstawowe narzędzia są i zawsze będą w 100% darmowe.
          </Text>

          <View style={styles.proBox}>
            <Text style={styles.proHeader}>Pakiet Słoik Pro zawiera:</Text>
            <Text style={styles.proItem}>• Nielimitowane generowanie etykiet PDF w wysokiej rozdzielczości</Text>
            <Text style={styles.proItem}>• Dostęp do aplikacji Apple Watch i Live Activities na Dynamic Island</Text>
            <Text style={styles.proItem}>• Pełny atlas 24 tradycji świata i zaawansowane filtry kwasowości</Text>
            <Text style={styles.proItem}>• Wsparcie dla Chmury Rodzinnej Apple (do 5 osób)</Text>

            <View style={styles.priceRow}>
              <TouchableOpacity
                style={styles.priceChip}
                onPress={() => Alert.alert('StoreKit', 'Wybrano subskrypcję roczną 19,99 zł z 14-dniowym okresem próbnym.')}
              >
                <Text style={styles.priceDuration}>ROK (14 DNI GRATIS)</Text>
                <Text style={styles.priceAmount}>19,99 zł / rok</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.priceChip, styles.priceChipActive]}
                onPress={() => Alert.alert('StoreKit', 'Wybrano licencję wieczystą Lifetime 59,99 zł.')}
              >
                <Text style={[styles.priceDuration, { color: '#FFF' }]}>NA ZAWSZE (LIFETIME)</Text>
                <Text style={[styles.priceAmount, { color: '#FFF' }]}>59,99 zł</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KitchenCard>

        {/* O APLIKACJI I STANDARDY APPS4BREW */}
        <KitchenCard variant="default" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>ℹ️ O Aplikacji</Text>
          <Text style={styles.aboutText}>
            <strong>Słoik (Jarwise)</strong> — Wersja 0.1.0 (Build 2026.10)
          </Text>
          <Text style={styles.aboutText}>
            Ekosystem: <strong>Apps4Brew Studio</strong> (Napar, Piekarz, Organizer, Słoik)
          </Text>
          <Text style={styles.aboutText}>
            Architektura: <strong>100% Offline-First SQLite WAL</strong>
          </Text>
          <Text style={styles.aboutText}>
            Prywatność: <strong>Data Not Collected</strong> (Zero SDKs, zero telemetry)
          </Text>
        </KitchenCard>
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
});
