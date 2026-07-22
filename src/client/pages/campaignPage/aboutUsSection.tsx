import { useLoaderData } from "react-router";
import { RichTextarea } from "~/client/components/campaignSettings/richTextarea";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { ImageUpload } from "~/client/components/ui/image-upload";
import { Input } from "~/client/components/ui/input";
import type { CampaignPageLoader } from "~/client/types/campaignPageLoader";

function AboutUsSection() {
  const { preferences } = useLoaderData<CampaignPageLoader>();

  return (
    <SectionCard
      title="Sobre nós"
      description="Apresente a instituição responsável pela campanha."
    >
      <FormField name="aboutUsTitle" label="Título">
        <Input
          name="aboutUsTitle"
          placeholder="Ex.: Sobre nossa paróquia"
          defaultValue={preferences.aboutUsTitle ?? ""}
        />
      </FormField>
      <FormField name="aboutUsText" label="Texto">
        <RichTextarea
          name="aboutUsText"
          placeholder="Conte a história da instituição..."
          defaultValue={preferences.aboutUsText ?? ""}
        />
      </FormField>
      <FormField name="aboutUsImage" label="Imagem do bloco">
        <ImageUpload
          name="aboutUsImage"
          defaultValue={preferences.aboutUsImage}
          width={800}
          height={600}
        />
        <p className="text-xs text-muted-foreground">Dimensão recomendada: 800x600px.</p>
      </FormField>
    </SectionCard>
  );
}

export { AboutUsSection };
