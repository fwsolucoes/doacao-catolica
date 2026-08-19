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

type CancelPaymentDialogProps = {
  payment: Payment | null;
  onClose: () => void;
  onSuccess?: () => void;
};

function CancelPaymentDialog({ payment, onClose, onSuccess }: CancelPaymentDialogProps) {
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
          <DialogTitle>Cancelar pagamento</DialogTitle>
        </DialogHeader>
        <fetcher.Form method="post" className="flex flex-col gap-4">
          <input type="hidden" name="paymentId" value={payment?.id ?? ""} />
          <TrashDashedBorderCircle />
          <DialogDescription className="px-6 text-center">
            Tem certeza que deseja cancelar o pagamento de{" "}
            <strong>{payment?.customerName}</strong> no valor de{" "}
            <strong>{payment?.amount}</strong>? Esta ação não pode ser desfeita.
          </DialogDescription>
          <Separator />
          <DialogFooter showCloseButton closeButtonLabel="Fechar">
            <Button
              type="submit"
              name="_action"
              value="cancelPayment"
              variant="danger"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cancelando..." : "Cancelar pagamento"}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

export { CancelPaymentDialog };
