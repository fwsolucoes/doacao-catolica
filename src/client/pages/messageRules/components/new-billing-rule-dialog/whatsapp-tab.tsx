import { useRef, useState } from "react";
import { RichTextarea } from "~/client/components/campaignSettings/richTextarea";
import type { RichTextareaRef } from "~/client/components/campaignSettings/richTextarea";
import { FormField } from "~/client/components/ui/form-field";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { VariablePopover } from "../variable-popover";
import { WHATSAPP_DEFAULT } from "../../constants";

function WhatsAppTab({ defaultMessage }: { defaultMessage?: string }) {
  const initial = defaultMessage ?? WHATSAPP_DEFAULT;
  const [htmlContent, setHtmlContent] = useState(initial);
  const richRef = useRef<RichTextareaRef>(null);

  function insertVariable(variable: string) {
    richRef.current?.insertAtCursor(variable);
  }

  const hasContent = htmlContent.replace(/<[^>]*>/g, "").trim().length > 0;

  return (
    <>
      <input
        type="hidden"
        name="enableWhatsapp"
        value={hasContent ? "true" : "false"}
      />
      <div className="grid grid-cols-5 gap-7">
        <div className="col-span-3 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-foreground">Inserir variável</p>
            <VariablePopover onInsert={insertVariable} />
          </div>
          <FormField name="whatsappMessage" label="Mensagem WhatsApp">
            <RichTextarea
              ref={richRef}
              name="whatsappMessage"
              defaultValue={initial}
              onChange={setHtmlContent}
              formats={["bold"]}
            />
          </FormField>
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
              <p
                className="text-sm text-[#002c22] whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { WhatsAppTab };
