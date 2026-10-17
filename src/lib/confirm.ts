import { Alert } from 'react-native';
import { t } from './i18n';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

const FORBIDDEN_BUTTON_LABELS = new Set(['nie', 'tak', 'wróć', 'wroc', 'no', 'yes', 'back']);

export function validateButtonLabel(label: string): void {
  const normalized = label.trim().toLowerCase();
  if (FORBIDDEN_BUTTON_LABELS.has(normalized)) {
    throw new Error(
      `[NFR-INT-005 / S5] Niedozwolona etykieta przycisku dialogowego: "${label}". ` +
      `Używaj czasowników (np. "Usuń", "Porzuć zmiany") zamiast dwuznacznych "Nie"/"Wróć".`
    );
  }
}

/**
 * Centralny helper potwierdzeń akcji niszczących (NFR-INT-005 / S5)
 */
export function confirm(options: ConfirmOptions): void {
  const {
    title,
    message,
    confirmText,
    cancelText = t('Anuluj'),
    destructive = true,
    onConfirm,
    onCancel,
  } = options;

  validateButtonLabel(confirmText);
  if (cancelText) {
    validateButtonLabel(cancelText);
  }

  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: confirmText,
        style: destructive ? 'destructive' : 'default',
        onPress: onConfirm,
      },
    ],
    { cancelable: true, onDismiss: onCancel }
  );
}
