import type { TooltipItem } from "chart.js";
import { Bar } from "react-chartjs-2";
import type { DonorHealthReport } from "~/client/types/donorHealthReportLoader";
import {
  BASE_OPTIONS,
  compactCurrencyFormatter,
  currencyFormatter,
  GRID_COLOR,
  SERIES_COLORS,
  TICK_FONT,
  withAlpha,
} from "../chart-setup";
import { ChartCard } from "./chartCard";

const SERIES = [
  { key: "revenueBoleto", label: "Boleto", color: SERIES_COLORS.boleto },
  { key: "revenuePix", label: "Pix", color: SERIES_COLORS.pix },
  { key: "revenueCard", label: "Cartão", color: SERIES_COLORS.card },
  { key: "revenueAutomaticPix", label: "Pix automático", color: SERIES_COLORS.automaticPix },
] as const;

type RevenueChartProps = {
  report: DonorHealthReport;
};

function RevenueChart({ report }: RevenueChartProps) {
  const months = report.chart;

  const data = {
    labels: months.map((month) => month.label),
    datasets: SERIES.map((series) => ({
      label: series.label,
      data: months.map((month) => month[series.key]),
      // mês parcial em tom mais claro
      backgroundColor: months.map((month) =>
        month.isPartial ? withAlpha(series.color, 0.35) : series.color,
      ),
      // 2px de respiro entre os segmentos empilhados
      borderColor: "rgba(255,255,255,1)",
      borderWidth: { top: 2 },
      borderSkipped: "bottom" as const,
      borderRadius: 2,
      maxBarThickness: 24,
      categoryPercentage: 0.7,
    })),
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
            `${item.dataset.label}: ${currencyFormatter.format(Number(item.raw))}`,
          footer: (items: TooltipItem<"bar">[]) => {
            const total = items.reduce((sum, item) => sum + Number(item.raw), 0);
            return `Total: ${currencyFormatter.format(total)}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { font: TICK_FONT, maxRotation: 0, autoSkipPadding: 12 },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: { color: GRID_COLOR },
        border: { display: false },
        ticks: {
          font: TICK_FONT,
          maxTicksLimit: 5,
          callback: (value: number | string) =>
            compactCurrencyFormatter.format(Number(value)),
        },
      },
    },
  };

  const trend = report.lastClosedMonth?.revenueTrend;
  const description = [trend, report.hasPartialMonth ? "O mês corrente ainda é parcial." : null]
    .filter(Boolean)
    .join(" ");

  return (
    <ChartCard
      title="Receita mensal por forma de pagamento"
      description={description || "Receita mensal empilhada por forma de pagamento."}
      legend={SERIES.map(({ label, color }) => ({ label, color }))}
      ariaLabel={`Receita mensal por forma de pagamento. ${description}`}
      chartClassName="h-96"
    >
      <Bar data={data} options={options} />
    </ChartCard>
  );
}

export { RevenueChart };
