// ============================================================================
// Słoik (Jarwise) — Sygnalizacja Dźwiękowa i Haptyczna Pasteryzacji (z Piekarza)
// Odtwarza syntetyczny gong kuchenny i zapowiedź VoiceOver po zakończeniu
// ============================================================================

import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { announce } from './announce';

let soundInstance: Audio.Sound | null = null;

/**
 * Wywołuje dźwięk, wibrację oraz zapowiedź VoiceOver po zakończeniu czasu pasteryzacji
 */
export async function notifyTimerFinished(stepName?: string): Promise<boolean> {
  // 1. Dostępność VoiceOver
  const message = stepName
    ? `Pasteryzacja zakończona: ${stepName}`
    : 'Czas pasteryzacji minął! Zdejmij słoiki z ognia.';
  announce(message);

  // 2. Haptyka wysokiego priorytetu
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // ignorowane w testach
  }

  // 3. Syntetyczny dzwonek kuchenny
  try {
    if (soundInstance) {
      await soundInstance.unloadAsync().catch(() => {});
      soundInstance = null;
    }

    const audioDataUri = 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioDataUri },
      { shouldPlay: true, volume: 1.0 }
    );
    soundInstance = sound;
    return true;
  } catch {
    return false;
  }
}
