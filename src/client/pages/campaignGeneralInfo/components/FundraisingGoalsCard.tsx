import type { ReactNode } from "react";
import { useLoaderData } from "react-router";
import { Card } from "~/client/components/ui/card";
import { CurrencyInput } from "~/client/components/ui/currency-input";
import { FormField } from "~/client/components/ui/form-field";
import { RadioGroup } from "~/client/components/ui/radio-group";
import { Switch } from "~/client/components/ui/switch";
import type { CampaignGeneralInfoLoader } from "~/client/types/campaignGeneralInfoLoader";
import { cn } from "~/lib/utils";

const PROGRESS_GOAL_TYPE_OPTIONS = [
  { value: "TOTAL", label: "Meta total da campanha" },
  { value: "MONTHLY", label: "Meta mensal" },
] as const;

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card.Root className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </Card.Root>
  );
}

function FundraisingGoalsCard() {
  const { campaign } = useLoaderData<CampaignGeneralInfoLoader>();
  return (
    <SectionCard
      title="Metas de Arrecadação"
      description="Defina objetivos e controle a exibição pública do progresso."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField name="totalGoal" label="Meta total" optional>
          <CurrencyInput
            name="totalGoal"
            defaultValue={
              campaign.totalGoal ?? undefined
            }
            placeholder="0,00"
          />
        </FormField>

        <FormField name="monthlyGoal" label="Meta mensal" optional>
          <CurrencyInput
            name="monthlyGoal"
            defaultValue={campaign.monthlyGoal ?? undefined}
            placeholder="0,00"
          />
        </FormField>
      </div>

      <div className="flex items-center justify-between gap-6 rounded-xl border border-border p-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-foreground">
            Mostrar barra de progresso
          </span>
          <span className="text-xs text-muted-foreground">
            Exibe o quanto já foi arrecadado em relação à meta na página
            pública da campanha.
          </span>
        </div>
        <Switch
          name="showProgressBar"
          value="true"
          defaultChecked={campaign.showProgressBar}
          className="shrink-0"
        />
      </div>

      <div className="flex flex-col gap-3.5 rounded-xl border border-border p-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-foreground">
            Base da barra de progresso
          </span>
          <span className="text-xs text-muted-foreground">
            Escolha qual meta será usada como referência na página pública.
          </span>
        </div>
        <RadioGroup.Root
          name="progressGoalType"
          defaultValue={campaign.progressGoalType ?? "TOTAL"}
          className="flex-col sm:flex-row"
        >
          {PROGRESS_GOAL_TYPE_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className={cn(
                "flex flex-1 cursor-pointer items-center gap-2.5 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50",
                "has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5",
              )}
            >
              <RadioGroup.Item value={value} />
              <span className="text-sm text-foreground">{label}</span>
            </label>
          ))}
        </RadioGroup.Root>
      </div>
    </SectionCard>
  );
}

export { FundraisingGoalsCard };
