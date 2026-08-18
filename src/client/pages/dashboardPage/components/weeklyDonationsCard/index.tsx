import { TrendingDown, TrendingUp } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { useLoaderData } from "react-router";
import type { DashboardLoader } from "~/client/types/dashboardLoader";
import { Card } from "~/client/components/ui/card";
import { cn } from "~/lib/utils";
import "../../chart-setup";

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
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: { display: false },
    },
  },
};

function WeeklyDonationsCard() {
  const { weekly } = useLoaderData<DashboardLoader>();

  const chartData = {
    labels: weekly?.days.map((d) => d.label) ?? [],
    datasets: [
      {
        data: weekly?.days.map((d) => d.totalAmount) ?? [],
        backgroundColor: "#3a64f2",
        borderRadius: 6,
        barPercentage: 0.85,
      },
    ],
  };

  const weeklyTotal = weekly
    ? `R$ ${Math.round(weekly.totalAmount).toLocaleString("pt-BR")}`
    : "—";
  const growthValue =
    weekly?.growthPercentage != null
      ? `${weekly.growthPercentage >= 0 ? "+" : ""}${weekly.growthPercentage.toFixed(1)}%`
      : "—";
  const growthDir: "up" | "down" =
    (weekly?.growthPercentage ?? 0) >= 0 ? "up" : "down";

  return (
    <Card.Root className="gap-5 p-7">
      <div>
        <p className="text-lg font-semibold tracking-tight text-foreground">
          Doações da semana
        </p>
        <p className="text-sm text-muted-foreground">Total diário em reais.</p>
      </div>
      <div className="h-44">
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xl font-semibold text-foreground">{weeklyTotal}</p>
          <p className="text-xs text-muted-foreground">Total da semana</p>
        </div>
        <span
          className={cn(
            "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
            growthDir === "up"
              ? "bg-emerald-500/15 text-emerald-700"
              : "bg-destructive/15 text-destructive",
          )}
        >
          {growthDir === "up" ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          {growthValue}
        </span>
      </div>
    </Card.Root>
  );
}

export { WeeklyDonationsCard };
