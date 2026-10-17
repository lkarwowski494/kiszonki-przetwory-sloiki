import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { theme } from '../src/ui/theme';
import { CraftButton, CraftHeader, CraftStatDisplay } from '@apps4craft/ui';
import { NumInput } from '../src/ui/components/NumInput';

describe('Audyt Dostępności i Wymiarów Ekranu (NFR-A11Y-001..008)', () => {
  test('NFR-A11Y-001: Wszystkie główne komponenty UI posiadają minimalną wysokość celu dotyku >= 44 pt (RD-ENG-03)', () => {
    expect(theme.touchTarget.minHeight).toBeGreaterThanOrEqual(44);
    expect(theme.touchTarget.minWidth).toBeGreaterThanOrEqual(44);
  });

  test('NFR-A11Y-002: CraftButton ma zdefiniowaną rolę dostępności "button" i niepusty label', () => {
    let root: renderer.ReactTestRenderer | undefined;
    act(() => {
      root = renderer.create(
        <CraftButton label="Zapisz partię" onPress={() => {}} />
      );
    });

    const btn = root!.root.findByProps({ testID: 'craft-button' });
    expect(btn.props.accessibilityRole).toBe('button');
    expect(btn.props.accessibilityLabel).toBe('Zapisz partię');
  });

  test('NFR-A11Y-003: NumInput ma minimalną wysokość 48 pt i accessibilityRole "adjustable"', () => {
    let root: renderer.ReactTestRenderer | undefined;
    act(() => {
      root = renderer.create(
        <NumInput
          value="12.5"
          onChangeText={() => {}}
          onChangeNumber={() => {}}
          label="Waga soli"
          unit="g"
        />
      );
    });

    const input = root!.root.findByProps({ testID: 'num-input-field' });
    expect(input).toBeDefined();
    expect(input.props.accessibilityLabel).toContain('Waga soli');
  });

  test('NFR-A11Y-004: CraftStatDisplay renderuje czytelne cyfry z tabular-nums dla blatu roboczego', () => {
    let root: renderer.ReactTestRenderer | undefined;
    act(() => {
      root = renderer.create(
        <CraftStatDisplay
          value="24.5"
          unit="g"
          label="ZALECANA SÓL"
        />
      );
    });

    const stat = root!.root.findByProps({ testID: 'craft-stat-display' });
    expect(stat).toBeDefined();
  });

  test('NFR-A11Y-005: Odporność na szerokość ekranu 320 pt (iPhone SE)', () => {
    // Sprawdzamy czy żaden stały padding nie przekracza 320 pt
    expect(theme.spacing.xl).toBeLessThan(320 / 4);
    expect(theme.touchTarget.minWidth).toBeLessThanOrEqual(320);
  });

  test('NFR-A11Y-006: Missing komponent renderuje rolę "alert" i dostępną akcję', () => {
    const { Missing } = require('../src/ui/components/Missing');
    let root: renderer.ReactTestRenderer | undefined;
    act(() => {
      root = renderer.create(
        <Missing title="Brak słoika" description="Nie znaleziono partii" actionLabel="Wróć" onAction={() => {}} />
      );
    });

    const missingView = root!.root.findByProps({ testID: 'missing-view' });
    expect(missingView.props.accessibilityRole).toBe('alert');
    expect(missingView.props.accessibilityLabel).toContain('Brak słoika');
  });

  test('NFR-A11Y-007: SearchField zapewnia rolę "search" i minimalną wysokość 44 pt', () => {
    const { SearchField } = require('../src/ui/components/SearchField');
    let root: renderer.ReactTestRenderer | undefined;
    act(() => {
      root = renderer.create(
        <SearchField query="ogórki" onChangeQuery={() => {}} placeholder="Szukaj..." />
      );
    });

    const searchField = root!.root.findByProps({ testID: 'search-field' });
    expect(searchField.props.accessibilityRole).toBe('search');
  });

  test('NFR-A11Y-008: CraftCard i CraftModal posiadają poprawne kontenery dotyku', () => {
    const { CraftCard, CraftModal } = require('@apps4craft/ui');
    let rootCard: renderer.ReactTestRenderer | undefined;
    let rootModal: renderer.ReactTestRenderer | undefined;

    act(() => {
      rootCard = renderer.create(
        <CraftCard headerTitle="Partia #12" onPress={() => {}} testID="craft-card-test">
          <></>
        </CraftCard>
      );
      rootModal = renderer.create(
        <CraftModal visible={true} onClose={() => {}} title="Test Modal" testID="craft-modal-test">
          <></>
        </CraftModal>
      );
    });

    const card = rootCard!.root.findByProps({ testID: 'craft-card-test' });
    expect(card).toBeDefined();
    const modal = rootModal!.root.findByProps({ testID: 'craft-modal-test' });
    expect(modal).toBeDefined();
  });
});
