import { Check, Ticket } from "lucide-react";
import { Card } from "~/client/components/ui/card";
import { Table } from "~/client/components/ui/table";
import { formatCurrency } from "~/lib/formatCurrency";
import { countTickets, formatQuotient, formatTicketCount } from "../utils";

const EXAMPLE_TICKET_PRICE = 25;
const EXAMPLE_DONATIONS = [25, 50, 75, 110, 250];

function brl(value: number) {
  return formatCurrency(String(value));
}

function TicketsExampleCard() {
  return (
    <Card.Root className="p-6">
      <Card.Header className="items-start">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-(--text-heading)">
            Quantos bilhetes cada doação recebe
          </h2>
          <p className="text-sm text-muted-foreground">
            O doador recebe a parte inteira da divisão do valor da doação pelo
            valor do bilhete.
          </p>
        </div>
        <span className="rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
          Bilhete de exemplo:{" "}
          <strong className="text-foreground">{brl(EXAMPLE_TICKET_PRICE)}</strong>
        </span>
      </Card.Header>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Doação</Table.Head>
            <Table.Head>Cálculo</Table.Head>
            <Table.Head className="text-right">Bilhetes</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {EXAMPLE_DONATIONS.map((donation) => (
            <Table.Row key={donation}>
              <Table.Cell className="font-semibold">{brl(donation)}</Table.Cell>
              <Table.Cell className="text-muted-foreground">
                {brl(donation)} ÷ {brl(EXAMPLE_TICKET_PRICE)} ={" "}
                {formatQuotient(donation, EXAMPLE_TICKET_PRICE)}
              </Table.Cell>
              <Table.Cell className="text-right">
                <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
                  <Ticket size={16} />
                  {formatTicketCount(countTickets(donation, EXAMPLE_TICKET_PRICE))}
                </span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <p className="flex items-start gap-2 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
        <Check size={16} className="mt-0.5 shrink-0 text-(--badge-emerald-text)" />
        O valor que não completa um bilhete não gera bilhete extra: quem doa{" "}
        {brl(110)} com bilhete de {brl(EXAMPLE_TICKET_PRICE)} recebe{" "}
        {formatTicketCount(countTickets(110, EXAMPLE_TICKET_PRICE))}.
      </p>
    </Card.Root>
  );
}

export { TicketsExampleCard };
