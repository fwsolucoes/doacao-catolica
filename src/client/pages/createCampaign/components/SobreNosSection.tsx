import { RichTextarea } from "~/client/components/campaignSettings/richTextarea";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { ImageUploadCompact } from "~/client/components/ui/image-upload-compact";
import { Input } from "~/client/components/ui/input";

function SobreNosSection() {
  return (
    <SectionCard
      title="Sobre nós"
      description="Apresente a instituição responsável pela campanha."
    >
      <FormField name="aboutTitle" label="Título">
        <Input name="aboutTitle" placeholder="Ex.: Sobre nossa paróquia" />
      </FormField>
      <FormField name="aboutText" label="Texto">
        <RichTextarea name="aboutText" placeholder="Conte a história da instituição..." />
      </FormField>
      <FormField name="aboutImage" label="Imagem do bloco" optional>
        <ImageUploadCompact
          name="aboutImage"
          width={800}
          height={600}
          description="Dimensão recomendada: 800x600px."
        />
      </FormField>
    </SectionCard>
  );
}

export { SobreNosSection };
