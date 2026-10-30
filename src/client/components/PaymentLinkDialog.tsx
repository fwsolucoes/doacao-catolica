import { Copy, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [copied, setCopied] = useState(false);
  const paymentLink = `${environmentVariables.SANCTON_DONATION_CHECKOUT_URL}/pay/${paymentUuid}`;

  useEffect(() => {
    setCopied(false);
  }, [paymentUuid]);

  function handleCopyLink() {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
          <Button variant="outline" type="button" onClick={handleCopyLink}>
            <Copy size={16} />
            {copied ? "Copiado!" : "Copiar link"}
          </Button>
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
