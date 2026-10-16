import {
  scheduleFermentationAlerts,
  cancelBatchNotification,
  requestNotificationPermissions,
} from '../notifications/kitchen-notifications';
import {
  generateA4SheetHtml,
  printLabelSheetDirectly,
  exportLabelSheetAsPdf,
} from '../pantry/pdf-sheet-generator';
import { calculateFermentationTimeline } from '../timeline/fermentation-timeline';
import { MASTER_RECIPES } from '../recipes/recipes-data';
import * as Notifications from 'expo-notifications';
import * as Print from 'expo-print';

describe('Powiadomienia Lokalne Offline i Generator Arkuszy PDF (BRD F-06 & F-04)', () => {
  const recipe = MASTER_RECIPES[0]; // Ogórki małosolne

  describe('Powiadomienia Kuchenne (kitchen-notifications)', () => {
    it('prosi o uprawnienia do powiadomień', async () => {
      const granted = await requestNotificationPermissions();
      expect(typeof granted).toBe('boolean');
    });

    it('planuje powiadomienia o odgazowaniu i degustacji w przyszłości', async () => {
      const futureStart = Date.now() + 1000 * 60; // start za minutę
      const timeline = calculateFermentationTimeline(recipe, futureStart, 20);

      const scheduled = await scheduleFermentationAlerts('batch-test-123', timeline);
      expect(Array.isArray(scheduled)).toBe(true);

      for (const alert of scheduled) {
        expect(alert.batchId).toBe('batch-test-123');
        expect(alert.notificationId).toBeTruthy();
        expect(alert.title).toBeTruthy();
        expect(alert.body).toBeTruthy();
      }
    });

    it('anuluje zaplanowane powiadomienie bez rzucania błędów', async () => {
      await expect(cancelBatchNotification('notif-id-123')).resolves.toBeUndefined();
    });
  });

  describe('Generator Arkuszy PDF A4 (pdf-sheet-generator)', () => {
    const sheetOptions = {
      labelConfig: {
        batchId: 'batch-sheet-001',
        recipeTitle: 'Baechu-kimchi',
        preparedDate: '16.10.2026',
        bestBeforeDate: '16.04.2027',
        salinityOrSugarInfo: 'Sól: 2.5% + Gochugaru',
        format: 'side_rectangle_80x50mm' as const,
      },
      count: 8,
      paperFormat: 'A4' as const,
    };

    it('generuje poprawny kod HTML arkusza A4 z siatką etykiet', () => {
      const html = generateA4SheetHtml(sheetOptions);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('size: A4 portrait');
      expect(html).toContain('Baechu-kimchi');
      expect(html).toContain('batch-sheet-001');

      // Zawiera dokładnie 8 kart etykiet
      const matches = html.match(/class="label-card"/g);
      expect(matches?.length).toBe(8);
    });

    it('wywołuje Print.printAsync przy drukowaniu bezpośrednim', async () => {
      const spy = jest.spyOn(Print, 'printAsync');
      await printLabelSheetDirectly(sheetOptions);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('generuje plik PDF i zwraca jego URI', async () => {
      const uri = await exportLabelSheetAsPdf(sheetOptions);
      expect(uri).toContain('.pdf');
    });
  });
});
