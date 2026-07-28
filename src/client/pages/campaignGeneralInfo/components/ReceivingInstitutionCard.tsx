import type { ReactNode } from "react";
import { Card } from "~/client/components/ui/card";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import type { CampaignGeneralInfoLoader } from "~/client/types/campaignGeneralInfoLoader";

type Campaign = CampaignGeneralInfoLoader["campaign"];

type ReceivingInstitutionCardProps = {
  campaign: Campaign;
};

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

function ReceivingInstitutionCard({ campaign }: ReceivingInstitutionCardProps) {
  return (
    <SectionCard title="Instituição Recebedora">
      <FormField name="institutionName" label="Nome da instituição">
        <Input
          name="institutionName"
          placeholder="Nome da organização"
          defaultValue={campaign.institutionName ?? ""}
        />
      </FormField>

      <FormField name="cnpj" label="CNPJ">
        <Input
          name="cnpj"
          placeholder="00.000.000/0000-00"
          defaultValue={campaign.cnpj ?? ""}
        />
      </FormField>

      <FormField name="address" label="Endereço">
        <Input
          name="address"
          placeholder="Rua, número, cidade — UF"
          defaultValue={campaign.address ?? ""}
        />
      </FormField>
    </SectionCard>
  );
}

export { ReceivingInstitutionCard };
