import {
  DollarSign,
  Heart,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLoaderData } from "react-router";
import type { DashboardLoader } from "~/client/types/dashboardLoader";
import { Badge } from "~/client/components/ui/badge";
import { Card } from "~/client/components/ui/card";

function StatCard({
  label,
  value,
  trendValue,
  trendDir,
  trendNote,
  icon: Icon,
  iconBgClass,
  iconColorClass,
}: {
  label: string;
  value: string;
  trendValue: string;
  trendDir: "up" | "down";
  trendNote: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
}) {
  const TrendIcon = trendDir === "up" ? TrendingUp : TrendingDown;

  return (
    <Card.Root className="gap-3 p-7">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-muted-foreground">
          {label}
        </span>
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-xl",
            iconBgClass,
          )}
        >
          <Icon size={20} className={iconColorClass} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant={trendDir === "up" ? "success" : "danger"}>
            <TrendIcon size={12} data-icon="inline-start" />
            {trendValue}
          </Badge>
          <span className="text-xs text-muted-foreground">{trendNote}</span>
        </div>
      </div>
    </Card.Root>
  );
}

function KpiCards() {
  const { overview } = useLoaderData<DashboardLoader>();

  const totalRaisedFormatted = overview
    ? `R$ ${Math.round(overview.totalRaised).toLocaleString("pt-BR")}`
    : "—";
  const growthTrendValue =
    overview?.growthPercentage != null
      ? `${overview.growthPercentage >= 0 ? "+" : ""}${overview.growthPercentage.toFixed(1)}%`
      : "—";
  const growthTrendDir: "up" | "down" =
    (overview?.growthPercentage ?? 0) >= 0 ? "up" : "down";

  const supportersFormatted = overview
    ? overview.supporters.toLocaleString("pt-BR")
    : "—";
  const newSupporters = overview?.newSupportersLast7Days ?? 0;

  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      <StatCard
        label="Doações totais"
        value={totalRaisedFormatted}
        trendValue={growthTrendValue}
        trendDir={growthTrendDir}
        trendNote="vs. mês passado"
        icon={DollarSign}
        iconBgClass="bg-blue-500/8"
        iconColorClass="text-blue-500"
      />
      <StatCard
        label="Doadores ativos"
        value={supportersFormatted}
        trendValue={`+${newSupporters}`}
        trendDir="up"
        trendNote="novos últimos 7 dias"
        icon={Users}
        iconBgClass="bg-green-500/8"
        iconColorClass="text-green-500"
      />
      <StatCard
        label="Campanhas ativas"
        value="27"
        trendValue="+3"
        trendDir="up"
        trendNote="4 finalizando em breve"
        icon={Target}
        iconBgClass="bg-amber-500/8"
        iconColorClass="text-amber-500"
      />
      <StatCard
        label="Taxa de retenção"
        value="68,3%"
        trendValue="-1,1%"
        trendDir="down"
        trendNote="últimos 30 dias"
        icon={Heart}
        iconBgClass="bg-pink-500/8"
        iconColorClass="text-pink-500"
      />
    </div>
  );
}

export { KpiCards };
