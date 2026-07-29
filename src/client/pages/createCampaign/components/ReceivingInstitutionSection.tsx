import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { ImageUploadCompact } from "~/client/components/ui/image-upload-compact";
import { Input } from "~/client/components/ui/input";
import { Separator } from "~/client/components/ui/separator";

function ReceivingInstitutionSection() {
  return (
    <SectionCard
      title="Instituição recebedora"
      description="Dados legais da entidade que receberá as doações."
    >
      <FormField name="institutionLogo" label="Logo da instituição" required>
        <ImageUploadCompact
          name="institutionLogo"
          description="Formato PNG ou JPG. Dimensão recomendada: 400x400px."
          width={400}
          height={400}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField name="cnpj" label="CNPJ / CPF">
          <Input name="cnpj" placeholder="00.000.000/0000-00" />
        </FormField>
        <FormField name="institutionName" label="Nome / Razão social">
          <Input name="institutionName" placeholder="Associação Educar Brasil" />
        </FormField>
      </div>

      <Separator />

      <div className="flex flex-col gap-5 sm:flex-row">
        <FormField name="institutionCep" label="CEP" className="sm:w-40 sm:shrink-0">
          <Input name="institutionCep" placeholder="00000-000" />
        </FormField>
        <FormField name="institutionStreet" label="Endereço" className="flex-1">
          <Input name="institutionStreet" placeholder="Rua / Avenida" />
        </FormField>
        <FormField name="institutionNumber" label="Número" className="sm:w-30 sm:shrink-0">
          <Input name="institutionNumber" placeholder="Nº" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField name="institutionComplement" label="Complemento">
          <Input name="institutionComplement" placeholder="Sala, andar, bloco..." />
        </FormField>
        <FormField name="institutionNeighborhood" label="Bairro">
          <Input name="institutionNeighborhood" placeholder="Bairro" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField name="institutionCity" label="Cidade">
          <Input name="institutionCity" placeholder="Cidade" />
        </FormField>
        <FormField name="institutionState" label="Estado">
          <Input name="institutionState" placeholder="UF" maxLength={2} />
        </FormField>
      </div>
    </SectionCard>
  );
}

export { ReceivingInstitutionSection };
