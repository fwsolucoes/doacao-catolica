# Switch de ativação "Por que doar" e "Sobre nós" — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar um switch no header dos cards "Por que doar" e "Sobre nós" na tela Página da Campanha; quando desativado, os campos ficam visualmente desabilitados e o estado é persistido nos campos `why_donate_enabled` / `about_us_enabled` da API.

**Architecture:** O switch usa o slot `action` já existente no `SectionCard`. O valor boolean é submetido via `<input type="hidden">` como string `"true"/"false"`, transformado no schema interno e propagado pelo use case até o gateway. Nos componentes, `useState` controla o estado local e um wrapper com `pointer-events-none opacity-50` desabilita visualmente os campos sem removê-los do FormData.

**Tech Stack:** React Router v7, React 19, Tailwind CSS v4, Zod v4, `~/client/components/ui/switch`

## Global Constraints

- Nunca usar `<button>` nativo — usar `<Button>` do design system
- Nunca usar `import * as React` — usar named imports (`useState`, `cn`, etc.)
- Arquivos e identificadores sempre em inglês; textos de UI em português
- Tailwind: usar escala numérica; nunca `bg-(--token)` — usar `bg-primary`, `bg-card`, etc.
- Não commitar — o usuário revisa na IDE antes de commitar
- Não usar `fieldset disabled` (exclui valores do FormData); usar `pointer-events-none opacity-50` no wrapper

---

## Mapa de arquivos

| Arquivo | Ação |
|---|---|
| `src/infra/schemas/external/campaignPreferences.ts` | Modificar — adicionar campos `why_donate_enabled` e `about_us_enabled` |
| `src/domain/gateways/campaignPreferences.ts` | Modificar — adicionar campos em `CampaignPreferences` e `UpdateCampaignPreferencesInput` |
| `src/infra/gateways/campaignPreferences.ts` | Modificar — mapear novos campos no get e no update |
| `src/infra/schemas/internal/campaign.ts` | Modificar — adicionar campos com transform string→boolean |
| `src/app/useCases/campaign/updateCampaignPageUseCase.ts` | Modificar — adicionar campos em `InputProps` e repassar ao gateway |
| `src/client/pages/campaignPage/whyDonateSection.tsx` | Modificar — adicionar switch e estado de habilitação |
| `src/client/pages/campaignPage/aboutUsSection.tsx` | Modificar — adicionar switch e estado de habilitação |

---

### Task 1: Tipos e schema externo

**Files:**
- Modify: `src/infra/schemas/external/campaignPreferences.ts`
- Modify: `src/domain/gateways/campaignPreferences.ts`

**Interfaces:**
- Produces: `CampaignPreferences.whyDonateEnabled: boolean | null`, `CampaignPreferences.aboutUsEnabled: boolean | null`; mesmos campos em `UpdateCampaignPreferencesInput`

- [ ] **Adicionar campos no external schema**

  Arquivo: `src/infra/schemas/external/campaignPreferences.ts`

  Adicionar após o campo `about_us_image` (antes de `support_whatsapp`):
  ```ts
  why_donate_enabled: z
    .boolean()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  about_us_enabled: z
    .boolean()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  ```

- [ ] **Adicionar campos nos tipos do domain gateway**

  Arquivo: `src/domain/gateways/campaignPreferences.ts`

  Em `type CampaignPreferences`, adicionar após `aboutUsImage`:
  ```ts
  whyDonateEnabled: boolean | null;
  aboutUsEnabled: boolean | null;
  ```

  Em `type UpdateCampaignPreferencesInput`, adicionar após `aboutUsImage`:
  ```ts
  whyDonateEnabled: boolean | null;
  aboutUsEnabled: boolean | null;
  ```

---

### Task 2: Infra gateway — mapear e enviar os novos campos

**Files:**
- Modify: `src/infra/gateways/campaignPreferences.ts`

**Interfaces:**
- Consumes: `CampaignPreferences.whyDonateEnabled`, `CampaignPreferences.aboutUsEnabled`, `UpdateCampaignPreferencesInput.whyDonateEnabled`, `UpdateCampaignPreferencesInput.aboutUsEnabled` (definidos na Task 1)

- [ ] **Mapear os campos no método `getCampaignPreferences`**

  Arquivo: `src/infra/gateways/campaignPreferences.ts`

  No objeto `return` de `getCampaignPreferences`, adicionar após `aboutUsImage`:
  ```ts
  whyDonateEnabled: data.why_donate_enabled,
  aboutUsEnabled: data.about_us_enabled,
  ```

- [ ] **Incluir os campos no body do método `updateCampaignPreferences`**

  No objeto `body` de `updateCampaignPreferences`, adicionar:
  ```ts
  why_donate_enabled: input.whyDonateEnabled,
  about_us_enabled: input.aboutUsEnabled,
  ```

  > Atenção: os demais campos (`why_donate_title`, `why_donate_text`, etc.) estão atualmente comentados nesse método. Não descomentar — deixar como está, apenas adicionar os dois novos campos.

---

### Task 3: Schema interno e use case

**Files:**
- Modify: `src/infra/schemas/internal/campaign.ts`
- Modify: `src/app/useCases/campaign/updateCampaignPageUseCase.ts`

**Interfaces:**
- Consumes: `UpdateCampaignPreferencesInput.whyDonateEnabled`, `UpdateCampaignPreferencesInput.aboutUsEnabled` (Task 1)
- Produces: `updateCampaignPageSchema` inclui `whyDonateEnabled: boolean` e `aboutUsEnabled: boolean`; `UpdateCampaignPageUseCase.InputProps` inclui ambos

- [ ] **Adicionar campos no schema interno**

  Arquivo: `src/infra/schemas/internal/campaign.ts`, dentro de `updateCampaignPageSchema`.

  Adicionar após `supportEmail`:
  ```ts
  whyDonateEnabled: z.string().transform((v) => v === "true"),
  aboutUsEnabled: z.string().transform((v) => v === "true"),
  ```

  > O `Switch` envia os valores via `<input type="hidden">` como strings `"true"` ou `"false"`. O `.transform` converte para boolean.

- [ ] **Adicionar campos no `InputProps` do use case**

  Arquivo: `src/app/useCases/campaign/updateCampaignPageUseCase.ts`

  Em `type InputProps`, adicionar após `supportEmail`:
  ```ts
  whyDonateEnabled: boolean;
  aboutUsEnabled: boolean;
  ```

- [ ] **Repassar os campos ao gateway no método `execute`**

  No call de `this.campaignPreferencesGateway.updateCampaignPreferences(...)`, adicionar após `supportEmail`:
  ```ts
  whyDonateEnabled: input.whyDonateEnabled,
  aboutUsEnabled: input.aboutUsEnabled,
  ```

---

### Task 4: Componente `WhyDonateSection`

**Files:**
- Modify: `src/client/pages/campaignPage/whyDonateSection.tsx`

**Interfaces:**
- Consumes: `preferences.whyDonateEnabled: boolean | null` via `useLoaderData<CampaignPageLoader>()`
- Consumes: `Switch` de `~/client/components/ui/switch`
- Consumes: `cn` de `~/lib/utils`

- [ ] **Adicionar imports**

  Adicionar ao topo do arquivo (junto aos imports existentes):
  ```ts
  import { useState } from "react";
  import { Switch } from "~/client/components/ui/switch";
  import { cn } from "~/lib/utils";
  ```

- [ ] **Adicionar estado local e renderizar switch no header**

  Substituir o corpo da função `WhyDonateSection`:

  ```tsx
  function WhyDonateSection() {
    const { preferences } = useLoaderData<CampaignPageLoader>();
    const [enabled, setEnabled] = useState(preferences.whyDonateEnabled ?? true);

    return (
      <SectionCard
        title="Por que doar"
        description="Bloco que explica o propósito da campanha."
        action={
          <>
            <input type="hidden" name="whyDonateEnabled" value={enabled ? "true" : "false"} />
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </>
        }
      >
        <div className={cn(!enabled && "pointer-events-none opacity-50")}>
          <FormField name="whyDonateTitle" label="Título">
            <Input
              name="whyDonateTitle"
              placeholder="Ex.: Por que sua doação importa"
              defaultValue={preferences.whyDonateTitle ?? ""}
            />
          </FormField>
          <FormField name="whyDonateText" label="Texto">
            <RichTextarea
              name="whyDonateText"
              placeholder="Explique o impacto da doação..."
              defaultValue={preferences.whyDonateText ?? ""}
            />
          </FormField>
          <FormField name="whyDonateImage" label="Imagem do bloco">
            <ImageUpload
              name="whyDonateImage"
              defaultValue={preferences.whyDonateImage}
              width={800}
              height={600}
            />
            <p className="text-xs text-muted-foreground">Dimensão recomendada: 800x600px.</p>
          </FormField>
        </div>
      </SectionCard>
    );
  }
  ```

- [ ] **Verificar no browser**

  - Abrir a tela Configurações → Página da Campanha
  - O switch deve aparecer no header do card "Por que doar"
  - Ao desativar, os campos ficam opacos e sem interação
  - Ao reativar, os campos voltam ao normal
  - O estado do switch não afeta os outros cards

---

### Task 5: Componente `AboutUsSection`

**Files:**
- Modify: `src/client/pages/campaignPage/aboutUsSection.tsx`

**Interfaces:**
- Consumes: `preferences.aboutUsEnabled: boolean | null` via `useLoaderData<CampaignPageLoader>()`
- Consumes: `Switch` de `~/client/components/ui/switch`
- Consumes: `cn` de `~/lib/utils`

- [ ] **Adicionar imports**

  Adicionar ao topo do arquivo (junto aos imports existentes):
  ```ts
  import { useState } from "react";
  import { Switch } from "~/client/components/ui/switch";
  import { cn } from "~/lib/utils";
  ```

- [ ] **Adicionar estado local e renderizar switch no header**

  Substituir o corpo da função `AboutUsSection`:

  ```tsx
  function AboutUsSection() {
    const { preferences } = useLoaderData<CampaignPageLoader>();
    const [enabled, setEnabled] = useState(preferences.aboutUsEnabled ?? true);

    return (
      <SectionCard
        title="Sobre nós"
        description="Apresente a instituição responsável pela campanha."
        action={
          <>
            <input type="hidden" name="aboutUsEnabled" value={enabled ? "true" : "false"} />
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </>
        }
      >
        <div className={cn(!enabled && "pointer-events-none opacity-50")}>
          <FormField name="aboutTitle" label="Título">
            <Input
              name="aboutTitle"
              placeholder="Ex.: Sobre nossa paróquia"
              defaultValue={preferences.aboutUsTitle ?? ""}
            />
          </FormField>
          <FormField name="aboutText" label="Texto">
            <RichTextarea
              name="aboutText"
              placeholder="Conte a história da instituição..."
              defaultValue={preferences.aboutUsText ?? ""}
            />
          </FormField>
          <FormField name="aboutImage" label="Imagem do bloco">
            <ImageUpload
              name="aboutImage"
              defaultValue={preferences.aboutUsImage}
              width={800}
              height={600}
            />
            <p className="text-xs text-muted-foreground">Dimensão recomendada: 800x600px.</p>
          </FormField>
        </div>
      </SectionCard>
    );
  }
  ```

- [ ] **Verificar no browser**

  - O switch deve aparecer no header do card "Sobre nós"
  - Ao desativar, os campos ficam opacos e sem interação
  - Ao reativar, os campos voltam ao normal
  - Salvar o form com switch desativado → recarregar a página → switch deve permanecer desativado (confirma persistência na API)
