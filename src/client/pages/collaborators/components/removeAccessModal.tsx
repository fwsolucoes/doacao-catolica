import { ShieldOff } from "lucide-react";
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
import { useActionToast } from "~/client/hooks/useActionToast";
import type { ActiveCollaborator } from "./types";

type RemoveAccessModalProps = {
  collaborator: ActiveCollaborator | null;
  onClose: () => void;
};

function RemoveAccessModal({ collaborator, onClose }: RemoveAccessModalProps) {
  const fetcher = useFetcher();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={!!collaborator} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover acesso</DialogTitle>
        </DialogHeader>
        <fetcher.Form method="post" className="flex flex-col gap-4">
          <input type="hidden" name="Id" value={collaborator?.id ?? ""} />
          <div className="flex items-center justify-center">
            <div className="flex size-30 items-center justify-center rounded-full border border-dashed border-border bg-muted p-3.75">
              <div className="flex size-22.5 items-center justify-center rounded-full bg-destructive">
                <ShieldOff className="size-10 text-white" />
              </div>
            </div>
          </div>
          <DialogDescription className="px-6 text-center">
            Tem certeza que deseja remover o acesso de{" "}
            <strong>{collaborator?.name}</strong> à campanha? Esta ação não pode
            ser desfeita.
          </DialogDescription>
          <Separator />
          <DialogFooter showCloseButton closeButtonLabel="Fechar">
            <Button
              type="submit"
              name="_action"
              value="deleteInviteCollaborator"
              variant="danger"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Remover acesso
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

export { RemoveAccessModal };
