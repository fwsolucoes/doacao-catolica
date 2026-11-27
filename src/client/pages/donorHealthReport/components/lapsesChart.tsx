import { Line } from "react-chartjs-2";
import type { DonorHealthReport } from "~/client/types/donorHealthReportLoader";
import { SERIES_COLORS } from "../chart-setup";
import { ChartCard } from "./chartCard";
import { lineChartOptions, lineDataset } from "./lineChartOptions";

function LapsesChart({ report }: { report: DonorHealthReport }) {
  const months = report.chart;

  const data = {
    labels: months.map((month) => month.label),
    datasets: [
      lineDataset(
        "Novos lapsos",
        months.map((month) => month.newLapses),
        SERIES_COLORS.newLapses,
        months,
      ),
      lineDataset(
        "Sem retorno",
        months.map((month) => month.lapsesWithoutReturn),
        SERIES_COLORS.withoutReturn,
        months,
        true,
      ),
      lineDataset(
        "Recuperados",
        months.map((month) => month.recovered),
        SERIES_COLORS.recovered,
        months,
      ),
    ],
  };

  const description =
    "Novos lapsos, lapsos sem retorno (tracejado) e doadores recuperados.";

  return (
    <ChartCard
      title="Lapsos e recuperação de doadores"
      description={description}
      legend={[
        { label: "Novos lapsos", color: SERIES_COLORS.newLapses },
        { label: "Sem retorno", color: SERIES_COLORS.withoutReturn, dashed: true },
        { label: "Recuperados", color: SERIES_COLORS.recovered },
      ]}
      ariaLabel={`Lapsos e recuperação de doadores. ${description}`}
    >
      <Line data={data} options={lineChartOptions(months)} />
    </ChartCard>
  );
}

export { LapsesChart };
