import { BarChart3, Pencil, Plus, Tag, Target, Trash2, Webhook } from "lucide-react";
import { useState } from "react";
import { useFetcher, useLoaderData, useParams } from "react-router";
import type { ReactNode } from "react";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { useActionToast } from "~/client/hooks/useActionToast";
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
import type { CampaignIntegrationsLoader } from "~/client/types/campaignIntegrationsLoader";

type WebhookItem = {
  id: string;
  url: string;
  events: string[]; // event IDs
};

const SAMPLE_WEBHOOKS: WebhookItem[] = [
  {
    id: "1",
    url: "https://api.suainstituicao.org/webhooks/givehub",
    events: ["payment_approved", "subscription_created"],
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
  action?: ReactNode;
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
        {action && <div className="shrink-0 pt-1">{action}</div>}
      </div>
      {children && (
        <div className="flex flex-col gap-5 px-7 pb-7">{children}</div>
      )}
    </Card.Root>
  );
}

function WebhookRow({
  webhook,
  onEdit,
  onDelete,
}: {
  webhook: WebhookItem;
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
  const { integrations } = useLoaderData<CampaignIntegrationsLoader>();
  const { Form, state, data } = useFetcher();
  const isSubmitting = state === "submitting";
  useActionToast(data);
  const steps = buildSteps(campaignId!);

  const [webhooks, setWebhooks] = useState<WebhookItem[]>(SAMPLE_WEBHOOKS);
  const [newWebhookOpen, setNewWebhookOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<WebhookItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WebhookItem | null>(null);

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

        <FormErrorProvider fieldErrors={data?.cause?.fieldErrors}>
          <Form
            method="post"
            className="flex min-w-0 flex-1 flex-col gap-6"
          >
            {/* Google Analytics */}
            <IntegrationCard
              icon={<BarChart3 size={20} className="text-sidebar-primary" />}
              title="Google Analytics"
              description="Acompanhe o tráfego da página da campanha e o comportamento dos visitantes."
            >
              <FormField
                name="googleAnalyticsPixel"
                label="ID de acompanhamento (Measurement ID)"
              >
                <Input
                  name="googleAnalyticsPixel"
                  placeholder="G-XXXXXXXXXX"
                  defaultValue={integrations.googleAnalyticsPixel ?? ""}
                />
                <p className="text-xs text-muted-foreground">
                  Encontre em Google Analytics → Administrador → Fluxos de dados.
                </p>
              </FormField>
            </IntegrationCard>

            {/* Google Tag Manager */}
            <IntegrationCard
              icon={<Tag size={20} className="text-sidebar-primary" />}
              title="Google Tag Manager"
              description="Gerencie tags e scripts de rastreamento sem precisar editar o código da campanha."
            >
              <FormField name="googleTagManagerPixel" label="ID do Contêiner">
                <Input
                  name="googleTagManagerPixel"
                  placeholder="GTM-XXXXXXX"
                  defaultValue={integrations.googleTagManagerPixel ?? ""}
                />
                <p className="text-xs text-muted-foreground">
                  Encontre em Google Tag Manager → Administrador → Contêiner.
                </p>
              </FormField>
            </IntegrationCard>

            {/* Meta Ads */}
            <IntegrationCard
              icon={<Target size={20} className="text-sidebar-primary" />}
              title="Meta Ads (Pixel)"
              description="Rastreie conversões e otimize campanhas no Facebook e Instagram."
            >
              <FormField name="facebookPixel" label="ID do Pixel">
                <Input
                  name="facebookPixel"
                  placeholder="000000000000000"
                  defaultValue={integrations.facebookPixel ?? ""}
                />
                <p className="text-xs text-muted-foreground">
                  Encontre em Gerenciador de Eventos da Meta → Fontes de Dados.
                </p>
              </FormField>
            </IntegrationCard>

            {/* Webhooks — desabilitado temporariamente */}
            {/* <IntegrationCard
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
                      onEdit={() => setEditTarget(webhook)}
                      onDelete={() => setDeleteTarget(webhook)}
                    />
                  ))}
                </div>
              )}
            </IntegrationCard> */}

            <div className="flex justify-end">
              <Button
                type="submit"
                name="_action"
                value="updateIntegrations"
                disabled={isSubmitting}
              >
                Salvar alterações
              </Button>
            </div>
          </Form>
        </FormErrorProvider>
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
