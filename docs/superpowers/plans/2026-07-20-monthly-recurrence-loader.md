# Monthly Recurrence Loader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar o endpoint `GET /campaign/recurrence/{account_uuid}` no loader da página de dashboard, substituindo os dados hardcoded do card "Recorrência mensal" por dados reais.

**Architecture:** Segue o padrão Gateway → UseCase → Controller → Factory já estabelecido nos outros cards da página (`campaignBreakdowns`, `campaignActivity`). O tipo `CampaignHomeLoader` é derivado automaticamente do retorno do loader da rota, sem arquivo a modificar.

**Tech Stack:** React Router v7 (SSR), Zod v4, `donationApi` (autenticado via `api-key` header), `SearchParams` base class.

## Global Constraints

- Zod: usar `z.uuid()` standalone, nunca `z.string().uuid()` (preterido no Zod v4)
- Gateway: nunca concatenar parâmetros manualmente na URL; usar `searchParams.toExternal(["page", "pageLimit"])`
- `donationApi`: autenticar com `headers: { "api-key": environmentVariables.API_KEY_DONATION }` — sem verificar `AuthService`
- Parâmetros do gateway interface: separados, nunca agrupados em objeto genérico
- Naming: arquivos e identificadores em inglês; textos de UI em português

---

## File Map

| Ação | Arquivo |
|---|---|
| Criar | `src/infra/schemas/external/campaignRecurrence.ts` |
| Criar | `src/domain/gateways/campaignRecurrence.ts` |
| Criar | `src/app/search/campaignRecurrenceSearchParams.ts` |
| Criar | `src/infra/gateways/campaignRecurrence.ts` |
| Criar | `src/app/useCases/campaignRecurrence/getCampaignRecurrenceUseCase.ts` |
| Criar | `src/infra/controllers/campaignRecurrence/getCampaignRecurrenceController.ts` |
| Criar | `src/main/factories/campaignRecurrence/getCampaignRecurrenceFactory.ts` |
| Modificar | `src/main/routes/route.campaign.home.tsx` |
| Modificar | `src/client/pages/campaignHome/monthly-recurrence-card.tsx` |

---

## Task 1: External Schema + Domain Gateway Interface

**Files:**
- Create: `src/infra/schemas/external/campaignRecurrence.ts`
- Create: `src/domain/gateways/campaignRecurrence.ts`

**Interfaces:**
- Produces:
  - `externalCampaignRecurrenceSchema` (Zod schema)
  - `RecurrenceMonth` type: `{ month: string; label: string; activeSubscriptions: number; recurringDonations: number; recurringAmount: number }`
  - `CampaignRecurrenceData` type: `{ months: RecurrenceMonth[] }`
  - `CampaignRecurrenceGatewayDTO` interface com método `getRecurrence(campaignId: string, searchParams: CampaignRecurrenceSearchParams): Promise<CampaignRecurrenceData>`

- [ ] **Step 1: Criar o schema Zod externo**

`src/infra/schemas/external/campaignRecurrence.ts`:
```ts
import { z } from "zod";

const externalCampaignRecurrenceSchema = z.object({
  message: z.string(),
  data: z.object({
    months: z.array(
      z.object({
        month: z.string(),
        label: z.string(),
        active_subscriptions: z.number(),
        recurring_donations: z.number(),
        recurring_amount: z.number(),
      }),
    ),
  }),
});

export { externalCampaignRecurrenceSchema };
```

- [ ] **Step 2: Criar a interface do gateway e os tipos de domínio**

`src/domain/gateways/campaignRecurrence.ts`:
```ts
import type { CampaignRecurrenceSearchParams } from "~/app/search/campaignRecurrenceSearchParams";

type RecurrenceMonth = {
  month: string;
  label: string;
  activeSubscriptions: number;
  recurringDonations: number;
  recurringAmount: number;
};

type CampaignRecurrenceData = {
  months: RecurrenceMonth[];
};

type CampaignRecurrenceGatewayDTO = {
  getRecurrence(
    campaignId: string,
    searchParams: CampaignRecurrenceSearchParams,
  ): Promise<CampaignRecurrenceData>;
};

export type {
  CampaignRecurrenceGatewayDTO,
  CampaignRecurrenceData,
  RecurrenceMonth,
};
```

---

## Task 2: SearchParams

**Files:**
- Create: `src/app/search/campaignRecurrenceSearchParams.ts`

**Interfaces:**
- Consumes: `SearchParams` de `~/app/shared/searchParams`
- Produces: `CampaignRecurrenceSearchParams` — estende `SearchParams<{ month?: number; year?: number }>`

- [ ] **Step 1: Criar a classe SearchParams da feature**

`src/app/search/campaignRecurrenceSearchParams.ts`:
```ts
import { SearchParams } from "../shared/searchParams";

type Filter = {
  month?: number;
  year?: number;
};

class CampaignRecurrenceSearchParams extends SearchParams<Filter> {}

export { CampaignRecurrenceSearchParams };
```

---

## Task 3: Gateway Implementation

**Files:**
- Create: `src/infra/gateways/campaignRecurrence.ts`

**Interfaces:**
- Consumes:
  - `CampaignRecurrenceGatewayDTO` de `~/domain/gateways/campaignRecurrence`
  - `CampaignRecurrenceData` de `~/domain/gateways/campaignRecurrence`
  - `CampaignRecurrenceSearchParams` de `~/app/search/campaignRecurrenceSearchParams`
  - `externalCampaignRecurrenceSchema` de `~/infra/schemas/external/campaignRecurrence`
  - `donationApi` de `~/infra/http/donationApi`
  - `environmentVariables` de `~/main/config/environmentVariables`
  - `HttpAdapter` de `~/infra/adapters/httpAdapter`
  - `SchemaValidatorAdapter` de `~/infra/adapters/schemaValidatorAdapter`
- Produces: `CampaignRecurrenceGateway` (implementa `CampaignRecurrenceGatewayDTO`)

- [ ] **Step 1: Criar a implementação do gateway**

`src/infra/gateways/campaignRecurrence.ts`:
```ts
import type { CampaignRecurrenceSearchParams } from "~/app/search/campaignRecurrenceSearchParams";
import type {
  CampaignRecurrenceData,
  CampaignRecurrenceGatewayDTO,
} from "~/domain/gateways/campaignRecurrence";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalCampaignRecurrenceSchema } from "../schemas/external/campaignRecurrence";

class CampaignRecurrenceGateway implements CampaignRecurrenceGatewayDTO {
  async getRecurrence(
    campaignId: string,
    searchParams: CampaignRecurrenceSearchParams,
  ): Promise<CampaignRecurrenceData> {
    let url = `/campaign/recurrence/${campaignId}`;
    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalCampaignRecurrenceSchema,
    ).validate(apiResponse.response);

    return {
      months: data.data.months.map((m) => ({
        month: m.month,
        label: m.label,
        activeSubscriptions: m.active_subscriptions,
        recurringDonations: m.recurring_donations,
        recurringAmount: m.recurring_amount,
      })),
    };
  }
}

export { CampaignRecurrenceGateway };
```

---

## Task 4: UseCase + Controller + Factory

**Files:**
- Create: `src/app/useCases/campaignRecurrence/getCampaignRecurrenceUseCase.ts`
- Create: `src/infra/controllers/campaignRecurrence/getCampaignRecurrenceController.ts`
- Create: `src/main/factories/campaignRecurrence/getCampaignRecurrenceFactory.ts`

**Interfaces:**
- Consumes:
  - `CampaignRecurrenceGatewayDTO` de `~/domain/gateways/campaignRecurrence`
  - `CampaignRecurrenceSearchParams` de `~/app/search/campaignRecurrenceSearchParams`
  - `CampaignRecurrenceGateway` de `~/infra/gateways/campaignRecurrence`
  - `HttpAdapter` de `~/infra/adapters/httpAdapter`
  - `RouteDTO` de `~/main/types/route`
- Produces: `getCampaignRecurrence.handle` — função `(route: RouteDTO) => Promise<CampaignRecurrenceData>`

- [ ] **Step 1: Criar o use case**

`src/app/useCases/campaignRecurrence/getCampaignRecurrenceUseCase.ts`:
```ts
import { CampaignRecurrenceSearchParams } from "~/app/search/campaignRecurrenceSearchParams";
import type { CampaignRecurrenceGatewayDTO } from "~/domain/gateways/campaignRecurrence";

type InputProps = {
  campaignId: string;
  month?: number;
  year?: number;
};

class GetCampaignRecurrenceUseCase {
  constructor(private gateway: CampaignRecurrenceGatewayDTO) {}

  async execute({ campaignId, month, year }: InputProps) {
    const searchParams = new CampaignRecurrenceSearchParams({
      filter: { month, year },
    });

    return await this.gateway.getRecurrence(campaignId, searchParams);
  }
}

export { GetCampaignRecurrenceUseCase };
```

- [ ] **Step 2: Criar o controller**

`src/infra/controllers/campaignRecurrence/getCampaignRecurrenceController.ts`:
```ts
import type { GetCampaignRecurrenceUseCase } from "~/app/useCases/campaignRecurrence/getCampaignRecurrenceUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetCampaignRecurrenceController {
  constructor(private useCase: GetCampaignRecurrenceUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const month = route.query.month ? Number(route.query.month) : undefined;
    const year = route.query.year ? Number(route.query.year) : undefined;

    return await this.useCase.execute({ campaignId, month, year });
  }
}

export { GetCampaignRecurrenceController };
```

- [ ] **Step 3: Criar a factory**

`src/main/factories/campaignRecurrence/getCampaignRecurrenceFactory.ts`:
```ts
import { GetCampaignRecurrenceUseCase } from "~/app/useCases/campaignRecurrence/getCampaignRecurrenceUseCase";
import { GetCampaignRecurrenceController } from "~/infra/controllers/campaignRecurrence/getCampaignRecurrenceController";
import { CampaignRecurrenceGateway } from "~/infra/gateways/campaignRecurrence";

const campaignRecurrenceGateway = new CampaignRecurrenceGateway();
const getCampaignRecurrenceUseCase = new GetCampaignRecurrenceUseCase(
  campaignRecurrenceGateway,
);
const getCampaignRecurrenceController = new GetCampaignRecurrenceController(
  getCampaignRecurrenceUseCase,
);

const getCampaignRecurrence = {
  handle: getCampaignRecurrenceController.handle.bind(
    getCampaignRecurrenceController,
  ),
};

export { getCampaignRecurrence };
```

---

## Task 5: Wire loader + update card component

**Files:**
- Modify: `src/main/routes/route.campaign.home.tsx`
- Modify: `src/client/pages/campaignHome/monthly-recurrence-card.tsx`

**Interfaces:**
- Consumes:
  - `getCampaignRecurrence` de `~/main/factories/campaignRecurrence/getCampaignRecurrenceFactory`
  - `CampaignHomeLoader` de `~/client/types/campaignHomeLoader` (auto-atualizado via inferência do retorno do loader)
  - `useLoaderData` de `react-router`
- Produces: card renderizando dados reais do endpoint

- [ ] **Step 1: Adicionar recurrence ao loader da rota**

`src/main/routes/route.campaign.home.tsx` — conteúdo completo:
```tsx
import type { Route } from "./+types/route.campaign.home";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { getCampaignActivity } from "~/main/factories/campaignActivity/getCampaignActivityFactory";
import { getCampaignBreakdowns } from "~/main/factories/campaignBreakdowns/getCampaignBreakdownsFactory";
import { getCampaignOverview } from "~/main/factories/campaignOverview/getCampaignOverviewFactory";
import { getDonationEvolution } from "~/main/factories/donationEvolution/getDonationEvolutionFactory";
import { getCampaignRecurrence } from "~/main/factories/campaignRecurrence/getCampaignRecurrenceFactory";
import { CampaignHomePage } from "~/client/pages/campaignHome";

export async function loader(args: Route.LoaderArgs) {
  const route = await RouteAdapter.adaptRoute(args);

  const [overview, evolution, activity, breakdowns, recurrence] = await Promise.all([
    getCampaignOverview.handle(route),
    getDonationEvolution.handle(route),
    getCampaignActivity.handle(route),
    getCampaignBreakdowns.handle(route),
    getCampaignRecurrence.handle(route),
  ]);

  return { overview, evolution, activity, breakdowns, recurrence };
}

export default function CampaignHomeRoute() {
  return <CampaignHomePage />;
}
```

- [ ] **Step 2: Atualizar o card para usar dados reais**

`src/client/pages/campaignHome/monthly-recurrence-card.tsx` — conteúdo completo:
```tsx
import { Bar } from "react-chartjs-2";
import { useLoaderData } from "react-router";
import { Card } from "~/client/components/ui/card";
import type { CampaignHomeLoader } from "~/client/types/campaignHomeLoader";
import { BASE_CHART_OPTIONS } from "./chart-setup";

function MonthlyRecurrenceCard() {
  const { recurrence } = useLoaderData<CampaignHomeLoader>();

  const data = {
    labels: recurrence.months.map((m) => m.label),
    datasets: [
      {
        label: "Assinaturas ativas",
        data: recurrence.months.map((m) => m.activeSubscriptions),
        backgroundColor: "#5b4eff",
        borderRadius: 4,
        barPercentage: 0.92,
        categoryPercentage: 0.7,
      },
      {
        label: "Doações recorrentes",
        data: recurrence.months.map((m) => m.recurringDonations),
        backgroundColor: "#74e7bb",
        borderRadius: 4,
        barPercentage: 0.92,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options = {
    ...BASE_CHART_OPTIONS,
    plugins: {
      ...BASE_CHART_OPTIONS.plugins,
      legend: {
        display: true,
        position: "bottom" as const,
        align: "center" as const,
        labels: {
          boxWidth: 10,
          borderRadius: 2,
          useBorderRadius: true,
          font: { size: 11 },
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { font: { size: 11 } },
      },
    },
  };

  return (
    <Card.Root className="p-6">
      <div>
        <p className="text-sm font-semibold text-(--text-heading)">
          Recorrência mensal
        </p>
        <p className="text-xs text-muted-foreground">
          Assinaturas ativas vs. doações recorrentes efetivadas nos últimos 12
          meses.
        </p>
      </div>
      <div className="h-72">
        <Bar data={data} options={options} />
      </div>
    </Card.Root>
  );
}

export { MonthlyRecurrenceCard };
```
