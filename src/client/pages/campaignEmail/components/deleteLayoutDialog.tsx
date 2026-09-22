import { useEffect } from "react";
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
import { Separator } from "~/client/components/ui/separator";
import { TrashDashedBorderCircle } from "~/client/components/ui/trash-dashed-border-circle";

type DeleteTarget = { type: string };

type DeleteLayoutDialogProps = {
  target: DeleteTarget | null;
  onClose: () => void;
};

function DeleteLayoutDialog({ target, onClose }: DeleteLayoutDialogProps) {
  const { campaignId } = useParams<{ campaignId: string }>();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";
  useActionToast(fetcher.data);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={!!target} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir layout</DialogTitle>
        </DialogHeader>
        <fetcher.Form
          method="post"
          action={`/campaign/${campaignId}/settings/email`}
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="type" value={target?.type ?? ""} />
          <TrashDashedBorderCircle />
          <DialogDescription className="px-6 text-center">
            Tem certeza que deseja excluir o layout{" "}
            <strong>{target?.type}</strong>? As notificações desse tipo voltarão
            a usar o template padrão.
          </DialogDescription>
          <Separator />
          <DialogFooter showCloseButton>
            <Button
              type="submit"
              variant="danger"
              name="_action"
              value="deleteEmailTemplate"
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

export { DeleteLayoutDialog, type DeleteTarget };
