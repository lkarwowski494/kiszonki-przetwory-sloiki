// ============================================================================
// Słoik (Jarwise) — Paywall Modal („Taniej niż espresso”)
// Apps4Brew Studio — Apple HIG / WCAG AAA.
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { theme } from '../theme';
import { KitchenButton } from './KitchenButton';
import { Badge } from './Badge';
import { ModalHeader } from './ModalHeader';
import {
  APPS4BREW_PLANS,
  PricingPlanId,
  useAppAccess,
} from '../../core/access/app-access';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  reasonTitle?: string;
  reasonSubtitle?: string;
}

export function PaywallModal({
  visible,
  onClose,
  reasonTitle = 'Okres próbny dobiegł końca 🫙',
  reasonSubtitle = 'Twoja historia przetworów i spiżarnia pozostają w 100% bezpieczne i czytelne (Read-Only). Odblokuj nielimitowane tworzenie nowych partii taniej niż kawa espresso!',
}: PaywallModalProps) {
  const { subscribe, restorePurchases } = useAppAccess();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlanId>('yearly');

  const handleSubscribe = () => {
    subscribe(selectedPlan);
    Alert.alert(
      'Witaj w Apps4Craft Studio! 🎉',
      'Nielimitowane tworzenie partii, etykiet i eksperymentów zostało aktywowane. Smacznego kiszenia!'
    );
    onClose();
  };

  const handleRestore = () => {
    const success = restorePurchases();
    if (success) {
      Alert.alert('Sukces ↺', 'Twoje zakupy zostały pomyślnie przywrócone.');
      onClose();
    } else {
      Alert.alert('Brak zakupów', 'Nie znaleziono aktywnych zakupów powiązanych z Twoim kontem.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ModalHeader
            title="Apps4Craft Studio"
            onClose={onClose}
            closeLabel="Zamknij"
          />

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Nagłówek korzyści */}
            <View style={styles.headerBox}>
              <Text style={styles.heroEmoji}>🫙✨</Text>
              <Text style={styles.title}>{reasonTitle}</Text>
              <Text style={styles.subtitle}>{reasonSubtitle}</Text>
            </View>

            {/* Karta gwarancji historii Read-Only */}
            <View style={styles.readOnlyGuaranteeBox}>
              <Text style={styles.guaranteeTitle}>🛡️ Gwarancja Rzemieślnika (Zasada Read-Only):</Text>
              <Text style={styles.guaranteeText}>
                Nigdy nie stracisz swoich przepisów ani zapisków. Zawsze możesz przeglądać i sprawdzać
                skład słoików w spiżarni całkowicie za darmo.
              </Text>
            </View>

            {/* Lista korzyści */}
            <View style={styles.benefitsList}>
              {[
                'Nielimitowane nowe nastawy słoików i partii w spiżarni',
                'Alerty odgazowywania (burping) i harmonogram fermentacji',
                'Druk arkuszy etykiet PDF A4 z unikalnymi kodami QR',
                'Doktor Mikrobiologiczny: 100% bazy wiedzy biologicznej i ochrona partii',
                'Autorski Warsztat: nielimitowany własny sprzęt i receptury krok po kroku',
              ].map((benefit, i) => (
                <View key={i} style={styles.benefitRow}>
                  <Text style={styles.benefitCheck}>✓</Text>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            {/* Wybór Planu (Cheaper than espresso) */}
            <Text style={styles.sectionTitle}>Wybierz swój plan dostępu:</Text>
            <View style={styles.plansContainer}>
              {APPS4BREW_PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <TouchableOpacity
                    key={plan.id}
                    onPress={() => setSelectedPlan(plan.id)}
                    activeOpacity={0.8}
                    style={[
                      styles.planCard,
                      isSelected && styles.planCardSelected,
                    ]}
                  >
                    <View style={styles.planCardHeader}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={styles.planName}>{plan.namePl}</Text>
                          {plan.highlightBadge && (
                            <Badge label={plan.highlightBadge} variant="green" />
                          )}
                        </View>
                        <Text style={styles.planBilling}>{plan.billingPeriodPl}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.planPrice}>{plan.pricePln}</Text>
                        <Text style={styles.planPriceSub}>({plan.priceUsd})</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Przycisk akcji */}
            <KitchenButton
              title={
                selectedPlan === 'yearly'
                  ? 'Rozpocznij 7 dni darmowego trialu 🚀'
                  : 'Aktywuj nielimitowany dostęp ✨'
              }
              onPress={handleSubscribe}
              style={{ marginTop: 16 }}
            />

            {/* Przywróć zakupy & Informacje prawne */}
            <TouchableOpacity onPress={handleRestore} style={styles.restoreBtn}>
              <Text style={styles.restoreText}>Przywróć wcześniejsze zakupy ↺</Text>
            </TouchableOpacity>

            <Text style={styles.legalNotice}>
              Opłata zostanie pobrana z Twojego konta Apple ID / Google Play. Subskrypcję możesz anulować
              w dowolnym momencie w ustawieniach konta minimum 24h przed końcem okresu. Zakup Lifetime jest
              jednorazowy i bezterminowy.
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.bgCard,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '92%',
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  readOnlyGuaranteeBox: {
    backgroundColor: '#EBF5E9',
    borderRadius: theme.borderRadius.md,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C3E6CB',
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    marginBottom: 4,
  },
  guaranteeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
  },
  benefitsList: {
    backgroundColor: theme.colors.bgSecondary,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    marginBottom: 16,
    gap: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitCheck: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.pickleGreen,
    marginRight: 8,
    width: 18,
  },
  benefitText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  plansContainer: {
    gap: 10,
    marginBottom: 8,
  },
  planCard: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  planCardSelected: {
    borderColor: theme.colors.pickleGreen,
    backgroundColor: '#F7FAF6',
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  planBilling: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.pickleGreen,
  },
  planPriceSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  restoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.pickleGreen,
  },
  legalNotice: {
    fontSize: 11,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 15,
    marginTop: 8,
  },
});
