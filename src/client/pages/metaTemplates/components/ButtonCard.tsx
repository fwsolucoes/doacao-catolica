import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, ExternalLink, MousePointerClick, Plus, X } from "lucide-react";
import { useLoaderData, useFetcher } from "react-router";
import { useActionToast } from "~/client/hooks/useActionToast";
import { Button } from "~/client/components/ui/button";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Separator } from "~/client/components/ui/separator";
import type { MetaTemplateEditLoader } from "~/client/types/metaTemplateEditLoader";
import type { WhatsappTemplateDetailButton } from "~/domain/views/whatsappTemplateDetail";
import { DeleteButtonModal } from "./DeleteButtonModal";
import { SectionCard } from "./SectionCard";

const BUTTON_TYPES: Record<string, { label: string; icon: React.ElementType }> = {
  quick_reply: { label: "Resposta rápida", icon: MousePointerClick },
  url: { label: "URL", icon: ExternalLink },
  copy_code: { label: "Copiar código", icon: Copy },
};

function ButtonCard() {
  const { template } = useLoaderData<MetaTemplateEditLoader>();
  const fetcher = useFetcher();
  const [button, setButton] = useState(
    template.button
      ? { uuid: template.button.uuid, subType: template.button.subType, value: template.button.value }
      : null,
  );
  const [deletingButton, setDeletingButton] = useState<WhatsappTemplateDetailButton | null>(null);
  const buttonValueCursorRef = useRef(0);

  const closeDeleteModal = useCallback(() => setDeletingButton(null), []);

  function insertPaymentUuidVariable() {
    if (!button) return;
    const variable = "{{payment_uuid}}";
    const pos = buttonValueCursorRef.current;
    const value = button.value.slice(0, pos) + variable + button.value.slice(pos);
    setButton({ ...button, value });
    buttonValueCursorRef.current = pos + variable.length;
  }

  useEffect(() => {
    setButton(
      template.button
        ? { uuid: template.button.uuid, subType: template.button.subType, value: template.button.value }
        : null,
    );
  }, [template.button]);

  useActionToast(fetcher.data);

  return (
    <>
      <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
        <fetcher.Form method="post">
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
                      onClick={() => {
                        if (template.button) {
                          setDeletingButton(template.button);
                        } else {
                          setButton(null);
                        }
                      }}
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
                      <div className="flex flex-col gap-1.5">
                        <Input
                          name="button_value"
                          placeholder={
                            button.subType === "url" ? "https://exemplo.com" : "Ex: Doar Agora"
                          }
                          value={button.value}
                          onChange={(e) => {
                            setButton({ ...button, value: e.target.value });
                            buttonValueCursorRef.current = e.target.selectionStart ?? e.target.value.length;
                          }}
                          onSelect={(e) => {
                            buttonValueCursorRef.current =
                              (e.target as HTMLInputElement).selectionStart ?? 0;
                          }}
                          onBlur={(e) => {
                            buttonValueCursorRef.current = e.target.selectionStart ?? 0;
                          }}
                        />
                        {button.subType === "url" && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-fit gap-1.5"
                            onClick={insertPaymentUuidVariable}
                          >
                            <Plus size={14} />
                            Inserir {"{{payment_uuid}}"}
                          </Button>
                        )}
                      </div>
                    </FormField>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-fit gap-2"
                  onClick={() =>
                    setButton({
                      uuid: template.button?.uuid ?? "",
                      subType: "quick_reply",
                      value: "",
                    })
                  }
                >
                  <Plus size={16} />
                  Adicionar botão
                </Button>
              )}

              {button && (
                <>
                  <Separator />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      name="_action"
                      value={template.button ? "save_button" : "create_button"}
                      disabled={fetcher.state !== "idle"}
                    >
                      {fetcher.state !== "idle" ? "Salvando..." : "Salvar botão"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </SectionCard>
        </fetcher.Form>
      </FormErrorProvider>

      <DeleteButtonModal button={deletingButton} onClose={closeDeleteModal} />
    </>
  );
}

export { ButtonCard, BUTTON_TYPES };
