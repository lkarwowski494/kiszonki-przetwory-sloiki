// ============================================================================
// Słoik (Jarwise) — Dostępność i VoiceOver (wzorce Apps4Brew, adaptacja z Napara)
// Komunikaty głosowe w kuchni poprzez natywne announceForAccessibility
// ============================================================================

import { AccessibilityInfo } from 'react-native';

export const announce = (text: string): void => {
  try {
    AccessibilityInfo.announceForAccessibility(text);
  } catch {
    // brak VoiceOver lub środowisko testowe
  }
};

/**
 * Natychmiastowa zapowiedź zakończenia pasteryzacji dla czytnika ekranu
 */
export function announcePasteurizationComplete(jarVolumeMl: number, minutes: number): void {
  announce(`Pasteryzacja zakończona! Słoik o pojemności ${jarVolumeMl} mililitrów gotowany przez ${minutes} minut. Ostrożnie wyjmij słoiki na ściereczkę.`);
}
