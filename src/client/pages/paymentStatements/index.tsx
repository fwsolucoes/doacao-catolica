import {
  AlertCircle,
  AlertTriangle,
  Banknote,
  Clock,
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
import { useLoaderData, useLocation, useMatches } from "react-router";
import type { DonationsLoader } from "~/client/types/paymentStatementsLoader";
import { Button } from "~/client/components/ui/button";
import { MetricCard } from "./components/metricCard";
import type { MetricCardProps } from "./components/metricCard";
import { PaymentsTable } from "./components/paymentsTable";
import { PERIOD_OPTIONS, PeriodSelect } from "./components/periodSelect";

function DonationsPage() {
  const { metrics } = useLoaderData<DonationsLoader>();

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
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      breakdown: [
        { icon: Globe, label: "Online", value: metrics.receivedOnline },
        { icon: Banknote, label: "Offline", value: metrics.receivedOffline },
      ],
    },
    {
      label: "Ticket médio",
      value: "—",
      subtitle: "vs. período anterior",
      icon: TrendingUp,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-800",
      breakdown: [
        { icon: Zap, label: "Doações únicas", value: "—" },
        { icon: RefreshCw, label: "Recorrentes", value: "—" },
      ],
    },
    {
      label: "Doadores",
      value: "—",
      subtitle: "doadores no período",
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-800",
      breakdown: [
        { icon: UserPlus, label: "Novos", value: "—" },
        { icon: UserCheck, label: "Fidelizados", value: "—" },
      ],
    },
    {
      label: "Pendências",
      value: metrics.pending,
      subtitle: "exigem atenção",
      icon: AlertTriangle,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-700",
      breakdown: [
        {
          icon: Clock,
          label: "Aguardando pgto",
          value: metrics.awaitingRelease,
        },
        { icon: AlertCircle, label: "Em atraso", value: metrics.overdue },
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
          <PeriodSelect />
          <Button variant="outline">
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

      <PaymentsTable />
    </div>
  );
}

export { DonationsPage };
