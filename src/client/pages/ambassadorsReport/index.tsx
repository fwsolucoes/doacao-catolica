import { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Repeat2,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { Bar, Chart, Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { Label } from "~/client/components/ui/label";
import { Select } from "~/client/components/ui/select";
import { Table } from "~/client/components/ui/table";
import type { AmbassadorsDashboardLoader } from "~/client/types/ambassadorsDashboardLoader";
import { getMonthDates } from "~/lib/getMonthDates";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const CHART_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#7c3aed",
  "#ef4444",
  "#06b6d4",
  "#f97316",
  "#84cc16",
];

function detectPeriod(startDate: string | null, endDate: string | null) {
  if (!startDate || !endDate) return "current-month";
  const { firstDayOfMonth: cm0, lastDayOfMonth: cm1 } = getMonthDates(0);
  if (startDate === cm0 && endDate === cm1) return "current-month";
  const { firstDayOfMonth: lm0, lastDayOfMonth: lm1 } = getMonthDates(1);
  if (startDate === lm0 && endDate === lm1) return "last-month";
  return "custom";
}

function AmbassadorsReportPage() {
  const { dashboard } = useLoaderData<AmbassadorsDashboardLoader>();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const startDate = params.get("start_date");
  const endDate = params.get("end_date");
  const search = params.get("search") ?? "";
  const minIndications = params.get("min_indications") ?? "";
  const maxIndications = params.get("max_indications") ?? "";

  const period = detectPeriod(startDate, endDate);
  const [localSearch, setLocalSearch] = useState(search);
  const [localMin, setLocalMin] = useState(minIndications);
  const [localMax, setLocalMax] = useState(maxIndications);

  function updateParams(updates: Record<string, string | null>) {
    const next = new URLSearchParams(location.search);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    next.delete("page");
    navigate(`?${next.toString()}`);
  }

  function handlePeriodChange(value: string) {
    if (value === "current-month") {
      const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);
      updateParams({ start_date: firstDayOfMonth, end_date: lastDayOfMonth });
    } else if (value === "last-month") {
      const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(1);
      updateParams({ start_date: firstDayOfMonth, end_date: lastDayOfMonth });
    }
    // "custom" — aguarda edição dos inputs
  }

  function handleDateBlur(field: "start_date" | "end_date", value: string) {
    if (!value) return;
    const next = new URLSearchParams(location.search);
    next.set(field, value);
    next.delete("page");
    navigate(`?${next.toString()}`);
  }

  function handleSearchCommit() {
    updateParams({
      search: localSearch || null,
      min_indications: localMin || null,
      max_indications: localMax || null,
    });
  }

  function handlePageChange(page: number) {
    const next = new URLSearchParams(location.search);
    next.set("page", String(page));
    navigate(`?${next.toString()}`);
  }

  const { summary, charts, ambassadors, pagination } = dashboard;

  const chartLabels = charts.indicationsByDay.map((d) => d.label);
  const chartIndications = charts.indicationsByDay.map((d) => d.totalIndications);
  const chartAmounts = charts.indicationsByDay.map((d) => d.totalAmount);

  const maxIndic = Math.max(...chartIndications, 1);
  const maxAmt = Math.max(...chartAmounts, 1);
  const yMax = Math.ceil((maxIndic * 1.2) / 4) * 4;
  const y1Max = Math.ceil((maxAmt * 1.2) / 500) * 500;

  const evolutionData = {
    labels: chartLabels,
    datasets: [
      {
        type: "bar" as const,
        label: "Indicações",
        data: chartIndications,
        backgroundColor: "#2563eb",
        borderRadius: 3,
        yAxisID: "y",
      },
      {
        type: "line" as const,
        label: "Valor (R$)",
        data: chartAmounts,
        borderColor: "#16a34a",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "#16a34a",
        yAxisID: "y1",
      },
    ],
  };

  const evolutionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: { usePointStyle: true, padding: 20, font: { size: 13 } },
      },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
      y: {
        position: "left" as const,
        min: 0,
        max: yMax || 4,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { font: { size: 11 }, stepSize: Math.max(1, Math.floor(yMax / 4)) },
      },
      y1: {
        position: "right" as const,
        min: 0,
        max: y1Max || 500,
        grid: { drawOnChartArea: false },
        ticks: {
          font: { size: 11 },
          callback: (v: number | string) => {
            const val = Number(v);
            if (val === 0) return "R$ 0k";
            return `R$ ${(val / 1000).toFixed(0)}k`;
          },
        },
      },
    },
  };

  const donationBracketsData = {
    labels: charts.donationAmountRanges.map((r) => r.label),
    datasets: [
      {
        label: "Doações",
        data: charts.donationAmountRanges.map((r) => r.totalPayments),
        backgroundColor: "#7c3aed",
        borderRadius: 4,
      },
    ],
  };

  const maxBracket = Math.max(...charts.donationAmountRanges.map((r) => r.totalPayments), 1);
  const bracketsMax = Math.ceil((maxBracket * 1.2) / 50) * 50;

  const bracketsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, maxRotation: 15 },
      },
      y: {
        min: 0,
        max: bracketsMax || 10,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { font: { size: 11 } },
      },
    },
  };

  const donutData = {
    labels: charts.paymentMethods.map((m) => m.label),
    datasets: [
      {
        data: charts.paymentMethods.map((m) => m.percentage),
        backgroundColor: charts.paymentMethods.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
  };

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const variationPct = summary.previousPeriod.variationPercent;
  const trendValue =
    variationPct === null
      ? null
      : `${variationPct >= 0 ? "+" : ""}${variationPct.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% vs. período anterior (${summary.previousPeriod.periodIndications})`;

  const displayStart = startDate ?? getMonthDates(0).firstDayOfMonth;
  const displayEnd = endDate ?? getMonthDates(0).lastDayOfMonth;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("../reports")}
            className="h-auto w-fit gap-1.5 p-0 text-sm font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Relatórios
          </Button>
          <h1 className="text-2xl font-semibold text-(--text-heading)">Embaixadores</h1>
          <p className="text-sm text-muted-foreground">
            Desempenho dos embaixadores, indicações e arrecadação no período selecionado.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <FileText size={16} />
          Exportar CSV
        </Button>
      </div>

      <Card.Root className="gap-4 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-semibold">Período</Label>
            <Select.Root value={period} onValueChange={handlePeriodChange}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="current-month">Mês atual</Select.Item>
                <Select.Item value="last-month">Mês anterior</Select.Item>
                <Select.Item value="custom">Personalizado</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-semibold">Início</Label>
            <Input
              type="date"
              defaultValue={displayStart}
              key={displayStart}
              disabled={period !== "custom"}
              onBlur={(e) => handleDateBlur("start_date", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-semibold">Fim</Label>
            <Input
              type="date"
              defaultValue={displayEnd}
              key={displayEnd}
              disabled={period !== "custom"}
              onBlur={(e) => handleDateBlur("end_date", e.target.value)}
            />
          </div>
        </div>
      </Card.Root>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card.Root className="gap-3 p-6">
          <Card.MetricHeader label="Indicações no período" icon={TrendingUp} color="primary" />
          <Card.MetricValue>{summary.periodIndications.toLocaleString("pt-BR")}</Card.MetricValue>
          {trendValue ? (
            <Card.MetricTrend
              value={trendValue}
              direction={variationPct !== null && variationPct >= 0 ? "up" : "down"}
            />
          ) : (
            <span className="text-xs text-muted-foreground">Sem período anterior</span>
          )}
        </Card.Root>
        <Card.Root className="gap-3 p-6">
          <Card.MetricHeader label="Indicações acumuladas" icon={Users} color="success" />
          <Card.MetricValue>{summary.totalIndications.toLocaleString("pt-BR")}</Card.MetricValue>
          <span className="text-xs text-muted-foreground">Desde o cadastro dos embaixadores</span>
        </Card.Root>
        <Card.Root className="gap-3 p-6">
          <Card.MetricHeader label="Total em recorrências" icon={Repeat2} color="info" />
          <Card.MetricValue>{fmt(summary.totalRecurringAmount)}</Card.MetricValue>
          <span className="text-xs text-muted-foreground">
            Valor recorrente ativo gerado por indicações
          </span>
        </Card.Root>
      </div>

      <Card.Root className="gap-4 p-6">
        <p className="text-sm font-semibold text-(--text-heading)">
          Evolução de indicações por dia
        </p>
        <div className="h-72">
          <Chart type="bar" data={evolutionData} options={evolutionOptions} />
        </div>
      </Card.Root>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card.Root className="gap-4 p-6">
          <p className="text-sm font-semibold text-(--text-heading)">Faixas de valores das doações</p>
          <div className="h-64">
            <Bar data={donationBracketsData} options={bracketsOptions} />
          </div>
        </Card.Root>

        <Card.Root className="gap-6 p-6">
          <p className="text-sm font-semibold text-(--text-heading)">Formas de pagamento</p>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative size-40 shrink-0">
              <Doughnut data={donutData} options={donutOptions} />
            </div>
            <div className="flex w-full flex-col gap-3">
              {charts.paymentMethods.map((m, i) => (
                <div key={m.type} className="flex items-center gap-3">
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="flex-1 text-sm text-(--text-heading)">{m.label}</span>
                  <span className="text-sm font-semibold text-(--text-heading)">
                    {fmt(m.totalAmount)}
                  </span>
                  <span className="text-sm text-muted-foreground">({m.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </Card.Root>
      </div>

      <Card.Root className="gap-0 overflow-hidden p-0">
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-(--text-heading)">
              Embaixadores ({pagination.total})
            </p>
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <FileText size={14} />
              Exportar CSV
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="w-72">
              <Input
                leftIcon={Search}
                placeholder="Buscar na tabela..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onBlur={handleSearchCommit}
                onKeyDown={(e) => e.key === "Enter" && handleSearchCommit()}
              />
            </div>
            <div className="w-44">
              <Input
                type="number"
                placeholder="Mín. indicações"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                onBlur={handleSearchCommit}
                onKeyDown={(e) => e.key === "Enter" && handleSearchCommit()}
              />
            </div>
            <div className="w-44">
              <Input
                type="number"
                placeholder="Máx. indicações"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                onBlur={handleSearchCommit}
                onKeyDown={(e) => e.key === "Enter" && handleSearchCommit()}
              />
            </div>
          </div>
        </div>
        <div className="px-7 pb-6">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>#</Table.Head>
                <Table.Head>Nome</Table.Head>
                <Table.Head>E-mail</Table.Head>
                <Table.Head>Telefone</Table.Head>
                <Table.Head>Cadastro</Table.Head>
                <Table.Head className="text-right">Indicações no período</Table.Head>
                <Table.Head className="text-right">Indicações acumuladas</Table.Head>
                <Table.Head className="text-right">Recorrências (R$)</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {ambassadors.length === 0 ? (
                <Table.Empty
                  title="Nenhum embaixador encontrado."
                  description="Tente ajustar os filtros de busca."
                />
              ) : (
                ambassadors.map((a) => (
                  <Table.Row key={a.id}>
                    <Table.Cell className="text-muted-foreground">{a.rank}</Table.Cell>
                    <Table.Cell className="font-medium">{a.name}</Table.Cell>
                    <Table.Cell className="text-muted-foreground">{a.email}</Table.Cell>
                    <Table.Cell className="text-muted-foreground">{a.phone}</Table.Cell>
                    <Table.Cell className="text-muted-foreground">{a.createdAt}</Table.Cell>
                    <Table.Cell className="text-right">{a.periodIndications}</Table.Cell>
                    <Table.Cell className="text-right text-muted-foreground">
                      {a.totalIndications}
                    </Table.Cell>
                    <Table.Cell className="text-right font-medium">
                      {a.totalRecurringAmount}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </div>

        {pagination.lastPage > 1 && (
          <div className="flex items-center justify-between border-t px-6 py-4">
            <span className="text-sm text-muted-foreground">
              Mostrando {pagination.from}–{pagination.to} de {pagination.total}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage <= 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage >= pagination.lastPage}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </Card.Root>
    </div>
  );
}

export { AmbassadorsReportPage };
