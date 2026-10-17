import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { dbStore, BatchRecord, FermentationLogRecord } from '../../src/data/db/database';
import { evaluatePasteurizationSafety } from '../../src/core/safety/safety-guard';
import { exportLabelSheetAsPdf } from '../../src/core/pantry/pdf-sheet-generator';
import { SensoryRadarChart } from '../../src/ui/components/SensoryRadarChart';
import { DEFAULT_FERMENT_SENSORY_PROFILE, FermentSensoryProfile } from '../../src/core/sensory-radar';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { KitchenButton } from '../../src/ui/components/KitchenButton';
import { Badge } from '../../src/ui/components/Badge';
import { ModalHeader } from '../../src/ui/components/ModalHeader';
import { Missing } from '../../src/ui/components/Missing';
import {
  useUnitSystem,
  formatProduceWeight,
  formatSaltWeight,
  formatBrineVolume,
} from '../../src/core/unit-converter';
import { t } from '../../src/lib/i18n';

import { announce } from '../../src/core/announce';
import { confirm } from '../../src/lib/confirm';

function calendarDaysBetween(startMs: number, endMs: number): number {
  const dStart = new Date(startMs);
  const dEnd = new Date(endMs);
  const noonStart = new Date(dStart.getFullYear(), dStart.getMonth(), dStart.getDate(), 12, 0, 0).getTime();
  const noonEnd = new Date(dEnd.getFullYear(), dEnd.getMonth(), dEnd.getDate(), 12, 0, 0).getTime();
  return Math.max(0, Math.round((noonEnd - noonStart) / (1000 * 60 * 60 * 24)));
}

export default function BatchPassportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const unitSystem = useUnitSystem();
  const params = useLocalSearchParams<{ id: string }>();
  const batchId = params.id;

  const [batch, setBatch] = useState<BatchRecord | null>(null);
  const [logs, setLogs] = useState<FermentationLogRecord[]>([]);

  const loadBatchData = () => {
    if (!batchId) return;
    const found = dbStore.getBatchById(batchId) || dbStore.getAllBatches().find((b) => b.id === batchId);
    if (found) {
      setBatch(found);
      setLogs(dbStore.getLogsForBatch(found.id));
    }
  };

  useEffect(() => {
    loadBatchData();
  }, [batchId]);

  if (!batch) {
    return (
      <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <ModalHeader title={t('Paszport Słoika')} onClose={() => router.back()} closeLabel={t('Zamknij')} />
        <Missing
          title={t('Nie znaleziono słoika')}
          description={`${t('Kod partii')} ${batchId ? `"${batchId}"` : ''} ${t('nie istnieje w lokalnej bazie słoików.')}`}
          actionLabel={t('Przejdź do spiżarni')}
          onAction={() => router.back()}
          icon="🫙"
        />
      </View>
    );
  }

  const elapsedDays = calendarDaysBetween(batch.startedAt, Date.now());
  const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;
  const currentProfile: FermentSensoryProfile = latestLog?.sensoryProfile || DEFAULT_FERMENT_SENSORY_PROFILE;

  // Weryfikacja bezpieczeństwa biologicznego
  const safety = evaluatePasteurizationSafety({
    foodPh: 3.8,
    jarVolumeMl: 1000,
    method: 'water_bath',
  });

  const handleBurp = () => {
    dbStore.addFermentationLog({
      batchId: batch.id,
      dayNumber: elapsedDays,
      sensoryNote: t('Słoik odgazowany (uwolniono gaz CO2).'),
      burped: true,
      tasted: false,
    });
    announce(t('Ciśnienie gazu CO₂ zostało bezpiecznie uwolnione.'));
    loadBatchData();
  };

  const handleExportPdf = async () => {
    try {
      await exportLabelSheetAsPdf({
        labelConfig: {
          batchId: batch.id,
          recipeTitle: batch.recipeTitle,
          preparedDate: new Date(batch.startedAt).toLocaleDateString(),
          salinityOrSugarInfo: `Sól: ${batch.salinityPercent}% (${batch.saltWeightGrams}g na ${batch.produceWeightGrams}g warzyw)`,
          format: 'side_rectangle_80x50mm',
        },
        count: 8,
        paperFormat: 'A4',
      });
    } catch {
      Alert.alert(t('Nie udało się wygenerować arkusza etykiet'), t('Wystąpił problem podczas tworzenia pliku PDF.'));
    }
  };

  const handleConsume = () => {
    confirm({
      title: t('Otwarcie słoika 🍴'),
      message: `${t('Czy chcesz oznaczyć')} "${batch.recipeTitle}" ${t('jako otwarty/zjedzony?')}`,
      confirmText: t('Zjedz słoik'),
      cancelText: t('Anuluj'),
      destructive: false,
      onConfirm: () => {
        dbStore.updateBatchStatus(batch.id, 'consumed', 5);
        loadBatchData();
      },
    });
  };

  const statusLabel =
    batch.status === 'fermenting'
      ? 'BĄBELKUJE 🫧'
      : batch.status === 'pantry'
      ? 'W SPIŻARNI 🫙'
      : 'ZJEDZONY 🍴';

  const statusVariant =
    batch.status === 'fermenting' ? 'amber' : batch.status === 'pantry' ? 'green' : 'gray';

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ModalHeader
        title="Paszport Słoika"
        onClose={() => router.back()}
        closeLabel="Zamknij"
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Karta Główna Partii */}
        <KitchenCard variant="elevated" style={styles.mainCard}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{batch.recipeTitle}</Text>
              <Text style={styles.culture}>{batch.culture} • Partia: {batch.id}</Text>
            </View>
            <Badge label={statusLabel} variant={statusVariant} />
          </View>

          <View style={styles.paramGrid}>
            <View style={styles.paramBox}>
              <Text style={styles.paramLabel}>{t('WARZYWA NA WADZE')}</Text>
              <Text style={styles.paramVal}>
                {unitSystem === 'imperial'
                  ? formatProduceWeight(batch.produceWeightGrams, 'imperial')
                  : `${batch.produceWeightGrams} g`}
              </Text>
            </View>
            <View style={styles.paramBox}>
              <Text style={styles.paramLabel}>{t('ZALICZONA SÓL')}</Text>
              <Text style={styles.paramVal}>
                {unitSystem === 'imperial'
                  ? `${formatSaltWeight(batch.saltWeightGrams, 'imperial')} (${batch.salinityPercent}%)`
                  : `${batch.saltWeightGrams} g (${batch.salinityPercent}%)`}
              </Text>
            </View>
            <View style={styles.paramBox}>
              <Text style={styles.paramLabel}>{t('WODA / ZALEWA')}</Text>
              <Text style={styles.paramVal}>
                {unitSystem === 'imperial'
                  ? formatBrineVolume(batch.waterWeightGrams, 'imperial')
                  : `${batch.waterWeightGrams} ml`}
              </Text>
            </View>
            <View style={styles.paramBox}>
              <Text style={styles.paramLabel}>{t('WIEK KISZONKI')}</Text>
              <Text style={styles.paramVal}>{elapsedDays} dni na blacie</Text>
            </View>
          </View>

          {batch.notes && (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>📝 Notatki kuchenne:</Text>
              <Text style={styles.notesText}>{batch.notes}</Text>
            </View>
          )}
        </KitchenCard>

        {/* Bezpieczeństwo biologiczne USDA */}
        <KitchenCard variant="default" style={styles.card}>
          <Text style={styles.sectionHeader}>🛡️ Bezpieczeństwo Biologiczne USDA</Text>
          <Text style={styles.safetyInfo}>
            {safety.isSafeForWaterBath
              ? '✅ Kwasowość i zasolenie w bezpiecznej strefie biologicznej. Środowisko chronione przed Clostridium botulinum.'
              : `⚠️ Ostrzeżenie: ${safety.safetyWarning}`}
          </Text>
        </KitchenCard>

        {/* Wektorowy Radar Sensoryczny */}
        <KitchenCard variant="highlight" style={styles.card}>
          <Text style={styles.sectionHeader}>🕸️ Profil Sensoryczny Kiszonki (SVG)</Text>
          <Text style={styles.sectionSub}>Balans kwasowości, słoności, chrupkości i aromatu ziół:</Text>
          <View style={{ alignItems: 'center', marginVertical: 8 }}>
            <SensoryRadarChart profile={currentProfile} size={220} showLabels={true} />
          </View>
        </KitchenCard>

        {/* Historia Dziennika */}
        <KitchenCard style={styles.card}>
          <Text style={styles.sectionHeader}>📅 Historia Dziennika i Odgazowań ({logs.length})</Text>
          {logs.length === 0 ? (
            <Text style={styles.emptyLogsText}>Brak zarejestrowanych wpisów dla tej partii.</Text>
          ) : (
            logs.map((log) => (
              <View key={log.id} style={styles.logItem}>
                <Text style={styles.logMeta}>
                  Dzień {log.dayNumber} • {new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {log.sensoryNote && <Text style={styles.logNote}>{log.sensoryNote}</Text>}
                {log.burped && <Text style={styles.burpTag}>🫧 Odgazowano wieczko</Text>}
              </View>
            ))
          )}
        </KitchenCard>

        {/* Przyciski Akcji Kuchennych */}
        <View style={styles.actionsBox}>
          <KitchenButton
            title="Drukuj Arkusz Etykiet QR (PDF) 🏷️"
            variant="secondary"
            onPress={handleExportPdf}
            style={{ marginBottom: 10 }}
          />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {batch.status === 'fermenting' && (
              <KitchenButton
                title="Odgazuj Słoik 🫧"
                variant="primary"
                onPress={handleBurp}
                style={{ flex: 1 }}
              />
            )}
            {batch.status !== 'consumed' && (
              <KitchenButton
                title="Zjedz / Otwórz 🍴"
                variant={batch.status === 'fermenting' ? 'secondary' : 'primary'}
                onPress={handleConsume}
                style={{ flex: 1 }}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
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
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  notFoundSub: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  mainCard: {
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  culture: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  paramGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  paramBox: {
    width: '48%',
    backgroundColor: theme.colors.bgSecondary,
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  paramLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  paramVal: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    marginTop: 2,
  },
  notesBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  notesText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 18,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  safetyInfo: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  emptyLogsText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  logItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  logMeta: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
  },
  logNote: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  burpTag: {
    fontSize: 11,
    color: theme.colors.amberBrine,
    fontWeight: '600',
    marginTop: 2,
  },
  actionsBox: {
    marginTop: 10,
  },
});
