import { useState } from "react";
import { Button } from "~/client/components/ui/button";
import { Checkbox } from "~/client/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";

const WEBHOOK_EVENTS = [
  { id: "payment_approved", label: "Pagamento aprovado" },
  { id: "payment_declined", label: "Pagamento recusado" },
  { id: "payment_refunded", label: "Pagamento reembolsado" },
  { id: "subscription_created", label: "Assinatura criada" },
  { id: "subscription_cancelled", label: "Assinatura cancelada" },
  { id: "donor_registered", label: "Novo cadastro de doador" },
];

type WebhookDefaultValues = {
  url: string;
  events: string[];
};

type NewWebhookDialogProps = {
  open: boolean;
  onClose: () => void;
  defaultValues?: WebhookDefaultValues;
};

function NewWebhookDialog({ open, onClose, defaultValues }: NewWebhookDialogProps) {
  const isEditing = defaultValues !== undefined;

  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(
    defaultValues
      ? new Set(defaultValues.events)
      : new Set(["payment_approved", "subscription_created"]),
  );

  function toggleEvent(id: string) {
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar webhook" : "Novo webhook"}</DialogTitle>
          <DialogDescription>
            Informe a URL de destino e selecione os eventos que deseja receber.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 px-6">
          <FormField name="webhookUrl" label="URL do endpoint" required>
            <Input
              key={defaultValues?.url}
              name="webhookUrl"
              type="url"
              placeholder="https://exemplo.com/webhooks/givehub"
              defaultValue={defaultValues?.url}
            />
          </FormField>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-foreground">Eventos</span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl border border-border p-4">
              {WEBHOOK_EVENTS.map((event) => (
                <label
                  key={event.id}
                  className="flex cursor-pointer items-center gap-2.5"
                >
                  <Checkbox
                    checked={selectedEvents.has(event.id)}
                    onCheckedChange={() => toggleEvent(event.id)}
                  />
                  <span className="text-sm text-foreground">{event.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter showCloseButton closeButtonLabel="Cancelar">
          <Button type="button" onClick={onClose}>
            {isEditing ? "Salvar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { NewWebhookDialog, WEBHOOK_EVENTS };
