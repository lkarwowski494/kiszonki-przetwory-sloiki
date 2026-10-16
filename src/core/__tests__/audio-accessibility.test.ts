import { announce, announcePasteurizationComplete } from '../announce';
import { cancelButton, okButton, confirmAction } from '../confirm';
import { notifyTimerFinished } from '../timer-audio';
import { Alert, AccessibilityInfo } from 'react-native';

describe('Apps4Brew Dostępność, Potwierdzenia Apple HIG i Audio Kuchenne (z Napara i Piekarza)', () => {
  it('cancelButton i okButton posiadają poprawny styl cancel', () => {
    const cancel = cancelButton();
    expect(cancel.text).toBe('Anuluj');
    expect(cancel.style).toBe('cancel');

    const ok = okButton();
    expect(ok.text).toBe('OK');
    expect(ok.style).toBe('cancel');
  });

  it('confirmAction wywołuje Alert.alert z przyciskiem Anuluj na pierwszym miejscu', () => {
    const spy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const onConfirm = jest.fn();

    confirmAction({
      title: 'Usunąć partię?',
      message: 'Tej operacji nie można cofnąć.',
      actionText: 'Usuń',
      destructive: true,
      onConfirm,
    });

    expect(spy).toHaveBeenCalled();
    const args = spy.mock.calls[0];
    expect(args[0]).toBe('Usunąć partię?');
    expect(args[2]?.[0].text).toBe('Anuluj');
    expect(args[2]?.[1].text).toBe('Usuń');
    expect(args[2]?.[1].style).toBe('destructive');

    spy.mockRestore();
  });

  it('announce i announcePasteurizationComplete wywołują AccessibilityInfo bez rzucania błędów', () => {
    const spy = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});

    announce('Test VoiceOver');
    expect(spy).toHaveBeenCalledWith('Test VoiceOver');

    announcePasteurizationComplete(500, 15);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('500 mililitrów'));

    spy.mockRestore();
  });

  it('notifyTimerFinished wykonuje się bezpiecznie i zwraca Promise', async () => {
    const result = await notifyTimerFinished('Krok 1');
    expect(typeof result).toBe('boolean');
  });
});
