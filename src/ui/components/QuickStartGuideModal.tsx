// ============================================================================
// Słoik (Jarwise) — Quick Start Guide Modal (Pierwsze Kroki)
// Apps4Craft Studio: Przewodnik rzemieślniczy dla początkujących i zaawansowanych.
// 100% Offline-First, WCAG AAA kontrast, ceramiczna paleta barw.
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { KitchenCard } from './KitchenCard';
import { KitchenButton } from './KitchenButton';
import { Badge } from './Badge';
import { t } from '../../lib/i18n';

interface GuideStep {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  badge: string;
  bullets: string[];
  goldenRule: string;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'salt_rule',
    emoji: '⚖️',
    title: t('Złota Reguła Soli (Święte Liczby)'),
    subtitle: t('Dlaczego zawsze ważymy sól na gramy, a nie na łyżki?'),
    badge: t('Fundament'),
    bullets: [
      t('2.0% dla kiszenia na sucho (kapusta, kimchi, warzywa ugniatane we własnym soku).'),
      t('2.5% dla solanki wodnej (ogórki, kalafior, rzodkiewki, warzywa korzeniowe).'),
      t('Używaj wyłącznie soli niejodowanej bez antyzbrylacza (np. kłodawska kamienna lub morska).'),
      t('Woda musi być pozbawiona chloru (przegotowana, przefiltrowana lub źródlana).'),
    ],
    goldenRule: t('Złota proporcja solanki: 25g soli kamiennej na 1000ml wody = perfekcyjne 2.5%.'),
  },
  {
    id: 'crisp_secrets',
    emoji: '🫙',
    title: t('Sztuka Układania i Headspace'),
    subtitle: t('Jak utrzymać żelazną chrupkość i chronić przed psuciem?'),
    badge: t('Chrupkość'),
    bullets: [
      t('Odetnij 2 mm końcówki ogórka od strony kwiatu — to tam kryją się enzymy rozmiękczające miąższ.'),
      t('Kąpiel w lodowatej wodzie (1–2h) przed kiszeniem nasyca komórki warzyw turgorem.'),
      t('Zawsze trzymaj warzywa całkowicie pod taflą solanki (docisk szklany lub duży liść kapusty).'),
      t('Pozostaw 2–3 cm wolnej przestrzeni (headspace) pod wieczkiem na gromadzące się gazy CO2.'),
    ],
    goldenRule: t('To, co wystaje ponad solankę, pleśnieje. To, co pod solanką — dojrzewa bez przeszkód.'),
  },
  {
    id: 'counter_timer',
    emoji: '⏱️',
    title: t('Zegar Blatu & Dojrzewalnia'),
    subtitle: t('Twój cyfrowy warsztat kuchenny i paszport każdego słoika'),
    badge: t('Organizacja'),
    bullets: [
      t('Aktywny Zegar Blatu odmierza czas maceracji, blanszowania oraz pasteryzacji.'),
      t('Po zalaniu słoika zapisz nastaw jednym dotknięciem do Dojrzewalni.'),
      t('Każdy słoik otrzymuje unikalny Paszport z datą, stężeniem soli i fazą fermentacji.'),
      t('Aplikacja powiadomi Cię o burzliwym gazowaniu i idealnym momencie na degustację.'),
    ],
    goldenRule: t('Wpisz wagę i sól raz — aplikacja pamięta za Ciebie, kiedy przenieść słoik do chłodu.'),
  },
  {
    id: 'freeform_style',
    emoji: '🧪',
    title: t('Styl Dowolny: Fermentuj z Lodówki'),
    subtitle: t('Masz warzywa w kuchni? Nie potrzebujesz sztywnego przepisu!'),
    badge: t('Innowacja'),
    bullets: [
      t('Wybierz z listy warzywa, które masz pod ręką (np. ogórki + czosnek, lub kapusta + marchew).'),
      t('Inteligentny kompozytor sam dobierze technikę: czy ugniatać na sucho, czy zalać solanką.'),
      t('Dostajesz dopasowane stężenie soli, idealne zioła ze spiżarni i instrukcję krok po kroku.'),
      t('Jednym kliknięciem przeniesiesz gotowy autorski nastaw do kalkulatora Rytuału.'),
    ],
    goldenRule: t('Eksperymentuj bez strachu — matematyka soli i beztlenowe środowisko chronią Twój słoik.'),
  },
  {
    id: 'doctor_rescue',
    emoji: '🩺',
    title: t('Biały Nalot? Bez Paniki: Ratownik'),
    subtitle: t('Różnica między nieszkodliwym kożuszkiem a groźną pleśnią'),
    badge: t('Bezpieczeństwo'),
    bullets: [
      t('Biały, płaski film na powierzchni to w 99% kożuszek drożdżowy (film yeast) — jest w 100% bezpieczny!'),
      t('Prawdziwa pleśń jest sucha, puchata, tworzy kolonie w kolorze zielonym, szarym lub czarnym.'),
      t('Zsiniały czosnek w solance to naturalny efekt kwasowy, a nie zepsucie.'),
      t('Gdy masz wątpliwości, otwórz zakładkę Wiedza -> Doktor Mikrobiologiczny na 3-krokową diagnozę.'),
    ],
    goldenRule: t('Kożuszek zbierz czystą łyżką i ciesz się kiszonką. Pleśń oznacza bezwzględną utylizację.'),
  },
];

interface QuickStartGuideModalProps {
  visible: boolean;
  onClose: () => void;
  onStartRitual?: () => void;
}

export const QuickStartGuideModal: React.FC<QuickStartGuideModalProps> = ({
  visible,
  onClose,
  onStartRitual,
}) => {
  const insets = useSafeAreaInsets();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!visible) return null;

  const currentStep = GUIDE_STEPS[activeStepIndex];

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.brandBadge}>APPS4CRAFT • PRZEWODNIK MISTRZA</Text>
            <Text style={styles.headerTitle}>{t('Pierwsze Kroki w Słoiku')}</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            hitSlop={theme.hitSlop}
            accessibilityLabel={t('Zamknij przewodnik')}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Pasek postępu kroków */}
        <View style={styles.progressRow}>
          {GUIDE_STEPS.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            const isDone = idx < activeStepIndex;
            return (
              <TouchableOpacity
                key={step.id}
                style={[
                  styles.progressDot,
                  isActive && styles.progressDotActive,
                  isDone && styles.progressDotDone,
                ]}
                onPress={() => setActiveStepIndex(idx)}
                hitSlop={theme.hitSlop}
              />
            );
          })}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
          <KitchenCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.stepEmoji}>{currentStep.emoji}</Text>
              <View style={styles.stepTitleBox}>
                <View style={styles.badgeRow}>
                  <Badge label={currentStep.badge} variant="green" />
                  <Text style={styles.stepCounter}>
                    {activeStepIndex + 1} / {GUIDE_STEPS.length}
                  </Text>
                </View>
                <Text style={styles.stepTitle}>{currentStep.title}</Text>
                <Text style={styles.stepSubtitle}>{currentStep.subtitle}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.bulletsList}>
              {currentStep.bullets.map((bullet, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>✓</Text>
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>

            <View style={styles.goldenRuleBox}>
              <Text style={styles.goldenRuleTitle}>💡 {t('ZŁOTA ZASADA')}</Text>
              <Text style={styles.goldenRuleText}>{currentStep.goldenRule}</Text>
            </View>
          </KitchenCard>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerNav}>
            {activeStepIndex > 0 ? (
              <TouchableOpacity
                style={styles.prevBtn}
                onPress={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              >
                <Text style={styles.prevBtnText}>← {t('Wstecz')}</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 80 }} />
            )}

            {activeStepIndex < GUIDE_STEPS.length - 1 ? (
              <KitchenButton
                title={t('Dalej →')}
                onPress={() =>
                  setActiveStepIndex((prev) =>
                    Math.min(GUIDE_STEPS.length - 1, prev + 1)
                  )
                }
                variant="primary"
                style={styles.nextBtn}
              />
            ) : (
              <KitchenButton
                title={t('Rozpocznij Rytuał 🫙')}
                onPress={() => {
                  onClose();
                  if (onStartRitual) onStartRitual();
                }}
                variant="primary"
                style={styles.nextBtn}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  brandBadge: {
    color: theme.colors.pickleGreen,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  closeBtnText: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
  },
  progressDotActive: {
    backgroundColor: theme.colors.pickleGreen,
    height: 4,
  },
  progressDotDone: {
    backgroundColor: theme.colors.pickleGreen,
    opacity: 0.5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 20,
    backgroundColor: theme.colors.bgCard,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepEmoji: {
    fontSize: 44,
  },
  stepTitleBox: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepCounter: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  stepTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  stepSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 16,
  },
  bulletsList: {
    gap: 12,
    marginBottom: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    color: theme.colors.pickleGreen,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  goldenRuleBox: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.pickleGreen,
  },
  goldenRuleTitle: {
    color: theme.colors.pickleGreen,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  goldenRuleText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prevBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  prevBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  nextBtn: {
    flex: 1,
    maxWidth: 200,
  },
});
