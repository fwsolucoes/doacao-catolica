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

type AddSuggestedValueDialogProps = {
  open: boolean;
  onClose: () => void;
};

function AddSuggestedValueDialog({ open, onClose }: AddSuggestedValueDialogProps) {
  const fetcher = useFetcher();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo valor sugerido</DialogTitle>
          <DialogDescription>
            Este card será exibido no checkout da campanha.
          </DialogDescription>
        </DialogHeader>

        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form method="post" className="flex flex-col gap-4">
            <input type="hidden" name="_action" value="createSuggestedValue" />

            <div className="flex flex-col gap-5 px-6">
              <FormField name="amount" label="Valor (R$)" required>
                <CurrencyInput name="amount" placeholder="0,00" autoFocus />
              </FormField>

              <FormField name="description" label="Descrição (opcional)">
                <Textarea
                  name="description"
                  placeholder="Descreva o impacto desta doação"
                  rows={3}
                />
              </FormField>
            </div>

            <Separator />

            <DialogFooter showCloseButton closeButtonLabel="Cancelar">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adicionando..." : "Adicionar"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { AddSuggestedValueDialog };
