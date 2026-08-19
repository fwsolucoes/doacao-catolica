import { Download, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useFetcher, useLoaderData, useParams } from "react-router";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "~/client/components/ui/dialog";
import {
  FormErrorProvider,
  FormField,
} from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Separator } from "~/client/components/ui/separator";
import { Textarea } from "~/client/components/ui/textarea";
import { useActionToast } from "~/client/hooks/useActionToast";
import type { DonationsLoader } from "~/client/types/paymentStatementsLoader";

type Payment = DonationsLoader["payments"]["data"][number];

type ManualPaymentDialogProps = {
  payment: Payment | null;
  onClose: () => void;
  onSuccess?: () => void;
};

function ManualPaymentDialog({
  payment,
  onClose,
  onSuccess,
}: ManualPaymentDialogProps) {
  const { paymentMethods } = useLoaderData<DonationsLoader>();
  const { campaignId } = useParams<{ campaignId: string }>();
  const fetcher = useFetcher();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";

  const [today] = useState(() => new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
      onSuccess?.();
    }
  }, [fetcher.state, fetcher.data, onClose, onSuccess]);

  return (
    <Dialog open={!!payment} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3.5 border-b border-border px-7 py-5 pr-16">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Download size={18} className="text-primary" />
          </div>
          <div className="min-w-0">
            <DialogTitle className="truncate">Baixa manual</DialogTitle>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {payment?.customerName}
            </p>
          </div>
        </div>

        {/* Body */}
        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form method="post" className="flex flex-col">
            <input type="hidden" name="paymentId" value={payment?.id ?? ""} />

            <div className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto px-7 py-6">
              <p className="text-sm text-muted-foreground">
                Deseja dar baixa manual neste pagamento de{" "}
                <strong className="text-foreground">
                  {payment?.customerName}
                </strong>
                ?
              </p>

              <Separator />

              <FormField name="amount" label="Valor recebido:" required>
                <Input
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  defaultValue={payment?.rawAmount}
                />
              </FormField>

              <FormField name="paymentDate" label="Data de pagamento:">
                <Input name="paymentDate" type="date" defaultValue={today} />
              </FormField>

              <FormField name="methodId" label="Forma de pagamento:" required>
                <div className="flex gap-2">
                  <Select.Root name="methodId">
                    <Select.Trigger>
                      <Select.Value placeholder="Selecione uma opção" />
                    </Select.Trigger>
                    <Select.Content>
                      {paymentMethods.map((method) => (
                        <Select.Item key={method.id} value={method.id}>
                          {method.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Button
                    type="button"
                    variant="default"
                    size="icon"
                    className="shrink-0"
                    asChild
                  >
                    <Link to={`/campaign/${campaignId}/payment-methods`}>
                      <Plus size={20} />
                    </Link>
                  </Button>
                </div>
              </FormField>

              <FormField name="bankAccount" label="Conta de recebimento:">
                <Input name="bankAccount" type="text" />
              </FormField>

              <FormField name="observations" label="Observações:">
                <Textarea name="observations" rows={3} />
              </FormField>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 border-t border-border bg-muted/30 px-7 py-3.5">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl px-3.5 text-xs"
                onClick={onClose}
              >
                Fechar
              </Button>
              <Button
                type="submit"
                name="_action"
                value="manualPayment"
                className="h-10 rounded-xl px-3.5 text-xs"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Confirmando..." : "Confirmar"}
              </Button>
            </div>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { ManualPaymentDialog };
