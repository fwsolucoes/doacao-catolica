import { ArrowRight } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Table } from "~/client/components/ui/table";
import type { CampaignHomeLoader } from "~/client/types/campaignHomeLoader";
import { formatCurrency } from "~/lib/formatCurrency";

function TopDonorsCard({ campaignId }: { campaignId: string }) {
  const { activity } = useLoaderData<CampaignHomeLoader>();

  return (
    <Card.Root className="p-6">
      <Card.Header>
        <div>
          <p className="text-sm font-semibold text-(--text-heading)">
            Top doadores
          </p>
          <p className="text-xs text-muted-foreground">
            Maiores contribuições do período.
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
          <Link to={`/campaign/${campaignId}/donors`}>
            Ver todos <ArrowRight size={13} />
          </Link>
        </Button>
      </Card.Header>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Doador</Table.Head>
            <Table.Head className="w-px whitespace-nowrap">Doações</Table.Head>
            <Table.Head className="w-px whitespace-nowrap text-right">Total</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {activity.topDonors.map((donor, index) => (
            <Table.Row key={donor.customerUuid}>
              <Table.Cell className="max-w-0">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-border text-xs font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="truncate text-sm text-(--text-heading)">
                    {donor.customerName}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell className="w-px whitespace-nowrap text-muted-foreground">
                {donor.donationsCount}
              </Table.Cell>
              <Table.Cell className="w-px whitespace-nowrap text-right font-semibold text-(--text-heading)">
                {formatCurrency(String(donor.totalAmount))}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card.Root>
  );
}

export { TopDonorsCard };
