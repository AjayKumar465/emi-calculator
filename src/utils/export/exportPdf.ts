import type { jsPDF } from 'jspdf';

import { CalculatorExportPayload } from '../../types/export';
import { renderExportCharts } from './chartRenderer';
import { flattenMonthlyRows, getYearlyExportRows } from './buildExportPayloads';
import { roundAmount } from '../format';

type PdfModules = {
  jsPDF: typeof import('jspdf').jsPDF;
  autoTable: typeof import('jspdf-autotable').default;
};

let pdfModulesPromise: Promise<PdfModules> | null = null;

async function loadPdfModules(): Promise<PdfModules> {
  if (!pdfModulesPromise) {
    pdfModulesPromise = Promise.all([import('jspdf'), import('jspdf-autotable')]).then(
      ([jspdfModule, autoTableModule]) => ({
        jsPDF: jspdfModule.jsPDF,
        autoTable: autoTableModule.default,
      }),
    );
  }

  return pdfModulesPromise;
}

function hexToRgb(hex: string): [number, number, number] {
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

function drawBreakdownFallback(
  doc: jsPDF,
  payload: CalculatorExportPayload,
  startY: number,
): number {
  doc.setFontSize(12);
  doc.setTextColor(30, 45, 60);
  doc.text('Payment Breakdown', 14, startY);

  let y = startY + 8;
  const total = payload.breakdownSegments.reduce((sum, segment) => sum + segment.value, 0);

  payload.breakdownSegments.forEach((segment) => {
    const [r, g, b] = hexToRgb(segment.color);
    doc.setFillColor(r, g, b);
    doc.rect(14, y - 3, 4, 4, 'F');
    doc.setFontSize(10);
    doc.setTextColor(40, 55, 70);
    doc.text(`${segment.label}: ${roundAmount(segment.value).toLocaleString('en-IN')}`, 22, y);
    y += 7;
  });

  doc.setFont('helvetica', 'bold');
  doc.text(`Total: ${roundAmount(total).toLocaleString('en-IN')}`, 14, y + 2);
  doc.setFont('helvetica', 'normal');

  return y + 10;
}

function addChartImagesPage(
  doc: jsPDF,
  payload: CalculatorExportPayload,
  charts: { breakdownDonutPng: string; secondaryChartPng: string | null },
) {
  doc.addPage();
  doc.setFillColor(42, 111, 138);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('Visual Analytics', 14, 15);
  doc.setFontSize(10);
  doc.text(payload.calculatorName, 130, 15);

  doc.addImage(
    `data:image/png;base64,${charts.breakdownDonutPng}`,
    'PNG',
    10,
    30,
    190,
    86,
  );

  if (charts.secondaryChartPng) {
    doc.addImage(
      `data:image/png;base64,${charts.secondaryChartPng}`,
      'PNG',
      10,
      122,
      190,
      96,
    );
  }
}

export async function createPdfDocument(payload: CalculatorExportPayload): Promise<jsPDF> {
  const { jsPDF: JsPDF, autoTable } = await loadPdfModules();
  const charts = await renderExportCharts(payload);
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  doc.setFillColor(42, 111, 138);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(payload.calculatorName, 14, 14);
  doc.setFontSize(10);
  doc.text(payload.subtitle ?? 'EMI Calculator Report', 14, 21);
  doc.text(new Date(payload.generatedAt).toLocaleString('en-IN'), 140, 21);

  doc.setTextColor(30, 45, 60);
  autoTable(doc, {
    startY: 34,
    head: [['Metric', 'Value']],
    body: payload.summaryRows.map((row) => [row.label, row.value]),
    styles: { fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [42, 111, 138], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 244, 248] },
  });

  const afterSummaryY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
    ?.finalY ?? 80;

  if (charts) {
    addChartImagesPage(doc, payload, charts);
  } else {
    drawBreakdownFallback(doc, payload, afterSummaryY + 8);
  }

  const isInvestment = payload.amortizationYears.length === 0 && payload.investmentYearlyData;

  if (isInvestment && payload.investmentYearlyData) {
    doc.addPage();
    doc.setFillColor(42, 111, 138);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.text('Year-by-Year Projection', 14, 13);

    autoTable(doc, {
      startY: 26,
      head: [payload.investmentYearlyData.headers],
      body: payload.investmentYearlyData.rows.map((row) => row.map(String)),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [42, 111, 138], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 248, 252] },
    });
  } else {
    doc.addPage();
    doc.setFillColor(42, 111, 138);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.text('Yearly Amortization Schedule', 14, 13);

    const { headers, rows } = getYearlyExportRows(payload);
    autoTable(doc, {
      startY: 26,
      head: [headers],
      body: rows.map((row) => row.map(String)),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [42, 111, 138], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 248, 252] },
    });

    const monthlyStartY =
      (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 40;

    if (monthlyStartY > 250) {
      doc.addPage();
    }

    doc.setFillColor(42, 111, 138);
    doc.rect(0, monthlyStartY > 250 ? 0 : monthlyStartY + 6, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.text('Monthly Amortization Detail', 14, monthlyStartY > 250 ? 13 : monthlyStartY + 19);

    const monthly = flattenMonthlyRows(payload.amortizationYears, payload.thirdColumnLabel);
    autoTable(doc, {
      startY: monthlyStartY > 250 ? 26 : monthlyStartY + 28,
      head: [monthly.headers],
      body: monthly.rows.map((row) => row.map(String)),
      styles: { fontSize: 7, cellPadding: 1.8 },
      headStyles: { fillColor: [42, 111, 138], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 248, 252] },
    });
  }

  if (payload.footnotes?.length) {
    const footnoteY =
      ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 260) + 8;
    doc.setFontSize(8);
    doc.setTextColor(100, 110, 120);
    payload.footnotes.forEach((note, index) => {
      doc.text(`† ${note}`, 14, footnoteY + index * 5);
    });
  }

  return doc;
}

export async function createPdfArrayBuffer(payload: CalculatorExportPayload): Promise<ArrayBuffer> {
  const doc = await createPdfDocument(payload);
  return doc.output('arraybuffer');
}

export async function createPdfBase64(payload: CalculatorExportPayload): Promise<string> {
  const doc = await createPdfDocument(payload);
  return doc.output('datauristring').split(',')[1] ?? '';
}
