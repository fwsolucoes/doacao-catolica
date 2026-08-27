import { useState } from "react";
import { ArrowLeft, BarChart2, Banknote, CreditCard, Download, TrendingUp, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { TablePagination } from "~/client/components/ui/table-pagination";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { Label } from "~/client/components/ui/label";
import { Select } from "~/client/components/ui/select";
import { Table } from "~/client/components/ui/table";

type BadgeVariant = "success" | "amber" | "danger" | "neutral";

const STATUS_BADGE: Record<string, { variant: BadgeVariant; label: string }> = {
  Ativo: { variant: "success", label: "Ativo" },
  Encerrando: { variant: "amber", label: "Encerrando" },
  Pausado: { variant: "danger", label: "Pausado" },
};

type MetricItem = {
  label: string;
  value: string;
  icon: LucideIcon;
  color: "success" | "primary" | "warning" | "teal";
};

const METRICS: MetricItem[] = [
  { label: "Total arrecadado", value: "R$ 242.400,00", icon: TrendingUp, color: "success" },
  { label: "Total online", value: "R$ 190.260,00", icon: CreditCard, color: "primary" },
  { label: "Total offline", value: "R$ 52.140,00", icon: Banknote, color: "warning" },
  { label: "Saldo disponível", value: "R$ 75.144,00", icon: Wallet, color: "teal" },
];

const MOCK_CAMPAIGNS = [
  {
    id: 1,
    name: "Dízimo Paróquia São José",
    status: "Ativo",
    raised: "R$ 48.200,00",
    online: "R$ 34.704,00",
    offline: "R$ 13.496,00",
    available: "R$ 14.942,00",
    avgTicket: "R$ 402,00",
  },
  {
    id: 2,
    name: "Amigo Evangelizador",
    status: "Ativo",
    raised: "R$ 62.800,00",
    online: "R$ 47.100,00",
    offline: "R$ 15.700,00",
    available: "R$ 19.468,00",
    avgTicket: "R$ 376,00",
  },
  {
    id: 3,
    name: "Apostolado da Oração",
    status: "Ativo",
    raised: "R$ 28.400,00",
    online: "R$ 22.152,00",
    offline: "R$ 6.248,00",
    available: "R$ 8.804,00",
    avgTicket: "R$ 133,00",
  },
  {
    id: 4,
    name: "Natal Solidário Paroquial 2025",
    status: "Ativo",
    raised: "R$ 19.500,00",
    online: "R$ 15.795,00",
    offline: "R$ 3.705,00",
    available: "R$ 6.045,00",
    avgTicket: "R$ 75,00",
  },
  {
    id: 5,
    name: "Missão Santa Missionária",
    status: "Encerrando",
    raised: "R$ 71.200,00",
    online: "R$ 59.808,00",
    offline: "R$ 11.392,00",
    available: "R$ 22.072,00",
    avgTicket: "R$ 231,00",
  },
  {
    id: 6,
    name: "Obras da Paróquia Nossa Senhora",
    status: "Pausado",
    raised: "R$ 12.300,00",
    online: "R$ 10.701,00",
    offline: "R$ 1.599,00",
    available: "R$ 3.813,00",
    avgTicket: "R$ 35,00",
  },
];

function FinancialSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [period, setPeriod] = useState("current-month");
  const [dateType, setDateType] = useState("payment-date");

  const currentPage = Number(new URLSearchParams(location.search).get("page") ?? 1);
  const PAGE_SIZE = 4;
  const totalPages = Math.ceil(MOCK_CAMPAIGNS.length / PAGE_SIZE);
  const paginatedCampaigns = MOCK_CAMPAIGNS.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/reports")}
            className="h-auto w-fit gap-1.5 p-0 text-sm font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Relatórios
          </Button>
          <h1 className="text-2xl font-semibold text-(--text-heading)">
            Resumo Financeiro
          </h1>
          <p className="text-sm text-muted-foreground">
            Consolidado financeiro de todas as campanhas no período selecionado.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download size={16} />
          Exportar CSV
        </Button>
      </div>

      <Card.Root className="gap-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-semibold">Período</Label>
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
            <Label className="text-sm font-semibold">Tipo de data</Label>
            <Select.Root value={dateType} onValueChange={setDateType}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="payment-date">Data de pagamento</Select.Item>
                <Select.Item value="creation-date">Data de criação</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-semibold">Início</Label>
            <Input type="date" defaultValue="2026-07-01" disabled={period !== "custom"} />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-semibold">Fim</Label>
            <Input type="date" defaultValue="2026-07-31" disabled={period !== "custom"} />
          </div>
        </div>
      </Card.Root>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric) => (
          <Card.Root key={metric.label} className="gap-3 p-6">
            <Card.MetricHeader label={metric.label} icon={metric.icon} color={metric.color} />
            <Card.MetricValue>{metric.value}</Card.MetricValue>
          </Card.Root>
        ))}
      </div>

      <Card.Root className="gap-4 overflow-hidden p-6">
        <p className="text-sm font-semibold text-(--text-heading)">Campanhas</p>
        <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Campanha</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head className="text-right">Arrecadado</Table.Head>
                <Table.Head className="text-right">Online</Table.Head>
                <Table.Head className="text-right">Offline</Table.Head>
                <Table.Head className="text-right">Saldo disponível</Table.Head>
                <Table.Head className="text-right">Ticket médio</Table.Head>
                <Table.Head className="text-right">Detalhes</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedCampaigns.map((campaign) => {
                const badgeConfig = STATUS_BADGE[campaign.status];
                return (
                  <Table.Row key={campaign.id}>
                    <Table.Cell className="font-medium">{campaign.name}</Table.Cell>
                    <Table.Cell>
                      <Badge variant={badgeConfig?.variant ?? "neutral"}>
                        {badgeConfig?.label ?? campaign.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="text-right font-medium">
                      {campaign.raised}
                    </Table.Cell>
                    <Table.Cell className="text-right text-muted-foreground">
                      {campaign.online}
                    </Table.Cell>
                    <Table.Cell className="text-right text-muted-foreground">
                      {campaign.offline}
                    </Table.Cell>
                    <Table.Cell className="text-right text-muted-foreground">
                      {campaign.available}
                    </Table.Cell>
                    <Table.Cell className="text-right text-muted-foreground">
                      {campaign.avgTicket}
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-muted-foreground"
                        asChild
                      >
                        <Link to={`/campaign/${campaign.id}/home`}>
                          <BarChart2 size={15} />
                          Ver
                        </Link>
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        {totalPages > 1 && (
          <Card.Footer className="flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <TablePagination currentPage={currentPage} totalPages={totalPages} />
          </Card.Footer>
        )}
      </Card.Root>
    </div>
  );
}

export { FinancialSummaryPage };
