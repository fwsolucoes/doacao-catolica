import { Bar } from "react-chartjs-2";
import { useLoaderData } from "react-router";
import { Card } from "~/client/components/ui/card";
import type { CampaignHomeLoader } from "~/client/types/campaignHomeLoader";
import { BASE_CHART_OPTIONS } from "./chart-setup";

function DonationBracketsCard() {
  const { breakdowns } = useLoaderData<CampaignHomeLoader>();
  const { donationRanges } = breakdowns;

  const data = {
    labels: donationRanges.map((r) => r.label),
    datasets: [
      {
        label: "Doações",
        data: donationRanges.map((r) => r.donationsCount),
        backgroundColor: "#74e7bb",
        borderRadius: 4,
        barPercentage: 0.92,
      },
    ],
  };

  const options = {
    ...BASE_CHART_OPTIONS,
    indexAxis: "y" as const,
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { font: { size: 11 } },
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  };

  return (
    <Card.Root className="p-6">
      <div>
        <p className="text-sm font-semibold text-(--text-heading)">
          Faixas de doação
        </p>
        <p className="text-xs text-muted-foreground">
          Quantidade de doações por valor no último mês.
        </p>
      </div>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </Card.Root>
  );
}

export { DonationBracketsCard };
