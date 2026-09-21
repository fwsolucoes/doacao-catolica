import { useEffect } from "react";
import { useFetcher } from "react-router";
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
import { useActionToast } from "~/client/hooks/useActionToast";

type SuggestedValue = { id: string; amount: number; description: string };

type DeleteSuggestedValueDialogProps = {
  target: SuggestedValue | null;
  onClose: () => void;
};

function DeleteSuggestedValueDialog({ target, onClose }: DeleteSuggestedValueDialogProps) {
  const fetcher = useFetcher();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={!!target} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir valor sugerido</DialogTitle>
        </DialogHeader>
        <fetcher.Form method="post" className="flex flex-col gap-4">
          <input type="hidden" name="_action" value="deleteSuggestedValue" />
          <input type="hidden" name="id" value={target?.id ?? ""} />
          <TrashDashedBorderCircle />
          <DialogDescription className="px-6 text-center">
            Tem certeza que deseja excluir o valor{" "}
            <strong>R$ {target?.amount.toLocaleString("pt-BR")}</strong>? Esta
            ação não pode ser desfeita.
          </DialogDescription>
          <Separator />
          <DialogFooter showCloseButton>
            <Button type="submit" variant="danger" disabled={isSubmitting}>
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteSuggestedValueDialog };
