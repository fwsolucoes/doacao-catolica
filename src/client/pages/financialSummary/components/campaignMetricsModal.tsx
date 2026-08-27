import { useEffect } from "react";
import { useFetcher } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/client/components/ui/dialog";

type CampaignMetricsModalProps = {
  campaignId: string;
  campaignName: string;
  dateType: string;
  startDate: string;
  endDate: string;
  onClose: () => void;
};

type MetricsData = {
  pending: string;
  canceled: string;
  oneTimeDonations: string;
  recurringDonations: string;
  newRecurringDonors: number;
  withdrawalsMade: string;
  balanceAvailable: string;
  averageTicket: string;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/30 p-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-base font-semibold text-foreground">{value}</span>
    </div>
  );
}

function CampaignMetricsModal({
  campaignId,
  campaignName,
  dateType,
  startDate,
  endDate,
  onClose,
}: CampaignMetricsModalProps) {
  const fetcher = useFetcher<MetricsData>();
  const isOpen = !!campaignId;

  useEffect(() => {
    if (!isOpen || !campaignId) return;
    const params = new URLSearchParams({ campaignId });
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);
    fetcher.load(`/api/campaign-metrics-modal?${params.toString()}`);
  }, [isOpen, campaignId, startDate, endDate]);

  const data = fetcher.data;
  const isLoading = fetcher.state === "loading";

  const dateTypeLabel =
    dateType === "due_date" ? "data de vencimento" : "data de pagamento";

  const metrics = data
    ? [
        { label: "Total pendentes", value: data.pending },
        { label: "Total cancelados", value: data.canceled },
        { label: "Doações pontuais", value: data.oneTimeDonations },
        { label: "Doações recorrentes", value: data.recurringDonations },
        { label: "Novos doadores recorrentes", value: data.newRecurringDonors },
        { label: "Total sacado no período", value: data.withdrawalsMade },
        { label: "Saldo disponível", value: data.balanceAvailable },
        { label: "Ticket médio", value: data.averageTicket },
      ]
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{campaignName}</DialogTitle>
          <DialogDescription>
            Métricas detalhadas do período ({dateTypeLabel}).
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          {isLoading && (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg border border-border bg-muted/40"
                />
              ))}
            </div>
          )}

          {!isLoading && data && (
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((m) => (
                <MetricCard key={m.label} label={m.label} value={m.value} />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { CampaignMetricsModal };
