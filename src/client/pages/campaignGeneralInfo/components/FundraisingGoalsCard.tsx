import type { ReactNode } from "react";
import { useLoaderData } from "react-router";
import { Card } from "~/client/components/ui/card";
import { CurrencyInput } from "~/client/components/ui/currency-input";
import { FormField } from "~/client/components/ui/form-field";
import type { CampaignGeneralInfoLoader } from "~/client/types/campaignGeneralInfoLoader";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card.Root className="flex flex-col gap-6 p-6">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {children}
    </Card.Root>
  );
}

function FundraisingGoalsCard() {
  const { campaign } = useLoaderData<CampaignGeneralInfoLoader>();
  return (
    <SectionCard title="Metas de Arrecadação">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField name="totalGoal" label="Meta total">
          <CurrencyInput
            name="totalGoal"
            defaultValue={
              campaign.totalGoal ?? undefined
            }
            placeholder="0,00"
          />
        </FormField>

        <FormField name="monthlyGoal" label="Meta mensal">
          <CurrencyInput
            name="monthlyGoal"
            defaultValue={campaign.monthlyGoal ?? undefined}
            placeholder="0,00"
          />
        </FormField>
      </div>
    </SectionCard>
  );
}

export { FundraisingGoalsCard };
