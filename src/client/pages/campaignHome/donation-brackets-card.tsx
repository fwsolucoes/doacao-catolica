import { Bar } from "react-chartjs-2";
import { Card } from "~/client/components/ui/card";
import { BASE_CHART_OPTIONS } from "./chart-setup";

const BRACKETS_LABELS = [
  "Até R$ 50",
  "R$ 51 – R$ 100",
  "R$ 101 – R$ 250",
  "R$ 251 – R$ 500",
  "R$ 501 – R$ 1k",
  "Acima de R$ 1k",
];
const BRACKETS_DATA = [320, 280, 220, 145, 60, 33];

function DonationBracketsCard() {
  const data = {
    labels: BRACKETS_LABELS,
    datasets: [
      {
        label: "Doações",
        data: BRACKETS_DATA,
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
