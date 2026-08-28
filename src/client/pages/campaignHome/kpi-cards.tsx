import { DollarSign, Users, Target, Receipt } from "lucide-react";
import { useLoaderData, useRouteLoaderData } from "react-router";
import { Card } from "~/client/components/ui/card";
import type { CampaignHomeLoader } from "~/client/types/campaignHomeLoader";
import type { CampaignLayoutLoader } from "~/client/types/campaignLayoutLoader";
import { formatCurrency } from "~/lib/formatCurrency";

function KpiCards() {
  const { overview } = useLoaderData<CampaignHomeLoader>();
  const layoutData = useRouteLoaderData<CampaignLayoutLoader>(
    "main/routes/layout.campaignLayout",
  );

  const isMonthly =
    layoutData?.campaign.typeDonation === "BOTH" ||
    layoutData?.campaign.typeDonation === "MONTHLY";

  const raised = isMonthly ? overview.monthRaised : overview.totalRaised;

  const goal = isMonthly
    ? (overview.monthlyGoal ?? null)
    : (layoutData?.campaign.totalGoal ?? null);

  const goalProgressPercentage = isMonthly
    ? (overview.monthlyGoalProgressPercentage ??
        (goal && goal > 0 ? (raised / goal) * 100 : null))
    : (overview.totalGoalProgressPercentage ??
        (goal && goal > 0 ? (raised / goal) * 100 : null));

  const progressLabel =
    goalProgressPercentage !== null
      ? `${Math.round(goalProgressPercentage)}%`
      : "–";

  const variationDirection =
    overview.averageTicketVariationPercentage !== null &&
    overview.averageTicketVariationPercentage >= 0
      ? "up"
      : "down";

  const variationLabel =
    overview.averageTicketVariationPercentage !== null
      ? `${overview.averageTicketVariationPercentage >= 0 ? "+" : ""}${overview.averageTicketVariationPercentage.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% vs. mês anterior`
      : null;

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <Card.Root className="gap-4 p-6">
        <Card.MetricHeader
          label={isMonthly ? "Arrecadado no mês" : "Total arrecadado"}
          icon={DollarSign}
          color="success"
        />
        <div className="flex flex-col gap-1">
          <Card.MetricValue>
            {formatCurrency(String(raised))}
          </Card.MetricValue>
          {goal !== null && (
            <span className="text-xs text-muted-foreground">
              Meta: {formatCurrency(String(goal))}
            </span>
          )}
        </div>
      </Card.Root>

      <Card.Root className="gap-4 p-6">
        <Card.MetricHeader label="Apoiadores" icon={Users} color="info" />
        <div className="flex flex-col gap-1">
          <Card.MetricValue>
            {overview.supporters.toLocaleString("pt-BR")}
          </Card.MetricValue>
          <Card.MetricTrend
            value={`+${overview.newSupportersLast7Days} nos últimos 7 dias`}
            direction="up"
          />
        </div>
      </Card.Root>

      <Card.Root className="gap-4 p-6">
        <Card.MetricHeader label="Progresso" icon={Target} color="primary" />
        <div className="flex flex-col gap-1">
          <Card.MetricValue>{progressLabel}</Card.MetricValue>
          <span className="text-xs text-muted-foreground">
            {goalProgressPercentage !== null
              ? isMonthly
                ? "da meta mensal"
                : "da meta total"
              : "meta não configurada"}
          </span>
        </div>
      </Card.Root>

      <Card.Root className="gap-4 p-6">
        <Card.MetricHeader label="Ticket médio" icon={Receipt} color="teal" />
        <div className="flex flex-col gap-1">
          <Card.MetricValue>
            {formatCurrency(String(overview.averageTicketMonth))}
          </Card.MetricValue>
          {variationLabel && (
            <Card.MetricTrend value={variationLabel} direction={variationDirection} />
          )}
        </div>
      </Card.Root>
    </div>
  );
}

export { KpiCards };
