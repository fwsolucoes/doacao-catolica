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
import { SYSTEM_FIELDS } from "./EditVariableModal";

type AddVariableModalProps = {
  open: boolean;
  onClose: () => void;
};

function AddVariableModal({ open, onClose }: AddVariableModalProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  const [systemField, setSystemField] = useState("");
  const [description, setDescription] = useState("");

  useActionToast(fetcher.data);

  useEffect(() => {
    if (!open) {
      setSystemField("");
      setDescription("");
    }
  }, [open]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      fetcher.submit(
        { _action: "add_variable", system_field: systemField, description },
        { method: "post" },
      );
    },
    [systemField, description, fetcher],
  );

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar variável</DialogTitle>
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
                Adicionar variável
              </Button>
            </DialogFooter>
          </form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { AddVariableModal };
