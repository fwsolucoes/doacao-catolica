import { BarChart3, Plus, Tag, Target, Webhook } from "lucide-react";
import { useCallback, useState } from "react";
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
import { DeleteWebhookDialog } from "./components/deleteWebhookDialog";
import { WebhookFormDialog } from "./components/webhookFormDialog";
import { WebhookRow } from "./components/webhookRow";
import type { WebhookItem } from "./types";
import type { CampaignIntegrationsLoader } from "~/client/types/campaignIntegrationsLoader";

// A API aceita até 10 URLs por account
const MAX_WEBHOOKS = 10;

const INTEGRATIONS_FORM_ID = "campaign-integrations-form";

type DialogState =
  | { type: "form"; webhook: WebhookItem | null }
  | { type: "delete"; webhook: WebhookItem }
  | null;

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

function CampaignIntegrationsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { integrations, webhooks } = useLoaderData<CampaignIntegrationsLoader>();
  const { Form, state, data } = useFetcher();
  const isSubmitting = state === "submitting";
  useActionToast(data);
  const steps = buildSteps(campaignId!);

  const [dialog, setDialog] = useState<DialogState>(null);
  // remonta o formulário a cada abertura: descarta fetcher.data e o estado dos
  // checkboxes da abertura anterior sem cortar a animação de fechamento
  const [formKey, setFormKey] = useState(0);
  const closeDialog = useCallback(() => setDialog(null), []);
  const openForm = useCallback((webhook: WebhookItem | null) => {
    setFormKey((key) => key + 1);
    setDialog({ type: "form", webhook });
  }, []);
  const openDelete = useCallback(
    (webhook: WebhookItem) => setDialog({ type: "delete", webhook }),
    [],
  );
  const reachedLimit = webhooks.length >= MAX_WEBHOOKS;

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
          <FormErrorProvider fieldErrors={data?.cause?.fieldErrors}>
            <Form
              id={INTEGRATIONS_FORM_ID}
              method="post"
              className="flex flex-col gap-6"
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
            </Form>
          </FormErrorProvider>

          {/* Webhooks — salvos individualmente, fora do formulário de pixels */}
          <IntegrationCard
            icon={<Webhook size={20} className="text-sidebar-primary" />}
            title="Webhooks"
            description="Receba notificações HTTP em tempo real quando eventos ocorrerem na campanha."
            action={
              <Button
                type="button"
                onClick={() => openForm(null)}
                disabled={reachedLimit}
                title={
                  reachedLimit
                    ? `Limite de ${MAX_WEBHOOKS} webhooks atingido.`
                    : undefined
                }
              >
                <Plus size={19} />
                Novo webhook
              </Button>
            }
          >
            {webhooks.length > 0 ? (
              <div className="flex flex-col gap-3">
                {webhooks.map((webhook) => (
                  <WebhookRow
                    key={webhook.id}
                    webhook={webhook}
                    onEdit={openForm}
                    onDelete={openDelete}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-[13px] border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                Nenhum webhook cadastrado.
              </p>
            )}
          </IntegrationCard>

          <div className="flex justify-end">
            {/* fora do <Form>, ligado a ele pelo atributo `form` */}
            <Button
              type="submit"
              form={INTEGRATIONS_FORM_ID}
              name="_action"
              value="updateIntegrations"
              disabled={isSubmitting}
            >
              Salvar alterações
            </Button>
          </div>
        </div>
      </div>

      <WebhookFormDialog
        key={formKey}
        open={dialog?.type === "form"}
        webhook={dialog?.type === "form" ? dialog.webhook : null}
        onClose={closeDialog}
      />

      <DeleteWebhookDialog
        webhook={dialog?.type === "delete" ? dialog.webhook : null}
        onClose={closeDialog}
      />
    </div>
  );
}

export { CampaignIntegrationsPage };
