import { useLoaderData } from "react-router";
import type { DashboardLoader } from "~/client/types/dashboardLoader";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Table } from "~/client/components/ui/table";

function RecentDonationsCard() {
  const { recentDonations } = useLoaderData<DashboardLoader>();

  return (
    <Card.Root className="gap-0 overflow-hidden p-0">
      <div className="flex items-start justify-between p-7 pb-5">
        <div>
          <p className="text-lg font-semibold tracking-tight text-foreground">
            Doações recentes
          </p>
          <p className="text-sm text-muted-foreground">
            Últimas contribuições recebidas em tempo real.
          </p>
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          Exportar
        </Button>
      </div>

      <div className="px-7 pb-7">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Doador</Table.Head>
              <Table.Head className="text-right">Valor doado</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(recentDonations?.recentDonations ?? []).map((d) => (
              <Table.Row key={d.paymentUuid}>
                <Table.Cell>
                  <div className="flex items-center gap-3.5">
                    <Avatar size="lg">
                      <AvatarFallback className="bg-sidebar-accent-foreground/10 text-xs font-bold text-sidebar-accent-foreground">
                        {d.customerInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-foreground">
                        {d.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {d.campaignName} · {d.elapsed}
                      </p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="text-right font-semibold text-secondary-foreground">
                  {d.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Table.Cell>
              </Table.Row>
            ))}
            {!recentDonations?.recentDonations.length && <Table.Empty />}
          </Table.Body>
        </Table.Root>
      </div>
    </Card.Root>
  );
}

export { RecentDonationsCard };
