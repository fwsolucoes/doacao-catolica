import type { ScriptableLineSegmentContext, TooltipItem } from "chart.js";
import { BASE_OPTIONS, GRID_COLOR, integerFormatter, TICK_FONT } from "../chart-setup";

type ChartMonth = { label: string; isPartial: boolean };

/** Segmento que chega ao mês parcial fica tracejado (o mês ainda não fechou). */
function partialSegmentDash(months: ChartMonth[]) {
  return (context: ScriptableLineSegmentContext) =>
    months[context.p1DataIndex]?.isPartial ? [4, 4] : undefined;
}

function lineDataset(
  label: string,
  data: (number | null)[],
  color: string,
  months: ChartMonth[],
  dashed = false,
) {
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: color,
    borderWidth: 2,
    borderDash: dashed ? [5, 4] : undefined,
    pointRadius: 0,
    pointHoverRadius: 4,
    pointHitRadius: 12,
    tension: 0,
    // sem dado calculável = lacuna na linha, nunca zero
    spanGaps: false,
    segment: dashed ? undefined : { borderDash: partialSegmentDash(months) },
  };
}

function lineChartOptions(months: ChartMonth[]) {
  return {
    ...BASE_OPTIONS,
    plugins: {
      ...BASE_OPTIONS.plugins,
      tooltip: {
        callbacks: {
          title: (items: TooltipItem<"line">[]) => {
            const month = months[items[0]?.dataIndex ?? 0];
            return month?.isPartial ? `${month.label} (parcial)` : month?.label;
          },
          label: (item: TooltipItem<"line">) =>
            `${item.dataset.label}: ${
              item.raw === null ? "–" : integerFormatter.format(Number(item.raw))
            }`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: TICK_FONT, maxRotation: 0, autoSkipPadding: 16 },
      },
      y: {
        beginAtZero: true,
        grid: { color: GRID_COLOR },
        border: { display: false },
        ticks: {
          font: TICK_FONT,
          maxTicksLimit: 5,
          callback: (value: number | string) => integerFormatter.format(Number(value)),
        },
      },
    },
  };
}

export { lineChartOptions, lineDataset };
