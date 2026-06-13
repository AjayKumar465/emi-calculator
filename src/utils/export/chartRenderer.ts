import { CalculatorExportPayload } from '../../types/export';
import { renderChartsAsBitmap, svgToPngBase64 } from './chartBitmap';
import {
  buildDonutSvg,
  buildSecondaryChartSvg,
  getSchedulePoints,
  renderExportChartSvgs,
} from './chartSvg';

export interface ExportChartImages {
  breakdownDonutPng: string;
  secondaryChartPng: string | null;
}

export { getSchedulePoints, renderExportChartSvgs };

export async function renderExportCharts(
  payload: CalculatorExportPayload,
): Promise<ExportChartImages | null> {
  const donutSvg = buildDonutSvg(payload);
  if (!donutSvg) return null;

  const secondarySvg = buildSecondaryChartSvg(payload);

  if (typeof document !== 'undefined') {
    const breakdownDonutPng = await svgToPngBase64(donutSvg, 920, 420);
    const secondaryChartPng = secondarySvg
      ? await svgToPngBase64(
          secondarySvg,
          1080,
          520,
        )
      : null;
    return { breakdownDonutPng, secondaryChartPng };
  }

  const bitmapCharts = renderChartsAsBitmap(payload);
  if (!bitmapCharts.breakdownDonutPng) return null;
  return {
    breakdownDonutPng: bitmapCharts.breakdownDonutPng,
    secondaryChartPng: bitmapCharts.secondaryChartPng,
  };
}
