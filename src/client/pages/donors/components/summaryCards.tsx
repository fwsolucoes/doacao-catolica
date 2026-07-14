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
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
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
        iconBg="bg-violet-100"
        iconColor="text-violet-600"
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
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />
      <SummaryCard
        label="Total recorrente"
        value={formatCurrency(String(summary.totalRecurringAmount))}
        subtitle="doações previstas /mês"
        icon={RefreshCw}
        iconBg="bg-orange-100"
        iconColor="text-orange-600"
      />
      <SummaryCard
        label="Valor médio"
        value={formatCurrency(String(summary.averageDonationAmount))}
        subtitle="por doação"
        icon={HandCoins}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
      />
    </div>
  );
}

export { DonorsSummaryCards };
