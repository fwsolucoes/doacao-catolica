import { Calculator, Ticket } from "lucide-react";
import { useState } from "react";
import { Card } from "~/client/components/ui/card";
import { CurrencyInput } from "~/client/components/ui/currency-input";
import { FormField } from "~/client/components/ui/form-field";
import { formatCurrency } from "~/lib/formatCurrency";
import { countTickets, formatTicketCount } from "../utils";

const DEFAULT_TICKET_PRICE = 25;
const DEFAULT_DONATION = 110;

function SimulatorCard() {
  // estado justificado: o resultado é recalculado a cada digitação (não há submit)
  const [ticketPrice, setTicketPrice] = useState(DEFAULT_TICKET_PRICE);
  const [donation, setDonation] = useState(DEFAULT_DONATION);

  const tickets = countTickets(donation, ticketPrice);

  return (
    <Card.Root className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-(--badge-navy-bg) text-(--badge-navy-text)">
          <Calculator size={20} />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-(--text-heading)">
            Simule a quantidade de bilhetes
          </h2>
          <p className="text-sm text-muted-foreground">
            Informe o valor do bilhete e o valor da doação para ver quantos
            bilhetes seriam enviados.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField name="simulatorTicketPrice" label="Valor do bilhete (R$)">
          <CurrencyInput
            defaultValue={DEFAULT_TICKET_PRICE}
            onValueChange={setTicketPrice}
          />
        </FormField>
        <FormField name="simulatorDonation" label="Valor da doação (R$)">
          <CurrencyInput
            defaultValue={DEFAULT_DONATION}
            onValueChange={setDonation}
          />
        </FormField>
      </div>

      <div
        className="flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-accent px-5 py-4"
        aria-live="polite"
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            {formatCurrency(String(donation))} em doações com bilhete de{" "}
            {formatCurrency(String(ticketPrice))}
          </span>
          <span className="text-2xl font-semibold text-primary">
            {ticketPrice > 0 ? formatTicketCount(tickets) : "Informe o valor do bilhete"}
          </span>
        </div>
        <Ticket size={36} className="shrink-0 text-primary/40" />
      </div>
    </Card.Root>
  );
}

export { SimulatorCard };
