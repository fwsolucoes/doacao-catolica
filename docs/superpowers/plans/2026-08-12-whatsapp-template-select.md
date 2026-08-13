# WhatsApp Template Aprovado — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar um select "Template Aprovado" no WhatsAppTab do dialog de régua de mensagem, que busca templates da API com base no tipo de mensagem selecionado e, quando um template é escolhido, substitui o campo de texto livre pelo conteúdo do template.

**Architecture:** Segue o padrão DAL do projeto para busca de lista sem paginação (ExternalSchema → View → DalInterface → Dal → UseCase → Controller → Factory → API route). A UI adiciona um segundo `useFetcher` em `index.tsx` para buscar templates quando `messageType` muda, passando os dados para `WhatsAppTab` via props.

**Tech Stack:** React Router v7 (loader/useFetcher), Zod v4, donationApi (api-key), shadcn Select, React hooks.

## Global Constraints

- Nunca usar `<button>`, `<input>`, `<select>` nativos quando existir equivalente em `src/client/components/ui/`
- Named imports do React (`useState`, `useEffect`, etc.) — nunca `import * as React`
- Tailwind: usar escala numérica (nunca `[Xpx]` exceto font sizes sem equivalente)
- Schemas Zod v4: `z.uuid()` standalone, não `z.string().uuid()`
- `donationApi` requer header `"api-key": environmentVariables.API_KEY_DONATION`; controllers desses endpoints **não** verificam `AuthService`
- Gateway recebe parâmetros diretos, não agrupados em objeto genérico
- Formatação de dados no `toJson()` da entidade, nunca no gateway/DAL
- Identificador de action no `<Button type="submit" name="_action">`, nunca em `<input type="hidden">`
- Arquivos, componentes e identificadores em inglês; textos de UI em português

---

## File Map

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `src/infra/schemas/external/whatsappTemplates.ts` | Criar | Schema Zod da resposta da API `GET /client_whatsapp_templates` |
| `src/domain/views/whatsappTemplate.ts` | Criar | View class com `restore()` e `toJson()`; exporta `WhatsappTemplateJson` |
| `src/domain/dal/whatsappTemplate.ts` | Criar | Interface DAL |
| `src/infra/dal/whatsappTemplate.ts` | Criar | Implementação DAL — chama `donationApi` |
| `src/app/useCases/whatsappTemplates/listWhatsappTemplatesUseCase.ts` | Criar | Use case: delega ao DAL |
| `src/infra/controllers/whatsappTemplates/listWhatsappTemplatesController.ts` | Criar | Controller: lê `notification_type` do query, sem AuthService |
| `src/main/factories/whatsappTemplates/listWhatsappTemplatesFactory.ts` | Criar | Instancia e conecta as camadas |
| `src/main/routes/api.whatsappTemplates.ts` | Criar | API route (loader) em `/api/whatsappTemplates` |
| `src/client/pages/messageRules/components/new-billing-rule-dialog/index.tsx` | Modificar | Adiciona `templateFetcher`, busca templates ao mudar `messageType`, passa dados ao `WhatsAppTab` |
| `src/client/pages/messageRules/components/new-billing-rule-dialog/whatsapp-tab.tsx` | Modificar | Adiciona select "Template Aprovado", controla `selectedTemplateUuid`, esconde RichTextarea quando template ativo |

---

## Task 1: External Schema + View Class

**Files:**
- Create: `src/infra/schemas/external/whatsappTemplates.ts`
- Create: `src/domain/views/whatsappTemplate.ts`

**Interfaces:**
- Produces: schema `listWhatsappTemplatesSchema` (valida resposta da API); classe `WhatsappTemplate` com `restore()` e `toJson()`; tipo exportado `WhatsappTemplateJson`

- [ ] **Step 1: Criar o schema externo**

```ts
// src/infra/schemas/external/whatsappTemplates.ts
import { z } from "zod";

const whatsappTemplateItemSchema = z.object({
  uuid: z.string(),
  template_name: z.string(),
  // known values: "utility" | "marketing"
  template_type: z.string(),
  // known values: see NOTIFICATION_TYPES
  notification_type: z.string(),
  template_preview_text: z.string().nullable(),
});

const listWhatsappTemplatesSchema = z.object({
  message: z.string().optional(),
  data: z.array(whatsappTemplateItemSchema).optional().default([]),
});

export { listWhatsappTemplatesSchema };
```

- [ ] **Step 2: Criar a view class**

```ts
// src/domain/views/whatsappTemplate.ts
type WhatsappTemplateProps = {
  uuid: string;
  templateName: string;
  templateType: string;
  notificationType: string;
  templatePreviewText: string;
};

type WhatsappTemplateJson = WhatsappTemplateProps;

class WhatsappTemplate {
  uuid: string;
  templateName: string;
  templateType: string;
  notificationType: string;
  templatePreviewText: string;

  private constructor(props: WhatsappTemplateProps) {
    this.uuid = props.uuid;
    this.templateName = props.templateName;
    this.templateType = props.templateType;
    this.notificationType = props.notificationType;
    this.templatePreviewText = props.templatePreviewText;
  }

  static restore(props: WhatsappTemplateProps): WhatsappTemplate {
    return new WhatsappTemplate(props);
  }

  toJson(): WhatsappTemplateJson {
    return {
      uuid: this.uuid,
      templateName: this.templateName,
      templateType: this.templateType,
      notificationType: this.notificationType,
      templatePreviewText: this.templatePreviewText,
    };
  }
}

export { WhatsappTemplate };
export type { WhatsappTemplateJson };
```

---

## Task 2: DAL Layer

**Files:**
- Create: `src/domain/dal/whatsappTemplate.ts`
- Create: `src/infra/dal/whatsappTemplate.ts`

**Interfaces:**
- Consumes: `WhatsappTemplate` de `~/domain/views/whatsappTemplate`, `listWhatsappTemplatesSchema` de `~/infra/schemas/external/whatsappTemplates`, `donationApi`, `environmentVariables`, `HttpAdapter`, `SchemaValidatorAdapter`
- Produces: interface `WhatsappTemplateDalDTO` com `listWhatsappTemplates(notificationType?: string): Promise<WhatsappTemplate[]>`; classe `WhatsappTemplateDal`

- [ ] **Step 1: Criar a interface DAL**

```ts
// src/domain/dal/whatsappTemplate.ts
import type { WhatsappTemplate } from "../views/whatsappTemplate";

type WhatsappTemplateDalDTO = {
  listWhatsappTemplates(notificationType?: string): Promise<WhatsappTemplate[]>;
};

export type { WhatsappTemplateDalDTO };
```

- [ ] **Step 2: Criar a implementação DAL**

```ts
// src/infra/dal/whatsappTemplate.ts
import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import { WhatsappTemplate } from "~/domain/views/whatsappTemplate";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { listWhatsappTemplatesSchema } from "../schemas/external/whatsappTemplates";

class WhatsappTemplateDal implements WhatsappTemplateDalDTO {
  async listWhatsappTemplates(notificationType?: string): Promise<WhatsappTemplate[]> {
    const params = new URLSearchParams();
    if (notificationType) params.set("notification_type", notificationType);
    const query = params.toString();
    const url = query
      ? `/client_whatsapp_templates?${query}`
      : `/client_whatsapp_templates`;

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const validated = new SchemaValidatorAdapter(listWhatsappTemplatesSchema).validate(
      apiResponse.response,
    );

    return (validated.data ?? []).map((item) =>
      WhatsappTemplate.restore({
        uuid: item.uuid,
        templateName: item.template_name,
        templateType: item.template_type,
        notificationType: item.notification_type,
        templatePreviewText: item.template_preview_text ?? "",
      }),
    );
  }
}

export { WhatsappTemplateDal };
```

---

## Task 3: Application Layer + API Route

**Files:**
- Create: `src/app/useCases/whatsappTemplates/listWhatsappTemplatesUseCase.ts`
- Create: `src/infra/controllers/whatsappTemplates/listWhatsappTemplatesController.ts`
- Create: `src/main/factories/whatsappTemplates/listWhatsappTemplatesFactory.ts`
- Create: `src/main/routes/api.whatsappTemplates.ts`

**Interfaces:**
- Consumes: `WhatsappTemplateDalDTO`, `WhatsappTemplateDal`, `RouteAdapter`, `ErrorHandlerAdapter`
- Produces: API route loader em `/api/whatsappTemplates`; aceita query param `notification_type`; retorna `WhatsappTemplateJson[]`

- [ ] **Step 1: Criar o use case**

```ts
// src/app/useCases/whatsappTemplates/listWhatsappTemplatesUseCase.ts
import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { WhatsappTemplate } from "~/domain/views/whatsappTemplate";

type InputProps = {
  notificationType?: string;
};

class ListWhatsappTemplatesUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(input: InputProps): Promise<WhatsappTemplate[]> {
    return this.whatsappTemplateDal.listWhatsappTemplates(input.notificationType);
  }
}

export { ListWhatsappTemplatesUseCase };
```

- [ ] **Step 2: Criar o controller**

Nota: endpoint usa `donationApi` (api-key) — controller **não** verifica `AuthService`.

```ts
// src/infra/controllers/whatsappTemplates/listWhatsappTemplatesController.ts
import type { ListWhatsappTemplatesUseCase } from "~/app/useCases/whatsappTemplates/listWhatsappTemplatesUseCase";
import type { RouteDTO } from "~/main/types/route";

class ListWhatsappTemplatesController {
  constructor(private listWhatsappTemplatesUseCase: ListWhatsappTemplatesUseCase) {}

  async handle(route: RouteDTO) {
    const notificationType = route.query.notification_type;
    const templates = await this.listWhatsappTemplatesUseCase.execute({ notificationType });
    return templates.map((t) => t.toJson());
  }
}

export { ListWhatsappTemplatesController };
```

- [ ] **Step 3: Criar a factory**

```ts
// src/main/factories/whatsappTemplates/listWhatsappTemplatesFactory.ts
import { ListWhatsappTemplatesUseCase } from "~/app/useCases/whatsappTemplates/listWhatsappTemplatesUseCase";
import { ListWhatsappTemplatesController } from "~/infra/controllers/whatsappTemplates/listWhatsappTemplatesController";
import { WhatsappTemplateDal } from "~/infra/dal/whatsappTemplate";

const whatsappTemplateDal = new WhatsappTemplateDal();
const listWhatsappTemplatesUseCase = new ListWhatsappTemplatesUseCase(whatsappTemplateDal);
const listWhatsappTemplatesController = new ListWhatsappTemplatesController(
  listWhatsappTemplatesUseCase,
);

const listWhatsappTemplates = {
  handle: listWhatsappTemplatesController.handle.bind(listWhatsappTemplatesController),
};

export { listWhatsappTemplates };
```

- [ ] **Step 4: Criar a API route**

```ts
// src/main/routes/api.whatsappTemplates.ts
import type { Route } from "+/api.whatsappTemplates";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { listWhatsappTemplates } from "../factories/whatsappTemplates/listWhatsappTemplatesFactory";

export async function loader(props: Route.LoaderArgs) {
  try {
    const adaptedRoute = await RouteAdapter.adaptRoute(props);
    return await listWhatsappTemplates.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}
```

---

## Task 4: WhatsAppTab — Select + Lógica de Template

**Files:**
- Modify: `src/client/pages/messageRules/components/new-billing-rule-dialog/whatsapp-tab.tsx`

**Interfaces:**
- Consumes: `Select` de `~/client/components/ui/select`, `useEffect` do React
- Produces: exporta `WhatsappTemplateJson`; renderiza select "Template Aprovado" antes de "Inserir variável"; esconde `RichTextarea` quando template selecionado; submete `whatsappMessage` com texto do template via hidden input

**Comportamento esperado:**
- `messageType` vazio → mensagem info "Selecione um tipo de mensagem..."
- `isLoadingTemplates` → select desabilitado, trigger mostra "Carregando..."
- Templates disponíveis → Select com opção "Escrever manualmente" (value `""`) + opções de template
- Template selecionado → RichTextarea some; `whatsappMessage` hidden = `templatePreviewText`; `enableWhatsapp = "true"`; prévia mostra `templatePreviewText`
- Sem templates (e não carregando e `messageType` definido) → info message; RichTextarea permanece visível

- [ ] **Step 1: Adicionar import do Select e exportar o tipo**

```tsx
import { useEffect, useRef, useState } from "react";
import { Select } from "~/client/components/ui/select";
import { RichTextarea } from "~/client/components/campaignSettings/richTextarea";
import type { RichTextareaRef } from "~/client/components/campaignSettings/richTextarea";
import { FormField } from "~/client/components/ui/form-field";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { VariablePopover } from "../variable-popover";
import { WHATSAPP_DEFAULT } from "../../constants";

type WhatsappTemplateJson = {
  uuid: string;
  templateName: string;
  templateType: string;
  notificationType: string;
  templatePreviewText: string;
};

export type { WhatsappTemplateJson };
```

- [ ] **Step 2: Atualizar a assinatura da função**

```tsx
function WhatsAppTab({
  defaultMessage,
  messageType,
  templates,
  isLoadingTemplates,
}: {
  defaultMessage?: string;
  messageType: string;
  templates: WhatsappTemplateJson[];
  isLoadingTemplates: boolean;
}) {
```

- [ ] **Step 3: Adicionar estado e lógica de template**

Logo após a abertura da função (antes dos hooks existentes), adicionar:

```tsx
const [selectedTemplateUuid, setSelectedTemplateUuid] = useState("");

useEffect(() => {
  setSelectedTemplateUuid("");
}, [messageType]);

const selectedTemplate =
  selectedTemplateUuid
    ? (templates.find((t) => t.uuid === selectedTemplateUuid) ?? null)
    : null;

const hasTemplates = templates.length > 0;
const useTemplate = selectedTemplate !== null;
```

- [ ] **Step 4: Ajustar o cálculo de enableWhatsapp**

Substituir o cálculo atual de `hasContent` e o hidden input `enableWhatsapp` para considerar o modo template:

```tsx
const hasContent = htmlContent.replace(/<[^>]*>/g, "").trim().length > 0;
const enableWhatsapp = useTemplate || hasContent;
```

E o input hidden correspondente:
```tsx
<input type="hidden" name="enableWhatsapp" value={enableWhatsapp ? "true" : "false"} />
```

- [ ] **Step 5: Renderizar o select "Template Aprovado" antes de "Inserir variável"**

O return atual começa com `<>` → primeiro filho é o hidden input `enableWhatsapp`, depois o `div` com `grid grid-cols-5`. Inserir o bloco abaixo **dentro** do `<>` mas **antes** do `div.grid`:

```tsx
<div className="mb-5 flex flex-col gap-1.5">
  <p className="text-sm font-semibold text-foreground">Template Aprovado</p>

  {!messageType || (!isLoadingTemplates && !hasTemplates) ? (
    <p className="text-xs text-muted-foreground">
      {!messageType
        ? "Selecione um tipo de mensagem para ver os templates disponíveis."
        : "Nenhum template configurado para este tipo de mensagem."}
    </p>
  ) : (
    <Select.Root
      value={selectedTemplateUuid}
      onValueChange={setSelectedTemplateUuid}
      disabled={isLoadingTemplates}
    >
      <Select.Trigger>
        <Select.Value
          placeholder={isLoadingTemplates ? "Carregando templates..." : "Selecione um template"}
        />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="">Escrever manualmente</Select.Item>
        {templates.map((t) => (
          <Select.Item key={t.uuid} value={t.uuid}>
            {t.templateName}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )}
</div>
```

- [ ] **Step 6: Condicionar a exibição do RichTextarea e adicionar hidden input de template**

No `div.grid.grid-cols-5`, a coluna esquerda (`col-span-3`) contém "Inserir variável" e "Mensagem WhatsApp". Atualizar apenas a parte "Mensagem WhatsApp":

```tsx
<div className="col-span-3 flex flex-col gap-4">
  <div className="flex flex-col gap-1.5">
    <p className="text-sm font-semibold text-foreground">Inserir variável</p>
    <VariablePopover onInsert={insertVariable} />
  </div>

  {useTemplate ? (
    <input
      type="hidden"
      name="whatsappMessage"
      value={selectedTemplate!.templatePreviewText}
    />
  ) : (
    <FormField name="whatsappMessage" label="Mensagem WhatsApp">
      <RichTextarea
        ref={richRef}
        name="whatsappMessage"
        defaultValue={initial}
        onChange={setHtmlContent}
        formats={["bold"]}
      />
    </FormField>
  )}
</div>
```

- [ ] **Step 7: Atualizar a coluna de prévia**

Quando template selecionado, mostrar `templatePreviewText` em texto puro em vez do HTML do editor:

```tsx
<div className="col-span-2 flex flex-col gap-3">
  <div className="flex flex-col gap-0.5">
    <p className="text-sm font-semibold text-foreground">Prévia</p>
    <p className="text-xs text-muted-foreground">
      Variáveis serão preenchidas no envio
    </p>
  </div>
  <div className="overflow-clip rounded-2xl border border-border">
    <div className="flex items-center gap-2.5 bg-[#007a55] px-5 py-3">
      <WhatsAppIcon size={16} className="text-white" />
      <span className="text-sm font-semibold text-white">Empresa Demo</span>
    </div>
    <div className="bg-[#ecfdf5] p-5">
      {useTemplate ? (
        <p className="whitespace-pre-wrap text-sm text-[#002c22]">
          {selectedTemplate!.templatePreviewText}
        </p>
      ) : (
        <p
          className="whitespace-pre-wrap text-sm text-[#002c22]"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )}
    </div>
  </div>
</div>
```

---

## Task 5: index.tsx — Template Fetcher

**Files:**
- Modify: `src/client/pages/messageRules/components/new-billing-rule-dialog/index.tsx`

**Interfaces:**
- Consumes: `WhatsappTemplateJson` de `./whatsapp-tab` (definido e exportado na Task 4)
- Produces: `templates: WhatsappTemplateJson[]` e `isLoadingTemplates: boolean` passados como props ao `WhatsAppTab`

**Contexto:** O arquivo atual tem um único `fetcher = useFetcher()` para o submit do formulário. Precisamos de um **segundo** `useFetcher` para buscar templates — não misturar com o fetcher do form.

- [ ] **Step 1: Importar o tipo WhatsappTemplateJson**

No topo do arquivo, adicionar o import de tipo (o `useEffect` já existe no arquivo):

```ts
import type { WhatsappTemplateJson } from "./whatsapp-tab";
```

- [ ] **Step 2: Adicionar o templateFetcher e o useEffect dentro do componente**

Logo após a declaração `const isSubmitting = fetcher.state !== "idle";`, adicionar:

```tsx
const templateFetcher = useFetcher<WhatsappTemplateJson[]>();
const templates: WhatsappTemplateJson[] = Array.isArray(templateFetcher.data)
  ? templateFetcher.data
  : [];
const isLoadingTemplates = templateFetcher.state !== "idle";

useEffect(() => {
  if (!messageType) return;
  templateFetcher.load(`/api/whatsappTemplates?notification_type=${messageType}`);
}, [messageType]);
```

- [ ] **Step 3: Passar as novas props ao WhatsAppTab**

Localizar a chamada ao `WhatsAppTab` (dentro de `Tabs.Content value="whatsapp"`) e atualizar:

```tsx
<WhatsAppTab
  defaultMessage={rule?.whatsappMessage}
  messageType={messageType}
  templates={templates}
  isLoadingTemplates={isLoadingTemplates}
/>
```

