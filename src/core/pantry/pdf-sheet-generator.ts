// ============================================================================
// Słoik (Jarwise) — Generator Arkuszy Wydruku PDF A4 (expo-print + expo-sharing)
// Zgodne z wytycznymi BRD F-04.4 (Domowy Druk Etykiet na Arkuszach Samoprzylepnych)
// ============================================================================

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generateJarLabel, LabelConfig } from './label-generator';

export interface SheetGenerationOptions {
  labelConfig: LabelConfig;
  count: number; // np. 8 sztuk na arkusz
  paperFormat: 'A4' | 'Letter';
}

/**
 * Generuje kompletny kod HTML arkusza A4 z siatką etykiet kuchennych
 */
export function generateA4SheetHtml(options: SheetGenerationOptions): string {
  const { labelConfig, count } = options;
  const label = generateJarLabel(labelConfig);

  const labelCards = Array.from({ length: count }, () => `
    <div class="label-card">
      ${label.svgContent}
    </div>
  `).join('\n');

  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <title>Arkusz Etykiet — Słoik (${labelConfig.recipeTitle})</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: Georgia, serif;
      background: #FFFFFF;
      color: #1C1A17;
    }
    .sheet-header {
      font-size: 11px;
      color: #7D7569;
      text-align: center;
      margin-bottom: 8mm;
      border-bottom: 1px dashed #D1C9BE;
      padding-bottom: 3mm;
    }
    .grid-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      gap: 6mm;
    }
    .label-card {
      display: inline-block;
      page-break-inside: avoid;
    }
  </style>
</head>
<body>
  <div class="sheet-header">
    <strong>SŁOIK (JARWISE) • ARKUSZ DRUKU ETYKIET KUCHENNYCH</strong> — Partia: ${labelConfig.batchId} | Data: ${labelConfig.preparedDate}
  </div>
  <div class="grid-container">
    ${labelCards}
  </div>
</body>
</html>
  `.trim();
}

/**
 * Wysyła arkusz bezpośrednio do drukarki domowej (AirPrint na iOS / Mopria na Android)
 */
export async function printLabelSheetDirectly(options: SheetGenerationOptions): Promise<void> {
  const html = generateA4SheetHtml(options);
  await Print.printAsync({ html });
}

/**
 * Generuje plik PDF arkusza i otwiera okno systemowe do zapisu lub wysłania
 */
export async function exportLabelSheetAsPdf(options: SheetGenerationOptions): Promise<string> {
  const html = generateA4SheetHtml(options);
  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Eksportuj arkusz etykiet PDF',
      UTI: 'com.adobe.pdf',
    });
  }

  return uri;
}
