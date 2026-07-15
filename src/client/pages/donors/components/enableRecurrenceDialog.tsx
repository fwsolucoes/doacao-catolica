import { useEffect } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormErrorProvider } from "~/client/components/ui/form-field";
import { Separator } from "~/client/components/ui/separator";
import { useActionToast } from "~/client/hooks/useActionToast";

type EnableRecurrenceDialogProps = {
  subscriptionUuid: string | null;
  name: string;
  onClose: () => void;
};

function EnableRecurrenceDialog({
  subscriptionUuid,
  name,
  onClose,
}: EnableRecurrenceDialogProps) {
  const fetcher = useFetcher();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast?.type === "success") {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={!!subscriptionUuid} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ativar recorrência</DialogTitle>
        </DialogHeader>
        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form method="post" className="flex flex-col gap-4">
            <input type="hidden" name="_action" value="enableRecurrence" />
            <input
              type="hidden"
              name="subscriptionUuid"
              value={subscriptionUuid ?? ""}
            />
            <div className="px-6">
              <p className="text-sm text-muted-foreground">
                Tem certeza que deseja ativar a recorrência de{" "}
                <strong className="text-foreground">{name}</strong>?
              </p>
            </div>
            <Separator />
            <DialogFooter showCloseButton>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Ativando..." : "Ativar recorrência"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { EnableRecurrenceDialog };
