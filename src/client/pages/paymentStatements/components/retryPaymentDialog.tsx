import { RefreshCw } from "lucide-react";
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
import type { DonationsLoader } from "~/client/types/paymentStatementsLoader";

type Payment = DonationsLoader["payments"]["data"][number];

type RetryPaymentDialogProps = {
  payment: Payment | null;
  onClose: () => void;
  onSuccess: () => void;
};

function RetryPaymentDialog({ payment, onClose, onSuccess }: RetryPaymentDialogProps) {
  const fetcher = useFetcher();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      if (fetcher.data.toast.type === "success") onSuccess();
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose, onSuccess]);

  return (
    <Dialog open={!!payment} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tentar gerar pagamento novamente</DialogTitle>
        </DialogHeader>
        <fetcher.Form method="post" className="flex flex-col gap-4">
          <input type="hidden" name="paymentId" value={payment?.id ?? ""} />
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="flex items-center justify-center">
              <div className="flex size-30 items-center justify-center rounded-full border border-dashed border-border bg-muted p-3.75">
                <div className="flex size-22.5 items-center justify-center rounded-full bg-primary">
                  <RefreshCw className="size-12 text-primary-foreground" />
                </div>
              </div>
            </div>
            <DialogDescription className="px-6 text-center">
              Deseja tentar gerar novamente o pagamento de{" "}
              <strong>{payment?.customerName}</strong>?
              {payment?.paymentType === "Cartão de crédito" &&
                " Se a tentativa der certo, o cartão será debitado na hora."}
            </DialogDescription>
          </div>
          <Separator />
          <DialogFooter showCloseButton closeButtonLabel="Fechar">
            <Button type="submit" name="_action" value="retryPayment" disabled={isSubmitting}>
              {isSubmitting ? "Gerando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

export { RetryPaymentDialog };
