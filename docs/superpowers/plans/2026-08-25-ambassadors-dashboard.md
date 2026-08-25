# Ambassadors Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Conectar a tela de Relatório de Embaixadores (dados mockados) à API real `/donation/ambassadors/dashboard` via clean architecture completa.

**Architecture:** Gateway pattern usando `donationApi` (sem AuthService no controller). Uma entidade `Ambassador` formata `created_at`, telefone e valores BRL em `toJson()`. Filtros (período, datas, paginação, busca) viram URL query params lidos pelo loader.

**Tech Stack:** React Router v7 (SSR), Zod v4, donationApi, tailwind-variants, shadcn/ui, Chart.js / react-chartjs-2

**Spec:** Design aprovado em chat — 2026-08-25

## Global Constraints

- Zod v4: usar `z.uuid()` standalone, nunca `z.string().uuid()`
- Imports do React: sempre named imports (`useState`, `useEffect`), nunca `import * as React`
- Componentes: sempre `<Button>`, `<Input>` etc. do design system; nunca elementos nativos
- Sem parâmetros manuais na URL do gateway; usar `toExternal()` com exclusões
- Formatações (datas, moedas, máscaras) pertencem ao `toJson()` da entidade, nunca ao gateway
- `donationApi` + `api-key` header (`environmentVariables.API_KEY_DONATION`) — controller sem `AuthService`
- Arquivos e identificadores sempre em inglês; textos de UI em português

---

### Task 1: External Schema

**Files:**
- Create: `src/infra/schemas/external/ambassadorsDashboard.ts`

**Interfaces:**
- Produces: `externalAmbassadorsDashboardSchema` (Zod schema), `ExternalAmbassadorItem` (tipo inferido)

- [ ] **Step 1: Criar o schema Zod**

```ts
// src/infra/schemas/external/ambassadorsDashboard.ts
import { z } from "zod";

const externalAmbassadorItemSchema = z.object({
  rank: z.number(),
  id: z.uuid(),
  project_id: z.uuid(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  status: z.string(),
  code: z.string(),
  created_at: z.string(),
  period_indications: z.number(),
  total_indications: z.number(),
  total_recurring_amount: z.number(),
  total_raised_amount: z.number(),
  total_paid_payments: z.number(),
});

const externalAmbassadorsDashboardSchema = z.object({
  success: z.boolean(),
  data: z.object({
    summary: z.object({
      total_ambassadors: z.number(),
      period_indications: z.number(),
      previous_period: z.object({
        start_date: z.string(),
        end_date: z.string(),
        period_indications: z.number(),
        variation_percent: z.number().nullable(),
      }),
      total_indications: z.number(),
      total_recurring_amount: z.number(),
      total_raised_amount: z.number(),
    }),
    charts: z.object({
      indications_by_day: z.array(
        z.object({
          date: z.string(),
          label: z.string(),
          total_indications: z.number(),
          total_amount: z.number(),
        }),
      ),
      donation_amount_ranges: z.array(
        z.object({
          key: z.string(),
          label: z.string(),
          total_payments: z.number(),
          total_amount: z.number(),
        }),
      ),
      payment_methods: z.array(
        z.object({
          type: z.string(),
          label: z.string(),
          total_payments: z.number(),
          total_amount: z.number(),
          percentage: z.number(),
        }),
      ),
    }),
    ambassadors: z.object({
      data: z.array(externalAmbassadorItemSchema),
      pagination: z.object({
        current_page: z.number(),
        per_page: z.number(),
        from: z.number(),
        to: z.number(),
        total: z.number(),
        last_page: z.number(),
      }),
    }),
  }),
});

type ExternalAmbassadorItem = z.infer<typeof externalAmbassadorItemSchema>;

export { externalAmbassadorsDashboardSchema, type ExternalAmbassadorItem };
```

- [ ] **Step 2: Verificar que o arquivo compila**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

---

### Task 2: Ambassador Entity

**Files:**
- Create: `src/domain/entities/ambassador.ts`

**Interfaces:**
- Consumes: nada
- Produces: classe `Ambassador` com `restore(props)` e `toJson()` → `AmbassadorJson`

`toJson()` formata:
- `createdAt` (`"2026-08-21 17:28:54.594878"`) → `"21/08/2026"` (parte antes do espaço, split em `-`, reverse, join `/`)
- `phone` (11 dígitos `"44999690413"`) → `"(44) 99969-0413"`; 10 dígitos → `"(44) 9969-0413"`; outros → valor bruto
- `totalRecurringAmount` e `totalRaisedAmount` (numbers) → BRL string (`n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })`)

- [ ] **Step 1: Criar a entidade**

```ts
// src/domain/entities/ambassador.ts
type AmbassadorProps = {
  id: string;
  projectId: string;
  rank: number;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  code: string;
  createdAt: string;
  periodIndications: number;
  totalIndications: number;
  totalRecurringAmount: number;
  totalRaisedAmount: number;
  totalPaidPayments: number;
};

class Ambassador {
  private constructor(private props: AmbassadorProps) {}

  static restore(props: AmbassadorProps) {
    return new Ambassador(props);
  }

  private formatCreatedAt(): string {
    const datePart = this.props.createdAt.split(" ")[0];
    if (!datePart) return this.props.createdAt;
    const [year, month, day] = datePart.split("-");
    if (!year || !month || !day) return this.props.createdAt;
    return `${day}/${month}/${year}`;
  }

  private formatPhone(): string | null {
    if (!this.props.phone) return null;
    const digits = this.props.phone.replace(/\D/g, "");
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return this.props.phone;
  }

  private formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  toJson() {
    return {
      id: this.props.id,
      projectId: this.props.projectId,
      rank: this.props.rank,
      name: this.props.name,
      email: this.props.email,
      phone: this.formatPhone(),
      status: this.props.status,
      code: this.props.code,
      createdAt: this.formatCreatedAt(),
      periodIndications: this.props.periodIndications,
      totalIndications: this.props.totalIndications,
      totalRecurringAmount: this.formatCurrency(this.props.totalRecurringAmount),
      totalRaisedAmount: this.formatCurrency(this.props.totalRaisedAmount),
      totalPaidPayments: this.props.totalPaidPayments,
    };
  }
}

type AmbassadorJson = ReturnType<Ambassador["toJson"]>;

export { Ambassador, type AmbassadorJson, type AmbassadorProps };
```

- [ ] **Step 2: Verificar que compila**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

---

### Task 3: Gateway Interface + SearchParams

**Files:**
- Create: `src/domain/gateways/ambassadorsDashboard.ts`
- Create: `src/app/search/ambassadorsDashboardSearchParams.ts`

**Interfaces:**
- Consumes: `AmbassadorJson` de `~/domain/entities/ambassador`
- Produces:
  - tipo `AmbassadorsDashboardData` (resultado tipado do gateway)
  - tipo `AmbassadorsDashboardGatewayDTO` (interface do gateway)
  - classe `AmbassadorsDashboardSearchParams` com `.toExternal(unusable)`

- [ ] **Step 1: Criar a interface do gateway**

```ts
// src/domain/gateways/ambassadorsDashboard.ts
import type { AmbassadorJson } from "../entities/ambassador";
import type { AmbassadorsDashboardSearchParams } from "~/app/search/ambassadorsDashboardSearchParams";

type AmbassadorsDashboardPreviousPeriod = {
  startDate: string;
  endDate: string;
  periodIndications: number;
  variationPercent: number | null;
};

type AmbassadorsDashboardSummary = {
  totalAmbassadors: number;
  periodIndications: number;
  previousPeriod: AmbassadorsDashboardPreviousPeriod;
  totalIndications: number;
  totalRecurringAmount: number;
  totalRaisedAmount: number;
};

type AmbassadorsDashboardIndicationByDay = {
  date: string;
  label: string;
  totalIndications: number;
  totalAmount: number;
};

type AmbassadorsDashboardAmountRange = {
  key: string;
  label: string;
  totalPayments: number;
  totalAmount: number;
};

type AmbassadorsDashboardPaymentMethod = {
  type: string;
  label: string;
  totalPayments: number;
  totalAmount: number;
  percentage: number;
};

type AmbassadorsDashboardCharts = {
  indicationsByDay: AmbassadorsDashboardIndicationByDay[];
  donationAmountRanges: AmbassadorsDashboardAmountRange[];
  paymentMethods: AmbassadorsDashboardPaymentMethod[];
};

type AmbassadorsDashboardPagination = {
  currentPage: number;
  perPage: number;
  from: number;
  to: number;
  total: number;
  lastPage: number;
};

type AmbassadorsDashboardData = {
  summary: AmbassadorsDashboardSummary;
  charts: AmbassadorsDashboardCharts;
  ambassadors: AmbassadorJson[];
  pagination: AmbassadorsDashboardPagination;
};

type AmbassadorsDashboardGatewayDTO = {
  getDashboard(
    campaignId: string,
    searchParams: AmbassadorsDashboardSearchParams,
  ): Promise<AmbassadorsDashboardData>;
};

export type {
  AmbassadorsDashboardGatewayDTO,
  AmbassadorsDashboardData,
  AmbassadorsDashboardSummary,
  AmbassadorsDashboardCharts,
  AmbassadorsDashboardPagination,
};
```

- [ ] **Step 2: Criar a SearchParams**

```ts
// src/app/search/ambassadorsDashboardSearchParams.ts
import { SearchParams } from "../shared/searchParams";

type AmbassadorsDashboardFilter = {
  project_id: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  min_indications?: string;
  max_indications?: string;
};

class AmbassadorsDashboardSearchParams extends SearchParams<AmbassadorsDashboardFilter> {}

export { AmbassadorsDashboardSearchParams };
```

- [ ] **Step 3: Verificar que compila**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

---

### Task 4: Gateway Implementation

**Files:**
- Create: `src/infra/gateways/ambassadorsDashboard.ts`

**Interfaces:**
- Consumes:
  - `AmbassadorsDashboardSearchParams` de `~/app/search/ambassadorsDashboardSearchParams`
  - `AmbassadorsDashboardGatewayDTO`, `AmbassadorsDashboardData` de `~/domain/gateways/ambassadorsDashboard`
  - `externalAmbassadorsDashboardSchema` de `~/infra/schemas/external/ambassadorsDashboard`
  - `Ambassador` de `~/domain/entities/ambassador`
  - `donationApi` de `~/infra/http/donationApi`
  - `environmentVariables` de `~/main/config/environmentVariables`
- Produces: classe `AmbassadorsDashboardGateway` que implementa `AmbassadorsDashboardGatewayDTO`

O gateway:
- Chama `donationApi.get("/donation/ambassadors/dashboard", { headers: { "api-key": ... } })`
- Usa `searchParams.toExternal(["pageLimit"])` — exclui `pagesize` (API não usa); mantém `page` e todos os filtros
- Valida com `externalAmbassadorsDashboardSchema`
- Mapeia `data.ambassadors.data` para `Ambassador.restore(...).toJson()`
- Retorna `AmbassadorsDashboardData` com summary, charts e ambassadors já formatados

- [ ] **Step 1: Criar o gateway**

```ts
// src/infra/gateways/ambassadorsDashboard.ts
import type { AmbassadorsDashboardSearchParams } from "~/app/search/ambassadorsDashboardSearchParams";
import type {
  AmbassadorsDashboardData,
  AmbassadorsDashboardGatewayDTO,
} from "~/domain/gateways/ambassadorsDashboard";
import { Ambassador } from "~/domain/entities/ambassador";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalAmbassadorsDashboardSchema } from "../schemas/external/ambassadorsDashboard";

class AmbassadorsDashboardGateway implements AmbassadorsDashboardGatewayDTO {
  async getDashboard(
    campaignId: string,
    searchParams: AmbassadorsDashboardSearchParams,
  ): Promise<AmbassadorsDashboardData> {
    let url = "/donation/ambassadors/dashboard";
    url += searchParams.toExternal(["pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const { data } = new SchemaValidatorAdapter(
      externalAmbassadorsDashboardSchema,
    ).validate(apiResponse.response);

    const { summary, charts, ambassadors } = data;

    return {
      summary: {
        totalAmbassadors: summary.total_ambassadors,
        periodIndications: summary.period_indications,
        previousPeriod: {
          startDate: summary.previous_period.start_date,
          endDate: summary.previous_period.end_date,
          periodIndications: summary.previous_period.period_indications,
          variationPercent: summary.previous_period.variation_percent,
        },
        totalIndications: summary.total_indications,
        totalRecurringAmount: summary.total_recurring_amount,
        totalRaisedAmount: summary.total_raised_amount,
      },
      charts: {
        indicationsByDay: charts.indications_by_day.map((d) => ({
          date: d.date,
          label: d.label,
          totalIndications: d.total_indications,
          totalAmount: d.total_amount,
        })),
        donationAmountRanges: charts.donation_amount_ranges.map((r) => ({
          key: r.key,
          label: r.label,
          totalPayments: r.total_payments,
          totalAmount: r.total_amount,
        })),
        paymentMethods: charts.payment_methods.map((m) => ({
          type: m.type,
          label: m.label,
          totalPayments: m.total_payments,
          totalAmount: m.total_amount,
          percentage: m.percentage,
        })),
      },
      ambassadors: ambassadors.data.map((item) =>
        Ambassador.restore({
          id: item.id,
          projectId: item.project_id,
          rank: item.rank,
          name: item.name,
          email: item.email,
          phone: item.phone,
          status: item.status,
          code: item.code,
          createdAt: item.created_at,
          periodIndications: item.period_indications,
          totalIndications: item.total_indications,
          totalRecurringAmount: item.total_recurring_amount,
          totalRaisedAmount: item.total_raised_amount,
          totalPaidPayments: item.total_paid_payments,
        }).toJson(),
      ),
      pagination: {
        currentPage: ambassadors.pagination.current_page,
        perPage: ambassadors.pagination.per_page,
        from: ambassadors.pagination.from,
        to: ambassadors.pagination.to,
        total: ambassadors.pagination.total,
        lastPage: ambassadors.pagination.last_page,
      },
    };
  }
}

export { AmbassadorsDashboardGateway };
```

- [ ] **Step 2: Verificar que compila**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

---

### Task 5: UseCase + Controller + Factory

**Files:**
- Create: `src/app/useCases/ambassadorsDashboard/getAmbassadorsDashboardUseCase.ts`
- Create: `src/infra/controllers/ambassadorsDashboard/getAmbassadorsDashboardController.ts`
- Create: `src/main/factories/ambassadorsDashboard/getAmbassadorsDashboardFactory.ts`

**Interfaces:**
- Consumes:
  - `AmbassadorsDashboardGatewayDTO` de `~/domain/gateways/ambassadorsDashboard`
  - `AmbassadorsDashboardSearchParams` de `~/app/search/ambassadorsDashboardSearchParams`
  - `AmbassadorsDashboardGateway` de `~/infra/gateways/ambassadorsDashboard`
  - `RouteDTO` de `~/main/types/route`
  - `HttpAdapter` de `~/infra/adapters/httpAdapter`
- Produces: objeto `getAmbassadorsDashboard` com método `.handle(route)`

- [ ] **Step 1: Criar o UseCase**

```ts
// src/app/useCases/ambassadorsDashboard/getAmbassadorsDashboardUseCase.ts
import { AmbassadorsDashboardSearchParams } from "~/app/search/ambassadorsDashboardSearchParams";
import type { AmbassadorsDashboardGatewayDTO } from "~/domain/gateways/ambassadorsDashboard";

type InputProps = {
  campaignId: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  search?: string;
  minIndications?: string;
  maxIndications?: string;
};

class GetAmbassadorsDashboardUseCase {
  constructor(private gateway: AmbassadorsDashboardGatewayDTO) {}

  async execute(input: InputProps) {
    const searchParams = new AmbassadorsDashboardSearchParams({
      page: input.page ? Number(input.page) : 1,
      filter: {
        project_id: input.campaignId,
        start_date: input.startDate,
        end_date: input.endDate,
        search: input.search,
        min_indications: input.minIndications,
        max_indications: input.maxIndications,
      },
    });

    return await this.gateway.getDashboard(input.campaignId, searchParams);
  }
}

export { GetAmbassadorsDashboardUseCase };
```

- [ ] **Step 2: Criar o Controller**

O controller **não** verifica `AuthService` porque usa `donationApi`.

```ts
// src/infra/controllers/ambassadorsDashboard/getAmbassadorsDashboardController.ts
import type { GetAmbassadorsDashboardUseCase } from "~/app/useCases/ambassadorsDashboard/getAmbassadorsDashboardUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetAmbassadorsDashboardController {
  constructor(private useCase: GetAmbassadorsDashboardUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.useCase.execute({
      campaignId,
      startDate: route.query.start_date,
      endDate: route.query.end_date,
      page: route.query.page,
      search: route.query.search,
      minIndications: route.query.min_indications,
      maxIndications: route.query.max_indications,
    });
  }
}

export { GetAmbassadorsDashboardController };
```

- [ ] **Step 3: Criar a Factory**

```ts
// src/main/factories/ambassadorsDashboard/getAmbassadorsDashboardFactory.ts
import { GetAmbassadorsDashboardUseCase } from "~/app/useCases/ambassadorsDashboard/getAmbassadorsDashboardUseCase";
import { GetAmbassadorsDashboardController } from "~/infra/controllers/ambassadorsDashboard/getAmbassadorsDashboardController";
import { AmbassadorsDashboardGateway } from "~/infra/gateways/ambassadorsDashboard";

const gateway = new AmbassadorsDashboardGateway();
const useCase = new GetAmbassadorsDashboardUseCase(gateway);
const controller = new GetAmbassadorsDashboardController(useCase);

const getAmbassadorsDashboard = {
  handle: controller.handle.bind(controller),
};

export { getAmbassadorsDashboard };
```

- [ ] **Step 4: Verificar que compila**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

---

### Task 6: Route Loader + Loader Type

**Files:**
- Modify: `src/main/routes/route.campaign.ambassadorsReport.tsx`
- Create: `src/client/types/ambassadorsDashboardLoader.ts`

**Interfaces:**
- Consumes: `getAmbassadorsDashboard` de `~/main/factories/ambassadorsDashboard/getAmbassadorsDashboardFactory`
- Produces: `AmbassadorsDashboardLoader` (tipo do loader)

O loader não precisa verificar autenticação (donationApi). O `campaignId` vem de `route.params` (param do layout de campanha).

- [ ] **Step 1: Atualizar a route com loader**

Substituir o conteúdo de `src/main/routes/route.campaign.ambassadorsReport.tsx`:

```tsx
// src/main/routes/route.campaign.ambassadorsReport.tsx
import type { Route } from "+/route.campaign.ambassadorsReport";
import { AmbassadorsReportPage } from "~/client/pages/ambassadorsReport";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { getAmbassadorsDashboard } from "../factories/ambassadorsDashboard/getAmbassadorsDashboardFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const dashboard = await getAmbassadorsDashboard.handle(adaptedRoute);
  return { dashboard };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function AmbassadorsReportRoute() {
  return <AmbassadorsReportPage />;
}
```

- [ ] **Step 2: Criar o tipo do loader**

```ts
// src/client/types/ambassadorsDashboardLoader.ts
import type { loader } from "~/main/routes/route.campaign.ambassadorsReport";

type AmbassadorsDashboardLoader = Awaited<ReturnType<typeof loader>>;

export type { AmbassadorsDashboardLoader };
```

- [ ] **Step 3: Verificar que compila**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

---

### Task 7: Page Update

**Files:**
- Modify: `src/client/pages/ambassadorsReport/index.tsx`

**Interfaces:**
- Consumes:
  - `useLoaderData` → `AmbassadorsDashboardLoader` de `~/client/types/ambassadorsDashboardLoader`
  - `useLocation`, `useNavigate` de `react-router`
  - Dados reais: `dashboard.summary`, `dashboard.charts`, `dashboard.ambassadors`, `dashboard.pagination`
- Produces: página com filtros via URL params, charts com dados reais, tabela paginada server-side

**Visão geral das mudanças:**
1. Remover todas as constantes mock (`DAILY_INDICACOES`, `DAILY_VALOR`, `AMBASSADORS`, etc.)
2. Ler `dashboard` via `useLoaderData<AmbassadorsDashboardLoader>()`
3. Período/datas viram URL params — usar `useLocation` + `useNavigate` para atualizar filtros
4. Summary cards usam `dashboard.summary`
5. Dados dos charts derivam de `dashboard.charts`
6. Tabela usa `dashboard.ambassadors` + paginação server-side via URL param `page`
7. Busca e min/max indications → URL params, triggering loader reload
8. Manter toda a estrutura visual, configurações de chart e imports do Chart.js

**Lógica de período:**
- URL params: `start_date` (YYYY-MM-DD), `end_date` (YYYY-MM-DD)
- Select options: `"current-month"` | `"last-month"` | `"custom"`
- Na ausência de params, o loader usa defaults (mês atual) — **não** usar `useEffect` para navegar; o loader já recebe undefined e o SearchParams usa o que vier
- Quando usuário muda o select: navegar com `start_date`/`end_date` calculadas
- Quando select é `"custom"`: habilitar date inputs; ao perder foco (`onBlur`) navegar com o valor digitado

**Formato das datas no input:** `YYYY-MM-DD` (nativo do `<Input type="date">`)

**Cores dos formas de pagamento (donut):** array estático com 8 cores:
```ts
const CHART_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#7c3aed", "#ef4444", "#06b6d4", "#f97316", "#84cc16"];
```

- [ ] **Step 1: Reescrever a page**

Substituir o conteúdo completo de `src/client/pages/ambassadorsReport/index.tsx`:

```tsx
import { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Repeat2,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { Bar, Chart, Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Table } from "~/client/components/ui/table";
import type { AmbassadorsDashboardLoader } from "~/client/types/ambassadorsDashboardLoader";
import { getMonthDates } from "~/lib/getMonthDates";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const CHART_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#7c3aed",
  "#ef4444",
  "#06b6d4",
  "#f97316",
  "#84cc16",
];

function detectPeriod(startDate: string | null, endDate: string | null) {
  if (!startDate || !endDate) return "current-month";
  const { firstDayOfMonth: cm0, lastDayOfMonth: cm1 } = getMonthDates(0);
  if (startDate === cm0 && endDate === cm1) return "current-month";
  const { firstDayOfMonth: lm0, lastDayOfMonth: lm1 } = getMonthDates(1);
  if (startDate === lm0 && endDate === lm1) return "last-month";
  return "custom";
}

function AmbassadorsReportPage() {
  const { dashboard } = useLoaderData<AmbassadorsDashboardLoader>();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const startDate = params.get("start_date");
  const endDate = params.get("end_date");
  const currentPage = params.get("page") ?? "1";
  const search = params.get("search") ?? "";
  const minIndications = params.get("min_indications") ?? "";
  const maxIndications = params.get("max_indications") ?? "";

  const period = detectPeriod(startDate, endDate);
  const [localSearch, setLocalSearch] = useState(search);
  const [localMin, setLocalMin] = useState(minIndications);
  const [localMax, setLocalMax] = useState(maxIndications);

  function updateParams(updates: Record<string, string | null>) {
    const next = new URLSearchParams(location.search);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    next.delete("page");
    navigate(`?${next.toString()}`);
  }

  function handlePeriodChange(value: string) {
    if (value === "current-month") {
      const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);
      updateParams({ start_date: firstDayOfMonth, end_date: lastDayOfMonth });
    } else if (value === "last-month") {
      const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(1);
      updateParams({ start_date: firstDayOfMonth, end_date: lastDayOfMonth });
    }
    // "custom" — aguarda edição dos inputs
  }

  function handleDateBlur(field: "start_date" | "end_date", value: string) {
    if (!value) return;
    const next = new URLSearchParams(location.search);
    next.set(field, value);
    next.delete("page");
    navigate(`?${next.toString()}`);
  }

  function handleSearchCommit() {
    updateParams({
      search: localSearch || null,
      min_indications: localMin || null,
      max_indications: localMax || null,
    });
  }

  function handlePageChange(page: number) {
    const next = new URLSearchParams(location.search);
    next.set("page", String(page));
    navigate(`?${next.toString()}`);
  }

  const { summary, charts, ambassadors, pagination } = dashboard;

  const chartLabels = charts.indicationsByDay.map((d) => d.label);
  const chartIndications = charts.indicationsByDay.map((d) => d.totalIndications);
  const chartAmounts = charts.indicationsByDay.map((d) => d.totalAmount);

  const maxIndic = Math.max(...chartIndications, 1);
  const maxAmt = Math.max(...chartAmounts, 1);
  const yMax = Math.ceil(maxIndic * 1.2 / 4) * 4;
  const y1Max = Math.ceil(maxAmt * 1.2 / 500) * 500;

  const evolutionData = {
    labels: chartLabels,
    datasets: [
      {
        type: "bar" as const,
        label: "Indicações",
        data: chartIndications,
        backgroundColor: "#2563eb",
        borderRadius: 3,
        yAxisID: "y",
      },
      {
        type: "line" as const,
        label: "Valor (R$)",
        data: chartAmounts,
        borderColor: "#16a34a",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "#16a34a",
        yAxisID: "y1",
      },
    ],
  };

  const evolutionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: { usePointStyle: true, padding: 20, font: { size: 13 } },
      },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
      y: {
        position: "left" as const,
        min: 0,
        max: yMax || 4,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { font: { size: 11 }, stepSize: Math.max(1, Math.floor(yMax / 4)) },
      },
      y1: {
        position: "right" as const,
        min: 0,
        max: y1Max || 500,
        grid: { drawOnChartArea: false },
        ticks: {
          font: { size: 11 },
          callback: (v: number | string) => {
            const val = Number(v);
            if (val === 0) return "R$ 0k";
            return `R$ ${(val / 1000).toFixed(0)}k`;
          },
        },
      },
    },
  };

  const donationBracketsData = {
    labels: charts.donationAmountRanges.map((r) => r.label),
    datasets: [
      {
        label: "Doações",
        data: charts.donationAmountRanges.map((r) => r.totalPayments),
        backgroundColor: "#7c3aed",
        borderRadius: 4,
      },
    ],
  };

  const maxBracket = Math.max(...charts.donationAmountRanges.map((r) => r.totalPayments), 1);
  const bracketsMax = Math.ceil(maxBracket * 1.2 / 50) * 50;

  const bracketsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, maxRotation: 15 },
      },
      y: {
        min: 0,
        max: bracketsMax || 10,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { font: { size: 11 } },
      },
    },
  };

  const donutData = {
    labels: charts.paymentMethods.map((m) => m.label),
    datasets: [
      {
        data: charts.paymentMethods.map((m) => m.percentage),
        backgroundColor: charts.paymentMethods.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
  };

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const variationPct = summary.previousPeriod.variationPercent;
  const trendValue =
    variationPct === null
      ? null
      : `${variationPct >= 0 ? "+" : ""}${variationPct.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% vs. período anterior (${summary.previousPeriod.periodIndications})`;

  const displayStart = startDate ?? getMonthDates(0).firstDayOfMonth;
  const displayEnd = endDate ?? getMonthDates(0).lastDayOfMonth;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("../reports")}
            className="h-auto w-fit gap-1.5 p-0 text-sm font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Relatórios
          </Button>
          <h1 className="text-2xl font-semibold text-(--text-heading)">Embaixadores</h1>
          <p className="text-sm text-muted-foreground">
            Desempenho dos embaixadores, indicações e arrecadação no período selecionado.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <FileText size={16} />
          Exportar CSV
        </Button>
      </div>

      <Card.Root className="gap-4 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Período</label>
            <Select.Root value={period} onValueChange={handlePeriodChange}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="current-month">Mês atual</Select.Item>
                <Select.Item value="last-month">Mês anterior</Select.Item>
                <Select.Item value="custom">Personalizado</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Início</label>
            <Input
              type="date"
              defaultValue={displayStart}
              key={displayStart}
              disabled={period !== "custom"}
              onBlur={(e) => handleDateBlur("start_date", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Fim</label>
            <Input
              type="date"
              defaultValue={displayEnd}
              key={displayEnd}
              disabled={period !== "custom"}
              onBlur={(e) => handleDateBlur("end_date", e.target.value)}
            />
          </div>
        </div>
      </Card.Root>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card.Root className="gap-3 p-6">
          <Card.MetricHeader label="Indicações no período" icon={TrendingUp} color="primary" />
          <Card.MetricValue>{summary.periodIndications.toLocaleString("pt-BR")}</Card.MetricValue>
          {trendValue ? (
            <Card.MetricTrend
              value={trendValue}
              direction={variationPct !== null && variationPct >= 0 ? "up" : "down"}
            />
          ) : (
            <span className="text-xs text-muted-foreground">Sem período anterior</span>
          )}
        </Card.Root>
        <Card.Root className="gap-3 p-6">
          <Card.MetricHeader label="Indicações acumuladas" icon={Users} color="success" />
          <Card.MetricValue>{summary.totalIndications.toLocaleString("pt-BR")}</Card.MetricValue>
          <span className="text-xs text-muted-foreground">Desde o cadastro dos embaixadores</span>
        </Card.Root>
        <Card.Root className="gap-3 p-6">
          <Card.MetricHeader label="Total em recorrências" icon={Repeat2} color="info" />
          <Card.MetricValue>{fmt(summary.totalRecurringAmount)}</Card.MetricValue>
          <span className="text-xs text-muted-foreground">
            Valor recorrente ativo gerado por indicações
          </span>
        </Card.Root>
      </div>

      <Card.Root className="gap-4 p-6">
        <p className="text-sm font-semibold text-(--text-heading)">
          Evolução de indicações por dia
        </p>
        <div className="h-72">
          <Chart type="bar" data={evolutionData} options={evolutionOptions} />
        </div>
      </Card.Root>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card.Root className="gap-4 p-6">
          <p className="text-sm font-semibold text-(--text-heading)">Faixas de valores das doações</p>
          <div className="h-64">
            <Bar data={donationBracketsData} options={bracketsOptions} />
          </div>
        </Card.Root>

        <Card.Root className="gap-6 p-6">
          <p className="text-sm font-semibold text-(--text-heading)">Formas de pagamento</p>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative size-40 shrink-0">
              <Doughnut data={donutData} options={donutOptions} />
            </div>
            <div className="flex w-full flex-col gap-3">
              {charts.paymentMethods.map((m, i) => (
                <div key={m.type} className="flex items-center gap-3">
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="flex-1 text-sm text-(--text-heading)">{m.label}</span>
                  <span className="text-sm font-semibold text-(--text-heading)">
                    {fmt(m.totalAmount)}
                  </span>
                  <span className="text-sm text-muted-foreground">({m.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </Card.Root>
      </div>

      <Card.Root className="gap-0 overflow-hidden p-0">
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-(--text-heading)">
              Embaixadores ({pagination.total})
            </p>
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <FileText size={14} />
              Exportar CSV
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="w-72">
              <Input
                leftIcon={Search}
                placeholder="Buscar na tabela..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onBlur={handleSearchCommit}
                onKeyDown={(e) => e.key === "Enter" && handleSearchCommit()}
              />
            </div>
            <div className="w-44">
              <Input
                type="number"
                placeholder="Mín. indicações"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                onBlur={handleSearchCommit}
                onKeyDown={(e) => e.key === "Enter" && handleSearchCommit()}
              />
            </div>
            <div className="w-44">
              <Input
                type="number"
                placeholder="Máx. indicações"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                onBlur={handleSearchCommit}
                onKeyDown={(e) => e.key === "Enter" && handleSearchCommit()}
              />
            </div>
          </div>
        </div>
        <div className="px-7 pb-6">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>#</Table.Head>
                <Table.Head>Nome</Table.Head>
                <Table.Head>E-mail</Table.Head>
                <Table.Head>Telefone</Table.Head>
                <Table.Head>Cadastro</Table.Head>
                <Table.Head className="text-right">Indicações no período</Table.Head>
                <Table.Head className="text-right">Indicações acumuladas</Table.Head>
                <Table.Head className="text-right">Recorrências (R$)</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {ambassadors.length === 0 ? (
                <Table.Empty
                  title="Nenhum embaixador encontrado."
                  description="Tente ajustar os filtros de busca."
                />
              ) : (
                ambassadors.map((a) => (
                  <Table.Row key={a.id}>
                    <Table.Cell className="text-muted-foreground">{a.rank}</Table.Cell>
                    <Table.Cell className="font-medium">{a.name}</Table.Cell>
                    <Table.Cell className="text-muted-foreground">{a.email}</Table.Cell>
                    <Table.Cell className="text-muted-foreground">{a.phone}</Table.Cell>
                    <Table.Cell className="text-muted-foreground">{a.createdAt}</Table.Cell>
                    <Table.Cell className="text-right">{a.periodIndications}</Table.Cell>
                    <Table.Cell className="text-right text-muted-foreground">
                      {a.totalIndications}
                    </Table.Cell>
                    <Table.Cell className="text-right font-medium">
                      {a.totalRecurringAmount}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </div>

        {pagination.lastPage > 1 && (
          <div className="flex items-center justify-between border-t px-6 py-4">
            <span className="text-sm text-muted-foreground">
              Mostrando {pagination.from}–{pagination.to} de {pagination.total}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage <= 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage >= pagination.lastPage}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </Card.Root>
    </div>
  );
}

export { AmbassadorsReportPage };
```

- [ ] **Step 2: Verificar que compila**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Verificar no browser**

Abrir a página de Relatório de Embaixadores e confirmar:
- Summary cards exibem valores reais da API (não mockados)
- Gráfico de evolução diária mostra as barras e linha com dados reais
- Gráfico de faixas mostra barras com dados reais
- Donut de formas de pagamento mostra dados reais
- Tabela exibe os embaixadores com rank, nome, e-mail, telefone formatado, data de cadastro formatada
- Mudar período para "Mês anterior" navega com as datas corretas e recarrega os dados
- Busca no input e pressionar Enter/Tab filtra via loader (não localmente)
- Paginação aparece se `lastPage > 1`
