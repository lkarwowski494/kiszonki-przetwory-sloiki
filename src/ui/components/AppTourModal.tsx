// ============================================================================
// Słoik (Jarwise) — Przewodnik po Funkcjach Aplikacji (App Tour Modal)
// (RD-ENG-07, BRD-FEAT-TOUR)
// Kompletny przewodnik po ekranach i modułach: Rytuał, Styl Dowolny, Receptury,
// Dojrzewalnia, Spiżarnia, Doktor Mikrobiologiczny, 100% Offline-First.
// ============================================================================

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme';
import { t } from '../../lib/i18n';

interface AppTourModalProps {
  visible: boolean;
  onClose: () => void;
}

interface TourStep {
  icon: string;
  badge: string;
  title: string;
  subtitle: string;
  features: { icon: string; title: string; desc: string }[];
  proTip: string;
}

export const AppTourModal: React.FC<AppTourModalProps> = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TourStep[] = [
    {
      icon: '⚖️',
      badge: t('MODUŁ GŁÓWNY'),
      title: t('Rytuał: Kalkulator Blatu'),
      subtitle: t('Precyzyjne odmierzanie soli, wody i aktywny zegar przygotowania.'),
      features: [
        {
          icon: '⚖️',
          title: t('Waga surowca'),
          desc: t('Wpisz wagę warzyw z klawiatury lub użyj szybkich przycisków +100g, +500g, +1kg.'),
        },
        {
          icon: '🧂',
          title: t('Święte Liczby Soli'),
          desc: t('Suwak stężenia od razu wylicza gramaturę soli kamiennej oraz potrzebną wodę.'),
        },
        {
          icon: '⏱️',
          title: t('Tryb Skupienia'),
          desc: t('Wbudowany kuchenny stoper maceracji, blanszowania i pasteryzacji zapobiega wygaszaniu ekranu.'),
        },
        {
          icon: '🫙',
          title: t('1-Tap Zapis'),
          desc: t('Po zalaniu słoika zapisz partię jednym kliknięciem prosto do Dojrzewalni.'),
        },
      ],
      proTip: t('W Rytuale masz pod ręką 3 tryby: Styl Dowolny, Receptury Mistrzów oraz Klasyki.'),
    },
    {
      icon: '🧪',
      badge: t('INNOWACJA'),
      title: t('Styl Dowolny: Fermentuj z Lodówki'),
      subtitle: t('Masz resztki warzyw? Inteligentny kompozytor ułoży autorski nastaw.'),
      features: [
        {
          icon: '🥗',
          title: t('Wybór z listy'),
          desc: t('Zaznacz warzywa, które masz w kuchni — pogrupowane w poręczne kategorie.'),
        },
        {
          icon: '🧠',
          title: t('Dobór techniki'),
          desc: t('Aplikacja decyduje, czy ugniatać na sucho (kapusty), czy zalać solanką wodną (ogórki, korzenie).'),
        },
        {
          icon: '🌿',
          title: t('Zioła ze spiżarni'),
          desc: t('Otrzymujesz dopasowany zestaw ziół (koper, chrzan, gorczyca, czosnek, ziele angielskie).'),
        },
        {
          icon: '📲',
          title: t('Załaduj do kalkulatora'),
          desc: t('Przycisk „Zastosuj w kalkulatorze” natychmiast podstawia wyliczenia do wagi blatu.'),
        },
      ],
      proTip: t('Nie musisz szukać przepisów — matematyka soli chroni każdy autorski eksperyment.'),
    },
    {
      icon: '📜',
      badge: t('ENCYKLOPEDIA'),
      title: t('155 Mistrzowskich Receptur Świata'),
      subtitle: t('Baza sprawdzonych tradycji kulinarnych ze wszystkich kontynentów.'),
      features: [
        {
          icon: '🌍',
          title: t('6 kręgów kulturowych'),
          desc: t('Polska i Europa Środkowa, Azja Wschodnia, Bliski Wschód i Indie, Ameryki, Spiżarnia Słodka, Octy.'),
        },
        {
          icon: '🔍',
          title: t('Szybka wyszukiwarka'),
          desc: t('Wpisz dowolny składnik lub nazwę z polskimi znakami — aplikacja od razu znajdzie recepturę.'),
        },
        {
          icon: '📋',
          title: t('Krok po kroku'),
          desc: t('Każda receptura zawiera dokładne proporcje, sekrety chrupkości i typowe błędy.'),
        },
        {
          icon: '🚀',
          title: t('Nastaw w Rytuale'),
          desc: t('Jedno kliknięcie ładuje proporcje wybranej receptury wprost do wagi na blacie.'),
        },
      ],
      proTip: t('Receptury są dostępne zarówno w Rytuale na ekranie głównym, jak i w zakładce Wiedza.'),
    },
    {
      icon: '🫙',
      badge: t('MONITORING'),
      title: t('Dojrzewalnia: Paszport Słoika'),
      subtitle: t('Twój wirtualny blat kuchenny i rejestr biologiczny partii.'),
      features: [
        {
          icon: '🫧',
          title: t('Śledzenie fazy fermentacji'),
          desc: t('Dzień po dniu widzisz, czy słoik burzliwie gazuje, dojrzewa, czy jest gotowy do chłodu.'),
        },
        {
          icon: '💨',
          title: t('Przycisk Odgazuj'),
          desc: t('Odnotuj uchylenie wieczka w paszporcie partii jednym dotknięciem.'),
        },
        {
          icon: '🎯',
          title: t('Radar sensoryczny'),
          desc: t('Oceń kwasowość, słoność, chrupkość i aromat na 5-osiowym radarze rzemieślnika.'),
        },
        {
          icon: '🏷️',
          title: t('Etykiety QR'),
          desc: t('Generuj eleganckie etykiety kuchenne z kodem QR do wydruku na domowej drukarce.'),
        },
      ],
      proTip: t('Gdy partia osiągnie pełnię smaku, kliknij „Przenieś do spiżarni”, by zwolnić blat.'),
    },
    {
      icon: '🏺',
      badge: t('MAGAZYN'),
      title: t('Spiżarnia: Zapasy na Zimę'),
      subtitle: t('Ewidencja gotowych weków i stan surowców w spiżarni.'),
      features: [
        {
          icon: '🥫',
          title: t('Licznik słoików'),
          desc: t('Wiesz dokładnie, ile słoików ogórków, kimchi i dżemów czeka w piwnicy czy szafce.'),
        },
        {
          icon: '🍴',
          title: t('Oznacz jako zjedzone'),
          desc: t('Kliknij „Zjedz słoik”, gdy otwierasz przetwór — stan magazynowy automatycznie ubywa o 1 sztukę.'),
        },
        {
          icon: '🧂',
          title: t('Zapas soli i słoików'),
          desc: t('Kontroluj zapas soli kamiennej, octu, przypraw i zapasowych uszczelek Weck.'),
        },
        {
          icon: '📷',
          title: t('Skaner kodów QR'),
          desc: t('Zeskanuj aparatami kod z etykiety słoika, aby natychmiast otworzyć jego metrykę.'),
        },
      ],
      proTip: t('Spiżarnia znajduje się w drugiej zakładce Dojrzewalni — przełącznik „W Spiżarni”.'),
    },
    {
      icon: '🩺',
      badge: t('BEZPIECZEŃSTWO'),
      title: t('Doktor Mikrobiologiczny'),
      subtitle: t('Interaktywne drzewo diagnostyczne i ratownik solanki.'),
      features: [
        {
          icon: '🔬',
          title: t('3-krokowa diagnoza'),
          desc: t('Odpowiedz na proste pytania o wygląd nalotu, zapach i kolor solanki.'),
        },
        {
          icon: '✅',
          title: t('Jasny werdykt'),
          desc: t('Aplikacja bez wahania wskazuje: „BEZPIECZNE DO JEDZENIA” czy „BEZWZGLĘDNIE WYRZUĆ”.'),
        },
        {
          icon: '💧',
          title: t('Kalkulator dosalania'),
          desc: t('Warzywa wchłonęły solankę? Wylicz dokładnie ile wody i soli dolać, by nie zaburzyć stężenia.'),
        },
        {
          icon: '📚',
          title: t('Ratowanie słoików'),
          desc: t('Poznaj procedury awaryjne: pływające warzywa, kożuszek drożdżowy, mięknięcie.'),
        },
      ],
      proTip: t('Doktora znajdziesz w zakładce Wiedza — wystarczy kliknąć segment „🩺 Doktor Mikrobiologiczny”.'),
    },
    {
      icon: '🔒',
      badge: t('PRYWATNOŚĆ'),
      title: t('100% Offline-First & Twoje Dane'),
      subtitle: t('Zero chmury, zero rejestracji, pełna suwerenność kuchenna.'),
      features: [
        {
          icon: '🛡️',
          title: t('Brak konta i logowania'),
          desc: t('Aplikacja działa w pełni bez internetu. Nie musisz podawać e-maila ani zakładać konta.'),
        },
        {
          icon: '💾',
          title: t('Lokalna baza SQLite'),
          desc: t('Wszystkie partie, zdjęcia i notatki pozostają wyłącznie w pamięci Twojego telefonu.'),
        },
        {
          icon: '📤',
          title: t('Kopia zapasowa JSON'),
          desc: t('W Ustawieniach jednym kliknięciem wyeksportujesz i przywrócisz całą bazę słoików.'),
        },
        {
          icon: '🚫',
          title: t('Zero reklam i trackerów'),
          desc: t('Czyste środowisko pracy kuchennej zgodne ze standardem Zero Telemetry studia Apps4Craft.'),
        },
      ],
      proTip: t('Regularnie wykonuj kopię w Ustawienia -> Kopia Zapasowa, by zabezpieczyć swoje receptury.'),
    },
  ];

  const current = steps[currentStep];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* NAGŁÓWEK */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>{t('Przewodnik po Słoiku')}</Text>
            <Text style={styles.headerStepIndicator}>
              {currentStep + 1} / {steps.length}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            accessibilityLabel={t('Zamknij przewodnik')}
            hitSlop={theme.hitSlop}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* PASEK POSTĘPU */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((currentStep + 1) / steps.length) * 100}%` },
            ]}
          />
        </View>

        {/* TREŚĆ KROKU */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={false}
        >
          {/* KARTA GŁÓWNA */}
          <View style={styles.heroBox}>
            <View style={styles.heroBadgeRow}>
              <Text style={styles.heroBadge}>{current.badge}</Text>
            </View>
            <View style={styles.heroTitleRow}>
              <View style={styles.heroIconBox}>
                <Text style={styles.heroIcon}>{current.icon}</Text>
              </View>
              <View style={styles.heroTextCol}>
                <Text style={styles.stepTitle}>{current.title}</Text>
                <Text style={styles.stepSubtitle}>{current.subtitle}</Text>
              </View>
            </View>
          </View>

          {/* LISTA FUNKCJI */}
          <View style={styles.featuresList}>
            {current.features.map((feat, idx) => (
              <View key={idx} style={styles.featureItem}>
                <View style={styles.featureIconBox}>
                  <Text style={styles.featureIcon}>{feat.icon}</Text>
                </View>
                <View style={styles.featureTextCol}>
                  <Text style={styles.featureTitle}>{feat.title}</Text>
                  <Text style={styles.featureDesc}>{feat.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* WSKAZÓWKA EKSPERTA */}
          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>{t('WSKAZÓWKA MISTRZA')}</Text>
            <Text style={styles.tipText}>{current.proTip}</Text>
          </View>
        </ScrollView>

        {/* STOPKA NAWIGACYJNA */}
        <View style={styles.footer}>
          <View style={styles.dotsRow}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === currentStep && styles.dotActive,
                ]}
              />
            ))}
          </View>

          <View style={styles.footerNav}>
            {currentStep > 0 ? (
              <TouchableOpacity
                onPress={() => setCurrentStep((prev) => prev - 1)}
                style={styles.prevBtn}
                accessibilityLabel={t('Wstecz')}
              >
                <Text style={styles.prevBtnText}>← {t('Wstecz')}</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 80 }} />
            )}

            {currentStep < steps.length - 1 ? (
              <TouchableOpacity
                onPress={() => setCurrentStep((prev) => prev + 1)}
                style={styles.nextBtn}
                accessibilityLabel={t('Dalej')}
              >
                <Text style={styles.nextBtnText}>{t('Dalej →')}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={onClose}
                style={styles.finishBtn}
                accessibilityLabel={t('Rozpocznij rzemiosło')}
              >
                <Text style={styles.finishBtnText}>{t('Zrozumiałem, do dzieła! 🫙')}</Text>
              </TouchableOpacity>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  headerStepIndicator: {
    color: theme.colors.pickleGreen,
    fontSize: 13,
    fontWeight: '700',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  progressBarBg: {
    height: 3,
    backgroundColor: theme.colors.bgCardElevated,
    width: '100%',
  },
  progressBarFill: {
    height: 3,
    backgroundColor: theme.colors.pickleGreen,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 20,
    paddingBottom: 32,
  },
  heroBox: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  heroBadgeRow: {
    marginBottom: 8,
  },
  heroBadge: {
    color: theme.colors.pickleGreen,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heroIcon: {
    fontSize: 26,
    lineHeight: 28,
  },
  heroTextCol: {
    flex: 1,
  },
  stepTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 2,
  },
  stepSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  featuresList: {
    gap: 12,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  featureIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: theme.colors.bgCardElevated,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureIcon: {
    fontSize: 18,
    lineHeight: 20,
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureDesc: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  tipBox: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.amberBrine,
  },
  tipTitle: {
    color: theme.colors.amberBrine,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  tipText: {
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
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.borderLight,
  },
  dotActive: {
    width: 18,
    backgroundColor: theme.colors.pickleGreen,
  },
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prevBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  prevBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  nextBtn: {
    backgroundColor: theme.colors.pickleGreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  finishBtn: {
    backgroundColor: theme.colors.pickleGreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  finishBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
