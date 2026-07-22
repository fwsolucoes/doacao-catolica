import { Play } from "lucide-react";
import { useLoaderData } from "react-router";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { ImageUploadCompact } from "~/client/components/ui/image-upload-compact";
import { InputGroup } from "~/client/components/ui/input-group";
import type { CampaignPageLoader } from "~/client/types/campaignPageLoader";

function MediasSection() {
  const { campaign } = useLoaderData<CampaignPageLoader>();

  return (
    <SectionCard
      title="Mídias"
      description="Imagens e vídeo exibidos no topo e no cabeçalho de cadastro."
    >
      <FormField name="image" label="Imagem desktop">
        <ImageUploadCompact
          name="image"
          defaultValue={campaign.image}
          width={1400}
          height={433}
          description="Dimensão recomendada: 1400×433px."
        />
      </FormField>
      <FormField name="imageMobile" label="Imagem mobile">
        <ImageUploadCompact
          name="imageMobile"
          defaultValue={campaign.imageMobile}
          width={400}
          height={300}
          description="Dimensão recomendada: 400×300px."
        />
      </FormField>
      <FormField name="videoUrl" label="Vídeo destaque">
        <InputGroup.Root>
          <InputGroup.Addon>
            <Play size={16} />
          </InputGroup.Addon>
          <InputGroup.Input
            name="videoUrl"
            placeholder="https://www.youtube.com/watch?v=..."
            defaultValue={campaign.videoUrl ?? ""}
          />
        </InputGroup.Root>
        <p className="mt-1 text-xs text-muted-foreground">
          Cole a URL do YouTube para exibir o vídeo destaque.
        </p>
      </FormField>
      <FormField
        name="headerImage"
        label="Imagem cabeçalho da tela de cadastro"
      >
        <ImageUploadCompact
          name="headerImage"
          defaultValue={campaign.headerImage}
        />
      </FormField>
    </SectionCard>
  );
}

export { MediasSection };
