// ============================================================================
// Słoik (Jarwise) — Powiadomienia Lokalne Offline (100% On-Device, 0 PLN)
// Zgodne z wytycznymi BRD F-06.1 (Burping Alerts) i F-06.2 (Tasting Alarms)
// ============================================================================

import * as Notifications from 'expo-notifications';
import { TimelineCalculationResult } from '../timeline/fermentation-timeline';

// Domyślna konfiguracja powiadomień w pierwszym planie
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch {
  // Ignorowane w testach
}

export interface ScheduledAlertInfo {
  notificationId: string;
  batchId: string;
  triggerTimestamp: number;
  type: 'burp' | 'tasting' | 'storage';
  title: string;
  body: string;
}

/**
 * Prosi o uprawnienia do lokalnych powiadomień
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch {
    return false;
  }
}

/**
 * Planuje powiadomienia o odgazowaniu i degustacji dla nowo nastawionego słoika
 */
export async function scheduleFermentationAlerts(
  batchId: string,
  timeline: TimelineCalculationResult
): Promise<ScheduledAlertInfo[]> {
  const scheduled: ScheduledAlertInfo[] = [];

  // 1. Przypomnienia o odgazowaniu (burping) w fazie burzliwej
  for (const day of timeline.burpingDays) {
    const triggerDate = new Date(timeline.startedAt + day * 24 * 60 * 60 * 1000);
    // Ustawienie na godzinę 9:00 rano
    triggerDate.setHours(9, 0, 0, 0);

    // Nie planuj w przeszłości
    if (triggerDate.getTime() > Date.now()) {
      const title = `💨 Odgazuj słoik: ${timeline.recipeTitle}`;
      const body = `Dzień ${day}: Odkręć delikatnie wieczko Twist-Off, aby uwolnić nagromadzony dwutlenek węgla (CO₂).`;

      try {
        const notifId = await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: { batchId, type: 'burp', day },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
          },
        });

        scheduled.push({
          notificationId: notifId,
          batchId,
          triggerTimestamp: triggerDate.getTime(),
          type: 'burp',
          title,
          body,
        });
      } catch {
        // Pomijamy jeśli brak uprawnień
      }
    }
  }

  // 2. Punkt kontrolny degustacji (Tasting Milestone)
  if (timeline.tastingCheckpointTimestamp && timeline.tastingCheckpointTimestamp > Date.now()) {
    const triggerDate = new Date(timeline.tastingCheckpointTimestamp);
    const title = `🍴 Czas na degustację: ${timeline.recipeTitle}!`;
    const body = 'Twoja kiszonka osiągnęła optimum smaku! Spróbuj widelczykiem — jeśli smakuje idealnie, schowaj słoik do lodówki.';

    try {
      const notifId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { batchId, type: 'tasting' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
      });

      scheduled.push({
        notificationId: notifId,
        batchId,
        triggerTimestamp: triggerDate.getTime(),
        type: 'tasting',
        title,
        body,
      });
    } catch {
      // no-op
    }
  }

  return scheduled;
}

/**
 * Anuluje zaplanowane powiadomienie
 */
export async function cancelBatchNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // no-op
  }
}
