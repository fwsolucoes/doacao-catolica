import { ListChecks, MessageCircle, TriangleAlert } from "lucide-react";
import { Link } from "react-router";
import { Alert } from "~/client/components/ui/alert";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";

type PaymentMessageCardProps = {
  messageRulesPath: string;
};

function PaymentMessageCard({ messageRulesPath }: PaymentMessageCardProps) {
  return (
    <Card.Root className="p-6">
      <Card.Header className="items-start">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-(--badge-emerald-bg) text-(--badge-emerald-text)">
            <MessageCircle size={20} />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-(--text-heading)">
              Mensagem enviada ao confirmar o pagamento
            </h2>
            <p className="text-sm text-muted-foreground">
              O disparo usa a mensagem do tipo{" "}
              <strong className="text-foreground">
                Confirmação de Pagamento (Sorteios)
              </strong>
              .
            </p>
          </div>
        </div>
        <Badge className="bg-(--badge-emerald-bg) text-(--badge-emerald-text)">
          WhatsApp
        </Badge>
      </Card.Header>

      <div className="rounded-xl bg-muted/60 p-4">
        <div className="flex max-w-xl flex-col gap-4 rounded-xl bg-muted p-4 text-sm text-foreground">
          <p>Olá, Francisco!</p>
          <p>
            Confirmamos que o recebimento de seu pagamento referente à doação
            para a Comunidade Monte Sinai foi realizado com sucesso!
          </p>
          <p>
            Seu(s) número(s) para o sorteio da moto 0 km são:{" "}
            <strong>25001</strong>
          </p>
          <p>Agradecemos sua contribuição. Deus lhe pague!</p>
        </div>
      </div>

      <Alert.Root variant="warning">
        <Alert.Icon>
          <TriangleAlert size={18} />
        </Alert.Icon>
        <Alert.Title>
          Essa mensagem não é automática: configure-a antes de ativar o sorteio.
        </Alert.Title>
        <Alert.Description>
          Ela precisa estar cadastrada na <strong>Régua de Mensagens</strong>{" "}
          como o tipo Confirmação de Pagamento (Sorteios). Sem essa
          configuração, o pagamento é confirmado mas nada é enviado no
          WhatsApp.
        </Alert.Description>
        <div className="col-start-2 mt-2">
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link to={messageRulesPath}>
              <ListChecks size={14} />
              Abrir Régua de Mensagens
            </Link>
          </Button>
        </div>
      </Alert.Root>

      <p className="text-sm text-muted-foreground">
        Os números informados na mensagem são os bilhetes gerados para aquela
        doação, dentro da faixa cadastrada no sorteio.
      </p>
    </Card.Root>
  );
}

export { PaymentMessageCard };
