import { Play } from "lucide-react";
import { useLoaderData } from "react-router";
import { FileUploadField } from "~/client/components/campaignSettings/fileUploadField";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { InputGroup } from "~/client/components/ui/input-group";
import type { CampaignPageLoader } from "~/client/types/campaignPageLoader";

function MediasSection() {
  const { campaign } = useLoaderData<CampaignPageLoader>();

  return (
    <SectionCard
      title="Mídias"
      description="Imagens e vídeo exibidos no topo e no cabeçalho de cadastro."
    >
      <FileUploadField
        name="image"
        label="Imagem desktop"
        hint="Dimensão recomendada: 1400x433px."
        currentValue={campaign.image}
      />
      <FileUploadField
        name="imageMobile"
        label="Imagem mobile"
        optional
        hint="Dimensão recomendada: 400x300px."
        currentValue={campaign.imageMobile}
      />
      <FormField name="videoUrl" label="Vídeo destaque">
        <InputGroup.Root>
          <InputGroup.Addon>
            <Play size={16} />
          </InputGroup.Addon>
          <InputGroup.Input
            name="videoUrl"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </InputGroup.Root>
        <p className="mt-1 text-xs text-muted-foreground">
          Cole a URL do YouTube para exibir o vídeo destaque.
        </p>
      </FormField>
      <FileUploadField
        name="headerImage"
        label="Imagem cabeçalho da tela de cadastro"
        optional
      />
    </SectionCard>
  );
}

export { MediasSection };
