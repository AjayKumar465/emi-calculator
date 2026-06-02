import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { CalculatorExportPayload } from '../../types/export';

function timestampSuffix(): string {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
}

function getFileName(payload: CalculatorExportPayload, extension: string): string {
  return `${payload.fileBaseName}-${timestampSuffix()}.${extension}`;
}

function downloadOnWeb(data: ArrayBuffer, fileName: string, mimeType: string) {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function saveAndShareNative(
  base64: string,
  fileName: string,
  mimeType: string,
): Promise<void> {
  const uri = `${FileSystem.documentDirectory ?? ''}${fileName}`;
  await FileSystem.writeAsStringAsync(uri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType });
  }
}

export async function exportCalculatorExcel(payload: CalculatorExportPayload): Promise<void> {
  const fileName = getFileName(payload, 'xlsx');
  const { createExcelArrayBuffer, createExcelBase64 } = await import('./exportExcel');

  if (Platform.OS === 'web') {
    downloadOnWeb(
      await createExcelArrayBuffer(payload),
      fileName,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    return;
  }

  await saveAndShareNative(
    await createExcelBase64(payload),
    fileName,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
}

export async function exportCalculatorPdf(payload: CalculatorExportPayload): Promise<void> {
  const fileName = getFileName(payload, 'pdf');
  const { createPdfArrayBuffer, createPdfBase64 } = await import('./exportPdf');

  if (Platform.OS === 'web') {
    downloadOnWeb(await createPdfArrayBuffer(payload), fileName, 'application/pdf');
    return;
  }

  await saveAndShareNative(await createPdfBase64(payload), fileName, 'application/pdf');
}

export async function shareCalculatorLink(payload: CalculatorExportPayload): Promise<void> {
  const url =
    Platform.OS === 'web' && typeof window !== 'undefined'
      ? `${window.location.origin}/calculator?from=${payload.calculatorId}`
      : `emi-calculator://${payload.calculatorId}`;

  if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.share) {
    await navigator.share({
      title: payload.calculatorName,
      text: 'EMI calculation snapshot',
      url,
    });
    return;
  }

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(url);
  }
}
