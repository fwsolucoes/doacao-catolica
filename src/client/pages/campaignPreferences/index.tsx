import { useState } from "react";
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
  checked,
  onChange,
}: {
  name: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[13px] border border-border p-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <input type="hidden" name={name} value={checked ? "true" : "false"} />
      <Switch checked={checked} onCheckedChange={onChange} />
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

  const [redirectAfterRegistration, setRedirectAfterRegistration] = useState(
    "",
  );
  const [redirectAfterOneTimePayment, setRedirectAfterOneTimePayment] =
    useState("");
  const [redirectAfterRecurringPayment, setRedirectAfterRecurringPayment] =
    useState("");
  const [nomenclature, setNomenclature] = useState(
    preferences.nomenclature ?? "donation",
  );
  const [supportTagId, setSupportTagId] = useState(
    preferences.supportTagId ?? "",
  );
  const [showPixInvite, setShowPixInvite] = useState(
    preferences.showAutoPixInvite ?? true,
  );
  const [requireLogin, setRequireLogin] = useState(
    preferences.requireLogin ?? false,
  );

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
                <Input name="oneTimePaymentTitle" disabled />
              </FormField>
            </SectionCard>

            <SectionCard
              title="Página de pagamento mensal"
              description="Título exibido no topo da página de pagamento recorrente."
            >
              <FormField name="monthlyPaymentTitle" label="Título">
                <Input name="monthlyPaymentTitle" disabled />
              </FormField>
            </SectionCard>

            <SectionCard
              title="Página de obrigado — doação única"
              description="Mensagem exibida após uma doação avulsa."
            >
              <FormField name="oneTimeThanksTitle" label="Título">
                <Input name="oneTimeThanksTitle" disabled />
              </FormField>
              <FormField name="oneTimeThanksDescription" label="Descrição">
                <Textarea name="oneTimeThanksDescription" disabled />
              </FormField>
            </SectionCard>

            <SectionCard
              title="Página de obrigado — doação mensal"
              description="Mensagem exibida após uma doação recorrente confirmada."
            >
              <FormField name="monthlyThanksTitle" label="Título">
                <Input name="monthlyThanksTitle" disabled />
              </FormField>
              <FormField name="monthlyThanksDescription" label="Descrição">
                <Textarea name="monthlyThanksDescription" disabled />
              </FormField>
            </SectionCard>

            <SectionCard
              title="Página de obrigado — cadastro efetuado"
              description="Mensagem exibida após concluir o cadastro como doador recorrente."
            >
              <FormField name="registrationThanksTitle" label="Título">
                <Input name="registrationThanksTitle" disabled />
              </FormField>
              <FormField name="registrationThanksDescription" label="Descrição">
                <Textarea name="registrationThanksDescription" disabled />
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
                  value={redirectAfterRegistration}
                  onChange={(e) => setRedirectAfterRegistration(e.target.value)}
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
                  value={redirectAfterOneTimePayment}
                  onChange={(e) =>
                    setRedirectAfterOneTimePayment(e.target.value)
                  }
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
                  value={redirectAfterRecurringPayment}
                  onChange={(e) =>
                    setRedirectAfterRecurringPayment(e.target.value)
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
                    value={nomenclature}
                    onValueChange={setNomenclature}
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="donation">Doação</Select.Item>
                      <Select.Item value="contribution">Contribuição</Select.Item>
                      <Select.Item value="offering">Oferta</Select.Item>
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
                    value={supportTagId}
                    onChange={(e) => setSupportTagId(e.target.value)}
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
                checked={showPixInvite}
                onChange={setShowPixInvite}
              />
              <CheckoutToggleRow
                name="requireLogin"
                label="Obrigar login ao se cadastrar"
                description="Exige criação de conta / login para concluir o cadastro do doador."
                checked={requireLogin}
                onChange={setRequireLogin}
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
