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
import type { DonationsLoader } from "~/client/types/paymentStatementsLoader";

type Payment = DonationsLoader["payments"]["data"][number];

type CancelManualPaymentDialogProps = {
  payment: Payment | null;
  onClose: () => void;
  onSuccess?: () => void;
};

function CancelManualPaymentDialog({ payment, onClose, onSuccess }: CancelManualPaymentDialogProps) {
  const fetcher = useFetcher();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
      onSuccess?.();
    }
  }, [fetcher.state, fetcher.data, onClose, onSuccess]);

  return (
    <Dialog open={!!payment} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar baixa manual</DialogTitle>
        </DialogHeader>
        <fetcher.Form method="post" className="flex flex-col gap-4">
          <input type="hidden" name="paymentId" value={payment?.id ?? ""} />
          <TrashDashedBorderCircle />
          <DialogDescription className="px-6 text-center">
            Deseja realmente cancelar a baixa manual de{" "}
            <strong>{payment?.customerName}</strong>?
          </DialogDescription>
          <Separator />
          <DialogFooter showCloseButton closeButtonLabel="Fechar">
            <Button
              type="submit"
              name="_action"
              value="cancelManualPayment"
              variant="danger"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cancelando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

export { CancelManualPaymentDialog };
