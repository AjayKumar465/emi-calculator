import { CalculatorExportPayload, InvestmentChartPoint } from '../../types/export';
import { roundAmount } from '../format';

const CHART_COLORS = {
  principal: '#2ec4b6',
  prepayment: '#ff6b6b',
  interest: '#ffb347',
  taxes: '#a78bfa',
  balance: '#5BC0DE',
  invested: '#2ec4b6',
  returns: '#4ade80',
  grid: '#d8e2ec',
  text: '#1b3a4b',
  muted: '#5f7385',
  background: '#ffffff',
};

function esc(text: string | number): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatCompactCurrency(value: number): string {
  return roundAmount(value).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function parseHexColor(hex: string): string {
  return hex.startsWith('#') ? hex : `#${hex}`;
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

export function getSchedulePoints(payload: CalculatorExportPayload): SchedulePoint[] {
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

export function buildDonutSvg(payload: CalculatorExportPayload): string | null {
  const segments = payload.breakdownSegments.filter((segment) => segment.value > 0);
  if (segments.length === 0) return null;

  const total = roundAmount(segments.reduce((sum, segment) => sum + segment.value, 0));
  const centerX = 220;
  const centerY = 230;
  const radius = 108;
  const strokeWidth = 42;
  let startAngle = -90;

  const arcs = segments
    .map((segment) => {
      const slice = total > 0 ? (segment.value / total) * 360 : 0;
      const endAngle = startAngle + slice;
      const largeArc = slice > 180 ? 1 : 0;
      const startRad = (Math.PI / 180) * startAngle;
      const endRad = (Math.PI / 180) * endAngle;
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);
      const path = slice <= 0
        ? ''
        : `<path d="M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}" fill="none" stroke="${parseHexColor(segment.color)}" stroke-width="${strokeWidth}" stroke-linecap="butt"/>`;
      startAngle = endAngle;
      return path;
    })
    .join('');

  const legend = segments
    .map((segment, index) => {
      const percent = total > 0 ? (segment.value / total) * 100 : 0;
      const y = 110 + index * 56;
      return `<rect x="430" y="${y}" width="16" height="16" fill="${parseHexColor(segment.color)}"/>
        <text x="456" y="${y + 13}" fill="${CHART_COLORS.text}" font-size="15" font-weight="600">${esc(segment.label)}</text>
        <text x="456" y="${y + 32}" fill="${CHART_COLORS.muted}" font-size="13">₹ ${esc(formatCompactCurrency(segment.value))} · ${roundAmount(percent).toFixed(2)}%</text>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="920" height="420" viewBox="0 0 920 420">
    <rect width="920" height="420" fill="${CHART_COLORS.background}"/>
    <rect x="16" y="16" width="888" height="388" rx="18" fill="#f8fbfd" stroke="#e3edf5"/>
    <text x="28" y="38" fill="${CHART_COLORS.text}" font-size="24" font-weight="700">Payment Breakdown</text>
    <text x="28" y="62" fill="${CHART_COLORS.muted}" font-size="14">Share of total cost by component</text>
    ${arcs}
    <text x="${centerX}" y="${centerY - 8}" fill="${CHART_COLORS.text}" font-size="18" font-weight="700" text-anchor="middle">Total</text>
    <text x="${centerX}" y="${centerY + 18}" fill="${CHART_COLORS.text}" font-size="22" font-weight="700" text-anchor="middle">₹ ${esc(formatCompactCurrency(total))}</text>
    ${legend}
  </svg>`;
}

function buildScheduleSvgFromPoints(
  points: SchedulePoint[],
  title: string,
  subtitle: string,
): string | null {
  if (points.length === 0) return null;

  const width = 1080;
  const height = 520;
  const plot = { left: 78, top: 92, right: 72, bottom: 118 };
  const plotWidth = width - plot.left - plot.right;
  const plotHeight = height - plot.top - plot.bottom;
  const maxPayment = Math.max(...points.map((point) => point.totalPayment), 1);
  const maxBalance = Math.max(...points.map((point) => point.balance), 1);
  const barGap = Math.max(6, Math.min(16, plotWidth / points.length / 4));
  const barWidth = Math.max(10, (plotWidth - barGap * (points.length + 1)) / points.length);

  const gridLines = Array.from({ length: 5 }, (_, step) => {
    const y = plot.top + (plotHeight / 4) * step;
    const value = maxPayment - (maxPayment / 4) * step;
    return `<line x1="${plot.left}" y1="${y}" x2="${width - plot.right}" y2="${y}" stroke="${CHART_COLORS.grid}" stroke-width="1"/>
      <text x="${plot.left - 10}" y="${y + 4}" fill="${CHART_COLORS.muted}" font-size="12" text-anchor="end">${esc(formatCompactCurrency(value))}</text>`;
  }).join('');

  const balancePoints: string[] = [];
  const bars = points
    .map((point, index) => {
      const x = plot.left + barGap + index * (barWidth + barGap);
      let yCursor = plot.top + plotHeight;
      const stacks = point.stacks
        .map((stack) => {
          if (stack.value <= 0) return '';
          const barHeight = (stack.value / maxPayment) * plotHeight;
          yCursor -= barHeight;
          return `<rect x="${x}" y="${yCursor}" width="${barWidth}" height="${barHeight}" fill="${stack.color}"/>`;
        })
        .join('');
      const balanceY = plot.top + plotHeight - (point.balance / maxBalance) * plotHeight;
      balancePoints.push(`${x + barWidth / 2},${balanceY}`);
      const label =
        point.label.length > 10 ? `${point.label.slice(0, 3)} ${point.label.slice(-4)}` : point.label;
      return `${stacks}<text x="${x + barWidth / 2}" y="${height - plot.bottom + 18}" fill="${CHART_COLORS.muted}" font-size="11" text-anchor="middle">${esc(label)}</text>`;
    })
    .join('');

  const balanceLine =
    balancePoints.length > 1
      ? `<polyline points="${balancePoints.join(' ')}" fill="none" stroke="${CHART_COLORS.balance}" stroke-width="3"/>`
      : '';

  const legendItems = points[0]?.stacks.filter((stack) =>
    points.some((point) => point.stacks.find((item) => item.key === stack.key && item.value > 0)),
  ) ?? [];
  let legendX = 28;
  const legendY = height - 54;
  const legend = [...legendItems, { key: 'balance', label: 'Balance', color: CHART_COLORS.balance }]
    .map((item) => {
      const markup = `<rect x="${legendX}" y="${legendY}" width="14" height="14" fill="${item.color}"/>
        <text x="${legendX + 20}" y="${legendY + 12}" fill="${CHART_COLORS.text}" font-size="12" font-weight="600">${esc(item.label)}</text>`;
      legendX += item.label.length * 8 + 48;
      return markup;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${CHART_COLORS.background}"/>
    <rect x="16" y="16" width="${width - 32}" height="${height - 32}" rx="18" fill="#f8fbfd" stroke="#e3edf5"/>
    <text x="28" y="38" fill="${CHART_COLORS.text}" font-size="24" font-weight="700">${esc(title)}</text>
    <text x="28" y="62" fill="${CHART_COLORS.muted}" font-size="14">${esc(subtitle)}</text>
    ${gridLines}
    ${bars}
    ${balanceLine}
    ${legend}
  </svg>`;
}

export function buildScheduleSvg(payload: CalculatorExportPayload): string | null {
  const points = getSchedulePoints(payload);
  return buildScheduleSvgFromPoints(
    points,
    'Repayment Schedule',
    'Stacked payments with declining loan balance',
  );
}

export function buildInvestmentGrowthSvg(
  data: InvestmentChartPoint[],
  title = 'Growth Projection',
  subtitle = 'Invested vs growth with inflation-adjusted line',
): string | null {
  if (data.length === 0) return null;

  const points: SchedulePoint[] = data.map((item) => ({
    label: String(item.year),
    balance: item.realValue,
    totalPayment: item.nominalValue,
    stacks: [
      {
        key: 'invested',
        label: 'Invested',
        color: CHART_COLORS.invested,
        value: item.invested,
      },
      {
        key: 'returns',
        label: 'Returns',
        color: CHART_COLORS.returns,
        value: Math.max(0, item.nominalValue - item.invested),
      },
    ],
  }));

  return buildScheduleSvgFromPoints(points, title, subtitle);
}

export function buildSecondaryChartSvg(payload: CalculatorExportPayload): string | null {
  if (payload.investmentChartData?.length) {
    return buildInvestmentGrowthSvg(payload.investmentChartData);
  }
  return buildScheduleSvg(payload);
}

export interface ExportChartSvgs {
  breakdownDonutSvg: string | null;
  secondaryChartSvg: string | null;
}

export function renderExportChartSvgs(payload: CalculatorExportPayload): ExportChartSvgs {
  return {
    breakdownDonutSvg: buildDonutSvg(payload),
    secondaryChartSvg: buildSecondaryChartSvg(payload),
  };
}

export { CHART_COLORS };
