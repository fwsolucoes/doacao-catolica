import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  MousePointerClick,
  Plus,
  X,
  Workflow,
} from "lucide-react";
import { Link, useNavigate, useParams, useFetcher } from "react-router";
import { useActionToast } from "~/client/hooks/useActionToast";
import { NOTIFICATION_TYPES } from "~/client/constants/notificationTypes";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { FileUploadCompact } from "~/client/components/ui/file-upload-compact";
import { ImageUploadCompact } from "~/client/components/ui/image-upload-compact";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Textarea } from "~/client/components/ui/textarea";

type VariableItem = {
  id: string;
  varType: "dynamic" | "fixed";
  systemField: string;
  fixedValue: string;
  description: string;
};

type ButtonItem = {
  subType: string;
  value: string;
};

const SYSTEM_FIELDS = [
  { value: "customers.name", label: "Nome do doador" },
  { value: "customers.email", label: "E-mail do doador" },
  { value: "customers.phone", label: "Telefone do doador" },
  { value: "payments.amount", label: "Valor do pagamento" },
  { value: "payments.due_date", label: "Vencimento do pagamento" },
  { value: "payments.gross_value", label: "Valor bruto do pagamento" },
  { value: "subscriptions.start_date", label: "Data de início da assinatura" },
  { value: "accounts.name", label: "Nome da organização" },
];

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

function NewMetaTemplatePage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const backPath = `/campaign/${campaignId}/meta-templates`;
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  const [headerType, setHeaderType] = useState("none");
  const [variables, setVariables] = useState<VariableItem[]>([]);
  const [button, setButton] = useState<ButtonItem | null>(null);

  useActionToast(fetcher.data);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast?.type === "success") {
      navigate(backPath);
    }
  }, [fetcher.state, fetcher.data, backPath, navigate]);

  function addVariable() {
    setVariables((prev) => [
      ...prev,
      { id: crypto.randomUUID(), varType: "dynamic", systemField: "", fixedValue: "", description: "" },
    ]);
  }

  function removeVariable(id: string) {
    setVariables((prev) => prev.filter((v) => v.id !== id));
  }

  function updateVariable(id: string, patch: Partial<VariableItem>) {
    setVariables((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  }

  function addButton() {
    setButton({ subType: "quick_reply", value: "" });
  }

  function removeButton() {
    setButton(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fetcher.submit(new FormData(e.currentTarget), { method: "post", encType: "application/json" });
  }

  return (
    <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="header_type" value={headerType} />
      <input type="hidden" name="variables" value={JSON.stringify(variables)} />
      <input type="hidden" name="button" value={JSON.stringify(button)} />
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
            Novo template META
          </h1>
          <p className="text-base text-muted-foreground">
            Configure o template aprovado na Meta, o cabeçalho, as variáveis e o botão.
          </p>
        </div>
      </div>

      {/* Geral */}
      <SectionCard
        title="Geral"
        description="Identificação do template e quando ele é disparado."
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <FormField name="template_name" label="Nome do template" required>
              <Input
                name="template_name"
                placeholder="lembrete_vencimento_pix"
              />
              <p className="text-xs text-muted-foreground">
                Nome exatamente como aprovado na Meta
              </p>
            </FormField>

            <FormField name="template_language" label="Idioma" required>
              <Select.Root name="template_language" defaultValue="pt_BR">
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
              <Select.Root name="template_type">
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
              <Select.Root name="notification_type">
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
              description="Imagem ilustrativa exibida na listagem do template."
            />
          </div>
        </div>
      </SectionCard>

      {/* Cabeçalho */}
      <SectionCard
        title="Cabeçalho"
        description="Conteúdo exibido acima da mensagem."
      >
        <div className="flex flex-col gap-5">
          <FormField name="header_type" label="Tipo do cabeçalho">
            <Select.Root
              value={headerType}
              onValueChange={setHeaderType}
            >
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
              <Input name="header_text" placeholder="Ex: Lembrete de pagamento" />
            </FormField>
          )}

          {headerType === "image" && (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-foreground">Imagem do cabeçalho</p>
              <ImageUploadCompact
                name="header_image"
                description="Imagem exibida no cabeçalho da mensagem WhatsApp."
              />
            </div>
          )}

          {headerType === "video" && (
            <FormField name="header_link" label="URL do vídeo" required>
              <Input name="header_link" placeholder="https://exemplo.com/video.mp4" />
              <p className="text-xs text-muted-foreground">
                Link público para o vídeo do cabeçalho
              </p>
            </FormField>
          )}

          {headerType === "document" && (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-foreground">Documento do cabeçalho</p>
              <FileUploadCompact
                name="header_document"
                description="PDF, Word, Excel, PowerPoint, TXT ou CSV."
              />
            </div>
          )}

        </div>
      </SectionCard>

      {/* Variáveis */}
      <SectionCard
        title="Variáveis"
        description="Na ordem em que aparecem no texto do template. Podem ser um valor fixo ou um dado do sistema."
      >
        <div className="flex flex-col gap-4">
          {variables.map((variable, index) => (
            <div
              key={variable.id}
              className="flex flex-col gap-4 rounded-2xl border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-muted-foreground">
                  {`{{${index + 1}}}`}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground"
                  onClick={() => removeVariable(variable.id)}
                >
                  <X size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField name={`var_type_${index}`} label="Tipo da variável" required>
                  <Select.Root
                    value={variable.varType}
                    onValueChange={(v) =>
                      updateVariable(variable.id, { varType: v as "dynamic" | "fixed" })
                    }
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="dynamic">Dinâmica</Select.Item>
                      <Select.Item value="fixed">Fixa</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </FormField>

                {variable.varType === "dynamic" ? (
                  <FormField name={`var_field_${index}`} label="Dado do sistema" required>
                    <Select.Root
                      value={variable.systemField}
                      onValueChange={(v) =>
                        updateVariable(variable.id, { systemField: v })
                      }
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Selecione a variável" />
                      </Select.Trigger>
                      <Select.Content>
                        {SYSTEM_FIELDS.map((f) => (
                          <Select.Item key={f.value} value={f.value}>
                            {f.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </FormField>
                ) : (
                  <FormField name={`var_value_${index}`} label="Valor fixo" required>
                    <Input
                      placeholder="Ex: Doação Católica"
                      value={variable.fixedValue}
                      onChange={(e) =>
                        updateVariable(variable.id, { fixedValue: e.target.value })
                      }
                    />
                  </FormField>
                )}
              </div>

              <FormField name={`var_desc_${index}`} label="Descrição">
                <Input
                  placeholder="Ex: Nome do doador"
                  value={variable.description}
                  onChange={(e) =>
                    updateVariable(variable.id, { description: e.target.value })
                  }
                />
              </FormField>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-fit gap-2"
            onClick={addVariable}
          >
            <Plus size={16} />
            Adicionar variável
          </Button>
        </div>
      </SectionCard>

      {/* Botão */}
      <SectionCard
        title="Botão"
        description="O template pode ter no máximo um botão, conforme aprovado na Meta."
      >
        {button ? (
          <div className="flex flex-col gap-4">
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
                  onClick={removeButton}
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
                    placeholder={button.subType === "url" ? "https://exemplo.com" : "Ex: Doar Agora"}
                    value={button.value}
                    onChange={(e) => setButton({ ...button, value: e.target.value })}
                  />
                </FormField>
              </div>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-fit gap-2"
            onClick={addButton}
          >
            <Plus size={16} />
            Adicionar botão
          </Button>
        )}
      </SectionCard>

      {/* Sticky footer */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 z-10 flex items-center justify-end gap-3 border-t border-border bg-muted px-7 py-4">
        <Button variant="outline" asChild>
          <Link to={backPath}>Cancelar</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar template"}
        </Button>
      </div>
    </div>
    </form>
    </FormErrorProvider>
  );
}

export { NewMetaTemplatePage };
