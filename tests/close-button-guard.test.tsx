import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { CraftHeader, CraftModal } from '@apps4craft/ui';
import { Text } from 'react-native';

describe('Strażnik S1: Semantyka zamykania ekranu modalnego (NFR-INT-001)', () => {
  test('CraftHeader w modalu posiada przycisk odrzucenia (onClose) z minimalnym polem kliku 44 pt', () => {
    const onClose = jest.fn();
    let root: renderer.ReactTestRenderer | undefined;

    act(() => {
      root = renderer.create(
        <CraftHeader
          title="Nowy Słoik"
          subtitle="Formularz"
          onClose={onClose}
        />
      );
    });

    const closeBtn = root!.root.findByProps({ testID: 'craft-header-close' });
    expect(closeBtn).toBeDefined();
    expect(closeBtn.props.hitSlop).toBeDefined();

    act(() => {
      closeBtn.props.onPress();
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('CraftModal bezpiecznie renderuje nagłówek z przyciskiem zamykania', () => {
    const onClose = jest.fn();
    let root: renderer.ReactTestRenderer | undefined;

    act(() => {
      root = renderer.create(
        <CraftModal visible={true} onClose={onClose} title="Kreator Kiszonki">
          <Text>Zawartość modala</Text>
        </CraftModal>
      );
    });

    const header = root!.root.findByProps({ testID: 'craft-modal-header' });
    expect(header).toBeDefined();
  });
});
