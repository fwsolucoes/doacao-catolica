import { useCallback, useState } from "react";
import {
  CheckCircle2,
  Ellipsis,
  Pencil,
  Plus,
  Radio,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import { useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { Table } from "~/client/components/ui/table";
import { NOTIFICATION_TYPES } from "~/client/constants/notificationTypes";
import type { MessageRulesLoader } from "~/client/types/messageRulesLoader";
import { BILLING_RULE_TYPES } from "../constants";
import { ChannelBadge, PaymentBadge } from "./badges";
import { DeleteNotificationSettingDialog } from "./delete-notification-setting-dialog";
import { NewBillingRuleDialog } from "./new-billing-rule-dialog";
import { NotificationSettingSwitch } from "./notification-setting-switch";
import { StatCard } from "./stat-card";

type NotificationSettingJson =
  MessageRulesLoader["notificationSettings"][number];

function BillingRulesTab() {
  const { notificationSettings } = useLoaderData<MessageRulesLoader>();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] =
    useState<NotificationSettingJson | null>(null);

  const handleOpenChange = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingRule(null);
  }, []);

  const openEdit = useCallback((rule: NotificationSettingJson) => {
    setEditingRule(rule);
    setDialogOpen(true);
  }, []);

  const [deletingRule, setDeletingRule] =
    useState<NotificationSettingJson | null>(null);
  const closeDeleteDialog = useCallback(() => setDeletingRule(null), []);

  const billingRules = notificationSettings.filter((s) =>
    BILLING_RULE_TYPES.has(s.type),
  );

  const activeCount = billingRules.filter((r) => r.active).length;
  const inactiveCount = billingRules.filter((r) => !r.active).length;
  const channelSet = new Set<string>();
  for (const r of billingRules) {
    if (r.enableWhatsapp) channelSet.add("whatsapp");
    if (r.enableMail) channelSet.add("email");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard
          label="Total"
          value={billingRules.length}
          subtitle="Templates cadastrados"
          iconBg="bg-[rgba(var(--spotlight-info),0.1)]"
          icon={Send}
          iconColor="text-[rgb(var(--spotlight-info))]"
        />
        <StatCard
          label="Ativas"
          value={activeCount}
          subtitle="Em operação"
          iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
          icon={CheckCircle2}
          iconColor="text-[rgb(var(--spotlight-success))]"
        />
        <StatCard
          label="Inativas"
          value={inactiveCount}
          subtitle="Pausadas"
          iconBg="bg-[rgba(var(--spotlight-danger),0.1)]"
          icon={XCircle}
          iconColor="text-[rgb(var(--spotlight-danger))]"
        />
        <StatCard
          label="Canais"
          value={channelSet.size}
          subtitle="Canais utilizados"
          iconBg="bg-[rgba(var(--spotlight-primary),0.1)]"
          icon={Radio}
          iconColor="text-[rgb(var(--spotlight-primary))]"
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
            <Plus size={16} />
            Nova Régua de Cobrança
          </Button>
        </div>

        <div className="overflow-x-auto p-7">
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
              {billingRules.map((rule) => {
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
                          {rule.days > 0 ? ` (${rule.days} dias)` : ""}
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
                      <NotificationSettingSwitch
                        uuid={rule.uuid}
                        active={rule.active}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-9 rounded-xl"
                            >
                              <Ellipsis size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => openEdit(rule)}>
                              <Pencil />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={() => setDeletingRule(rule)}
                            >
                              <Trash2 />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
              {!billingRules.length && <Table.Empty />}
            </Table.Body>
          </Table.Root>
        </div>
      </Card.Root>

      <DeleteNotificationSettingDialog
        rule={deletingRule}
        onClose={closeDeleteDialog}
      />
      <NewBillingRuleDialog
        key={editingRule?.uuid ?? "new"}
        open={dialogOpen}
        onOpenChange={handleOpenChange}
        rule={editingRule ?? undefined}
      />
    </div>
  );
}

export { BillingRulesTab };
export type { NotificationSettingJson };
