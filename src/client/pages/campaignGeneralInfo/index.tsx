import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  FileText,
  Info,
  Mail,
  MessageCircle,
  Plug,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Link, useFetcher, useLoaderData, useParams } from "react-router";
import { useActionToast } from "~/client/hooks/useActionToast";
import { useRoot } from "~/client/hooks/useRoot";
import { generateSlug } from "~/lib/generateSlug";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { CurrencyInput } from "~/client/components/ui/currency-input";
import {
  FormErrorProvider,
  FormField,
} from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { InputGroup } from "~/client/components/ui/input-group";
import { RadioGroup } from "~/client/components/ui/radio-group";
import { Select } from "~/client/components/ui/select";
import { Switch } from "~/client/components/ui/switch";
import type { CampaignGeneralInfoLoader } from "~/client/types/campaignGeneralInfoLoader";
import { cn } from "~/lib/utils";

type StepItem = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  href?: string;
};

const STEPS: Omit<StepItem, "href">[] = [
  { icon: Info, label: "Informações Gerais", active: true },
  { icon: FileText, label: "Página da Campanha" },
  { icon: CreditCard, label: "Valores e Pagamento" },
  { icon: Mail, label: "Email" },
  { icon: Search, label: "Metadados SEO" },
  { icon: Plug, label: "Integrações" },
  { icon: MessageCircle, label: "Conexão WhatsApp" },
  { icon: SlidersHorizontal, label: "Preferências" },
];

const STEP_PATHS: Record<string, string> = {
  "Informações Gerais": "settings/general-info",
  "Valores e Pagamento": "settings/payment-methods",
};

function buildSteps(campaignId: string): StepItem[] {
  return STEPS.map((step) => ({
    ...step,
    href: STEP_PATHS[step.label]
      ? `/campaign/${campaignId}/${STEP_PATHS[step.label]}`
      : undefined,
  }));
}

// "DD/MM/YYYY - hh:mm" → "YYYY-MM-DD"
function toDateInput(formatted: string | null | undefined): string {
  if (!formatted) return "";
  const datePart = formatted.split(" - ")[0];
  if (!datePart) return "";
  const [day, month, year] = datePart.split("/");
  if (!day || !month || !year) return "";
  return `${year}-${month}-${day}`;
}

type DonationType = "MONTHLY" | "ONETIME" | "BOTH";

const DONATION_TYPE_OPTIONS: {
  value: DonationType;
  label: string;
  desc: string;
}[] = [
  {
    value: "MONTHLY",
    label: "Doação Mensal",
    desc: "Aceita apenas doações recorrentes mensais",
  },
  {
    value: "ONETIME",
    label: "Doação Única",
    desc: "Aceita apenas doações pontuais",
  },
  {
    value: "BOTH",
    label: "Mensal e Única",
    desc: "Aceita ambos os tipos de doação",
  },
];

function StepNav({ steps }: { steps: StepItem[] }) {
  return (
    <aside className="hidden lg:flex flex-col gap-2 w-60 shrink-0 sticky top-6 self-start">
      {steps.map(({ icon: Icon, label, active, href }) => {
        const className = cn(
          "flex items-center gap-3.5 rounded-[13px] px-4 py-3 text-base font-semibold transition-colors",
          active
            ? "bg-sidebar-primary text-white"
            : href
              ? "text-muted-foreground hover:bg-muted"
              : "text-muted-foreground cursor-default",
        );
        if (href && !active) {
          return (
            <Link key={label} to={href} className={className}>
              <Icon size={19} className="shrink-0" />
              {label}
            </Link>
          );
        }
        return (
          <div key={label} className={className}>
            <Icon size={19} className="shrink-0" />
            {label}
          </div>
        );
      })}
    </aside>
  );
}

function StepTabBar({ steps }: { steps: StepItem[] }) {
  return (
    <nav className="flex lg:hidden overflow-x-auto gap-1 pb-1">
      {steps.map(({ icon: Icon, label, active, href }) => {
        const className = cn(
          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors",
          active
            ? "bg-sidebar-primary text-white"
            : href
              ? "text-muted-foreground hover:bg-muted"
              : "text-muted-foreground/40 cursor-not-allowed",
        );
        if (href && !active) {
          return (
            <Link key={label} to={href} className={className}>
              <Icon size={15} className="shrink-0" />
              {label}
            </Link>
          );
        }
        return (
          <div key={label} className={className}>
            <Icon size={15} className="shrink-0" />
            {label}
          </div>
        );
      })}
    </nav>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card.Root className="flex flex-col gap-6 p-6">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {children}
    </Card.Root>
  );
}

function CampaignGeneralInfoPage() {
  const { campaign } = useLoaderData<CampaignGeneralInfoLoader>();
  const { campaignId } = useParams<{ campaignId: string }>();
  const { SANCTON_DONATION_CHECKOUT_URL } = useRoot().environmentVariables;
  const slugPrefix = SANCTON_DONATION_CHECKOUT_URL.endsWith("/")
    ? SANCTON_DONATION_CHECKOUT_URL
    : `${SANCTON_DONATION_CHECKOUT_URL}/`;
  const { Form, state, data } = useFetcher();
  const isSubmitting = state === "submitting";
  useActionToast(data);

  const slugFetcher = useFetcher<{ available: boolean }>();
  const isVerifying = slugFetcher.state === "submitting";
  const [currentSlugValue, setCurrentSlugValue] = useState(campaign.slug);
  const [lastVerifiedSlug, setLastVerifiedSlug] = useState<string | null>(null);
  const slugResult =
    slugFetcher.data !== undefined && currentSlugValue === lastVerifiedSlug
      ? slugFetcher.data
      : null;

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentSlugValue(generateSlug(e.target.value));
  }

  function handleVerifySlug() {
    const slug = currentSlugValue.trim();
    if (!slug) return;
    setLastVerifiedSlug(slug);
    slugFetcher.submit(
      { _action: "verifySlug", slug },
      {
        method: "post",
        action: `/campaign/${campaignId}/settings/general-info`,
      },
    );
  }

  const [isActive, setIsActive] = useState(campaign.status);
  const [isPublic, setIsPublic] = useState(campaign.published);
  const [donationType, setDonationType] = useState<DonationType>(
    (campaign.typeDonation as DonationType) ?? "ONETIME",
  );

  const startDateValue = toDateInput(campaign.startDate);
  const endDateValue = toDateInput(campaign.endDate);
  const steps = buildSteps(campaignId!);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie as configurações gerais da campanha.
        </p>
      </div>

      <StepTabBar steps={steps} />

      <div className="flex gap-8 items-start">
        <StepNav steps={steps} />

        <FormErrorProvider fieldErrors={data?.cause?.fieldErrors}>
          <Form
            method="post"
            action={`/campaign/${campaignId}/settings/general-info`}
            className="flex flex-1 flex-col gap-6 min-w-0"
          >
            {/* Dados da Campanha */}
            <SectionCard title="Dados da Campanha">
              <FormField name="name" label="Nome da Campanha" required>
                <Input
                  name="name"
                  placeholder="Ex.: Educação para Todos"
                  defaultValue={campaign.name}
                />
              </FormField>

              <div className="flex flex-col gap-2">
                <FormField name="slug" label="Slug (URL)">
                  <div className="flex items-center gap-2.5">
                    <InputGroup.Root className="flex-1">
                      <InputGroup.Side>{slugPrefix}</InputGroup.Side>
                      <InputGroup.Input
                        name="slug"
                        placeholder="minha-campanha"
                        value={currentSlugValue}
                        onChange={handleSlugChange}
                        className="focus-visible:ring-0"
                      />
                    </InputGroup.Root>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-[38px] shrink-0 rounded-[11px] text-xs"
                      disabled={isVerifying}
                      onClick={handleVerifySlug}
                    >
                      {isVerifying ? "Verificando..." : "Verificar"}
                    </Button>
                  </div>
                </FormField>
                {slugResult !== null && (
                  <div
                    className={cn(
                      "flex items-center gap-1.5 text-xs",
                      slugResult.available
                        ? "text-emerald-600"
                        : "text-destructive",
                    )}
                  >
                    <CheckCircle2 size={17} className="shrink-0" />
                    <span>
                      {slugResult.available
                        ? "Slug disponível"
                        : "Este slug já está em uso"}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField name="category" label="Categoria">
                  <Select.Root name="category" defaultValue="paroquia">
                    <Select.Trigger>
                      <Select.Value placeholder="Selecione a categoria" />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="paroquia">Paróquia</Select.Item>
                      <Select.Item value="comunidade">Comunidade</Select.Item>
                      <Select.Item value="missao">Missão</Select.Item>
                      <Select.Item value="outro">Outro</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </FormField>

                <FormField name="status" label="Status">
                  <div className="flex h-[43px] items-center justify-between rounded-[11px] border border-border px-4">
                    <span className="text-sm font-semibold text-foreground">
                      {isActive ? "Campanha ativa" : "Campanha inativa"}
                    </span>
                    <input
                      type="hidden"
                      name="status"
                      value={isActive ? "active" : "inactive"}
                    />
                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                  </div>
                </FormField>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField name="startDate" label="Data de início">
                  <InputGroup.Root>
                    <InputGroup.Addon>
                      <Calendar size={16} />
                    </InputGroup.Addon>
                    <InputGroup.Input
                      type="date"
                      name="startDate"
                      defaultValue={startDateValue}
                      className="cursor-pointer bg-muted pl-9"
                    />
                  </InputGroup.Root>
                </FormField>

                <FormField name="endDate" label="Data de término">
                  <InputGroup.Root>
                    <InputGroup.Addon>
                      <Calendar size={16} />
                    </InputGroup.Addon>
                    <InputGroup.Input
                      type="date"
                      name="endDate"
                      defaultValue={endDateValue}
                      className="cursor-pointer bg-muted pl-9"
                    />
                  </InputGroup.Root>
                </FormField>
              </div>

              <div className="flex flex-col gap-1">
                <FormField
                  name="phone"
                  label="WhatsApp do responsável pela campanha"
                >
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="(11) 90000-0000"
                    defaultValue={campaign.phone ?? ""}
                  />
                </FormField>
                <p className="text-xs text-muted-foreground">
                  Usado para avisos e comunicação interna. Não é exibido
                  publicamente.
                </p>
              </div>
            </SectionCard>

            {/* Visibilidade */}
            <SectionCard title="Visibilidade">
              <div className="flex flex-col gap-3">
                <RadioGroup.Root
                  value={isPublic ? "public" : "private"}
                  onValueChange={(v) => setIsPublic(v === "public")}
                  className="flex-col sm:flex-row"
                >
                  <input
                    type="hidden"
                    name="published"
                    value={isPublic ? "true" : "false"}
                  />
                  {(
                    [
                      {
                        value: "public",
                        label: "Pública",
                        desc: "Qualquer pessoa pode visualizar e acessar a campanha",
                      },
                      {
                        value: "private",
                        label: "Privada",
                        desc: "Apenas pessoas com o link podem acessar",
                      },
                    ] as const
                  ).map(({ value, label, desc }) => {
                    const selected =
                      (value === "public" && isPublic) ||
                      (value === "private" && !isPublic);
                    return (
                      <label
                        key={value}
                        className={cn(
                          "flex flex-1 cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50",
                        )}
                      >
                        <RadioGroup.Item value={value} className="mt-0.5" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">{label}</span>
                          <span className="text-xs text-muted-foreground">
                            {desc}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </RadioGroup.Root>
              </div>
            </SectionCard>

            {/* Tipo da Campanha */}
            <SectionCard title="Tipo da Campanha">
              <input type="hidden" name="typeDonation" value={donationType} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {DONATION_TYPE_OPTIONS.map(({ value, label, desc }) => (
                  <Button
                    key={value}
                    type="button"
                    variant="ghost"
                    onClick={() => setDonationType(value)}
                    className={cn(
                      "h-auto flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors hover:brightness-100",
                      donationType === value
                        ? "border-primary bg-primary/5 hover:bg-primary/5"
                        : "border-border hover:bg-muted/50",
                    )}
                  >
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-xs text-muted-foreground">
                      {desc}
                    </span>
                  </Button>
                ))}
              </div>
            </SectionCard>

            {/* Metas de Arrecadação */}
            <SectionCard title="Metas de Arrecadação">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField name="totalGoal" label="Meta total">
                  <CurrencyInput
                    name="totalGoal"
                    defaultValue={
                      campaign.totalGoal
                        ? parseFloat(campaign.totalGoal)
                        : undefined
                    }
                    placeholder="0,00"
                  />
                </FormField>

                <FormField name="monthlyGoal" label="Meta mensal">
                  <CurrencyInput
                    name="monthlyGoal"
                    defaultValue={
                      campaign.monthlyGoal
                        ? parseFloat(campaign.monthlyGoal)
                        : undefined
                    }
                    placeholder="0,00"
                  />
                </FormField>
              </div>
            </SectionCard>

            {/* Instituição Recebedora */}
            <SectionCard title="Instituição Recebedora">
              <FormField name="institutionName" label="Nome da instituição">
                <Input
                  name="institutionName"
                  placeholder="Nome da organização"
                  defaultValue={campaign.institutionName ?? ""}
                />
              </FormField>

              <FormField name="cnpj" label="CNPJ">
                <Input
                  name="cnpj"
                  placeholder="00.000.000/0000-00"
                  defaultValue={campaign.cnpj ?? ""}
                />
              </FormField>

              <FormField name="address" label="Endereço">
                <Input
                  name="address"
                  placeholder="Rua, número, cidade — UF"
                  defaultValue={campaign.address ?? ""}
                />
              </FormField>
            </SectionCard>

            <div className="flex justify-end">
              <Button
                type="submit"
                name="_action"
                value="updateGeneralInfo"
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

export { CampaignGeneralInfoPage };
