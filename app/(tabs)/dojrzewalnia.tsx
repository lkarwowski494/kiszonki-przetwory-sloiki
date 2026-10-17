// ============================================================================
// Słoik (Jarwise) — Dojrzewalnia 2.0 (Kalendarz, Harmonogram Akcji & Spiżarnia)
// Procesowy układ (BPR):
// 1. 📅 Kalendarz Fermentacji na samej górze (kropki akcji 🟠, kontroli 🔵 i gotowości 🟢)
// 2. ⚡ Chronologiczny Harmonogram Akcji (Najbliższe akcje / Wszystkie akcje + Powiadomienia i eksport .ics)
// 3. 🫙 Twoje Słoiki: [🫧 Na Blacie] ⇄ [🫙 W Spiżarni] (z drukiem etykiet QR i skanerem)
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
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
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import {
  dbStore,
  BatchRecord,
  PantryItemRecord,
} from '../../src/data/db/database';
import { calculateFermentationTimeline } from '../../src/core/timeline/fermentation-timeline';
import { scheduleFermentationAlerts } from '../../src/core/notifications/kitchen-notifications';
import { generateJarLabel, PrintableLabel } from '../../src/core/pantry/label-generator';
import { exportLabelSheetAsPdf } from '../../src/core/pantry/pdf-sheet-generator';
import { theme } from '../../src/ui/theme';
import { KitchenCard } from '../../src/ui/components/KitchenCard';
import { KitchenButton } from '../../src/ui/components/KitchenButton';
import { Badge } from '../../src/ui/components/Badge';
import { ModalHeader } from '../../src/ui/components/ModalHeader';
import { QrScannerModal } from '../../src/ui/components/QrScannerModal';
import { SensoryRadarChart } from '../../src/ui/components/SensoryRadarChart';
import { AppTourModal } from '../../src/ui/components/AppTourModal';
import { useAppAccess } from '../../src/core/access/app-access';
import { PaywallModal } from '../../src/ui/components/PaywallModal';
import { t, useLang } from '../../src/lib/i18n';

export interface ScheduledFermentAction {
  id: string;
  batch: BatchRecord;
  dayOffsetFromToday: number;
  fermentDayNumber: number;
  dateTimestamp: number;
  type: 'burp' | 'taste' | 'ready';
  title: string;
  description: string;
}

const WEEKDAYS_PL = ['Ndz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'];

export default function DojrzewalniaScreen() {
  const router = useRouter();
  const { canCreate } = useAppAccess();
  useLang();

  // Główny przełącznik sekcji słoików
  const [activeSection, setActiveSection] = useState<'counter' | 'pantry'>('counter');

  // Filtr harmonogramu akcji (Najbliższe vs Wszystkie w nowym oknie) oraz filtr wybranego dnia z kalendarza
  const [actionScope, setActionScope] = useState<'nearest' | 'all'>('nearest');
  const [selectedDayOffset, setSelectedDayOffset] = useState<number | null>(null);
  const [isAllActionsModalOpen, setIsAllActionsModalOpen] = useState(false);

  // Stan dla części aktywnej (Na Blacie)
  const [activeBatches, setActiveBatches] = useState<BatchRecord[]>([]);
  const [activeBatchForLog, setActiveBatchForLog] = useState<BatchRecord | null>(null);
  const [logNote, setLogNote] = useState('');
  const [logPh, setLogPh] = useState('3.8');
  const [crispnessStars, setCrispnessStars] = useState(5);
  const [profileAcidity] = useState(3);
  const [profileSalinity] = useState(3);
  const [profileCrispness] = useState(5);
  const [profileEffervescence] = useState(3);
  const [profileAroma] = useState(4);
  const [expandedRadarBatchId, setExpandedRadarBatchId] = useState<string | null>('batch_demo_01');

  // Stan dla części leżakującej (W Spiżarni)
  const [pantryItems, setPantryItems] = useState<PantryItemRecord[]>([]);
  const [locationFilter, setLocationFilter] = useState<'all' | 'cellar' | 'pantry_cupboard' | 'fridge'>('all');
  const [activeLabel, setActiveLabel] = useState<PrintableLabel | null>(null);
  const [selectedItem, setSelectedItem] = useState<PantryItemRecord | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const reloadData = () => {
    setActiveBatches(dbStore.getActiveFerments());
    const filter = locationFilter === 'all' ? undefined : locationFilter;
    setPantryItems(dbStore.getPantryItems(filter));
  };

  useEffect(() => {
    reloadData();
  }, [locationFilter]);

  // ==========================================================================
  // GENEROWANIE CHRONOLOGICZNYCH AKCJI I KALENDARZA 14 DNI
  // ==========================================================================
  const allScheduledActions = useMemo<ScheduledFermentAction[]>(() => {
    const now = new Date();
    const todayNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0).getTime();
    const actions: ScheduledFermentAction[] = [];

    for (const batch of activeBatches) {
      const startD = new Date(batch.startedAt);
      const startNoon = new Date(startD.getFullYear(), startD.getMonth(), startD.getDate(), 12, 0, 0).getTime();
      const targetDays = Math.max(2, batch.targetFermentationDays || 4);

      // Generujemy kamienie milowe dla każdego dnia fermentacji od dzisiaj do końca
      for (let d = 1; d <= targetDays; d++) {
        const eventMs = startNoon + d * 86400000;
        const offsetFromToday = Math.round((eventMs - todayNoon) / 86400000);
        if (offsetFromToday < 0) continue; // Minione dni pomijamy na liście przyszłych akcji

        if (d === targetDays) {
          actions.push({
            id: `${batch.id}_day_${d}_ready`,
            batch,
            dayOffsetFromToday: offsetFromToday,
            fermentDayNumber: d,
            dateTimestamp: eventMs,
            type: 'ready',
            title: t('Koniec fermentacji — przenieś do spiżarni 🫙'),
            description: t('Słoik osiągnął docelowy czas ({days} dni). Przenieś w chłodne miejsce.', { days: targetDays }),
          });
        } else if (d <= 3) {
          actions.push({
            id: `${batch.id}_day_${d}_burp`,
            batch,
            dayOffsetFromToday: offsetFromToday,
            fermentDayNumber: d,
            dateTimestamp: eventMs,
            type: 'burp',
            title: t('Odgazuj słoik (Burp CO₂) 💨'),
            description: t('Dzień {day}: Faza burzliwa — upuść nadmiar gazu spod wieczka.', { day: d }),
          });
        } else if (d === Math.ceil(targetDays / 2)) {
          actions.push({
            id: `${batch.id}_day_${d}_taste`,
            batch,
            dayOffsetFromToday: offsetFromToday,
            fermentDayNumber: d,
            dateTimestamp: eventMs,
            type: 'taste',
            title: t('Kontrola smaku i lustra solanki 📝'),
            description: t('Dzień {day}: Sprawdź chrupkość oraz czy warzywa są pod solanką.', { day: d }),
          });
        }
      }
    }

    return actions.sort((a, b) => a.dayOffsetFromToday - b.dayOffsetFromToday);
  }, [activeBatches]);

  const calendarDays = useMemo(() => {
    const now = new Date();
    const days = [];
    for (let offset = 0; offset < 14; offset++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, 12, 0, 0);
      const dayActions = allScheduledActions.filter((a) => a.dayOffsetFromToday === offset);
      const hasBurp = dayActions.some((a) => a.type === 'burp');
      const hasTaste = dayActions.some((a) => a.type === 'taste');
      const hasReady = dayActions.some((a) => a.type === 'ready');
      days.push({
        offset,
        dayNumber: d.getDate(),
        monthNumber: d.getMonth() + 1,
        weekdayLabel: offset === 0 ? t('Dziś') : offset === 1 ? t('Jutro') : WEEKDAYS_PL[d.getDay()],
        hasBurp,
        hasTaste,
        hasReady,
        totalCount: dayActions.length,
      });
    }
    return days;
  }, [allScheduledActions]);

  const displayedActions = useMemo(() => {
    if (selectedDayOffset !== null) {
      return allScheduledActions.filter((a) => a.dayOffsetFromToday === selectedDayOffset);
    }
    if (actionScope === 'nearest') {
      return allScheduledActions.filter((a) => a.dayOffsetFromToday <= 3).slice(0, 5);
    }
    return allScheduledActions;
  }, [allScheduledActions, actionScope, selectedDayOffset]);

  // Dodanie powiadomienia i eksport wydarzenia .ics do Kalendarza iOS / Google
  const handleAddActionToCalendar = async (action: ScheduledFermentAction) => {
    const timeline = calculateFermentationTimeline(
      {
        id: action.batch.recipeId,
        title: action.batch.recipeTitle,
        subtitle: '',
        culture: action.batch.culture,
        category: 'poland_central_europe',
        method: 'lacto_fermentation',
        defaultProduceWeightGrams: action.batch.produceWeightGrams,
        defaultSalinityPercent: action.batch.salinityPercent,
        fermentationDays: action.batch.targetFermentationDays,
        shelfLifeMonths: 12,
        recommendedJarType: 'Słoik 1000 ml',
        ingredients: [],
        steps: [],
        crispnessSecrets: [],
        sensoryMilestones: [],
        commonMistakes: [],
      },
      action.batch.startedAt
    );
    scheduleFermentationAlerts(action.batch.id, timeline).catch(() => {});

    const eventDate = new Date(action.dateTimestamp);
    const yyyy = eventDate.getFullYear();
    const mm = String(eventDate.getMonth() + 1).padStart(2, '0');
    const dd = String(eventDate.getDate()).padStart(2, '0');
    const dtStart = `${yyyy}${mm}${dd}T180000`;
    const dtEnd = `${yyyy}${mm}${dd}T183000`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Apps4Craft//Sloik Jarwise//PL',
      'BEGIN:VEVENT',
      `SUMMARY:🫙 ${action.batch.recipeTitle}: ${action.title}`,
      `DESCRIPTION:${action.description}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    try {
      const docDir = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory;
      if (docDir && (await Sharing.isAvailableAsync())) {
        const uri = `${docDir}sloik_akcja_${action.id}.ics`;
        await FileSystem.writeAsStringAsync(uri, icsContent, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        await Sharing.shareAsync(uri, {
          mimeType: 'text/calendar',
          dialogTitle: t('Dodaj akcję słoika do Kalendarza'),
          UTI: 'com.apple.ical.ics',
        });
        return;
      }
    } catch {
      // Fallback do powiadomienia i schowka
    }

    await Clipboard.setStringAsync(`${action.batch.recipeTitle} — ${action.title} (${eventDate.toLocaleDateString()})`);
    Alert.alert(
      t('Zaplanowano przypomnienie! 🔔'),
      t('Akcja "{title}" dla słoika "{batch}" ({date}, godz. 18:00) została zapisana w harmonogramie powiadomień.', {
        title: action.title,
        batch: action.batch.recipeTitle,
        date: eventDate.toLocaleDateString(),
      })
    );
  };

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Nagłówek Dojrzewalni — Czysty prawy górny róg z przewodnikiem */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitleText} numberOfLines={1}>{t('Dojrzewalnia 🫙')}</Text>
            <TouchableOpacity
              onPress={() => setIsTourOpen(true)}
              style={styles.tourHeaderBtn}
              accessibilityLabel={t('Przewodnik po funkcjach aplikacji')}
              accessibilityRole="button"
              hitSlop={theme.hitSlop}
            >
              <Text style={styles.iconButtonEmoji}>🧭</Text>
              <Text style={styles.tourHeaderBtnText}>{t('Jak działa aplikacja?')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.tagline}>
            {t('Kalendarz fermentacji, harmonogram akcji i spiżarnia z kodami QR.')}
          </Text>
        </View>

        {/* ================================================================ */}
        {/* KROK 1: KALENDARZ FERMENTACJI NA SAMEJ GÓRZE                     */}
        {/* ================================================================ */}
        <KitchenCard style={styles.calendarCard}>
          <View style={styles.calendarHeaderRow}>
            <Text style={styles.calendarTitle}>📅 {t('Kalendarz Fermentacji (14 dni)')}</Text>
            {selectedDayOffset !== null && (
              <TouchableOpacity
                onPress={() => setSelectedDayOffset(null)}
                hitSlop={theme.hitSlop}
              >
                <Text style={styles.clearDayFilterText}>{t('Pokaż wszystkie dni')}</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarStrip}
          >
            {calendarDays.map((day) => {
              const isSelected = selectedDayOffset === day.offset;
              const isToday = day.offset === 0;
              return (
                <TouchableOpacity
                  key={day.offset}
                  style={[
                    styles.calendarDayCell,
                    isToday && styles.calendarDayCellToday,
                    isSelected && styles.calendarDayCellSelected,
                  ]}
                  onPress={() =>
                    setSelectedDayOffset(isSelected ? null : day.offset)
                  }
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.calendarWeekday,
                      isSelected && styles.calendarTextSelected,
                    ]}
                  >
                    {day.weekdayLabel}
                  </Text>
                  <Text
                    style={[
                      styles.calendarDayNum,
                      isSelected && styles.calendarTextSelected,
                    ]}
                  >
                    {day.dayNumber}.{String(day.monthNumber).padStart(2, '0')}
                  </Text>

                  {/* Kropki wydarzeń dnia */}
                  <View style={styles.calendarDotsRow}>
                    {day.hasBurp && <View style={[styles.calDot, styles.calDotAmber]} />}
                    {day.hasTaste && <View style={[styles.calDot, styles.calDotBlue]} />}
                    {day.hasReady && <View style={[styles.calDot, styles.calDotGreen]} />}
                    {!day.hasBurp && !day.hasTaste && !day.hasReady && (
                      <View style={styles.calDotEmpty} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Legenda kropek kalendarza */}
          <View style={styles.calendarLegendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.calDot, styles.calDotAmber]} />
              <Text style={styles.legendText}>{t('Odgazuj (Burp)')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.calDot, styles.calDotBlue]} />
              <Text style={styles.legendText}>{t('Kontrola smaku')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.calDot, styles.calDotGreen]} />
              <Text style={styles.legendText}>{t('Gotowe do spiżarni')}</Text>
            </View>
          </View>
        </KitchenCard>

        {/* ================================================================ */}
        {/* KROK 2: HARMONOGRAM AKCJI (KOMPAKTOWY PODGLĄD + PEŁNE OKNO)      */}
        {/* ================================================================ */}
        <View style={styles.actionsSection}>
          <View style={styles.actionsHeaderRow}>
            <Text style={styles.sectionHeader}>{t('Harmonogram Akcji ⚡')}</Text>
            <TouchableOpacity
              style={[styles.scopeChip, styles.scopeChipActive]}
              onPress={() => setIsAllActionsModalOpen(true)}
            >
              <Text style={[styles.scopeChipText, styles.scopeChipTextActive]}>
                📅 {t('Wszystkie ({count})', { count: allScheduledActions.length })} →
              </Text>
            </TouchableOpacity>
          </View>

          {displayedActions.length === 0 ? (
            <KitchenCard style={styles.emptyActionCard}>
              <Text style={styles.emptyActionText}>
                {t('Brak zaplanowanych akcji w wybranym terminie. Twoje słoiki spokojnie pracują!')}
              </Text>
            </KitchenCard>
          ) : (
            displayedActions.slice(0, 2).map((actItem) => {
              const dateLabel =
                actItem.dayOffsetFromToday === 0
                  ? t('DZIŚ')
                  : actItem.dayOffsetFromToday === 1
                  ? t('JUTRO')
                  : t('Za {days} dni ({date})', {
                      days: actItem.dayOffsetFromToday,
                      date: new Date(actItem.dateTimestamp).toLocaleDateString(),
                    });

              return (
                <View key={actItem.id} style={styles.actionTimelineCard}>
                  <View style={styles.actionTopRow}>
                    <Badge
                      label={dateLabel}
                      variant={
                        actItem.type === 'ready'
                          ? 'green'
                          : actItem.dayOffsetFromToday === 0
                          ? 'amber'
                          : 'gray'
                      }
                    />
                    <Text style={styles.actionBatchName} numberOfLines={1}>
                      🫙 {actItem.batch.recipeTitle}
                    </Text>
                  </View>

                  <Text style={styles.actionTitle}>{actItem.title}</Text>
                  <Text style={styles.actionDesc}>{actItem.description}</Text>

                  <View style={styles.actionButtonsRow}>
                    {actItem.type === 'ready' ? (
                      <TouchableOpacity
                        style={styles.actionPrimaryBtn}
                        onPress={() => handleMoveToPantry(actItem.batch)}
                      >
                        <Text style={styles.actionPrimaryBtnText}>
                          ✓ {t('Przenieś do spiżarni')}
                        </Text>
                      </TouchableOpacity>
                    ) : actItem.type === 'burp' ? (
                      <TouchableOpacity
                        style={styles.actionPrimaryBtn}
                        onPress={() => handleBurp(actItem.batch.id)}
                      >
                        <Text style={styles.actionPrimaryBtnText}>
                          ✓ {t('Wykonaj (Odgazuj)')}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.actionPrimaryBtn}
                        onPress={() => setActiveBatchForLog(actItem.batch)}
                      >
                        <Text style={styles.actionPrimaryBtnText}>
                          ✓ {t('Oceń smak / pH')}
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.actionCalendarBtn}
                      onPress={() => handleAddActionToCalendar(actItem)}
                    >
                      <Text style={styles.actionCalendarBtnText}>
                        🔔 {t('Przypomnij / Kalendarz')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}

          {allScheduledActions.length > 2 && (
            <TouchableOpacity
              style={styles.actionCalendarBtn}
              onPress={() => setIsAllActionsModalOpen(true)}
            >
              <Text style={styles.actionCalendarBtnText}>
                📅 {t('Otwórz pełny harmonogram akcji w nowym oknie →')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ================================================================ */}
        {/* KROK 3: TWOJE SŁOIKI (NA BLACIE vs W SPIŻARNI)                   */}
        {/* ================================================================ */}
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

        {/* SEKCJA A: NA BLACIE (AKTYWNE FERMENTACJE) */}
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

        {/* SEKCJA B: W SPIŻARNI (GOTOWE SŁOIKI & KOD QR) */}
        {activeSection === 'pantry' && (
          <View>
            <View style={styles.pantryHeaderRow}>
              <Text style={styles.sectionHeader}>{t('Moja Spiżarnia 🫙')}</Text>
              <TouchableOpacity
                style={styles.addSupplyBtn}
                onPress={() => setIsScannerOpen(true)}
                hitSlop={theme.hitSlop}
                accessibilityLabel={t('Skanuj Kod QR Słoika')}
              >
                <Text style={styles.addSupplyText}>📷 {t('Skanuj QR słoika')}</Text>
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
          </View>
        )}

        {/* MODAL: PEŁNY HARMONOGRAM WSZYSTKICH AKCJI */}
        <Modal
          visible={isAllActionsModalOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsAllActionsModalOpen(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <ModalHeader
              title={t('Harmonogram Akcji ⚡')}
              onClose={() => setIsAllActionsModalOpen(false)}
              closeLabel={t('Powrót')}
            />
            <ScrollView contentContainerStyle={styles.modalContent}>
              {allScheduledActions.length === 0 ? (
                <KitchenCard style={styles.emptyActionCard}>
                  <Text style={styles.emptyActionText}>
                    {t('Brak zaplanowanych akcji w wybranym terminie. Twoje słoiki spokojnie pracują!')}
                  </Text>
                </KitchenCard>
              ) : (
                allScheduledActions.map((actItem) => {
                  const dateLabel =
                    actItem.dayOffsetFromToday === 0
                      ? t('DZIŚ')
                      : actItem.dayOffsetFromToday === 1
                      ? t('JUTRO')
                      : t('Za {days} dni ({date})', {
                          days: actItem.dayOffsetFromToday,
                          date: new Date(actItem.dateTimestamp).toLocaleDateString(),
                        });

                  return (
                    <View key={actItem.id} style={styles.actionTimelineCard}>
                      <View style={styles.actionTopRow}>
                        <Badge
                          label={dateLabel}
                          variant={
                            actItem.type === 'ready'
                              ? 'green'
                              : actItem.dayOffsetFromToday === 0
                              ? 'amber'
                              : 'gray'
                          }
                        />
                        <Text style={styles.actionBatchName} numberOfLines={1}>
                          🫙 {actItem.batch.recipeTitle}
                        </Text>
                      </View>

                      <Text style={styles.actionTitle}>{actItem.title}</Text>
                      <Text style={styles.actionDesc}>{actItem.description}</Text>

                      <View style={styles.actionButtonsRow}>
                        {actItem.type === 'ready' ? (
                          <TouchableOpacity
                            style={styles.actionPrimaryBtn}
                            onPress={() => {
                              setIsAllActionsModalOpen(false);
                              handleMoveToPantry(actItem.batch);
                            }}
                          >
                            <Text style={styles.actionPrimaryBtnText}>
                              ✓ {t('Przenieś do spiżarni')}
                            </Text>
                          </TouchableOpacity>
                        ) : actItem.type === 'burp' ? (
                          <TouchableOpacity
                            style={styles.actionPrimaryBtn}
                            onPress={() => handleBurp(actItem.batch.id)}
                          >
                            <Text style={styles.actionPrimaryBtnText}>
                              ✓ {t('Wykonaj (Odgazuj)')}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={styles.actionPrimaryBtn}
                            onPress={() => {
                              setIsAllActionsModalOpen(false);
                              setActiveBatchForLog(actItem.batch);
                            }}
                          >
                            <Text style={styles.actionPrimaryBtnText}>
                              ✓ {t('Oceń smak / pH')}
                            </Text>
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity
                          style={styles.actionCalendarBtn}
                          onPress={() => handleAddActionToCalendar(actItem)}
                        >
                          <Text style={styles.actionCalendarBtnText}>
                            🔔 {t('Przypomnij / Kalendarz')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}

              <TouchableOpacity
                style={[styles.saveLogActionBtn, { marginTop: 12 }]}
                onPress={() => setIsAllActionsModalOpen(false)}
              >
                <Text style={styles.saveLogActionText}>✓ {t('Zatwierdź i zamknij')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>

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

        {/* MODAL PRZEWODNIKA PO APLIKACJI (APP TOUR) */}
        <AppTourModal
          visible={isTourOpen}
          onClose={() => setIsTourOpen(false)}
        />

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
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  headerTitleText: {
    ...theme.typography.heroTitle,
    flex: 1,
    flexShrink: 1,
    fontSize: 22,
    color: theme.colors.textPrimary,
    marginRight: 6,
  },
  tourHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 40,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.pickleGreen,
    borderRadius: 20,
    flexShrink: 0,
  },
  tourHeaderBtnText: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  iconButtonEmoji: {
    fontSize: 18,
    lineHeight: 20,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  calendarCard: {
    backgroundColor: theme.colors.bgCard,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calendarTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  clearDayFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.pickleGreen,
  },
  calendarStrip: {
    gap: 8,
    paddingBottom: 8,
  },
  calendarDayCell: {
    width: 60,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayCellToday: {
    borderColor: theme.colors.pickleGreen,
    borderWidth: 1.5,
  },
  calendarDayCellSelected: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  calendarWeekday: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  calendarDayNum: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  calendarTextSelected: {
    color: '#FFFFFF',
  },
  calendarDotsRow: {
    flexDirection: 'row',
    gap: 4,
    height: 8,
    alignItems: 'center',
  },
  calDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  calDotAmber: {
    backgroundColor: theme.colors.amberBrine,
  },
  calDotBlue: {
    backgroundColor: '#4FC3F7',
  },
  calDotGreen: {
    backgroundColor: theme.colors.pickleGreenLight,
  },
  calDotEmpty: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.colors.border,
  },
  calendarLegendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  actionsSection: {
    marginBottom: 18,
  },
  actionsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scopeToggleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  scopeChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scopeChipActive: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  scopeChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  scopeChipTextActive: {
    color: '#FFFFFF',
  },
  emptyActionCard: {
    padding: 16,
    backgroundColor: theme.colors.bgCard,
  },
  emptyActionText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  actionTimelineCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    marginBottom: 10,
  },
  actionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  actionBatchName: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
    marginBottom: 10,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionPrimaryBtn: {
    flex: 1,
    backgroundColor: theme.colors.pickleGreen,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 9,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  actionPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  actionCalendarBtn: {
    flex: 1,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 9,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  actionCalendarBtnText: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
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
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 10,
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
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
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
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  radarToggleBtn: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarToggleText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  radarBox: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  radarTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  finishFermentBtn: {
    marginTop: 12,
    backgroundColor: theme.colors.pickleGreenMuted,
    borderWidth: 1,
    borderColor: theme.colors.pickleGreen,
    borderRadius: theme.borderRadius.sm,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishFermentText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.pickleGreenLight,
  },
  pantryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addSupplyBtn: {
    backgroundColor: theme.colors.pickleGreen,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.borderRadius.sm,
  },
  addSupplyText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  locationFilterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  locFilterChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  locFilterChipActive: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  locFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  locFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pantryCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    marginBottom: 12,
  },
  pantryActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  labelBtn: {
    flex: 1,
    backgroundColor: theme.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  consumeBtn: {
    flex: 1,
    backgroundColor: theme.colors.pickleGreen,
    borderRadius: theme.borderRadius.sm,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consumeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  modalContent: {
    padding: 18,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.pickleGreen,
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: 12,
    color: theme.colors.textPrimary,
    fontSize: 15,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 8,
  },
  starBtn: {
    padding: 4,
  },
  saveLogActionBtn: {
    backgroundColor: theme.colors.pickleGreen,
    minHeight: 50,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  saveLogActionText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  labelPreviewCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 2,
    borderColor: theme.colors.pickleGreen,
    borderRadius: theme.borderRadius.md,
    padding: 20,
  },
  labelHeaderTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  labelHeaderSub: {
    fontSize: 12,
    color: theme.colors.pickleGreen,
    fontWeight: '700',
    marginTop: 2,
  },
  labelDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 14,
  },
  labelLine: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  formatHint: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 12,
  },
  pdfPrintBtn: {
    backgroundColor: theme.colors.pickleGreen,
    minHeight: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  pdfPrintBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
