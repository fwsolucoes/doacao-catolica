import { RichTextarea } from "~/client/components/campaignSettings/richTextarea";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { ImageUploadCompact } from "~/client/components/ui/image-upload-compact";
import { Input } from "~/client/components/ui/input";

function WhyDonateSection() {
  return (
    <SectionCard
      title="Por que doar"
      description="Bloco que explica o propósito da campanha."
    >
      <FormField name="whyDonateTitle" label="Título">
        <Input name="whyDonateTitle" placeholder="Ex.: Por que sua doação importa" />
      </FormField>
      <FormField name="whyDonateText" label="Texto">
        <RichTextarea
          name="whyDonateText"
          placeholder="Explique o impacto da doação..."
        />
      </FormField>
      <FormField name="whyDonateImage" label="Imagem do bloco" optional>
        <ImageUploadCompact
          name="whyDonateImage"
          width={800}
          height={600}
          description="Dimensão recomendada: 800x600px."
        />
      </FormField>
    </SectionCard>
  );
}

export { WhyDonateSection };
