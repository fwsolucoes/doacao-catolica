import { useEffect, useState } from "react";
import { useFetcher, useParams } from "react-router";
import { useActionToast } from "~/client/hooks/useActionToast";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { Select } from "~/client/components/ui/select";
import { Separator } from "~/client/components/ui/separator";
import { Textarea } from "~/client/components/ui/textarea";

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Imagem 1 -->
          <tr><td><img src="{{imagem_1}}" alt="Banner" style="width: 100%; height: auto; display: block;"></td></tr>
          <!-- Corpo -->
          <tr><td style="padding: 24px;">{{corpo_email}}</td></tr>
          <!-- Imagem 2 -->
          <tr><td><img src="{{imagem_2}}" alt="Rodapé" style="width: 100%; height: auto; display: block;"></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

function TipBanner() {
  return (
    <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <span className="text-xs font-semibold text-amber-800">Dica:</span>
      <span className="text-xs text-amber-700">
        Use tabelas para layout de email (não CSS Grid/Flexbox). Inclua as
        variáveis
      </span>
      <code className="font-mono text-xs text-amber-700">{"{{imagem_1}}"}</code>
      <span className="text-xs text-amber-700">,</span>
      <code className="font-mono text-xs text-amber-700">{"{{imagem_2}}"}</code>
      <span className="text-xs text-amber-700">e</span>
      <code className="font-mono text-xs text-amber-700">
        {"{{corpo_email}}"}
      </code>
      <span className="text-xs text-amber-700">no HTML.</span>
    </div>
  );
}

const TEMPLATE_TYPES: { value: string; label: string }[] = [
  { value: "payment_before_due_date", label: "Pagamento antes do vencimento" },
  { value: "payment_on_due_date", label: "Pagamento no vencimento" },
  { value: "payment_after_due_date", label: "Pagamento após o vencimento" },
  { value: "payment_paid", label: "Pagamento realizado" },
  { value: "payment_settled", label: "Pagamento liquidado" },
  { value: "subscription_created_internally", label: "Assinatura criada internamente" },
  { value: "subscription_created_externally", label: "Assinatura criada externamente" },
  { value: "default_recovery", label: "Recuperação padrão" },
  { value: "subscription_canceled", label: "Assinatura cancelada" },
  { value: "donator_birthday", label: "Aniversário do doador" },
  { value: "instant_reminder", label: "Lembrete instantâneo" },
  { value: "credit_card_created", label: "Cartão de crédito cadastrado" },
  { value: "donate_now", label: "Doe agora" },
  { value: "pending_automatic_pix_authorization", label: "Autorização Pix automático pendente" },
];

type NewLayoutDialogProps = {
  open: boolean;
  onClose: () => void;
};

function NewLayoutDialog({ open, onClose }: NewLayoutDialogProps) {
  const { campaignId } = useParams<{ campaignId: string }>();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";
  const [selectedType, setSelectedType] = useState("");
  useActionToast(fetcher.data);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Novo layout</DialogTitle>
          <DialogDescription>
            Configure o HTML e as informações do layout.
          </DialogDescription>
        </DialogHeader>

        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form
            method="post"
            action={`/campaign/${campaignId}/settings/email`}
            className="contents"
          >
            <div className="flex flex-col gap-5 overflow-y-auto px-6">
              <FormField name="type" label="Tipo do layout" required>
                <Select.Root value={selectedType} onValueChange={setSelectedType}>
                  <Select.Trigger>
                    <Select.Value placeholder="Selecione o tipo..." />
                  </Select.Trigger>
                  <Select.Content>
                    {TEMPLATE_TYPES.map((t) => (
                      <Select.Item key={t.value} value={t.value}>
                        {t.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <input type="hidden" name="type" value={selectedType} />
              </FormField>

              <FormField name="body" label="HTML do layout" required>
                <Textarea
                  name="body"
                  className="min-h-72 font-mono text-xs"
                  defaultValue={DEFAULT_HTML}
                />
              </FormField>

              <TipBanner />
            </div>

            <Separator />

            <DialogFooter showCloseButton closeButtonLabel="Cancelar">
              <Button
                type="submit"
                name="_action"
                value="createEmailTemplate"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Salvar layout"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { NewLayoutDialog };
