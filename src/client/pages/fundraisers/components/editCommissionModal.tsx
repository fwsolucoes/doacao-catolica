import { Save } from "lucide-react";
import { useState } from "react";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { InputGroup } from "~/client/components/ui/input-group";

type EditCommissionModalProps = {
  open: boolean;
  onClose: () => void;
};

function EditCommissionModal({ open, onClose }: EditCommissionModalProps) {
  const [commission, setCommission] = useState("");

  const commissionValue = parseFloat(commission);
  const commissionErrors =
    !isNaN(commissionValue) && commissionValue > 100
      ? ["O percentual não pode ser maior que 100."]
      : undefined;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 px-8 pb-5 pt-8">
          <DialogTitle className="text-xl">Editar comissão</DialogTitle>
          <p className="text-base text-muted-foreground">
            Atualize o percentual de comissão deste arrecadador.
          </p>
        </DialogHeader>

        <FormErrorProvider fieldErrors={{ commission: commissionErrors }}>
          <form className="flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-8 pb-6">
              <FormField
                name="commission"
                label="Percentual de comissão"
                optional
              >
                <InputGroup.Root>
                  <InputGroup.Input
                    name="commission"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                  />
                  <InputGroup.Side side="end">%</InputGroup.Side>
                </InputGroup.Root>
                {!commissionErrors && (
                  <p className="text-xs text-muted-foreground">
                    Percentual aplicado sobre as doações indicadas por este
                    arrecadador.
                  </p>
                )}
              </FormField>
            </div>

            <DialogFooter className="shrink-0 border-t border-border px-8 py-5">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!!commissionErrors} className="gap-2">
                <Save size={16} />
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { EditCommissionModal };
