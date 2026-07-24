import { useRef, useState } from "react";
import { FormField } from "~/client/components/ui/form-field";
import { Textarea } from "~/client/components/ui/textarea";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { VariablePopover } from "../variable-popover";
import { WHATSAPP_DEFAULT } from "../../constants";

function WhatsAppTab() {
  const [message, setMessage] = useState(WHATSAPP_DEFAULT);
  const cursorRef = useRef(WHATSAPP_DEFAULT.length);

  function insertVariable(variable: string) {
    const pos = cursorRef.current;
    setMessage((prev) => prev.slice(0, pos) + variable + prev.slice(pos));
    cursorRef.current = pos + variable.length;
  }

  return (
    <>
      <input
        type="hidden"
        name="enableWhatsapp"
        value={message.trim() ? "true" : "false"}
      />
      <div className="grid grid-cols-5 gap-7">
        <div className="col-span-3 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-foreground">Inserir variável</p>
            <VariablePopover onInsert={insertVariable} />
          </div>
          <FormField name="whatsappMessage" label="Mensagem WhatsApp">
            <Textarea
              name="whatsappMessage"
              className="min-h-40 font-mono text-xs"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                cursorRef.current = e.target.selectionStart;
              }}
              onSelect={(e) => {
                cursorRef.current = (e.target as HTMLTextAreaElement).selectionStart;
              }}
              onBlur={(e) => {
                cursorRef.current = e.target.selectionStart;
              }}
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
              <p className="whitespace-pre-wrap text-sm text-[#002c22]">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { WhatsAppTab };
