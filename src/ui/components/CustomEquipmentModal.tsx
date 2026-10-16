// ============================================================================
// Słoik (Jarwise) — Custom Equipment Modal (Zarządzanie Słoikami i Sprzętem)
// Pełna wolność rzemieślnika: dodawanie własnych słoików, uszczelek, tary wagowej.
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { theme } from '../theme';
import { ModalHeader } from './ModalHeader';
import { dbStore, CustomEquipmentRecord } from '../../data/db/database';
import { t } from '../../lib/i18n';

interface CustomEquipmentModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export const CustomEquipmentModal: React.FC<CustomEquipmentModalProps> = ({
  visible,
  onClose,
  onUpdated,
}) => {
  const [equipmentList, setEquipmentList] = useState<CustomEquipmentRecord[]>(
    dbStore.getCustomEquipment()
  );
  const [name, setName] = useState('');
  const [volumeMl, setVolumeMl] = useState('1000');
  const [sealType, setSealType] = useState<
    'weck_clips' | 'twist_off' | 'water_airlock' | 'silicone_vent' | 'stoneware'
  >('weck_clips');
  const [tareGrams, setTareGrams] = useState('400');
  const [notes, setNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const reload = () => {
    const list = dbStore.getCustomEquipment();
    setEquipmentList(list);
    if (onUpdated) onUpdated();
  };

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert(t('Brak nazwy'), t('Podaj nazwę sprzętu lub słoika.'));
      return;
    }
    const vol = parseInt(volumeMl, 10) || 1000;
    const tare = parseFloat(tareGrams) || 0;

    dbStore.addCustomEquipment({
      name: name.trim(),
      jarVolumeMl: vol,
      sealType,
      tareWeightGrams: tare,
      notes: notes.trim() || undefined,
    });

    setName('');
    setNotes('');
    setIsAdding(false);
    reload();
  };

  const handleDelete = (id: string, itemTitle: string) => {
    Alert.alert(
      t('Usunąć sprzęt?'),
      t('Czy na pewno chcesz usunąć "{itemTitle}"?', { itemTitle }),
      [
        { text: t('Anuluj'), style: 'cancel' },
        {
          text: t('Usuń'),
          style: 'destructive',
          onPress: () => {
            dbStore.deleteCustomEquipment(id);
            reload();
          },
        },
      ]
    );
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <ModalHeader
          title={t('Słoiki i Sprzęt Rzemieślnika')}
          onClose={onClose}
          closeLabel={t('Zamknij')}
          rightAction={
            !isAdding ? (
              <TouchableOpacity
                onPress={() => setIsAdding(true)}
                hitSlop={theme.hitSlop}
                style={styles.addHeaderBtn}
              >
                <Text style={styles.addHeaderText}>+ {t('Dodaj')}</Text>
              </TouchableOpacity>
            ) : undefined
          }
        />

        <ScrollView contentContainerStyle={styles.content}>
          {isAdding && (
            <View style={styles.addCard}>
              <Text style={styles.addCardTitle}>{t('Nowy Słoik / Naczynie Fermentacyjne')}</Text>

              <Text style={styles.fieldLabel}>{t('Nazwa naczynia')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('np. Weck 1500 ml z uszczelką kauczukową')}
                placeholderTextColor={theme.colors.textMuted}
                value={name}
                onChangeText={setName}
              />

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.fieldLabel}>{t('Pojemność (ml)')}</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={volumeMl}
                    onChangeText={setVolumeMl}
                  />
                </View>
                <View style={styles.col}>
                  <Text style={styles.fieldLabel}>{t('Tara naczynia (g)')}</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="np. 450"
                    placeholderTextColor={theme.colors.textMuted}
                    value={tareGrams}
                    onChangeText={setTareGrams}
                  />
                </View>
              </View>

              <Text style={styles.fieldLabel}>{t('Typ zamknięcia')}</Text>
              <View style={styles.sealRow}>
                {[
                  { id: 'weck_clips', label: t('Weck (klamry)') },
                  { id: 'twist_off', label: t('Twist-off') },
                  { id: 'water_airlock', label: t('Rurka wodna') },
                  { id: 'stoneware', label: t('Kamionka') },
                ].map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[
                      styles.sealChip,
                      sealType === s.id && styles.sealChipActive,
                    ]}
                    onPress={() => setSealType(s.id as any)}
                  >
                    <Text
                      style={[
                        styles.sealChipText,
                        sealType === s.id && styles.sealChipTextActive,
                      ]}
                    >
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>{t('Notatki / Specyfikacja')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('np. Grube szkło sodowe, odporne na 100°C')}
                placeholderTextColor={theme.colors.textMuted}
                value={notes}
                onChangeText={setNotes}
              />

              <View style={styles.addActionsRow}>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleAdd}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveBtnText}>{t('Zapisz do warsztatu 🫙')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setIsAdding(false)}
                  hitSlop={theme.hitSlop}
                >
                  <Text style={styles.cancelBtnText}>{t('Anuluj')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Text style={styles.listHeader}>
            {t('TWOJE SŁOIKI I NACZYNIA ({count})', { count: equipmentList.length })}
          </Text>

          {equipmentList.map((eq) => (
            <View key={eq.id} style={styles.equipmentCard}>
              <View style={styles.cardInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.cardTitle}>{eq.name}</Text>
                  <Text style={styles.volBadge}>{eq.jarVolumeMl} ml</Text>
                </View>
                <Text style={styles.cardDetails}>
                  {t('Zamknięcie: ')}
                  <Text style={styles.detailHighlight}>{eq.sealType}</Text>
                  {eq.tareWeightGrams > 0 && ` · ${t('Tara: ')}${eq.tareWeightGrams} g`}
                </Text>
                {eq.notes && <Text style={styles.cardNotes}>{eq.notes}</Text>}
              </View>

              <TouchableOpacity
                onPress={() => handleDelete(eq.id, eq.name)}
                hitSlop={theme.hitSlop}
                style={styles.deleteBtn}
                accessibilityLabel={t('Usuń sprzęt')}
              >
                <Text style={styles.deleteBtnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  addHeaderBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addHeaderText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
  },
  addCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    marginBottom: 20,
  },
  addCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 4,
    marginTop: 6,
  },
  input: {
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  sealRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 6,
  },
  sealChip: {
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sealChipActive: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: theme.colors.pickleGreenMuted,
  },
  sealChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  sealChipTextActive: {
    color: theme.colors.pickleGreenLight,
  },
  addActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    alignItems: 'center',
  },
  saveBtn: {
    flex: 2,
    backgroundColor: theme.colors.pickleGreen,
    minHeight: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelBtn: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  listHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  equipmentCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
    paddingRight: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  volBadge: {
    backgroundColor: theme.colors.bgSecondary,
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.pickleGreenLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardDetails: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  detailHighlight: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  cardNotes: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  deleteBtn: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: 18,
  },
});
