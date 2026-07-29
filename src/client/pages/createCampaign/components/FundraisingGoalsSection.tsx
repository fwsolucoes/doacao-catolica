import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { CurrencyInput } from "~/client/components/ui/currency-input";
import { FormField } from "~/client/components/ui/form-field";

function FundraisingGoalsSection() {
  return (
    <SectionCard
      title="Metas de arrecadação"
      description="Defina objetivos financeiros para acompanhar o progresso da campanha."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField name="totalGoal" label="Meta total (opcional)">
          <CurrencyInput name="totalGoal" placeholder="0,00" />
        </FormField>
        <FormField name="monthlyGoal" label="Meta mensal (opcional)">
          <CurrencyInput name="monthlyGoal" placeholder="0,00" />
        </FormField>
      </div>
    </SectionCard>
  );
}

export { FundraisingGoalsSection };
