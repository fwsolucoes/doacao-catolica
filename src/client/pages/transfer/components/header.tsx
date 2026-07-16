import { Clock3, Download, WalletCards } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "~/client/components/ui/card";
import { cn } from "~/lib/utils";
import { RequestWithdrawalModal } from "./requestWithdrawalModal";
import { formatCurrency, type TransferAccount } from "./utils";

type TransferHeaderProps = {
  accounts: TransferAccount[];
  availableAmount: number;
  awaitingRelease: number;
  withdrawalsMade: number;
};

function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  tone: "green" | "amber" | "blue";
}) {
  const toneClass = {
    green:
      "bg-[rgba(var(--spotlight-success),0.14)] text-[rgb(var(--spotlight-success))]",
    amber:
      "bg-[rgba(var(--spotlight-warning),0.16)] text-[rgb(var(--spotlight-warning))]",
    blue: "bg-[rgba(var(--spotlight-info),0.14)] text-[rgb(var(--spotlight-info))]",
  }[tone];

  return (
    <Card.Root className="min-h-34 gap-3 rounded-2xl p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-xl",
            toneClass,
          )}
        >
          <Icon size={18} />
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <strong className="text-2xl font-semibold text-foreground">
          {value}
        </strong>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
    </Card.Root>
  );
}

function TransferHeader({
  accounts,
  availableAmount,
  awaitingRelease,
  withdrawalsMade,
}: TransferHeaderProps) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
            Transferências
          </h1>
          <p className="text-sm text-muted-foreground">
            Solicite saques e acompanhe as transferências realizadas.
          </p>
        </div>
        <RequestWithdrawalModal
          accounts={accounts}
          availableAmount={availableAmount}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <MetricCard
          label="Disponível para saque"
          value={formatCurrency(availableAmount)}
          subtitle="pronto para transferência"
          icon={WalletCards}
          tone="green"
        />
        <MetricCard
          label="Aguardando liberação (Cartão)"
          value={formatCurrency(awaitingRelease)}
          subtitle="liberação em até 30 dias"
          icon={Clock3}
          tone="amber"
        />
        <MetricCard
          label="Total sacado"
          value={formatCurrency(withdrawalsMade)}
          subtitle="acumulado no período"
          icon={Download}
          tone="blue"
        />
      </div>
    </>
  );
}

export { TransferHeader };
