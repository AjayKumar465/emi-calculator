import ExcelJS from 'exceljs';

import { CalculatorExportPayload } from '../../types/export';
import { renderExportCharts } from './chartRenderer';
import { flattenMonthlyRows, getYearlyExportRows } from './buildExportPayloads';
import { roundAmount } from '../format';

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF2A6F8A' },
};

const ALT_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFF0F4F8' },
};

function styleHeaderRow(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  row.height = 22;
}

function styleDataSheet(sheet: ExcelJS.Worksheet) {
  sheet.views = [{ state: 'frozen', ySplit: 1 }];
  sheet.columns.forEach((column) => {
    column.width = 18;
  });
}

async function buildSummarySheet(
  workbook: ExcelJS.Workbook,
  payload: CalculatorExportPayload,
) {
  const sheet = workbook.addWorksheet('Summary');
  sheet.mergeCells('A1:C1');
  sheet.getCell('A1').value = payload.calculatorName;
  sheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FF2A6F8A' } };
  sheet.mergeCells('A2:C2');
  sheet.getCell('A2').value = payload.subtitle ?? '';
  sheet.getCell('A3').value = `Generated: ${new Date(payload.generatedAt).toLocaleString('en-IN')}`;

  const header = sheet.addRow(['Metric', 'Display Value', 'Numeric Value']);
  styleHeaderRow(header);

  payload.summaryRows.forEach((row, index) => {
    const dataRow = sheet.addRow([row.label, row.value, row.numericValue ?? '']);
    if (index % 2 === 1) {
      dataRow.eachCell((cell) => {
        cell.fill = ALT_FILL;
      });
    }
  });

  if (payload.footnotes?.length) {
    sheet.addRow([]);
    sheet.addRow(['Notes']).font = { bold: true };
    payload.footnotes.forEach((note) => sheet.addRow([note]));
  }

  sheet.getColumn(1).width = 34;
  sheet.getColumn(2).width = 28;
  sheet.getColumn(3).width = 18;
}

async function buildBreakdownSheet(
  workbook: ExcelJS.Workbook,
  payload: CalculatorExportPayload,
) {
  const sheet = workbook.addWorksheet('Breakdown');
  const header = sheet.addRow(['Component', 'Amount']);
  styleHeaderRow(header);

  payload.breakdownSegments.forEach((segment, index) => {
    const row = sheet.addRow([segment.label, roundAmount(segment.value)]);
    row.getCell(2).numFmt = '#,##0.00';
    if (index % 2 === 1) {
      row.eachCell((cell) => {
        cell.fill = ALT_FILL;
      });
    }
  });

  const totalRow = sheet.addRow([
    'Total',
    roundAmount(payload.breakdownSegments.reduce((sum, segment) => sum + segment.value, 0)),
  ]);
  totalRow.font = { bold: true };
  totalRow.getCell(2).numFmt = '#,##0.00';
  styleDataSheet(sheet);
}

function addNumericScheduleSheet(
  workbook: ExcelJS.Workbook,
  name: string,
  headers: string[],
  rows: (string | number)[][],
) {
  const sheet = workbook.addWorksheet(name);
  const header = sheet.addRow(headers);
  styleHeaderRow(header);

  rows.forEach((row, index) => {
    const dataRow = sheet.addRow(row);
    dataRow.eachCell((cell, colNumber) => {
      if (colNumber > 1 && typeof cell.value === 'number') {
        cell.numFmt = colNumber === headers.length ? '0.00' : '#,##0.00';
      }
    });
    if (index % 2 === 1) {
      dataRow.eachCell((cell) => {
        cell.fill = ALT_FILL;
      });
    }
  });

  styleDataSheet(sheet);
}

async function buildVisualChartsSheet(
  workbook: ExcelJS.Workbook,
  payload: CalculatorExportPayload,
) {
  const sheet = workbook.addWorksheet('Visual Charts');
  sheet.mergeCells('A1:H1');
  sheet.getCell('A1').value = 'Embedded export charts';
  sheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FF2A6F8A' } };
  sheet.getCell('A2').value =
    'Donut breakdown and schedule/growth charts rendered from your current calculator inputs.';

  const charts = await renderExportCharts(payload);
  if (!charts) {
    sheet.getCell('A4').value = 'No chart data available for this calculator.';
    return;
  }

  const donutImageId = workbook.addImage({
    base64: charts.breakdownDonutPng,
    extension: 'png',
  });
  sheet.addImage(donutImageId, {
    tl: { col: 0, row: 3 },
    ext: { width: 760, height: 350 },
  });

  if (charts.secondaryChartPng) {
    const scheduleImageId = workbook.addImage({
      base64: charts.secondaryChartPng,
      extension: 'png',
    });
    sheet.addImage(scheduleImageId, {
      tl: { col: 0, row: 22 },
      ext: { width: 980, height: 470 },
    });
  }

  sheet.getColumn(1).width = 14;
}

function buildInvestmentChartDataSheet(
  workbook: ExcelJS.Workbook,
  payload: CalculatorExportPayload,
) {
  if (!payload.investmentChartData?.length) {
    return;
  }

  addNumericScheduleSheet(
    workbook,
    'Chart Data',
    ['Year', 'Invested', 'Nominal Value', 'Real Value'],
    payload.investmentChartData.map((point) => [
      point.year,
      roundAmount(point.invested),
      roundAmount(point.nominalValue),
      roundAmount(point.realValue),
    ]),
  );
}

function buildChartDataSheet(workbook: ExcelJS.Workbook, payload: CalculatorExportPayload) {
  if (payload.creditCardChartData?.length) {
    addNumericScheduleSheet(
      workbook,
      'Chart Data',
      ['Period', 'Principal', 'Interest', 'GST on Interest', 'Total Payment', 'Balance'],
      payload.creditCardChartData.map((point) => [
        point.label,
        roundAmount(point.principal),
        roundAmount(point.interest),
        roundAmount(point.gstOnInterest),
        roundAmount(point.totalPayment),
        roundAmount(point.balance),
      ]),
    );
    return;
  }

  if (payload.chartData?.length) {
    addNumericScheduleSheet(
      workbook,
      'Chart Data',
      [
        'Year',
        'Principal',
        'Prepayment',
        'Interest',
        'Taxes/Ins/Maint',
        'Total Payment',
        'Balance',
      ],
      payload.chartData.map((point) => [
        point.year,
        roundAmount(point.principal),
        roundAmount(point.prepayment),
        roundAmount(point.interest),
        roundAmount(point.taxesInsuranceMaintenance),
        roundAmount(point.totalPayment),
        roundAmount(point.balance),
      ]),
    );
    return;
  }

  workbook.addWorksheet('Chart Data').addRow(['No chart data']);
}

export async function createExcelWorkbook(payload: CalculatorExportPayload): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'EMI Calculator';
  workbook.created = new Date(payload.generatedAt);

  await buildSummarySheet(workbook, payload);
  await buildBreakdownSheet(workbook, payload);

  const isInvestment = payload.amortizationYears.length === 0 && payload.investmentYearlyData;

  if (isInvestment && payload.investmentYearlyData) {
    addNumericScheduleSheet(
      workbook,
      'Yearly Projection',
      payload.investmentYearlyData.headers,
      payload.investmentYearlyData.rows,
    );
    buildInvestmentChartDataSheet(workbook, payload);
    await buildVisualChartsSheet(workbook, payload);
  } else {
    const yearly = getYearlyExportRows(payload);
    addNumericScheduleSheet(workbook, 'Yearly Schedule', yearly.headers, yearly.rows);

    const monthly = flattenMonthlyRows(payload.amortizationYears, payload.thirdColumnLabel);
    addNumericScheduleSheet(workbook, 'Monthly Detail', monthly.headers, monthly.rows);

    buildChartDataSheet(workbook, payload);
    await buildVisualChartsSheet(workbook, payload);
  }

  return workbook;
}

export async function createExcelArrayBuffer(payload: CalculatorExportPayload): Promise<ArrayBuffer> {
  const workbook = await createExcelWorkbook(payload);
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as ArrayBuffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  if (typeof btoa === 'function') {
    return btoa(binary);
  }

  const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  let cursor = 0;

  while (cursor < binary.length) {
    const byte1 = binary.charCodeAt(cursor++);
    const byte2 = cursor < binary.length ? binary.charCodeAt(cursor++) : NaN;
    const byte3 = cursor < binary.length ? binary.charCodeAt(cursor++) : NaN;
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

export async function createExcelBase64(payload: CalculatorExportPayload): Promise<string> {
  const buffer = await createExcelArrayBuffer(payload);
  return arrayBufferToBase64(buffer);
}
