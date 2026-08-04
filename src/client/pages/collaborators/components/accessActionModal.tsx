import { useEffect } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/client/components/ui/button";
import type { ButtonVariants } from "~/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { useActionToast } from "~/client/hooks/useActionToast";

type AccessActionModalProps = {
  open: boolean;
  title: string;
  description: string;
  actionLabel: string;
  actionName?: string;
  resourceId?: string;
  buttonVariant?: ButtonVariants["variant"];
  onClose: () => void;
};

function AccessActionModal({
  open,
  title,
  description,
  actionLabel,
  actionName,
  resourceId,
  buttonVariant = "danger",
  onClose,
}: AccessActionModalProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  useActionToast(fetcher.data);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <fetcher.Form method="post" className="flex flex-col gap-4">
          <input type="hidden" name="Id" value={resourceId ?? ""} />

          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button
              type="submit"
              name="_action"
              value={actionName ?? ""}
              variant={buttonVariant}
              disabled={isSubmitting || !actionName || !resourceId}
              isLoading={isSubmitting}
            >
              {actionLabel}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

export { AccessActionModal };
