import { Send } from "lucide-react";
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
import type { PendingCollaborator } from "./types";

type ResendInviteModalProps = {
  invite: PendingCollaborator | null;
  onClose: () => void;
};

function ResendInviteModal({ invite, onClose }: ResendInviteModalProps) {
  const fetcher = useFetcher();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={!!invite} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reenviar convite</DialogTitle>
        </DialogHeader>
        <fetcher.Form method="post" className="flex flex-col gap-4">
          <input type="hidden" name="Id" value={invite?.id ?? ""} />
          <div className="flex items-center justify-center">
            <div className="flex size-30 items-center justify-center rounded-full border border-dashed border-border bg-muted p-[15px]">
              <div className="flex size-[90px] items-center justify-center rounded-full bg-primary">
                <Send className="size-10 text-white" />
              </div>
            </div>
          </div>
          <DialogDescription className="px-6 text-center">
            Deseja reenviar o convite para{" "}
            <strong>{invite?.email}</strong>?
          </DialogDescription>
          <Separator />
          <DialogFooter showCloseButton>
            <Button
              type="submit"
              name="_action"
              value="resendInviteCollaborator"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Reenviar convite
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

export { ResendInviteModal };
