// Global mocks for Node / Jest environment in Apps4Brew / Apps4Craft
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('react-native', () => {
  const React = require('react');
  return {
    Alert: {
      alert: jest.fn(),
    },
    AccessibilityInfo: {
      announceForAccessibility: jest.fn(),
    },
    StyleSheet: {
      create: (styles) => styles,
      flatten: (styles) => (Array.isArray(styles) ? Object.assign({}, ...styles.filter(Boolean)) : (styles || {})),
    },
    Platform: {
      OS: 'ios',
      select: (obj) => obj.ios || obj.default,
    },
    View: (props) => React.createElement('View', props),
    Text: (props) => React.createElement('Text', props),
    TouchableOpacity: (props) => React.createElement('TouchableOpacity', props),
    TouchableHighlight: (props) => React.createElement('TouchableHighlight', props),
    Pressable: (props) => React.createElement('Pressable', props),
    ScrollView: (props) => React.createElement('ScrollView', props),
    Modal: (props) => React.createElement('Modal', props),
    TextInput: (props) => React.createElement('TextInput', props),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    useSafeAreaInsets: () => ({ top: 47, bottom: 34, left: 0, right: 0 }),
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children, ...props }) => React.createElement('SafeAreaView', props, children),
  };
});

jest.mock('react-native-svg', () => {
  const React = require('react');
  return {
    Svg: (props) => React.createElement('Svg', props),
    Path: (props) => React.createElement('Path', props),
    Rect: (props) => React.createElement('Rect', props),
    Circle: (props) => React.createElement('Circle', props),
    G: (props) => React.createElement('G', props),
    Defs: (props) => React.createElement('Defs', props),
    LinearGradient: (props) => React.createElement('LinearGradient', props),
    Stop: (props) => React.createElement('Stop', props),
    ClipPath: (props) => React.createElement('ClipPath', props),
  };
});

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  impactAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    remove: jest.fn(),
  })),
  useAudioPlayer: jest.fn(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    remove: jest.fn(),
  })),
}));

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notif-id-123'),
  cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(undefined),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  setNotificationHandler: jest.fn(),
}));

jest.mock('expo-print', () => ({
  printAsync: jest.fn().mockResolvedValue(undefined),
  printToFileAsync: jest.fn().mockResolvedValue({ uri: 'file:///tmp/label-sheet.pdf' }),
}));

jest.mock('expo-camera', () => {
  const React = require('react');
  return {
    CameraView: (props) => React.createElement('CameraView', props),
    useCameraPermissions: () => [{ granted: true }, jest.fn().mockResolvedValue({ granted: true })],
  };
});

jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///documents/',
  writeAsStringAsync: jest.fn().mockResolvedValue(undefined),
  readAsStringAsync: jest.fn().mockResolvedValue('{}'),
  EncodingType: { UTF8: 'utf8' },
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  shareAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn().mockResolvedValue(true),
  getStringAsync: jest.fn().mockResolvedValue(''),
}));

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    runSync: jest.fn(),
    getAllSync: jest.fn(() => []),
    getFirstSync: jest.fn(() => null),
    closeSync: jest.fn(),
  })),
}));

// ============================================================================
// Apps4Craft Studio Design System Mock (@apps4craft/ui)
// ============================================================================
jest.mock('@apps4craft/ui', () => {
  const React = require('react');

  const sharedCraftTokens = {
    colors: {
      bgBasalt: '#121214',
      bgBasaltDark: '#0A0A0C',
      bgBasaltLight: '#18181A',
      bgCard: '#1C1C1F',
      bgCardSecondary: '#242428',
      border: '#2E2E34',
      borderLight: '#3E3E46',
      textPrimary: '#F4EFEA',
      textSecondary: '#A09C96',
      textMuted: '#686561',
      accentLight: '#D9E8D2',
      accentMuted: 'rgba(91, 138, 97, 0.15)',
      danger: '#D9534F',
      dangerMuted: 'rgba(217, 83, 79, 0.15)',
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    borderRadius: { sm: 6, md: 10, lg: 16, full: 9999 },
    touchTargetMin: 48,
    hitSlopStandard: { top: 12, bottom: 12, left: 12, right: 12 },
    typography: {
      displayHero: { fontSize: 36, fontWeight: '700' },
      displayLarge: { fontSize: 28, fontWeight: '700' },
      monoNumber: { fontVariant: ['tabular-nums'] },
    },
  };

  const craftThemes = {
    sloik: {
      id: 'sloik',
      name: 'Słoik',
      sub: 'Kiszonki i przetwory',
      accent: '#5B8A61',
      accentLight: '#D9E8D2',
      accentMuted: 'rgba(91, 138, 97, 0.15)',
      secondaryAccent: '#9E8747',
    },
    piekarz: {
      id: 'piekarz',
      name: 'Piekarz',
      sub: 'Chleb i zakwas',
      accent: '#D49B42',
      accentLight: '#F5DEB3',
      accentMuted: 'rgba(212, 155, 66, 0.15)',
      secondaryAccent: '#C86A28',
    },
    masaz: {
      id: 'masaz',
      name: 'Masaż',
      sub: 'Wędliny i dojrzewanie',
      accent: '#A43E38',
      accentLight: '#F2C4C2',
      accentMuted: 'rgba(164, 62, 56, 0.15)',
      secondaryAccent: '#7D2824',
    },
    ferment: {
      id: 'ferment',
      name: 'Ferment',
      sub: 'Serowarstwo i sery',
      accent: '#E0A838',
      accentLight: '#F7E3B5',
      accentMuted: 'rgba(224, 168, 56, 0.15)',
      secondaryAccent: '#B87820',
    },
    napar: {
      id: 'napar',
      name: 'Napar',
      sub: 'Kawa i herbata specialty',
      accent: '#C86A28',
      accentLight: '#F0BA94',
      accentMuted: 'rgba(200, 106, 40, 0.15)',
      secondaryAccent: '#8C4418',
    },
  };

  const getCraftTheme = (id) => craftThemes[id] || craftThemes.sloik;

  const CraftHeader = ({ title, subtitle, onClose, onBack, rightAction, testID = 'craft-header' }) => (
    React.createElement('View', { testID },
      onBack ? React.createElement('TouchableOpacity', { testID: 'craft-header-back', onPress: onBack, hitSlop: { top: 12, bottom: 12, left: 12, right: 12 } }) : null,
      React.createElement('Text', { testID: 'craft-header-title' }, title),
      subtitle ? React.createElement('Text', { testID: 'craft-header-subtitle' }, subtitle) : null,
      onClose ? React.createElement('TouchableOpacity', { testID: 'craft-header-close', onPress: onClose, hitSlop: { top: 12, bottom: 12, left: 12, right: 12 } }) : null,
      rightAction
    )
  );

  const CraftButton = ({ label, onPress, variant = 'primary', accentColor = '#5B8A61', disabled = false, testID = 'craft-button', style }) => (
    React.createElement('TouchableOpacity', {
      testID,
      onPress: disabled ? undefined : onPress,
      accessibilityRole: 'button',
      disabled,
      style: [{ minHeight: 52 }, style],
    }, React.createElement('Text', null, label))
  );

  const CraftModal = ({ visible, onClose, title, subtitle, children, footer, testID = 'craft-modal' }) => {
    if (!visible) return null;
    return React.createElement('View', { testID },
      onClose ? React.createElement('TouchableOpacity', { testID: 'craft-modal-close', onPress: onClose }) : null,
      title ? React.createElement('Text', null, title) : null,
      children,
      footer
    );
  };

  const CraftCard = ({ children, headerTitle, accentBorder, onPress, style, testID = 'craft-card' }) => (
    React.createElement('TouchableOpacity', {
      testID,
      onPress,
      style,
    },
      headerTitle ? React.createElement('Text', null, headerTitle) : null,
      children
    )
  );

  const CraftStatDisplay = ({ value, label, unit, accentColor, subtext, size = 'md', style, testID = 'craft-stat-display' }) => (
    React.createElement('View', { testID, style },
      React.createElement('Text', { testID: 'craft-stat-label' }, label),
      React.createElement('Text', { testID: 'craft-stat-value' }, String(value)),
      unit ? React.createElement('Text', { testID: 'craft-stat-unit' }, unit) : null,
      subtext ? React.createElement('Text', { testID: 'craft-stat-subtext' }, subtext) : null
    )
  );

  const makeIconMock = (name) => {
    const IconComp = (props) => React.createElement('IconMock', { ...props, name });
    IconComp.displayName = name;
    return IconComp;
  };

  return {
    sharedCraftTokens,
    craftThemes,
    getCraftTheme,
    CraftHeader,
    CraftButton,
    CraftModal,
    CraftCard,
    CraftStatDisplay,
    SloikAppIcon: makeIconMock('SloikAppIcon'),
    NaparAppIcon: makeIconMock('NaparAppIcon'),
    PiekarzAppIcon: makeIconMock('PiekarzAppIcon'),
    MasazAppIcon: makeIconMock('MasazAppIcon'),
    FermentAppIcon: makeIconMock('FermentAppIcon'),
    CraftFamilyEmblem: makeIconMock('CraftFamilyEmblem'),
    ChevronBackIcon: makeIconMock('ChevronBackIcon'),
    CloseIcon: makeIconMock('CloseIcon'),
    PlayIcon: makeIconMock('PlayIcon'),
    PauseIcon: makeIconMock('PauseIcon'),
    NextStepIcon: makeIconMock('NextStepIcon'),
    PrevStepIcon: makeIconMock('PrevStepIcon'),
    ResetIcon: makeIconMock('ResetIcon'),
    QrIcon: makeIconMock('QrIcon'),
    StarIcon: makeIconMock('StarIcon'),
    SettingsIcon: makeIconMock('SettingsIcon'),
    LabIcon: makeIconMock('LabIcon'),
    JournalIcon: makeIconMock('JournalIcon'),
    ScaleIcon: makeIconMock('ScaleIcon'),
    ClockIcon: makeIconMock('ClockIcon'),
    CheckIcon: makeIconMock('CheckIcon'),
    WarningIcon: makeIconMock('WarningIcon'),
    InfoIcon: makeIconMock('InfoIcon'),
    BookIcon: makeIconMock('BookIcon'),
    FlameIcon: makeIconMock('FlameIcon'),
  };
});
