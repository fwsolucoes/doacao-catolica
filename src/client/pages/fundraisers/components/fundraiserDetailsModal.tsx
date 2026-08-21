import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  RefreshCw,
  Users,
  UserPlus,
  Wallet,
} from "lucide-react";
import { useEffect } from "react";
import { useFetcher, useParams } from "react-router";
import { Card } from "~/client/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { Skeleton } from "~/client/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";
import type { FundraiserDetailsJson } from "~/domain/entities/fundraiserDetails";
import type { ActiveFundraiser } from "../types";

type FundraiserDetailsModalProps = {
  fundraiser: ActiveFundraiser | null;
  onClose: () => void;
};

function MetricCard({
  label,
  value,
  subValue,
  icon,
  color,
  isLoading,
}: {
  label: string;
  value: string;
  subValue?: string | null;
  icon: LucideIcon;
  color: "teal" | "primary" | "success" | "danger" | "info" | "accent" | "warning";
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border p-4">
      <Card.MetricHeader label={label} icon={icon} color={color} />
      {isLoading ? (
        <Skeleton className="h-7 w-24" />
      ) : (
        <div className="flex flex-col gap-0.5">
          <Card.MetricValue>{value}</Card.MetricValue>
          {subValue && (
            <span className="text-xs text-muted-foreground">{subValue}</span>
          )}
        </div>
      )}
    </div>
  );
}

function FundraiserDetailsModal({ fundraiser, onClose }: FundraiserDetailsModalProps) {
  const { campaignId } = useParams<{ campaignId: string }>();
  const fetcher = useFetcher<FundraiserDetailsJson>();

  useEffect(() => {
    if (!fundraiser?.id || !campaignId) return;
    fetcher.load(`/campaign/${campaignId}/api/fundraiser-details/${fundraiser.id}`);
  }, [fundraiser?.id, campaignId]);

  const details = fetcher.data;
  const isLoading = fetcher.state !== "idle" || (!details && !!fundraiser);

  const comparisonIsPositive =
    details?.comparisonPercent?.startsWith("+") ?? false;

  return (
    <Dialog open={!!fundraiser} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes de indicações</DialogTitle>
          {fundraiser && (
            <p className="text-sm text-muted-foreground">
              {fundraiser.name}
              {fundraiser.email ? ` · ${fundraiser.email}` : ""}
            </p>
          )}
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 px-6">
          <MetricCard
            label="Total de doadores indicados"
            value={isLoading ? "" : String(details?.totalIndications ?? 0)}
            icon={Users}
            color="info"
            isLoading={isLoading}
          />
          <MetricCard
            label="Total mensal (recorrência)"
            value={isLoading ? "" : (details?.totalRecurringAmount ?? "R$ 0,00")}
            icon={RefreshCw}
            color="success"
            isLoading={isLoading}
          />
          <MetricCard
            label="Total do último mês"
            value={isLoading ? "" : (details?.last30DaysTotalRaisedAmount ?? "R$ 0,00")}
            icon={CalendarDays}
            color="warning"
            isLoading={isLoading}
          />
          <MetricCard
            label="Novos doadores indicados"
            value={isLoading ? "" : String(details?.last30DaysTotalIndications ?? 0)}
            subValue="no último mês"
            icon={UserPlus}
            color="accent"
            isLoading={isLoading}
          />
          <MetricCard
            label="Comparação com mês anterior"
            value={
              isLoading
                ? ""
                : (details?.comparisonPercent ?? "—")
            }
            subValue={
              details?.previousMonthAmount
                ? `Mês anterior: ${details.previousMonthAmount}`
                : null
            }
            icon={comparisonIsPositive ? ArrowUpRight : ArrowDownRight}
            color={comparisonIsPositive ? "success" : "danger"}
            isLoading={isLoading}
          />
          <MetricCard
            label="Total de comissões recebidas"
            value={isLoading ? "" : "—"}
            icon={Wallet}
            color="primary"
            isLoading={isLoading}
          />
        </div>

        <DialogFooter showCloseButton closeButtonLabel="Fechar" />
      </DialogContent>
    </Dialog>
  );
}

export { FundraiserDetailsModal };
