import { useState } from "react";
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

type AddSuggestedValueDialogProps = {
  open: boolean;
  onClose: () => void;
};

function AddSuggestedValueDialog({ open, onClose }: AddSuggestedValueDialogProps) {
  const [description, setDescription] = useState("");

  function handleClose() {
    setDescription("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo valor sugerido</DialogTitle>
          <DialogDescription>
            Este card será exibido no checkout da campanha.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 px-6">
          <FormField name="amount" label="Valor (R$)" required>
            <CurrencyInput name="amount" placeholder="0,00" />
          </FormField>

          <FormField name="description" label="Descrição (opcional)">
            <Textarea
              name="description"
              placeholder="Descreva o impacto desta doação"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>
        </div>

        <DialogFooter showCloseButton closeButtonLabel="Cancelar">
          <Button type="button" onClick={handleClose}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { AddSuggestedValueDialog };
