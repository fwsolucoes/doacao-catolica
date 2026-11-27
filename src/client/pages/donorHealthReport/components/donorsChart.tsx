import { Line } from "react-chartjs-2";
import type { DonorHealthReport } from "~/client/types/donorHealthReportLoader";
import { SERIES_COLORS } from "../chart-setup";
import { ChartCard } from "./chartCard";
import { lineChartOptions, lineDataset } from "./lineChartOptions";

function DonorsChart({ report }: { report: DonorHealthReport }) {
  const months = report.chart;

  const data = {
    labels: months.map((month) => month.label),
    datasets: [
      lineDataset(
        "Doadores no mês",
        months.map((month) => month.donors),
        SERIES_COLORS.donors,
        months,
      ),
      lineDataset(
        "Doadores fiéis",
        months.map((month) => month.loyalDonors),
        SERIES_COLORS.loyalDonors,
        months,
      ),
    ],
  };

  const description = `Doadores no mês × doadores fiéis nos últimos ${report.loyaltyWindowInWords}.`;

  return (
    <ChartCard
      title="Evolução de doadores e fidelidade"
      description={description}
      legend={[
        { label: "Doadores no mês", color: SERIES_COLORS.donors },
        { label: "Doadores fiéis", color: SERIES_COLORS.loyalDonors },
      ]}
      ariaLabel={`Evolução de doadores e fidelidade. ${description}`}
    >
      <Line data={data} options={lineChartOptions(months)} />
    </ChartCard>
  );
}

export { DonorsChart };
