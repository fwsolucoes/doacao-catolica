import { BarChart3, Pencil, Plus, Target, Trash2, Webhook } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import type { ReactNode } from "react";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { Switch } from "~/client/components/ui/switch";
import {
  buildSteps,
  StepNav,
  StepTabBar,
} from "~/client/components/campaignSettings/stepNav";
import {
  NewWebhookDialog,
  WEBHOOK_EVENTS,
} from "./components/newWebhookDialog";
import { DeleteWebhookDialog } from "./components/deleteWebhookDialog";

type WebhookItem = {
  id: string;
  url: string;
  events: string[]; // event IDs
  enabled: boolean;
};

const SAMPLE_WEBHOOKS: WebhookItem[] = [
  {
    id: "1",
    url: "https://api.suainstituicao.org/webhooks/givehub",
    events: ["payment_approved", "subscription_created"],
    enabled: true,
  },
];

function eventLabel(id: string): string {
  return WEBHOOK_EVENTS.find((e) => e.id === id)?.label ?? id;
}

function IntegrationCard({
  icon,
  title,
  description,
  action,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Card.Root className="flex flex-col gap-0 p-0">
      <div className="flex items-start justify-between gap-4 p-7">
        <div className="flex items-start gap-3.5">
          <div className="flex shrink-0 items-center justify-center rounded-[13px] bg-sidebar-primary/10 p-2.5">
            {icon}
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="shrink-0 pt-1">{action}</div>
      </div>
      {children && (
        <div className="flex flex-col gap-5 px-7 pb-7">{children}</div>
      )}
    </Card.Root>
  );
}

function WebhookRow({
  webhook,
  onToggle,
  onEdit,
  onDelete,
}: {
  webhook: WebhookItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border p-4">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="truncate font-mono text-sm text-foreground">{webhook.url}</p>
        <div className="flex flex-wrap gap-1.5">
          {webhook.events.map((id) => (
            <span key={id} className="rounded-xl bg-muted px-3 py-0.5 text-xs text-foreground">
              {eventLabel(id)}
            </span>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Switch checked={webhook.enabled} onCheckedChange={onToggle} />
        <Button
          variant="ghost"
          size="sm"
          className="size-9 p-0 text-muted-foreground"
          onClick={onEdit}
        >
          <Pencil size={15} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="size-9 p-0 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 size={15} />
        </Button>
      </div>
    </div>
  );
}

function CampaignIntegrationsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const steps = buildSteps(campaignId!);

  const [gaEnabled, setGaEnabled] = useState(true);
  const [metaEnabled, setMetaEnabled] = useState(false);
  const [webhooks, setWebhooks] = useState<WebhookItem[]>(SAMPLE_WEBHOOKS);
  const [newWebhookOpen, setNewWebhookOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<WebhookItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WebhookItem | null>(null);

  function toggleWebhook(id: string) {
    setWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)),
    );
  }

  function deleteWebhook(id: string) {
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie as configurações desta campanha.
        </p>
      </div>

      <StepTabBar steps={steps} />

      <div className="flex items-start gap-8">
        <StepNav steps={steps} />

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* Google Analytics */}
          <IntegrationCard
            icon={<BarChart3 size={20} className="text-sidebar-primary" />}
            title="Google Analytics"
            description="Acompanhe o tráfego da página da campanha e o comportamento dos visitantes."
            action={
              <Switch checked={gaEnabled} onCheckedChange={setGaEnabled} />
            }
          >
            <FormField
              name="gaId"
              label="ID de acompanhamento (Measurement ID)"
            >
              <Input name="gaId" placeholder="G-XXXXXXXXXX" />
              <p className="text-xs text-muted-foreground">
                Encontre em Google Analytics → Administrador → Fluxos de dados.
              </p>
            </FormField>
          </IntegrationCard>

          {/* Meta Ads */}
          <IntegrationCard
            icon={<Target size={20} className="text-sidebar-primary" />}
            title="Meta Ads (Pixel)"
            description="Rastreie conversões e otimize campanhas no Facebook e Instagram."
            action={
              <Switch checked={metaEnabled} onCheckedChange={setMetaEnabled} />
            }
          >
            <FormField name="metaPixelId" label="ID do Pixel">
              <Input name="metaPixelId" placeholder="000000000000000" />
              <p className="text-xs text-muted-foreground">
                Encontre em Gerenciador de Eventos da Meta → Fontes de Dados.
              </p>
            </FormField>
          </IntegrationCard>

          {/* Webhooks */}
          <IntegrationCard
            icon={<Webhook size={20} className="text-sidebar-primary" />}
            title="Webhooks"
            description="Receba notificações HTTP em tempo real quando eventos ocorrerem na campanha."
            action={
              <Button size="sm" onClick={() => setNewWebhookOpen(true)}>
                <Plus size={15} />
                Novo webhook
              </Button>
            }
          >
            {webhooks.length > 0 && (
              <div className="flex flex-col gap-3">
                {webhooks.map((webhook) => (
                  <WebhookRow
                    key={webhook.id}
                    webhook={webhook}
                    onToggle={() => toggleWebhook(webhook.id)}
                    onEdit={() => setEditTarget(webhook)}
                    onDelete={() => setDeleteTarget(webhook)}
                  />
                ))}
              </div>
            )}
          </IntegrationCard>

          <div className="flex justify-end">
            <Button type="button" disabled>
              Salvar alterações
            </Button>
          </div>
        </div>
      </div>

      <NewWebhookDialog
        open={newWebhookOpen}
        onClose={() => setNewWebhookOpen(false)}
      />

      <NewWebhookDialog
        key={editTarget?.id}
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        defaultValues={
          editTarget
            ? { url: editTarget.url, events: editTarget.events }
            : undefined
        }
      />

      <DeleteWebhookDialog
        url={deleteTarget?.url ?? null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteWebhook(deleteTarget.id)}
      />
    </div>
  );
}

export { CampaignIntegrationsPage };
