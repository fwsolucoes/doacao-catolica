import { TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { PaymentLinkDialog } from "~/client/components/PaymentLinkDialog";
import { Alert } from "~/client/components/ui/alert";
import { Button } from "~/client/components/ui/button";
import { Checkbox } from "~/client/components/ui/checkbox";
import { CurrencyInput } from "~/client/components/ui/currency-input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import {
  FormErrorProvider,
  FormField,
} from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { Label } from "~/client/components/ui/label";
import { RadioGroup } from "~/client/components/ui/radio-group";
import { Select } from "~/client/components/ui/select";
import { Separator } from "~/client/components/ui/separator";
import { Switch } from "~/client/components/ui/switch";
import { Textarea } from "~/client/components/ui/textarea";
import { useActionToast } from "~/client/hooks/useActionToast";

type PaymentType = "pix" | "bank_slip" | "credit_card";

type DonorForUpdate = {
  subscriptionUuid: string;
  payDay: number;
  paymentMethod: string;
  amount: number;
  activeNotification: boolean;
};

type UpdateRecurrenceDialogProps = {
  donor: DonorForUpdate | null;
  onClose: () => void;
};

function toPaymentType(method: string): PaymentType {
  if (method === "bank_slip") return "bank_slip";
  if (method === "credit_card") return "credit_card";
  return "pix";
}

function UpdateRecurrenceDialog({
  donor,
  onClose,
}: UpdateRecurrenceDialogProps) {
  const fetcher = useFetcher();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";

  const [valueType, setValueType] = useState<"fixed" | "undetermined">("fixed");
  const [paymentType, setPaymentType] = useState<PaymentType>("pix");
  const [paymentLinkUuid, setPaymentLinkUuid] = useState<string | null>(null);

  useEffect(() => {
    if (!donor) return;
    setValueType(donor.amount > 0 ? "fixed" : "undetermined");
    setPaymentType(toPaymentType(donor.paymentMethod));
  }, [donor?.subscriptionUuid]);

  useEffect(() => {
    if (fetcher.state !== "idle" || fetcher.data?.toast?.type !== "success") {
      return;
    }
    if (paymentType === "credit_card" && donor) {
      setPaymentLinkUuid(donor.subscriptionUuid);
    }
    onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <>
      <Dialog open={!!donor} onOpenChange={(o) => !o && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar recorrência</DialogTitle>
          </DialogHeader>
          <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
            <fetcher.Form method="post" className="flex flex-col gap-4">
              <input type="hidden" name="_action" value="updateRecurrence" />
              <input
                type="hidden"
                name="paymentId"
                value={donor?.subscriptionUuid ?? ""}
              />
              <div className="flex flex-col gap-4 px-6">
                <FormField name="payDay" label="Dia do vencimento:" required>
                  <Input
                    name="payDay"
                    type="number"
                    min={1}
                    max={31}
                    defaultValue={donor?.payDay}
                    key={donor?.subscriptionUuid}
                  />
                </FormField>

                <FormField name="type" label="Forma de pagamento:" required>
                  <Select.Root
                    name="type"
                    value={paymentType}
                    onValueChange={(v) => setPaymentType(v as PaymentType)}
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="pix">Pix</Select.Item>
                      <Select.Item value="bank_slip">Boleto</Select.Item>
                      <Select.Item value="credit_card">
                        Cartão de crédito
                      </Select.Item>
                    </Select.Content>
                  </Select.Root>
                </FormField>

                {paymentType === "credit_card" && (
                  <Alert.Root variant="warning">
                    <Alert.Icon>
                      <TriangleAlert size={16} />
                    </Alert.Icon>
                    <Alert.Title>Atenção!</Alert.Title>
                    <Alert.Description>
                      O doador precisará acessar o link de pagamento para
                      informar os dados do cartão de crédito.
                    </Alert.Description>
                  </Alert.Root>
                )}

                <FormField name="valueType" label="Tipo de valor:" required>
                  <RadioGroup.Root
                    name="valueType"
                    value={valueType}
                    onValueChange={(v) =>
                      setValueType(v as "fixed" | "undetermined")
                    }
                  >
                    <Label
                      htmlFor="edit-valueType-fixed"
                      className="flex cursor-pointer items-center gap-2 font-normal"
                    >
                      <RadioGroup.Item
                        value="fixed"
                        id="edit-valueType-fixed"
                      />
                      Valor fixo
                    </Label>
                    <Label
                      htmlFor="edit-valueType-undetermined"
                      className="flex cursor-pointer items-center gap-2 font-normal"
                    >
                      <RadioGroup.Item
                        value="undetermined"
                        id="edit-valueType-undetermined"
                      />
                      Valor indeterminado
                    </Label>
                  </RadioGroup.Root>
                </FormField>

                {valueType === "fixed" && (
                  <FormField name="amount" label="Valor:" required>
                    <CurrencyInput
                      min={5}
                      defaultValue={donor?.amount}
                      key={donor?.subscriptionUuid}
                    />
                  </FormField>
                )}

                <FormField name="description" label="Descrição:" required>
                  <Textarea
                    name="description"
                    rows={2}
                    placeholder="Descreva a recorrência..."
                  />
                </FormField>

                <div className="flex items-center justify-between gap-4">
                  <Label
                    htmlFor="activeNotification"
                    className="cursor-pointer font-normal"
                  >
                    Enviar notificações ao doador
                  </Label>
                  <Switch
                    id="activeNotification"
                    name="activeNotification"
                    value="checked"
                    defaultChecked={donor?.activeNotification ?? true}
                    key={donor?.subscriptionUuid}
                  />
                </div>

                <Label
                  htmlFor="perpetuatePaymentsChange"
                  className="flex cursor-pointer items-center gap-3 font-normal"
                >
                  <Checkbox
                    id="perpetuatePaymentsChange"
                    name="perpetuatePaymentsChange"
                    value="checked"
                    defaultChecked={false}
                    key={donor?.subscriptionUuid}
                  />
                  Propagar alterações para cobranças pendentes
                </Label>
              </div>

              <Separator />
              <DialogFooter showCloseButton>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar alterações"}
                </Button>
              </DialogFooter>
            </fetcher.Form>
          </FormErrorProvider>
        </DialogContent>
      </Dialog>
      <PaymentLinkDialog
        paymentUuid={paymentLinkUuid}
        onClose={() => setPaymentLinkUuid(null)}
      />
    </>
  );
}

export { UpdateRecurrenceDialog };
