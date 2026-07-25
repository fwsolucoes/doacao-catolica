import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Mail } from "lucide-react";
import { Tabs } from "radix-ui";
import { cn } from "~/lib/utils";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Switch } from "~/client/components/ui/switch";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { useActionToast } from "~/client/hooks/useActionToast";
import { NOTIFICATION_TYPES } from "~/client/constants/notificationTypes";
import type { MessageRulesLoader } from "~/client/types/messageRulesLoader";
import { EmailTab } from "./email-tab";
import { WhatsAppTab } from "./whatsapp-tab";

type NotificationSettingJson = MessageRulesLoader["notificationSettings"][number];

const CHANNEL_TABS = [
  { value: "whatsapp", label: "WhatsApp", icon: <WhatsAppIcon size={16} /> },
  { value: "email", label: "E-mail", icon: <Mail size={16} /> },
];

type PaymentMethods = { pix: boolean; cartao: boolean; boleto: boolean };

function NewBillingRuleDialog({
  open,
  onOpenChange,
  rule,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: NotificationSettingJson;
}) {
  const isEditing = !!rule;
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  const [activeChannel, setActiveChannel] = useState("whatsapp");
  const [messageType, setMessageType] = useState(rule?.type ?? "");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>({
    pix: rule?.enablePix ?? true,
    cartao: rule?.enableCreditCard ?? true,
    boleto: rule?.enableBankSlip ?? true,
  });

  useActionToast(fetcher.data);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast?.type === "success") {
      onOpenChange(false);
    }
  }, [fetcher.state, fetcher.data, onOpenChange]);

  function togglePayment(method: keyof PaymentMethods) {
    setPaymentMethods((prev) => ({ ...prev, [method]: !prev[method] }));
  }

  const showDaysField =
    messageType === "payment_before_due_date" ||
    messageType === "payment_after_due_date";

return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[90vw] max-w-[90vw] sm:max-w-[90vw] flex-col gap-0 p-0">
        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form method="post" className="flex min-h-0 flex-1 flex-col">
            {isEditing && <input type="hidden" name="uuid" value={rule.uuid} />}
            <input type="hidden" name="type" value={messageType} />
            <input
              type="hidden"
              name="enablePix"
              value={paymentMethods.pix ? "true" : "false"}
            />
            <input
              type="hidden"
              name="enableCreditCard"
              value={paymentMethods.cartao ? "true" : "false"}
            />
            <input
              type="hidden"
              name="enableBankSlip"
              value={paymentMethods.boleto ? "true" : "false"}
            />
            {!showDaysField && <input type="hidden" name="days" value="0" />}

            <DialogHeader className="shrink-0 px-7 pb-5 pt-7">
              <DialogTitle>
                {isEditing ? "Editar régua de cobrança" : "Nova régua de cobrança"}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-7 pb-7">
              <div className="grid grid-cols-2 gap-5">
                <FormField name="name" label="Nome da mensagem" required>
                  <Input
                    name="name"
                    placeholder="Ex.: Lembrete 3 dias antes"
                    defaultValue={rule?.name}
                  />
                </FormField>
                <FormField name="type" label="Tipo de mensagem" required>
                  <Select.Root value={messageType} onValueChange={setMessageType}>
                    <Select.Trigger>
                      <Select.Value placeholder="Selecione o tipo" />
                    </Select.Trigger>
                    <Select.Content>
                      {Object.entries(NOTIFICATION_TYPES).map(([value, label]) => (
                        <Select.Item key={value} value={value}>
                          {label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </FormField>
              </div>

              {showDaysField && (
                <div className="max-w-80">
                  <FormField
                    name="days"
                    label={
                      messageType === "payment_before_due_date"
                        ? "Dias antes do vencimento"
                        : "Dias após o vencimento"
                    }
                  >
                    <Input
                      name="days"
                      type="number"
                      defaultValue={rule?.days ?? 3}
                      min={1}
                      max={messageType === "payment_before_due_date" ? 5 : 1000}
                    />
                  </FormField>
                </div>
              )}

              <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-5">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-foreground">
                    Formas de pagamento ativas
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Esta mensagem será enviada apenas para doações com as formas
                    selecionadas.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["pix", "cartao", "boleto"] as const).map((method) => {
                    const label =
                      method === "cartao"
                        ? "Cartão"
                        : method.charAt(0).toUpperCase() + method.slice(1);
                    return (
                      <div
                        key={method}
                        className={cn(
                          "flex items-center justify-between rounded-xl border bg-muted px-4 py-2.5",
                          paymentMethods[method] ? "border-primary/40" : "border-border",
                        )}
                      >
                        <span className="text-sm font-semibold text-foreground">
                          {label}
                        </span>
                        <Switch
                          checked={paymentMethods[method]}
                          onCheckedChange={() => togglePayment(method)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-border pt-5">
                <p className="text-sm font-semibold text-foreground">
                  Mensagens por canal
                </p>

                <Tabs.Root value={activeChannel} onValueChange={setActiveChannel}>
                  <Tabs.List className="inline-flex gap-1.5 rounded-2xl border border-border bg-muted/60 p-1.5">
                    {CHANNEL_TABS.map((tab) => (
                      <Tabs.Trigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                          "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors",
                          "data-[state=active]:bg-secondary data-[state=active]:text-foreground",
                          "hover:text-foreground",
                        )}
                      >
                        {tab.icon}
                        {tab.label}
                      </Tabs.Trigger>
                    ))}
                  </Tabs.List>

                  <Tabs.Content
                    value="whatsapp"
                    className="mt-5 data-[state=inactive]:hidden"
                    forceMount
                  >
                    <WhatsAppTab defaultMessage={rule?.whatsappMessage} />
                  </Tabs.Content>
                  <Tabs.Content
                    value="email"
                    className="mt-5 data-[state=inactive]:hidden"
                    forceMount
                  >
                    <EmailTab
                      defaultSubject={rule?.mailSubject}
                      defaultBody={rule?.mailMessage}
                    />
                  </Tabs.Content>
                </Tabs.Root>
              </div>
            </div>

            <DialogFooter className="shrink-0 border-t border-border px-7 py-5">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button
                type="submit"
                name="_action"
                value={isEditing ? "updateNotificationSetting" : "createNotificationSetting"}
                isLoading={isSubmitting}
              >
                Salvar
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { NewBillingRuleDialog };
