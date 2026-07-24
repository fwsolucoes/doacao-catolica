import { useRef, useState } from "react";
import { FormField } from "~/client/components/ui/form-field";
import { ImageUpload } from "~/client/components/ui/image-upload";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Textarea } from "~/client/components/ui/textarea";
import { VariablePopover } from "../variable-popover";
import { EMAIL_BODY_DEFAULT } from "../../constants";

function EmailTab() {
  const [subject, setSubject] = useState("Lembrete de Vencimento - {{nome}}");
  const [body, setBody] = useState(EMAIL_BODY_DEFAULT);
  const subjectCursorRef = useRef(0);
  const bodyCursorRef = useRef(EMAIL_BODY_DEFAULT.length);

  function insertSubjectVariable(variable: string) {
    const pos = subjectCursorRef.current;
    setSubject((prev) => prev.slice(0, pos) + variable + prev.slice(pos));
    subjectCursorRef.current = pos + variable.length;
  }

  function insertBodyVariable(variable: string) {
    const pos = bodyCursorRef.current;
    setBody((prev) => prev.slice(0, pos) + variable + prev.slice(pos));
    bodyCursorRef.current = pos + variable.length;
  }

  return (
    <div className="grid grid-cols-5 gap-7">
      <div className="col-span-3 flex flex-col gap-4">
        <FormField name="emailLayout" label="Layout HTML">
          <Select.Root defaultValue="basico">
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="basico">Layout básico</Select.Item>
            </Select.Content>
          </Select.Root>
        </FormField>

        <FormField name="emailImage1" label="Imagem 1 (Topo)">
          <ImageUpload name="emailImage1" width={600} height={200} />
        </FormField>
        {/* <FormField name="emailImage2" label="Imagem 2 (Rodapé - opcional)">
          <ImageUpload name="emailImage2" width={600} height={150} />
        </FormField> */}

        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-foreground">Assunto</p>
          <div className="flex w-full items-center gap-2.5">
            <div className="min-w-0 flex-1">
              <Input
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  subjectCursorRef.current =
                    e.target.selectionStart ?? e.target.value.length;
                }}
                onSelect={(e) => {
                  subjectCursorRef.current =
                    (e.target as HTMLInputElement).selectionStart ?? subject.length;
                }}
                onBlur={(e) => {
                  subjectCursorRef.current =
                    e.target.selectionStart ?? subject.length;
                }}
              />
            </div>
            <VariablePopover onInsert={insertSubjectVariable} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-foreground">Corpo do e-mail</p>
          <VariablePopover onInsert={insertBodyVariable} />
          <Textarea
            className="min-h-40 text-sm"
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              bodyCursorRef.current = e.target.selectionStart;
            }}
            onSelect={(e) => {
              bodyCursorRef.current = (e.target as HTMLTextAreaElement).selectionStart;
            }}
            onBlur={(e) => {
              bodyCursorRef.current = e.target.selectionStart;
            }}
          />
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-foreground">Prévia</p>
          <p className="text-xs text-muted-foreground">
            Variáveis serão preenchidas no envio
          </p>
        </div>
        <div className="overflow-clip rounded-2xl border border-border">
          <div className="border-b border-border bg-muted px-4 py-3">
            <p className="text-xs text-muted-foreground">Para: cliente@email.com</p>
            <p className="text-xs font-semibold text-foreground">{subject}</p>
          </div>
          <div className="flex h-28 items-center justify-center bg-muted/50">
            <span className="text-xs text-muted-foreground">Imagem 1</span>
          </div>
          <div className="p-5">
            <p className="whitespace-pre-wrap text-sm text-foreground">{body}</p>
          </div>
          {/* <div className="flex h-24 items-center justify-center bg-muted/50">
            <span className="text-xs text-muted-foreground">Imagem 2 (opcional)</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export { EmailTab };
