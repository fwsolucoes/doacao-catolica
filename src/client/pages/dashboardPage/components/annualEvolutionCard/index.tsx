import { ChevronDown } from "lucide-react";
import { Line } from "react-chartjs-2";
import { useLoaderData } from "react-router";
import type { DashboardLoader } from "~/client/types/dashboardLoader";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import "../../chart-setup";

const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index" as const, intersect: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 } },
    },
    y: {
      min: 0,
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: {
        font: { size: 11 },
        callback: (v: number | string) => {
          const val = Number(v);
          if (val === 0) return "R$0k";
          return `R$${val / 1000}k`;
        },
      },
    },
  },
};

function AnnualEvolutionCard() {
  const { annualEvolution, currentMonth, currentYear } =
    useLoaderData<DashboardLoader>();

  const hasGoal = (annualEvolution?.monthlyGoal ?? 0) > 0;
  const isCurrentYear = annualEvolution?.year === currentYear;
  const chartYear = annualEvolution?.year ?? currentYear;

  const chartData = {
    labels: MONTHS,
    datasets: [
      ...(hasGoal
        ? [
            {
              label: "Meta",
              data: annualEvolution!.months.map((m) => m.goalAmount),
              borderColor: "#74e7bb",
              backgroundColor: "rgba(116, 231, 187, 0.08)",
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              borderWidth: 2,
            },
          ]
        : []),
      {
        label: "Arrecadado",
        data: annualEvolution
          ? annualEvolution.months.map((m) =>
              isCurrentYear && m.month > currentMonth ? null : m.totalAmount,
            )
          : [],
        borderColor: "#3a64f2",
        backgroundColor: "rgba(58, 100, 242, 0.12)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 2,
      },
    ],
  };

  return (
    <Card.Root className="col-span-2 gap-4 p-7">
      <Card.Header>
        <div>
          <p className="text-lg font-semibold tracking-tight text-foreground">
            Doações ao longo do ano
          </p>
          <p className="text-sm text-muted-foreground">
            Comparativo entre valor arrecadado e meta mensal.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          {chartYear} <ChevronDown size={14} />
        </Button>
      </Card.Header>
      <div className="h-72">
        <Line data={chartData} options={chartOptions} />
      </div>
    </Card.Root>
  );
}

export { AnnualEvolutionCard };
