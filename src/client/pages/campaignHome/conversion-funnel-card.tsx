import { UserPlus, Heart } from "lucide-react";
import type { CSSProperties } from "react";
import { useLoaderData } from "react-router";
import { Card } from "~/client/components/ui/card";
import { Progress } from "~/client/components/ui/progress";
import type { CampaignHomeLoader } from "~/client/types/campaignHomeLoader";

function ConversionFunnelCard() {
  const { breakdowns } = useLoaderData<CampaignHomeLoader>();
  const { conversionFunnel: f } = breakdowns;

  const steps = [
    {
      label: "Cadastros efetuados",
      value: f.registrations,
      sub: `${f.registrationsSubscriptions.toLocaleString("pt-BR")} assinaturas · ${f.registrationsTransfers.toLocaleString("pt-BR")} transferências`,
      pct: null,
      color: "#74e7bb",
      icon: UserPlus,
    },
    {
      label: "Doações concluídas",
      value: f.completedDonations,
      sub: `${f.completedSubscriptions.toLocaleString("pt-BR")} assinaturas · ${f.completedTransfers.toLocaleString("pt-BR")} transferências`,
      pct: `${f.conversionPercentage.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% dos cadastros`,
      color: "#6bceff",
      icon: Heart,
    },
  ];

  const maxValue = f.registrations || 1;

  return (
    <Card.Root className="p-6">
      <div>
        <p className="text-sm font-semibold text-(--text-heading)">
          Funil de conversão
        </p>
        <p className="text-xs text-muted-foreground">
          Do cadastro até as doações concluídas no período.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {steps.map((step) => {
          const barWidth = Math.round((step.value / maxValue) * 100);
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-(--sidebar-accent-foreground)/10">
                    <Icon
                      size={16}
                      className="text-sidebar-accent-foreground"
                    />
                  </div>
                  <div>
                    <span className="text-sm text-(--text-heading)">
                      {step.label}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      {step.sub}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-(--text-heading)">
                    {step.value.toLocaleString("pt-BR")}
                  </p>
                  {step.pct && (
                    <p className="text-[11px] text-muted-foreground">
                      {step.pct}
                    </p>
                  )}
                </div>
              </div>
              <Progress
                value={barWidth}
                className="h-3.5 bg-muted"
                style={
                  { "--progress-foreground": step.color } as CSSProperties
                }
              />
            </div>
          );
        })}
      </div>
    </Card.Root>
  );
}

export { ConversionFunnelCard };
