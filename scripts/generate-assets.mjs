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

function createPng(width, height, getPixel, colorType = 6) {
  const bytesPerPixel = colorType === 2 ? 3 : 4;
  const rowSize = 1 + width * bytesPerPixel;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      const [r, g, b, a] = getPixel(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      if (bytesPerPixel === 4) {
        rawData[pxOffset + 3] = a !== undefined ? a : 255;
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = colorType; // 2: RGB (no alpha, App Store ITMS-90717), 6: RGBA
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

console.log('Generating official Apps4Craft ceramic icons for Słoik (Jarwise)...');

// Math helpers for geometric rendering with anti-aliasing
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  return Math.hypot(px - projX, py - projY);
}

function distToArc(px, py, cx, cy, r) {
  return Math.abs(Math.hypot(px - cx, py - cy) - r);
}

// Blend color onto background
function blend(bg, fg, alpha) {
  const a = Math.max(0, Math.min(1, alpha));
  return [
    Math.round(bg[0] * (1 - a) + fg[0] * a),
    Math.round(bg[1] * (1 - a) + fg[1] * a),
    Math.round(bg[2] * (1 - a) + fg[2] * a),
    255,
  ];
}

// Render Weck jar emblem on ceramic basalt background
function renderJarIconPixel(x, y, w, h) {
  // Normalize coordinates to 1024 base
  const scale = w / 1024;
  const px = x / scale;
  const py = y / scale;

  // 1. Ceramic Basalt Background #121214 with subtle radial illumination
  const centerDist = Math.hypot(px - 512, py - 512) / 600;
  const vignette = Math.max(0, 1 - centerDist * 0.45);
  // Base basalt: R: 18 -> 24 at center, G: 18 -> 24, B: 20 -> 26
  let col = [
    Math.round(18 + 6 * vignette),
    Math.round(18 + 6 * vignette),
    Math.round(20 + 7 * vignette),
    255,
  ];

  // 2. Subtle debossed round ceramic medallion (radius 390px)
  const medallionDist = Math.hypot(px - 512, py - 512);
  if (medallionDist <= 390) {
    const medAlpha = Math.min(1, (390 - medallionDist) / 4);
    // Darker ceramic surface #161619
    col = blend(col, [22, 22, 25], medAlpha * 0.7);
  }
  // Medallion subtle border rim at 390
  const rimDist = Math.abs(medallionDist - 390);
  if (rimDist < 3) {
    const rimA = 1 - rimDist / 3;
    col = blend(col, [46, 46, 52], rimA * 0.4);
  }

  // 3. Weck Jar Emblem Segments
  const jarSegments = [
    // Clamp top bar
    [412, 230, 612, 230],
    // Clamp side brackets
    [412, 230, 385, 290],
    [612, 230, 639, 290],
    // Jar Lid plate
    [340, 290, 684, 290],
    [340, 330, 684, 330],
    [340, 290, 340, 330],
    [684, 290, 684, 330],
    // Rubber gasket ring
    [360, 345, 664, 345],
    // Neck collar
    [375, 360, 649, 360],
    [375, 360, 375, 410],
    [649, 360, 649, 410],
    // Shoulders
    [375, 410, 280, 500],
    [649, 410, 744, 500],
    // Jar Body vertical walls
    [280, 500, 280, 730],
    [744, 500, 744, 730],
    // Bottom flat
    [370, 810, 654, 810],
    // Brine fill level meniscus line
    [300, 530, 724, 530],
  ];

  // Arc corners at bottom of jar
  // Left corner: center (370, 720), r=90, angle from Math.PI to Math.PI/2
  // Right corner: center (654, 720), r=90, angle from 0 to Math.PI/2
  let minStrokeDist = 999;
  for (const [x1, y1, x2, y2] of jarSegments) {
    const d = distToSegment(px, py, x1, y1, x2, y2);
    if (d < minStrokeDist) minStrokeDist = d;
  }

  // Bottom left arc corner
  if (px <= 370 && py >= 720) {
    const d = distToArc(px, py, 370, 720, 90);
    if (d < minStrokeDist) minStrokeDist = d;
  }
  // Bottom right arc corner
  if (px >= 654 && py >= 720) {
    const d = distToArc(px, py, 654, 720, 90);
    if (d < minStrokeDist) minStrokeDist = d;
  }

  // Fermentation bubbles: [cx, cy, radius]
  const bubbles = [
    [435, 620, 26],
    [585, 665, 32],
    [485, 725, 22],
    [380, 690, 20],
    [620, 580, 18],
    [515, 595, 16],
    [440, 765, 14],
  ];

  let minBubbleRimDist = 999;
  let insideAnyBubble = false;
  for (const [bx, by, br] of bubbles) {
    const bDist = Math.hypot(px - bx, py - by);
    const rimD = Math.abs(bDist - br);
    if (rimD < minBubbleRimDist) minBubbleRimDist = rimD;
    if (bDist <= br) insideAnyBubble = true;
  }

  // Weck Clamp central pressure spring
  const springDist = distToSegment(px, py, 470, 275, 554, 275);
  if (springDist < minStrokeDist) minStrokeDist = springDist;

  // Dill crown symbol inside jar: center (512, 650)
  const dillStems = [
    [512, 650, 512, 610],
    [512, 630, 480, 605],
    [512, 630, 544, 605],
    [480, 605, 470, 590],
    [480, 605, 490, 585],
    [544, 605, 534, 585],
    [544, 605, 554, 590],
  ];
  for (const [x1, y1, x2, y2] of dillStems) {
    const d = distToSegment(px, py, x1, y1, x2, y2);
    if (d < minStrokeDist) minStrokeDist = d;
  }

  // Stroke width: 14px (half-width = 7px)
  const halfStroke = 7;
  const strokeColor = [91, 138, 97]; // Słoik Dill Green #5B8A61
  const highlightColor = [140, 188, 146]; // Metallic shine #8CBC92
  const brineGlow = [217, 232, 210]; // Pale Brine #D9E8D2

  // Subtle interior brine wash below y=530 inside the jar body
  if (py >= 530 && py <= 800 && px >= 290 && px <= 734) {
    // Check if within jar body bounds
    col = blend(col, [28, 48, 32], 0.35); // Deep herb brine tint
  }

  // Render bubbles
  if (insideAnyBubble) {
    col = blend(col, brineGlow, 0.12);
  }
  if (minBubbleRimDist <= 5) {
    const rimA = Math.max(0, 1 - minBubbleRimDist / 5);
    col = blend(col, highlightColor, rimA * 0.95);
  }

  // Render strokes with anti-aliasing
  if (minStrokeDist <= halfStroke + 1.5) {
    const dEdge = minStrokeDist - halfStroke;
    let alpha = 1.0;
    if (dEdge > -1.5) {
      alpha = Math.max(0, Math.min(1, 1 - (dEdge + 1.5) / 3));
    }

    // Top-left light source gives subtle metallic specular highlight
    const isTopEdge = py < 450 || (minStrokeDist > 2 && px < 512);
    const activeColor = isTopEdge ? highlightColor : strokeColor;

    col = blend(col, activeColor, alpha);
  }

  return col;
}

// 1. App Icon (1024x1024, RGB no alpha - colorType 2 for App Store ITMS-90717)
console.log('Rendering 1024x1024 icon.png (RGB colorType: 2)...');
const iconBuffer = createPng(1024, 1024, (x, y, w, h) => {
  return renderJarIconPixel(x, y, w, h);
}, 2);
fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconBuffer);
console.log('  -> assets/icon.png created (1024x1024, RGB colorType: 2)');

// 2. Adaptive Icon (1024x1024, RGBA)
const adaptiveIconBuffer = createPng(1024, 1024, (x, y, w, h) => {
  return renderJarIconPixel(x, y, w, h);
}, 6);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), adaptiveIconBuffer);
console.log('  -> assets/adaptive-icon.png created (1024x1024, RGBA)');

// 3. Splash Screen (1242x2688)
console.log('Rendering 1242x2688 splash.png...');
const splashBuffer = createPng(1242, 2688, (x, y, w, h) => {
  // Center jar emblem scaled down to ~480px width
  const cx = 1242 / 2;
  const cy = 2688 / 2;
  const targetEmblemSize = 512;
  const scale = targetEmblemSize / 1024;

  const iconX = (x - cx) / scale + 512;
  const iconY = (y - cy) / scale + 512;

  if (iconX >= 0 && iconX < 1024 && iconY >= 0 && iconY < 1024) {
    return renderJarIconPixel(iconX, iconY, 1024, 1024);
  }

  // Outside: pure ceramic basalt #121214 with subtle vertical gradient
  const dy = Math.abs(y - cy) / cy;
  const basaltShade = Math.round(18 - 3 * dy);
  return [basaltShade, basaltShade, basaltShade + 2, 255];
});
fs.writeFileSync(path.join(assetsDir, 'splash.png'), splashBuffer);
console.log('  -> assets/splash.png created (1242x2688)');

// 4. Favicon (48x48)
console.log('Rendering 48x48 favicon.png...');
const faviconBuffer = createPng(48, 48, (x, y, w, h) => {
  return renderJarIconPixel(x * (1024 / 48), y * (1024 / 48), 1024, 1024);
});
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), faviconBuffer);
console.log('  -> assets/favicon.png created (48x48)');

console.log('Official Apps4Craft ceramic assets created successfully.');
