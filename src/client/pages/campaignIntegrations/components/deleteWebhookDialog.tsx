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
import type { WebhookItem } from "../types";

type DeleteWebhookDialogProps = {
  webhook: WebhookItem | null;
  onClose: () => void;
};

function DeleteWebhookDialog({ webhook, onClose }: DeleteWebhookDialogProps) {
  const fetcher = useFetcher();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast?.type === "success") {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={!!webhook} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir webhook</DialogTitle>
        </DialogHeader>

        <fetcher.Form method="post" className="flex flex-col gap-4">
          <input type="hidden" name="id" value={webhook?.id ?? ""} />
          <TrashDashedBorderCircle />
          <DialogDescription className="px-6 text-center">
            Tem certeza que deseja excluir o webhook{" "}
            <strong className="break-all font-mono">{webhook?.url}</strong>? As
            entregas pendentes serão canceladas e esta ação não pode ser desfeita.
          </DialogDescription>
          <Separator />
          <DialogFooter showCloseButton>
            <Button
              type="submit"
              variant="danger"
              name="_action"
              value="deleteWebhook"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteWebhookDialog };
