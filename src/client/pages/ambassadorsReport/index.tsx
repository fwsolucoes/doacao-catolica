import { useMemo, useState } from "react";
import { ArrowLeft, FileText, Repeat2, Search, TrendingUp, Users } from "lucide-react";
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
import { useNavigate } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Table } from "~/client/components/ui/table";

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

const DAILY_INDICACOES = [
  3, 5, 5, 7, 9, 9, 13, 7, 7, 6,
  3, 3, 5, 11, 8, 8, 8, 8, 8, 6,
  8, 3, 3, 6, 7, 7, 9, 13, 8, 7,
];

const DAILY_VALOR = [
  1200, 1400, 1600, 1600, 1800, 1800, 2000, 1500, 1200, 1000,
  600, 500, 500, 1800, 1400, 1600, 1500, 1400, 1400, 1200,
  1500, 600, 500, 800, 1200, 1400, 1600, 2000, 1600, 1400,
];

const AMBASSADORS = [
  {
    name: "Ana Beatriz Souza",
    email: "ana.souza@paroquia.org",
    phone: "(11) 98812-4471",
    registeredAt: "12/02/2025",
    indicacoesPeriodo: 42,
    indicacoesAcumuladas: 318,
    recorrencias: "12.480,00",
  },
  {
    name: "Carlos Eduardo Lima",
    email: "carlos.lima@parceiro.org",
    phone: "(21) 99715-3320",
    registeredAt: "03/05/2025",
    indicacoesPeriodo: 35,
    indicacoesAcumuladas: 198,
    recorrencias: "9.240,00",
  },
  {
    name: "Mariana Oliveira Santos",
    email: "mariana.santos@catedral.org",
    phone: "(31) 97823-5512",
    registeredAt: "08/01/2025",
    indicacoesPeriodo: 28,
    indicacoesAcumuladas: 245,
    recorrencias: "8.400,00",
  },
  {
    name: "Ricardo Ferreira Costa",
    email: "ricardo.costa@diocesan.org",
    phone: "(41) 98934-7732",
    registeredAt: "19/03/2025",
    indicacoesPeriodo: 22,
    indicacoesAcumuladas: 156,
    recorrencias: "6.720,00",
  },
  {
    name: "Fernanda Lima Rocha",
    email: "fernanda.rocha@missao.org",
    phone: "(61) 99234-5643",
    registeredAt: "25/04/2025",
    indicacoesPeriodo: 15,
    indicacoesAcumuladas: 187,
    recorrencias: "5.280,00",
  },
  {
    name: "José Paulo Mendes",
    email: "jose.mendes@caridade.org",
    phone: "(85) 98456-2234",
    registeredAt: "07/06/2025",
    indicacoesPeriodo: 9,
    indicacoesAcumuladas: 98,
    recorrencias: "3.960,00",
  },
  {
    name: "Luciana Pereira Alves",
    email: "luciana.alves@comunidade.org",
    phone: "(71) 99567-4421",
    registeredAt: "12/07/2025",
    indicacoesPeriodo: 5,
    indicacoesAcumuladas: 75,
    recorrencias: "4.200,00",
  },
];

const PAYMENT_METHODS = [
  { label: "Cartão", value: "R$ 48.200,00", pct: "(42.3%)", color: "#2563eb", data: 42.3 },
  { label: "Pix", value: "R$ 31.500,00", pct: "(27.7%)", color: "#16a34a", data: 27.7 },
  { label: "Boleto", value: "R$ 12.800,00", pct: "(11.2%)", color: "#f59e0b", data: 11.2 },
  { label: "Pix Automático", value: "R$ 21.400,00", pct: "(18.8%)", color: "#7c3aed", data: 18.8 },
];

const DONATION_BRACKETS = {
  labels: ["Até R$ 25", "R$ 26–50", "R$ 51–100", "R$ 101–250", "R$ 251–500", "Acima de R$ 500"],
  datasets: [
    {
      label: "Doações",
      data: [190, 365, 490, 278, 100, 32],
      backgroundColor: "#7c3aed",
      borderRadius: 4,
    },
  ],
};

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
      max: 600,
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: { font: { size: 11 }, stepSize: 150 },
    },
  },
};

const DAYS = Array.from({ length: 30 }, (_, i) => String(i + 1).padStart(2, "0"));

const evolutionData = {
  labels: DAYS,
  datasets: [
    {
      type: "bar" as const,
      label: "Indicações",
      data: DAILY_INDICACOES,
      backgroundColor: "#2563eb",
      borderRadius: 3,
      yAxisID: "y",
    },
    {
      type: "line" as const,
      label: "Valor (R$)",
      data: DAILY_VALOR,
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
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 13 },
      },
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
      max: 16,
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: { font: { size: 11 }, stepSize: 4 },
    },
    y1: {
      position: "right" as const,
      min: 0,
      max: 2000,
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

const donutData = {
  labels: PAYMENT_METHODS.map((m) => m.label),
  datasets: [
    {
      data: PAYMENT_METHODS.map((m) => m.data),
      backgroundColor: PAYMENT_METHODS.map((m) => m.color),
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

function AmbassadorsReportPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("current-month");
  const [search, setSearch] = useState("");
  const [minIndicacoes, setMinIndicacoes] = useState("");
  const [maxIndicacoes, setMaxIndicacoes] = useState("");

  const filteredAmbassadors = useMemo(
    () =>
      AMBASSADORS.filter((a) => {
        const matchesSearch =
          !search ||
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.email.toLowerCase().includes(search.toLowerCase());
        const matchesMin = !minIndicacoes || a.indicacoesPeriodo >= Number(minIndicacoes);
        const matchesMax = !maxIndicacoes || a.indicacoesPeriodo <= Number(maxIndicacoes);
        return matchesSearch && matchesMin && matchesMax;
      }),
    [search, minIndicacoes, maxIndicacoes],
  );

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
            <label className="text-sm font-semibold">Período</label>
            <Select.Root value={period} onValueChange={setPeriod}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="current-month">Mês atual</Select.Item>
                <Select.Item value="last-month">Mês anterior</Select.Item>
                <Select.Item value="last-30-days">Últimos 30 dias</Select.Item>
                <Select.Item value="last-60-days">Últimos 60 dias</Select.Item>
                <Select.Item value="last-90-days">Últimos 90 dias</Select.Item>
                <Select.Item value="custom">Personalizado</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Início</label>
            <Input
              type="text"
              placeholder="DD/MM/AAAA"
              defaultValue="01/08/2026"
              disabled={period !== "custom"}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Fim</label>
            <Input
              type="text"
              placeholder="DD/MM/AAAA"
              defaultValue="31/08/2026"
              disabled={period !== "custom"}
            />
          </div>
        </div>
      </Card.Root>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card.Root className="gap-3 p-6">
          <Card.MetricHeader label="Indicações no período" icon={TrendingUp} color="primary" />
          <Card.MetricValue>156</Card.MetricValue>
          <Card.MetricTrend value="+18.2% vs. mês anterior (132)" direction="up" />
        </Card.Root>
        <Card.Root className="gap-3 p-6">
          <Card.MetricHeader label="Indicações acumuladas" icon={Users} color="success" />
          <Card.MetricValue>1.277</Card.MetricValue>
          <span className="text-xs text-muted-foreground">Desde o cadastro dos embaixadores</span>
        </Card.Root>
        <Card.Root className="gap-3 p-6">
          <Card.MetricHeader label="Total em recorrências" icon={Repeat2} color="info" />
          <Card.MetricValue>R$ 50.620,00</Card.MetricValue>
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
            <Bar data={DONATION_BRACKETS} options={bracketsOptions} />
          </div>
        </Card.Root>

        <Card.Root className="gap-6 p-6">
          <p className="text-sm font-semibold text-(--text-heading)">Formas de pagamento</p>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative size-40 shrink-0">
              <Doughnut data={donutData} options={donutOptions} />
            </div>
            <div className="flex w-full flex-col gap-3">
              {PAYMENT_METHODS.map((m) => (
                <div key={m.label} className="flex items-center gap-3">
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                  <span className="flex-1 text-sm text-(--text-heading)">{m.label}</span>
                  <span className="text-sm font-semibold text-(--text-heading)">{m.value}</span>
                  <span className="text-sm text-muted-foreground">{m.pct}</span>
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
              Embaixadores ({filteredAmbassadors.length})
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-44">
              <Input
                type="number"
                placeholder="Mín. indicações"
                value={minIndicacoes}
                onChange={(e) => setMinIndicacoes(e.target.value)}
              />
            </div>
            <div className="w-44">
              <Input
                type="number"
                placeholder="Máx. indicações"
                value={maxIndicacoes}
                onChange={(e) => setMaxIndicacoes(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="px-7 pb-6">
        <Table.Root>
          <Table.Header>
            <Table.Row>
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
            {filteredAmbassadors.length === 0 ? (
              <Table.Empty
                title="Nenhum embaixador encontrado."
                description="Tente ajustar os filtros de busca."
              />
            ) : (
              filteredAmbassadors.map((a) => (
                <Table.Row key={a.email}>
                  <Table.Cell className="font-medium">{a.name}</Table.Cell>
                  <Table.Cell className="text-muted-foreground">{a.email}</Table.Cell>
                  <Table.Cell className="text-muted-foreground">{a.phone}</Table.Cell>
                  <Table.Cell className="text-muted-foreground">{a.registeredAt}</Table.Cell>
                  <Table.Cell className="text-right">{a.indicacoesPeriodo}</Table.Cell>
                  <Table.Cell className="text-right text-muted-foreground">
                    {a.indicacoesAcumuladas}
                  </Table.Cell>
                  <Table.Cell className="text-right font-medium">{a.recorrencias}</Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
        </div>
      </Card.Root>
    </div>
  );
}

export { AmbassadorsReportPage };
