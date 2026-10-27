import { useState } from "react";
import { RichTextarea } from "~/client/components/campaignSettings/richTextarea";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { ImageUploadCompact } from "~/client/components/ui/image-upload-compact";
import { Input } from "~/client/components/ui/input";
import { Switch } from "~/client/components/ui/switch";
import { cn } from "~/lib/utils";

function AboutUsSection() {
  const [enabled, setEnabled] = useState(false);

  return (
    <SectionCard
      title="Sobre nós"
      description="Apresente a instituição responsável pela campanha."
      action={
        <Switch name="aboutUsEnabled" value="true" checked={enabled} onCheckedChange={setEnabled} />
      }
    >
      <div className={cn("flex flex-col gap-5", !enabled && "pointer-events-none opacity-50")}>
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
      </div>
    </SectionCard>
  );
}

export { AboutUsSection };
