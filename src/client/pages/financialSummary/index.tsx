import { useState, useCallback } from "react";
import { ArrowLeft, BarChart2, Banknote, CreditCard, Download, TrendingUp, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLocation, useLoaderData, useNavigate } from "react-router";
import { TablePagination } from "~/client/components/ui/table-pagination";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { Label } from "~/client/components/ui/label";
import { Select } from "~/client/components/ui/select";
import { Table } from "~/client/components/ui/table";
import type { FinancialSummaryLoader } from "~/client/types/FinancialSummaryLoader";
import { CampaignMetricsModal } from "./components/campaignMetricsModal";

const STATUS_BADGE: Record<string, { className: string; label: string }> = {
  active: { className: "bg-emerald-100 text-emerald-700", label: "Ativo" },
  inactive: { className: "bg-red-100 text-red-700", label: "Inativo" },
  paused: { className: "bg-amber-100 text-amber-700", label: "Pausado" },
  closing: { className: "bg-orange-100 text-orange-700", label: "Encerrando" },
};

type MetricItem = {
  label: string;
  value: string;
  icon: LucideIcon;
  color: "success" | "primary" | "warning" | "teal";
};

type ModalState = {
  campaignId: string;
  campaignName: string;
} | null;

const PAGE_SIZE = 10;

function FinancialSummaryPage() {
  const { financialSummary } = useLoaderData<FinancialSummaryLoader>();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dateType = searchParams.get("date_type") ?? "paid_date";
  const startDate = searchParams.get("start_date") ?? "";
  const endDate = searchParams.get("end_date") ?? "";
  const period = searchParams.get("period") ?? "currentMonth";
  const currentPage = Number(searchParams.get("page") ?? 1);

  const [modal, setModal] = useState<ModalState>(null);
  const closeModal = useCallback(() => setModal(null), []);

  function applyParams(updates: Record<string, string>) {
    const sp = new URLSearchParams(location.search);
    for (const [key, value] of Object.entries(updates)) {
      sp.set(key, value);
    }
    sp.delete("page");
    navigate(`?${sp.toString()}`);
  }

  function handlePeriodChange(value: string) {
    const today = new Date();
    function firstOfMonth(offset: number) {
      return new Date(today.getFullYear(), today.getMonth() - offset, 1)
        .toISOString()
        .split("T")[0];
    }
    function lastOfMonth(offset: number) {
      return new Date(today.getFullYear(), today.getMonth() - offset + 1, 0)
        .toISOString()
        .split("T")[0];
    }
    function daysAgo(days: number) {
      const d = new Date(today);
      d.setDate(today.getDate() - days);
      return d.toISOString().split("T")[0];
    }
    const todayStr = today.toISOString().split("T")[0];

    const ranges: Record<string, { start_date: string; end_date: string }> = {
      currentMonth: { start_date: firstOfMonth(0), end_date: lastOfMonth(0) },
      lastMonth: { start_date: firstOfMonth(1), end_date: lastOfMonth(1) },
      last30Days: { start_date: daysAgo(30), end_date: todayStr },
      last60Days: { start_date: daysAgo(60), end_date: todayStr },
      last90Days: { start_date: daysAgo(90), end_date: todayStr },
    };

    if (value === "custom") {
      applyParams({ period: "custom" });
    } else if (ranges[value]) {
      applyParams({ period: value, ...ranges[value] });
    }
  }

  const totalPages = Math.ceil(financialSummary.campaigns.length / PAGE_SIZE);
  const paginatedCampaigns = financialSummary.campaigns.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const METRICS: MetricItem[] = [
    { label: "Total arrecadado", value: financialSummary.totalRaisedAmount, icon: TrendingUp, color: "success" },
    { label: "Total online", value: financialSummary.onlineAmount, icon: CreditCard, color: "primary" },
    { label: "Total offline", value: financialSummary.offlineAmount, icon: Banknote, color: "warning" },
    { label: "Saldo disponível", value: financialSummary.availableBalance, icon: Wallet, color: "teal" },
  ];

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
        <Button asChild variant="outline" className="gap-2">
          <a
            href={`/api/financial-summary-export?${searchParams.toString()}`}
            download
          >
            <Download size={16} />
            Exportar
          </a>
        </Button>
      </div>

      <Card.Root className="gap-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-semibold">Período</Label>
            <Select.Root value={period} onValueChange={handlePeriodChange}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="currentMonth">Mês atual</Select.Item>
                <Select.Item value="lastMonth">Mês anterior</Select.Item>
                <Select.Item value="last30Days">Últimos 30 dias</Select.Item>
                <Select.Item value="last60Days">Últimos 60 dias</Select.Item>
                <Select.Item value="last90Days">Últimos 90 dias</Select.Item>
                <Select.Item value="custom">Personalizado</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-semibold">Tipo de data</Label>
            <Select.Root
              value={dateType}
              onValueChange={(v) => applyParams({ date_type: v })}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="paid_date">Data de pagamento</Select.Item>
                <Select.Item value="due_date">Data de vencimento</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-semibold">Início</Label>
            <Input
              type="date"
              value={startDate}
              disabled={period !== "custom"}
              onChange={(e) => applyParams({ start_date: e.target.value, period: "custom" })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-semibold">Fim</Label>
            <Input
              type="date"
              value={endDate}
              disabled={period !== "custom"}
              onChange={(e) => applyParams({ end_date: e.target.value, period: "custom" })}
            />
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
        <p className="text-sm font-semibold text-(--text-heading)">
          Campanhas ({financialSummary.totalCampaigns})
        </p>
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
              const badge = STATUS_BADGE[campaign.status];
              return (
                <Table.Row key={campaign.id}>
                  <Table.Cell className="font-medium">{campaign.name}</Table.Cell>
                  <Table.Cell>
                    <Badge className={badge?.className ?? "bg-muted text-muted-foreground"}>
                      {badge?.label ?? campaign.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-right font-medium">
                    {campaign.totalRaisedAmount}
                  </Table.Cell>
                  <Table.Cell className="text-right text-muted-foreground">
                    {campaign.onlineAmount}
                  </Table.Cell>
                  <Table.Cell className="text-right text-muted-foreground">
                    {campaign.offlineAmount}
                  </Table.Cell>
                  <Table.Cell className="text-right text-muted-foreground">
                    {campaign.availableBalance}
                  </Table.Cell>
                  <Table.Cell className="text-right text-muted-foreground">
                    {campaign.averageTicket}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() =>
                        setModal({ campaignId: campaign.uuid, campaignName: campaign.name })
                      }
                    >
                      <BarChart2 size={14} />
                      Ver
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

      {modal && (
        <CampaignMetricsModal
          campaignId={modal.campaignId}
          campaignName={modal.campaignName}
          dateType={dateType}
          startDate={startDate}
          endDate={endDate}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export { FinancialSummaryPage };
