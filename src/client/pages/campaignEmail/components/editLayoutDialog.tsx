import { useEffect, useState } from "react";
import { useFetcher, useParams } from "react-router";
import { useActionToast } from "~/client/hooks/useActionToast";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { Select } from "~/client/components/ui/select";
import { Separator } from "~/client/components/ui/separator";
import { Textarea } from "~/client/components/ui/textarea";
import { TEMPLATE_TYPES } from "./templateTypes";

type EditTarget = { type: string; body: string };

type EditLayoutDialogProps = {
  target: EditTarget | null;
  onClose: () => void;
};

function EditLayoutDialog({ target, onClose }: EditLayoutDialogProps) {
  const { campaignId } = useParams<{ campaignId: string }>();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";
  const [selectedType, setSelectedType] = useState(target?.type ?? "");
  useActionToast(fetcher.data);

  useEffect(() => {
    if (target) setSelectedType(target.type);
  }, [target]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={target !== null} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar layout</DialogTitle>
          <DialogDescription>
            Atualize o HTML e as informações do layout.
          </DialogDescription>
        </DialogHeader>

        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form
            method="post"
            action={`/campaign/${campaignId}/settings/email`}
            className="contents"
          >
            <div className="flex flex-col gap-5 overflow-y-auto px-6">
              <FormField name="type" label="Tipo do layout" required>
                <Select.Root value={selectedType} onValueChange={setSelectedType}>
                  <Select.Trigger>
                    <Select.Value placeholder="Selecione o tipo..." />
                  </Select.Trigger>
                  <Select.Content>
                    {TEMPLATE_TYPES.map((t) => (
                      <Select.Item key={t.value} value={t.value}>
                        {t.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <input type="hidden" name="type" value={selectedType} />
              </FormField>

              <FormField name="body" label="HTML do layout" required>
                <Textarea
                  key={target?.type}
                  name="body"
                  className="min-h-72 font-mono text-xs"
                  defaultValue={target?.body ?? ""}
                />
              </FormField>
            </div>

            <Separator />

            <DialogFooter showCloseButton closeButtonLabel="Cancelar">
              <Button
                type="submit"
                name="_action"
                value="updateEmailTemplate"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { EditLayoutDialog, type EditTarget };
