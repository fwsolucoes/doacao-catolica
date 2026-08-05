import { useState } from "react";
import { useLoaderData } from "react-router";
import { RichTextarea } from "~/client/components/campaignSettings/richTextarea";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { ImageUpload } from "~/client/components/ui/image-upload";
import { Input } from "~/client/components/ui/input";
import { Switch } from "~/client/components/ui/switch";
import type { CampaignPageLoader } from "~/client/types/campaignPageLoader";
import { cn } from "~/lib/utils";

function AboutUsSection() {
  const { preferences } = useLoaderData<CampaignPageLoader>();
  const [enabled, setEnabled] = useState(preferences.aboutUsEnabled ?? true);

  return (
    <SectionCard
      title="Sobre nós"
      description="Apresente a instituição responsável pela campanha."
      action={
        <>
          <input type="hidden" name="aboutUsEnabled" value={enabled ? "true" : "false"} />
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </>
      }
    >
      <div className={cn(!enabled && "pointer-events-none opacity-50")}>
        <FormField name="aboutTitle" label="Título">
          <Input
            name="aboutTitle"
            placeholder="Ex.: Sobre nossa paróquia"
            defaultValue={preferences.aboutUsTitle ?? ""}
          />
        </FormField>
        <FormField name="aboutText" label="Texto">
          <RichTextarea
            name="aboutText"
            placeholder="Conte a história da instituição..."
            defaultValue={preferences.aboutUsText ?? ""}
          />
        </FormField>
        <FormField name="aboutImage" label="Imagem do bloco">
          <ImageUpload
            name="aboutImage"
            defaultValue={preferences.aboutUsImage}
            width={800}
            height={600}
          />
          <p className="text-xs text-muted-foreground">Dimensão recomendada: 800x600px.</p>
        </FormField>
      </div>
    </SectionCard>
  );
}

export { AboutUsSection };
