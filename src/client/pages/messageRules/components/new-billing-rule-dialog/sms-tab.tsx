import { useRef, useState } from "react";
import { Smartphone } from "lucide-react";
import { FormField } from "~/client/components/ui/form-field";
import { Textarea } from "~/client/components/ui/textarea";
import { VariablePopover } from "../variable-popover";
import { SMS_DEFAULT } from "../../constants";

function SmsTab() {
  const [message, setMessage] = useState(SMS_DEFAULT);
  const cursorRef = useRef(SMS_DEFAULT.length);

  function insertVariable(variable: string) {
    const pos = cursorRef.current;
    setMessage((prev) => prev.slice(0, pos) + variable + prev.slice(pos));
    cursorRef.current = pos + variable.length;
  }

  return (
    <div className="grid grid-cols-5 gap-7">
      <div className="col-span-3 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-foreground">Inserir variável</p>
          <VariablePopover
            onInsert={insertVariable}
            disabled={message.length >= 160}
          />
        </div>
        <FormField name="smsMessage" label="Mensagem SMS">
          <Textarea
            name="smsMessage"
            className="min-h-40 font-mono text-xs"
            maxLength={160}
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
        <p className="text-xs text-muted-foreground">
          SMS limitado a 160 caracteres · {message.length} / 160
        </p>
      </div>

      <div className="col-span-2 flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-foreground">Prévia</p>
          <p className="text-xs text-muted-foreground">
            Variáveis serão preenchidas no envio
          </p>
        </div>
        <div className="overflow-clip rounded-2xl border border-border bg-muted/30">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-xs font-semibold text-foreground">SMS</span>
            <Smartphone size={16} className="text-muted-foreground" />
          </div>
          <div className="border-t border-border px-5 pb-5 pt-4">
            <p className="whitespace-pre-wrap text-sm text-foreground">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SmsTab };
