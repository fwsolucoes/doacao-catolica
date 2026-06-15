# Payment Metrics Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar os 8 cards de métricas da `PaymentStatementsPage` com o endpoint real `/api/metrics/total-payments/{subAccountId}`.

**Architecture:** Clean architecture em camadas (Schema → GatewayInterface → Gateway → UseCase → Controller → Factory → Route → Page), idêntica ao padrão já usado por `listCampaigns` e `getCampaign`.

**Tech Stack:** React Router v7 (SSR), Zod, `@arkyn/server` (ApiService, SchemaValidator), TypeScript

---

## Mapa de arquivos

| Ação | Arquivo |
|------|---------|
| Criar | `src/infra/schemas/external/paymentMetrics.ts` |
| Criar | `src/domain/gateways/paymentMetrics.ts` |
| Criar | `src/infra/gateways/paymentMetrics.ts` |
| Criar | `src/app/useCases/paymentMetrics/getPaymentMetricsUseCase.ts` |
| Criar | `src/infra/controllers/paymentMetrics/getPaymentMetricsController.ts` |
| Criar | `src/main/factories/paymentMetrics/getPaymentMetricsFactory.ts` |
| Criar | `src/client/types/paymentStatementsLoader.ts` |
| Modificar | `src/main/routes/route.campaign.paymentStatements.tsx` |
| Modificar | `src/client/pages/paymentStatements/index.tsx` |

---

## Task 1: External schema (Zod)

Valida a resposta da API antes de qualquer processamento.

**Files:**
- Create: `src/infra/schemas/external/paymentMetrics.ts`

- [ ] **Step 1: Criar o arquivo**

```ts
import { z } from "zod";

const paymentStatusSchema = z.object({
  amount: z.number(),
  fee_amount: z.number(),
  quantity: z.number(),
  gross_amount: z.number(),
});

const externalPaymentMetricsSchema = z.object({
  total: z.object({
    amount: z.number(),
    fee_amount: z.number(),
    quantity: z.number(),
  }),
  total_by_status: z.object({
    awaiting_payment: paymentStatusSchema,
    canceled: paymentStatusSchema,
    confirmed: paymentStatusSchema,
    created: paymentStatusSchema,
    deleted: paymentStatusSchema,
    failed: paymentStatusSchema,
    manual: paymentStatusSchema,
    overdue: paymentStatusSchema,
    processing: paymentStatusSchema,
    received: paymentStatusSchema,
    refunded: paymentStatusSchema,
  }),
  details: z.object({
    transfers: z.record(paymentStatusSchema),
    subscriptions: z.record(paymentStatusSchema),
  }),
});

type ExternalPaymentMetrics = z.infer<typeof externalPaymentMetricsSchema>;

export { externalPaymentMetricsSchema, type ExternalPaymentMetrics };
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

Esperado: sem erros relacionados ao arquivo novo.

- [ ] **Step 3: Commit**

```bash
git add src/infra/schemas/external/paymentMetrics.ts
git commit -m "feat(paymentMetrics): add external zod schema for API response"
```

---

## Task 2: Domain gateway interface

Define o contrato entre use case e gateway sem depender de detalhes de infraestrutura.

**Files:**
- Create: `src/domain/gateways/paymentMetrics.ts`

- [ ] **Step 1: Criar o arquivo**

```ts
type GetPaymentMetricsParams = {
  subAccountId: string;
  startDate: string;
  endDate: string;
  token: string;
};

type PaymentMetricsData = {
  receivedOnline: string;
  released: string;
  awaitingRelease: string;
  pending: string;
  receivedOffline: string;
  overdue: string;
  canceled: string;
  appliedFees: string;
};

type PaymentMetricsGatewayDTO = {
  getPaymentMetrics: (params: GetPaymentMetricsParams) => Promise<PaymentMetricsData>;
};

export type { PaymentMetricsGatewayDTO, GetPaymentMetricsParams, PaymentMetricsData };
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/domain/gateways/paymentMetrics.ts
git commit -m "feat(paymentMetrics): add domain gateway interface"
```

---

## Task 3: Gateway implementation

Faz a chamada HTTP, valida o schema e aplica a lógica de cálculo dos 8 valores.

**Files:**
- Create: `src/infra/gateways/paymentMetrics.ts`

- [ ] **Step 1: Criar o arquivo**

```ts
import type {
  GetPaymentMetricsParams,
  PaymentMetricsData,
  PaymentMetricsGatewayDTO,
} from "~/domain/gateways/paymentMetrics";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { externalPaymentMetricsSchema } from "../schemas/external/paymentMetrics";

class PaymentMetricsGateway implements PaymentMetricsGatewayDTO {
  async getPaymentMetrics({
    subAccountId,
    startDate,
    endDate,
    token,
  }: GetPaymentMetricsParams): Promise<PaymentMetricsData> {
    const url = `/api/metrics/total-payments/${subAccountId}?start_date=${startDate}&end_date=${endDate}&per_page=20`;

    const apiResponse = await api.get(url, { token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(externalPaymentMetricsSchema);
    const data = schemaValidator.validate(apiResponse.response.data);

    const fmt = (n: number) =>
      n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const received = data.total_by_status.received;
    const confirmed = data.total_by_status.confirmed;
    const awaitingPayment = data.total_by_status.awaiting_payment;
    const manual = data.total_by_status.manual;
    const overdue = data.total_by_status.overdue;
    const canceled = data.total_by_status.canceled;

    return {
      receivedOnline: fmt(received.amount + confirmed.amount),
      released: fmt(received.amount),
      awaitingRelease: fmt(confirmed.amount),
      pending: fmt(awaitingPayment.amount + overdue.amount),
      receivedOffline: fmt(manual.amount),
      overdue: fmt(overdue.amount),
      canceled: fmt(canceled.amount),
      appliedFees: fmt(received.fee_amount + confirmed.fee_amount),
    };
  }
}

export { PaymentMetricsGateway };
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/infra/gateways/paymentMetrics.ts
git commit -m "feat(paymentMetrics): add gateway with HTTP call and value mapping"
```

---

## Task 4: Use case

Calcula o intervalo de datas do mês atual e orquestra a chamada ao gateway.

**Files:**
- Create: `src/app/useCases/paymentMetrics/getPaymentMetricsUseCase.ts`

- [ ] **Step 1: Criar o arquivo**

```ts
import type {
  PaymentMetricsData,
  PaymentMetricsGatewayDTO,
} from "~/domain/gateways/paymentMetrics";

type InputProps = {
  subAccountId: string;
  token: string;
};

class GetPaymentMetricsUseCase {
  constructor(private paymentMetricsGateway: PaymentMetricsGatewayDTO) {}

  async execute(input: InputProps): Promise<PaymentMetricsData> {
    const { subAccountId, token } = input;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const startDate = new Date(year, month, 1).toISOString().slice(0, 10);
    const endDate = new Date(year, month + 1, 0).toISOString().slice(0, 10);

    return this.paymentMetricsGateway.getPaymentMetrics({
      subAccountId,
      startDate,
      endDate,
      token,
    });
  }
}

export { GetPaymentMetricsUseCase };
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/app/useCases/paymentMetrics/getPaymentMetricsUseCase.ts
git commit -m "feat(paymentMetrics): add use case with current-month date calculation"
```

---

## Task 5: Controller

Extrai `campaignId` (= `subAccountId`) e `token` da rota e chama o use case.

**Files:**
- Create: `src/infra/controllers/paymentMetrics/getPaymentMetricsController.ts`

- [ ] **Step 1: Criar o arquivo**

```ts
import type { GetPaymentMetricsUseCase } from "~/app/useCases/paymentMetrics/getPaymentMetricsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class GetPaymentMetricsController {
  constructor(private getPaymentMetricsUseCase: GetPaymentMetricsUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return this.getPaymentMetricsUseCase.execute({
      subAccountId: campaignId,
      token: user.token,
    });
  }
}

export { GetPaymentMetricsController };
```

- [ ] **Step 2: Verificar o tipo `RouteDTO`**

Confirmar que `~/main/types/route` existe e expõe `RouteDTO`. Referência: `src/infra/controllers/campaign/getCampaignController.ts` usa o mesmo import.

- [ ] **Step 3: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

Esperado: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/infra/controllers/paymentMetrics/getPaymentMetricsController.ts
git commit -m "feat(paymentMetrics): add controller"
```

---

## Task 6: Factory

Instancia e conecta todas as camadas.

**Files:**
- Create: `src/main/factories/paymentMetrics/getPaymentMetricsFactory.ts`

- [ ] **Step 1: Criar o arquivo**

```ts
import { GetPaymentMetricsUseCase } from "~/app/useCases/paymentMetrics/getPaymentMetricsUseCase";
import { GetPaymentMetricsController } from "~/infra/controllers/paymentMetrics/getPaymentMetricsController";
import { PaymentMetricsGateway } from "~/infra/gateways/paymentMetrics";

const paymentMetricsGateway = new PaymentMetricsGateway();
const getPaymentMetricsUseCase = new GetPaymentMetricsUseCase(paymentMetricsGateway);
const getPaymentMetricsController = new GetPaymentMetricsController(getPaymentMetricsUseCase);

const getPaymentMetrics = {
  handle: getPaymentMetricsController.handle.bind(getPaymentMetricsController),
};

export { getPaymentMetrics };
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/main/factories/paymentMetrics/getPaymentMetricsFactory.ts
git commit -m "feat(paymentMetrics): add factory wiring all layers"
```

---

## Task 7: Route loader

Adiciona o `loader` à rota `route.campaign.paymentStatements.tsx`, seguindo o mesmo padrão de `route.myCampaigns.tsx`.

**Files:**
- Modify: `src/main/routes/route.campaign.paymentStatements.tsx`

- [ ] **Step 1: Substituir o conteúdo do arquivo**

```ts
import type { Route } from "+/route.campaign.paymentStatements";
import { redirect } from "react-router";
import { PaymentStatementsPage } from "~/client/pages/paymentStatements";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getPaymentMetrics } from "../factories/paymentMetrics/getPaymentMetricsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const metrics = await getPaymentMetrics.handle(adaptedRoute);

  return { metrics };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function PaymentStatementsRoute() {
  return <PaymentStatementsPage />;
}
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

Esperado: sem erros. O `react-router typegen` vai gerar o tipo `Route` para esta rota.

- [ ] **Step 3: Commit**

```bash
git add src/main/routes/route.campaign.paymentStatements.tsx
git commit -m "feat(paymentStatements): add SSR loader to fetch payment metrics"
```

---

## Task 8: Loader type + page update

Cria o tipo do loader e atualiza a página para consumir dados reais via `useLoaderData`.

**Files:**
- Create: `src/client/types/paymentStatementsLoader.ts`
- Modify: `src/client/pages/paymentStatements/index.tsx`

- [ ] **Step 1: Criar o tipo do loader**

```ts
// src/client/types/paymentStatementsLoader.ts
import type { loader } from "~/main/routes/route.campaign.paymentStatements";

type PaymentStatementsLoader = Awaited<ReturnType<typeof loader>>;

export type { PaymentStatementsLoader };
```

- [ ] **Step 2: Atualizar a página**

Substituir o conteúdo de `src/client/pages/paymentStatements/index.tsx`:

```tsx
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  AlertTriangle,
  Banknote,
  CheckCircle2,
  CirclePercent,
  Clock,
  Wifi,
  XCircle,
} from "lucide-react";
import { useLoaderData } from "react-router";
import { Card } from "~/client/components/ui/card";
import type { PaymentStatementsLoader } from "~/client/types/paymentStatementsLoader";
import { PaymentsTable } from "./components/paymentsTable";

type MetricColor =
  | "teal"
  | "primary"
  | "success"
  | "danger"
  | "info"
  | "accent"
  | "warning";

type MetricCardData = {
  label: string;
  value: string;
  icon: LucideIcon;
  color: MetricColor;
};

function PaymentStatementsPage() {
  const { metrics } = useLoaderData<PaymentStatementsLoader>();

  const metricCards: MetricCardData[] = [
    { label: "Total recebido online", value: metrics.receivedOnline, icon: Wifi, color: "teal" },
    { label: "Total liberado", value: metrics.released, icon: CheckCircle2, color: "success" },
    { label: "Aguardando liberação", value: metrics.awaitingRelease, icon: Clock, color: "warning" },
    { label: "Pendentes", value: metrics.pending, icon: AlertCircle, color: "info" },
    { label: "Total recebido offline", value: metrics.receivedOffline, icon: Banknote, color: "primary" },
    { label: "Em atraso", value: metrics.overdue, icon: AlertTriangle, color: "danger" },
    { label: "Cancelados", value: metrics.canceled, icon: XCircle, color: "danger" },
    { label: "Taxas aplicadas", value: metrics.appliedFees, icon: CirclePercent, color: "accent" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-(--text-heading)">
        Extratos de pagamentos
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric) => (
          <Card.Root key={metric.label} className="gap-3 p-5">
            <Card.MetricHeader
              label={metric.label}
              icon={metric.icon}
              color={metric.color}
            />
            <Card.MetricValue>{metric.value}</Card.MetricValue>
          </Card.Root>
        ))}
      </div>
      <PaymentsTable />
    </div>
  );
}

export { PaymentStatementsPage };
```

- [ ] **Step 3: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

Esperado: sem erros de TypeScript.

- [ ] **Step 4: Commit**

```bash
git add src/client/types/paymentStatementsLoader.ts src/client/pages/paymentStatements/index.tsx
git commit -m "feat(paymentStatements): wire page to SSR loader data"
```
