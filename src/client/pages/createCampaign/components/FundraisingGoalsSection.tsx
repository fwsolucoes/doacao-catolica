import { useState } from "react";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { CurrencyInput } from "~/client/components/ui/currency-input";
import { FormField } from "~/client/components/ui/form-field";
import { RadioGroup } from "~/client/components/ui/radio-group";
import { Switch } from "~/client/components/ui/switch";
import { cn } from "~/lib/utils";

type ProgressBase = "total" | "monthly";

function FundraisingGoalsSection() {
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [progressBase, setProgressBase] = useState<ProgressBase>("total");

  return (
    <SectionCard
      title="Metas de arrecadação"
      description="Defina objetivos e controle a exibição pública do progresso."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField name="totalGoal" label="Meta total (opcional)">
          <CurrencyInput name="totalGoal" placeholder="0,00" />
        </FormField>
        <FormField name="monthlyGoal" label="Meta mensal (opcional)">
          <CurrencyInput name="monthlyGoal" placeholder="0,00" />
        </FormField>
      </div>

      <div className="flex items-center justify-between gap-6 rounded-xl border border-border p-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-foreground">Mostrar barra de progresso</span>
          <span className="text-xs text-muted-foreground">
            Exibe o quanto já foi arrecadado em relação à meta na página pública da campanha.
          </span>
        </div>
        <input type="hidden" name="showProgressBar" value={showProgressBar ? "true" : "false"} />
        <Switch checked={showProgressBar} onCheckedChange={setShowProgressBar} className="shrink-0" />
      </div>

      <div className="flex flex-col gap-3.5 rounded-xl border border-border p-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-foreground">Base da barra de progresso</span>
          <span className="text-xs text-muted-foreground">
            Escolha qual meta será usada como referência na página pública.
          </span>
        </div>
        <input type="hidden" name="progressBase" value={progressBase} />
        <RadioGroup.Root
          value={progressBase}
          onValueChange={(v) => setProgressBase(v as ProgressBase)}
          className="gap-2.5"
        >
          {(
            [
              { value: "total", label: "Meta total da campanha" },
              { value: "monthly", label: "Meta mensal" },
            ] as const
          ).map(({ value, label }) => (
            <label
              key={value}
              className={cn(
                "flex flex-1 cursor-pointer items-center gap-2.5 rounded-xl border p-4 transition-colors",
                progressBase === value ? "border-primary bg-primary/5" : "border-border",
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

export { FundraisingGoalsSection };
