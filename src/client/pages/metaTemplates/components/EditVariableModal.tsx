import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useFetcher } from "react-router";
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
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { useActionToast } from "~/client/hooks/useActionToast";
import type { WhatsappTemplateDetailVariable } from "~/domain/views/whatsappTemplateDetail";

const SYSTEM_FIELDS: Record<string, string> = {
  "customers.name": "Nome do doador",
  "customers.email": "E-mail do doador",
  "customers.phone": "Telefone do doador",
  "payments.amount": "Valor do pagamento",
  "payments.due_date": "Vencimento do pagamento",
  "payments.gross_value": "Valor bruto do pagamento",
  "subscriptions.start_date": "Data de início da assinatura",
  "accounts.name": "Nome da organização",
};

type EditVariableModalProps = {
  open: boolean;
  variable: WhatsappTemplateDetailVariable | null;
  onClose: () => void;
};

function EditVariableModal({ open, variable, onClose }: EditVariableModalProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  const [systemField, setSystemField] = useState(variable?.systemField ?? "");
  const [description, setDescription] = useState(variable?.description ?? "");

  useActionToast(fetcher.data);

  useEffect(() => {
    if (variable) {
      setSystemField(variable.systemField);
      setDescription(variable.description ?? "");
    }
  }, [variable]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!variable) return;

      fetcher.submit(
        {
          _action: "save_variable",
          variable_uuid: variable.uuid,
          system_field: systemField,
          description,
        },
        { method: "post" },
      );
    },
    [variable, systemField, description, fetcher],
  );

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar variável</DialogTitle>
          <DialogDescription>
            Defina o tipo, o valor e a descrição desta variável.
          </DialogDescription>
        </DialogHeader>

        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 px-6">
              <FormField name="system_field" label="Dado do sistema" required>
                <Select.Root value={systemField} onValueChange={setSystemField}>
                  <Select.Trigger>
                    <Select.Value placeholder="Selecionar campo..." />
                  </Select.Trigger>
                  <Select.Content>
                    {Object.entries(SYSTEM_FIELDS).map(([value, label]) => (
                      <Select.Item key={value} value={value}>
                        {label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </FormField>

              <FormField name="description" label="Descrição" optional>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Nome do doador"
                />
              </FormField>
            </div>

            <DialogFooter showCloseButton>
              <Button type="submit" isLoading={isSubmitting}>
                Salvar variável
              </Button>
            </DialogFooter>
          </form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { EditVariableModal, SYSTEM_FIELDS };
