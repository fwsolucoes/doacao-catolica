import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { Separator } from "~/client/components/ui/separator";
import { TrashDashedBorderCircle } from "~/client/components/ui/trash-dashed-border-circle";
import type { SuggestedValue } from "./SuggestedValuesSection";

type DeleteSuggestedValueDialogProps = {
  value: SuggestedValue | null;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteSuggestedValueDialog({
  value,
  onClose,
  onConfirm,
}: DeleteSuggestedValueDialogProps) {
  return (
    <Dialog open={!!value} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir valor sugerido</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <TrashDashedBorderCircle />
          <DialogDescription className="px-6 text-center">
            Deseja excluir o valor sugerido de{" "}
            <strong>
              R$ {Number(value?.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </strong>
            ? Esta ação não pode ser desfeita.
          </DialogDescription>

          <Separator />
          <DialogFooter showCloseButton>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteSuggestedValueDialog };
