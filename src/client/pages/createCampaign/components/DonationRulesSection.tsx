import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { CurrencyInput } from "~/client/components/ui/currency-input";
import { FormField } from "~/client/components/ui/form-field";

function DonationRulesSection() {
  return (
    <SectionCard
      title="Regras de doação"
      description="Limite mínimo aceito no checkout desta campanha."
    >
      <div className="sm:max-w-[50%]">
        <FormField name="minDonationAmount" label="Valor mínimo permitido (R$)">
          <CurrencyInput name="minDonationAmount" defaultValue={10} />
        </FormField>
      </div>
    </SectionCard>
  );
}

export { DonationRulesSection };
