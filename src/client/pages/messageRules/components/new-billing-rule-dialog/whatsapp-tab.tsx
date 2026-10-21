import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { RichTextarea } from "~/client/components/campaignSettings/richTextarea";
import type { RichTextareaRef } from "~/client/components/campaignSettings/richTextarea";
import { FormField } from "~/client/components/ui/form-field";
import { Select } from "~/client/components/ui/select";
import { Switch } from "~/client/components/ui/switch";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { cn } from "~/lib/utils";
import type { MessageRulesLoader } from "~/client/types/messageRulesLoader";
import { VariablePopover } from "../variable-popover";
import {
  BILLING_RULE_TYPES,
  QRCODE_TEMPLATE_VARIABLES,
  WHATSAPP_DEFAULT,
} from "../../constants";

type WhatsappTemplateJson = {
  uuid: string;
  templateName: string;
  templateType: string;
  notificationType: string;
  templatePreviewText: string;
  templatePreviewImage: string | null;
};

export type { WhatsappTemplateJson };

function WhatsAppTab({
  uuid,
  defaultMessage,
  defaultEnabled = true,
  messageType = "",
  templates = [],
  isLoadingTemplates = false,
}: {
  uuid?: string;
  defaultMessage?: string | null;
  defaultEnabled?: boolean;
  messageType?: string;
  templates?: WhatsappTemplateJson[];
  isLoadingTemplates?: boolean;
}) {
  const { whatsappSettings, notificationSettings } =
    useLoaderData<MessageRulesLoader>();
  const defaultTemplateUuid = notificationSettings.find(
    (s) => s.uuid === uuid,
  )?.accountWhatsappTemplateUuid;

  const isOfficialMetaOwnNumber =
    whatsappSettings?.type === "custom" &&
    whatsappSettings?.hasToken === true &&
    whatsappSettings?.provider === "aini";
  const isOfficialDoacaoCatolica = whatsappSettings?.type !== "custom";
  const isOwnNumberQrcode =
    whatsappSettings?.type === "custom" &&
    whatsappSettings?.hasToken === true &&
    whatsappSettings?.provider === "unofficial_whaticket";

  const hideFreeformMessage =
    isOfficialMetaOwnNumber || isOfficialDoacaoCatolica;
  const hidePreview = isOfficialMetaOwnNumber;
  const hideTemplateSelect = isOwnNumberQrcode;
  const isAccountOwnedTemplate = !isOfficialDoacaoCatolica;

  const [selectedTemplateUuid, setSelectedTemplateUuid] = useState(
    defaultTemplateUuid ?? "",
  );

  const previousMessageType = useRef(messageType);
  useEffect(() => {
    if (previousMessageType.current === messageType) return;
    previousMessageType.current = messageType;
    setSelectedTemplateUuid("");
  }, [messageType]);

  const selectedTemplate = selectedTemplateUuid
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

  const [enabled, setEnabled] = useState(defaultEnabled);

  const variables = hideTemplateSelect
    ? QRCODE_TEMPLATE_VARIABLES.filter(
        (v) =>
          v.value !== "{{link_payment}}" || BILLING_RULE_TYPES.has(messageType),
      )
    : undefined;

  return (
    <>
      <input
        type="hidden"
        name="enableWhatsapp"
        value={enabled ? "true" : "false"}
      />

      <div className="mb-5 flex w-full max-w-80 items-center justify-between gap-4 rounded-xl border border-border bg-muted px-4 py-2.5">
        <span className="text-sm font-semibold text-foreground">
          Habilitar envio por WhatsApp
        </span>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      <div className={cn(!enabled && "pointer-events-none opacity-50")}>
        {!hideTemplateSelect && (
          <div className="mb-5 flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-foreground">
              Template Aprovado
            </p>

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
                disabled={isLoadingTemplates || !enabled}
              >
                <Select.Trigger>
                  <Select.Value
                    placeholder={
                      isLoadingTemplates
                        ? "Carregando templates..."
                        : "Selecione um template"
                    }
                  >
                    {selectedTemplate && `${selectedTemplate.templateName}`}
                  </Select.Value>
                </Select.Trigger>
                <Select.Content>
                  {templates.map((t) => (
                    <Select.Item key={t.uuid} value={t.uuid}>
                      {t.templateName}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            )}
          </div>
        )}

        {useTemplate && isAccountOwnedTemplate && (
          <input
            type="hidden"
            name="accountWhatsappTemplateUuid"
            value={selectedTemplate!.uuid}
          />
        )}

        {hideFreeformMessage && useTemplate && (
          <input
            type="hidden"
            name="whatsappMessage"
            value={selectedTemplate!.templatePreviewText}
          />
        )}

        {(!hideFreeformMessage || !hidePreview) && (
          <div className="grid grid-cols-5 gap-7">
            {!hideFreeformMessage && (
              <div className="col-span-3 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-semibold text-foreground">
                    Inserir variável
                  </p>
                  <VariablePopover
                    onInsert={insertVariable}
                    variables={variables}
                    disabled={!enabled}
                  />
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
            )}

            {!hidePreview && (
              <div className="col-span-2 flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-foreground">
                    Prévia
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Variáveis serão preenchidas no envio
                  </p>
                </div>
                <div className="overflow-clip rounded-2xl border border-border">
                  <div className="flex items-center gap-2.5 bg-[#007a55] px-5 py-3">
                    <WhatsAppIcon size={16} className="text-white" />
                    <span className="text-sm font-semibold text-white">
                      Empresa Demo
                    </span>
                  </div>
                  <div className="bg-[#ecfdf5] p-5">
                    {useTemplate && selectedTemplate!.templatePreviewImage ? (
                      <img
                        src={selectedTemplate!.templatePreviewImage}
                        alt={selectedTemplate!.templateName}
                        className="mx-auto max-w-80 rounded-lg"
                      />
                    ) : useTemplate ? (
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
            )}
          </div>
        )}
      </div>
    </>
  );
}

export { WhatsAppTab };
