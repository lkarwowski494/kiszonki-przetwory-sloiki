// ============================================================================
// Słoik (Jarwise) — Settings & Apps4Craft Studio Ecosystem (Faza 4)
// Rygorystyczny standard rzemieślniczy:
// - Ciemna estetyka ceramiczna (Basalt Ceramic Dark)
// - Personalizacja rytuału (Klasyka / Fermenty Świata / Weki)
// - Zarządzanie sprzętem i słoikami
// - Sekcja „Rodzina Apps4Craft Studio” (5 aplikacji rzemiosła kulinarnego)
// - 100% Offline-First SQLite, Zero telemetrii, 100% symetria i18n
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { dbStore } from '../src/data/db/database';
import { theme } from '../src/ui/theme';
import { KitchenCard } from '../src/ui/components/KitchenCard';
import { KitchenButton } from '../src/ui/components/KitchenButton';
import { ModalHeader } from '../src/ui/components/ModalHeader';
import {
  CRAFT_APPS,
  NaparAppIcon,
  PiekarzAppIcon,
  SloikAppIcon,
  MasazAppIcon,
  FermentAppIcon,
  CraftFamilyEmblem,
} from '@apps4craft/ui';
import { CraftOnboardingModal, CraftProfileId, CRAFT_PROFILES } from '../src/ui/components/CraftOnboardingModal';
import { QuickStartGuideModal } from '../src/ui/components/QuickStartGuideModal';
import { CustomEquipmentModal } from '../src/ui/components/CustomEquipmentModal';

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { Badge } from '../src/ui/components/Badge';
import { useAppAccess } from '../src/core/access/app-access';
import { PaywallModal } from '../src/ui/components/PaywallModal';
import { useLang, setLang, t } from '../src/lib/i18n';
import { useUnitSystem, setUnitSystem } from '../src/core/unit-converter';

export default function SettingsScreen() {
  const router = useRouter();
  const lang = useLang();
  const unitSystem = useUnitSystem();

  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<CraftProfileId>(
    dbStore.getOnboardingProfile() || 'classic_pickles'
  );

  const { status, isSubscribed, isTrialActive, isTrialExpired, daysLeftInTrial, setDebugState } =
    useAppAccess();

  const batches = dbStore.getAllBatches();
  const activeFerments = dbStore.getActiveFerments();
  const pantryItems = dbStore.getPantryItems();
  const equipment = dbStore.getCustomEquipment();

  const handleExportJson = async () => {
    const jsonStr = dbStore.exportBackupJson();
    try {
      const docDir = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || 'file:///tmp/';
      if (docDir) {
        const fileUri = `${docDir}sloik_backup_${Date.now()}.json`;
        await FileSystem.writeAsStringAsync(fileUri, jsonStr, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/json',
            dialogTitle: t('Eksport kopii zapasowej Słoika'),
            UTI: 'public.json',
          });
          return;
        }
      }
    } catch {
      // Fallback do schowka
    }

    await Clipboard.setStringAsync(jsonStr);
    Alert.alert(
      t('Skopiowano do schowka! 📋'),
      t('Kopia zapasowa ({count} partii, {pantryCount} słoików) została zapisana w schowku systemowym.', {
        count: batches.length,
        pantryCount: pantryItems.length,
      })
    );
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setImportJsonText(text);
      }
    } catch {
      // no-op
    }
  };

  const handleImportJson = () => {
    if (!importJsonText.trim()) {
      Alert.alert(t('Błąd'), t('Wklej poprawny ciąg znaków JSON przed importem.'));
      return;
    }

    const success = dbStore.importBackupJson(importJsonText);
    if (success) {
      Alert.alert(
        t('Sukces! 🎉'),
        t('Baza danych została pomyślnie przywrócona z kopii zapasowej.'),
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert(
        t('Błąd importu'),
        t('Podany tekst nie jest prawidłowym plikiem kopii zapasowej Słoika.')
      );
    }
  };

  const activeProfileData =
    CRAFT_PROFILES.find((p) => p.id === activeProfile) || CRAFT_PROFILES[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ModalHeader
        title={t('Ustawienia i Warsztat')}
        onClose={() => router.back()}
        closeLabel={t('Zamknij')}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* ============================================================== */}
        {/* PERSONALIZACJA RYTUAŁU (FAZA 3)                                */}
        {/* ============================================================== */}
        <KitchenCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🎯 {t('Rytuał & Personalizacja')}</Text>
          <Text style={styles.sectionDesc}>
            {t('Wybór rytuału dostosowuje interfejs i sugerowane nastawy do Twojego stylu.')}
          </Text>

          <View style={styles.currentProfileBox}>
            <View style={styles.profileRow}>
              <Text style={{ fontSize: 26, marginRight: 10 }}>{activeProfileData.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileTitle}>{activeProfileData.title}</Text>
                <Text style={styles.profileSubtitle}>{activeProfileData.subtitle}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.changeProfileBtn}
              onPress={() => setIsOnboardingModalOpen(true)}
              hitSlop={theme.hitSlop}
            >
              <Text style={styles.changeProfileText}>🔄 {t('Zmień profil rytuału')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.changeProfileBtn, { marginTop: 8 }]}
              onPress={() => setIsGuideOpen(true)}
              hitSlop={theme.hitSlop}
            >
              <Text style={styles.changeProfileText}>📖 {t('Pierwsze Kroki: Przewodnik Mistrza')}</Text>
            </TouchableOpacity>
          </View>
        </KitchenCard>

        {/* ============================================================== */}
        {/* SPRZĘT I SŁOIKI RZEMIEŚLNIKA                                    */}
        {/* ============================================================== */}
        <KitchenCard style={styles.sectionCard}>
          <View style={styles.headerWithAction}>
            <Text style={styles.sectionTitle}>🫙 {t('Słoiki & Sprzęt ({count})', { count: equipment.length })}</Text>
            <TouchableOpacity
              onPress={() => setIsEquipmentModalOpen(true)}
              hitSlop={theme.hitSlop}
            >
              <Text style={styles.actionLinkText}>{t('Zarządzaj')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionDesc}>
            {t('Definiuj własne naczynia, garnce kamionkowe, słoje z rurką i tarę wagową.')}
          </Text>

          <View style={styles.equipmentPreviewRow}>
            {equipment.slice(0, 3).map((eq) => (
              <View key={eq.id} style={styles.eqPreviewBadge}>
                <Text style={styles.eqPreviewText} numberOfLines={1}>
                  {eq.name} ({eq.jarVolumeMl}ml)
                </Text>
              </View>
            ))}
          </View>
        </KitchenCard>

        {/* ============================================================== */}
        {/* JĘZYK & JEDNOSTKI KUCHENNE                                      */}
        {/* ============================================================== */}
        <KitchenCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🌐 {t('Język & Jednostki')}</Text>
          <Text style={styles.sectionDesc}>
            {t('Dostosuj język aplikacji oraz preferowany układ jednostek kuchennych.')}
          </Text>

          <View style={{ marginBottom: 12 }}>
            <Text style={styles.subfieldLabel}>{t('Język aplikacji')}:</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => setLang('pl')}
                style={[styles.choiceChip, lang === 'pl' && styles.choiceChipActive]}
                hitSlop={theme.hitSlop}
              >
                <Text style={[styles.choiceChipText, lang === 'pl' && styles.choiceChipTextActive]}>
                  🇵🇱 {t('Polski')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLang('en')}
                style={[styles.choiceChip, lang === 'en' && styles.choiceChipActive]}
                hitSlop={theme.hitSlop}
              >
                <Text style={[styles.choiceChipText, lang === 'en' && styles.choiceChipTextActive]}>
                  🇬🇧 {t('Angielski')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text style={styles.subfieldLabel}>{t('Układ jednostek')}:</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => setUnitSystem('metric')}
                style={[styles.choiceChip, unitSystem === 'metric' && styles.choiceChipActive]}
                hitSlop={theme.hitSlop}
              >
                <Text style={[styles.choiceChipText, unitSystem === 'metric' && styles.choiceChipTextActive]}>
                  {t('Metryczny (°C, g, ml)')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUnitSystem('imperial')}
                style={[styles.choiceChip, unitSystem === 'imperial' && styles.choiceChipActive]}
                hitSlop={theme.hitSlop}
              >
                <Text style={[styles.choiceChipText, unitSystem === 'imperial' && styles.choiceChipTextActive]}>
                  {t('Imperialny (°F, oz, fl oz)')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KitchenCard>

        {/* ============================================================== */}
        {/* STATYSTYKI WARSZTATU                                            */}
        {/* ============================================================== */}
        <KitchenCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📊 {t('Twoja Spiżarnia w Liczbach')}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{batches.length}</Text>
              <Text style={styles.statLabel}>{t('Nastawionych partii')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{activeFerments.length}</Text>
              <Text style={styles.statLabel}>{t('Aktywne na blacie')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{pantryItems.length}</Text>
              <Text style={styles.statLabel}>{t('Słoiki w piwnicy')}</Text>
            </View>
          </View>
        </KitchenCard>

        {/* ============================================================== */}
        {/* MODEL MONETYZACJI & DOSTĘP APPS4CRAFT                          */}
        {/* ============================================================== */}
        <KitchenCard style={styles.sectionCard}>
          <View style={styles.headerWithBadge}>
            <Text style={styles.sectionTitle}>💎 {t('Model „Taniej niż espresso”')}</Text>
            <Badge
              label={
                isSubscribed
                  ? 'PEŁNY DOSTĘP (PRO)'
                  : isTrialActive
                  ? `TRIAL (${daysLeftInTrial} DNI)`
                  : 'TRYB READ-ONLY'
              }
              variant={isSubscribed ? 'green' : isTrialActive ? 'amber' : 'red'}
            />
          </View>

          <Text style={styles.sectionDesc}>
            {isSubscribed
              ? t('Posiadasz nielimitowany dostęp do tworzenia partii, etykiet PDF, radaru i laboratorium eksperymentów.')
              : isTrialActive
              ? t('W okresie próbnym (pozostało {daysLeftInTrial} dni) masz dostęp do 100% możliwości aplikacji. Twoja historia jest zawsze czytelna!', { daysLeftInTrial })
              : t('Twój okres próbny dobiegł końca. Wszystkie archiwalne słoiki i spiżarnia są w 100% bezpieczne w trybie Read-Only. Odblokuj tworzenie nowych partii taniej niż kawa espresso.')}
          </Text>

          {!isSubscribed && (
            <KitchenButton
              title="Zobacz plany ($0.99 / $4.99 / $14.99) ✨"
              onPress={() => setIsPaywallOpen(true)}
              style={{ marginVertical: 8 }}
            />
          )}

          {/* Tester stanów (Offline QA) */}
          <View style={styles.qaBox}>
            <Text style={styles.qaTitle}>🧪 {t('Tester stanów dostępu (Offline QA):')}</Text>
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
              <TouchableOpacity
                onPress={() => setDebugState('trial_active')}
                style={[styles.debugChip, isTrialActive && styles.debugChipActive]}
              >
                <Text style={styles.debugChipText}>Trial Aktywny</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDebugState('trial_expired')}
                style={[styles.debugChip, isTrialExpired && styles.debugChipActive]}
              >
                <Text style={styles.debugChipText}>Trial Wygasł</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDebugState('subscribed')}
                style={[styles.debugChip, isSubscribed && styles.debugChipActive]}
              >
                <Text style={styles.debugChipText}>Subskrypcja</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDebugState('reset')}
                style={styles.debugChip}
              >
                <Text style={styles.debugChipText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KitchenCard>

        {/* ============================================================== */}
        {/* KOPIA ZAPASOWA (ZERO DATA LOSS)                                */}
        {/* ============================================================== */}
        <KitchenCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>💾 {t('Kopia Zapasowa (Zero Data Loss)')}</Text>
          <Text style={styles.sectionDesc}>
            {t('Wszystkie Twoje receptury, czasy fermentacji i stany spiżarni są przechowywane w 100% lokalnie na Twoim urządzeniu. Możesz je w każdej chwili wyeksportować.')}
          </Text>

          <KitchenButton
            title={t('Eksportuj bazę do JSON 📤')}
            variant="secondary"
            onPress={handleExportJson}
            style={{ marginVertical: 6 }}
          />

          <KitchenButton
            title={showImportBox ? t('Ukryj pole importu') : t('Przywróć bazę z pliku JSON 📥')}
            variant="ghost"
            onPress={() => setShowImportBox(!showImportBox)}
          />

          {showImportBox && (
            <View style={styles.importBox}>
              <View style={styles.importHeaderRow}>
                <Text style={styles.importPrompt}>{t('Wklej kopię JSON:')}</Text>
                <TouchableOpacity onPress={handlePasteFromClipboard} style={{ padding: 4 }}>
                  <Text style={styles.pasteText}>{t('Wklej ze schowka 📋')}</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.importInput}
                multiline
                numberOfLines={4}
                value={importJsonText}
                onChangeText={setImportJsonText}
                placeholder="Wklej JSON..."
                placeholderTextColor={theme.colors.textMuted}
              />
              <KitchenButton
                title={t('Zatwierdź i przywróć dane')}
                variant="primary"
                onPress={handleImportJson}
                style={{ marginTop: 8 }}
              />
            </View>
          )}
        </KitchenCard>

        {/* ============================================================== */}
        {/* RODZINA APPS4CRAFT STUDIO (FAZA 4)                             */}
        {/* ============================================================== */}
        <KitchenCard style={styles.sectionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <CraftFamilyEmblem size={22} color={theme.colors.pickleGreen} />
            <Text style={styles.sectionTitle}>{t('Rodzina Apps4Craft Studio')}</Text>
          </View>
          <Text style={styles.sectionDesc}>
            {t('Spójny ekosystem niezależnych, 100% offline narzędzi rzemiosła kulinarnego:')}
          </Text>

          <View style={styles.craftFamilyList}>
            {Object.values(CRAFT_APPS).map((app) => (
              <View key={app.id} style={styles.craftAppItem}>
                <View style={styles.appIconWrapper}>
                  {app.id === 'napar' && <NaparAppIcon size={30} color={app.accent} />}
                  {app.id === 'piekarz' && <PiekarzAppIcon size={30} color={app.accent} />}
                  {app.id === 'sloik' && <SloikAppIcon size={30} color={app.accent} />}
                  {app.id === 'masaz' && <MasazAppIcon size={30} color={app.accent} />}
                  {app.id === 'ferment' && <FermentAppIcon size={30} color={app.accent} />}
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.appNameRow}>
                    <Text style={styles.appName}>{app.name}</Text>
                    {app.id === 'sloik' && (
                      <Badge label={t('Zainstalowano')} variant="green" />
                    )}
                  </View>
                  <Text style={styles.appDomain}>{app.domain}</Text>
                  <Text style={styles.appHero}>{app.heroDescriptor}</Text>
                </View>
              </View>
            ))}
          </View>
        </KitchenCard>

        {/* ============================================================== */}
        {/* DOKUMENTY PRAWNE I PRYWATNOŚĆ (APPLE HIG / WCAG AAA)           */}
        {/* ============================================================== */}
        <KitchenCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚖️ {t('Prywatność i Regulamin')}</Text>
          <Text style={styles.sectionDesc}>
            {t('Aplikacja Słoik jest w 100% Offline-First. Twoje receptury, historia i zdjęcia pozostają wyłącznie na Twoim urządzeniu.')}
          </Text>

          <TouchableOpacity
            style={styles.legalRow}
            onPress={() =>
              Alert.alert(
                t('Polityka Prywatności 🛡️'),
                t('Zasada 100% Offline-First:\n• Zero trackerów, zero analityki (Data Not Collected)\n• Wszystkie słoiki i receptury są zapisywane wyłącznie w lokalnej bazie SQLite\n• Zero logowania i brak zewnętrznych serwerów bazy danych.\n\nSzczegóły: docs/PRIVACY_POLICY.md')
              )
            }
          >
            <Text style={styles.legalLink}>🛡️ {t('Polityka Prywatności (Data Not Collected)')}</Text>
            <Text style={styles.legalArrow}>➔</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.legalRow}
            onPress={() =>
              Alert.alert(
                t('Regulamin i Warunki Subskrypcji 📜'),
                t('Model „Taniej niż espresso”:\n• 100% funkcji odblokowanych w okresie próbnym\n• Po zakończeniu trialu Twoja historia jest ZAWSZE w 100% dostępna w trybie Read-Only\n• Subskrypcje: $0.99/msc (~4,49 zł), $4.99/rok (~22,99 zł z 7-dniowym trialem), $14.99 Lifetime (~69,99 zł na zawsze).\n\nSzczegóły: docs/TERMS_OF_SERVICE.md')
              )
            }
          >
            <Text style={styles.legalLink}>📜 {t('Warunki Korzystania i Subskrypcji (EULA)')}</Text>
            <Text style={styles.legalArrow}>➔</Text>
          </TouchableOpacity>
        </KitchenCard>

        {/* O APLIKACJI */}
        <KitchenCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>ℹ️ {t('O Aplikacji')}</Text>
          <Text style={styles.aboutText}>
            <Text style={{ fontWeight: '700' }}>Słoik (Jarwise)</Text> — {t('Wersja 1.0.0 (Wydanie produkcyjne)')}
          </Text>
          <Text style={styles.aboutText}>
            {t('Ekosystem: ')}<Text style={{ fontWeight: '700' }}>Apps4Craft Studio</Text> (Napar, Piekarz, Słoik, Masaż, Ferment)
          </Text>
          <Text style={styles.aboutText}>
            {t('Architektura: ')}<Text style={{ fontWeight: '700' }}>100% Offline-First SQLite WAL</Text>
          </Text>
          <Text style={styles.aboutText}>
            {t('Prywatność: ')}<Text style={{ fontWeight: '700' }}>Data Not Collected</Text> ({t('Zero telemetry')})
          </Text>
        </KitchenCard>

        {/* Modale */}
        <CraftOnboardingModal
          visible={isOnboardingModalOpen}
          canDismiss={true}
          onClose={() => setIsOnboardingModalOpen(false)}
          onComplete={(profile) => {
            setActiveProfile(profile);
            setIsOnboardingModalOpen(false);
          }}
        />

        <QuickStartGuideModal
          visible={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />

        <CustomEquipmentModal
          visible={isEquipmentModalOpen}
          onClose={() => setIsEquipmentModalOpen(false)}
        />

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
  sectionCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  headerWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
  },
  headerWithBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  currentProfileBox: {
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    marginTop: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  profileSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  changeProfileBtn: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
  },
  changeProfileText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.pickleGreenLight,
  },
  equipmentPreviewRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  eqPreviewBadge: {
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  eqPreviewText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  subfieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  choiceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 40,
    justifyContent: 'center',
  },
  choiceChipActive: {
    backgroundColor: theme.colors.pickleGreenMuted,
    borderColor: theme.colors.pickleGreen,
  },
  choiceChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  choiceChipTextActive: {
    color: theme.colors.pickleGreenLight,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 4,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.pickleGreenLight,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  qaBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  qaTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  debugChip: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  debugChipActive: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  debugChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  importBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  importHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  importPrompt: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  pasteText: {
    fontSize: 13,
    color: theme.colors.pickleGreen,
    fontWeight: '600',
  },
  importInput: {
    backgroundColor: theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    fontSize: 12,
    color: theme.colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  craftFamilyList: {
    gap: 10,
    marginTop: 4,
  },
  craftAppItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bgCardElevated,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
  },
  appIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: theme.colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  appNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  appDomain: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  appHero: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  legalLink: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  legalArrow: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  aboutText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginVertical: 2,
    lineHeight: 18,
  },
});
