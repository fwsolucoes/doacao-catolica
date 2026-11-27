import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Checkbox } from "~/client/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { useActionToast } from "~/client/hooks/useActionToast";
import type { WebhookItem } from "../types";
import { ALL_EVENTS, WEBHOOK_EVENTS } from "../webhookEvents";

const DEFAULT_EVENTS = ["payment.confirmed", "subscription.created"];
const KNOWN_EVENT_IDS = WEBHOOK_EVENTS.map((event) => event.id);

type WebhookFormDialogProps = {
  open: boolean;
  /** null → criação; preenchido → edição */
  webhook: WebhookItem | null;
  onClose: () => void;
};

function initialEvents(webhook: WebhookItem | null): Set<string> {
  if (!webhook) return new Set(DEFAULT_EVENTS);
  if (webhook.events.includes(ALL_EVENTS)) return new Set(KNOWN_EVENT_IDS);
  return new Set(webhook.events);
}

function WebhookFormDialog({ open, webhook, onClose }: WebhookFormDialogProps) {
  const fetcher = useFetcher();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";
  const isEditing = !!webhook;

  // Controlado: os checkboxes alimentam um único hidden input `events`
  // (o decode do body não preserva chaves repetidas do FormData).
  const [selectedEvents, setSelectedEvents] = useState(() => initialEvents(webhook));

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast?.type === "success") {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  function toggleEvent(id: string, checked: boolean) {
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function serializeEvents(): string {
    const allSelected = KNOWN_EVENT_IDS.every((id) => selectedEvents.has(id));
    // mantém o "*" (todos, inclusive futuros) se o webhook já assinava tudo
    if (allSelected && webhook?.events.includes(ALL_EVENTS)) return ALL_EVENTS;
    // preserva eventos que a API devolveu mas que o formulário não conhece
    const unknown = (webhook?.events ?? []).filter(
      (id) => id !== ALL_EVENTS && !KNOWN_EVENT_IDS.includes(id),
    );
    const known = KNOWN_EVENT_IDS.filter((id) => selectedEvents.has(id));
    return [...known, ...unknown].join(",");
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="gap-5">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar webhook" : "Novo webhook"}</DialogTitle>
          <DialogDescription className="text-base">
            Informe a URL de destino e selecione os eventos que deseja receber.
          </DialogDescription>
        </DialogHeader>

        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form method="post" className="flex flex-col gap-5">
            {webhook && <input type="hidden" name="id" value={webhook.id} />}
            <input type="hidden" name="events" value={serializeEvents()} />

            <div className="flex flex-col gap-5 px-6">
              <FormField name="url" label="URL do endpoint" required>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  placeholder="https://exemplo.com/webhooks/doacoes"
                  defaultValue={webhook?.url ?? ""}
                  autoFocus
                />
              </FormField>

              <FormField name="events" label="Eventos" required>
                <div className="grid gap-x-4 gap-y-3 rounded-2xl border border-border p-4 sm:grid-cols-2">
                  {WEBHOOK_EVENTS.map((event) => (
                    <label
                      key={event.id}
                      className="flex cursor-pointer items-center gap-2.5"
                    >
                      <Checkbox
                        checked={selectedEvents.has(event.id)}
                        onCheckedChange={(checked) =>
                          toggleEvent(event.id, checked === true)
                        }
                      />
                      <span className="text-base text-foreground">{event.label}</span>
                    </label>
                  ))}
                </div>
              </FormField>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                name="_action"
                value={isEditing ? "updateWebhook" : "createWebhook"}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : isEditing ? "Salvar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { WebhookFormDialog };
