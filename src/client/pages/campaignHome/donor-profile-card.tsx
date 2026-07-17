import { Bar } from "react-chartjs-2";
import { useLoaderData } from "react-router";
import { Card } from "~/client/components/ui/card";
import type { CampaignHomeLoader } from "~/client/types/campaignHomeLoader";
import { BASE_CHART_OPTIONS } from "./chart-setup";

function DonorProfileCard() {
  const { breakdowns } = useLoaderData<CampaignHomeLoader>();
  const { donorProfile } = breakdowns;

  const data = {
    labels: donorProfile.map((p) => p.range),
    datasets: [
      {
        label: "Doadores",
        data: donorProfile.map((p) => p.donorsCount),
        backgroundColor: "rgba(59,130,246,0.75)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    ...BASE_CHART_OPTIONS,
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { font: { size: 11 } },
      },
    },
  };

  return (
    <Card.Root className="p-6">
      <div>
        <p className="text-sm font-semibold text-(--text-heading)">
          Perfil dos doadores
        </p>
        <p className="text-xs text-muted-foreground">
          Total de doadores por faixa etária.
        </p>
      </div>
      <div className="h-56">
        <Bar data={data} options={options} />
      </div>
    </Card.Root>
  );
}

export { DonorProfileCard };
