import { ArrowUpRight } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import type { DashboardLoader } from "~/client/types/dashboardLoader";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Progress } from "~/client/components/ui/progress";

function FeaturedCampaignsCard() {
  const { featuredCampaigns } = useLoaderData<DashboardLoader>();

  return (
    <Card.Root className="col-span-2 gap-6 p-7">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-semibold tracking-tight text-foreground">
            Campanhas em destaque
          </p>
          <p className="text-sm text-muted-foreground">
            Progresso das principais campanhas ativas.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-xs text-sidebar-accent-foreground"
          asChild
        >
          <Link to="/my-campaigns">
            Ver todas <ArrowUpRight size={14} />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-6">
        {(featuredCampaigns?.campaigns ?? []).map((c) => (
          <div key={c.accountReference} className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-base font-semibold text-foreground">
                  {c.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {c.donorsCount.toLocaleString("pt-BR")} doadores
                </p>
              </div>
              <div className="text-right">
                <p className="text-base text-foreground">
                  <span className="font-semibold">
                    R$ {Math.round(c.monthRaised).toLocaleString("pt-BR")}{" "}
                  </span>
                  {c.totalGoal !== null && (
                    <span className="text-muted-foreground">
                      / R$ {Math.round(c.totalGoal).toLocaleString("pt-BR")}
                    </span>
                  )}
                </p>
                <p className="text-xs text-sidebar-accent-foreground">
                  {c.progressPercentage !== null
                    ? `${c.progressPercentage.toFixed(1)}% da meta`
                    : "Sem meta"}
                </p>
              </div>
            </div>
            {c.progressPercentage !== null && (
              <Progress
                value={c.progressPercentage}
                className="h-2.5 [--progress-foreground:var(--color-sidebar-accent-foreground)]"
              />
            )}
          </div>
        ))}
      </div>
    </Card.Root>
  );
}

export { FeaturedCampaignsCard };
