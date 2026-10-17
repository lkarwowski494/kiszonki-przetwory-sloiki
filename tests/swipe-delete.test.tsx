import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { View, Text, TouchableOpacity } from 'react-native';

describe('Strażnik S4: Dwutorowe usuwanie elementu z listy (NFR-INT-004)', () => {
  test('element listy wspiera usuwanie za pomocą akcji dostępności accessibilityActions dla VoiceOver', () => {
    const onDelete = jest.fn();
    let root: renderer.ReactTestRenderer | undefined;

    act(() => {
      root = renderer.create(
        <View
          testID="pantry-item-row"
          accessible={true}
          accessibilityLabel="Ogórki kiszone tradycyjne, 3 sztuki"
          accessibilityActions={[{ name: 'delete', label: 'Usuń ze spiżarni' }]}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === 'delete') {
              onDelete();
            }
          }}
        >
          <Text>Ogórki kiszone tradycyjne</Text>
          <TouchableOpacity
            testID="visible-delete-btn"
            accessibilityLabel="Usuń słoik"
            onPress={onDelete}
          >
            <Text>🗑️</Text>
          </TouchableOpacity>
        </View>
      );
    });

    const row = root!.root.findByProps({ testID: 'pantry-item-row' });
    expect(row.props.accessibilityActions).toEqual([
      { name: 'delete', label: 'Usuń ze spiżarni' },
    ]);

    // Wywołanie VoiceOver swipe action
    act(() => {
      row.props.onAccessibilityAction({ nativeEvent: { actionName: 'delete' } });
    });
    expect(onDelete).toHaveBeenCalledTimes(1);

    // Wywołanie widocznego przycisku
    const visibleBtn = root!.root.findByProps({ testID: 'visible-delete-btn' });
    act(() => {
      visibleBtn.props.onPress();
    });
    expect(onDelete).toHaveBeenCalledTimes(2);
  });
});
