import { useParams } from "react-router";
import { Button } from "~/client/components/ui/button";
import { FormField } from "~/client/components/ui/form-field";
import { ImageUploadCompact } from "~/client/components/ui/image-upload-compact";
import { Input } from "~/client/components/ui/input";
import { Textarea } from "~/client/components/ui/textarea";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import {
  buildSteps,
  StepNav,
  StepTabBar,
} from "~/client/components/campaignSettings/stepNav";

function CampaignSeoSettingsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const steps = buildSteps(campaignId!);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie as configurações desta campanha.
        </p>
      </div>

      <StepTabBar steps={steps} />

      <div className="flex items-start gap-8">
        <StepNav steps={steps} />

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* Metadados básicos */}
          <SectionCard
            title="Metadados básicos"
            description="Título e descrição exibidos nos resultados de busca do Google."
          >
            <FormField name="metaTitle" label="Título da página (Meta Title)" required>
              <Input
                name="metaTitle"
                placeholder="Ex.: Educação para Todos · Doe agora"
              />
              <p className="text-xs text-muted-foreground">
                Recomendado: até 60 caracteres.
              </p>
            </FormField>

            <FormField name="metaDescription" label="Descrição (Meta Description)" required>
              <Textarea
                name="metaDescription"
                placeholder="Descreva sua campanha para os buscadores..."
                className="min-h-24"
              />
              <p className="text-xs text-muted-foreground">
                Recomendado: até 160 caracteres.
              </p>
            </FormField>

            <FormField name="keywords" label="Palavras-chave">
              <Input
                name="keywords"
                placeholder="doação, educação, ong, crianças"
              />
              <p className="text-xs text-muted-foreground">Separe por vírgulas.</p>
            </FormField>

            <FormField name="canonicalUrl" label="URL canônica">
              <Input
                name="canonicalUrl"
                type="url"
                placeholder="https://givehub.org/educacao-para-todos"
              />
            </FormField>
          </SectionCard>

          {/* Compartilhamento social */}
          <SectionCard
            title="Compartilhamento social"
            description="Como a campanha aparece quando o link é compartilhado no WhatsApp, Facebook e X."
          >
            <FormField name="ogTitle" label="Open Graph Title">
              <Input name="ogTitle" placeholder="Ex.: Educação para Todos" />
            </FormField>

            <FormField name="ogDescription" label="Open Graph Description">
              <Textarea
                name="ogDescription"
                placeholder="Junte-se a nós e transforme vidas por meio da educação."
                className="min-h-24"
              />
            </FormField>

            <div className="h-px bg-border" />

            <FormField name="ogImage" label="Imagem de compartilhamento (og:image)">
              <ImageUploadCompact
                name="ogImage"
                description="1200×630px em JPG ou PNG (máx. 2MB)."
              />
            </FormField>
          </SectionCard>

          {/* Indexação */}
          <SectionCard
            title="Indexação"
            description="Controle como buscadores tratam esta campanha."
          >
            <FormField name="robotsDirective" label="Diretiva robots">
              <Input name="robotsDirective" placeholder="index, follow" />
              <p className="text-xs text-muted-foreground">
                Use{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  noindex, nofollow
                </code>{" "}
                para ocultar dos buscadores.
              </p>
            </FormField>
          </SectionCard>

          <div className="flex justify-end">
            <Button type="button" disabled>
              Salvar alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CampaignSeoSettingsPage };
