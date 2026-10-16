// ============================================================================
// Słoik (Jarwise) — ModalHeader (Powered by @apps4craft/ui CraftHeader)
// Universal safe navigation header adhering to strict kitchen-ergonomics & iOS safe-areas.
// ============================================================================

import React from 'react';
import { ViewStyle } from 'react-native';
import { CraftHeader } from '@apps4craft/ui';

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  onBack?: () => void;
  closeLabel?: string;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  subtitle,
  onClose,
  onBack,
  closeLabel = 'Zamknij',
  rightAction,
  style,
}) => {
  return (
    <CraftHeader
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      onBack={onBack}
      closeAccessibilityLabel={closeLabel}
      rightAction={rightAction}
      style={style}
    />
  );
};
