import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { Textarea } from "~/client/components/ui/textarea";

function PageContentSection() {
  return (
    <SectionCard
      title="Conteúdo da página de captação"
      description="Informações principais exibidas na página pública da campanha."
    >
      <FormField name="title" label="Título">
        <Input name="title" placeholder="Ex.: Ajude a reformar nossa paróquia" />
      </FormField>
      <FormField name="description" label="Texto principal">
        <Textarea
          name="description"
          placeholder="Descrição curta que aparece logo abaixo do título."
          className="min-h-24"
        />
      </FormField>
    </SectionCard>
  );
}

export { PageContentSection };
