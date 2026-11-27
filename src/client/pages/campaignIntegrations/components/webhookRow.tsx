import { Pencil, Trash2 } from "lucide-react";
import { useFetcher } from "react-router";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Switch } from "~/client/components/ui/switch";
import { useActionToast } from "~/client/hooks/useActionToast";
import type { WebhookItem } from "../types";
import { WEBHOOK_EVENT_LABEL } from "../webhookEvents";

type WebhookRowProps = {
  webhook: WebhookItem;
  onEdit: (webhook: WebhookItem) => void;
  onDelete: (webhook: WebhookItem) => void;
};

function WebhookRow({ webhook, onEdit, onDelete }: WebhookRowProps) {
  const fetcher = useFetcher();
  useActionToast(fetcher.data);

  // otimista: reflete o valor enviado enquanto a requisição está em andamento
  const pendingActive = fetcher.formData?.get("active");
  const active = pendingActive ? pendingActive === "true" : webhook.active;

  function handleToggle(checked: boolean) {
    fetcher.submit(
      { _action: "toggleWebhook", id: webhook.id, active: String(checked) },
      { method: "post" },
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-[13px] border border-border p-4">
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <p className="truncate font-mono text-base text-foreground">{webhook.url}</p>
        {webhook.events.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {webhook.events.map((event) => {
              const label = WEBHOOK_EVENT_LABEL[event];
              return (
                <Badge
                  key={event}
                  className={
                    label
                      ? "bg-muted font-normal text-foreground"
                      : "bg-muted font-normal text-muted-foreground"
                  }
                >
                  {label ?? event}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Switch
          checked={active}
          onCheckedChange={handleToggle}
          disabled={fetcher.state !== "idle"}
          aria-label={active ? "Desativar webhook" : "Ativar webhook"}
          className="mr-1"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-11 p-0 text-foreground"
          aria-label="Editar webhook"
          onClick={() => onEdit(webhook)}
        >
          <Pencil size={19} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-11 p-0 text-destructive"
          aria-label="Excluir webhook"
          onClick={() => onDelete(webhook)}
        >
          <Trash2 size={19} />
        </Button>
      </div>
    </div>
  );
}

export { WebhookRow };
