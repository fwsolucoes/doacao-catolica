# Campaign General Info — Card Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extrair as cinco seções de `CampaignGeneralInfoPage` em componentes separados dentro de `components/`, tornando `index.tsx` um orquestrador limpo sem estado local.

**Architecture:** Cada card recebe como prop apenas os dados que precisa. Cards com estado (`CampaignDataCard`, `VisibilityCard`, `DonationTypeCard`) gerenciam seu próprio estado internamente e comunicam o valor ao form via `<input type="hidden">`. Cards sem estado (`FundraisingGoalsCard`, `ReceivingInstitutionCard`) usam `defaultValue` diretamente.

**Tech Stack:** React 19, React Router v7, TypeScript, Tailwind CSS v4, shadcn/ui

## Global Constraints

- Usar sempre `Button` do design system, nunca `<button>` nativo
- Named imports do React (`useState`), nunca `import * as React`
- Sem mudança de comportamento ou estilo — refactoring puro
- `SectionCard` é duplicado em cada arquivo de card (wrapper simples, não justifica arquivo próprio)
- TypeScript deve compilar sem erros após cada tarefa

---

### Task 1: CampaignDataCard

**Files:**
- Create: `src/client/pages/campaignGeneralInfo/components/CampaignDataCard.tsx`

**Interfaces:**
- Consumes: `CampaignGeneralInfoLoader["campaign"]`, `SlugField` de `../SlugField`
- Produces: `CampaignDataCard({ campaign, campaignId, slugPrefix })` exportado nomeado

- [ ] **Step 1: Criar o arquivo**

```tsx
import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { InputGroup } from "~/client/components/ui/input-group";
import { Select } from "~/client/components/ui/select";
import { Switch } from "~/client/components/ui/switch";
import type { CampaignGeneralInfoLoader } from "~/client/types/campaignGeneralInfoLoader";
import { SlugField } from "../SlugField";

type Campaign = CampaignGeneralInfoLoader["campaign"];

type CampaignDataCardProps = {
  campaign: Campaign;
  campaignId: string;
  slugPrefix: string;
};

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

function CampaignDataCard({ campaign, campaignId, slugPrefix }: CampaignDataCardProps) {
  const [isActive, setIsActive] = useState(campaign.status);
  const startDateValue = campaign.startDateInput ?? "";
  const endDateValue = campaign.endDateInput ?? "";

  return (
    <SectionCard title="Dados da Campanha">
      <FormField name="name" label="Nome da Campanha" required>
        <Input
          name="name"
          placeholder="Ex.: Educação para Todos"
          defaultValue={campaign.name}
        />
      </FormField>

      <SlugField
        campaignId={campaignId}
        slugPrefix={slugPrefix}
        defaultSlug={campaign.slug}
      />

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
          <div className="flex h-10.75 items-center justify-between rounded-[11px] border border-border px-4">
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
        <FormField name="phone" label="WhatsApp do responsável pela campanha">
          <Input
            name="phone"
            type="tel"
            placeholder="(11) 90000-0000"
            defaultValue={campaign.phone ?? ""}
          />
        </FormField>
        <p className="text-xs text-muted-foreground">
          Usado para avisos e comunicação interna. Não é exibido publicamente.
        </p>
      </div>
    </SectionCard>
  );
}

export { CampaignDataCard };
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | grep "CampaignDataCard"
```

Esperado: nenhuma saída (sem erros no arquivo novo).

---

### Task 2: VisibilityCard

**Files:**
- Create: `src/client/pages/campaignGeneralInfo/components/VisibilityCard.tsx`

**Interfaces:**
- Consumes: `defaultPublished: boolean`
- Produces: `VisibilityCard({ defaultPublished })` exportado nomeado

- [ ] **Step 1: Criar o arquivo**

```tsx
import { useState } from "react";
import { Card } from "~/client/components/ui/card";
import { RadioGroup } from "~/client/components/ui/radio-group";
import { cn } from "~/lib/utils";

type VisibilityCardProps = {
  defaultPublished: boolean;
};

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

function VisibilityCard({ defaultPublished }: VisibilityCardProps) {
  const [isPublic, setIsPublic] = useState(defaultPublished);

  return (
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
                  <span className="text-xs text-muted-foreground">{desc}</span>
                </div>
              </label>
            );
          })}
        </RadioGroup.Root>
      </div>
    </SectionCard>
  );
}

export { VisibilityCard };
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | grep "VisibilityCard"
```

Esperado: nenhuma saída.

---

### Task 3: DonationTypeCard

**Files:**
- Create: `src/client/pages/campaignGeneralInfo/components/DonationTypeCard.tsx`

**Interfaces:**
- Consumes: `defaultType: string` (valores esperados: `"MONTHLY"`, `"ONETIME"`, `"BOTH"`)
- Produces: `DonationTypeCard({ defaultType })` exportado nomeado; `DonationType` e `DONATION_TYPE_OPTIONS` ficam internos ao arquivo

- [ ] **Step 1: Criar o arquivo**

```tsx
import { useState } from "react";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { cn } from "~/lib/utils";

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

type DonationTypeCardProps = {
  defaultType: string;
};

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

function DonationTypeCard({ defaultType }: DonationTypeCardProps) {
  const [donationType, setDonationType] = useState<DonationType>(
    (defaultType as DonationType) || "ONETIME",
  );

  return (
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
            <span className="text-xs text-muted-foreground">{desc}</span>
          </Button>
        ))}
      </div>
    </SectionCard>
  );
}

export { DonationTypeCard };
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | grep "DonationTypeCard"
```

Esperado: nenhuma saída.

---

### Task 4: FundraisingGoalsCard

**Files:**
- Create: `src/client/pages/campaignGeneralInfo/components/FundraisingGoalsCard.tsx`

**Interfaces:**
- Consumes: `campaign: CampaignGeneralInfoLoader["campaign"]`
- Produces: `FundraisingGoalsCard({ campaign })` exportado nomeado

- [ ] **Step 1: Criar o arquivo**

```tsx
import { Card } from "~/client/components/ui/card";
import { CurrencyInput } from "~/client/components/ui/currency-input";
import { FormField } from "~/client/components/ui/form-field";
import type { CampaignGeneralInfoLoader } from "~/client/types/campaignGeneralInfoLoader";

type Campaign = CampaignGeneralInfoLoader["campaign"];

type FundraisingGoalsCardProps = {
  campaign: Campaign;
};

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

function FundraisingGoalsCard({ campaign }: FundraisingGoalsCardProps) {
  return (
    <SectionCard title="Metas de Arrecadação">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField name="totalGoal" label="Meta total">
          <CurrencyInput
            name="totalGoal"
            defaultValue={
              campaign.totalGoal ? parseFloat(campaign.totalGoal) : undefined
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
  );
}

export { FundraisingGoalsCard };
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | grep "FundraisingGoalsCard"
```

Esperado: nenhuma saída.

---

### Task 5: ReceivingInstitutionCard

**Files:**
- Create: `src/client/pages/campaignGeneralInfo/components/ReceivingInstitutionCard.tsx`

**Interfaces:**
- Consumes: `campaign: CampaignGeneralInfoLoader["campaign"]`
- Produces: `ReceivingInstitutionCard({ campaign })` exportado nomeado

- [ ] **Step 1: Criar o arquivo**

```tsx
import { Card } from "~/client/components/ui/card";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import type { CampaignGeneralInfoLoader } from "~/client/types/campaignGeneralInfoLoader";

type Campaign = CampaignGeneralInfoLoader["campaign"];

type ReceivingInstitutionCardProps = {
  campaign: Campaign;
};

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

function ReceivingInstitutionCard({ campaign }: ReceivingInstitutionCardProps) {
  return (
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
  );
}

export { ReceivingInstitutionCard };
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | grep "ReceivingInstitutionCard"
```

Esperado: nenhuma saída.

---

### Task 6: Atualizar index.tsx

**Files:**
- Modify: `src/client/pages/campaignGeneralInfo/index.tsx`

**Interfaces:**
- Consumes: os cinco componentes criados nas tarefas anteriores
- Produces: `CampaignGeneralInfoPage` sem estado local, importando os cards de `./components/`

- [ ] **Step 1: Substituir o conteúdo de index.tsx**

```tsx
import { useFetcher, useLoaderData, useParams } from "react-router";
import { useActionToast } from "~/client/hooks/useActionToast";
import { useRoot } from "~/client/hooks/useRoot";
import { Button } from "~/client/components/ui/button";
import { FormErrorProvider } from "~/client/components/ui/form-field";
import type { CampaignGeneralInfoLoader } from "~/client/types/campaignGeneralInfoLoader";
import {
  buildSteps,
  StepNav,
  StepTabBar,
} from "~/client/components/campaignSettings/stepNav";
import { CampaignDataCard } from "./components/CampaignDataCard";
import { DonationTypeCard } from "./components/DonationTypeCard";
import { FundraisingGoalsCard } from "./components/FundraisingGoalsCard";
import { ReceivingInstitutionCard } from "./components/ReceivingInstitutionCard";
import { VisibilityCard } from "./components/VisibilityCard";

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
            <CampaignDataCard
              campaign={campaign}
              campaignId={campaignId!}
              slugPrefix={slugPrefix}
            />
            <VisibilityCard defaultPublished={campaign.published} />
            <DonationTypeCard defaultType={campaign.typeDonation ?? "ONETIME"} />
            <FundraisingGoalsCard campaign={campaign} />
            <ReceivingInstitutionCard campaign={campaign} />

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
```

- [ ] **Step 2: Verificar TypeScript completo**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1
```

Esperado: nenhum erro de TypeScript.
