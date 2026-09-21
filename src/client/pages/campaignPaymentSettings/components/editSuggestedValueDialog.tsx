import { useEffect } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/client/components/ui/button";
import { CurrencyInput } from "~/client/components/ui/currency-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { Separator } from "~/client/components/ui/separator";
import { Textarea } from "~/client/components/ui/textarea";
import { useActionToast } from "~/client/hooks/useActionToast";

type SuggestedValue = { id: string; amount: number; description: string };

type EditSuggestedValueDialogProps = {
  target: SuggestedValue | null;
  onClose: () => void;
};

function EditSuggestedValueDialog({ target, onClose }: EditSuggestedValueDialogProps) {
  const fetcher = useFetcher();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={target !== null} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar valor sugerido</DialogTitle>
          <DialogDescription>
            Este card será exibido no checkout da campanha.
          </DialogDescription>
        </DialogHeader>

        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form method="post" className="flex flex-col gap-4">
            <input type="hidden" name="_action" value="updateSuggestedValue" />
            <input type="hidden" name="id" value={target?.id ?? ""} />

            <div className="flex flex-col gap-5 px-6">
              <FormField name="amount" label="Valor (R$)" required>
                <CurrencyInput
                  key={target?.id}
                  name="amount"
                  defaultValue={target?.amount}
                />
              </FormField>

              <FormField name="description" label="Descrição (opcional)">
                <Textarea
                  key={target?.id}
                  name="description"
                  placeholder="Descreva o impacto desta doação"
                  rows={3}
                  defaultValue={target?.description}
                />
              </FormField>
            </div>

            <Separator />

            <DialogFooter showCloseButton closeButtonLabel="Cancelar">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { EditSuggestedValueDialog };
