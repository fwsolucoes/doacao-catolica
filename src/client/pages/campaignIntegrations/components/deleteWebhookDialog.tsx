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

type DeleteWebhookDialogProps = {
  url: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteWebhookDialog({ url, onClose, onConfirm }: DeleteWebhookDialogProps) {
  return (
    <Dialog open={!!url} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir webhook</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <TrashDashedBorderCircle />
          <DialogDescription className="px-6 text-center">
            Tem certeza que deseja excluir o webhook{" "}
            <strong className="break-all font-mono">{url}</strong>? Esta ação
            não pode ser desfeita.
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

export { DeleteWebhookDialog };
