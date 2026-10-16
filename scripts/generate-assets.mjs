import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal, zero-dependency pure Node.js PNG encoder
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function createPng(width, height, getPixel) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = getPixel(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a !== undefined ? a : 255;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  function makeChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const len = data ? data.length : 0;
    const chunk = Buffer.alloc(12 + len);
    chunk.writeUInt32BE(len, 0);
    typeBuf.copy(chunk, 4);
    if (data) data.copy(chunk, 8);
    const crc = crc32(Buffer.concat([typeBuf, data || Buffer.alloc(0)]));
    chunk.writeUInt32BE(crc, 8 + len);
    return chunk;
  }

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', deflated),
    makeChunk('IEND', null),
  ]);
}

const assetsDir = path.resolve('assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

console.log('Generating production PNG assets for Słoik (Jarwise)...');

// Helper: Point in rotated rounded rectangle
function inRotatedCapsule(px, py, cx, cy, halfW, halfH, angleRad) {
  const cos = Math.cos(-angleRad);
  const sin = Math.sin(-angleRad);
  const dx = px - cx;
  const dy = py - cy;
  const rx = cos * dx - sin * dy;
  const ry = sin * dx + cos * dy;
  return (Math.abs(rx) <= halfW && Math.abs(ry) <= halfH);
}

// 1. Icon (1024x1024)
// Design: Linen #F7F5F0 background, artisan glass jar with terracotta lid, fermented pickles, bubbles
const iconBuffer = createPng(1024, 1024, (x, y, w, h) => {
  // Base linen background #F7F5F0
  let r = 247, g = 245, b = 240, a = 255;

  // Shadow at base
  const sDx = (x - 512) / 260;
  const sDy = (y - 860) / 30;
  if (sDx * sDx + sDy * sDy <= 1.0) {
    r = 226; g = 221; b = 213;
  }

  // Jar glass body dimensions: x in [282, 742], y in [360, 840]
  const jLeft = 282, jRight = 742, jTop = 360, jBottom = 840;
  const inJarOuter = x >= jLeft && x <= jRight && y >= jTop && y <= jBottom;
  const inJarBorder = inJarOuter && (x < jLeft + 20 || x > jRight - 20 || y < jTop + 20 || y > jBottom + 20);
  const inJarInner = x >= jLeft + 20 && x <= jRight - 20 && y >= jTop + 20 && y <= jBottom - 20;

  if (inJarBorder) {
    return [61, 58, 53, 255]; // Jar outline #3D3A35
  }

  if (inJarInner) {
    // Default glass interior: pure white/light crystal
    r = 255; g = 255; b = 255;

    // Brine liquid fill from y = 500 down to 820
    if (y >= 500) {
      r = 235; g = 243; b = 232; // Brine pale green #EBF3E8
    }

    // Left Pickle (rotated ~ -6 deg, center ~ 382, 655)
    if (inRotatedCapsule(x, y, 382, 655, 40, 115, -0.10)) {
      if (inRotatedCapsule(x, y, 382, 655, 15, 95, -0.10)) {
        return [78, 141, 69, 255]; // Highlight #4E8D45
      }
      return [61, 116, 54, 255]; // Pickle green #3D7436
    }

    // Right Pickle (rotated ~ +8 deg, center ~ 594, 650)
    if (inRotatedCapsule(x, y, 594, 650, 42, 120, 0.14)) {
      if (inRotatedCapsule(x, y, 594, 650, 15, 100, 0.14)) {
        return [61, 116, 54, 255]; // Highlight #3D7436
      }
      return [45, 90, 39, 255]; // Deep dark pickle green #2D5A27
    }

    // Garlic clove circle at (472, 710), r = 32
    const gDx = x - 472;
    const gDy = y - 710;
    const gDistSq = gDx * gDx + gDy * gDy;
    if (gDistSq <= 32 * 32) {
      if (gDistSq > 26 * 26) {
        return [216, 196, 126, 255]; // Border #D8C47E
      }
      return [244, 232, 184, 255]; // Clove fill #F4E8B8
    }

    // CO2 Fermentation Bubbles
    const bubbles = [
      { bx: 442, by: 560, br: 14 },
      { bx: 492, by: 480, br: 18 },
      { bx: 642, by: 580, br: 12 },
      { bx: 372, by: 470, br: 10 },
    ];
    for (const b of bubbles) {
      const bDistSq = (x - b.bx) * (x - b.bx) + (y - b.by) * (y - b.by);
      if (bDistSq <= b.br * b.br) {
        if (bDistSq >= (b.br - 4) * (b.br - 4)) {
          return [123, 168, 116, 255]; // Bubble rim #7BA874
        }
        return [255, 255, 255, 255]; // Bubble white center
      }
    }

    // Glass Shine reflection streak on left edge
    if (x >= jLeft + 25 && x <= jLeft + 45 && y >= 380 && y <= 800) {
      return [255, 255, 255, 255];
    }
  }

  // Neck rim of jar: x in [332, 692], y in [310, 360]
  if (x >= 332 && x <= 692 && y >= 310 && y <= 360) {
    if (x < 348 || x > 676 || y < 322 || y > 348) {
      return [61, 58, 53, 255]; // #3D3A35
    }
    return [244, 239, 230, 255]; // #F4EFE6
  }

  // Terracotta Twist-Off Lid: x in [302, 722], y in [220, 310]
  if (x >= 302 && x <= 722 && y >= 220 && y <= 310) {
    if (x < 318 || x > 706 || y < 232 || y > 298) {
      return [61, 58, 53, 255]; // #3D3A35
    }
    // Embossed lid stripe
    if (y >= 255 && y <= 270 && x >= 330 && x <= 694) {
      return [186, 91, 57, 255]; // Highlight #BA5B39
    }
    return [158, 71, 42, 255]; // Rustic Terracotta #9E472A
  }

  return [r, g, b, a];
});

fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconBuffer);
console.log('  -> assets/icon.png created (1024x1024)');

// 2. Adaptive Icon (Android)
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), iconBuffer);
console.log('  -> assets/adaptive-icon.png created (1024x1024)');

// 3. Splash Screen (1242x2688)
const splashBuffer = createPng(1242, 2688, (x, y, w, h) => {
  // Linen background #F7F5F0
  let r = 247, g = 245, b = 240, a = 255;

  // Center jar emblem scaled in splash screen
  // Offset center at (621, 1344)
  const iconX = Math.round((x - 621) * 1.2 + 512);
  const iconY = Math.round((y - 1344) * 1.2 + 512);

  if (iconX >= 0 && iconX < 1024 && iconY >= 0 && iconY < 1024) {
    const px = iconBuffer;
    // Calculate offset in PNG raw data if needed or sample from generator logic
    const rowSize = 1 + 1024 * 4;
    // We can evaluate directly from generator logic:
    // If inside jar shadow, lid, or body:
    if (iconY >= 215 && iconY <= 890 && iconX >= 250 && iconX <= 774) {
      // Sample from icon generator:
      const jLeft = 282, jRight = 742, jTop = 360, jBottom = 840;
      if (iconX >= 302 && iconX <= 722 && iconY >= 220 && iconY <= 310) {
        return [158, 71, 42, 255]; // Terracotta lid
      }
      if (iconX >= jLeft && iconX <= jRight && iconY >= jTop && iconY <= jBottom) {
        if (iconY >= 500) return [235, 243, 232, 255]; // Brine
        return [255, 255, 255, 255];
      }
    }
  }

  return [r, g, b, a];
});

fs.writeFileSync(path.join(assetsDir, 'splash.png'), splashBuffer);
console.log('  -> assets/splash.png created (1242x2688)');

// 4. Favicon (48x48)
const faviconBuffer = createPng(48, 48, (x, y, w, h) => {
  const nx = (x - 24) / 24;
  const ny = (y - 24) / 24;
  const dist = Math.sqrt(nx * nx + ny * ny);
  if (dist < 0.75) {
    if (ny < -0.3) return [158, 71, 42, 255]; // Terracotta lid
    return [45, 90, 39, 255]; // Pickle green #2D5A27
  }
  return [247, 245, 240, 255]; // Linen
});

fs.writeFileSync(path.join(assetsDir, 'favicon.png'), faviconBuffer);
console.log('  -> assets/favicon.png created (48x48)');

console.log('All production PNG assets created successfully.');
