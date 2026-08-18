import {
  ArrowUpRight,
  ChevronDown,
  DollarSign,
  Heart,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Link, useLoaderData } from "react-router";
import type { DashboardLoader } from "~/client/types/dashboardLoader";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Progress } from "~/client/components/ui/progress";
import { useRoot } from "~/client/hooks/useRoot";
import { cn } from "~/lib/utils";
import "./chart-setup";

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const yearlyChartData = {
  labels: MONTHS,
  datasets: [
    {
      label: "Meta",
      data: [
        40000, 42000, 45000, 48000, 50000, 55000, 58000, 60000, 65000, 68000,
        72000, 75000,
      ],
      borderColor: "#74e7bb",
      backgroundColor: "rgba(116, 231, 187, 0.08)",
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    },
    {
      label: "Arrecadado",
      data: [
        32000,
        28000,
        45000,
        52000,
        48000,
        63000,
        58000,
        71000,
        75000,
        68000,
        null,
        null,
      ],
      borderColor: "#3a64f2",
      backgroundColor: "rgba(58, 100, 242, 0.12)",
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      borderWidth: 2,
    },
  ],
};

const yearlyChartOptions = {
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
      suggestedMax: 80000,
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

const donutData = {
  labels: ["Pix", "Pix Automático", "Cartão", "Boleto"],
  datasets: [
    {
      data: [42, 24, 21, 13],
      backgroundColor: ["#5b4eff", "#74e7bb", "#6bceff", "#ffc800"],
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

const weeklyChartData = {
  labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
  datasets: [
    {
      data: [1200, 1850, 2100, 980, 2400, 1250, 960],
      backgroundColor: "#3a64f2",
      borderRadius: 6,
      barPercentage: 0.85,
    },
  ],
};

const weeklyChartOptions = {
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

const PAYMENT_METHODS = [
  { label: "Pix", pct: 42, color: "#5b4eff" },
  { label: "Pix Automático", pct: 24, color: "#74e7bb" },
  { label: "Cartão", pct: 21, color: "#6bceff" },
  { label: "Boleto", pct: 13, color: "#ffc800" },
];

const FEATURED_CAMPAIGNS = [
  {
    name: "Escola para Todos",
    donors: 1240,
    raised: 84200,
    goal: 100000,
    pct: 84,
  },
  {
    name: "Água Potável - Sertão",
    donors: 890,
    raised: 62800,
    goal: 80000,
    pct: 79,
  },
  {
    name: "Resgate Animal SP",
    donors: 532,
    raised: 28400,
    goal: 40000,
    pct: 71,
  },
  {
    name: "Natal Solidário 2025",
    donors: 412,
    raised: 19500,
    goal: 50000,
    pct: 39,
  },
];

const RECENT_DONATIONS = [
  {
    initials: "AC",
    name: "Ana Carolina Silva",
    campaign: "Escola para Todos",
    time: "há 2 min",
    amount: "R$ 250",
  },
  {
    initials: "RL",
    name: "Roberto Lima",
    campaign: "Água Potável - Sertão",
    time: "há 14 min",
    amount: "R$ 1.000",
  },
  {
    initials: "EV",
    name: "Empresa Verde Ltda",
    campaign: "Resgate Animal SP",
    time: "há 1 h",
    amount: "R$ 5.000",
  },
  {
    initials: "JM",
    name: "Juliana M.",
    campaign: "Natal Solidário 2025",
    time: "há 2 h",
    amount: "R$ 75",
  },
  {
    initials: "A",
    name: "Anônimo",
    campaign: "Escola para Todos",
    time: "há 3 h",
    amount: "R$ 320",
  },
];

function StatCard({
  label,
  value,
  trendValue,
  trendDir,
  trendNote,
  icon: Icon,
  iconBgClass,
  iconColorClass,
}: {
  label: string;
  value: string;
  trendValue: string;
  trendDir: "up" | "down";
  trendNote: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
}) {
  const TrendIcon = trendDir === "up" ? TrendingUp : TrendingDown;

  return (
    <Card.Root className="gap-3 p-7">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-muted-foreground">
          {label}
        </span>
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-xl",
            iconBgClass,
          )}
        >
          <Icon size={20} className={iconColorClass} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              trendDir === "up"
                ? "bg-emerald-500/15 text-emerald-700"
                : "bg-destructive/15 text-destructive",
            )}
          >
            <TrendIcon size={12} />
            {trendValue}
          </span>
          <span className="text-xs text-muted-foreground">{trendNote}</span>
        </div>
      </div>
    </Card.Root>
  );
}

function DashboardPage() {
  const { user } = useRoot();
  const { overview } = useLoaderData<DashboardLoader>();
  const firstName = user?.name?.split(" ")[0] ?? "usuário";

  const totalRaisedFormatted = overview
    ? `R$ ${Math.round(overview.totalRaised).toLocaleString("pt-BR")}`
    : "—";
  const growthTrendValue =
    overview?.growthPercentage != null
      ? `${overview.growthPercentage >= 0 ? "+" : ""}${overview.growthPercentage.toFixed(1)}%`
      : "—";
  const growthTrendDir: "up" | "down" =
    (overview?.growthPercentage ?? 0) >= 0 ? "up" : "down";

  const supportersFormatted = overview
    ? overview.supporters.toLocaleString("pt-BR")
    : "—";
  const newSupporters = overview?.newSupportersLast7Days ?? 0;

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Olá, {firstName} 👋
          </h1>
          <p className="text-base text-muted-foreground">
            Aqui está o resumo das doações desta semana.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#e6e6ed] px-3 py-1.5">
          <span className="size-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold text-foreground">
            Tudo operando normalmente
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard
          label="Doações totais"
          value={totalRaisedFormatted}
          trendValue={growthTrendValue}
          trendDir={growthTrendDir}
          trendNote="vs. mês passado"
          icon={DollarSign}
          iconBgClass="bg-blue-500/8"
          iconColorClass="text-blue-500"
        />
        <StatCard
          label="Doadores ativos"
          value={supportersFormatted}
          trendValue={`+${newSupporters}`}
          trendDir="up"
          trendNote="novos últimos 7 dias"
          icon={Users}
          iconBgClass="bg-green-500/8"
          iconColorClass="text-green-500"
        />
        <StatCard
          label="Campanhas ativas"
          value="27"
          trendValue="+3"
          trendDir="up"
          trendNote="4 finalizando em breve"
          icon={Target}
          iconBgClass="bg-amber-500/8"
          iconColorClass="text-amber-500"
        />
        <StatCard
          label="Taxa de retenção"
          value="68,3%"
          trendValue="-1,1%"
          trendDir="down"
          trendNote="últimos 30 dias"
          icon={Heart}
          iconBgClass="bg-pink-500/8"
          iconColorClass="text-pink-500"
        />
      </div>

      {/* Yearly chart + Donut */}
      <div className="grid grid-cols-3 gap-5">
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
              2025 <ChevronDown size={14} />
            </Button>
          </Card.Header>
          <div className="h-72">
            <Line data={yearlyChartData} options={yearlyChartOptions} />
          </div>
        </Card.Root>

        <Card.Root className="gap-5 p-7">
          <div>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              Formas de Pagamento
            </p>
            <p className="text-sm text-muted-foreground">
              Distribuição das doações por método de pagamento.
            </p>
          </div>
          <div className="relative mx-auto size-48 shrink-0">
            <Doughnut data={donutData} options={donutOptions} />
          </div>
          <div className="flex flex-col gap-2">
            {PAYMENT_METHODS.map((m) => (
              <div key={m.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-3 shrink-0 rounded-sm"
                    style={{ backgroundColor: m.color }}
                  />
                  <span className="text-base text-foreground">{m.label}</span>
                </div>
                <span className="text-base text-muted-foreground">
                  {m.pct}%
                </span>
              </div>
            ))}
          </div>
        </Card.Root>
      </div>

      {/* Featured campaigns + Weekly chart */}
      <div className="grid grid-cols-3 gap-5">
        <Card.Root className="col-span-2 gap-6 p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-semibold tracking-tight text-foreground">
                Campanhas em destaque
              </p>
              <p className="text-sm text-muted-foreground">
                Progresso das principais campanhas ativas.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs text-sidebar-accent-foreground"
              asChild
            >
              <Link to="/my-campaigns">
                Ver todas <ArrowUpRight size={14} />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-6">
            {FEATURED_CAMPAIGNS.map((c) => (
              <div key={c.name} className="flex flex-col gap-2.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {c.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.donors.toLocaleString("pt-BR")} doadores
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base text-foreground">
                      <span className="font-semibold">
                        R$ {c.raised.toLocaleString("pt-BR")}{" "}
                      </span>
                      <span className="text-muted-foreground">
                        / R$ {c.goal.toLocaleString("pt-BR")}
                      </span>
                    </p>
                    <p className="text-xs text-sidebar-accent-foreground">
                      {c.pct}% da meta
                    </p>
                  </div>
                </div>
                <Progress
                  value={c.pct}
                  className="h-2.5 [--progress-foreground:var(--color-sidebar-accent-foreground)]"
                />
              </div>
            ))}
          </div>
        </Card.Root>

        <Card.Root className="gap-5 p-7">
          <div>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              Doações da semana
            </p>
            <p className="text-sm text-muted-foreground">
              Total diário em reais.
            </p>
          </div>
          <div className="h-44">
            <Bar data={weeklyChartData} options={weeklyChartOptions} />
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xl font-semibold text-foreground">
                R$ 10.740
              </p>
              <p className="text-xs text-muted-foreground">Total da semana</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700">
              <TrendingUp size={12} />
              +18,2%
            </span>
          </div>
        </Card.Root>
      </div>

      {/* Recent donations */}
      <Card.Root className="gap-0 overflow-hidden p-0">
        <div className="flex items-start justify-between p-7 pb-5">
          <div>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              Doações recentes
            </p>
            <p className="text-sm text-muted-foreground">
              Últimas contribuições recebidas em tempo real.
            </p>
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            Exportar
          </Button>
        </div>

        <div className="flex flex-col">
          <div className="mx-7 mb-3 flex items-center justify-between rounded-lg bg-muted px-4 py-3">
            <span className="text-sm font-semibold text-muted-foreground">
              Doador
            </span>
            <span className="w-32 text-right text-sm text-muted-foreground">
              Valor doado
            </span>
          </div>
          <div className="flex flex-col pb-5">
            {RECENT_DONATIONS.map((d, i) => (
              <div
                key={d.name + i}
                className={cn(
                  "flex items-center justify-between px-11 py-4",
                  i % 2 === 0 ? "bg-muted/40" : "",
                )}
              >
                <div className="flex items-center gap-3.5">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                      {d.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.campaign} · {d.time}
                    </p>
                  </div>
                </div>
                <p className="w-32 text-right text-base text-foreground">
                  {d.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card.Root>
    </div>
  );
}

export { DashboardPage };
