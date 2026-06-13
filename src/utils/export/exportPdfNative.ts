import { CalculatorExportPayload } from '../../types/export';
import { roundAmount } from '../format';
import { flattenMonthlyRows, getYearlyExportRows } from './buildExportPayloads';
import { renderExportChartSvgs } from './chartSvg';

function esc(text: string | number): string {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatInr(value: number): string {
  return `₹${roundAmount(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function buildSummaryTable(payload: CalculatorExportPayload): string {
  const rows = payload.summaryRows
    .map(
      (row) =>
        `<tr><td style="padding:6px 10px;border-bottom:1px solid #e3edf5;color:#1b3a4b;font-weight:600">${esc(row.label)}</td><td style="padding:6px 10px;border-bottom:1px solid #e3edf5;text-align:right;color:#334155">${esc(row.value)}</td></tr>`,
    )
    .join('');

  return `<table style="width:100%;border-collapse:collapse;margin-bottom:20px">${rows}</table>`;
}

function buildBreakdownSection(payload: CalculatorExportPayload): string {
  const total = payload.breakdownSegments.reduce((sum, s) => sum + s.value, 0);
  const items = payload.breakdownSegments
    .filter((s) => s.value > 0)
    .map((s) => {
      const pct = total > 0 ? ((s.value / total) * 100).toFixed(1) : '0';
      return `<div style="display:flex;align-items:center;margin-bottom:8px"><div style="width:14px;height:14px;border-radius:3px;background:${s.color};margin-right:10px;flex-shrink:0"></div><div style="flex:1"><span style="font-weight:600;color:#1b3a4b">${esc(s.label)}</span><br/><span style="font-size:12px;color:#5f7385">${formatInr(s.value)} · ${pct}%</span></div></div>`;
    })
    .join('');

  return `<div style="margin-bottom:20px"><h3 style="color:#2a6f8a;font-size:14px;margin-bottom:10px">Payment Breakdown</h3>${items}<div style="margin-top:8px;font-weight:700;color:#1b3a4b">Total: ${formatInr(total)}</div></div>`;
}

function buildDataTable(headers: string[], rows: (string | number)[][]): string {
  const thead = headers
    .map(
      (h) =>
        `<th style="padding:5px 8px;background:#2a6f8a;color:#fff;font-size:10px;text-align:left;white-space:nowrap">${esc(h)}</th>`,
    )
    .join('');

  const tbody = rows
    .map(
      (row, i) =>
        `<tr style="background:${i % 2 === 0 ? '#fff' : '#f5f8fc'}">${row.map((cell) => `<td style="padding:4px 8px;font-size:9px;border-bottom:1px solid #e3edf5;white-space:nowrap">${esc(cell)}</td>`).join('')}</tr>`,
    )
    .join('');

  return `<table style="width:100%;border-collapse:collapse;margin-bottom:16px"><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>`;
}

function buildScheduleTables(payload: CalculatorExportPayload): string {
  const isInvestment =
    payload.amortizationYears.length === 0 && payload.investmentYearlyData;

  if (isInvestment && payload.investmentYearlyData) {
    return (
      `<h3 style="color:#2a6f8a;font-size:14px;margin:16px 0 8px">Year-by-Year Projection</h3>` +
      buildDataTable(
        payload.investmentYearlyData.headers,
        payload.investmentYearlyData.rows,
      )
    );
  }

  const { headers: yearHeaders, rows: yearRows } = getYearlyExportRows(payload);
  const { headers: monthHeaders, rows: monthRows } = flattenMonthlyRows(
    payload.amortizationYears,
    payload.thirdColumnLabel,
  );

  return (
    `<h3 style="color:#2a6f8a;font-size:14px;margin:16px 0 8px">Yearly Amortization</h3>` +
    buildDataTable(yearHeaders, yearRows) +
    `<h3 style="color:#2a6f8a;font-size:14px;margin:16px 0 8px">Monthly Detail</h3>` +
    buildDataTable(monthHeaders, monthRows)
  );
}

function buildChartsSection(payload: CalculatorExportPayload): string {
  const { breakdownDonutSvg, secondaryChartSvg } = renderExportChartSvgs(payload);
  if (!breakdownDonutSvg) return '';

  const secondary = secondaryChartSvg
    ? `<div style="margin-top:16px;page-break-inside:avoid">${secondaryChartSvg}</div>`
    : '';

  return `<div style="margin:20px 0;page-break-inside:avoid">
    <h3 style="color:#2a6f8a;font-size:14px;margin-bottom:10px">Visual Analytics</h3>
    <div style="width:100%;overflow:hidden">${breakdownDonutSvg}</div>
    ${secondary}
  </div>`;
}

export function buildPdfHtml(payload: CalculatorExportPayload): string {
  const date = new Date(payload.generatedAt).toLocaleString('en-IN');

  const footnotes = (payload.footnotes ?? [])
    .map((n) => `<p style="font-size:9px;color:#64748b;margin:2px 0">† ${esc(n)}</p>`)
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  @page { margin: 16mm 12mm; }
  body { font-family: -apple-system, Roboto, 'Helvetica Neue', sans-serif; font-size: 12px; color: #334155; margin: 0; padding: 0; }
  table { page-break-inside: auto; }
  tr { page-break-inside: avoid; }
</style>
</head>
<body>
<div style="background:#2a6f8a;color:#fff;padding:14px 18px;border-radius:6px;margin-bottom:16px">
  <div style="font-size:18px;font-weight:700">${esc(payload.calculatorName)}</div>
  <div style="font-size:11px;margin-top:4px;opacity:0.85">${esc(payload.subtitle ?? 'EMI Calculator Report')} · ${esc(date)}</div>
</div>
${buildSummaryTable(payload)}
${buildChartsSection(payload)}
${buildBreakdownSection(payload)}
${buildScheduleTables(payload)}
${footnotes}
</body>
</html>`;
}
