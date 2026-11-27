import { HeartHandshake, UserMinus, Users, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { tv } from "tailwind-variants";
import { Card } from "~/client/components/ui/card";
import type { DonorHealthReport } from "~/client/types/donorHealthReportLoader";

const kpiIcon = tv({
  base: "flex size-13 shrink-0 items-center justify-center rounded-2xl",
  variants: {
    tone: {
      navy: "bg-(--badge-navy-bg) text-(--badge-navy-text)",
      emerald: "bg-(--badge-emerald-bg) text-(--badge-emerald-text)",
      violet: "bg-(--badge-violet-bg) text-(--badge-violet-text)",
      rose: "bg-(--badge-rose-bg) text-(--badge-rose-text)",
    },
  },
});

const kpiCaption = tv({
  base: "text-sm",
  variants: {
    trend: {
      up: "text-(--badge-emerald-text)",
      down: "text-destructive",
      neutral: "text-muted-foreground",
    },
  },
});

type KpiCardProps = {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  tone: "navy" | "emerald" | "violet" | "rose";
  variation?: number | null;
};

function trendOf(variation?: number | null) {
  if (variation === undefined || variation === null || variation === 0) return "neutral";
  return variation > 0 ? "up" : "down";
}

function KpiCard({ label, value, caption, icon: Icon, tone, variation }: KpiCardProps) {
  return (
    <Card.Root className="gap-1 p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="pt-1 text-sm text-muted-foreground">{label}</span>
        <div className={kpiIcon({ tone })}>
          <Icon size={22} />
        </div>
      </div>
      <span className="pt-2 text-2xl font-semibold tracking-tight text-(--text-heading)">
        {value}
      </span>
      <span className={kpiCaption({ trend: trendOf(variation) })}>{caption}</span>
    </Card.Root>
  );
}

function KpiCards({ report }: { report: DonorHealthReport }) {
  const lastClosedMonth = report.lastClosedMonth;
  if (!lastClosedMonth) return null;

  const { kpis } = lastClosedMonth;

  return (
    <section className="flex flex-col gap-3" aria-labelledby="donor-health-last-month">
      <h2 id="donor-health-last-month" className="text-sm font-semibold text-(--text-heading)">
        Último mês fechado · {lastClosedMonth.label}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Receita do mês"
          value={kpis.revenue.value}
          caption={kpis.revenue.caption}
          variation={kpis.revenue.variation}
          icon={Wallet}
          tone="navy"
        />
        <KpiCard
          label="Doadores no mês"
          value={kpis.donors.value}
          caption={kpis.donors.caption}
          variation={kpis.donors.variation}
          icon={Users}
          tone="emerald"
        />
        <KpiCard
          label="Doadores fiéis"
          value={kpis.loyalDonors.value}
          caption={kpis.loyalDonors.caption}
          icon={HeartHandshake}
          tone="violet"
        />
        <KpiCard
          label="Novos lapsos em 12 meses"
          value={kpis.newLapses.value}
          caption={kpis.newLapses.caption}
          icon={UserMinus}
          tone="rose"
        />
      </div>
    </section>
  );
}

export { KpiCards };
