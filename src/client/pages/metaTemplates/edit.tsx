import { useState } from "react";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  MousePointerClick,
  Pencil,
  Plus,
  Workflow,
  X,
} from "lucide-react";
import { Link, useLoaderData, useParams, useFetcher } from "react-router";
import { useActionToast } from "~/client/hooks/useActionToast";
import { NOTIFICATION_TYPES } from "~/client/constants/notificationTypes";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { ImageUploadCompact } from "~/client/components/ui/image-upload-compact";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Separator } from "~/client/components/ui/separator";
import { Textarea } from "~/client/components/ui/textarea";
import type { MetaTemplateEditLoader } from "~/client/types/metaTemplateEditLoader";

const SYSTEM_FIELDS: Record<string, string> = {
  "customers.name": "Nome do doador",
  "customers.email": "E-mail do doador",
  "customers.phone": "Telefone do doador",
  "payments.amount": "Valor do pagamento",
  "payments.due_date": "Vencimento do pagamento",
  "payments.gross_value": "Valor bruto do pagamento",
  "subscriptions.start_date": "Data de início da assinatura",
  "accounts.name": "Nome da organização",
};

const BUTTON_TYPES: Record<string, { label: string; icon: React.ElementType }> = {
  quick_reply: { label: "Resposta rápida", icon: MousePointerClick },
  url: { label: "URL", icon: ExternalLink },
  copy_code: { label: "Copiar código", icon: Copy },
  flow: { label: "Flow", icon: Workflow },
};

const HEADER_TYPES = [
  { value: "none", label: "Sem cabeçalho" },
  { value: "text", label: "Texto" },
  { value: "image", label: "Imagem" },
  { value: "video", label: "Vídeo" },
  { value: "document", label: "Documento" },
];

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card.Root className="gap-0 p-0">
      <div className="flex flex-col gap-1 p-7 pb-5">
        <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="p-7 pt-0">{children}</div>
    </Card.Root>
  );
}

function EditMetaTemplatePage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { template } = useLoaderData<MetaTemplateEditLoader>();
  const backPath = `/campaign/${campaignId}/meta-templates`;

  const generalFetcher = useFetcher();
  const headerFetcher = useFetcher();
  const buttonFetcher = useFetcher();

  const [headerType, setHeaderType] = useState(template.headerType ?? "none");
  const [button, setButton] = useState(
    template.button ? { subType: template.button.subType, value: template.button.value } : null,
  );

  useActionToast(generalFetcher.data);
  useActionToast(headerFetcher.data);
  useActionToast(buttonFetcher.data);

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="outline" size="icon" className="mt-1 shrink-0" asChild>
          <Link to={backPath}>
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Editar template
          </h1>
          <p className="text-base text-muted-foreground">
            Configure o template aprovado na Meta, o cabeçalho, as variáveis e o botão.
          </p>
        </div>
      </div>

      {/* Geral */}
      <FormErrorProvider fieldErrors={generalFetcher.data?.cause?.fieldErrors}>
        <generalFetcher.Form method="post">
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
                  <p className="text-xs text-muted-foreground">
                    Define o custo da mensagem na Meta
                  </p>
                </FormField>

                <FormField name="notification_type" label="Tipo de notificação" required>
                  <Select.Root
                    name="notification_type"
                    defaultValue={template.notificationType}
                  >
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
                  disabled={generalFetcher.state !== "idle"}
                >
                  {generalFetcher.state !== "idle" ? "Salvando..." : "Salvar geral"}
                </Button>
              </div>
            </div>
          </SectionCard>
        </generalFetcher.Form>
      </FormErrorProvider>

      {/* Cabeçalho */}
      <FormErrorProvider fieldErrors={headerFetcher.data?.cause?.fieldErrors}>
        <headerFetcher.Form method="post">
          <input type="hidden" name="header_type" value={headerType} />
          <SectionCard title="Cabeçalho" description="Conteúdo exibido acima da mensagem.">
            <div className="flex flex-col gap-5">
              <FormField name="header_type" label="Tipo do cabeçalho">
                <Select.Root value={headerType} onValueChange={setHeaderType}>
                  <Select.Trigger className="w-72">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {HEADER_TYPES.map((t) => (
                      <Select.Item key={t.value} value={t.value}>
                        {t.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </FormField>

              {headerType === "text" && (
                <FormField name="header_text" label="Texto do cabeçalho" required>
                  <Input
                    name="header_text"
                    defaultValue={template.headerText}
                    placeholder="Ex: Lembrete de pagamento"
                  />
                  <p className="text-xs text-muted-foreground">
                    Texto fixo — não são aceitas variáveis no cabeçalho de texto.
                  </p>
                </FormField>
              )}

              {headerType === "image" && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-semibold text-foreground">Imagem do cabeçalho</p>
                  <ImageUploadCompact
                    name="header_image"
                    defaultValue={template.headerType === "image" ? template.headerLink : ""}
                    description="Imagem exibida no cabeçalho da mensagem WhatsApp."
                  />
                </div>
              )}

              {headerType === "video" && (
                <FormField name="header_link" label="URL do vídeo" required>
                  <Input
                    name="header_link"
                    defaultValue={template.headerType === "video" ? template.headerLink : ""}
                    placeholder="https://exemplo.com/video.mp4"
                  />
                  <p className="text-xs text-muted-foreground">
                    Link público para o vídeo do cabeçalho
                  </p>
                </FormField>
              )}

              {headerType === "document" && (
                <FormField name="header_link" label="Link do documento" required>
                  <Input
                    name="header_link"
                    defaultValue={template.headerType === "document" ? template.headerLink : ""}
                    placeholder="https://exemplo.com/documento.pdf"
                  />
                </FormField>
              )}

              <Separator />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  name="_action"
                  value="save_header"
                  disabled={headerFetcher.state !== "idle"}
                >
                  {headerFetcher.state !== "idle" ? "Salvando..." : "Salvar cabeçalho"}
                </Button>
              </div>
            </div>
          </SectionCard>
        </headerFetcher.Form>
      </FormErrorProvider>

      {/* Variáveis */}
      <SectionCard
        title="Variáveis"
        description="Na ordem em que aparecem no texto do template. Podem ser um valor fixo ou um dado do sistema."
      >
        <div className="flex flex-col gap-4">
          {template.variables.map((variable, index) => {
            const isDynamic = variable.varType === "dynamic";
            const displayName = isDynamic
              ? (SYSTEM_FIELDS[variable.systemField] ?? variable.name ?? variable.systemField)
              : (variable.name ?? variable.fixedValue);
            return (
              <div
                key={variable.uuid}
                className="flex items-center justify-between rounded-2xl border border-border px-4 py-3.5"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs text-muted-foreground">{`{{${index + 1}}}`}</span>
                    <Badge
                      className={
                        isDynamic
                          ? "bg-[#dbeafe] text-[#1447e6]"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {isDynamic ? "Dinâmica" : "Fixa"}
                    </Badge>
                    <span className="text-sm font-semibold text-foreground">{displayName}</span>
                  </div>
                  {variable.description && (
                    <span className="text-xs text-muted-foreground">{variable.description}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2"
                    disabled
                  >
                    <Pencil size={14} />
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 text-muted-foreground"
                    disabled
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            );
          })}

          <Button type="button" variant="outline" className="w-fit gap-2" disabled>
            <Plus size={16} />
            Adicionar variável
          </Button>
        </div>
      </SectionCard>

      {/* Botão */}
      <FormErrorProvider fieldErrors={buttonFetcher.data?.cause?.fieldErrors}>
        <buttonFetcher.Form method="post">
          <input type="hidden" name="button" value={JSON.stringify(button)} />
          <SectionCard
            title="Botão"
            description="O template pode ter no máximo um botão, conforme aprovado na Meta."
          >
            <div className="flex flex-col gap-4">
              {button ? (
                <div className="flex flex-col gap-4 rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    {(() => {
                      const info = BUTTON_TYPES[button.subType] ?? BUTTON_TYPES.quick_reply;
                      const Icon = info.icon;
                      return (
                        <div className="flex items-center gap-2">
                          <Icon size={15} className="text-muted-foreground" />
                          <span className="text-xs font-semibold text-muted-foreground">
                            {info.label}
                          </span>
                        </div>
                      );
                    })()}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground"
                      onClick={() => setButton(null)}
                    >
                      <X size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField name="button_sub_type" label="Tipo do botão">
                      <Select.Root
                        value={button.subType}
                        onValueChange={(v) => setButton({ ...button, subType: v })}
                      >
                        <Select.Trigger>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {Object.entries(BUTTON_TYPES).map(([value, { label }]) => (
                            <Select.Item key={value} value={value}>
                              {label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </FormField>

                    <FormField name="button_value" label="Valor">
                      <Input
                        name="button_value"
                        placeholder={
                          button.subType === "url" ? "https://exemplo.com" : "Ex: Doar Agora"
                        }
                        value={button.value}
                        onChange={(e) => setButton({ ...button, value: e.target.value })}
                      />
                    </FormField>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-fit gap-2"
                  onClick={() => setButton({ subType: "quick_reply", value: "" })}
                >
                  <Plus size={16} />
                  Adicionar botão
                </Button>
              )}

              <Separator />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  name="_action"
                  value="save_button"
                  disabled={buttonFetcher.state !== "idle"}
                >
                  {buttonFetcher.state !== "idle" ? "Salvando..." : "Salvar botão"}
                </Button>
              </div>
            </div>
          </SectionCard>
        </buttonFetcher.Form>
      </FormErrorProvider>
    </div>
  );
}

export { EditMetaTemplatePage };
