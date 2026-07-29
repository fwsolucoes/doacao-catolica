import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";

function ReceivingInstitutionSection() {
  return (
    <SectionCard
      title="Instituição recebedora"
      description="Dados da organização que receberá as doações."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField name="cnpj" label="CNPJ / CPF">
          <Input name="cnpj" placeholder="00.000.000/0000-00" />
        </FormField>
        <FormField name="institutionName" label="Nome / Razão social">
          <Input name="institutionName" placeholder="Nome da organização" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField name="institutionCep" label="CEP">
          <Input name="institutionCep" placeholder="00000-000" />
        </FormField>
        <FormField name="institutionStreet" label="Endereço">
          <Input name="institutionStreet" placeholder="Rua, Avenida..." />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField name="institutionNumber" label="Número">
          <Input name="institutionNumber" placeholder="123" />
        </FormField>
        <FormField name="institutionComplement" label="Complemento">
          <Input name="institutionComplement" placeholder="Apto, Bloco..." />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <FormField name="institutionNeighborhood" label="Bairro">
          <Input name="institutionNeighborhood" placeholder="Bairro" />
        </FormField>
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
