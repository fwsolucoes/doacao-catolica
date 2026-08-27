# Shalon Metrics Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `/campaign/:campaignId/shalon-metrics` screen displaying 8 financial metric cards with Shalón-specific 24%/76% split calculations, with date-range period filtering.

**Architecture:** New clean-arch slice (domain → infra → useCase → controller → factory → route → page) feeding a standalone page component. Reuses the existing `externalPaymentMetricsSchema` and `PeriodSelect` component. No existing code is modified except the sidebar nav and the factory import.

**Tech Stack:** React Router v7 (SSR), React 19, Tailwind CSS v4, shadcn/ui, Zod, `@arkyn/server` ApiService.

**Spec:** investigation and design agreed in conversation on 2026-08-26.

## Global Constraints

- Named imports from React only (`useState`, etc.) — never `import * as React`
- Files, components, identifiers in English; UI text in Portuguese
- Never use native `<button>`, `<input>`, etc. when a design-system component exists
- Tailwind canonical classes only (`bg-primary`, not `bg-(--primary)`); arbitrary brackets allowed when no canonical equivalent exists (e.g. `bg-[rgba(var(--spotlight-success),0.1)]`)
- No `<input type="hidden" name="_action">` — action identifier goes on `<Button name="_action" value="...">`
- Formatting of values (currency) belongs in the gateway for plain-object returns (no entity class), consistent with existing `PaymentMetricsGateway` pattern
- SearchParams: never concatenate query params manually; use `searchParams.toExternal(["page", "pageLimit"])` with exclusions
- Gateway interface parameters are individual, not grouped in a generic object
- No commits — user reviews in IDE and commits manually

---

### Task 1: Domain interface + SearchParams

**Files:**
- Create: `src/domain/gateways/shalonMetrics.ts`
- Create: `src/app/search/shalonMetricsSearchParams.ts`

**Interfaces:**
- Produces: `ShalonMetricsData` type (10 string fields) and `ShalonMetricsGatewayDTO` interface consumed by Task 2, 3, 4, 5

---

- [ ] **Step 1: Create the domain gateway file**

`src/domain/gateways/shalonMetrics.ts`:

```ts
import type { ShalonMetricsSearchParams } from "~/app/search/shalonMetricsSearchParams";

type ShalonMetricsData = {
  receivedOnline: string;
  receivedOnlineFee: string;
  totalAvailable: string;
  pendingAvailability: string;
  receivedOffline: string;
  receivedOfflineFee: string;
  overdue: string;
  appliedFees: string;
  shalonTransfers: string;
  missionTransfers: string;
};

type ShalonMetricsGatewayDTO = {
  getShalonMetrics(
    campaignPublicId: string,
    searchParams: ShalonMetricsSearchParams,
  ): Promise<ShalonMetricsData>;
};

export type { ShalonMetricsGatewayDTO, ShalonMetricsData };
```

- [ ] **Step 2: Create the SearchParams class**

`src/app/search/shalonMetricsSearchParams.ts`:

```ts
import { SearchParams } from "../shared/searchParams";

type Filter = {
  start_date: string;
  end_date: string;
};

class ShalonMetricsSearchParams extends SearchParams<Filter> {}

export { ShalonMetricsSearchParams };
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors in the new files.

---

### Task 2: Gateway implementation

**Files:**
- Create: `src/infra/gateways/shalonMetrics.ts`

**Interfaces:**
- Consumes: `ShalonMetricsGatewayDTO`, `ShalonMetricsData` from `~/domain/gateways/shalonMetrics`; `ShalonMetricsSearchParams` from `~/app/search/shalonMetricsSearchParams`; `externalPaymentMetricsSchema` from `~/infra/schemas/external/paymentMetrics`; `donationApi` from `~/infra/http/donationApi`; `environmentVariables` from `~/main/config/environmentVariables`; `HttpAdapter` from `~/infra/adapters/httpAdapter`; `SchemaValidatorAdapter` from `~/infra/adapters/schemaValidatorAdapter`
- Produces: `ShalonMetricsGateway` class with `getShalonMetrics(campaignPublicId, searchParams)` method

---

- [ ] **Step 1: Create the gateway**

`src/infra/gateways/shalonMetrics.ts`:

```ts
import type { ShalonMetricsGatewayDTO, ShalonMetricsData } from "~/domain/gateways/shalonMetrics";
import type { ShalonMetricsSearchParams } from "~/app/search/shalonMetricsSearchParams";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalPaymentMetricsSchema } from "../schemas/external/paymentMetrics";

class ShalonMetricsGateway implements ShalonMetricsGatewayDTO {
  async getShalonMetrics(
    campaignPublicId: string,
    searchParams: ShalonMetricsSearchParams,
  ): Promise<ShalonMetricsData> {
    let url = `/api/metrics/total-payments/${campaignPublicId}`;
    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(externalPaymentMetricsSchema);
    const data = schemaValidator.validate(apiResponse.response.data);

    const fmt = (n: number) =>
      n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const received = data.total_by_status.received;
    const confirmed = data.total_by_status.confirmed;
    const manual = data.total_by_status.manual;
    const overdue = data.total_by_status.overdue;

    const receivedOnlineTotal =
      received.amount + confirmed.amount + received.fee_amount + confirmed.fee_amount;
    const grandTotal = receivedOnlineTotal + manual.amount;

    return {
      receivedOnline: fmt(receivedOnlineTotal),
      receivedOnlineFee: fmt(receivedOnlineTotal * 0.24),
      totalAvailable: fmt(received.amount),
      pendingAvailability: fmt(confirmed.amount),
      receivedOffline: fmt(manual.amount),
      receivedOfflineFee: fmt(manual.amount * 0.24),
      overdue: fmt(overdue.amount),
      appliedFees: fmt(received.fee_amount + confirmed.fee_amount),
      shalonTransfers: fmt(grandTotal * 0.24),
      missionTransfers: fmt(grandTotal * 0.76),
    };
  }
}

export { ShalonMetricsGateway };
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors.

---

### Task 3: Use case + controller + factory

**Files:**
- Create: `src/app/useCases/shalonMetrics/getShalonMetricsUseCase.ts`
- Create: `src/infra/controllers/shalonMetrics/getShalonMetricsController.ts`
- Create: `src/main/factories/shalonMetrics/getShalonMetricsFactory.ts`

**Interfaces:**
- Consumes: `ShalonMetricsGatewayDTO`, `ShalonMetricsData` from Task 1; `ShalonMetricsSearchParams` from Task 1; `ShalonMetricsGateway` from Task 2; `RouteDTO` from `~/main/types/route`; `HttpAdapter` from `~/infra/adapters/httpAdapter`
- Produces: `getShalonMetrics.handle(route: RouteDTO): Promise<ShalonMetricsData>` — called by the route in Task 4

---

- [ ] **Step 1: Create the use case**

`src/app/useCases/shalonMetrics/getShalonMetricsUseCase.ts`:

```ts
import type { ShalonMetricsGatewayDTO, ShalonMetricsData } from "~/domain/gateways/shalonMetrics";
import { ShalonMetricsSearchParams } from "~/app/search/shalonMetricsSearchParams";
import { getMonthDates } from "~/lib/getMonthDates";

type InputProps = {
  campaignPublicId: string;
  startDate?: string;
  endDate?: string;
};

class GetShalonMetricsUseCase {
  constructor(private shalonMetricsGateway: ShalonMetricsGatewayDTO) {}

  async execute(input: InputProps): Promise<ShalonMetricsData> {
    const { campaignPublicId, startDate, endDate } = input;
    const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);

    const searchParams = new ShalonMetricsSearchParams({
      filter: {
        start_date: startDate ?? firstDayOfMonth,
        end_date: endDate ?? lastDayOfMonth,
      },
    });

    return this.shalonMetricsGateway.getShalonMetrics(campaignPublicId, searchParams);
  }
}

export { GetShalonMetricsUseCase };
```

- [ ] **Step 2: Create the controller**

`src/infra/controllers/shalonMetrics/getShalonMetricsController.ts`:

```ts
import type { GetShalonMetricsUseCase } from "~/app/useCases/shalonMetrics/getShalonMetricsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetShalonMetricsController {
  constructor(private getShalonMetricsUseCase: GetShalonMetricsUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.getShalonMetricsUseCase.execute({
      campaignPublicId: campaignId,
      startDate: route.query.start_date,
      endDate: route.query.end_date,
    });
  }
}

export { GetShalonMetricsController };
```

- [ ] **Step 3: Create the factory**

`src/main/factories/shalonMetrics/getShalonMetricsFactory.ts`:

```ts
import { GetShalonMetricsUseCase } from "~/app/useCases/shalonMetrics/getShalonMetricsUseCase";
import { GetShalonMetricsController } from "~/infra/controllers/shalonMetrics/getShalonMetricsController";
import { ShalonMetricsGateway } from "~/infra/gateways/shalonMetrics";

const shalonMetricsGateway = new ShalonMetricsGateway();
const getShalonMetricsUseCase = new GetShalonMetricsUseCase(shalonMetricsGateway);
const getShalonMetricsController = new GetShalonMetricsController(getShalonMetricsUseCase);

const getShalonMetrics = {
  handle: getShalonMetricsController.handle.bind(getShalonMetricsController),
};

export { getShalonMetrics };
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors.

---

### Task 4: Route file + loader type

**Files:**
- Create: `src/main/routes/route.campaign.shalonMetrics.tsx`
- Create: `src/client/types/shalonMetricsLoader.ts`

**Interfaces:**
- Consumes: `getShalonMetrics.handle` from Task 3; `RouteAdapter` from `~/infra/adapters/routeAdapter`; `AuthService` from `~/infra/services/authService`; `ShalonMetricsPage` from Task 6 (wire up after Task 6 is done)
- Produces: `loader` function that returns `{ metrics: ShalonMetricsData }`; `ShalonMetricsLoader` type

---

- [ ] **Step 1: Create the loader type file**

`src/client/types/shalonMetricsLoader.ts`:

```ts
import type { loader } from "~/main/routes/route.campaign.shalonMetrics";

type ShalonMetricsLoader = Awaited<ReturnType<typeof loader>>;

export type { ShalonMetricsLoader };
```

- [ ] **Step 2: Create the route file**

`src/main/routes/route.campaign.shalonMetrics.tsx`:

```tsx
import type { Route } from "+/route.campaign.shalonMetrics";
import { redirect } from "react-router";
import { ShalonMetricsPage } from "~/client/pages/shalonMetrics";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getShalonMetrics } from "../factories/shalonMetrics/getShalonMetricsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const metrics = await getShalonMetrics.handle(adaptedRoute);

  return { metrics };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function ShalonMetricsRoute() {
  return <ShalonMetricsPage />;
}
```

> **Note:** The `ShalonMetricsPage` import will resolve only after Task 6 creates that file. Create the route file now; TypeScript will flag the missing import until Task 6 is complete — this is expected.

- [ ] **Step 3: Verify TypeScript compiles (after Task 6)**

Run after completing Task 6:

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

---

### Task 5: ShalonStatCard component

**Files:**
- Create: `src/client/pages/shalonMetrics/components/shalonStatCard/index.tsx`

**Interfaces:**
- Produces: `ShalonStatCard` component accepting `{ icon: LucideIcon; title: string; value: string; subtitle?: string; iconBg: string; iconColor: string }`
- Consumed by: Task 6 (the page)

---

- [ ] **Step 1: Create the component**

`src/client/pages/shalonMetrics/components/shalonStatCard/index.tsx`:

```tsx
import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

type ShalonStatCardProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle?: string;
  iconBg: string;
  iconColor: string;
};

function ShalonStatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  iconBg,
  iconColor,
}: ShalonStatCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          iconBg,
        )}
      >
        <Icon size={18} className={iconColor} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-muted-foreground">{title}</span>
        <p className="text-xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        {subtitle && (
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        )}
      </div>
    </div>
  );
}

export { ShalonStatCard };
export type { ShalonStatCardProps };
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors.

---

### Task 6: ShalonMetrics page

**Files:**
- Create: `src/client/pages/shalonMetrics/index.tsx`

**Interfaces:**
- Consumes: `ShalonMetricsLoader` from `~/client/types/shalonMetricsLoader`; `ShalonStatCard` from Task 5; `PeriodSelect` from `~/client/pages/paymentStatements/components/periodSelect`
- Produces: `ShalonMetricsPage` component — the default export consumed by `route.campaign.shalonMetrics.tsx`

---

- [ ] **Step 1: Create the page**

`src/client/pages/shalonMetrics/index.tsx`:

```tsx
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Wallet,
} from "lucide-react";
import { useLoaderData } from "react-router";
import type { ShalonMetricsLoader } from "~/client/types/shalonMetricsLoader";
import { PeriodSelect } from "~/client/pages/paymentStatements/components/periodSelect";
import { ShalonStatCard } from "./components/shalonStatCard";

function ShalonMetricsPage() {
  const { metrics } = useLoaderData<ShalonMetricsLoader>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
            Métricas Shalón
          </h1>
          <p className="text-sm text-muted-foreground">
            Indicadores financeiros da campanha
          </p>
        </div>
        <PeriodSelect />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ShalonStatCard
          icon={CircleCheck}
          title="Total recebido online (Sistema)"
          value={metrics.receivedOnline}
          subtitle={`24% = ${metrics.receivedOnlineFee}`}
          iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
          iconColor="text-[rgb(var(--spotlight-success))]"
        />
        <ShalonStatCard
          icon={Wallet}
          title="Total liberado"
          value={metrics.totalAvailable}
          iconBg="bg-[rgba(var(--spotlight-info),0.1)]"
          iconColor="text-[rgb(var(--spotlight-info))]"
        />
        <ShalonStatCard
          icon={Wallet}
          title="Aguardando liberação"
          value={metrics.pendingAvailability}
          iconBg="bg-[rgba(var(--spotlight-info),0.1)]"
          iconColor="text-[rgb(var(--spotlight-info))]"
        />
        <ShalonStatCard
          icon={CircleCheck}
          title="Total recebido offline (Na missão)"
          value={metrics.receivedOffline}
          subtitle={`Repasses: ${metrics.receivedOfflineFee} (24%)`}
          iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
          iconColor="text-[rgb(var(--spotlight-success))]"
        />
        <ShalonStatCard
          icon={CircleAlert}
          title="Em atraso"
          value={metrics.overdue}
          iconBg="bg-[rgba(var(--spotlight-warning),0.1)]"
          iconColor="text-[rgb(var(--spotlight-warning))]"
        />
        <ShalonStatCard
          icon={CircleX}
          title="Taxas aplicadas"
          value={metrics.appliedFees}
          iconBg="bg-[rgba(var(--spotlight-danger),0.1)]"
          iconColor="text-[rgb(var(--spotlight-danger))]"
        />
        <ShalonStatCard
          icon={CircleCheck}
          title="Total de repasses (24%)"
          value={metrics.shalonTransfers}
          iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
          iconColor="text-[rgb(var(--spotlight-success))]"
        />
        <ShalonStatCard
          icon={CircleCheck}
          title="Repasses para a Missão (76%)"
          value={metrics.missionTransfers}
          iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
          iconColor="text-[rgb(var(--spotlight-success))]"
        />
      </div>
    </div>
  );
}

export { ShalonMetricsPage };
```

- [ ] **Step 2: Verify TypeScript compiles (all tasks so far)**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

---

### Task 7: Sidebar navigation entry

**Files:**
- Modify: `src/client/layouts/campaignLayout/components/sidebar/index.tsx`

**Interfaces:**
- Consumes: existing `sections` array structure in the sidebar file
- Produces: new "Métricas Shalón" entry inside the Financeiro submenu

---

- [ ] **Step 1: Add the nav item to the Financeiro submenu**

In `src/client/layouts/campaignLayout/components/sidebar/index.tsx`, locate the `Financeiro` item (line ~77):

```ts
{
  icon: Wallet,
  label: "Financeiro",
  subItems: [
    { label: "Transferências", path: "transfers" },
    { label: "Métodos de pagamento", path: "payment-methods" },
    { label: "Pix Automático", path: "automatic-pix" },
  ],
},
```

Add the new sub-item at the end of `subItems`:

```ts
{
  icon: Wallet,
  label: "Financeiro",
  subItems: [
    { label: "Transferências", path: "transfers" },
    { label: "Métodos de pagamento", path: "payment-methods" },
    { label: "Pix Automático", path: "automatic-pix" },
    { label: "Métricas Shalón", path: "shalon-metrics" },
  ],
},
```

- [ ] **Step 2: Final TypeScript check**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Manual smoke test**

Start the dev server and navigate to `/campaign/<any-campaignId>/shalon-metrics`:

```bash
cd /var/www/testes/donation-react-router-v7 && npm run dev
```

Verify:
1. "Métricas Shalón" appears in the Financeiro submenu in the sidebar
2. Clicking it navigates to the new page
3. The page title "Métricas Shalón" renders
4. The 8 stat cards are visible with BRL-formatted values
5. Cards 1 and 4 show their subtitle lines (the 24% lines)
6. The period selector in the top-right functions — changing it refreshes the page with new date params
7. No console errors
