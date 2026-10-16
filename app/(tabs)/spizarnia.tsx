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
  Share,
} from 'react-native';
import {
  dbStore,
  PantryItemRecord,
  PantryIngredientRecord,
} from '../../src/data/db/database';
import { generateJarLabel, PrintableLabel } from '../../src/core/pantry/label-generator';
import { exportLabelSheetAsPdf } from '../../src/core/pantry/pdf-sheet-generator';
import {
  calculateJarBatchCost,
  DEFAULT_JAR_COST_PARAMETERS,
  JarCostMetrics,
} from '../../src/core/pantry/cost-calculator';
import { exportPantryToCsv } from '../../src/lib/backup';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { KitchenButton } from '../../src/ui/components/KitchenButton';
import { Badge } from '../../src/ui/components/Badge';
import { ModalHeader } from '../../src/ui/components/ModalHeader';
import { QrScannerModal } from '../../src/ui/components/QrScannerModal';

export default function PantryScreen() {
  const [activeTab, setActiveTab] = useState<'jars' | 'warehouse'>('jars');
  const [items, setItems] = useState<PantryItemRecord[]>([]);
  const [ingredients, setIngredients] = useState<PantryIngredientRecord[]>([]);
  const [locationFilter, setLocationFilter] = useState<'all' | 'cellar' | 'pantry_cupboard' | 'fridge'>('all');
  const [activeLabel, setActiveLabel] = useState<PrintableLabel | null>(null);
  const [selectedItem, setSelectedItem] = useState<PantryItemRecord | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);

  // Stan kalkulatora kosztów
  const [calcJarsCount, setCalcJarsCount] = useState<number>(4);
  const [calcProduceGrams, setCalcProduceGrams] = useState<number>(2000);
  const [calcWaterGrams, setCalcWaterGrams] = useState<number>(1500);
  const [calcSaltGrams, setCalcSaltGrams] = useState<number>(35);
  const [calcProducePricePerKg, setCalcProducePricePerKg] = useState<number>(8.0);
  const [calcPasteurization, setCalcPasteurization] = useState<'none' | 'water_bath' | 'oven'>('none');

  // Stan formularza dodawania surowca
  const [newIngName, setNewIngName] = useState('');
  const [newIngCategory, setNewIngCategory] = useState<'produce' | 'salt' | 'spice' | 'vinegar' | 'sugar' | 'jar_lid'>('produce');
  const [newIngAmount, setNewIngAmount] = useState('1');
  const [newIngUnit, setNewIngUnit] = useState('kg');
  const [newIngCost, setNewIngCost] = useState('5.0');
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);

  const reloadPantry = () => {
    const filter = locationFilter === 'all' ? undefined : locationFilter;
    setItems(dbStore.getPantryItems(filter));
    setIngredients(dbStore.getPantryIngredients());
  };

  useEffect(() => {
    reloadPantry();
  }, [locationFilter]);

  const handleConsume = (itemId: string, label: string) => {
    Alert.alert(
      'Smacznego! 🍴',
      `Czy otworzyłeś słoik "${label}"? Zmniejszymy stan spiżarni o 1 sztukę.`,
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Tak, zjedzony!',
          onPress: () => {
            dbStore.consumePantryItem(itemId, 1);
            reloadPantry();
          },
        },
      ]
    );
  };

  const handleShowLabel = (item: PantryItemRecord) => {
    setSelectedItem(item);
    const label = generateJarLabel({
      batchId: item.batchId,
      recipeTitle: item.label,
      preparedDate: new Date(item.sealedAt).toLocaleDateString(),
      bestBeforeDate: new Date(item.bestBefore).toLocaleDateString(),
      salinityOrSugarInfo: 'Tradycyjny wyrób rzemieślniczy',
      format: 'side_rectangle_80x50mm',
    });
    setActiveLabel(label);
  };

  const handleScanBatch = (batchId: string) => {
    setIsScannerOpen(false);
    const found = items.find((i) => i.batchId === batchId || i.id === batchId);
    if (found) {
      Alert.alert(
        'Rozpoznano słoik! 🫙',
        `Przetwór: ${found.label}\nPartia: ${found.batchId}\nLokalizacja: ${found.location}\nIlość: ${found.quantity} szt.`,
        [{ text: 'Pokaż etykietę', onPress: () => handleShowLabel(found) }, { text: 'OK' }]
      );
    } else {
      Alert.alert('Zeskanowano kod QR', `Paszport słoika: ${batchId}`);
    }
  };

  const handleExportPdf = async () => {
    if (!selectedItem) return;
    try {
      await exportLabelSheetAsPdf({
        labelConfig: {
          batchId: selectedItem.batchId,
          recipeTitle: selectedItem.label,
          preparedDate: new Date(selectedItem.sealedAt).toLocaleDateString(),
          bestBeforeDate: new Date(selectedItem.bestBefore).toLocaleDateString(),
          salinityOrSugarInfo: 'Tradycyjny wyrób rzemieślniczy',
          format: 'side_rectangle_80x50mm',
        },
        count: 8,
        paperFormat: 'A4',
      });
      setActiveLabel(null);
    } catch {
      Alert.alert('Błąd eksportu', 'Nie udało się wygenerować arkusza PDF.');
    }
  };

  const handleExportCsv = async () => {
    const csv = exportPantryToCsv(items);
    try {
      await Share.share({
        title: 'Spizarnia_Sloik.csv',
        message: csv,
      });
    } catch {
      Alert.alert('Eksport CSV', 'Wygenerowano zawartość CSV spiżarni.');
    }
  };

  const handleAdjustStock = (ingId: string, currentAmount: number, delta: number) => {
    const newAmt = Math.max(0, Math.round((currentAmount + delta) * 10) / 10);
    dbStore.updatePantryIngredientStock(ingId, newAmt);
    reloadPantry();
  };

  const handleSaveNewIngredient = () => {
    if (!newIngName.trim()) {
      Alert.alert('Brak nazwy', 'Podaj nazwę surowca.');
      return;
    }
    const amt = parseFloat(newIngAmount) || 1;
    const cost = parseFloat(newIngCost) || 0;
    dbStore.addPantryIngredient({
      name: newIngName.trim(),
      category: newIngCategory,
      stockAmount: amt,
      unit: newIngUnit.trim() || 'szt.',
      costPerUnit: cost,
    });
    setNewIngName('');
    setIsAddingIngredient(false);
    reloadPantry();
  };

  const costMetrics: JarCostMetrics = calculateJarBatchCost({
    jarsCount: calcJarsCount,
    produceWeightGrams: calcProduceGrams,
    waterWeightGrams: calcWaterGrams,
    saltWeightGrams: calcSaltGrams,
    producePricePerKg: calcProducePricePerKg,
    pasteurizationMethod: calcPasteurization,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={theme.typography.heroTitle}>Moja Spiżarnia 🫙</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity
                onPress={() => setIsCostModalOpen(true)}
                style={styles.headerActionBtn}
                accessibilityLabel="Kalkulator kosztów słoika"
              >
                <Text style={styles.headerActionText}>💰 Koszt</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsScannerOpen(true)}
                style={styles.headerActionBtn}
                accessibilityLabel="Skanuj słoik aparatem"
              >
                <Text style={styles.headerActionText}>📷 Skan</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.tagline}>
            Zapas słoików, magazyn surowców kuchennych i kalkulacja domowych oszczędności.
          </Text>
        </View>

        {/* Zakładki Spiżarni: Słoiki vs Magazyn Surowców */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'jars' && styles.tabButtonActive]}
            onPress={() => setActiveTab('jars')}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabButtonText, activeTab === 'jars' && styles.tabButtonTextActive]}
            >
              🫙 Gotowe Słoiki ({items.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'warehouse' && styles.tabButtonActive]}
            onPress={() => setActiveTab('warehouse')}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabButtonText, activeTab === 'warehouse' && styles.tabButtonTextActive]}
            >
              📦 Magazyn Surowców ({ingredients.length})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'jars' ? (
          /* ZAKŁADKA 1: GOTOWE SŁOIKI */
          <View>
            {/* Filtr lokalizacji */}
            <View style={styles.filterRow}>
              {(
                [
                  { label: 'Wszystkie', value: 'all' },
                  { label: 'Piwnica 🏠', value: 'cellar' },
                  { label: 'Szafka 🪵', value: 'pantry_cupboard' },
                  { label: 'Lodówka ❄️', value: 'fridge' },
                ] as const
              ).map((loc) => (
                <TouchableOpacity
                  key={loc.value}
                  onPress={() => setLocationFilter(loc.value)}
                  style={[
                    styles.filterChip,
                    locationFilter === loc.value && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      locationFilter === loc.value && styles.filterChipTextActive,
                    ]}
                  >
                    {loc.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Lista Słoików */}
            {items.length === 0 ? (
              <KitchenCard style={styles.emptyCard}>
                <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 8 }}>🧺</Text>
                <Text style={styles.emptyTitle}>Pusta półka</Text>
                <Text style={styles.emptySubtitle}>
                  Gdy skończysz kisić lub zapasteryzujesz słoiki, pojawią się tutaj z datą ważności i etykietami!
                </Text>
              </KitchenCard>
            ) : (
              items.map((item) => (
                <KitchenCard key={item.id} variant="elevated" style={styles.itemCard}>
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{item.label}</Text>
                      <Text style={styles.itemSub}>
                        Pojemność: {item.jarVolumeMl} ml · Ważne do: {new Date(item.bestBefore).toLocaleDateString()}
                      </Text>
                    </View>
                    <Badge label={`ILOŚĆ: ${item.quantity}`} variant={item.quantity > 1 ? 'green' : 'amber'} />
                  </View>

                  <View style={styles.actionsRow}>
                    <KitchenButton
                      title="Drukuj etykietę QR 🏷️"
                      variant="secondary"
                      onPress={() => handleShowLabel(item)}
                      style={{ flex: 1, marginRight: 6 }}
                    />
                    <KitchenButton
                      title="Otwórz / Zjedz 🍴"
                      variant="primary"
                      onPress={() => handleConsume(item.id, item.label)}
                      style={{ flex: 1, marginLeft: 6 }}
                    />
                  </View>
                </KitchenCard>
              ))
            )}

            {items.length > 0 && (
              <KitchenButton
                title="Eksportuj stan spiżarni do CSV 📊"
                variant="ghost"
                onPress={handleExportCsv}
                style={{ marginTop: 12 }}
              />
            )}
          </View>
        ) : (
          /* ZAKŁADKA 2: MAGAZYN SUROWCÓW */
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary }}>
                Stan soli, szkła, przypraw i octów
              </Text>
              <TouchableOpacity
                onPress={() => setIsAddingIngredient(!isAddingIngredient)}
                style={styles.addIngHeaderBtn}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.pickleGreen }}>
                  {isAddingIngredient ? 'Anuluj ✕' : '+ Dodaj surowiec'}
                </Text>
              </TouchableOpacity>
            </View>

            {isAddingIngredient && (
              <KitchenCard variant="highlight" style={styles.addIngCard}>
                <Text style={styles.addIngTitle}>Nowy surowiec kuchenny</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Nazwa surowca (np. Słoiki Weck 0.9L)"
                  placeholderTextColor={theme.colors.textMuted}
                  value={newIngName}
                  onChangeText={setNewIngName}
                />

                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <TextInput
                    style={[styles.textInput, { flex: 1 }]}
                    placeholder="Ilość"
                    keyboardType="numeric"
                    placeholderTextColor={theme.colors.textMuted}
                    value={newIngAmount}
                    onChangeText={setNewIngAmount}
                  />
                  <TextInput
                    style={[styles.textInput, { flex: 1 }]}
                    placeholder="Jednostka (kg/szt/L)"
                    placeholderTextColor={theme.colors.textMuted}
                    value={newIngUnit}
                    onChangeText={setNewIngUnit}
                  />
                  <TextInput
                    style={[styles.textInput, { flex: 1 }]}
                    placeholder="Cena zł/jedn."
                    keyboardType="numeric"
                    placeholderTextColor={theme.colors.textMuted}
                    value={newIngCost}
                    onChangeText={setNewIngCost}
                  />
                </View>

                <KitchenButton
                  title="Zapisz w magazynie 📦"
                  onPress={handleSaveNewIngredient}
                  style={{ marginTop: 12 }}
                />
              </KitchenCard>
            )}

            {ingredients.map((ing) => (
              <KitchenCard key={ing.id} variant="default" style={styles.ingredientCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ingName}>{ing.name}</Text>
                  <Text style={styles.ingSub}>
                    Kategoria: {ing.category} · Szac. koszt: {ing.costPerUnit} zł/{ing.unit}
                  </Text>
                </View>

                <View style={styles.stockControlRow}>
                  <TouchableOpacity
                    onPress={() => handleAdjustStock(ing.id, ing.stockAmount, -1)}
                    style={styles.stockBtn}
                  >
                    <Text style={styles.stockBtnText}>-</Text>
                  </TouchableOpacity>
                  <View style={styles.stockAmountBadge}>
                    <Text style={styles.stockAmountText}>
                      {ing.stockAmount} {ing.unit}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleAdjustStock(ing.id, ing.stockAmount, 1)}
                    style={styles.stockBtn}
                  >
                    <Text style={styles.stockBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </KitchenCard>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal Podglądu Etykiety */}
      <Modal visible={Boolean(activeLabel)} animationType="slide" transparent>
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ModalHeader
              title="Etykieta Kuchenna"
              onClose={() => setActiveLabel(null)}
              closeLabel="Zamknij"
            />
            <View style={styles.modalBody}>
              <Text style={styles.modalTip}>
                Gotowa etykieta z kodem QR do naklejenia na słoik:
              </Text>

              <View style={styles.labelPreviewBox}>
                <Text style={{ fontFamily: 'Georgia', fontSize: 18, fontWeight: '700', color: '#1C1A17' }}>
                  {activeLabel?.batchId}
                </Text>
                <Text style={{ fontSize: 13, color: '#59544D', marginVertical: 6 }}>
                  URI: {activeLabel?.qrPayload}
                </Text>
                <Text style={{ fontSize: 12, color: theme.colors.pickleGreen, fontWeight: '600' }}>
                  Format: 80x50 mm (Standardowa etykieta boczna)
                </Text>
              </View>

              <KitchenButton
                title="Drukuj / Eksportuj arkusz PDF 🖨️"
                onPress={handleExportPdf}
                style={{ marginTop: 20 }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal Kalkulatora Kosztów Słoika */}
      <Modal visible={isCostModalOpen} animationType="slide" transparent>
        <SafeAreaView style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <ModalHeader
              title="Kalkulator Kosztu Słoika 💰"
              onClose={() => setIsCostModalOpen(false)}
              closeLabel="Zamknij"
            />
            <ScrollView contentContainerStyle={styles.modalBody}>
              <Text style={styles.modalTip}>
                Rzeczywisty koszt rzemieślniczego słoika vs delikatesowa półka sklepowa:
              </Text>

              <Text style={styles.fieldLabel}>Liczba słoików w partii:</Text>
              <View style={styles.presetRow}>
                {[2, 4, 6, 8, 12].map((cnt) => (
                  <TouchableOpacity
                    key={cnt}
                    onPress={() => setCalcJarsCount(cnt)}
                    style={[styles.presetBtn, calcJarsCount === cnt && styles.presetBtnActive]}
                  >
                    <Text style={[styles.presetText, calcJarsCount === cnt && styles.presetTextActive]}>
                      {cnt} szt.
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Waga warzyw (g):</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={String(calcProduceGrams)}
                onChangeText={(v) => setCalcProduceGrams(parseInt(v, 10) || 0)}
              />

              <Text style={styles.fieldLabel}>Cena warzyw (zł / kg):</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={String(calcProducePricePerKg)}
                onChangeText={(v) => setCalcProducePricePerKg(parseFloat(v) || 0)}
              />

              {/* Wynik kalkulacji oszczędności */}
              <View style={styles.costResultBox}>
                <View style={styles.costBigRow}>
                  <View>
                    <Text style={styles.costBigLabel}>Koszt całej partii:</Text>
                    <Text style={styles.costBigValue}>{costMetrics.totalBatchCost.toFixed(2)} zł</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.costBigLabel}>Za 1 słoik:</Text>
                    <Text style={[styles.costBigValue, { color: theme.colors.pickleGreen }]}>
                      {costMetrics.costPerJar.toFixed(2)} zł
                    </Text>
                  </View>
                </View>

                <View style={styles.savingsBox}>
                  <Text style={styles.savingsTitle}>
                    🎉 Twoja oszczędność vs sklep bio ({costMetrics.storeBenchmarkTotalCost.toFixed(2)} zł):
                  </Text>
                  <Text style={styles.savingsAmount}>
                    +{costMetrics.totalSavings.toFixed(2)} zł ({costMetrics.savingsPercent}% taniej!)
                  </Text>
                </View>

                <View style={styles.costBreakdown}>
                  <Text style={styles.breakdownItem}>• Warzywa: {costMetrics.produceCost.toFixed(2)} zł</Text>
                  <Text style={styles.breakdownItem}>
                    • Solanka (woda + sól): {(costMetrics.waterCost + costMetrics.saltCost).toFixed(2)} zł
                  </Text>
                  <Text style={styles.breakdownItem}>• Przyprawy i zioła: {costMetrics.herbsCost.toFixed(2)} zł</Text>
                  <Text style={styles.breakdownItem}>• Słoiki i nowe wieczka: {costMetrics.jarsCost.toFixed(2)} zł</Text>
                  <Text style={styles.breakdownItem}>
                    • Energia kuchenna: {costMetrics.energyCost.toFixed(2)} zł ({costMetrics.energyKwh} kWh)
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Skaner Kodów QR */}
      <QrScannerModal
        visible={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanBatch={handleScanBatch}
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
    padding: theme.spacing.md,
    paddingBottom: 80,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  headerActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  headerActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
  },
  tagline: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bgSecondary,
    borderRadius: theme.borderRadius.md,
    padding: 4,
    marginBottom: theme.spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  tabButtonActive: {
    backgroundColor: theme.colors.bgCard,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  tabButtonTextActive: {
    color: theme.colors.pickleGreen,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.bgSecondary,
    marginRight: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFF',
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
  itemCard: {
    marginBottom: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  itemSub: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  addIngHeaderBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F3EFE6',
    borderRadius: theme.borderRadius.sm,
  },
  addIngCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  addIngTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  ingredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    marginBottom: 8,
  },
  ingName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  ingSub: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  stockControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  stockAmountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#F3EFE6',
    minWidth: 70,
    alignItems: 'center',
  },
  stockAmountText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.bgCard,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    minHeight: '60%',
  },
  modalBody: {
    padding: theme.spacing.lg,
  },
  modalTip: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  labelPreviewBox: {
    backgroundColor: '#FDFBF7',
    borderWidth: 2,
    borderColor: '#3D3A35',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 10,
    marginBottom: 6,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  presetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  presetBtnActive: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  presetTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  costResultBox: {
    marginTop: 16,
    backgroundColor: '#F3EFE6',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.pickleGreen,
  },
  costBigRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  costBigLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  costBigValue: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  savingsBox: {
    backgroundColor: '#EBF5E9',
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    marginBottom: 12,
  },
  savingsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
  },
  savingsAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.pickleGreen,
    marginTop: 2,
  },
  costBreakdown: {
    borderTopWidth: 1,
    borderTopColor: '#DDD7CB',
    paddingTop: 8,
  },
  breakdownItem: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginVertical: 2,
  },
});
