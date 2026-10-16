import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { dbStore, BatchRecord, FermentationLogRecord } from '../../src/data/db/database';
import { getRecipeById } from '../../src/core/recipes/recipes-data';
import { calculateFermentationTimeline } from '../../src/core/timeline/fermentation-timeline';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { KitchenButton } from '../../src/ui/components/KitchenButton';
import { Badge } from '../../src/ui/components/Badge';
import { ModalHeader } from '../../src/ui/components/ModalHeader';
import { Modal, TextInput } from 'react-native';
import { SensoryRadarChart } from '../../src/ui/components/SensoryRadarChart';
import {
  DEFAULT_FERMENT_SENSORY_PROFILE,
  FermentSensoryProfile,
} from '../../src/core/sensory-radar';

export default function FermentTimelineScreen() {
  const router = useRouter();
  const [activeBatches, setActiveBatches] = useState<BatchRecord[]>([]);
  const [activeBatchForLog, setActiveBatchForLog] = useState<BatchRecord | null>(null);
  const [logNote, setLogNote] = useState('');
  const [logPh, setLogPh] = useState('3.8');
  const [crispnessStars, setCrispnessStars] = useState(5);
  const [profileAcidity, setProfileAcidity] = useState(3);
  const [profileSalinity, setProfileSalinity] = useState(3);
  const [profileCrispness, setProfileCrispness] = useState(5);
  const [profileEffervescence, setProfileEffervescence] = useState(3);
  const [profileAroma, setProfileAroma] = useState(4);
  const [expandedRadarBatchId, setExpandedRadarBatchId] = useState<string | null>('batch_demo_01');

  const reloadData = () => {

    setActiveBatches(dbStore.getActiveFerments());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleBurp = (batchId: string) => {
    dbStore.addFermentationLog({
      batchId,
      dayNumber: 2,
      sensoryNote: 'Słoik odgazowany (uwolniono CO2).',
      burped: true,
      tasted: false,
    });
    Alert.alert('Słoik odgazowany! 🫧', 'Ciśnienie gazu CO₂ zostało bezpiecznie uwolnione.');
    reloadData();
  };

  const handleSaveLog = () => {
    if (!activeBatchForLog) return;
    const ph = parseFloat(logPh) || undefined;
    dbStore.addFermentationLog({
      batchId: activeBatchForLog.id,
      dayNumber: 3,
      sensoryNote: `Chrupkość: ${'★'.repeat(crispnessStars)}${'☆'.repeat(5 - crispnessStars)} — ${logNote || 'Degustacja w normie'}`,
      phReading: ph,
      burped: false,
      tasted: true,
      sensoryProfile: {
        acidity: profileAcidity,
        salinity: profileSalinity,
        crispness: profileCrispness,
        effervescence: profileEffervescence,
        aroma: profileAroma,
      },
    });
    Alert.alert('Zapisano wpis sensoryczny! 📝', 'Notatka i profil radarowy zostały zarchiwizowane w paszporcie partii.');
    setActiveBatchForLog(null);
    setLogNote('');
    reloadData();
  };


  const handleMoveToPantry = (batchId: string) => {
    Alert.alert(
      'Koniec fermentacji! 🫙',
      'Czy smak jest idealny i chcesz przenieść ten słoik do spiżarni lub lodówki?',
      [
        { text: 'Jeszcze nie', style: 'cancel' },
        {
          text: 'Tak, przenieś do spiżarki',
          onPress: () => {
            dbStore.updateBatchStatus(batchId, 'pantry', 5);
            dbStore.addPantryItem({
              batchId,
              label: 'Ogórki małosolne chrupiące',
              jarVolumeMl: 1000,
              location: 'fridge',
              quantity: 1,
              sealedAt: Date.now(),
              bestBefore: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 dni w lodówce
            });
            reloadData();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={theme.typography.heroTitle}>Fermentacja 🫧</Text>
          <Text style={styles.tagline}>
            Żywy kalendarz słoików stojących na Twoim blacie kuchennym.
          </Text>
        </View>

        {/* Baner Laboratorium Eksperymentów & Konkursu Słoików */}
        <TouchableOpacity
          onPress={() => router.push('/experiments')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Otwórz Laboratorium Eksperymentów i Konkurs Słoików"
        >
          <KitchenCard style={styles.experimentBanner}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 30 }}>🔬</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.experimentBannerTitle}>
                  Laboratorium Eksperymentów & Konkurs
                </Text>
                <Text style={styles.experimentBannerSubtitle}>
                  Porównaj 2–8 słoików split-batch, ślepa próba i wybór mistrza!
                </Text>
              </View>
              <Text style={{ fontSize: 18, color: theme.colors.pickleGreen, fontWeight: '700' }}>
                →
              </Text>
            </View>
          </KitchenCard>
        </TouchableOpacity>


        {activeBatches.length === 0 ? (
          <KitchenCard style={styles.emptyCard}>
            <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 8 }}>🥒</Text>
            <Text style={styles.emptyTitle}>Brak aktywnych kiszonek na blacie</Text>
            <Text style={styles.emptySubtitle}>
              Przejdź do zakładki Receptury lub Kreatora, aby nastawić swój pierwszy pyszny słoik!
            </Text>
          </KitchenCard>
        ) : (
          activeBatches.map((batch) => {
            const recipe = getRecipeById(batch.recipeId) || {
              id: batch.recipeId,
              title: batch.recipeTitle,
              subtitle: '',
              culture: batch.culture,
              category: 'poland_central_europe' as const,
              method: 'lacto_fermentation' as const,
              defaultProduceWeightGrams: batch.produceWeightGrams,
              defaultSalinityPercent: batch.salinityPercent,
              fermentationDays: batch.targetFermentationDays,
              shelfLifeMonths: 6,
              recommendedJarType: 'Słoik 1L',
              ingredients: [],
              steps: [],
              crispnessSecrets: [],
              sensoryMilestones: [
                { day: 1, title: 'Adaptacja', sensoryDescription: 'Zalewa mętnieje.' },
                { day: 2, title: 'Bąbelkowanie', sensoryDescription: 'Gazowanie CO2.' },
                { day: 3, title: 'Złoty Punkt!', sensoryDescription: 'Spróbuj widelczykiem!', isTastingCheckpoint: true },
              ],
              commonMistakes: [],
            };

            const timeline = calculateFermentationTimeline(recipe, batch.startedAt, 21);

            return (
              <KitchenCard key={batch.id} variant="elevated" style={styles.batchCard}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.batchTitle}>{batch.recipeTitle}</Text>
                    <Text style={styles.batchSub}>
                      Nastawiono: {new Date(batch.startedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Badge label="BĄBELKUJE" variant="amber" />
                </View>

                {/* Statusy sensoryczne */}
                <View style={styles.milestoneBox}>
                  <Text style={styles.milestoneHeader}>📅 Etapy sensoryczne:</Text>
                  {timeline.milestones.map((m, idx) => (
                    <View key={idx} style={styles.milestoneRow}>
                      <Text style={styles.milestoneDay}>Dzień {m.day}:</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.milestoneTitle}>
                          {m.title} {m.isTastingCheckpoint && '🍴'}
                        </Text>
                        <Text style={styles.milestoneDesc}>{m.sensoryDescription}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Wpisy sensoryczne z dziennika */}
                {(() => {
                  const logs = dbStore.getLogsForBatch(batch.id);
                  if (logs.length === 0) return null;
                  return (
                    <View style={styles.logsBox}>
                      <Text style={styles.logsHeader}>📝 Ostatnie wpisy z dziennika:</Text>
                      {logs.slice(-2).map((l, idx) => (
                        <Text key={idx} style={styles.logText}>
                          • Dzień {l.dayNumber}: {l.sensoryNote} {l.phReading ? `(pH: ${l.phReading})` : ''}
                        </Text>
                      ))}
                    </View>
                  );
                })()}

                {/* Wektorowy Radar Sensoryczny Kiszonki (5 osi - Parity S3) */}
                <TouchableOpacity
                  onPress={() =>
                    setExpandedRadarBatchId(
                      expandedRadarBatchId === batch.id ? null : batch.id
                    )
                  }
                  style={styles.radarToggleRow}
                  activeOpacity={0.7}
                >
                  <Text style={styles.radarToggleText}>
                    🕸️ Wykres Radarowy Sensoryki (5 osi){' '}
                    {expandedRadarBatchId === batch.id ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>

                {expandedRadarBatchId === batch.id && (
                  <View style={styles.radarContainer}>
                    <SensoryRadarChart
                      profile={
                        dbStore.getLogsForBatch(batch.id).find((l) => l.sensoryProfile)
                          ?.sensoryProfile || DEFAULT_FERMENT_SENSORY_PROFILE
                      }
                      size={200}
                    />
                  </View>
                )}

                {/* Przyciski Akcji Kuchennych */}
                <View style={styles.actionsRow}>
                  <KitchenButton
                    title="Odgazuj 💨"
                    variant="secondary"
                    onPress={() => handleBurp(batch.id)}
                    style={{ flex: 1, marginRight: 4 }}
                  />
                  <KitchenButton
                    title="Dziennik 📝"
                    variant="ghost"
                    onPress={() => setActiveBatchForLog(batch)}
                    style={{ flex: 1, marginHorizontal: 4 }}
                  />
                  <KitchenButton
                    title="Spiżarka ❄️"
                    variant="primary"
                    onPress={() => handleMoveToPantry(batch.id)}
                    style={{ flex: 1, marginLeft: 4 }}
                  />
                </View>
              </KitchenCard>
            );
          })
        )}
      </ScrollView>

      {/* Modal Wpisu do Dziennika Fermentacji */}
      <Modal visible={Boolean(activeBatchForLog)} animationType="slide" transparent>
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ModalHeader
              title="Wpis w Dzienniku"
              onClose={() => setActiveBatchForLog(null)}
              closeLabel="Anuluj"
            />
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalSubtitle}>
                Partia: {activeBatchForLog?.recipeTitle}
              </Text>

              <Text style={styles.fieldLabel}>Ocena ogólna (gwiazdki):</Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setCrispnessStars(star)}
                    style={styles.starButton}
                  >
                    <Text style={{ fontSize: 28, color: star <= crispnessStars ? '#E89838' : '#D1C9BE' }}>
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Profil sensoryczny (5 osi rzemiosła):</Text>
              {[
                { label: 'Kwasowość', val: profileAcidity, set: setProfileAcidity },
                { label: 'Słoność', val: profileSalinity, set: setProfileSalinity },
                { label: 'Chrupkość', val: profileCrispness, set: setProfileCrispness },
                { label: 'Musowanie / Gaz', val: profileEffervescence, set: setProfileEffervescence },
                { label: 'Aromat ziół', val: profileAroma, set: setProfileAroma },
              ].map((axisItem) => (
                <View key={axisItem.label} style={styles.axisControlRow}>
                  <Text style={styles.axisControlLabel}>{axisItem.label}:</Text>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <TouchableOpacity
                        key={num}
                        onPress={() => axisItem.set(num)}
                        style={[
                          styles.axisNumberBtn,
                          axisItem.val === num && styles.axisNumberBtnActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.axisNumberText,
                            axisItem.val === num && styles.axisNumberTextActive,
                          ]}
                        >
                          {num}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}

              <Text style={styles.fieldLabel}>Pomiar pH (np. papierek lakmusowy / pehametr):</Text>
              <TextInput
                style={styles.textInput}
                value={logPh}
                onChangeText={setLogPh}
                keyboardType="numeric"
                placeholder="np. 3.8"
                placeholderTextColor={theme.colors.textMuted}
              />

              <Text style={styles.fieldLabel}>Notatki sensoryczne (chrupkość, bąbelki, aromat):</Text>
              <TextInput
                style={[styles.textInput, { height: 80 }]}
                value={logNote}
                onChangeText={setLogNote}
                multiline
                numberOfLines={3}
                placeholder="np. Przyjemny czosnkowy aromat, mocny trzask, zalewa mętna..."
                placeholderTextColor={theme.colors.textMuted}
              />


              <KitchenButton
                title="Zapisz wpis w paszporcie 🫙"
                onPress={handleSaveLog}
                style={{ marginTop: 20, marginBottom: 30 }}
              />
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
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
    paddingBottom: 80,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  tagline: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  emptyCard: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  batchCard: {
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  batchTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  batchSub: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  milestoneBox: {
    backgroundColor: theme.colors.bgSecondary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginVertical: 10,
  },
  milestoneHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  milestoneRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  milestoneDay: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    width: 60,
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  milestoneDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  logsBox: {
    backgroundColor: '#F3EFE6',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.pickleGreen,
  },
  logsHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  logText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.bg,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '85%',
  },
  modalBody: {
    padding: theme.spacing.md,
  },
  modalSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  starRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  textInput: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  experimentBanner: {
    backgroundColor: '#FFFDF9',
    borderColor: theme.colors.pickleGreen,
    borderWidth: 1.5,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  experimentBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  experimentBannerSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  radarToggleRow: {
    paddingVertical: 10,
    marginTop: 8,
    alignItems: 'center',
    backgroundColor: '#F3EFE6',
    borderRadius: theme.borderRadius.sm,
  },
  radarToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
  },
  radarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    backgroundColor: theme.colors.bgCard,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  axisControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  axisControlLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  axisNumberBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  axisNumberBtnActive: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  axisNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  axisNumberTextActive: {
    color: '#FFFFFF',
  },
});

