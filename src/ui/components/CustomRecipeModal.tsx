// ============================================================================
// Słoik (Jarwise) — Custom Recipe Modal (Kreator Własnej Procedury Krok po Kroku)
// Pełna wolność rzemieślnika: definicja surowca, stężenia soli i kroków.
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
import { dbStore } from '../../data/db/database';
import { MasterRecipe } from '../../core/types';
import { t } from '../../lib/i18n';

interface CustomRecipeModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: (recipe: MasterRecipe) => void;
}

export const CustomRecipeModal: React.FC<CustomRecipeModalProps> = ({
  visible,
  onClose,
  onSaved,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [produceWeightGrams, setProduceWeightGrams] = useState('1000');
  const [salinityPercent, setSalinityPercent] = useState('2.5');
  const [fermentationDays, setFermentationDays] = useState('7');
  const [stepsText, setStepsText] = useState(
    '1. Umyj i osusz warzywa\n2. Przygotuj roztwór solanki\n3. Włóż przyprawy na dno słoika\n4. Zalej solanką i dociśnij'
  );
  const [ingredientsText, setIngredientsText] = useState(
    'Warzywa: 1000g, Sól kamienna: 25g, Woda: 800ml, Przyprawy: koper, czosnek'
  );

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert(t('Brak nazwy'), t('Wpisz nazwę swojej receptury.'));
      return;
    }

    const steps = stepsText
      .split('\n')
      .map((s) => s.replace(/^\d+\.\s*/, '').trim())
      .filter(Boolean);

    const ingredients = ingredientsText
      .split(',')
      .map((item) => {
        const parts = item.split(':');
        const num = parseFloat((parts[1] || '').replace(/[^\d.]/g, '')) || 1;
        return {
          name: (parts[0] || item).trim(),
          amount: num,
          unit: 'g' as const,
          isMandatory: true,
          notes: (parts[1] || '').trim(),
        };
      })
      .filter((i) => i.name.length > 0);

    const sensoryMilestones = [
      {
        day: 2,
        title: t('Pojawiają się pierwsze pęcherzyki CO2'),
        sensoryDescription: t('Świeży zapach ziołowy'),
      },
      {
        day: Math.max(3, parseInt(fermentationDays, 10) || 7),
        title: t('Solanka lekko mętna, ustabilizowana'),
        sensoryDescription: t('Czysty, kwasowy aromat kiszonki'),
        isTastingCheckpoint: true,
      },
    ];

    const newRecipe: MasterRecipe = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      subtitle: subtitle.trim() || t('Własna procedura rzemieślnicza'),
      culture: t('Receptura Autorska'),
      category: 'poland_central_europe',
      method: 'lacto_fermentation',
      defaultProduceWeightGrams: parseFloat(produceWeightGrams) || 1000,
      defaultSalinityPercent: parseFloat(salinityPercent) || 2.5,
      fermentationDays: parseInt(fermentationDays, 10) || 7,
      shelfLifeMonths: 12,
      recommendedJarType: t('Słoik szklany z dociskiem'),
      ingredients,
      steps,
      crispnessSecrets: [t('Własna kompozycja przypraw i precyzyjne odważenie soli.')],
      sensoryMilestones,
      commonMistakes: [t('Niedostateczne zanurzenie surowca w solance')],
    };

    dbStore.saveCustomRecipe(newRecipe);
    Alert.alert(t('Receptura zapisana! 📝'), t('Twoja autorska procedura została dodana do bazy Wiedzy.'));
    onSaved(newRecipe);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <ModalHeader
          title={t('Nowa Receptura i Procedura')}
          onClose={onClose}
          closeLabel={t('Anuluj')}
          rightAction={
            <TouchableOpacity
              onPress={handleSave}
              hitSlop={theme.hitSlop}
              style={styles.saveHeaderBtn}
            >
              <Text style={styles.saveHeaderText}>{t('Zapisz')}</Text>
            </TouchableOpacity>
          }
        />

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionLabel}>{t('PODSTAWOWE DANE')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('Nazwa receptury (np. Czosnek w miodzie i soli)')}
            placeholderTextColor={theme.colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder={t('Podtytuł / Notatka rzemieślnicza')}
            placeholderTextColor={theme.colors.textMuted}
            value={subtitle}
            onChangeText={setSubtitle}
          />

          <Text style={styles.sectionLabel}>{t('PARAMETRY NASTAWU')}</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.fieldLabel}>{t('Waga surowca (g)')}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={produceWeightGrams}
                onChangeText={setProduceWeightGrams}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.fieldLabel}>{t('Stężenie soli (%)')}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={salinityPercent}
                onChangeText={setSalinityPercent}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.fieldLabel}>{t('Dni (czas)')}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={fermentationDays}
                onChangeText={setFermentationDays}
              />
            </View>
          </View>

          <Text style={styles.sectionLabel}>{t('SKŁADNIKI (oddziel przecinkami)')}</Text>
          <TextInput
            style={[styles.input, styles.multiInput]}
            multiline
            numberOfLines={3}
            placeholder={t('np. Ogórki: 1000g, Koper: 2 baldachy, Czosnek: 3 ząbki')}
            placeholderTextColor={theme.colors.textMuted}
            value={ingredientsText}
            onChangeText={setIngredientsText}
          />

          <Text style={styles.sectionLabel}>{t('PROCEDURA KROK PO KROKU (1 linijka = 1 krok)')}</Text>
          <TextInput
            style={[styles.input, styles.multiInputLarge]}
            multiline
            numberOfLines={6}
            placeholder={t('Wpisz każdy krok w osobnej linijce')}
            placeholderTextColor={theme.colors.textMuted}
            value={stepsText}
            onChangeText={setStepsText}
          />

          <TouchableOpacity
            style={styles.bigSaveBtn}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Text style={styles.bigSaveBtnText}>{t('Zapisz Autorską Procedurę 🫙')}</Text>
          </TouchableOpacity>
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    letterSpacing: 0.8,
    marginTop: 14,
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 4,
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
    marginBottom: 8,
  },
  multiInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  multiInputLarge: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  col: {
    flex: 1,
  },
  saveHeaderBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  saveHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
  },
  bigSaveBtn: {
    backgroundColor: theme.colors.pickleGreen,
    minHeight: 52,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  bigSaveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
