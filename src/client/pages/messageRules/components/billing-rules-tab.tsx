import { useState } from "react";
import { CheckCircle2, Ellipsis, Plus, Radio, Send, XCircle } from "lucide-react";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Switch } from "~/client/components/ui/switch";
import { Table } from "~/client/components/ui/table";
import { BILLING_RULES } from "../constants";
import { ChannelBadge, PaymentBadge } from "./badges";
import { NewBillingRuleDialog } from "./new-billing-rule-dialog";
import { StatCard } from "./stat-card";

function BillingRulesTab() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeCount = BILLING_RULES.filter((r) => r.active).length;
  const inactiveCount = BILLING_RULES.filter((r) => !r.active).length;
  const channelCount = new Set(BILLING_RULES.flatMap((r) => r.channels)).size;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-5">
        <StatCard
          label="Total"
          value={BILLING_RULES.length}
          subtitle="Templates cadastrados"
          iconBg="bg-blue-100"
          icon={Send}
          iconColor="text-blue-600"
        />
        <StatCard
          label="Ativas"
          value={activeCount}
          subtitle="Em operação"
          iconBg="bg-emerald-100"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Inativas"
          value={inactiveCount}
          subtitle="Pausadas"
          iconBg="bg-rose-100"
          icon={XCircle}
          iconColor="text-rose-500"
        />
        <StatCard
          label="Canais"
          value={channelCount}
          subtitle="Canais utilizados"
          iconBg="bg-purple-100"
          icon={Radio}
          iconColor="text-purple-600"
        />
      </div>

      <Card.Root className="gap-0 p-0">
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 py-5">
          <div className="flex flex-col gap-0.5">
            <p className="text-base font-semibold text-foreground">
              Réguas de cobrança
            </p>
            <p className="text-xs text-muted-foreground">
              Mensagens automáticas antes e após o vencimento.
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus size={18} />
            Nova régua de cobrança
          </Button>
        </div>

        <div className="p-7">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Nome</Table.Head>
                <Table.Head>Canais</Table.Head>
                <Table.Head>Formas de pagamento</Table.Head>
                <Table.Head className="w-28">Ativo</Table.Head>
                <Table.Head className="w-16 text-right">Ações</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {BILLING_RULES.map((rule) => (
                <Table.Row key={rule.id}>
                  <Table.Cell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold">{rule.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {rule.description}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-1.5">
                      {rule.channels.map((ch) => (
                        <ChannelBadge key={ch} channel={ch} />
                      ))}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-1.5">
                      {rule.paymentMethods.map((m) => (
                        <PaymentBadge key={m} method={m} />
                      ))}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Switch checked={rule.active} />
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" className="size-9 rounded-xl">
                        <Ellipsis size={18} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      </Card.Root>

      <NewBillingRuleDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

export { BillingRulesTab };
