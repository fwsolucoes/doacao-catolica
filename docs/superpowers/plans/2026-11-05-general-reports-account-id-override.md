# General Reports Account ID Override Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Colaboradores autorizados (lista configurável) que acessam os 4 relatórios gerais (Resumo Financeiro, Doações Gerais, Inadimplentes Gerais, Doações Mês a Mês) devem enxergar os dados de **todas as campanhas** (ID geral), em vez de apenas os dados do próprio `accountId` — tanto na tela quanto nos botões de exportação dessas mesmas telas.

**Architecture:** Uma função utilitária pura e centralizada (`resolveGeneralReportsAccountId`) decide, a partir do `user` da sessão e de duas variáveis de ambiente, se deve retornar o `accountId` do próprio usuário ou o `accountId` geral. Os 4 pontos de entrada (controller/loaders) passam a chamar essa função em vez de usar `user.accountId` diretamente. Nenhuma mudança é necessária nos gateways — cada um já recebe o `accountId` resolvido e o envia à API exatamente como já fazia (path param ou query string).

**Tech Stack:** React Router v7 (SSR), TypeScript, Zod (validação de env vars). Projeto não possui framework de testes automatizados (sem vitest/jest) — verificação é feita via `npm run typecheck` e checagem manual de comportamento, seguindo o padrão já usado nos planos anteriores deste repositório.

**Spec:** Análise e proposta validadas nesta conversa (ver mensagens anteriores) — sem documento de spec separado.

## Global Constraints

- Nomes de arquivos, classes, funções sempre em inglês (UI em português é a exceção, não aplicável aqui — não há texto de UI nesta mudança)
- Variáveis de ambiente seguem o padrão de `src/main/config/environmentVariables.ts`: adicionadas ao schema Zod com `z.string().default("")`, nunca lidas diretamente de `process.env`
- A troca de ID é exclusiva dos 4 relatórios gerais (`/financial-summary`, `/donations`, `/defaulters-report`, `/monthly-donors-report`) e dos 2 endpoints de exportação que pertencem a essas mesmas telas (`api/financial-summary-export`, `api/monthly-donors-export`). **Não tocar** nas rotas de relatórios por campanha (`route.campaign.defaultersReport.tsx`, `route.campaign.monthlyDonorsReport.tsx`, `route.campaign.donations.tsx`, `api.campaign.*Export.ts`, etc.) — essas já filtram por uma campanha específica e devem continuar usando os parâmetros atuais
- Sem passos de commit — o usuário revisa e commita manualmente via IDE
- Sem arquivos de documentação ou README extras além deste plano
- Verificar cada task com: `npm run typecheck` (roda `react-router typegen && tsc`)
- Os valores reais da lista de IDs autorizados e do ID geral **não** entram no código nem neste plano — vão em `.env.development`/`.env.production` (gitignored), preenchidos manualmente pelo usuário após a implementação

## Review Focus

- Env vars não configuradas (string vazia, padrão) → `resolveGeneralReportsAccountId` deve devolver o `accountId` do próprio usuário sem quebrar nada — feature inerte até ser configurada
- Lista de IDs com espaços/entradas vazias (ex.: `"12, 34,, 56 "`) → precisa ser normalizada (trim + remoção de vazios) para a busca funcionar
- Usuário está na lista de autorizados, mas `GENERAL_REPORTS_MASTER_ACCOUNT_ID` está vazio → deve cair de volta no `accountId` do próprio usuário, não em `Number("") === 0`
- Tipo de retorno consistente: `resolveGeneralReportsAccountId` retorna `number` (mesmo tipo de `User.accountId`); os 3 call sites que hoje fazem `String(user.accountId)` devem envolver o retorno com `String(...)`; o call site de Doações Gerais (que espera `number`) usa o retorno diretamente
- A troca não deve vazar para as rotas de relatórios por campanha — escopo desta mudança fica restrito aos arquivos listados no mapa de arquivos
- Doações Gerais e Inadimplentes Gerais não têm endpoint de exportação próprio no nível geral (só existem versões por campanha, fora de escopo) — nada a fazer além das Tasks 4 e 5 para esses dois relatórios

---

## Mapa de arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `src/main/config/environmentVariables.ts` | Modificar | Adicionar `GENERAL_REPORTS_ALLOWED_USER_IDS` e `GENERAL_REPORTS_MASTER_ACCOUNT_ID` ao schema |
| `.env.example` | Modificar | Documentar as duas novas variáveis |
| `src/lib/generalReportsAccountId.server.ts` | Criar | Função pura `resolveGeneralReportsAccountId(user): number` — ponto único de decisão |
| `src/infra/controllers/financialSummary/getFinancialSummaryController.ts` | Modificar | Usar `resolveGeneralReportsAccountId` para `referenceId` |
| `src/main/routes/route.donations.tsx` | Modificar | Usar `resolveGeneralReportsAccountId` para `accountId` passado às duas chamadas |
| `src/main/routes/route.defaultersReport.tsx` | Modificar | Usar `resolveGeneralReportsAccountId` para `reference2` |
| `src/main/routes/route.monthlyDonorsReport.tsx` | Modificar | Usar `resolveGeneralReportsAccountId` para `projectAccountId` |
| `src/main/routes/api.financialSummaryExport.ts` | Modificar | Usar `resolveGeneralReportsAccountId` na URL de export |
| `src/main/routes/api.monthlyDonorsExport.ts` | Modificar | Usar `resolveGeneralReportsAccountId` em `project_account_id` |

---

### Task 1: Variáveis de ambiente

**Files:**
- Modify: `src/main/config/environmentVariables.ts:78-80`
- Modify: `.env.example`

**Interfaces:**
- Produces: `environmentVariables.GENERAL_REPORTS_ALLOWED_USER_IDS: string`, `environmentVariables.GENERAL_REPORTS_MASTER_ACCOUNT_ID: string`

---

- [ ] **Step 1: Adicionar os campos ao schema Zod**

Em `src/main/config/environmentVariables.ts`, o arquivo termina com:

```ts
  // Session cookie signing secret (min 32 chars) — rotate per environment
  SESSION_SECRET: z.string().min(32),
});
```

Substituir por:

```ts
  // Session cookie signing secret (min 32 chars) — rotate per environment
  SESSION_SECRET: z.string().min(32),

  // Relatórios gerais — colaboradores autorizados (IDs de usuário separados por
  // vírgula) enxergam o accountId geral (todas as campanhas) em vez do próprio
  GENERAL_REPORTS_ALLOWED_USER_IDS: z.string().default(""),
  GENERAL_REPORTS_MASTER_ACCOUNT_ID: z.string().default(""),
});
```

- [ ] **Step 2: Documentar as variáveis em `.env.example`**

Em `.env.example`, ao final do arquivo (depois de `SESSION_SECRET=""`), adicionar:

```
# Relatórios gerais — colaboradores autorizados (IDs separados por vírgula) e o accountId geral que substitui o deles
GENERAL_REPORTS_ALLOWED_USER_IDS=""
GENERAL_REPORTS_MASTER_ACCOUNT_ID=""
```

- [ ] **Step 3: Verificar que os tipos compilam**

```bash
npm run typecheck
```

Expected: sem erros.

---

### Task 2: Função resolvedora centralizada

**Files:**
- Create: `src/lib/generalReportsAccountId.server.ts`

**Interfaces:**
- Consumes: `environmentVariables.GENERAL_REPORTS_ALLOWED_USER_IDS`, `environmentVariables.GENERAL_REPORTS_MASTER_ACCOUNT_ID` (Task 1); `User` de `~/main/types/user` (`{ id: string; accountId: number; ... }`, já existente)
- Produces: `resolveGeneralReportsAccountId(user: User): number`

---

- [ ] **Step 4: Criar o arquivo**

Criar `src/lib/generalReportsAccountId.server.ts`:

```ts
import { environmentVariables } from "~/main/config/environmentVariables";
import type { User } from "~/main/types/user";

function parseAllowedUserIds(raw: string): Set<string> {
  return new Set(
    raw
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0),
  );
}

function resolveGeneralReportsAccountId(user: User): number {
  const allowedUserIds = parseAllowedUserIds(
    environmentVariables.GENERAL_REPORTS_ALLOWED_USER_IDS,
  );
  const masterAccountId = environmentVariables.GENERAL_REPORTS_MASTER_ACCOUNT_ID;

  if (allowedUserIds.has(user.id) && masterAccountId) {
    return Number(masterAccountId);
  }

  return user.accountId;
}

export { resolveGeneralReportsAccountId };
```

- [ ] **Step 5: Verificar que os tipos compilam**

```bash
npm run typecheck
```

Expected: sem erros.

- [ ] **Step 6: Checagem manual de comportamento (sem framework de testes no projeto)**

Como o projeto não tem vitest/jest configurado, confirme a lógica lendo o arquivo criado contra estes casos (não requer rodar nada, apenas conferir o código acima linha a linha):

1. `GENERAL_REPORTS_ALLOWED_USER_IDS=""` (padrão) → `allowedUserIds` é um `Set` vazio → `allowedUserIds.has(user.id)` é sempre `false` → função sempre retorna `user.accountId`. Confirma o item 1 do Review Focus.
2. `GENERAL_REPORTS_ALLOWED_USER_IDS="12, 34,, 56 "` → `split(",")` gera `["12", " 34", "", " 56 "]` → `.trim()` normaliza para `["12", "34", "", "56"]` → `.filter(id => id.length > 0)` remove a entrada vazia → `Set{"12","34","56"}`. Confirma o item 2.
3. `user.id` está no set, mas `GENERAL_REPORTS_MASTER_ACCOUNT_ID=""` → `masterAccountId` é `""`, que é falsy → a condição `allowedUserIds.has(user.id) && masterAccountId` é `false` → cai no `return user.accountId`, nunca chega em `Number("")`. Confirma o item 3.
4. Tipo de retorno é `number` em todos os caminhos (`Number(masterAccountId)` ou `user.accountId`, que já é `number` em `User`). Confirma o item 4 — os call sites das Tasks 3, 5 e 6 precisam envolver o retorno com `String(...)`, a Task 4 usa o `number` diretamente.

---

### Task 3: Resumo Financeiro

**Files:**
- Modify: `src/infra/controllers/financialSummary/getFinancialSummaryController.ts`

**Interfaces:**
- Consumes: `resolveGeneralReportsAccountId` de `~/lib/generalReportsAccountId.server` (Task 2)

---

- [ ] **Step 7: Atualizar o controller**

Em `src/infra/controllers/financialSummary/getFinancialSummaryController.ts`, o arquivo atual é:

```ts
import type { GetFinancialSummaryUseCase } from "~/app/useCases/financialSummary/getFinancialSummaryUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class GetFinancialSummaryController {
  constructor(private useCase: GetFinancialSummaryUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    return await this.useCase.execute({
      referenceId: String(user.accountId),
      dateType: route.query.date_type,
      startDate: route.query.start_date,
      endDate: route.query.end_date,
    });
  }
}

export { GetFinancialSummaryController };
```

Substituir por:

```ts
import type { GetFinancialSummaryUseCase } from "~/app/useCases/financialSummary/getFinancialSummaryUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import { resolveGeneralReportsAccountId } from "~/lib/generalReportsAccountId.server";
import type { RouteDTO } from "~/main/types/route";

class GetFinancialSummaryController {
  constructor(private useCase: GetFinancialSummaryUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    return await this.useCase.execute({
      referenceId: String(resolveGeneralReportsAccountId(user)),
      dateType: route.query.date_type,
      startDate: route.query.start_date,
      endDate: route.query.end_date,
    });
  }
}

export { GetFinancialSummaryController };
```

- [ ] **Step 8: Verificar que os tipos compilam**

```bash
npm run typecheck
```

Expected: sem erros.

---

### Task 4: Doações Gerais

**Files:**
- Modify: `src/main/routes/route.donations.tsx`

**Interfaces:**
- Consumes: `resolveGeneralReportsAccountId` de `~/lib/generalReportsAccountId.server` (Task 2)

---

- [ ] **Step 9: Atualizar o loader**

Em `src/main/routes/route.donations.tsx`, adicionar o import:

```ts
import { resolveGeneralReportsAccountId } from "~/lib/generalReportsAccountId.server";
```

junto aos demais imports (após o import de `AuthService`).

O trecho atual do loader é:

```ts
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const customerRef = adaptedRoute.query.customer_reference;

  const [metrics, payments, campaigns] = await Promise.all([
    getTotalPaymentsByAccount.handle(
      user.accountId,
      undefined,
      undefined,
      adaptedRoute.query.date_type,
    ),
    listPaymentsByAccount.handle(user.accountId, adaptedRoute.query),
    listCampaignSelect.handle(adaptedRoute),
  ]);
```

Substituir por:

```ts
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const accountId = resolveGeneralReportsAccountId(user);
  const customerRef = adaptedRoute.query.customer_reference;

  const [metrics, payments, campaigns] = await Promise.all([
    getTotalPaymentsByAccount.handle(
      accountId,
      undefined,
      undefined,
      adaptedRoute.query.date_type,
    ),
    listPaymentsByAccount.handle(accountId, adaptedRoute.query),
    listCampaignSelect.handle(adaptedRoute),
  ]);
```

- [ ] **Step 10: Verificar que os tipos compilam**

```bash
npm run typecheck
```

Expected: sem erros.

---

### Task 5: Inadimplentes Gerais

**Files:**
- Modify: `src/main/routes/route.defaultersReport.tsx`

**Interfaces:**
- Consumes: `resolveGeneralReportsAccountId` de `~/lib/generalReportsAccountId.server` (Task 2)

---

- [ ] **Step 11: Atualizar o loader**

Em `src/main/routes/route.defaultersReport.tsx`, o arquivo atual é:

```ts
import type { Route } from "+/route.defaultersReport";
import { redirect } from "react-router";
import { DefaultersReportPage } from "~/client/pages/defaultersReport";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getDefaultingDonors } from "../factories/defaultingDonors/getDefaultingDonorsFactory";
import { listCampaignSelect } from "../factories/campaignSelect/listCampaignSelectFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const months = Number(adaptedRoute.query.months ?? 4);
  const accountUuid = adaptedRoute.query.account_uuid || undefined;

  const [defaultingDonors, campaigns] = await Promise.all([
    getDefaultingDonors.handle(accountUuid, months, String(user.accountId)),
    listCampaignSelect.handle(adaptedRoute),
  ]);

  return { defaultingDonors, months, campaigns };
}
```

Substituir por:

```ts
import type { Route } from "+/route.defaultersReport";
import { redirect } from "react-router";
import { DefaultersReportPage } from "~/client/pages/defaultersReport";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { resolveGeneralReportsAccountId } from "~/lib/generalReportsAccountId.server";
import { getDefaultingDonors } from "../factories/defaultingDonors/getDefaultingDonorsFactory";
import { listCampaignSelect } from "../factories/campaignSelect/listCampaignSelectFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const months = Number(adaptedRoute.query.months ?? 4);
  const accountUuid = adaptedRoute.query.account_uuid || undefined;

  const [defaultingDonors, campaigns] = await Promise.all([
    getDefaultingDonors.handle(
      accountUuid,
      months,
      String(resolveGeneralReportsAccountId(user)),
    ),
    listCampaignSelect.handle(adaptedRoute),
  ]);

  return { defaultingDonors, months, campaigns };
}
```

(resto do arquivo — `ErrorBoundary` e o componente de rota — permanece igual)

- [ ] **Step 12: Verificar que os tipos compilam**

```bash
npm run typecheck
```

Expected: sem erros.

---

### Task 6: Doações Mês a Mês

**Files:**
- Modify: `src/main/routes/route.monthlyDonorsReport.tsx`

**Interfaces:**
- Consumes: `resolveGeneralReportsAccountId` de `~/lib/generalReportsAccountId.server` (Task 2)

---

- [ ] **Step 13: Atualizar o loader**

Em `src/main/routes/route.monthlyDonorsReport.tsx`, adicionar o import:

```ts
import { resolveGeneralReportsAccountId } from "~/lib/generalReportsAccountId.server";
```

junto aos demais imports (após o import de `AuthService`).

O trecho atual do loader é:

```ts
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const [monthlyDonors, campaignsResult] = await Promise.all([
    getMonthlyDonors.handle(adaptedRoute, {
      projectAccountId: String(user.accountId),
    }),
```

Substituir por:

```ts
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const [monthlyDonors, campaignsResult] = await Promise.all([
    getMonthlyDonors.handle(adaptedRoute, {
      projectAccountId: String(resolveGeneralReportsAccountId(user)),
    }),
```

(restante do `Promise.all`, o mapeamento de `campaigns` e o fim do arquivo permanecem iguais)

- [ ] **Step 14: Verificar que os tipos compilam**

```bash
npm run typecheck
```

Expected: sem erros.

---

### Task 7: Export de Resumo Financeiro

**Files:**
- Modify: `src/main/routes/api.financialSummaryExport.ts`

**Interfaces:**
- Consumes: `resolveGeneralReportsAccountId` de `~/lib/generalReportsAccountId.server` (Task 2)

---

- [ ] **Step 15: Atualizar o loader de export**

Em `src/main/routes/api.financialSummaryExport.ts`, o arquivo atual é:

```ts
import type { Route } from "+/api.financialSummaryExport";
import { redirect } from "react-router";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { environmentVariables } from "~/main/config/environmentVariables";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const { date_type, start_date, end_date } = adaptedRoute.query;

  const params = new URLSearchParams();
  if (date_type) params.set("date_type", date_type);
  if (start_date) params.set("start_date", start_date);
  if (end_date) params.set("end_date", end_date);

  const response = await fetch(
    `${environmentVariables.API_URL_WEBWORKER}/donation/financial-summary/${user.accountId}/export?${params}`,
    { headers: { "api-key": environmentVariables.API_KEY_DONATION } },
  );

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="financial-summary.csv"',
    },
  });
}
```

Substituir por:

```ts
import type { Route } from "+/api.financialSummaryExport";
import { redirect } from "react-router";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { environmentVariables } from "~/main/config/environmentVariables";
import { resolveGeneralReportsAccountId } from "~/lib/generalReportsAccountId.server";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const accountId = resolveGeneralReportsAccountId(user);
  const { date_type, start_date, end_date } = adaptedRoute.query;

  const params = new URLSearchParams();
  if (date_type) params.set("date_type", date_type);
  if (start_date) params.set("start_date", start_date);
  if (end_date) params.set("end_date", end_date);

  const response = await fetch(
    `${environmentVariables.API_URL_WEBWORKER}/donation/financial-summary/${accountId}/export?${params}`,
    { headers: { "api-key": environmentVariables.API_KEY_DONATION } },
  );

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="financial-summary.csv"',
    },
  });
}
```

- [ ] **Step 16: Verificar que os tipos compilam**

```bash
npm run typecheck
```

Expected: sem erros.

---

### Task 8: Export de Doações Mês a Mês

**Files:**
- Modify: `src/main/routes/api.monthlyDonorsExport.ts`

**Interfaces:**
- Consumes: `resolveGeneralReportsAccountId` de `~/lib/generalReportsAccountId.server` (Task 2)

---

- [ ] **Step 17: Atualizar o loader de export**

Em `src/main/routes/api.monthlyDonorsExport.ts`, o trecho atual é:

```ts
import type { Route } from "+/api.monthlyDonorsExport";
import { redirect } from "react-router";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { environmentVariables } from "~/main/config/environmentVariables";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const {
    start_month,
    end_month,
    project_id,
    search,
    name,
    cpf,
  } = adaptedRoute.query;

  const params = new URLSearchParams();
  if (start_month) params.set("start_month", start_month);
  if (end_month) params.set("end_month", end_month);
  if (project_id) params.set("project_id", project_id);
  params.set("project_account_id", String(user.accountId));
  if (search) params.set("search", search);
  if (name) params.set("name", name);
  if (cpf) params.set("cpf", cpf);
```

Substituir por:

```ts
import type { Route } from "+/api.monthlyDonorsExport";
import { redirect } from "react-router";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { environmentVariables } from "~/main/config/environmentVariables";
import { resolveGeneralReportsAccountId } from "~/lib/generalReportsAccountId.server";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const {
    start_month,
    end_month,
    project_id,
    search,
    name,
    cpf,
  } = adaptedRoute.query;

  const params = new URLSearchParams();
  if (start_month) params.set("start_month", start_month);
  if (end_month) params.set("end_month", end_month);
  if (project_id) params.set("project_id", project_id);
  params.set("project_account_id", String(resolveGeneralReportsAccountId(user)));
  if (search) params.set("search", search);
  if (name) params.set("name", name);
  if (cpf) params.set("cpf", cpf);
```

(resto do arquivo — chamada `fetch` e `Response` de retorno — permanece igual)

- [ ] **Step 18: Verificar que os tipos compilam**

```bash
npm run typecheck
```

Expected: sem erros.

---

## Depois da implementação (fora do escopo das tasks, feito pelo usuário)

1. Adicionar os valores reais em `.env.development` (e depois `.env.production`):
   ```
   GENERAL_REPORTS_ALLOWED_USER_IDS="<lista de IDs de colaboradores autorizados, separados por vírgula>"
   GENERAL_REPORTS_MASTER_ACCOUNT_ID="<accountId geral que agrega todas as campanhas>"
   ```
2. Testar no navegador logado com um usuário da lista: abrir cada um dos 4 relatórios gerais e, na aba Network do DevTools, confirmar que a requisição para a API de doações usa o accountId geral (path param em Resumo Financeiro; query string `account_reference_2`/`reference_2`/`project_account_id` nos outros três) em vez do accountId do próprio usuário.
3. Testar os botões de exportação de Resumo Financeiro e Doações Mês a Mês com esse mesmo usuário e confirmar, pela aba Network, que a URL de export também usa o accountId geral.
4. Testar com um usuário **fora** da lista e confirmar que o comportamento permanece inalterado (accountId do próprio usuário) tanto nas telas quanto nos exports.
