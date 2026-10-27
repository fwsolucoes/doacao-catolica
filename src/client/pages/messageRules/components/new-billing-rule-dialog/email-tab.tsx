import { useRef, useState } from "react";
import { RichTextarea } from "~/client/components/campaignSettings/richTextarea";
import type { RichTextareaRef } from "~/client/components/campaignSettings/richTextarea";
import { FormField } from "~/client/components/ui/form-field";
import { ImageUpload } from "~/client/components/ui/image-upload";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Switch } from "~/client/components/ui/switch";
import { VariablePopover } from "../variable-popover";
import {
  EMAIL_BODY_DEFAULT,
  DONOR_MESSAGE_VARIABLES,
} from "../../constants";

function EmailTab({
  defaultSubject,
  defaultBody,
  defaultEnabled = true,
}: {
  defaultSubject?: string;
  defaultBody?: string;
  defaultEnabled?: boolean;
}) {
  const initialSubject = defaultSubject ?? "Lembrete de Vencimento - {{nome}}";
  const initialBody = defaultBody ?? EMAIL_BODY_DEFAULT;
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [enabled, setEnabled] = useState(defaultEnabled);
  const subjectCursorRef = useRef(0);
  const bodyRef = useRef<RichTextareaRef>(null);

  function insertSubjectVariable(variable: string) {
    const pos = subjectCursorRef.current;
    setSubject((prev) => prev.slice(0, pos) + variable + prev.slice(pos));
    subjectCursorRef.current = pos + variable.length;
  }

  function insertBodyVariable(variable: string) {
    bodyRef.current?.insertAtCursor(variable);
  }

  return (
    <>
      <input
        type="hidden"
        name="enableMail"
        value={enabled ? "true" : "false"}
      />

      <div className="mb-5 flex w-full max-w-80 items-center justify-between gap-4 rounded-xl border border-border bg-muted px-4 py-2.5">
        <span className="text-sm font-semibold text-foreground">
          Habilitar envio por E-mail
        </span>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      <div className="grid grid-cols-5 gap-7">
        <div className="col-span-3 flex flex-col gap-4">
          <FormField name="emailLayout" label="Layout HTML">
            <Select.Root defaultValue="basico" disabled={!enabled}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="basico">Layout básico</Select.Item>
              </Select.Content>
            </Select.Root>
          </FormField>

          <FormField name="emailImage1" label="Imagem 1 (Topo)">
            <ImageUpload
              name="emailImage1"
              width={600}
              height={200}
              disabled={!enabled}
            />
          </FormField>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-foreground">Assunto</p>
            <div className="flex w-full items-center gap-2.5">
              <div className="min-w-0 flex-1">
                <Input
                  name="mailSubject"
                  value={subject}
                  disabled={!enabled}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    subjectCursorRef.current =
                      e.target.selectionStart ?? e.target.value.length;
                  }}
                  onSelect={(e) => {
                    subjectCursorRef.current =
                      (e.target as HTMLInputElement).selectionStart ??
                      subject.length;
                  }}
                  onBlur={(e) => {
                    subjectCursorRef.current =
                      e.target.selectionStart ?? subject.length;
                  }}
                />
              </div>
              <VariablePopover
                onInsert={insertSubjectVariable}
                disabled={!enabled}
              />
            </div>
          </div>

          <FormField name="mailMessage" label="Corpo do e-mail">
            <VariablePopover
              onInsert={insertBodyVariable}
              disabled={!enabled}
              variables={DONOR_MESSAGE_VARIABLES}
            />
            <RichTextarea
              ref={bodyRef}
              name="mailMessage"
              defaultValue={initialBody}
              onChange={setBody}
              disabled={!enabled}
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
            <div className="border-b border-border bg-muted px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Para: cliente@email.com
              </p>
              <p className="text-xs font-semibold text-foreground">{subject}</p>
            </div>
            <div className="flex h-28 items-center justify-center bg-muted/50">
              <span className="text-xs text-muted-foreground">Imagem 1</span>
            </div>
            <div className="p-5">
              <div
                className="whitespace-pre-wrap text-sm text-foreground"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { EmailTab };
