import { CalculatorExportPayload } from '../../types/export';
import { roundAmount } from '../format';

export interface ExportChartImages {
  breakdownDonutPng: string;
  scheduleChartPng: string;
}

const CHART_COLORS = {
  principal: '#2ec4b6',
  prepayment: '#ff6b6b',
  interest: '#ffb347',
  taxes: '#a78bfa',
  balance: '#5BC0DE',
  grid: '#d8e2ec',
  text: '#1b3a4b',
  muted: '#5f7385',
  background: '#ffffff',
};

function createCanvas(width: number, height: number): HTMLCanvasElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function canvasToBase64(canvas: HTMLCanvasElement): string {
  const dataUrl = canvas.toDataURL('image/png');
  return dataUrl.split(',')[1] ?? '';
}

function parseHexColor(hex: string): string {
  return hex.startsWith('#') ? hex : `#${hex}`;
}

function formatCompactCurrency(value: number): string {
  return roundAmount(value).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawTitle(ctx: CanvasRenderingContext2D, title: string, subtitle: string) {
  ctx.fillStyle = CHART_COLORS.text;
  ctx.font = '700 24px Arial, sans-serif';
  ctx.fillText(title, 28, 38);
  ctx.fillStyle = CHART_COLORS.muted;
  ctx.font = '500 14px Arial, sans-serif';
  ctx.fillText(subtitle, 28, 62);
}

function renderDonutChart(payload: CalculatorExportPayload): string | null {
  const canvas = createCanvas(920, 420);
  if (!canvas) {
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  ctx.fillStyle = CHART_COLORS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawRoundedRect(ctx, 16, 16, canvas.width - 32, canvas.height - 32, 18);
  ctx.fillStyle = '#f8fbfd';
  ctx.fill();
  ctx.strokeStyle = '#e3edf5';
  ctx.lineWidth = 1;
  ctx.stroke();

  drawTitle(ctx, 'Payment Breakdown', 'Share of total cost by component');

  const segments = payload.breakdownSegments.filter((segment) => segment.value > 0);
  const total = roundAmount(segments.reduce((sum, segment) => sum + segment.value, 0));
  const centerX = 220;
  const centerY = 230;
  const radius = 108;
  const lineWidth = 42;

  let startAngle = -Math.PI / 2;
  segments.forEach((segment) => {
    const slice = total > 0 ? (segment.value / total) * Math.PI * 2 : 0;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + slice);
    ctx.strokeStyle = parseHexColor(segment.color);
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'butt';
    ctx.stroke();
    startAngle += slice;
  });

  ctx.fillStyle = CHART_COLORS.text;
  ctx.font = '700 18px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Total', centerX, centerY - 8);
  ctx.font = '700 22px Arial, sans-serif';
  ctx.fillText(`₹ ${formatCompactCurrency(total)}`, centerX, centerY + 18);
  ctx.textAlign = 'left';

  let legendY = 110;
  segments.forEach((segment) => {
    const percent = total > 0 ? (segment.value / total) * 100 : 0;
    ctx.fillStyle = parseHexColor(segment.color);
    ctx.fillRect(430, legendY, 16, 16);
    ctx.fillStyle = CHART_COLORS.text;
    ctx.font = '600 15px Arial, sans-serif';
    ctx.fillText(segment.label, 456, legendY + 13);
    ctx.fillStyle = CHART_COLORS.muted;
    ctx.font = '500 13px Arial, sans-serif';
    ctx.fillText(
      `₹ ${formatCompactCurrency(segment.value)} · ${roundAmount(percent).toFixed(2)}%`,
      456,
      legendY + 32,
    );
    legendY += 56;
  });

  return canvasToBase64(canvas);
}

interface ScheduleStack {
  key: string;
  label: string;
  color: string;
  value: number;
}

interface SchedulePoint {
  label: string;
  stacks: ScheduleStack[];
  balance: number;
  totalPayment: number;
}

function getSchedulePoints(payload: CalculatorExportPayload): SchedulePoint[] {
  if (payload.creditCardChartData?.length) {
    return payload.creditCardChartData.map((point) => ({
      label: point.label,
      balance: point.balance,
      totalPayment: point.totalPayment,
      stacks: [
        { key: 'principal', label: 'Principal', color: CHART_COLORS.principal, value: point.principal },
        { key: 'interest', label: 'Interest', color: CHART_COLORS.interest, value: point.interest },
        {
          key: 'gst',
          label: 'GST on Interest',
          color: CHART_COLORS.taxes,
          value: point.gstOnInterest,
        },
      ],
    }));
  }

  if (payload.chartData?.length) {
    return payload.chartData.map((point) => ({
      label: String(point.year),
      balance: point.balance,
      totalPayment: point.totalPayment,
      stacks: [
        { key: 'principal', label: 'Principal', color: CHART_COLORS.principal, value: point.principal },
        {
          key: 'prepayment',
          label: 'Prepayment',
          color: CHART_COLORS.prepayment,
          value: point.prepayment,
        },
        { key: 'interest', label: 'Interest', color: CHART_COLORS.interest, value: point.interest },
        {
          key: 'taxes',
          label: payload.thirdColumnLabel,
          color: CHART_COLORS.taxes,
          value: point.taxesInsuranceMaintenance,
        },
      ],
    }));
  }

  return [];
}

function renderScheduleChart(payload: CalculatorExportPayload): string | null {
  const points = getSchedulePoints(payload);
  if (points.length === 0) {
    return null;
  }

  const canvas = createCanvas(1080, 520);
  if (!canvas) {
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  ctx.fillStyle = CHART_COLORS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawRoundedRect(ctx, 16, 16, canvas.width - 32, canvas.height - 32, 18);
  ctx.fillStyle = '#f8fbfd';
  ctx.fill();
  ctx.strokeStyle = '#e3edf5';
  ctx.lineWidth = 1;
  ctx.stroke();

  drawTitle(
    ctx,
    'Repayment Schedule',
    'Stacked payments with declining loan balance',
  );

  const plot = { left: 78, top: 92, right: 72, bottom: 118 };
  const plotWidth = canvas.width - plot.left - plot.right;
  const plotHeight = canvas.height - plot.top - plot.bottom;
  const maxPayment = Math.max(...points.map((point) => point.totalPayment), 1);
  const maxBalance = Math.max(...points.map((point) => point.balance), 1);
  const barGap = Math.max(6, Math.min(16, plotWidth / points.length / 4));
  const barWidth = Math.max(10, (plotWidth - barGap * (points.length + 1)) / points.length);

  ctx.strokeStyle = CHART_COLORS.grid;
  ctx.lineWidth = 1;
  for (let step = 0; step <= 4; step += 1) {
    const y = plot.top + (plotHeight / 4) * step;
    ctx.beginPath();
    ctx.moveTo(plot.left, y);
    ctx.lineTo(canvas.width - plot.right, y);
    ctx.stroke();
  }

  ctx.fillStyle = CHART_COLORS.muted;
  ctx.font = '12px Arial, sans-serif';
  ctx.textAlign = 'right';
  for (let step = 0; step <= 4; step += 1) {
    const y = plot.top + (plotHeight / 4) * step;
    const value = maxPayment - (maxPayment / 4) * step;
    ctx.fillText(formatCompactCurrency(value), plot.left - 10, y + 4);
  }

  ctx.textAlign = 'left';
  ctx.fillText('Payment', 24, plot.top + 12);
  ctx.textAlign = 'right';
  ctx.fillText('Balance', canvas.width - 24, plot.top + 12);

  const balancePoints: { x: number; y: number }[] = [];

  points.forEach((point, index) => {
    const x = plot.left + barGap + index * (barWidth + barGap);
    let yCursor = plot.top + plotHeight;

    point.stacks.forEach((stack) => {
      if (stack.value <= 0) {
        return;
      }

      const height = (stack.value / maxPayment) * plotHeight;
      yCursor -= height;
      ctx.fillStyle = stack.color;
      ctx.fillRect(x, yCursor, barWidth, height);
    });

    const balanceY = plot.top + plotHeight - (point.balance / maxBalance) * plotHeight;
    balancePoints.push({ x: x + barWidth / 2, y: balanceY });

    ctx.fillStyle = CHART_COLORS.muted;
    ctx.font = '11px Arial, sans-serif';
    ctx.textAlign = 'center';
    const label =
      point.label.length > 10 ? `${point.label.slice(0, 3)} ${point.label.slice(-4)}` : point.label;
    ctx.fillText(label, x + barWidth / 2, canvas.height - plot.bottom + 18, barWidth + 18);
  });

  if (balancePoints.length > 1) {
    ctx.strokeStyle = CHART_COLORS.balance;
    ctx.lineWidth = 3;
    ctx.beginPath();
    balancePoints.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    balancePoints.forEach((point) => {
      ctx.fillStyle = CHART_COLORS.balance;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  const legendItems = points[0]?.stacks.filter((stack) =>
    points.some((point) => point.stacks.find((item) => item.key === stack.key && item.value > 0)),
  ) ?? [];

  const legendWithBalance = [
    ...legendItems,
    { key: 'balance', label: 'Balance', color: CHART_COLORS.balance, value: 0 },
  ];

  let legendX = 28;
  const legendY = canvas.height - 54;
  legendWithBalance.forEach((item) => {
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, legendY, 14, 14);
    ctx.fillStyle = CHART_COLORS.text;
    ctx.font = '600 12px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(item.label, legendX + 20, legendY + 12);
    legendX += ctx.measureText(item.label).width + 48;
  });

  return canvasToBase64(canvas);
}

export async function renderExportCharts(
  payload: CalculatorExportPayload,
): Promise<ExportChartImages | null> {
  if (typeof document === 'undefined') {
    return null;
  }

  const breakdownDonutPng = renderDonutChart(payload);
  const scheduleChartPng = renderScheduleChart(payload);

  if (!breakdownDonutPng || !scheduleChartPng) {
    return null;
  }

  return { breakdownDonutPng, scheduleChartPng };
}

export { getSchedulePoints };
