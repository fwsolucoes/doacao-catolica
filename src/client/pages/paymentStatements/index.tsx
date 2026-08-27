import {
  AlertTriangle,
  Banknote,
  Hourglass,
  TriangleAlert,
  DollarSign,
  Download,
  Globe,
  RefreshCw,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useLoaderData, useLocation, useMatches } from "react-router";
import type { DonationsLoader } from "~/client/types/paymentStatementsLoader";
import { Button } from "~/client/components/ui/button";
import { MetricCard } from "./components/metricCard";
import type { MetricCardProps } from "./components/metricCard";
import { PaymentsTable } from "./components/paymentsTable";
import { PERIOD_OPTIONS, PeriodSelect } from "./components/periodSelect";

function DonationsPage() {
  const { metrics, summary } = useLoaderData<DonationsLoader>();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const openFilterDrawer = useCallback(() => setFilterDrawerOpen(true), []);

  const location = useLocation();
  const matches = useMatches();
  const period =
    new URLSearchParams(location.search).get("period") ?? "currentMonth";
  const periodLabel =
    PERIOD_OPTIONS.find((o) => o.value === period)?.label ?? "Mês atual";
  const campaignData = matches.find(
    (m) => m.data && typeof m.data === "object" && "campaign" in m.data,
  )?.data as { campaign: { name: string } } | undefined;
  const campaignName = campaignData?.campaign?.name;

  const metricCards: MetricCardProps[] = [
    {
      label: "Total recebido",
      value: metrics.released,
      subtitle: "doações confirmadas",
      icon: DollarSign,
      iconBg: "bg-[rgba(var(--spotlight-success),0.1)]",
      iconColor: "text-[rgb(var(--spotlight-success))]",
      breakdown: [
        { icon: Globe, label: "Online", value: metrics.receivedOnline },
        { icon: Banknote, label: "Offline", value: metrics.receivedOffline },
      ],
    },
    {
      label: "Ticket médio",
      value: summary.averageTicketPeriod,
      subtitle: summary.variationPercentage
        ? `${summary.variationPercentage} vs. mês anterior`
        : "vs. mês anterior",
      icon: TrendingUp,
      iconBg: "bg-[rgba(var(--spotlight-info),0.1)]",
      iconColor: "text-[rgb(var(--spotlight-info))]",
      breakdown: [
        { icon: Zap, label: "Doações únicas", value: summary.oneTimeDonationsAmount },
        { icon: RefreshCw, label: "Recorrentes", value: summary.recurringDonationsAmount },
      ],
    },
    {
      label: "Doadores",
      value: summary.subscriptionsActiveCount,
      subtitle: "assinaturas ativas",
      icon: Users,
      iconBg: "bg-[rgba(var(--spotlight-primary),0.1)]",
      iconColor: "text-[rgb(var(--spotlight-primary))]",
      breakdown: [
        { icon: UserCheck, label: "Assinaturas ativas", value: summary.subscriptionsActiveAmount },
        { icon: UserPlus, label: "Novas no período", value: summary.subscriptionsCreatedInPeriodActiveAmount },
      ],
    },
    {
      label: "Pendências",
      value: metrics.pending,
      subtitle: "exigem atenção",
      icon: AlertTriangle,
      iconBg: "bg-[rgba(var(--spotlight-warning),0.1)]",
      iconColor: "text-[rgb(var(--spotlight-warning))]",
      breakdown: [
        {
          icon: Hourglass,
          label: "Aguardando pgto",
          value: metrics.awaitingRelease,
        },
        { icon: TriangleAlert, label: "Em atraso", value: metrics.overdue },
        { icon: XCircle, label: "Cancelados", value: metrics.canceled },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
            Doações
          </h1>
          <p className="text-sm text-muted-foreground">
            Exibindo{" "}
            <span className="font-medium text-foreground">{periodLabel}</span>
            {campaignName && <> · {campaignName}</>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PeriodSelect onCustomSelect={openFilterDrawer} />
          <Button variant="outline" className="text-foreground">
            <Download size={16} />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>

      <PaymentsTable filterDrawerOpen={filterDrawerOpen} onFilterDrawerOpenChange={setFilterDrawerOpen} />
    </div>
  );
}

export { DonationsPage };
