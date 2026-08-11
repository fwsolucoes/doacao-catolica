import { useCallback, useState } from "react";
import { Bell, MessageSquare, Plus } from "lucide-react";
import { Tabs } from "radix-ui";
import { useLoaderData } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "~/client/components/ui/button";
import type { MessageRulesLoader } from "~/client/types/messageRulesLoader";
import { BILLING_RULE_TYPES } from "./constants";
import {
  BillingRulesTab,
  type NotificationSettingJson,
} from "./components/billing-rules-tab";
import { NewBillingRuleDialog } from "./components/new-billing-rule-dialog";
import { OtherMessagesTab } from "./components/other-messages-tab";

function MessageRulesPage() {
  const { notificationSettings } = useLoaderData<MessageRulesLoader>();
  const billingRulesCount = notificationSettings.filter((s) =>
    BILLING_RULE_TYPES.has(s.type),
  ).length;
  const otherMessagesCount = notificationSettings.filter(
    (s) => !BILLING_RULE_TYPES.has(s.type),
  ).length;

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

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Automação de notificações
          </h1>
          <p className="text-muted-foreground">
            Configure réguas de cobrança e outras mensagens automáticas.
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            setEditingRule(null);
            setDialogOpen(true);
          }}
        >
          <Plus size={18} />
          Nova régua de cobrança / mensagem
        </Button>
      </div>

      <Tabs.Root defaultValue="billing">
        <Tabs.List className="mb-5 flex w-full items-center gap-1 rounded-[13px] border border-border bg-muted/60 p-1.5 sm:w-fit">
          <Tabs.Trigger
            value="billing"
            className={cn(
              "flex h-auto flex-1 items-center gap-2.5 rounded-xl px-3.5 py-1.5 text-base font-semibold text-muted-foreground transition-colors sm:flex-none",
              "data-[state=active]:bg-[#e6e6ed] data-[state=active]:text-foreground data-[state=active]:hover:bg-[#e6e6ed] data-[state=active]:hover:text-foreground",
              "hover:bg-transparent hover:text-muted-foreground",
            )}
          >
            <Bell size={20} className="shrink-0" />
            Réguas de cobrança
            <span className="rounded-full bg-muted-foreground/15 px-2.5 py-0.5 text-xs">
              {billingRulesCount}
            </span>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="other"
            className={cn(
              "flex h-auto flex-1 items-center gap-2.5 rounded-xl px-3.5 py-1.5 text-base font-semibold text-muted-foreground transition-colors sm:flex-none",
              "data-[state=active]:bg-[#e6e6ed] data-[state=active]:text-foreground data-[state=active]:hover:bg-[#e6e6ed] data-[state=active]:hover:text-foreground",
              "hover:bg-transparent hover:text-muted-foreground",
            )}
          >
            <MessageSquare size={20} className="shrink-0" />
            Outras mensagens
            <span className="rounded-full bg-muted-foreground/15 px-2.5 py-0.5 text-xs">
              {otherMessagesCount}
            </span>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="billing">
          <BillingRulesTab onEdit={openEdit} />
        </Tabs.Content>
        <Tabs.Content value="other">
          <OtherMessagesTab />
        </Tabs.Content>
      </Tabs.Root>

      <NewBillingRuleDialog
        key={editingRule?.uuid ?? "new"}
        open={dialogOpen}
        onOpenChange={handleOpenChange}
        rule={editingRule ?? undefined}
      />
    </div>
  );
}

export { MessageRulesPage };
