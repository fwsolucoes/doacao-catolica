import { CheckCircle2, Ellipsis, Radio, Send, XCircle } from "lucide-react";
import { useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Switch } from "~/client/components/ui/switch";
import { Table } from "~/client/components/ui/table";
import { NOTIFICATION_TYPES } from "~/client/constants/notificationTypes";
import type { MessageRulesLoader } from "~/client/types/messageRulesLoader";
import { BILLING_RULE_TYPES } from "../constants";
import { ChannelBadge, PaymentBadge } from "./badges";
import { StatCard } from "./stat-card";

function OtherMessagesTab() {
  const { notificationSettings } = useLoaderData<MessageRulesLoader>();

  const otherMessages = notificationSettings.filter(
    (s) => !BILLING_RULE_TYPES.has(s.type),
  );

  const activeCount = otherMessages.filter((r) => r.active).length;
  const inactiveCount = otherMessages.filter((r) => !r.active).length;
  const channelSet = new Set<string>();
  for (const r of otherMessages) {
    if (r.enableWhatsapp) channelSet.add("whatsapp");
    if (r.enableMail) channelSet.add("email");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-5">
        <StatCard
          label="Total"
          value={otherMessages.length}
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
          value={channelSet.size}
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
              Outras mensagens
            </p>
            <p className="text-xs text-muted-foreground">
              Mensagens automáticas de confirmação e agradecimento.
            </p>
          </div>
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
              {otherMessages.map((rule) => {
                const channels = [
                  rule.enableWhatsapp && "whatsapp",
                  rule.enableMail && "email",
                ].filter(Boolean) as string[];

                const paymentMethods = [
                  rule.enablePix && "pix",
                  rule.enableCreditCard && "credit_card",
                  rule.enableBankSlip && "bank_slip",
                ].filter(Boolean) as string[];

                return (
                  <Table.Row key={rule.uuid}>
                    <Table.Cell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold">{rule.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {NOTIFICATION_TYPES[rule.type] ?? rule.type}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-wrap gap-1.5">
                        {channels.map((ch) => (
                          <ChannelBadge key={ch} channel={ch} />
                        ))}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-wrap gap-1.5">
                        {paymentMethods.map((m) => (
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
                );
              })}
            </Table.Body>
          </Table.Root>
        </div>
      </Card.Root>
    </div>
  );
}

export { OtherMessagesTab };
