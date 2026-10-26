import { Info, MessageCircle } from "lucide-react";
import { Button } from "~/client/components/ui/button";
import { useRoot } from "~/client/hooks/useRoot";

function WalletUpgradeNotice() {
  const { environmentVariables } = useRoot();
  const supportUrl = `https://wa.me/${environmentVariables.WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent(
    "Olá, gostaria de fazer o upgrade do meu plano para usar uma carteira digital própria.",
  )}`;

  return (
    <div className="flex items-start gap-3.5 rounded-xl border border-primary/20 bg-primary/5 p-4.75">
      <Info size={24} className="mt-0.5 shrink-0 text-primary" />
      <div className="flex flex-col items-start gap-3.5">
        <div>
          <p className="text-base font-semibold text-foreground">
            Carteira própria disponível nos planos habilitados
          </p>
          <p className="text-base text-muted-foreground">
            Para usar uma carteira digital própria no recebimento das doações, é
            necessário um plano que inclua esse recurso. Entre em contato com
            nosso suporte para fazer o upgrade do seu plano.
          </p>
        </div>
        <Button asChild className="px-5 text-base">
          <a href={supportUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={19} />
            Falar com o suporte
          </a>
        </Button>
      </div>
    </div>
  );
}

export { WalletUpgradeNotice };
