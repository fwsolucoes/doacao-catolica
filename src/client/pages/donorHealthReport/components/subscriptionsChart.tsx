import type { TooltipItem } from "chart.js";
import { Bar } from "react-chartjs-2";
import type { DonorHealthReport } from "~/client/types/donorHealthReportLoader";
import {
  BASE_OPTIONS,
  GRID_COLOR,
  integerFormatter,
  SERIES_COLORS,
  TICK_FONT,
  withAlpha,
} from "../chart-setup";
import { ChartCard } from "./chartCard";

function SubscriptionsChart({ report }: { report: DonorHealthReport }) {
  const months = report.chart;

  const dataset = (label: string, data: (number | null)[], color: string) => ({
    label,
    data,
    backgroundColor: months.map((month) =>
      month.isPartial ? withAlpha(color, 0.35) : color,
    ),
    borderRadius: { topLeft: 2, topRight: 2 },
    borderSkipped: "bottom" as const,
    maxBarThickness: 10,
    categoryPercentage: 0.6,
    barPercentage: 0.9,
  });

  const data = {
    labels: months.map((month) => month.label),
    datasets: [
      dataset(
        "Novas",
        months.map((month) => month.subscriptionsNew),
        SERIES_COLORS.subscriptionsNew,
      ),
      dataset(
        "Canceladas",
        months.map((month) => month.subscriptionsCanceled),
        SERIES_COLORS.subscriptionsCanceled,
      ),
    ],
  };

  const options = {
    ...BASE_OPTIONS,
    plugins: {
      ...BASE_OPTIONS.plugins,
      tooltip: {
        callbacks: {
          title: (items: TooltipItem<"bar">[]) => {
            const month = months[items[0]?.dataIndex ?? 0];
            return month?.isPartial ? `${month.label} (parcial)` : month?.label;
          },
          label: (item: TooltipItem<"bar">) =>
            `${item.dataset.label}: ${
              item.raw === null ? "–" : integerFormatter.format(Number(item.raw))
            }`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: TICK_FONT, maxRotation: 0, autoSkipPadding: 12 },
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

  const description =
    "Subscriptions novas × canceladas por mês, conforme o histórico disponível.";

  return (
    <ChartCard
      title="Recorrências novas e canceladas"
      description={description}
      legend={[
        { label: "Novas", color: SERIES_COLORS.subscriptionsNew },
        { label: "Canceladas", color: SERIES_COLORS.subscriptionsCanceled },
      ]}
      ariaLabel={`Recorrências novas e canceladas. ${description}`}
    >
      <Bar data={data} options={options} />
    </ChartCard>
  );
}

export { SubscriptionsChart };
