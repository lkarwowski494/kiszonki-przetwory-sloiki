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
} from 'react-native';
import { dbStore, PantryItemRecord } from '../../src/data/db/database';
import { generateJarLabel, PrintableLabel } from '../../src/core/pantry/label-generator';
import { exportLabelSheetAsPdf } from '../../src/core/pantry/pdf-sheet-generator';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { KitchenButton } from '../../src/ui/components/KitchenButton';
import { Badge } from '../../src/ui/components/Badge';
import { ModalHeader } from '../../src/ui/components/ModalHeader';
import { QrScannerModal } from '../../src/ui/components/QrScannerModal';

export default function PantryScreen() {
  const [items, setItems] = useState<PantryItemRecord[]>([]);
  const [locationFilter, setLocationFilter] = useState<'all' | 'cellar' | 'pantry_cupboard' | 'fridge'>('all');
  const [activeLabel, setActiveLabel] = useState<PrintableLabel | null>(null);
  const [selectedItem, setSelectedItem] = useState<PantryItemRecord | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const reloadPantry = () => {
    const filter = locationFilter === 'all' ? undefined : locationFilter;
    setItems(dbStore.getPantryItems(filter));
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={theme.typography.heroTitle}>Moja Spiżarnia 🫙</Text>
            <TouchableOpacity
              onPress={() => setIsScannerOpen(true)}
              style={styles.scanButton}
              accessibilityLabel="Skanuj słoik aparatem"
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.pickleGreen }}>📷 Skanuj</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.tagline}>
            Twoja duma i zapasy na zimę. Zawsze wiesz, co czeka na półkach.
          </Text>
        </View>

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

        {/* Lista Słoików w Spiżarni */}
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
  scanButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagline: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
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
});
