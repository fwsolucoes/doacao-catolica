# Donations Summary Metrics — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Conectar o endpoint `GET /metrics/donations-summary/{account_uuid}` aos cards de métricas "Ticket médio" e "Doadores" da tela de Doações.

**Architecture:** Nova feature `donationsSummary` seguindo o stack completo de clean arch do projeto: External Schema → Entity → Gateway Interface → SearchParams → Infra Gateway → UseCase → Controller → Factory. O loader da rota chama a nova factory em paralelo com as existentes.

**Tech Stack:** React Router v7 (SSR) · TypeScript · Zod · `donationApi` (ApiService com `api-key` header)

## Global Constraints

- Sempre named imports do React (`useState`, etc.), nunca `import * as React`
- Formatação de amounts no `toJson()` da entidade, nunca no gateway
- Nunca concatenar parâmetros manualmente na URL; usar `searchParams.toExternal()`
- `account_uuid` no path = `campaignId` de `route.params` (padrão do projeto)
- Usar `donationApi` (não `api`) com header `{ "api-key": environmentVariables.API_KEY_DONATION }`
- Componentes buscam dados via `useLoaderData` diretamente, nunca recebem como props

---

### Task 1: External Schema e SearchParams

**Files:**
- Create: `src/infra/schemas/external/donationsSummary.ts`
- Create: `src/app/search/donationsSummarySearchParams.ts`

**Interfaces:**
- Produces: `externalDonationsSummarySchema` (Zod schema) e `DonationsSummarySearchParams` (class)

- [ ] **Step 1: Criar o schema Zod da resposta da API**

`src/infra/schemas/external/donationsSummary.ts`:

```ts
import { z } from "zod";

const externalDonationsSummarySchema = z.object({
  message: z.string().optional(),
  data: z.object({
    period: z.object({
      start_date: z.string(),
      end_date: z.string(),
      previous_month_start_date: z.string(),
      previous_month_end_date: z.string(),
    }),
    average_ticket: z.object({
      period: z.number(),
      previous_month: z.number(),
      variation_percentage: z.number().nullable(),
    }),
    one_time_donations: z.object({
      count: z.number(),
      amount: z.number(),
    }),
    recurring_donations: z.object({
      count: z.number(),
      amount: z.number(),
    }),
    total_donations: z.object({
      count: z.number(),
      amount: z.number(),
    }),
    subscriptions: z.object({
      active_count: z.number(),
      active_amount: z.number(),
      created_in_period_count: z.number(),
      created_in_period_amount: z.number(),
      created_in_period_active_count: z.number(),
      created_in_period_active_amount: z.number(),
    }),
  }),
});

type ExternalDonationsSummary = z.infer<typeof externalDonationsSummarySchema>;

export { externalDonationsSummarySchema, type ExternalDonationsSummary };
```

- [ ] **Step 2: Criar SearchParams**

`src/app/search/donationsSummarySearchParams.ts`:

```ts
import { SearchParams } from "../shared/searchParams";

type Filter = {
  start_date: string;
  end_date: string;
};

class DonationsSummarySearchParams extends SearchParams<Filter> {}

export { DonationsSummarySearchParams };
```

---

### Task 2: Domain Entity

**Files:**
- Create: `src/domain/entities/donationsSummary.ts`

**Interfaces:**
- Consumes: nenhuma dependência de tasks anteriores
- Produces: `DonationsSummary.restore(props)` e `DonationsSummary#toJson()` retornando `DonationsSummaryJson`

```ts
type DonationsSummaryJson = {
  averageTicketPeriod: string;           // BRL
  averageTicketPreviousMonth: string;    // BRL
  variationPercentage: string | null;    // ex: "+12,5%" | "-3,2%" | null
  oneTimeDonationsAmount: string;        // BRL
  recurringDonationsAmount: string;      // BRL
  subscriptionsActiveCount: string;      // ex: "142"
  subscriptionsActiveAmount: string;     // BRL
  subscriptionsCreatedInPeriodActiveAmount: string; // BRL
};
```

- [ ] **Step 1: Criar a entidade**

`src/domain/entities/donationsSummary.ts`:

```ts
type DonationsSummaryProps = {
  averageTicketPeriod: number;
  averageTicketPreviousMonth: number;
  variationPercentage: number | null;
  oneTimeDonationsAmount: number;
  recurringDonationsAmount: number;
  subscriptionsActiveCount: number;
  subscriptionsActiveAmount: number;
  subscriptionsCreatedInPeriodActiveAmount: number;
};

class DonationsSummary {
  private constructor(private props: DonationsSummaryProps) {}

  static restore(props: DonationsSummaryProps): DonationsSummary {
    return new DonationsSummary(props);
  }

  toJson() {
    const fmt = (n: number) =>
      n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const variation = this.props.variationPercentage;
    const variationStr =
      variation === null
        ? null
        : `${variation >= 0 ? "+" : ""}${variation.toLocaleString("pt-BR", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}%`;

    return {
      averageTicketPeriod: fmt(this.props.averageTicketPeriod),
      averageTicketPreviousMonth: fmt(this.props.averageTicketPreviousMonth),
      variationPercentage: variationStr,
      oneTimeDonationsAmount: fmt(this.props.oneTimeDonationsAmount),
      recurringDonationsAmount: fmt(this.props.recurringDonationsAmount),
      subscriptionsActiveCount: String(this.props.subscriptionsActiveCount),
      subscriptionsActiveAmount: fmt(this.props.subscriptionsActiveAmount),
      subscriptionsCreatedInPeriodActiveAmount: fmt(
        this.props.subscriptionsCreatedInPeriodActiveAmount,
      ),
    };
  }
}

type DonationsSummaryJson = ReturnType<DonationsSummary["toJson"]>;

export { DonationsSummary, type DonationsSummaryJson };
```

---

### Task 3: Gateway Interface e Infra Gateway

**Files:**
- Create: `src/domain/gateways/donationsSummary.ts`
- Create: `src/infra/gateways/donationsSummary.ts`

**Interfaces:**
- Consumes: `DonationsSummarySearchParams` (Task 1) · `DonationsSummary` entity (Task 2) · `externalDonationsSummarySchema` (Task 1)
- Produces: `DonationsSummaryGatewayDTO` interface · `DonationsSummaryGateway` class com `getDonationsSummary(campaignId, searchParams): Promise<DonationsSummaryJson>`

- [ ] **Step 1: Criar a interface de gateway (domain)**

`src/domain/gateways/donationsSummary.ts`:

```ts
import type { DonationsSummarySearchParams } from "~/app/search/donationsSummarySearchParams";
import type { DonationsSummaryJson } from "../entities/donationsSummary";

type DonationsSummaryGatewayDTO = {
  getDonationsSummary(
    campaignId: string,
    searchParams: DonationsSummarySearchParams,
  ): Promise<DonationsSummaryJson>;
};

export type { DonationsSummaryGatewayDTO };
```

- [ ] **Step 2: Implementar o infra gateway**

`src/infra/gateways/donationsSummary.ts`:

```ts
import { DonationsSummary } from "~/domain/entities/donationsSummary";
import type { DonationsSummaryGatewayDTO } from "~/domain/gateways/donationsSummary";
import type { DonationsSummarySearchParams } from "~/app/search/donationsSummarySearchParams";
import type { DonationsSummaryJson } from "~/domain/entities/donationsSummary";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalDonationsSummarySchema } from "../schemas/external/donationsSummary";

class DonationsSummaryGateway implements DonationsSummaryGatewayDTO {
  async getDonationsSummary(
    campaignId: string,
    searchParams: DonationsSummarySearchParams,
  ): Promise<DonationsSummaryJson> {
    let url = `/metrics/donations-summary/${campaignId}`;
    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalDonationsSummarySchema,
    ).validate(apiResponse.response);

    const s = data.data.subscriptions;

    return DonationsSummary.restore({
      averageTicketPeriod: data.data.average_ticket.period,
      averageTicketPreviousMonth: data.data.average_ticket.previous_month,
      variationPercentage: data.data.average_ticket.variation_percentage,
      oneTimeDonationsAmount: data.data.one_time_donations.amount,
      recurringDonationsAmount: data.data.recurring_donations.amount,
      subscriptionsActiveCount: s.active_count,
      subscriptionsActiveAmount: s.active_amount,
      subscriptionsCreatedInPeriodActiveAmount: s.created_in_period_active_amount,
    }).toJson();
  }
}

export { DonationsSummaryGateway };
```

---

### Task 4: UseCase, Controller e Factory

**Files:**
- Create: `src/app/useCases/donationsSummary/getDonationsSummaryUseCase.ts`
- Create: `src/infra/controllers/donationsSummary/getDonationsSummaryController.ts`
- Create: `src/main/factories/donationsSummary/getDonationsSummaryFactory.ts`

**Interfaces:**
- Consumes: `DonationsSummaryGatewayDTO` (Task 3) · `DonationsSummarySearchParams` (Task 1) · `DonationsSummaryGateway` (Task 3)
- Produces: `getDonationsSummary.handle(route: RouteDTO): Promise<DonationsSummaryJson>` — exportado da factory

- [ ] **Step 1: Criar o use case**

`src/app/useCases/donationsSummary/getDonationsSummaryUseCase.ts`:

```ts
import { DonationsSummarySearchParams } from "~/app/search/donationsSummarySearchParams";
import type { DonationsSummaryGatewayDTO } from "~/domain/gateways/donationsSummary";
import { getMonthDates } from "~/lib/getMonthDates";

type InputProps = {
  campaignId: string;
  startDate?: string;
  endDate?: string;
};

class GetDonationsSummaryUseCase {
  constructor(private gateway: DonationsSummaryGatewayDTO) {}

  async execute(input: InputProps) {
    const { campaignId, startDate, endDate } = input;
    const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);

    const searchParams = new DonationsSummarySearchParams({
      filter: {
        start_date: startDate ?? firstDayOfMonth,
        end_date: endDate ?? lastDayOfMonth,
      },
    });

    return this.gateway.getDonationsSummary(campaignId, searchParams);
  }
}

export { GetDonationsSummaryUseCase };
```

- [ ] **Step 2: Criar o controller**

`src/infra/controllers/donationsSummary/getDonationsSummaryController.ts`:

```ts
import type { GetDonationsSummaryUseCase } from "~/app/useCases/donationsSummary/getDonationsSummaryUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetDonationsSummaryController {
  constructor(private useCase: GetDonationsSummaryUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.useCase.execute({
      campaignId,
      startDate: route.query.start_date,
      endDate: route.query.end_date,
    });
  }
}

export { GetDonationsSummaryController };
```

- [ ] **Step 3: Criar a factory**

`src/main/factories/donationsSummary/getDonationsSummaryFactory.ts`:

```ts
import { GetDonationsSummaryUseCase } from "~/app/useCases/donationsSummary/getDonationsSummaryUseCase";
import { GetDonationsSummaryController } from "~/infra/controllers/donationsSummary/getDonationsSummaryController";
import { DonationsSummaryGateway } from "~/infra/gateways/donationsSummary";

const donationsSummaryGateway = new DonationsSummaryGateway();
const getDonationsSummaryUseCase = new GetDonationsSummaryUseCase(
  donationsSummaryGateway,
);
const getDonationsSummaryController = new GetDonationsSummaryController(
  getDonationsSummaryUseCase,
);

const getDonationsSummary = {
  handle: getDonationsSummaryController.handle.bind(
    getDonationsSummaryController,
  ),
};

export { getDonationsSummary };
```

---

### Task 5: Atualizar o Loader da Rota

**Files:**
- Modify: `src/main/routes/route.campaign.donations.tsx`

**Interfaces:**
- Consumes: `getDonationsSummary` exportado da factory (Task 4)
- Produces: loader retorna `{ metrics, payments, donors, summary }` onde `summary` é `DonationsSummaryJson`

- [ ] **Step 1: Adicionar getDonationsSummary ao loader**

`src/main/routes/route.campaign.donations.tsx` — substituir o conteúdo atual por:

```tsx
import type { Route } from "+/route.campaign.donations";
import { redirect } from "react-router";
import { DonationsPage } from "~/client/pages/paymentStatements";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getPaymentMetrics, listPayments } from "../factories/paymentMetrics/getPaymentMetricsFactory";
import { listDonorsByCampaign } from "../factories/donor/listDonorsByCampaignFactory";
import { getDonationsSummary } from "../factories/donationsSummary/getDonationsSummaryFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const [metrics, payments, donors, summary] = await Promise.all([
    getPaymentMetrics.handle(adaptedRoute),
    listPayments.handle(adaptedRoute),
    listDonorsByCampaign.handle(adaptedRoute),
    getDonationsSummary.handle(adaptedRoute),
  ]);

  return { metrics, payments, donors, summary };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function DonationsRoute() {
  return <DonationsPage />;
}
```

- [ ] **Step 2: Verificar que o TypeScript compila sem erros**

```bash
npx tsc --noEmit
```

Esperado: sem erros de tipo.

---

### Task 6: Atualizar os Cards na UI

**Files:**
- Modify: `src/client/pages/paymentStatements/index.tsx`

**Interfaces:**
- Consumes: `summary: DonationsSummaryJson` via `useLoaderData<DonationsLoader>()`
  - `summary.averageTicketPeriod` — string BRL
  - `summary.variationPercentage` — string | null
  - `summary.oneTimeDonationsAmount` — string BRL
  - `summary.recurringDonationsAmount` — string BRL
  - `summary.subscriptionsActiveCount` — string (ex: "142")
  - `summary.subscriptionsActiveAmount` — string BRL
  - `summary.subscriptionsCreatedInPeriodActiveAmount` — string BRL

- [ ] **Step 1: Atualizar `DonationsPage` para usar `summary`**

`src/client/pages/paymentStatements/index.tsx` — substituir a construção do array `metricCards`:

```tsx
const { metrics, summary } = useLoaderData<DonationsLoader>();
```

```tsx
const metricCards: MetricCardProps[] = [
  {
    label: "Total recebido",
    value: metrics.released,
    subtitle: "doações confirmadas",
    icon: DollarSign,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    breakdown: [
      { icon: Globe, label: "Online", value: metrics.receivedOnline },
      { icon: Banknote, label: "Offline", value: metrics.receivedOffline },
    ],
  },
  {
    label: "Ticket médio",
    value: summary.averageTicketPeriod,
    subtitle: summary.variationPercentage
      ? `${summary.variationPercentage} vs. mês anterior`
      : "vs. mês anterior",
    icon: TrendingUp,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-800",
    breakdown: [
      { icon: Zap, label: "Doações únicas", value: summary.oneTimeDonationsAmount },
      { icon: RefreshCw, label: "Recorrentes", value: summary.recurringDonationsAmount },
    ],
  },
  {
    label: "Doadores",
    value: summary.subscriptionsActiveCount,
    subtitle: "assinaturas ativas",
    icon: Users,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-800",
    breakdown: [
      { icon: UserCheck, label: "Assinaturas ativas", value: summary.subscriptionsActiveAmount },
      { icon: UserPlus, label: "Novas no período", value: summary.subscriptionsCreatedInPeriodActiveAmount },
    ],
  },
  {
    label: "Pendências",
    value: metrics.pending,
    subtitle: "exigem atenção",
    icon: AlertTriangle,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-700",
    breakdown: [
      { icon: Hourglass, label: "Aguardando pgto", value: metrics.awaitingRelease },
      { icon: TriangleAlert, label: "Em atraso", value: metrics.overdue },
      { icon: XCircle, label: "Cancelados", value: metrics.canceled },
    ],
  },
];
```

Remover imports não mais usados do topo do arquivo: `UserPlus` e `UserCheck` mudam de posição mas continuam sendo usados. Remover `Download` se o botão Exportar for mantido (checar). Manter todos os demais imports de ícones.

- [ ] **Step 2: Verificar TypeScript e testar na tela**

```bash
npx tsc --noEmit
```

Abrir a tela `/campaign/:campaignId/donations` no browser e verificar:
- Card "Ticket médio": valor principal em BRL, subtitle mostra variação (ou "vs. mês anterior" quando null), breakdown com doações únicas e recorrentes em BRL
- Card "Doadores": valor principal é o count de assinaturas ativas (número inteiro), subtitle "assinaturas ativas", breakdown mostra os dois amounts em BRL
- Cards "Total recebido" e "Pendências": sem alteração visual
- Selecionar período diferente no `PeriodSelect` e confirmar que os valores atualizam
