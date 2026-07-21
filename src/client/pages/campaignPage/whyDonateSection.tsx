import { FileUploadField } from "~/client/components/campaignSettings/fileUploadField";
import { RichTextarea } from "~/client/components/campaignSettings/richTextarea";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";

function WhyDonateSection() {
  return (
    <SectionCard
      title="Por que doar"
      description="Bloco que explica o propósito da campanha."
    >
      <FormField name="whyDonateTitle" label="Título">
        <Input
          name="whyDonateTitle"
          placeholder="Ex.: Por que sua doação importa"
        />
      </FormField>
      <FormField name="whyDonateText" label="Texto">
        <RichTextarea
          name="whyDonateText"
          placeholder="Explique o impacto da doação..."
        />
      </FormField>
      <FileUploadField
        name="whyDonateImage"
        label="Imagem do bloco"
        optional
        hint="Dimensão recomendada: 800x600px."
      />
    </SectionCard>
  );
}

export { WhyDonateSection };
