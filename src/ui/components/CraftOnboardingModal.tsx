// ============================================================================
// Słoik (Jarwise) — Craft Onboarding Modal (Personalizacja Rytuału / Filtr UI)
// Apps4Craft Studio: 1-ekranowy rytuał wyboru profilu rzemiosła.
// 100% Offline-First, zapisywany natychmiast w lokalnej bazie SQLite.
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { dbStore } from '../../data/db/database';
import { t } from '../../lib/i18n';

export type CraftProfileId = 'classic_pickles' | 'world_ferments' | 'canning_pantry';

interface CraftProfileOption {
  id: CraftProfileId;
  title: string;
  subtitle: string;
  emoji: string;
  badge: string;
}

export const CRAFT_PROFILES: CraftProfileOption[] = [
  {
    id: 'classic_pickles',
    title: t('Klasyka Domowa'),
    subtitle: t('Ogórki małosolne i kiszone, kapusta z kminkiem, buraki i czosnek.'),
    emoji: '🥒',
    badge: t('Tradycja'),
  },
  {
    id: 'world_ferments',
    title: t('Fermenty Świata'),
    subtitle: t('Baechu-kimchi, pikle tursu, meksykańskie tepache, sosy hot sauce.'),
    emoji: '🌶️',
    badge: t('Eksploracja'),
  },
  {
    id: 'canning_pantry',
    title: t('Spiżarnia & Weki'),
    subtitle: t('Pasteryzacja, dżemy, powidła, soki, kompoty i etykiety słoikowe.'),
    emoji: '🫙',
    badge: t('Przetwory'),
  },
];

interface CraftOnboardingModalProps {
  visible: boolean;
  onComplete: (profile: CraftProfileId) => void;
  canDismiss?: boolean;
  onClose?: () => void;
}

export const CraftOnboardingModal: React.FC<CraftOnboardingModalProps> = ({
  visible,
  onComplete,
  canDismiss = false,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<CraftProfileId>(
    dbStore.getOnboardingProfile() || 'classic_pickles'
  );

  const handleSelect = (id: CraftProfileId) => {
    setSelectedId(id);
  };

  const handleConfirm = () => {
    dbStore.setOnboardingProfile(selectedId);
    onComplete(selectedId);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <Text style={styles.brandBadge}>APPS4CRAFT STUDIO</Text>
              {canDismiss && onClose && (
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={theme.hitSlop}
                  style={styles.closeBtn}
                  accessibilityLabel={t('Zamknij')}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.heroTitle}>{t('Wybierz Swój Rytuał')}</Text>
            <Text style={styles.heroSubtitle}>
              {t(
                'Dostosujemy interfejs i receptury Słoika do Twojego stylu rzemiosła. Zawsze możesz to zmienić w Ustawieniach.'
              )}
            </Text>
          </View>

          {/* Opcje Rytuału */}
          <View style={styles.optionsList}>
            {CRAFT_PROFILES.map((option) => {
              const isSelected = selectedId === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.profileCard,
                    isSelected && styles.profileCardSelected,
                  ]}
                  onPress={() => handleSelect(option.id)}
                  activeOpacity={0.85}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardEmoji}>{option.emoji}</Text>
                    <View style={styles.badgeWrapper}>
                      <Text
                        style={[
                          styles.cardBadge,
                          isSelected && styles.cardBadgeSelected,
                        ]}
                      >
                        {option.badge}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={styles.cardSubtitle}>{option.subtitle}</Text>

                  <View style={styles.selectionIndicator}>
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text
                      style={[
                        styles.selectionLabel,
                        isSelected && styles.selectionLabelSelected,
                      ]}
                    >
                      {isSelected ? t('Aktywny Rytuał') : t('Wybierz')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Gwarancja Rzemieślnika */}
          <View style={styles.craftPromiseBox}>
            <Text style={styles.promiseTitle}>🛡️ {t('Gwarancja Czystości Rzemiosła:')}</Text>
            <Text style={styles.promiseText}>
              {t(
                '100% offline-first. Żadnego wymogu logowania w chmurze, żadnych reklam i zero zbędnych rozpraszaczy kuchennych.'
              )}
            </Text>
          </View>
        </ScrollView>

        {/* Dolny Przycisk Zatwierdzenia (min 52pt) */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t('Wejdź do Słoika')}
          >
            <Text style={styles.confirmButtonText}>{t('Rozpocznij Rytuał 🫙')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    letterSpacing: 1.2,
  },
  closeBtn: {
    minHeight: 36,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  optionsList: {
    gap: 12,
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    padding: 16,
  },
  profileCardSelected: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: theme.colors.bgCardElevated,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 28,
  },
  badgeWrapper: {
    backgroundColor: theme.colors.bgSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
  },
  cardBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
  },
  cardBadgeSelected: {
    color: theme.colors.pickleGreenLight,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  selectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: theme.colors.pickleGreen,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.pickleGreen,
  },
  selectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  selectionLabelSelected: {
    color: theme.colors.pickleGreenLight,
  },
  craftPromiseBox: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    marginTop: 8,
  },
  promiseTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.amberBrine,
    marginBottom: 4,
  },
  promiseText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
  },
  footer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  confirmButton: {
    minHeight: 52,
    backgroundColor: theme.colors.pickleGreen,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
