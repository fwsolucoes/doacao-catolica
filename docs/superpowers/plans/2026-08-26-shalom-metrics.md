# Shalom Metrics Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `/campaign/:campaignId/shalom-metrics` screen displaying 8 financial metric cards with Shalom-specific 24%/76% split calculations, with date-range period filtering.

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
- Create: `src/domain/gateways/shalomMetrics.ts`
- Create: `src/app/search/shalomMetricsSearchParams.ts`

**Interfaces:**
- Produces: `ShalomMetricsData` type (10 string fields) and `ShalomMetricsGatewayDTO` interface consumed by Task 2, 3, 4, 5

---

- [ ] **Step 1: Create the domain gateway file**

`src/domain/gateways/shalomMetrics.ts`:

```ts
import type { ShalomMetricsSearchParams } from "~/app/search/shalomMetricsSearchParams";

type ShalomMetricsData = {
  receivedOnline: string;
  receivedOnlineFee: string;
  totalAvailable: string;
  pendingAvailability: string;
  receivedOffline: string;
  receivedOfflineFee: string;
  overdue: string;
  appliedFees: string;
  shalomTransfers: string;
  missionTransfers: string;
};

type ShalomMetricsGatewayDTO = {
  getShalomMetrics(
    campaignPublicId: string,
    searchParams: ShalomMetricsSearchParams,
  ): Promise<ShalomMetricsData>;
};

export type { ShalomMetricsGatewayDTO, ShalomMetricsData };
```

- [ ] **Step 2: Create the SearchParams class**

`src/app/search/shalomMetricsSearchParams.ts`:

```ts
import { SearchParams } from "../shared/searchParams";

type Filter = {
  start_date: string;
  end_date: string;
};

class ShalomMetricsSearchParams extends SearchParams<Filter> {}

export { ShalomMetricsSearchParams };
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors in the new files.

---

### Task 2: Gateway implementation

**Files:**
- Create: `src/infra/gateways/shalomMetrics.ts`

**Interfaces:**
- Consumes: `ShalomMetricsGatewayDTO`, `ShalomMetricsData` from `~/domain/gateways/shalomMetrics`; `ShalomMetricsSearchParams` from `~/app/search/shalomMetricsSearchParams`; `externalPaymentMetricsSchema` from `~/infra/schemas/external/paymentMetrics`; `donationApi` from `~/infra/http/donationApi`; `environmentVariables` from `~/main/config/environmentVariables`; `HttpAdapter` from `~/infra/adapters/httpAdapter`; `SchemaValidatorAdapter` from `~/infra/adapters/schemaValidatorAdapter`
- Produces: `ShalomMetricsGateway` class with `getShalomMetrics(campaignPublicId, searchParams)` method

---

- [ ] **Step 1: Create the gateway**

`src/infra/gateways/shalomMetrics.ts`:

```ts
import type { ShalomMetricsGatewayDTO, ShalomMetricsData } from "~/domain/gateways/shalomMetrics";
import type { ShalomMetricsSearchParams } from "~/app/search/shalomMetricsSearchParams";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalPaymentMetricsSchema } from "../schemas/external/paymentMetrics";

class ShalomMetricsGateway implements ShalomMetricsGatewayDTO {
  async getShalomMetrics(
    campaignPublicId: string,
    searchParams: ShalomMetricsSearchParams,
  ): Promise<ShalomMetricsData> {
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
      shalomTransfers: fmt(grandTotal * 0.24),
      missionTransfers: fmt(grandTotal * 0.76),
    };
  }
}

export { ShalomMetricsGateway };
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors.

---

### Task 3: Use case + controller + factory

**Files:**
- Create: `src/app/useCases/shalomMetrics/getShalomMetricsUseCase.ts`
- Create: `src/infra/controllers/shalomMetrics/getShalomMetricsController.ts`
- Create: `src/main/factories/shalomMetrics/getShalomMetricsFactory.ts`

**Interfaces:**
- Consumes: `ShalomMetricsGatewayDTO`, `ShalomMetricsData` from Task 1; `ShalomMetricsSearchParams` from Task 1; `ShalomMetricsGateway` from Task 2; `RouteDTO` from `~/main/types/route`; `HttpAdapter` from `~/infra/adapters/httpAdapter`
- Produces: `getShalomMetrics.handle(route: RouteDTO): Promise<ShalomMetricsData>` — called by the route in Task 4

---

- [ ] **Step 1: Create the use case**

`src/app/useCases/shalomMetrics/getShalomMetricsUseCase.ts`:

```ts
import type { ShalomMetricsGatewayDTO, ShalomMetricsData } from "~/domain/gateways/shalomMetrics";
import { ShalomMetricsSearchParams } from "~/app/search/shalomMetricsSearchParams";
import { getMonthDates } from "~/lib/getMonthDates";

type InputProps = {
  campaignPublicId: string;
  startDate?: string;
  endDate?: string;
};

class GetShalomMetricsUseCase {
  constructor(private shalomMetricsGateway: ShalomMetricsGatewayDTO) {}

  async execute(input: InputProps): Promise<ShalomMetricsData> {
    const { campaignPublicId, startDate, endDate } = input;
    const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);

    const searchParams = new ShalomMetricsSearchParams({
      filter: {
        start_date: startDate ?? firstDayOfMonth,
        end_date: endDate ?? lastDayOfMonth,
      },
    });

    return this.shalomMetricsGateway.getShalomMetrics(campaignPublicId, searchParams);
  }
}

export { GetShalomMetricsUseCase };
```

- [ ] **Step 2: Create the controller**

`src/infra/controllers/shalomMetrics/getShalomMetricsController.ts`:

```ts
import type { GetShalomMetricsUseCase } from "~/app/useCases/shalomMetrics/getShalomMetricsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetShalomMetricsController {
  constructor(private getShalomMetricsUseCase: GetShalomMetricsUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.getShalomMetricsUseCase.execute({
      campaignPublicId: campaignId,
      startDate: route.query.start_date,
      endDate: route.query.end_date,
    });
  }
}

export { GetShalomMetricsController };
```

- [ ] **Step 3: Create the factory**

`src/main/factories/shalomMetrics/getShalomMetricsFactory.ts`:

```ts
import { GetShalomMetricsUseCase } from "~/app/useCases/shalomMetrics/getShalomMetricsUseCase";
import { GetShalomMetricsController } from "~/infra/controllers/shalomMetrics/getShalomMetricsController";
import { ShalomMetricsGateway } from "~/infra/gateways/shalomMetrics";

const shalomMetricsGateway = new ShalomMetricsGateway();
const getShalomMetricsUseCase = new GetShalomMetricsUseCase(shalomMetricsGateway);
const getShalomMetricsController = new GetShalomMetricsController(getShalomMetricsUseCase);

const getShalomMetrics = {
  handle: getShalomMetricsController.handle.bind(getShalomMetricsController),
};

export { getShalomMetrics };
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors.

---

### Task 4: Route file + loader type

**Files:**
- Create: `src/main/routes/route.campaign.shalomMetrics.tsx`
- Create: `src/client/types/shalomMetricsLoader.ts`

**Interfaces:**
- Consumes: `getShalomMetrics.handle` from Task 3; `RouteAdapter` from `~/infra/adapters/routeAdapter`; `AuthService` from `~/infra/services/authService`; `ShalomMetricsPage` from Task 6 (wire up after Task 6 is done)
- Produces: `loader` function that returns `{ metrics: ShalomMetricsData }`; `ShalomMetricsLoader` type

---

- [ ] **Step 1: Create the loader type file**

`src/client/types/shalomMetricsLoader.ts`:

```ts
import type { loader } from "~/main/routes/route.campaign.shalomMetrics";

type ShalomMetricsLoader = Awaited<ReturnType<typeof loader>>;

export type { ShalomMetricsLoader };
```

- [ ] **Step 2: Create the route file**

`src/main/routes/route.campaign.shalomMetrics.tsx`:

```tsx
import type { Route } from "+/route.campaign.shalomMetrics";
import { redirect } from "react-router";
import { ShalomMetricsPage } from "~/client/pages/shalomMetrics";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getShalomMetrics } from "../factories/shalomMetrics/getShalomMetricsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const metrics = await getShalomMetrics.handle(adaptedRoute);

  return { metrics };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function ShalomMetricsRoute() {
  return <ShalomMetricsPage />;
}
```

> **Note:** The `ShalomMetricsPage` import will resolve only after Task 6 creates that file. Create the route file now; TypeScript will flag the missing import until Task 6 is complete — this is expected.

- [ ] **Step 3: Verify TypeScript compiles (after Task 6)**

Run after completing Task 6:

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

---

### Task 5: ShalomStatCard component

**Files:**
- Create: `src/client/pages/shalomMetrics/components/shalomStatCard/index.tsx`

**Interfaces:**
- Produces: `ShalomStatCard` component accepting `{ icon: LucideIcon; title: string; value: string; subtitle?: string; iconBg: string; iconColor: string }`
- Consumed by: Task 6 (the page)

---

- [ ] **Step 1: Create the component**

`src/client/pages/shalomMetrics/components/shalomStatCard/index.tsx`:

```tsx
import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

type ShalomStatCardProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle?: string;
  iconBg: string;
  iconColor: string;
};

function ShalomStatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  iconBg,
  iconColor,
}: ShalomStatCardProps) {
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

export { ShalomStatCard };
export type { ShalomStatCardProps };
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors.

---

### Task 6: ShalomMetrics page

**Files:**
- Create: `src/client/pages/shalomMetrics/index.tsx`

**Interfaces:**
- Consumes: `ShalomMetricsLoader` from `~/client/types/shalomMetricsLoader`; `ShalomStatCard` from Task 5; `PeriodSelect` from `~/client/pages/paymentStatements/components/periodSelect`
- Produces: `ShalomMetricsPage` component — the default export consumed by `route.campaign.shalomMetrics.tsx`

---

- [ ] **Step 1: Create the page**

`src/client/pages/shalomMetrics/index.tsx`:

```tsx
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Wallet,
} from "lucide-react";
import { useLoaderData } from "react-router";
import type { ShalomMetricsLoader } from "~/client/types/shalomMetricsLoader";
import { PeriodSelect } from "~/client/pages/paymentStatements/components/periodSelect";
import { ShalomStatCard } from "./components/shalomStatCard";

function ShalomMetricsPage() {
  const { metrics } = useLoaderData<ShalomMetricsLoader>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
            Métricas Shalom
          </h1>
          <p className="text-sm text-muted-foreground">
            Indicadores financeiros da campanha
          </p>
        </div>
        <PeriodSelect />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ShalomStatCard
          icon={CircleCheck}
          title="Total recebido online (Sistema)"
          value={metrics.receivedOnline}
          subtitle={`24% = ${metrics.receivedOnlineFee}`}
          iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
          iconColor="text-[rgb(var(--spotlight-success))]"
        />
        <ShalomStatCard
          icon={Wallet}
          title="Total liberado"
          value={metrics.totalAvailable}
          iconBg="bg-[rgba(var(--spotlight-info),0.1)]"
          iconColor="text-[rgb(var(--spotlight-info))]"
        />
        <ShalomStatCard
          icon={Wallet}
          title="Aguardando liberação"
          value={metrics.pendingAvailability}
          iconBg="bg-[rgba(var(--spotlight-info),0.1)]"
          iconColor="text-[rgb(var(--spotlight-info))]"
        />
        <ShalomStatCard
          icon={CircleCheck}
          title="Total recebido offline (Na missão)"
          value={metrics.receivedOffline}
          subtitle={`Repasses: ${metrics.receivedOfflineFee} (24%)`}
          iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
          iconColor="text-[rgb(var(--spotlight-success))]"
        />
        <ShalomStatCard
          icon={CircleAlert}
          title="Em atraso"
          value={metrics.overdue}
          iconBg="bg-[rgba(var(--spotlight-warning),0.1)]"
          iconColor="text-[rgb(var(--spotlight-warning))]"
        />
        <ShalomStatCard
          icon={CircleX}
          title="Taxas aplicadas"
          value={metrics.appliedFees}
          iconBg="bg-[rgba(var(--spotlight-danger),0.1)]"
          iconColor="text-[rgb(var(--spotlight-danger))]"
        />
        <ShalomStatCard
          icon={CircleCheck}
          title="Total de repasses (24%)"
          value={metrics.shalomTransfers}
          iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
          iconColor="text-[rgb(var(--spotlight-success))]"
        />
        <ShalomStatCard
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

export { ShalomMetricsPage };
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
- Produces: new "Métricas Shalom" entry inside the Financeiro submenu

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
    { label: "Métricas Shalom", path: "shalom-metrics" },
  ],
},
```

- [ ] **Step 2: Final TypeScript check**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Manual smoke test**

Start the dev server and navigate to `/campaign/<any-campaignId>/shalom-metrics`:

```bash
cd /var/www/testes/donation-react-router-v7 && npm run dev
```

Verify:
1. "Métricas Shalom" appears in the Financeiro submenu in the sidebar
2. Clicking it navigates to the new page
3. The page title "Métricas Shalom" renders
4. The 8 stat cards are visible with BRL-formatted values
5. Cards 1 and 4 show their subtitle lines (the 24% lines)
6. The period selector in the top-right functions — changing it refreshes the page with new date params
7. No console errors
