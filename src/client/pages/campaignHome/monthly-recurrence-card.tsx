import { Bar } from "react-chartjs-2";
import { useLoaderData } from "react-router";
import { Card } from "~/client/components/ui/card";
import type { CampaignHomeLoader } from "~/client/types/campaignHomeLoader";
import { BASE_CHART_OPTIONS } from "./chart-setup";

function MonthlyRecurrenceCard() {
  const { recurrence } = useLoaderData<CampaignHomeLoader>();

  const data = {
    labels: recurrence.months.map((m) => m.label),
    datasets: [
      {
        label: "Assinaturas ativas",
        data: recurrence.months.map((m) => m.activeSubscriptions),
        backgroundColor: "#5b4eff",
        borderRadius: 4,
        barPercentage: 0.92,
        categoryPercentage: 0.7,
      },
      {
        label: "Doações recorrentes",
        data: recurrence.months.map((m) => m.recurringDonations),
        backgroundColor: "#74e7bb",
        borderRadius: 4,
        barPercentage: 0.92,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options = {
    ...BASE_CHART_OPTIONS,
    plugins: {
      ...BASE_CHART_OPTIONS.plugins,
      legend: {
        display: true,
        position: "bottom" as const,
        align: "center" as const,
        labels: {
          boxWidth: 10,
          borderRadius: 2,
          useBorderRadius: true,
          font: { size: 11 },
        },
      },
    },
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
          Recorrência mensal
        </p>
        <p className="text-xs text-muted-foreground">
          Assinaturas ativas vs. doações recorrentes efetivadas nos últimos 12
          meses.
        </p>
      </div>
      <div className="h-72">
        <Bar data={data} options={options} />
      </div>
    </Card.Root>
  );
}

export { MonthlyRecurrenceCard };
