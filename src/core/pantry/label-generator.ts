export interface LabelConfig {
  batchId: string;
  recipeTitle: string;
  preparedDate: string; // np. "15.07.2026"
  bestBeforeDate?: string;
  salinityOrSugarInfo: string; // np. "Sól: 2.0% (kamienna kłodawska)"
  notes?: string;
  format: 'round_lid_55mm' | 'side_rectangle_80x50mm';
}

export interface PrintableLabel {
  batchId: string;
  qrPayload: string;
  svgContent: string;
  htmlPrintableContent: string;
}

/**
 * Generator rustykalnych etykiet kuchennych w formacie wektorowym SVG / HTML
 */
export function generateJarLabel(config: LabelConfig): PrintableLabel {
  const qrPayload = `sloik://batch/${config.batchId}`;

  if (config.format === 'round_lid_55mm') {
    // Okrągła naklejka na wieczko Twist-Off / Weck (średnica 55 mm)
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="55mm" height="55mm">
  <circle cx="100" cy="100" r="96" fill="#FDFBF7" stroke="#3D3A35" stroke-width="3" stroke-dasharray="6 3" />
  <circle cx="100" cy="100" r="90" fill="none" stroke="#6B655B" stroke-width="1" />
  
  <!-- Ozdobny nagłówek łukowy -->
  <text x="100" y="42" font-family="Georgia, serif" font-size="11" font-weight="bold" text-anchor="middle" fill="#2B2823">DOMOWY PRZETWÓR</text>
  
  <!-- Główna nazwa -->
  <text x="100" y="80" font-family="Georgia, serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1C1A17">${escapeXml(config.recipeTitle)}</text>
  
  <!-- Parametry -->
  <text x="100" y="105" font-family="Arial, sans-serif" font-size="9" text-anchor="middle" fill="#59544D">${escapeXml(config.salinityOrSugarInfo)}</text>
  <text x="100" y="125" font-family="Georgia, serif" font-size="11" font-style="italic" text-anchor="middle" fill="#2B2823">${escapeXml(config.preparedDate)}</text>
  
  <!-- ID partii i kod -->
  <text x="100" y="165" font-family="monospace" font-size="8" text-anchor="middle" fill="#8C8477">ID: ${escapeXml(config.batchId)}</text>
</svg>`.trim();

    return {
      batchId: config.batchId,
      qrPayload,
      svgContent: svg,
      htmlPrintableContent: wrapInPrintableHtml(svg),
    };
  }

  // Prostokątna etykieta boczna 80x50 mm
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 180" width="80mm" height="50mm">
  <rect x="3" y="3" width="294" height="174" rx="8" fill="#FDFBF7" stroke="#3D3A35" stroke-width="3" />
  <rect x="8" y="8" width="284" height="164" rx="5" fill="none" stroke="#8C8477" stroke-width="1" stroke-dasharray="4 2" />
  
  <text x="20" y="38" font-family="Georgia, serif" font-size="16" font-weight="bold" fill="#1C1A17">${escapeXml(config.recipeTitle)}</text>
  <text x="20" y="62" font-family="Arial, sans-serif" font-size="10" fill="#59544D">${escapeXml(config.salinityOrSugarInfo)}</text>
  
  <line x1="20" y1="75" x2="280" y2="75" stroke="#D1CCC2" stroke-width="1" />
  
  <text x="20" y="105" font-family="Georgia, serif" font-size="11" fill="#2B2823">Nastawiono: <tspan font-weight="bold">${escapeXml(config.preparedDate)}</tspan></text>
  ${
    config.bestBeforeDate
      ? `<text x="20" y="125" font-family="Georgia, serif" font-size="10" fill="#6B655B">Najlepiej spożyć przed: ${escapeXml(config.bestBeforeDate)}</text>`
      : ''
  }
  
  <!-- Oznaczenie QR i ID partii -->
  <rect x="230" y="90" width="50" height="50" fill="#EDE8DF" stroke="#8C8477" stroke-width="1" />
  <text x="255" y="118" font-family="sans-serif" font-size="8" text-anchor="middle" fill="#3D3A35">[ QR ]</text>
  <text x="20" y="155" font-family="monospace" font-size="9" fill="#8C8477">${escapeXml(config.batchId)}</text>
</svg>`.trim();

  return {
    batchId: config.batchId,
    qrPayload,
    svgContent: svg,
    htmlPrintableContent: wrapInPrintableHtml(svg),
  };
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapInPrintableHtml(svgContent: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Etykieta Kuchenna Słoik</title>
  <style>
    @page { size: auto; margin: 10mm; }
    body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #FFF; }
    .label-box { page-break-inside: avoid; }
  </style>
</head>
<body>
  <div class="label-box">
    ${svgContent}
  </div>
</body>
</html>`;
}
