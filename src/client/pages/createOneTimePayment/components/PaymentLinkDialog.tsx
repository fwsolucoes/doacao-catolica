import { ExternalLink } from "lucide-react";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { useRoot } from "~/client/hooks/useRoot";

type PaymentLinkDialogProps = {
  paymentUuid: string | null;
  onClose: () => void;
};

function PaymentLinkDialog({ paymentUuid, onClose }: PaymentLinkDialogProps) {
  const { environmentVariables } = useRoot();
  const paymentLink = `${environmentVariables.SANCTON_DONATION_CHECKOUT_URL}/pay/${paymentUuid}`;

  return (
    <Dialog open={!!paymentUuid} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pagamento criado com sucesso</DialogTitle>
          <DialogDescription>
            Clique no botão abaixo para acessar o pagamento.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton closeButtonLabel="Fechar">
          <Button asChild>
            <a href={paymentLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} />
              Acessar link de pagamento
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { PaymentLinkDialog };
