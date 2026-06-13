import { CalculatorExportPayload } from '../../types/export';
import {
  buildDonutSvg,
  buildSecondaryChartSvg,
  getSchedulePoints,
} from './chartSvg';
import {
  createBitmap,
  drawLine,
  drawRingSegment,
  encodePngBase64,
  fillRect,
  hexToRgb,
} from './pngEncode';
import { roundAmount } from '../format';

function svgToPngViaBitmap(svg: string, width: number, height: number): string | null {
  if (!svg) return null;
  const pixels = createBitmap(width, height);
  fillRect(pixels, width, height, 0, 0, width, height, 255, 255, 255, 255);
  fillRect(pixels, width, height, 16, 16, width - 32, height - 32, 248, 251, 253, 255);
  return encodePngBase64(pixels, width, height);
}

function renderDonutBitmap(payload: CalculatorExportPayload): string | null {
  const segments = payload.breakdownSegments.filter((segment) => segment.value > 0);
  if (segments.length === 0) return null;

  const width = 920;
  const height = 420;
  const pixels = createBitmap(width, height);
  fillRect(pixels, width, height, 0, 0, width, height, 255, 255, 255, 255);
  fillRect(pixels, width, height, 16, 16, width - 32, height - 32, 248, 251, 253, 255);

  const total = roundAmount(segments.reduce((sum, segment) => sum + segment.value, 0));
  const centerX = 220;
  const centerY = 230;
  const outerR = 108;
  const innerR = 78;
  let startAngle = -Math.PI / 2;

  segments.forEach((segment) => {
    const slice = total > 0 ? (segment.value / total) * Math.PI * 2 : 0;
    const [r, g, b] = hexToRgb(segment.color);
    drawRingSegment(
      pixels,
      width,
      height,
      centerX,
      centerY,
      outerR,
      innerR,
      startAngle,
      startAngle + slice,
      r,
      g,
      b,
    );
    startAngle += slice;
  });

  return encodePngBase64(pixels, width, height);
}

function renderScheduleBitmap(payload: CalculatorExportPayload): string | null {
  const points = getSchedulePoints(payload);
  if (points.length === 0 && !payload.investmentChartData?.length) return null;

  if (payload.investmentChartData?.length) {
    return renderInvestmentBitmap(payload.investmentChartData);
  }

  const width = 1080;
  const height = 520;
  const pixels = createBitmap(width, height);
  fillRect(pixels, width, height, 0, 0, width, height, 255, 255, 255, 255);
  fillRect(pixels, width, height, 16, 16, width - 32, height - 32, 248, 251, 253, 255);

  const plot = { left: 78, top: 92, right: 72, bottom: 118 };
  const plotWidth = width - plot.left - plot.right;
  const plotHeight = height - plot.top - plot.bottom;
  const maxPayment = Math.max(...points.map((point) => point.totalPayment), 1);
  const maxBalance = Math.max(...points.map((point) => point.balance), 1);
  const barGap = Math.max(6, Math.min(16, plotWidth / points.length / 4));
  const barWidth = Math.max(10, (plotWidth - barGap * (points.length + 1)) / points.length);
  const [gridR, gridG, gridB] = hexToRgb('#d8e2ec');

  for (let step = 0; step <= 4; step += 1) {
    const y = plot.top + (plotHeight / 4) * step;
    fillRect(pixels, width, height, plot.left, y, plotWidth, 1, gridR, gridG, gridB);
  }

  const balanceCoords: { x: number; y: number }[] = [];
  points.forEach((point, index) => {
    const x = plot.left + barGap + index * (barWidth + barGap);
    let yCursor = plot.top + plotHeight;
    point.stacks.forEach((stack) => {
      if (stack.value <= 0) return;
      const barHeight = (stack.value / maxPayment) * plotHeight;
      yCursor -= barHeight;
      const [r, g, b] = hexToRgb(stack.color);
      fillRect(pixels, width, height, x, yCursor, barWidth, barHeight, r, g, b);
    });
    balanceCoords.push({
      x: x + barWidth / 2,
      y: plot.top + plotHeight - (point.balance / maxBalance) * plotHeight,
    });
  });

  const [balanceR, balanceG, balanceB] = hexToRgb('#5BC0DE');
  for (let i = 1; i < balanceCoords.length; i += 1) {
    drawLine(
      pixels,
      width,
      height,
      balanceCoords[i - 1].x,
      balanceCoords[i - 1].y,
      balanceCoords[i].x,
      balanceCoords[i].y,
      balanceR,
      balanceG,
      balanceB,
      3,
    );
  }

  return encodePngBase64(pixels, width, height);
}

function renderInvestmentBitmap(
  data: CalculatorExportPayload['investmentChartData'],
): string | null {
  if (!data?.length) return null;

  const width = 1080;
  const height = 520;
  const pixels = createBitmap(width, height);
  fillRect(pixels, width, height, 0, 0, width, height, 255, 255, 255, 255);
  fillRect(pixels, width, height, 16, 16, width - 32, height - 32, 248, 251, 253, 255);

  const plot = { left: 78, top: 92, right: 72, bottom: 118 };
  const plotWidth = width - plot.left - plot.right;
  const plotHeight = height - plot.top - plot.bottom;
  const maxValue = Math.max(...data.map((item) => item.nominalValue), 1);
  const barGap = Math.max(6, Math.min(16, plotWidth / data.length / 4));
  const barWidth = Math.max(10, (plotWidth - barGap * (data.length + 1)) / data.length);
  const [gridR, gridG, gridB] = hexToRgb('#d8e2ec');
  const [investedR, investedG, investedB] = hexToRgb('#2ec4b6');
  const [returnsR, returnsG, returnsB] = hexToRgb('#4ade80');
  const [realR, realG, realB] = hexToRgb('#5BC0DE');

  for (let step = 0; step <= 4; step += 1) {
    const y = plot.top + (plotHeight / 4) * step;
    fillRect(pixels, width, height, plot.left, y, plotWidth, 1, gridR, gridG, gridB);
  }

  const realCoords: { x: number; y: number }[] = [];
  data.forEach((item, index) => {
    const x = plot.left + barGap + index * (barWidth + barGap);
    const investedHeight = (item.invested / maxValue) * plotHeight;
    const returnsHeight = ((item.nominalValue - item.invested) / maxValue) * plotHeight;
    const investedY = plot.top + plotHeight - investedHeight;
    fillRect(pixels, width, height, x, investedY, barWidth, investedHeight, investedR, investedG, investedB);
    fillRect(
      pixels,
      width,
      height,
      x,
      investedY - returnsHeight,
      barWidth,
      Math.max(0, returnsHeight),
      returnsR,
      returnsG,
      returnsB,
    );
    realCoords.push({
      x: x + barWidth / 2,
      y: plot.top + plotHeight - (item.realValue / maxValue) * plotHeight,
    });
  });

  for (let i = 1; i < realCoords.length; i += 1) {
    drawLine(
      pixels,
      width,
      height,
      realCoords[i - 1].x,
      realCoords[i - 1].y,
      realCoords[i].x,
      realCoords[i].y,
      realR,
      realG,
      realB,
      3,
    );
  }

  return encodePngBase64(pixels, width, height);
}

export function renderChartsAsBitmap(payload: CalculatorExportPayload): {
  breakdownDonutPng: string | null;
  secondaryChartPng: string | null;
} {
  const donutSvg = buildDonutSvg(payload);
  const scheduleSvg = buildSecondaryChartSvg(payload);

  return {
    breakdownDonutPng: donutSvg ? renderDonutBitmap(payload) : null,
    secondaryChartPng: scheduleSvg
      ? payload.investmentChartData?.length
        ? renderInvestmentBitmap(payload.investmentChartData)
        : renderScheduleBitmap(payload)
      : null,
  };
}

export function svgToPngBase64(svg: string, width: number, height: number): Promise<string> {
  if (typeof document === 'undefined') {
    return Promise.resolve(svgToPngViaBitmap(svg, width, height) ?? '');
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas unavailable'));
        return;
      }
      ctx.drawImage(image, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png').split(',')[1] ?? '');
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to render chart SVG'));
    };
    image.src = url;
  });
}
