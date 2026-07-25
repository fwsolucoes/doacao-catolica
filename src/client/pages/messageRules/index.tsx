import { useCallback, useState } from "react";
import { Bell, MessageSquare, Plus } from "lucide-react";
import { Tabs } from "radix-ui";
import { useLoaderData } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "~/client/components/ui/button";
import type { MessageRulesLoader } from "~/client/types/messageRulesLoader";
import { BILLING_RULE_TYPES } from "./constants";
import { BillingRulesTab, type NotificationSettingJson } from "./components/billing-rules-tab";
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
  const [editingRule, setEditingRule] = useState<NotificationSettingJson | null>(null);

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
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Automação de notificações
          </h1>
          <p className="text-muted-foreground">
            Configure réguas de cobrança e outras mensagens automáticas.
          </p>
        </div>
        <Button onClick={() => { setEditingRule(null); setDialogOpen(true); }}>
          <Plus size={18} />
          Nova régua de cobrança/mensagem
        </Button>
      </div>

      <Tabs.Root defaultValue="billing">
        <Tabs.List className="mb-5 inline-flex gap-1.5 rounded-2xl border border-border bg-muted/60 p-1.5">
          <Tabs.Trigger
            value="billing"
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors",
              "data-[state=active]:bg-secondary data-[state=active]:text-foreground",
              "hover:text-foreground",
            )}
          >
            <Bell size={16} />
            Réguas de cobrança
            <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-semibold">
              {billingRulesCount}
            </span>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="other"
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors",
              "data-[state=active]:bg-secondary data-[state=active]:text-foreground",
              "hover:text-foreground",
            )}
          >
            <MessageSquare size={16} />
            Outras mensagens
            <span className="rounded-full bg-muted-foreground/15 px-2 py-0.5 text-xs font-semibold">
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
