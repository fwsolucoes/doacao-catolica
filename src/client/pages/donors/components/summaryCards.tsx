import { HandCoins, RefreshCw, UserPlus, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLoaderData } from "react-router";
import type { DonorsLoader } from "~/client/types/donorsLoader";
import { formatCurrency } from "~/lib/formatCurrency";
import { cn } from "~/lib/utils";

type CardProps = {
  label: string;
  value: string;
  subtitle: React.ReactNode;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

function SummaryCard({ label, value, subtitle, icon: Icon, iconBg, iconColor }: CardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between px-7 pb-2.5 pt-7">
        <span className="text-base font-semibold tracking-tight text-muted-foreground">
          {label}
        </span>
        <div className={cn("flex size-11 items-center justify-center rounded-xl", iconBg)}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <div className="flex flex-col gap-1 px-7 pb-7">
        <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function DonorsSummaryCards() {
  const { summary } = useLoaderData<DonorsLoader>();
  const variation = summary.newDonorsVariationPercentage;
  const variationSign = (variation ?? 0) >= 0 ? "+" : "";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Total de doadores"
        value={String(summary.totalDonors)}
        subtitle={
          <span>
            <span className="text-sidebar-accent-foreground">
              {summary.recurringDonors} recorrentes
            </span>
            <span className="text-muted-foreground/50"> · </span>
            <span className="text-foreground">{summary.oneTimeDonors} pontuais</span>
          </span>
        }
        icon={Users}
        iconBg="bg-[rgba(var(--spotlight-primary),0.1)]"
        iconColor="text-[rgb(var(--spotlight-primary))]"
      />
      <SummaryCard
        label="Novos no mês"
        value={String(summary.newDonorsThisMonth)}
        subtitle={
          variation == null
            ? "— vs. mês anterior"
            : `${variationSign}${variation}% vs. mês anterior`
        }
        icon={UserPlus}
        iconBg="bg-[rgba(var(--spotlight-info),0.1)]"
        iconColor="text-[rgb(var(--spotlight-info))]"
      />
      <SummaryCard
        label="Total recorrente"
        value={formatCurrency(String(summary.totalRecurringAmount))}
        subtitle="doações previstas /mês"
        icon={RefreshCw}
        iconBg="bg-[rgba(var(--spotlight-warning),0.1)]"
        iconColor="text-[rgb(var(--spotlight-warning))]"
      />
      <SummaryCard
        label="Valor médio"
        value={formatCurrency(String(summary.averageDonationAmount))}
        subtitle="por doação"
        icon={HandCoins}
        iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
        iconColor="text-[rgb(var(--spotlight-success))]"
      />
    </div>
  );
}

export { DonorsSummaryCards };
