import type { ReactNode } from "react";
import { useLoaderData } from "react-router";
import { Card } from "~/client/components/ui/card";
import { FormField } from "~/client/components/ui/form-field";
import { ImageUploadCompact } from "~/client/components/ui/image-upload-compact";
import { Input } from "~/client/components/ui/input";
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

function ReceivingInstitutionCard() {
  const { campaign } = useLoaderData<CampaignGeneralInfoLoader>();
  return (
    <SectionCard title="Instituição Recebedora">
      <FormField name="image" label="Logo da instituição">
        <ImageUploadCompact
          name="image"
          defaultValue={campaign.image}
          description="Formato PNG ou JPG. Dimensão recomendada: 400x400px."
          width={400}
          height={400}
        />
      </FormField>

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
