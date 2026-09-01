import { useLoaderData, useFetcher } from "react-router";
import { useActionToast } from "~/client/hooks/useActionToast";
import { NOTIFICATION_TYPES } from "~/client/constants/notificationTypes";
import { Button } from "~/client/components/ui/button";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { ImageUploadCompact } from "~/client/components/ui/image-upload-compact";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Separator } from "~/client/components/ui/separator";
import { Textarea } from "~/client/components/ui/textarea";
import type { MetaTemplateEditLoader } from "~/client/types/metaTemplateEditLoader";
import { SectionCard } from "./SectionCard";

function GeneralCard() {
  const { template } = useLoaderData<MetaTemplateEditLoader>();
  const fetcher = useFetcher();

  useActionToast(fetcher.data);

  return (
    <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
      <fetcher.Form method="post">
        <SectionCard
          title="Geral"
          description="Identificação do template e quando ele é disparado."
        >
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-5">
              <FormField name="template_name" label="Nome do template" required>
                <Input
                  name="template_name"
                  defaultValue={template.templateName}
                  placeholder="lembrete_vencimento_pix"
                />
                <p className="text-xs text-muted-foreground">
                  Nome exatamente como aprovado na Meta
                </p>
              </FormField>

              <FormField name="template_language" label="Idioma" required>
                <Select.Root name="template_language" defaultValue={template.templateLanguage}>
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="pt_BR">Português (pt_BR)</Select.Item>
                    <Select.Item value="es">Espanhol (es)</Select.Item>
                    <Select.Item value="en_US">Inglês (en_US)</Select.Item>
                  </Select.Content>
                </Select.Root>
              </FormField>

              <FormField name="template_type" label="Categoria" required>
                <Select.Root name="template_type" defaultValue={template.templateType}>
                  <Select.Trigger>
                    <Select.Value placeholder="Selecione uma categoria" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="utility">Utility — transacional</Select.Item>
                    <Select.Item value="marketing">Marketing — promocional</Select.Item>
                  </Select.Content>
                </Select.Root>
                <p className="text-xs text-muted-foreground">Define o custo da mensagem na Meta</p>
              </FormField>

              <FormField name="notification_type" label="Tipo de notificação" required>
                <Select.Root name="notification_type" defaultValue={template.notificationType}>
                  <Select.Trigger>
                    <Select.Value placeholder="Selecione o tipo" />
                  </Select.Trigger>
                  <Select.Content>
                    {Object.entries(NOTIFICATION_TYPES).map(([value, label]) => (
                      <Select.Item key={value} value={value}>
                        {label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <p className="text-xs text-muted-foreground">Quando o disparo acontece</p>
              </FormField>
            </div>

            <FormField name="template_preview_text" label="Texto de preview" required>
              <Textarea
                name="template_preview_text"
                defaultValue={template.templatePreviewText}
                placeholder={`Olá {{1}}, sua contribuição de {{2}} vence em {{3}}.`}
                className="min-h-24"
              />
              <p className="text-xs text-muted-foreground">
                Reproduza o corpo do template aprovado, na mesma ordem dos parâmetros.
              </p>
            </FormField>

            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-foreground">
                Imagem de preview{" "}
                <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
              </p>
              <ImageUploadCompact
                name="template_preview_image"
                defaultValue={template.templatePreviewImage}
                description="Imagem ilustrativa exibida na listagem do template."
              />
            </div>

            <Separator />
            <div className="flex justify-end">
              <Button
                type="submit"
                name="_action"
                value="save_general"
                disabled={fetcher.state !== "idle"}
              >
                {fetcher.state !== "idle" ? "Salvando..." : "Salvar geral"}
              </Button>
            </div>
          </div>
        </SectionCard>
      </fetcher.Form>
    </FormErrorProvider>
  );
}

export { GeneralCard };
