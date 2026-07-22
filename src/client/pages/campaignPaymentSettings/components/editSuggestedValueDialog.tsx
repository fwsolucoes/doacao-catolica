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
import { FormField } from "~/client/components/ui/form-field";
import { Textarea } from "~/client/components/ui/textarea";
import type { SuggestedValue } from "../index";

type EditSuggestedValueDialogProps = {
  target: SuggestedValue | null;
  onClose: () => void;
};

function EditSuggestedValueDialog({ target, onClose }: EditSuggestedValueDialogProps) {
  return (
    <Dialog open={target !== null} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar valor sugerido</DialogTitle>
          <DialogDescription>
            Este card será exibido no checkout da campanha.
          </DialogDescription>
        </DialogHeader>

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

        <DialogFooter showCloseButton closeButtonLabel="Cancelar">
          <Button type="button" onClick={onClose}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { EditSuggestedValueDialog };
