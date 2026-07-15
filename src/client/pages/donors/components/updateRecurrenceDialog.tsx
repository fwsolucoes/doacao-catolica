import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/client/components/ui/button";
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

function toPaymentType(method: string): "pix" | "bank_slip" {
  return method === "bank_slip" ? "bank_slip" : "pix";
}

function UpdateRecurrenceDialog({
  donor,
  onClose,
}: UpdateRecurrenceDialogProps) {
  const fetcher = useFetcher();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";

  const [paymentType, setPaymentType] = useState<"pix" | "bank_slip">("pix");
  const [valueType, setValueType] = useState<"fixed" | "undetermined">("fixed");
  const [activeNotification, setActiveNotification] = useState(true);
  const [perpetuate, setPerpetuate] = useState(false);

  useEffect(() => {
    if (!donor) return;
    setPaymentType(toPaymentType(donor.paymentMethod));
    setValueType(donor.amount > 0 ? "fixed" : "undetermined");
    setActiveNotification(donor.activeNotification);
    setPerpetuate(false);
  }, [donor?.subscriptionUuid]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast?.type === "success") {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
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
            <input
              type="hidden"
              name="activeNotification"
              value={activeNotification ? "checked" : ""}
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
                  onValueChange={(v) =>
                    setPaymentType(v as "pix" | "bank_slip")
                  }
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="pix">Pix</Select.Item>
                    <Select.Item value="bank_slip">Boleto</Select.Item>
                  </Select.Content>
                </Select.Root>
              </FormField>

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
                    <RadioGroup.Item value="fixed" id="edit-valueType-fixed" />
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
                  className="cursor-pointer font-normal"
                  onClick={() => setActiveNotification((v) => !v)}
                >
                  Enviar notificações ao doador
                </Label>
                <Switch
                  checked={activeNotification}
                  onCheckedChange={setActiveNotification}
                />
              </div>

              <Label className="flex cursor-pointer items-center gap-3 font-normal">
                <input
                  type="checkbox"
                  name="perpetuatePaymentsChange"
                  value="checked"
                  checked={perpetuate}
                  onChange={(e) => setPerpetuate(e.target.checked)}
                  className="size-4"
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
  );
}

export { UpdateRecurrenceDialog };
