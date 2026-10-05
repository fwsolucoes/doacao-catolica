import { useFetcher, useLoaderData, useParams } from "react-router";
import { useActionToast } from "~/client/hooks/useActionToast";
import { Button } from "~/client/components/ui/button";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Switch } from "~/client/components/ui/switch";
import { Textarea } from "~/client/components/ui/textarea";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import {
  buildSteps,
  StepNav,
  StepTabBar,
} from "~/client/components/campaignSettings/stepNav";
import type { CampaignPreferencesSettingsLoader } from "~/client/types/campaignPreferencesSettingsLoader";

function CheckoutToggleRow({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[13px] border border-border p-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <Switch name={name} value="true" defaultChecked={defaultChecked} />
    </div>
  );
}

function CampaignPreferencesPage() {
  const { preferences } = useLoaderData<CampaignPreferencesSettingsLoader>();
  const { campaignId } = useParams<{ campaignId: string }>();
  const { Form, state, data } = useFetcher();
  const isSubmitting = state === "submitting";
  useActionToast(data);

  const steps = buildSteps(campaignId!);

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
            action={`/campaign/${campaignId}/settings/preferences`}
            className="flex min-w-0 flex-1 flex-col gap-6"
          >
            <div className="flex flex-col gap-0.5">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Preferências
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure textos, redirecionamentos e comportamentos do fluxo de
                doação.
              </p>
            </div>

            <SectionCard
              title="Página de pagamento de doação avulsa"
              description="Título exibido no topo da página de pagamento avulsa."
            >
              <FormField name="oneTimePaymentTitle" label="Título">
                <Input
                  name="oneTimePaymentTitle"
                  defaultValue={preferences.oneTimePaymentTitle ?? ""}
                />
              </FormField>
            </SectionCard>

            <SectionCard
              title="Página de pagamento mensal"
              description="Título exibido no topo da página de pagamento recorrente."
            >
              <FormField name="monthlyPaymentTitle" label="Título">
                <Input
                  name="monthlyPaymentTitle"
                  defaultValue={preferences.monthlyPaymentTitle ?? ""}
                />
              </FormField>
            </SectionCard>

            <SectionCard
              title="Página de obrigado — doação única"
              description="Mensagem exibida após uma doação avulsa."
            >
              <FormField name="oneTimeThanksTitle" label="Título">
                <Input
                  name="oneTimeThanksTitle"
                  defaultValue={preferences.oneTimeThanksTitle ?? ""}
                />
              </FormField>
              <FormField name="oneTimeThanksDescription" label="Descrição">
                <Textarea
                  name="oneTimeThanksDescription"
                  defaultValue={preferences.oneTimeThanksDescription ?? ""}
                />
              </FormField>
            </SectionCard>

            <SectionCard
              title="Página de obrigado — doação mensal"
              description="Mensagem exibida após uma doação recorrente confirmada."
            >
              <FormField name="monthlyThanksTitle" label="Título">
                <Input
                  name="monthlyThanksTitle"
                  defaultValue={preferences.monthlyThanksTitle ?? ""}
                />
              </FormField>
              <FormField name="monthlyThanksDescription" label="Descrição">
                <Textarea
                  name="monthlyThanksDescription"
                  defaultValue={preferences.monthlyThanksDescription ?? ""}
                />
              </FormField>
            </SectionCard>

            <SectionCard
              title="Página de obrigado — cadastro efetuado"
              description="Mensagem exibida após concluir o cadastro como doador recorrente."
            >
              <FormField name="registrationThanksTitle" label="Título">
                <Input
                  name="registrationThanksTitle"
                  defaultValue={preferences.registrationThanksTitle ?? ""}
                />
              </FormField>
              <FormField name="registrationThanksDescription" label="Descrição">
                <Textarea
                  name="registrationThanksDescription"
                  defaultValue={preferences.registrationThanksDescription ?? ""}
                />
              </FormField>
            </SectionCard>

            <SectionCard
              title="Redirecionamentos"
              description="Defina para onde o doador será enviado após cada etapa do fluxo de doação."
            >
              <FormField
                name="redirectAfterRegistration"
                label="URL após cadastro como doador recorrente"
              >
                <Input
                  name="redirectAfterRegistration"
                  type="url"
                  placeholder="https://..."
                  defaultValue={preferences.redirectAfterRegistration ?? ""}
                />
              </FormField>
              <FormField
                name="redirectAfterOneTimePayment"
                label="URL após pagamento pontual"
              >
                <Input
                  name="redirectAfterOneTimePayment"
                  type="url"
                  placeholder="https://..."
                  defaultValue={preferences.redirectAfterOneTimePayment ?? ""}
                />
              </FormField>
              <FormField
                name="redirectAfterRecurringPayment"
                label="URL após pagamento recorrente"
              >
                <Input
                  name="redirectAfterRecurringPayment"
                  type="url"
                  placeholder="https://..."
                  defaultValue={
                    preferences.redirectAfterRecurringPayment ?? ""
                  }
                />
              </FormField>
            </SectionCard>

            <SectionCard
              title="Nomenclatura e identificação"
              description="Como as contribuições serão chamadas nas telas e comunicações."
            >
              <div className="grid grid-cols-2 gap-5">
                <FormField name="nomenclature" label="Nomenclatura">
                  <Select.Root
                    name="nomenclature"
                    defaultValue={preferences.nomenclature ?? "donation"}
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="donation">Doação</Select.Item>
                      <Select.Item value="payment">Pagamento</Select.Item>
                      <Select.Item value="mensalidade">Mensalidade</Select.Item>
                      <Select.Item value="tithe">Dízimo</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </FormField>
                <FormField
                  name="supportTagId"
                  label="Tag no sistema de atendimento (Tag ID)"
                >
                  <Input
                    name="supportTagId"
                    placeholder="Ex: 12345"
                    defaultValue={preferences.supportTagId ?? ""}
                  />
                </FormField>
              </div>
            </SectionCard>

            <SectionCard
              title="Comportamento do checkout"
              description="Ajustes que impactam a experiência do doador."
            >
              <CheckoutToggleRow
                name="showAutoPixInvite"
                label="Mostrar convite para PIX automático"
                description="Exibe uma sugestão para ativar o PIX automático na tela de pagamento."
                defaultChecked={preferences.showAutoPixInvite ?? true}
              />
              <CheckoutToggleRow
                name="requireLogin"
                label="Obrigar login ao se cadastrar"
                description="Exige criação de conta / login para concluir o cadastro do doador."
                defaultChecked={preferences.requireLogin ?? false}
              />
            </SectionCard>

            <div className="flex justify-end">
              <Button
                type="submit"
                name="_action"
                value="updatePreferencesSettings"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </Form>
        </FormErrorProvider>
      </div>
    </div>
  );
}

export { CampaignPreferencesPage };
