import { ArrowRight } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Table } from "~/client/components/ui/table";
import type { CampaignHomeLoader } from "~/client/types/campaignHomeLoader";
import { formatCurrency } from "~/lib/formatCurrency";
import { getInitials } from "~/lib/getInitials";

const STATUS_BADGE: Record<
  string,
  { variant: "success" | "warning" | "info" | "neutral"; label: string }
> = {
  received: { variant: "info", label: "Recebida" },
  confirmed: { variant: "success", label: "Confirmada" },
  pending: { variant: "warning", label: "Pendente" },
  failed: { variant: "neutral", label: "Falhou" },
  cancelled: { variant: "neutral", label: "Cancelada" },
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  pix: "Pix",
  credit_card: "Cartão",
  card: "Cartão",
  boleto: "Boleto",
  debit_card: "Débito",
};

function formatPaidAt(paidAt: string): string {
  // format: "14/07/2026 10:32:00"
  const [datePart] = paidAt.split(" ");
  return datePart ?? paidAt;
}

function RecentDonationsCard({ campaignId }: { campaignId: string }) {
  const { activity } = useLoaderData<CampaignHomeLoader>();

  return (
    <Card.Root className="p-6">
      <Card.Header>
        <div>
          <p className="text-sm font-semibold text-(--text-heading)">
            Doações recentes
          </p>
          <p className="text-xs text-muted-foreground">
            Últimas movimentações da campanha.
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
          <Link to={`/campaign/${campaignId}/donations`}>
            Ver todas <ArrowRight size={13} />
          </Link>
        </Button>
      </Card.Header>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Doador</Table.Head>
            <Table.Head className="w-px whitespace-nowrap">Método</Table.Head>
            <Table.Head className="w-px whitespace-nowrap">Status</Table.Head>
            <Table.Head className="w-px whitespace-nowrap text-right">Valor</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {activity.recentDonations.map((d) => {
            const badge = STATUS_BADGE[d.status];
            return (
              <Table.Row key={d.paymentUuid}>
                <Table.Cell className="max-w-0">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary text-[0.65rem] font-bold text-primary-foreground">
                        {getInitials(d.customerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="truncate text-sm font-medium text-(--text-heading)">
                        {d.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPaidAt(d.paidAt)}
                      </p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="w-px whitespace-nowrap">
                  <span className="text-sm">
                    {PAYMENT_METHOD_LABEL[d.paymentMethod] ?? d.paymentMethod}
                  </span>
                </Table.Cell>
                <Table.Cell className="w-px whitespace-nowrap">
                  <Badge variant={badge?.variant ?? "neutral"}>
                    {badge?.label ?? d.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="w-px whitespace-nowrap text-right font-medium">
                  {formatCurrency(String(d.amount))}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Card.Root>
  );
}

export { RecentDonationsCard };
