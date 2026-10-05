import { useEffect } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Checkbox } from "~/client/components/ui/checkbox";
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
import { Label } from "~/client/components/ui/label";
import { Separator } from "~/client/components/ui/separator";
import { Textarea } from "~/client/components/ui/textarea";
import { useActionToast } from "~/client/hooks/useActionToast";

type DisableRecurrenceDialogProps = {
  subscriptionUuid: string | null;
  name: string;
  onClose: () => void;
};

function DisableRecurrenceDialog({
  subscriptionUuid,
  name,
  onClose,
}: DisableRecurrenceDialogProps) {
  const fetcher = useFetcher();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast?.type === "success") {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={!!subscriptionUuid} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar recorrência</DialogTitle>
        </DialogHeader>
        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form method="post" className="flex flex-col gap-4">
            <input type="hidden" name="_action" value="disableRecurrence" />
            <input
              type="hidden"
              name="subscriptionUuid"
              value={subscriptionUuid ?? ""}
            />

            <div className="flex flex-col gap-4 px-6">
              <p className="text-sm text-muted-foreground">
                Tem certeza que deseja cancelar a recorrência de{" "}
                <strong className="text-foreground">{name}</strong>?
              </p>

              <FormField name="observation" label="Motivo do cancelamento:" required>
                <Textarea
                  name="observation"
                  rows={3}
                  placeholder="Descreva o motivo..."
                />
              </FormField>

              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="perpetuatePaymentsChange"
                  className="flex cursor-pointer items-center gap-3 font-normal"
                >
                  <Checkbox
                    id="perpetuatePaymentsChange"
                    name="perpetuatePaymentsChange"
                    value="checked"
                    defaultChecked={false}
                    key={subscriptionUuid}
                  />
                  Cancelar cobranças pendentes
                </Label>
                <Label
                  htmlFor="perpetuateNextPaymentsChange"
                  className="flex cursor-pointer items-center gap-3 font-normal"
                >
                  <Checkbox
                    id="perpetuateNextPaymentsChange"
                    name="perpetuateNextPaymentsChange"
                    value="checked"
                    defaultChecked={false}
                    key={subscriptionUuid}
                  />
                  Cancelar próximas cobranças agendadas
                </Label>
              </div>
            </div>

            <Separator />
            <DialogFooter showCloseButton closeButtonLabel="Fechar">
              <Button type="submit" variant="danger" disabled={isSubmitting}>
                {isSubmitting ? "Cancelando..." : "Cancelar recorrência"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { DisableRecurrenceDialog };
