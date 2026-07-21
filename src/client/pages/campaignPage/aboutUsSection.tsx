import { FileUploadField } from "~/client/components/campaignSettings/fileUploadField";
import { RichTextarea } from "~/client/components/campaignSettings/richTextarea";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";

function AboutUsSection() {
  return (
    <SectionCard
      title="Sobre nós"
      description="Apresente a instituição responsável pela campanha."
    >
      <FormField name="aboutUsTitle" label="Título">
        <Input name="aboutUsTitle" placeholder="Ex.: Sobre nossa paróquia" />
      </FormField>
      <FormField name="aboutUsText" label="Texto">
        <RichTextarea
          name="aboutUsText"
          placeholder="Conte a história da instituição..."
        />
      </FormField>
      <FileUploadField
        name="aboutUsImage"
        label="Imagem do bloco"
        optional
        hint="Dimensão recomendada: 800x600px."
      />
    </SectionCard>
  );
}

export { AboutUsSection };
