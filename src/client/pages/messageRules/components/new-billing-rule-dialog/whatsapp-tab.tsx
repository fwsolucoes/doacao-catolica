import { useEffect, useRef, useState } from "react";
import { RichTextarea } from "~/client/components/campaignSettings/richTextarea";
import type { RichTextareaRef } from "~/client/components/campaignSettings/richTextarea";
import { FormField } from "~/client/components/ui/form-field";
import { Select } from "~/client/components/ui/select";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { VariablePopover } from "../variable-popover";
import { WHATSAPP_DEFAULT } from "../../constants";

type WhatsappTemplateJson = {
  uuid: string;
  templateName: string;
  templateType: string;
  notificationType: string;
  templatePreviewText: string;
};

export type { WhatsappTemplateJson };

function WhatsAppTab({
  defaultMessage,
  messageType = "",
  templates = [],
  isLoadingTemplates = false,
}: {
  defaultMessage?: string | null;
  messageType?: string;
  templates?: WhatsappTemplateJson[];
  isLoadingTemplates?: boolean;
}) {
  const [selectedTemplateUuid, setSelectedTemplateUuid] = useState("");

  useEffect(() => {
    setSelectedTemplateUuid("");
  }, [messageType]);

  const selectedTemplate =
    selectedTemplateUuid
      ? (templates.find((t) => t.uuid === selectedTemplateUuid) ?? null)
      : null;

  const hasTemplates = templates.length > 0;
  const useTemplate = selectedTemplate !== null;

  const initial = defaultMessage ?? WHATSAPP_DEFAULT;
  const [htmlContent, setHtmlContent] = useState(initial);
  const richRef = useRef<RichTextareaRef>(null);

  function insertVariable(variable: string) {
    richRef.current?.insertAtCursor(variable);
  }

  const hasContent = htmlContent.replace(/<[^>]*>/g, "").trim().length > 0;
  const enableWhatsapp = useTemplate || hasContent;

  return (
    <>
      <input
        type="hidden"
        name="enableWhatsapp"
        value={enableWhatsapp ? "true" : "false"}
      />

      <div className="mb-5 flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-foreground">Template Aprovado</p>

        {!messageType || (!isLoadingTemplates && !hasTemplates) ? (
          <p className="text-xs text-muted-foreground">
            {!messageType
              ? "Selecione um tipo de mensagem para ver os templates disponíveis."
              : "Nenhum template configurado para este tipo de mensagem."}
          </p>
        ) : (
          <Select.Root
            value={selectedTemplateUuid}
            onValueChange={setSelectedTemplateUuid}
            disabled={isLoadingTemplates}
          >
            <Select.Trigger>
              <Select.Value
                placeholder={isLoadingTemplates ? "Carregando templates..." : "Selecione um template"}
              />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="">Escrever manualmente</Select.Item>
              {templates.map((t) => (
                <Select.Item key={t.uuid} value={t.uuid}>
                  {t.templateName}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        )}
      </div>

      <div className="grid grid-cols-5 gap-7">
        <div className="col-span-3 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-foreground">Inserir variável</p>
            <VariablePopover onInsert={insertVariable} />
          </div>

          {useTemplate ? (
            <input
              type="hidden"
              name="whatsappMessage"
              value={selectedTemplate!.templatePreviewText}
            />
          ) : (
            <FormField name="whatsappMessage" label="Mensagem WhatsApp">
              <RichTextarea
                ref={richRef}
                name="whatsappMessage"
                defaultValue={initial}
                onChange={setHtmlContent}
                formats={["bold"]}
              />
            </FormField>
          )}
        </div>

        <div className="col-span-2 flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-foreground">Prévia</p>
            <p className="text-xs text-muted-foreground">
              Variáveis serão preenchidas no envio
            </p>
          </div>
          <div className="overflow-clip rounded-2xl border border-border">
            <div className="flex items-center gap-2.5 bg-[#007a55] px-5 py-3">
              <WhatsAppIcon size={16} className="text-white" />
              <span className="text-sm font-semibold text-white">Empresa Demo</span>
            </div>
            <div className="bg-[#ecfdf5] p-5">
              {useTemplate ? (
                <p className="whitespace-pre-wrap text-sm text-[#002c22]">
                  {selectedTemplate!.templatePreviewText}
                </p>
              ) : (
                <p
                  className="whitespace-pre-wrap text-sm text-[#002c22]"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { WhatsAppTab };
