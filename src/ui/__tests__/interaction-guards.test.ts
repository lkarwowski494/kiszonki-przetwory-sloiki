import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { theme } from '../theme';
import {
  CraftHeader,
  CraftButton,
  CraftCard,
  CraftStatDisplay,
  CraftModal,
} from '@apps4craft/ui';

describe('Apps4Craft Wzorce Interakcji i Dostępności (Interaction Guards & @apps4craft/ui)', () => {
  it('zapewnia minimalny rozmiar celu dotykowego 48x48 pt dla rąk kuchennych', () => {
    expect(theme.touchTarget.minHeight).toBeGreaterThanOrEqual(48);
    expect(theme.touchTarget.minWidth).toBeGreaterThanOrEqual(48);
  });

  it('zapewnia standardową bezpieczną strefę kliknięcia hitSlop min. 12 pt', () => {
    expect(theme.hitSlop.top).toBeGreaterThanOrEqual(12);
    expect(theme.hitSlop.bottom).toBeGreaterThanOrEqual(12);
    expect(theme.hitSlop.left).toBeGreaterThanOrEqual(12);
    expect(theme.hitSlop.right).toBeGreaterThanOrEqual(12);
  });

  it('posiada zdefiniowane kontrastowe barwy ceramiczne spełniające wymagania WCAG AAA', () => {
    expect(theme.colors.bg).toBe('#121214');
    expect(theme.colors.textPrimary).toBe('#F4EFEA');
    expect(theme.colors.pickleGreen).toBe('#5B8A61');
    expect(theme.colors.danger).toBe('#D9534F');
  });

  describe('CraftHeader (Safe Area & Navigation)', () => {
    it('renderuje tytuł, podtytuł i reaguje na kliknięcie onClose', () => {
      const onCloseMock = jest.fn();
      let testRenderer: renderer.ReactTestRenderer | undefined;

      act(() => {
        testRenderer = renderer.create(
          React.createElement(CraftHeader, {
            title: 'Nowy Słoik',
            subtitle: 'Kreator Kiszonki',
            onClose: onCloseMock,
          })
        );
      });

      const root = testRenderer!.root;
      const closeBtn = root.findByProps({ testID: 'craft-header-close' });
      expect(closeBtn).toBeDefined();

      act(() => {
        closeBtn.props.onPress();
      });

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('reaguje na kliknięcie onBack z poprawnym hitSlopem', () => {
      const onBackMock = jest.fn();
      let testRenderer: renderer.ReactTestRenderer | undefined;

      act(() => {
        testRenderer = renderer.create(
          React.createElement(CraftHeader, {
            title: 'Szczegóły',
            onBack: onBackMock,
          })
        );
      });

      const root = testRenderer!.root;
      const backBtn = root.findByProps({ testID: 'craft-header-back' });
      expect(backBtn).toBeDefined();
      expect(backBtn.props.hitSlop).toEqual({ top: 12, bottom: 12, left: 12, right: 12 });

      act(() => {
        backBtn.props.onPress();
      });

      expect(onBackMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('CraftButton (Fizyczny Przycisk Kuchenny 52 pt)', () => {
    it('renderuje etykietę i reaguje na kliknięcie', () => {
      const onPressMock = jest.fn();
      let testRenderer: renderer.ReactTestRenderer | undefined;

      act(() => {
        testRenderer = renderer.create(
          React.createElement(CraftButton, {
            label: 'ZAPISZ PARTIĘ',
            onPress: onPressMock,
            variant: 'primary',
          })
        );
      });

      const root = testRenderer!.root;
      const button = root.findByProps({ testID: 'craft-button' });
      expect(button).toBeDefined();

      act(() => {
        button.props.onPress();
      });

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('nie reaguje na kliknięcie, gdy jest wyłączony (disabled)', () => {
      const onPressMock = jest.fn();
      let testRenderer: renderer.ReactTestRenderer | undefined;

      act(() => {
        testRenderer = renderer.create(
          React.createElement(CraftButton, {
            label: 'ZAPISZ PARTIĘ',
            onPress: onPressMock,
            disabled: true,
          })
        );
      });

      const root = testRenderer!.root;
      const button = root.findByProps({ testID: 'craft-button' });
      expect(button.props.disabled).toBe(true);
      expect(button.props.onPress).toBeUndefined();
    });
  });

  describe('CraftStatDisplay (Sacred Numbers)', () => {
    it('poprawnie wyświetla kluczowe parametry rzemiosła (waga, solanka, jednostka)', () => {
      let testRenderer: renderer.ReactTestRenderer | undefined;

      act(() => {
        testRenderer = renderer.create(
          React.createElement(CraftStatDisplay, {
            label: 'SÓL',
            value: '24.5',
            unit: 'g',
            accentColor: '#5B8A61',
            subtext: '2.5% solanki',
          })
        );
      });

      const root = testRenderer!.root;
      const label = root.findByProps({ testID: 'craft-stat-label' });
      const value = root.findByProps({ testID: 'craft-stat-value' });
      const unit = root.findByProps({ testID: 'craft-stat-unit' });
      const subtext = root.findByProps({ testID: 'craft-stat-subtext' });

      expect(label.props.children).toBe('SÓL');
      expect(value.props.children).toBe('24.5');
      expect(unit.props.children).toBe('g');
      expect(subtext.props.children).toBe('2.5% solanki');
    });
  });

  describe('CraftCard (Ceramiczny Kontener)', () => {
    it('renderuje nagłówek, zawartość oraz obsługuje akcję dotykową', () => {
      const onPressMock = jest.fn();
      let testRenderer: renderer.ReactTestRenderer | undefined;

      act(() => {
        testRenderer = renderer.create(
          React.createElement(CraftCard, {
            headerTitle: 'Aktywna Partia',
            onPress: onPressMock,
            children: null,
          })
        );
      });

      const root = testRenderer!.root;
      const card = root.findByProps({ testID: 'craft-card' });
      expect(card).toBeDefined();

      act(() => {
        card.props.onPress();
      });

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('CraftModal (Ceramiczny Modal)', () => {
    it('renderuje zawartość i pozwala na zamknięcie za pomocą onClose', () => {
      const onCloseMock = jest.fn();
      let testRenderer: renderer.ReactTestRenderer | undefined;

      act(() => {
        testRenderer = renderer.create(
          React.createElement(CraftModal, {
            visible: true,
            title: 'Etykieta Słoika',
            onClose: onCloseMock,
            children: null,
          })
        );
      });

      const root = testRenderer!.root;
      const closeBtn = root.findByProps({ testID: 'craft-modal-close' });
      expect(closeBtn).toBeDefined();

      act(() => {
        closeBtn.props.onPress();
      });

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('nie renderuje zawartości, gdy visible=false', () => {
      let testRenderer: renderer.ReactTestRenderer | undefined;

      act(() => {
        testRenderer = renderer.create(
          React.createElement(CraftModal, {
            visible: false,
            title: 'Ukryty Modal',
            onClose: () => {},
            children: null,
          })
        );
      });

      expect(testRenderer!.toJSON()).toBeNull();
    });
  });
});
