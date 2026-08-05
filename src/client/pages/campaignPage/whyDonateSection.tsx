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

function WhyDonateSection() {
  const { preferences } = useLoaderData<CampaignPageLoader>();
  const [enabled, setEnabled] = useState(preferences.whyDonateEnabled ?? true);

  return (
    <SectionCard
      title="Por que doar"
      description="Bloco que explica o propósito da campanha."
      action={
        <>
          <input type="hidden" name="whyDonateEnabled" value={enabled ? "true" : "false"} />
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </>
      }
    >
      <div className={cn("flex flex-col gap-5", !enabled && "pointer-events-none opacity-50")}>
        <FormField name="whyDonateTitle" label="Título">
          <Input
            name="whyDonateTitle"
            placeholder="Ex.: Por que sua doação importa"
            defaultValue={preferences.whyDonateTitle ?? ""}
          />
        </FormField>
        <FormField name="whyDonateText" label="Texto">
          <RichTextarea
            name="whyDonateText"
            placeholder="Explique o impacto da doação..."
            defaultValue={preferences.whyDonateText ?? ""}
          />
        </FormField>
        <FormField name="whyDonateImage" label="Imagem do bloco">
          <ImageUpload
            name="whyDonateImage"
            defaultValue={preferences.whyDonateImage}
            width={800}
            height={600}
          />
          <p className="text-xs text-muted-foreground">Dimensão recomendada: 800x600px.</p>
        </FormField>
      </div>
    </SectionCard>
  );
}

export { WhyDonateSection };
