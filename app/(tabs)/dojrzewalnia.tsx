// ============================================================================
// Słoik (Jarwise) — Dojrzewalnia (Faza 1: Konsolidacja Fermentacji & Spiżarni)
// Segmented control:
// 1. 🫧 Na Blacie (Aktywne fermentacje, odgazowywanie, radar sensoryczny, dziennik)
// 2. 🫙 W Spiżarni (Leżakowanie, zapasy, druk etykiet QR, zużywanie partii)
// PURGE: Usunięto zbędny kalkulator oszczędności PLN na rzecz czystego rzemiosła.
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  dbStore,
  BatchRecord,
  PantryItemRecord,
  PantryIngredientRecord,
} from '../../src/data/db/database';
import { calculateFermentationTimeline } from '../../src/core/timeline/fermentation-timeline';
import { generateJarLabel, PrintableLabel } from '../../src/core/pantry/label-generator';
import { exportLabelSheetAsPdf } from '../../src/core/pantry/pdf-sheet-generator';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { KitchenButton } from '../../src/ui/components/KitchenButton';
import { Badge } from '../../src/ui/components/Badge';
import { ModalHeader } from '../../src/ui/components/ModalHeader';
import { QrScannerModal } from '../../src/ui/components/QrScannerModal';
import { SensoryRadarChart } from '../../src/ui/components/SensoryRadarChart';
import { useAppAccess } from '../../src/core/access/app-access';
import { PaywallModal } from '../../src/ui/components/PaywallModal';
import { t, useLang } from '../../src/lib/i18n';

export default function DojrzewalniaScreen() {
  const router = useRouter();
  const { canCreate } = useAppAccess();
  useLang();

  // Główny przełącznik Dojrzewalni
  const [activeSection, setActiveSection] = useState<'counter' | 'pantry'>('counter');

  // Stan dla części aktywnej (Na Blacie)
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

  // Stan dla części leżakującej (W Spiżarni)
  const [pantryItems, setPantryItems] = useState<PantryItemRecord[]>([]);
  const [ingredients, setIngredients] = useState<PantryIngredientRecord[]>([]);
  const [locationFilter, setLocationFilter] = useState<'all' | 'cellar' | 'pantry_cupboard' | 'fridge'>('all');
  const [activeLabel, setActiveLabel] = useState<PrintableLabel | null>(null);
  const [selectedItem, setSelectedItem] = useState<PantryItemRecord | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // Dodawanie surowca
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const [newIngName, setNewIngName] = useState('');
  const [newIngCategory, setNewIngCategory] = useState<'produce' | 'salt' | 'spice' | 'vinegar' | 'sugar' | 'jar_lid'>('produce');
  const [newIngAmount, setNewIngAmount] = useState('1');
  const [newIngUnit, setNewIngUnit] = useState('kg');

  const reloadData = () => {
    setActiveBatches(dbStore.getActiveFerments());
    const filter = locationFilter === 'all' ? undefined : locationFilter;
    setPantryItems(dbStore.getPantryItems(filter));
    setIngredients(dbStore.getPantryIngredients());
  };

  useEffect(() => {
    reloadData();
  }, [locationFilter]);

  // Odgazowanie słoika
  const handleBurp = (batchId: string) => {
    if (!canCreate) {
      setIsPaywallOpen(true);
      return;
    }
    dbStore.addFermentationLog({
      batchId,
      dayNumber: 2,
      sensoryNote: 'Słoik odgazowany (uwolniono CO2).',
      burped: true,
      tasted: false,
    });
    Alert.alert(t('Słoik odgazowany! 🫧'), t('Ciśnienie gazu CO₂ zostało bezpiecznie uwolnione.'));
    reloadData();
  };

  // Zapis wpisu do dziennika
  const handleSaveLog = () => {
    if (!activeBatchForLog) return;
    if (!canCreate) {
      setIsPaywallOpen(true);
      return;
    }
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
    Alert.alert(
      t('Zapisano wpis sensoryczny! 📝'),
      t('Notatka i profil radarowy zostały zarchiwizowane w paszporcie partii.')
    );
    setActiveBatchForLog(null);
    setLogNote('');
    reloadData();
  };

  // Przeniesienie do spiżarni
  const handleMoveToPantry = (batch: BatchRecord) => {
    if (!canCreate) {
      setIsPaywallOpen(true);
      return;
    }
    Alert.alert(
      t('Zakończyć fermentację? 🫙'),
      t('Czy chcesz przenieść partię "{title}" z blatu do spiżarni?', { title: batch.recipeTitle }),
      [
        { text: t('Anuluj'), style: 'cancel' },
        {
          text: t('Przenieś do spiżarni'),
          onPress: () => {
            dbStore.updateBatchStatus(batch.id, 'pantry');
            dbStore.addPantryItem({
              batchId: batch.id,
              label: batch.recipeTitle,
              jarVolumeMl: 1000,
              location: 'pantry_cupboard',
              quantity: 2,
              sealedAt: Date.now(),
              bestBefore: Date.now() + 1000 * 60 * 60 * 24 * 365,
            });
            Alert.alert(t('Przeniesiono do spiżarni! 🎉'), t('Słoiki są gotowe do leżakowania i degustacji.'));
            reloadData();
          },
        },
      ]
    );
  };

  // Zużycie słoika
  const handleConsume = (itemId: string, label: string) => {
    Alert.alert(
      t('Smacznego! 🍴'),
      t('Czy otworzyłeś słoik "{label}"? Zmniejszymy stan spiżarni o 1 sztukę.', { label }),
      [
        { text: t('Anuluj'), style: 'cancel' },
        {
          text: t('Tak, zjedzony!'),
          onPress: () => {
            dbStore.consumePantryItem(itemId, 1);
            reloadData();
          },
        },
      ]
    );
  };

  // Druk etykiety
  const handleShowLabel = (item: PantryItemRecord) => {
    setSelectedItem(item);
    const label = generateJarLabel({
      batchId: item.batchId,
      recipeTitle: item.label,
      preparedDate: new Date(item.sealedAt).toLocaleDateString(),
      bestBeforeDate: new Date(item.bestBefore).toLocaleDateString(),
      salinityOrSugarInfo: 'Sól: 2.5%',
      format: 'side_rectangle_80x50mm',
    });
    setActiveLabel(label);
  };

  const handlePrintPdfSheet = async (item: PantryItemRecord) => {
    if (!canCreate) {
      setIsPaywallOpen(true);
      return;
    }
    try {
      await exportLabelSheetAsPdf({
        labelConfig: {
          batchId: item.batchId,
          recipeTitle: item.label,
          preparedDate: new Date(item.sealedAt).toLocaleDateString(),
          bestBeforeDate: new Date(item.bestBefore).toLocaleDateString(),
          salinityOrSugarInfo: 'Sól: 2.5%',
          format: 'side_rectangle_80x50mm',
        },
        count: 8,
        paperFormat: 'A4',
      });
    } catch {
      Alert.alert(t('Nie udało się wygenerować arkusza etykiet'), t('Wystąpił problem podczas eksportu pliku PDF.'));
    }
  };

  // Dodawanie surowca
  const handleAddIngredient = () => {
    if (!canCreate) {
      setIsPaywallOpen(true);
      return;
    }
    if (!newIngName.trim()) {
      Alert.alert(t('Błąd'), t('Wpisz nazwę surowca.'));
      return;
    }
    const amt = parseFloat(newIngAmount) || 1;
    dbStore.addPantryIngredient({
      name: newIngName.trim(),
      category: newIngCategory,
      stockAmount: amt,
      unit: newIngUnit.trim() || 'kg',
      costPerUnit: 0.0,
    });
    setNewIngName('');
    setIsAddingIngredient(false);
    reloadData();
    Alert.alert(t('Sukces! 📦'), t('Dodano surowiec do zapasów rzemieślnika.'));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Nagłówek Dojrzewalni */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={theme.typography.heroTitle}>{t('Dojrzewalnia 🫙')}</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => setIsScannerOpen(true)}
                style={styles.iconButton}
                accessibilityLabel={t('Skanuj Kod QR Słoika')}
                hitSlop={theme.hitSlop}
              >
                <Text style={{ fontSize: 20 }}>📷</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/settings')}
                style={styles.iconButton}
                accessibilityLabel={t('Ustawienia i Warsztat')}
                hitSlop={theme.hitSlop}
              >
                <Text style={{ fontSize: 20 }}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.tagline}>
            {t('Śledzenie procesów biochemicznych, uwalnianie CO₂ i leżakowanie zapasów.')}
          </Text>
        </View>

        {/* Segmented Control: Na Blacie vs W Spiżarni */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeSection === 'counter' && styles.segmentButtonActive,
            ]}
            onPress={() => setActiveSection('counter')}
            activeOpacity={0.8}
            accessibilityLabel={t('Aktywne Fermentacje na blacie')}
          >
            <Text
              style={[
                styles.segmentButtonText,
                activeSection === 'counter' && styles.segmentButtonTextActive,
              ]}
            >
              🫧 {t('Na Blacie')} ({activeBatches.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeSection === 'pantry' && styles.segmentButtonActive,
            ]}
            onPress={() => setActiveSection('pantry')}
            activeOpacity={0.8}
            accessibilityLabel={t('Spiżarnia i Zapas')}
          >
            <Text
              style={[
                styles.segmentButtonText,
                activeSection === 'pantry' && styles.segmentButtonTextActive,
              ]}
            >
              🫙 {t('W Spiżarni')} ({pantryItems.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* SEKCJA 1: NA BLACIE (AKTYWNE FERMENTACJE) */}
        {activeSection === 'counter' && (
          <View>
            <Text style={styles.sectionHeader}>{t('Aktywne Fermentacje 🫧')}</Text>

            {activeBatches.length === 0 ? (
              <KitchenCard style={styles.emptyCard}>
                <Text style={{ fontSize: 36, textAlign: 'center', marginBottom: 12 }}>🥒</Text>
                <Text style={styles.emptyTitle}>{t('Brak aktywnych słoików na blacie')}</Text>
                <Text style={styles.emptyDesc}>
                  {t('Przejdź do zakładki Rytuał, aby obliczyć solankę i nastawić pierwszy słoik.')}
                </Text>
                <KitchenButton
                  title={t('Otwórz Rytuał')}
                  onPress={() => router.push('/(tabs)')}
                  style={{ marginTop: 16 }}
                />
              </KitchenCard>
            ) : (
              activeBatches.map((batch) => {
                const elapsedDays = Math.max(0, Math.floor((Date.now() - batch.startedAt) / 86400000));
                const currentDay = Math.max(1, elapsedDays);
                const isReady = elapsedDays >= batch.targetFermentationDays;
                const progressPercent = Math.min(100, Math.round((currentDay / batch.targetFermentationDays) * 100));
                const logs = dbStore.getLogsForBatch(batch.id);
                const lastLog = logs[logs.length - 1];
                const sensoryProfile = lastLog?.sensoryProfile || {
                  acidity: 3,
                  salinity: 3,
                  crispness: 5,
                  effervescence: 3,
                  aroma: 4,
                };
                const isRadarExpanded = expandedRadarBatchId === batch.id;

                return (
                  <KitchenCard key={batch.id} style={styles.batchCard}>
                    <View style={styles.batchHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.batchTitle}>{batch.recipeTitle}</Text>
                        <Text style={styles.batchSubtitle}>
                          {t('Nastawiono: ')}
                          {new Date(batch.startedAt).toLocaleDateString()} · {batch.culture}
                        </Text>
                      </View>
                      <Badge
                        label={
                          isReady
                            ? t('GOTOWE')
                            : `${t('DZIEŃ')} ${currentDay}/${batch.targetFermentationDays}`
                        }
                        variant={isReady ? 'green' : 'amber'}
                      />
                    </View>

                    {/* Pasek postępu fermentacji */}
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressBar,
                          { width: `${progressPercent}%` },
                        ]}
                      />
                    </View>

                    {/* Sacred Numbers dla partii */}
                    <View style={styles.batchMetricsRow}>
                      <Text style={styles.metricItem}>
                        🥒 {batch.produceWeightGrams}g
                      </Text>
                      <Text style={styles.metricItem}>
                        🧂 {batch.salinityPercent.toFixed(1)}% ({batch.saltWeightGrams.toFixed(1)}g)
                      </Text>
                      <Text style={styles.metricItem}>
                        💧 {batch.waterWeightGrams}ml
                      </Text>
                    </View>

                    {/* Akcje partii */}
                    <View style={styles.batchActionsRow}>
                      <TouchableOpacity
                        style={styles.burpBtn}
                        onPress={() => handleBurp(batch.id)}
                        hitSlop={theme.hitSlop}
                      >
                        <Text style={styles.burpBtnText}>{t('Odgazuj słoik (Burp) 💨')}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.logBtn}
                        onPress={() => setActiveBatchForLog(batch)}
                        hitSlop={theme.hitSlop}
                      >
                        <Text style={styles.logBtnText}>📝 {t('Dziennik')}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.radarToggleBtn}
                        onPress={() =>
                          setExpandedRadarBatchId(isRadarExpanded ? null : batch.id)
                        }
                        hitSlop={theme.hitSlop}
                      >
                        <Text style={styles.radarToggleText}>
                          {isRadarExpanded ? '▲' : '📊'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Rozwijany Radar Sensoryczny */}
                    {isRadarExpanded && (
                      <View style={styles.radarBox}>
                        <Text style={styles.radarTitle}>
                          🕸️ {t('Profil Sensoryczny Partii (Radar Smaku)')}
                        </Text>
                        <SensoryRadarChart profile={sensoryProfile} size={220} />
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.finishFermentBtn}
                      onPress={() => handleMoveToPantry(batch)}
                      hitSlop={theme.hitSlop}
                    >
                      <Text style={styles.finishFermentText}>
                        🫙 {t('Przenieś słoik do Spiżarni')}
                      </Text>
                    </TouchableOpacity>
                  </KitchenCard>
                );
              })
            )}
          </View>
        )}

        {/* SEKCJA 2: W SPIŻARNI (LEŻAKOWANE ZAPASY) */}
        {activeSection === 'pantry' && (
          <View>
            <View style={styles.pantryHeaderRow}>
              <Text style={styles.sectionHeader}>{t('Moja Spiżarnia 🫙')}</Text>
              <TouchableOpacity
                style={styles.addSupplyBtn}
                onPress={() => setIsAddingIngredient(true)}
                hitSlop={theme.hitSlop}
              >
                <Text style={styles.addSupplyText}>+ {t('Dodaj zapas')}</Text>
              </TouchableOpacity>
            </View>

            {/* Filtr lokacji */}
            <View style={styles.locationFilterRow}>
              {[
                { id: 'all', label: t('Wszystkie') },
                { id: 'cellar', label: t('Piwnica') },
                { id: 'pantry_cupboard', label: t('Szafka') },
                { id: 'fridge', label: t('Lodówka') },
              ].map((loc) => (
                <TouchableOpacity
                  key={loc.id}
                  style={[
                    styles.locFilterChip,
                    locationFilter === loc.id && styles.locFilterChipActive,
                  ]}
                  onPress={() => setLocationFilter(loc.id as any)}
                >
                  <Text
                    style={[
                      styles.locFilterText,
                      locationFilter === loc.id && styles.locFilterTextActive,
                    ]}
                  >
                    {loc.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Lista Słoików w Spiżarni */}
            {pantryItems.length === 0 ? (
              <KitchenCard style={styles.emptyCard}>
                <Text style={{ fontSize: 36, textAlign: 'center', marginBottom: 12 }}>🫙</Text>
                <Text style={styles.emptyTitle}>{t('Brak słoików w spiżarni')}</Text>
                <Text style={styles.emptyDesc}>
                  {t('Gdy fermentacja dobiegnie końca, przenieś gotowy słoik do spiżarni.')}
                </Text>
              </KitchenCard>
            ) : (
              pantryItems.map((item) => (
                <KitchenCard key={item.id} style={styles.pantryCard}>
                  <View style={styles.batchHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.batchTitle}>{item.label}</Text>
                      <Text style={styles.batchSubtitle}>
                        {t('Zasłoikowano: ')}
                        {new Date(item.sealedAt).toLocaleDateString()} · {item.jarVolumeMl}ml
                      </Text>
                    </View>
                    <Badge
                      label={`${item.quantity} ${t('szt.')}`}
                      variant={item.quantity > 0 ? 'green' : 'gray'}
                    />
                  </View>

                  <View style={styles.pantryActionsRow}>
                    <TouchableOpacity
                      style={styles.labelBtn}
                      onPress={() => handleShowLabel(item)}
                      hitSlop={theme.hitSlop}
                    >
                      <Text style={styles.labelBtnText}>{t('Drukuj etykietę QR 🏷️')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.consumeBtn}
                      onPress={() => handleConsume(item.id, item.label)}
                      hitSlop={theme.hitSlop}
                    >
                      <Text style={styles.consumeBtnText}>🍴 {t('Otwórz słoik')}</Text>
                    </TouchableOpacity>
                  </View>
                </KitchenCard>
              ))
            )}

            {/* Stan surowców magazynu */}
            {ingredients.length > 0 && (
              <View style={styles.ingredientsBox}>
                <Text style={styles.ingredientsTitle}>
                  📦 {t('Zapas Soli, Przypraw i Słoików')}
                </Text>
                {ingredients.map((ing) => (
                  <View key={ing.id} style={styles.ingredientRow}>
                    <Text style={styles.ingName}>{ing.name}</Text>
                    <Text style={styles.ingAmount}>
                      {ing.stockAmount} {ing.unit}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* MODAL: DODAWANIE WPISU DO DZIENNIKA */}
        <Modal visible={!!activeBatchForLog} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <ModalHeader
              title={t('Wpis Dziennika Sensorycznego')}
              onClose={() => setActiveBatchForLog(null)}
              closeLabel={t('Anuluj')}
            />
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalSubtitle}>
                {activeBatchForLog?.recipeTitle}
              </Text>

              <Text style={styles.fieldLabel}>{t('Odczyt pH (kwasowość)')}</Text>
              <TextInput
                style={styles.input}
                value={logPh}
                onChangeText={setLogPh}
                keyboardType="numeric"
              />

              <Text style={styles.fieldLabel}>{t('Ocena chrupkości:')}</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setCrispnessStars(s)}
                    hitSlop={theme.hitSlop}
                    style={styles.starBtn}
                  >
                    <Text style={{ fontSize: 28 }}>
                      {s <= crispnessStars ? '★' : '☆'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>{t('Notatka sensoryczna:')}</Text>
              <TextInput
                style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                multiline
                placeholder={t('np. Piękny aromat kopru, chrupiący zgryz, brak posmaku siarkowego')}
                placeholderTextColor={theme.colors.textMuted}
                value={logNote}
                onChangeText={setLogNote}
              />

              <TouchableOpacity
                style={styles.saveLogActionBtn}
                onPress={handleSaveLog}
              >
                <Text style={styles.saveLogActionText}>{t('Zapisz do Paszportu 🫙')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* MODAL: PODGLĄD ETYKIETY KUCHENNEJ */}
        <Modal visible={!!activeLabel} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <ModalHeader
              title={t('Etykieta Kuchenna')}
              onClose={() => setActiveLabel(null)}
              closeLabel={t('Zamknij')}
            />
            <ScrollView contentContainerStyle={styles.modalContent}>
              {activeLabel && selectedItem && (
                <View style={styles.labelPreviewCard}>
                  <Text style={styles.labelHeaderTitle}>{selectedItem.label}</Text>
                  <Text style={styles.labelHeaderSub}>
                    {t('Solanka rzemieślnicza')}
                  </Text>
                  <View style={styles.labelDivider} />
                  <Text style={styles.labelLine}>
                    📅 {t('Zalano: ')}
                    {new Date(selectedItem.sealedAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.labelLine}>
                    ⏳ {t('Najlepiej spożyć do: ')}
                    {new Date(selectedItem.bestBefore).toLocaleDateString()}
                  </Text>
                  <Text style={styles.labelLine}>
                    📦 {t('Pojemność: ')}
                    {selectedItem.jarVolumeMl} ml
                  </Text>

                  <Text style={styles.formatHint}>
                    {t('Format: 80x50 mm (Standardowa etykieta boczna)')}
                  </Text>

                  {selectedItem && (
                    <TouchableOpacity
                      style={styles.pdfPrintBtn}
                      onPress={() => handlePrintPdfSheet(selectedItem)}
                    >
                      <Text style={styles.pdfPrintBtnText}>
                        📄 {t('Generuj arkusz PDF A4')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* MODAL: DODAWANIE SUROWCA DO ZAPASU */}
        <Modal visible={isAddingIngredient} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <ModalHeader
              title={t('Nowy Surowiec w Zapasach')}
              onClose={() => setIsAddingIngredient(false)}
              closeLabel={t('Anuluj')}
            />
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.fieldLabel}>{t('Nazwa surowca')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('np. Sól kłodawska niejodowana kamienna')}
                placeholderTextColor={theme.colors.textMuted}
                value={newIngName}
                onChangeText={setNewIngName}
              />

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.fieldLabel}>{t('Ilość')}</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={newIngAmount}
                    onChangeText={setNewIngAmount}
                  />
                </View>
                <View style={styles.col}>
                  <Text style={styles.fieldLabel}>{t('Jednostka')}</Text>
                  <TextInput
                    style={styles.input}
                    value={newIngUnit}
                    onChangeText={setNewIngUnit}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.saveLogActionBtn}
                onPress={handleAddIngredient}
              >
                <Text style={styles.saveLogActionText}>{t('Zapisz w Spiżarni')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* MODAL SKANERA QR */}
        <QrScannerModal
          visible={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScanBatch={(batchId) => {
            setIsScannerOpen(false);
            router.push(`/batch/${batchId}`);
          }}
        />

        {/* PAYWALL */}
        <PaywallModal
          visible={isPaywallOpen}
          onClose={() => setIsPaywallOpen(false)}
        />
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
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    minHeight: 44,
    minWidth: 44,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 4,
    marginBottom: 18,
  },
  segmentButton: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.pickleGreen,
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: theme.colors.bgCard,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  batchCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    marginBottom: 12,
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  batchTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  batchSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  progressTrack: {
    height: 6,
    backgroundColor: theme.colors.bgSecondary,
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.pickleGreen,
  },
  batchMetricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 6,
  },
  metricItem: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  batchActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  burpBtn: {
    flex: 2,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burpBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.pickleGreenLight,
  },
  logBtn: {
    flex: 1,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  radarToggleBtn: {
    width: 40,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarToggleText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  radarBox: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 12,
  },
  radarTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.amberBrine,
    marginBottom: 8,
  },
  finishFermentBtn: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  finishFermentText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.pickleGreen,
  },
  pantryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addSupplyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addSupplyText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
  },
  locationFilterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  locFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  locFilterChipActive: {
    backgroundColor: theme.colors.pickleGreenMuted,
    borderColor: theme.colors.pickleGreen,
  },
  locFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  locFilterTextActive: {
    color: theme.colors.pickleGreenLight,
  },
  pantryCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    marginBottom: 10,
  },
  pantryActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  labelBtn: {
    flex: 2,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.pickleGreenLight,
  },
  consumeBtn: {
    flex: 1,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consumeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  ingredientsBox: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    marginTop: 16,
  },
  ingredientsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.amberBrine,
    marginBottom: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  ingName: {
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  ingAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.pickleGreenLight,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  modalContent: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 8,
  },
  starBtn: {
    minHeight: 40,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveLogActionBtn: {
    backgroundColor: theme.colors.pickleGreen,
    minHeight: 52,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveLogActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  labelPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    borderWidth: 2,
    borderColor: '#333333',
    marginVertical: 12,
  },
  labelHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
  },
  labelHeaderSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
    textAlign: 'center',
    marginTop: 2,
  },
  labelDivider: {
    height: 1,
    backgroundColor: '#CCCCCC',
    marginVertical: 12,
  },
  labelLine: {
    fontSize: 14,
    color: '#111111',
    marginVertical: 3,
  },
  formatHint: {
    fontSize: 11,
    color: '#777777',
    marginTop: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  pdfPrintBtn: {
    backgroundColor: '#2D5A27',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  pdfPrintBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },
});
