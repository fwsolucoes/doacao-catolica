import { useState } from "react";
import { RichTextarea } from "~/client/components/campaignSettings/richTextarea";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { ImageUploadCompact } from "~/client/components/ui/image-upload-compact";
import { Input } from "~/client/components/ui/input";
import { Switch } from "~/client/components/ui/switch";
import { cn } from "~/lib/utils";

function WhyDonateSection() {
  const [enabled, setEnabled] = useState(false);

  return (
    <SectionCard
      title="Por que doar"
      description="Bloco que explica o propósito da campanha."
      action={
        <Switch name="whyDonateEnabled" value="true" checked={enabled} onCheckedChange={setEnabled} />
      }
    >
      <div className={cn("flex flex-col gap-5", !enabled && "pointer-events-none opacity-50")}>
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
      </div>
    </SectionCard>
  );
}

export { WhyDonateSection };
