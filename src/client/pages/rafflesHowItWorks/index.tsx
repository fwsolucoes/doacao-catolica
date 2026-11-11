import { ArrowLeft, CircleHelp, Ticket } from "lucide-react";
import { Link, useParams } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { PaymentMessageCard } from "./components/paymentMessageCard";
import { SimulatorCard } from "./components/simulatorCard";
import { StepCards } from "./components/stepCards";
import { TicketsExampleCard } from "./components/ticketsExampleCard";

function RafflesHowItWorksPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const basePath = `/campaign/${campaignId}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          to={`${basePath}/raffles`}
          className="flex w-fit items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Voltar para sorteios
        </Link>
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
            <CircleHelp size={22} />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
              Como funciona o sorteio
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Um sorteio acompanha a sua campanha: cada doação recebida se
              transforma em bilhetes e o doador recebe a confirmação com os seus
              números no WhatsApp.
            </p>
          </div>
        </div>
      </div>

      <StepCards />
      <TicketsExampleCard />
      <SimulatorCard />
      <PaymentMessageCard messageRulesPath={`${basePath}/message-rules`} />

      <Card.Root className="flex-row flex-wrap items-center justify-between gap-4 p-6">
        <p className="text-sm text-muted-foreground">
          Pronto para começar? Cadastre o primeiro sorteio desta campanha.
        </p>
        <Button asChild>
          <Link to={`${basePath}/raffles`}>
            <Ticket size={16} />
            Ir para sorteios
          </Link>
        </Button>
      </Card.Root>
    </div>
  );
}

export { RafflesHowItWorksPage };
