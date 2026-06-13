function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    crc ^= data[i];
    for (let j = 0; j < 8; j += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeU32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, false);
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const result = new Uint8Array(12 + data.length);
  const view = new DataView(result.buffer);
  writeU32(view, 0, data.length);
  for (let i = 0; i < 4; i += 1) {
    result[4 + i] = type.charCodeAt(i);
  }
  result.set(data, 8);
  writeU32(view, 8 + data.length, crc32(result.subarray(4, 8 + data.length)));
  return result;
}

function zlibStore(raw: Uint8Array): Uint8Array {
  const blockSize = 65535;
  const blocks = Math.ceil(raw.length / blockSize) || 1;
  const stored = new Uint8Array(2 + blocks * 5 + raw.length + 4);
  let offset = 0;
  stored[offset++] = 0x78;
  stored[offset++] = 0x01;

  for (let block = 0; block < blocks; block += 1) {
    const start = block * blockSize;
    const end = Math.min(start + blockSize, raw.length);
    const isFinal = block === blocks - 1;
    stored[offset++] = isFinal ? 1 : 0;
    stored[offset++] = (end - start) & 0xff;
    stored[offset++] = ((end - start) >>> 8) & 0xff;
    stored[offset++] = (~(end - start)) & 0xff;
    stored[offset++] = ((~(end - start)) >>> 8) & 0xff;
    stored.set(raw.subarray(start, end), offset);
    offset += end - start;
  }

  let a = 1;
  let b = 0;
  for (let i = 0; i < raw.length; i += 1) {
    a = (a + raw[i]) % 65521;
    b = (b + a) % 65521;
  }
  const adler = (b << 16) | a;
  stored[offset++] = (adler >>> 24) & 0xff;
  stored[offset++] = (adler >>> 16) & 0xff;
  stored[offset++] = (adler >>> 8) & 0xff;
  stored[offset++] = adler & 0xff;
  return stored.subarray(0, offset);
}

export function encodePngBase64(
  pixels: Uint8Array,
  width: number,
  height: number,
): string {
  const stride = width * 4;
  const raw = new Uint8Array(height * (1 + stride));
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (1 + stride);
    raw[rowStart] = 0;
    raw.set(pixels.subarray(y * stride, (y + 1) * stride), rowStart + 1);
  }

  const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = new Uint8Array(13);
  const ihdrView = new DataView(ihdr.buffer);
  writeU32(ihdrView, 0, width);
  writeU32(ihdrView, 4, height);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const parts = [
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlibStore(raw)),
    chunk('IEND', new Uint8Array(0)),
  ];

  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const png = new Uint8Array(total);
  let cursor = 0;
  parts.forEach((part) => {
    png.set(part, cursor);
    cursor += part.length;
  });

  let binary = '';
  for (let i = 0; i < png.length; i += 1) {
    binary += String.fromCharCode(png[i]);
  }

  if (typeof btoa === 'function') {
    return btoa(binary);
  }

  const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  let index = 0;
  while (index < binary.length) {
    const byte1 = binary.charCodeAt(index++);
    const byte2 = index < binary.length ? binary.charCodeAt(index++) : NaN;
    const byte3 = index < binary.length ? binary.charCodeAt(index++) : NaN;
    const enc1 = byte1 >> 2;
    const enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
    const enc3 = Number.isNaN(byte2) ? 64 : ((byte2 & 15) << 2) | (byte3 >> 6);
    const enc4 = Number.isNaN(byte3) ? 64 : byte3 & 63;
    output += alphabet.charAt(enc1);
    output += alphabet.charAt(enc2);
    output += enc3 === 64 ? '=' : alphabet.charAt(enc3);
    output += enc4 === 64 ? '=' : alphabet.charAt(enc4);
  }
  return output;
}

export function createBitmap(width: number, height: number): Uint8Array {
  return new Uint8Array(width * height * 4);
}

export function setPixel(
  pixels: Uint8Array,
  width: number,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a = 255,
) {
  if (x < 0 || y < 0) return;
  const idx = (y * width + x) * 4;
  if (idx < 0 || idx >= pixels.length) return;
  pixels[idx] = r;
  pixels[idx + 1] = g;
  pixels[idx + 2] = b;
  pixels[idx + 3] = a;
}

export function fillRect(
  pixels: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  g: number,
  b: number,
  a = 255,
) {
  for (let py = Math.max(0, y); py < Math.min(height, y + h); py += 1) {
    for (let px = Math.max(0, x); px < Math.min(width, x + w); px += 1) {
      setPixel(pixels, width, px, py, r, g, b, a);
    }
  }
}

export function fillCircle(
  pixels: Uint8Array,
  width: number,
  height: number,
  cx: number,
  cy: number,
  radius: number,
  r: number,
  g: number,
  b: number,
  a = 255,
) {
  const minX = Math.max(0, Math.floor(cx - radius));
  const maxX = Math.min(width - 1, Math.ceil(cx + radius));
  const minY = Math.max(0, Math.floor(cy - radius));
  const maxY = Math.min(height - 1, Math.ceil(cy + radius));
  const radiusSq = radius * radius;
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= radiusSq) {
        setPixel(pixels, width, x, y, r, g, b, a);
      }
    }
  }
}

export function drawRingSegment(
  pixels: Uint8Array,
  width: number,
  height: number,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
  r: number,
  g: number,
  b: number,
) {
  const minX = Math.max(0, Math.floor(cx - outerR));
  const maxX = Math.min(width - 1, Math.ceil(cx + outerR));
  const minY = Math.max(0, Math.floor(cy - outerR));
  const maxY = Math.min(height - 1, Math.ceil(cy + outerR));
  const outerSq = outerR * outerR;
  const innerSq = innerR * innerR;

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const distSq = dx * dx + dy * dy;
      if (distSq > outerSq || distSq < innerSq) continue;
      let angle = Math.atan2(dy, dx);
      if (angle < -Math.PI / 2) angle += Math.PI * 2;
      const normalized = angle + Math.PI / 2;
      const sweep = ((endAngle - startAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      let rel = ((normalized - startAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      if (rel <= sweep) {
        setPixel(pixels, width, x, y, r, g, b, 255);
      }
    }
  }
}

export function drawLine(
  pixels: Uint8Array,
  width: number,
  height: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  r: number,
  g: number,
  b: number,
  thickness = 2,
) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  let x = x0;
  let y = y0;

  while (true) {
    fillCircle(pixels, width, height, x, y, thickness, r, g, b);
    if (x === x1 && y === y1) break;
    const e2 = err * 2;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}

export function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;
  const int = Number.parseInt(value, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}
