# Donor Combobox — Payment Statements Filter Drawer

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar um combobox "Selecione um doador" no drawer de filtros da tela de extratos de pagamentos, filtrando a listagem de pagamentos pelo parâmetro `customer_reference`.

**Architecture:** Uma nova chain `listDonorsByCampaign` (UseCase → Controller → Factory) resolve `accountId` internamente chamando `getCampaign`, depois delega para o `DonorGateway` já existente. O loader da rota carrega doadores em paralelo com métricas e pagamentos. A busca por texto dispara uma navegação completa (parâmetro `donor_search` na URL), recarregando o loader com a nova lista.

**Tech Stack:** React Router v7 (SSR) · React 19 · Tailwind CSS v4 · TypeScript

## Global Constraints

- Sem framework de testes — verificação via `npm run typecheck` (executa `react-router typegen && tsc`)
- Usar `api` (token do usuário) para todas as chamadas — nunca `donationApi`
- Parâmetros de gateway separados, nunca agrupados em objeto genérico
- Nunca usar elementos HTML nativos quando existe componente UI equivalente
- Named exports em todos os arquivos — nunca `export default` em arquivos de domínio/infra
- Não commitar — o usuário revisa e commita pelo VS Code

---

### Task 1: UseCase `ListDonorsByCampaignUseCase`

**Files:**
- Create: `src/app/useCases/donor/listDonorsByCampaignUseCase.ts`

**Interfaces:**
- Consumes: `CampaignGatewayDTO.getCampaign(id: string, token: string): Promise<Campaign>` de `src/domain/gateways/campaign.ts`; `DonorGatewayDTO.listDonors(projectId: string, accountId: number, searchParams: DonorSearchParams, token: string): Promise<SearchResult<Donor>>` de `src/domain/gateways/donor.ts`; `DonorSearchParams` de `src/app/search/donorSearchParams.ts`
- Produces: `ListDonorsByCampaignUseCase` — classe com `execute(input: InputProps): Promise<SearchResult<Donor>.toJson()>`, onde `InputProps = { campaignId: string; page?: number | null; search?: string; token: string }`

- [ ] **Step 1: Criar o arquivo**

```ts
// src/app/useCases/donor/listDonorsByCampaignUseCase.ts
import { DonorSearchParams } from "~/app/search/donorSearchParams";
import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";
import type { DonorGatewayDTO } from "~/domain/gateways/donor";

type InputProps = {
  campaignId: string;
  page?: number | null;
  search?: string;
  token: string;
};

class ListDonorsByCampaignUseCase {
  constructor(
    private campaignGateway: CampaignGatewayDTO,
    private donorGateway: DonorGatewayDTO,
  ) {}

  async execute(input: InputProps) {
    const { campaignId, page, search, token } = input;

    const campaign = await this.campaignGateway.getCampaign(campaignId, token);

    const searchParams = new DonorSearchParams({
      page: page ?? 1,
      filter: { search },
    });

    const result = await this.donorGateway.listDonors(
      campaignId,
      campaign.accountId,
      searchParams,
      token,
    );

    return result.toJson();
  }
}

export { ListDonorsByCampaignUseCase };
```

- [ ] **Step 2: Verificar tipos**

```bash
npm run typecheck
```

Esperado: sem erros de tipo no arquivo criado.

---

### Task 2: Controller `ListDonorsByCampaignController`

**Files:**
- Create: `src/infra/controllers/donor/listDonorsByCampaignController.ts`

**Interfaces:**
- Consumes: `ListDonorsByCampaignUseCase` de `src/app/useCases/donor/listDonorsByCampaignUseCase.ts`; `AuthService.getAuthStorage(route)` de `~/infra/services/authService`; `HttpAdapter.unauthorized / badRequest` de `~/infra/adapters/httpAdapter`; `RouteDTO` de `~/main/types/route`
- Produces: `ListDonorsByCampaignController` com `handle(route: RouteDTO): Promise<...>`; lê `route.params.campaignId` e `route.query.donor_search`

- [ ] **Step 1: Criar o arquivo**

```ts
// src/infra/controllers/donor/listDonorsByCampaignController.ts
import type { ListDonorsByCampaignUseCase } from "~/app/useCases/donor/listDonorsByCampaignUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListDonorsByCampaignController {
  constructor(
    private listDonorsByCampaignUseCase: ListDonorsByCampaignUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const page = route.query.page ? Number(route.query.page) : 1;

    return await this.listDonorsByCampaignUseCase.execute({
      campaignId,
      page,
      search: route.query.donor_search,
      token: user.token,
    });
  }
}

export { ListDonorsByCampaignController };
```

- [ ] **Step 2: Verificar tipos**

```bash
npm run typecheck
```

Esperado: sem erros.

---

### Task 3: Factory `listDonorsByCampaignFactory`

**Files:**
- Create: `src/main/factories/donor/listDonorsByCampaignFactory.ts`

**Interfaces:**
- Consumes: `ListDonorsByCampaignUseCase` de `~/app/useCases/donor/listDonorsByCampaignUseCase`; `ListDonorsByCampaignController` de `~/infra/controllers/donor/listDonorsByCampaignController`; `CampaignGateway` de `~/infra/gateways/campaign`; `DonorGateway` de `~/infra/gateways/donor`
- Produces: `listDonorsByCampaign` — objeto `{ handle: (route: RouteDTO) => Promise<...> }`

- [ ] **Step 1: Criar o arquivo**

```ts
// src/main/factories/donor/listDonorsByCampaignFactory.ts
import { ListDonorsByCampaignUseCase } from "~/app/useCases/donor/listDonorsByCampaignUseCase";
import { ListDonorsByCampaignController } from "~/infra/controllers/donor/listDonorsByCampaignController";
import { CampaignGateway } from "~/infra/gateways/campaign";
import { DonorGateway } from "~/infra/gateways/donor";

const campaignGateway = new CampaignGateway();
const donorGateway = new DonorGateway();
const listDonorsByCampaignUseCase = new ListDonorsByCampaignUseCase(
  campaignGateway,
  donorGateway,
);
const listDonorsByCampaignController = new ListDonorsByCampaignController(
  listDonorsByCampaignUseCase,
);

const listDonorsByCampaign = {
  handle: listDonorsByCampaignController.handle.bind(
    listDonorsByCampaignController,
  ),
};

export { listDonorsByCampaign };
```

- [ ] **Step 2: Verificar tipos**

```bash
npm run typecheck
```

Esperado: sem erros.

---

### Task 4: Adicionar `customer_reference` ao pipeline de pagamentos

**Files:**
- Modify: `src/app/search/paymentsListSearchParams.ts`
- Modify: `src/app/useCases/paymentMetrics/listPaymentsUseCase.ts`
- Modify: `src/infra/controllers/paymentMetrics/listPaymentsController.ts`

**Interfaces:**
- Consumes: arquivos existentes já lidos
- Produces: `ListPaymentsUseCase.execute` aceita `customerReference?: string`; `ListPaymentsController.handle` lê `route.query.customer_reference`

- [ ] **Step 1: Adicionar `customer_reference` ao `Filter` em `paymentsListSearchParams.ts`**

Conteúdo final do arquivo:

```ts
import { SearchParams } from "../shared/searchParams";

type Filter = {
  start_date: string;
  end_date: string;
  per_page: number;
  date_type?: string;
  origin?: string;
  type?: string;
  status?: string;
  notified_email?: string;
  notified_whatsapp?: string;
  customer_reference?: string;
};

class PaymentsListSearchParams extends SearchParams<Filter> {}

export { PaymentsListSearchParams };
```

- [ ] **Step 2: Adicionar `customerReference` ao UseCase em `listPaymentsUseCase.ts`**

Conteúdo final do arquivo:

```ts
import { PaymentsListSearchParams } from "~/app/search/paymentsListSearchParams";
import type { PaymentMetricsGatewayDTO } from "~/domain/gateways/paymentMetrics";
import { getMonthDates } from "~/lib/getMonthDates";

type InputProps = {
  campaignPublicId: string;
  page?: number | null;
  startDate?: string;
  endDate?: string;
  dateType?: string;
  origin?: string;
  paymentType?: string;
  status?: string;
  notifiedEmail?: string;
  notifiedWhatsapp?: string;
  customerReference?: string;
};

class ListPaymentsUseCase {
  constructor(private gateway: PaymentMetricsGatewayDTO) {}

  async execute(input: InputProps) {
    const {
      campaignPublicId,
      page,
      startDate,
      endDate,
      dateType,
      origin,
      paymentType,
      status,
      notifiedEmail,
      notifiedWhatsapp,
      customerReference,
    } = input;
    const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);

    const searchParams = new PaymentsListSearchParams({
      page: page ?? 1,
      filter: {
        start_date: startDate ?? firstDayOfMonth,
        end_date: endDate ?? lastDayOfMonth,
        per_page: 20,
        date_type: dateType,
        origin: origin,
        type: paymentType,
        status: status,
        notified_email: notifiedEmail,
        notified_whatsapp: notifiedWhatsapp,
        customer_reference: customerReference,
      },
    });

    const result = await this.gateway.listPayments(campaignPublicId, searchParams);
    return result.toJson();
  }
}

export { ListPaymentsUseCase };
```

- [ ] **Step 3: Adicionar leitura de `customer_reference` no Controller em `listPaymentsController.ts`**

Conteúdo final do arquivo:

```ts
import type { ListPaymentsUseCase } from "~/app/useCases/paymentMetrics/listPaymentsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListPaymentsController {
  constructor(private listPaymentsUseCase: ListPaymentsUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const page = route.query.page ? Number(route.query.page) : 1;

    return await this.listPaymentsUseCase.execute({
      campaignPublicId: campaignId,
      page,
      startDate: route.query.start_date,
      endDate: route.query.end_date,
      dateType: route.query.date_type,
      origin: route.query.origin,
      paymentType: route.query.type,
      status: route.query.status,
      notifiedEmail: route.query.notified_email,
      notifiedWhatsapp: route.query.notified_whatsapp,
      customerReference: route.query.customer_reference,
    });
  }
}

export { ListPaymentsController };
```

- [ ] **Step 4: Verificar tipos**

```bash
npm run typecheck
```

Esperado: sem erros.

---

### Task 5: Atualizar o loader da rota de extratos

**Files:**
- Modify: `src/main/routes/route.campaign.paymentStatements.tsx`

**Interfaces:**
- Consumes: `listDonorsByCampaign` de `src/main/factories/donor/listDonorsByCampaignFactory.ts`
- Produces: loader retorna `{ metrics, payments, donors }` — `donors` tem shape `{ data: { id, name, ... }[], meta: { page, pageLimit, totalItems, totalPages } }`

- [ ] **Step 1: Atualizar o arquivo**

Conteúdo final do arquivo:

```tsx
import type { Route } from "+/route.campaign.paymentStatements";
import { redirect } from "react-router";
import { PaymentStatementsPage } from "~/client/pages/paymentStatements";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getPaymentMetrics, listPayments } from "../factories/paymentMetrics/getPaymentMetricsFactory";
import { listDonorsByCampaign } from "../factories/donor/listDonorsByCampaignFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const [metrics, payments, donors] = await Promise.all([
    getPaymentMetrics.handle(adaptedRoute),
    listPayments.handle(adaptedRoute),
    listDonorsByCampaign.handle(adaptedRoute),
  ]);

  return { metrics, payments, donors };
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
npm run typecheck
```

Esperado: sem erros.

---

### Task 6: FilterDrawer + PaymentStatementsPage

**Files:**
- Modify: `src/client/pages/paymentStatements/components/filterDrawer/index.tsx`
- Modify: `src/client/pages/paymentStatements/index.tsx`

**Interfaces:**
- Consumes: `useLoaderData<PaymentStatementsLoader>()` de `~/client/types/paymentStatementsLoader` (já importado na page); `Combobox` de `~/client/components/ui/combobox`; `donors` do loader com shape `{ data: { id: string; name: string; ... }[] }`
- Produces: `FilterDrawer` aceita prop `donors: { id: string; name: string }[]`; `PaymentStatementsPage` passa `donors.data` para `FilterDrawer`; URL param `customer_reference` é aplicado ao fechar o drawer com "Aplicar"

- [ ] **Step 1: Atualizar `FilterDrawer`**

Conteúdo final do arquivo `src/client/pages/paymentStatements/components/filterDrawer/index.tsx`:

```tsx
import { ListFilter, XCircle } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Combobox } from "~/client/components/ui/combobox";
import { Input } from "~/client/components/ui/input";
import { Label } from "~/client/components/ui/label";
import { RadioGroup } from "~/client/components/ui/radio-group";
import { Select } from "~/client/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/client/components/ui/sheet";

const DRAWER_PARAMS = [
  "date_type",
  "origin",
  "type",
  "status",
  "notified_email",
  "notified_whatsapp",
  "customer_reference",
] as const;

type DateType = "due" | "paid";

type FilterDraft = {
  dateType: DateType;
  startDate: string;
  endDate: string;
  origin: string;
  paymentType: string;
  status: string;
  notifiedEmail: string;
  notifiedWhatsapp: string;
  donorId: string;
};

function draftFromParams(sp: URLSearchParams): FilterDraft {
  return {
    dateType: sp.get("date_type") === "paid" ? "paid" : "due",
    startDate: sp.get("start_date") ?? "",
    endDate: sp.get("end_date") ?? "",
    origin: sp.get("origin") ?? "",
    paymentType: sp.get("type") ?? "",
    status: sp.get("status") ?? "",
    notifiedEmail: sp.get("notified_email") ?? "",
    notifiedWhatsapp: sp.get("notified_whatsapp") ?? "",
    donorId: sp.get("customer_reference") ?? "",
  };
}

type FilterDrawerProps = {
  donors: { id: string; name: string }[];
};

function FilterDrawer({ donors }: FilterDrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FilterDraft>(
    draftFromParams(new URLSearchParams()),
  );

  const sp = new URLSearchParams(location.search);
  const filterCount = DRAWER_PARAMS.filter((p) => sp.get(p)).length;

  const donorOptions = donors.map((d) => ({ value: d.id, label: d.name }));

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) setDraft(draftFromParams(new URLSearchParams(location.search)));
    setOpen(isOpen);
  }

  function handleDonorSearch(search: string) {
    const nextSp = new URLSearchParams(location.search);
    if (search) nextSp.set("donor_search", search);
    else nextSp.delete("donor_search");
    navigate(`?${nextSp.toString()}`);
  }

  function clearFilters() {
    const nextSp = new URLSearchParams(location.search);
    DRAWER_PARAMS.forEach((p) => nextSp.delete(p));
    nextSp.delete("donor_search");
    navigate(`?${nextSp.toString()}`);
  }

  function applyFilters() {
    const nextSp = new URLSearchParams(location.search);

    if (draft.dateType === "paid") nextSp.set("date_type", "paid");
    else nextSp.delete("date_type");

    const fields: [string, string][] = [
      ["origin", draft.origin],
      ["type", draft.paymentType],
      ["status", draft.status],
      ["notified_email", draft.notifiedEmail],
      ["notified_whatsapp", draft.notifiedWhatsapp],
      ["customer_reference", draft.donorId],
    ];

    for (const [key, value] of fields) {
      if (value) nextSp.set(key, value);
      else nextSp.delete(key);
    }

    if (draft.startDate) {
      nextSp.set("start_date", draft.startDate);
      nextSp.set("end_date", draft.endDate);
      nextSp.set("period", "custom");
    }

    nextSp.delete("donor_search");
    navigate(`?${nextSp.toString()}`);
    setOpen(false);
  }

  function clearAndClose() {
    clearFilters();
    setOpen(false);
  }

  function setField<K extends keyof FilterDraft>(field: K) {
    return (value: FilterDraft[K]) =>
      setDraft((d) => ({ ...d, [field]: value }));
  }

  return (
    <>
      {filterCount > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="gap-1.5 text-destructive hover:brightness-100 hover:opacity-75 bg-card"
        >
          <XCircle size={16} />
          Limpar filtros
        </Button>
      )}

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="relative size-9 bg-card"
          >
            <ListFilter size={16} />
            {filterCount > 0 && (
              <span className="absolute -top-1.5 -left-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                {filterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4">
            <div className="flex flex-col gap-2">
              <Label>Doador:</Label>
              <Combobox
                options={donorOptions}
                value={draft.donorId}
                onChange={setField("donorId")}
                onSearchChange={handleDonorSearch}
                placeholder="Selecione um doador"
                searchPlaceholder="Pesquisar por nome..."
                emptyText="Nenhum doador encontrado."
              />
            </div>

            <div className="border border-border rounded p-4">
              <div className="flex flex-col gap-2">
                <Label>Tipo de data:</Label>
                <RadioGroup.Root
                  value={draft.dateType}
                  onValueChange={(v) => setField("dateType")(v as DateType)}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroup.Item value="due" id="dateType-due" />
                    <label
                      htmlFor="dateType-due"
                      className="cursor-pointer text-sm"
                    >
                      Vencimento
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroup.Item value="paid" id="dateType-paid" />
                    <label
                      htmlFor="dateType-paid"
                      className="cursor-pointer text-sm"
                    >
                      Pagamento
                    </label>
                  </div>
                </RadioGroup.Root>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Data inicial:</Label>
                <Input
                  type="date"
                  value={draft.startDate}
                  onChange={(e) => setField("startDate")(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Data final:</Label>
                <Input
                  type="date"
                  value={draft.endDate}
                  onChange={(e) => setField("endDate")(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tipo de doador:</Label>
              <Select.Root
                value={draft.origin}
                onValueChange={setField("origin")}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content position="popper">
                  <Select.Item value="">Todos</Select.Item>
                  <Select.Item value="subscription">Recorrente</Select.Item>
                  <Select.Item value="transfer">Pontual</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tipo de pagamento:</Label>
              <Select.Root
                value={draft.paymentType}
                onValueChange={setField("paymentType")}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content position="popper">
                  <Select.Item value="">Todos</Select.Item>
                  <Select.Item value="credit_card">
                    Cartão de crédito
                  </Select.Item>
                  <Select.Item value="pix">Pix</Select.Item>
                  <Select.Item value="bank_slip">Boleto</Select.Item>
                  <Select.Item value="manual_payment">Baixa manual</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Status:</Label>
              <Select.Root
                value={draft.status}
                onValueChange={setField("status")}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content position="popper">
                  <Select.Item value="">Todos</Select.Item>
                  <Select.Item value="received">
                    Disponível para saque
                  </Select.Item>
                  <Select.Item value="confirmed">
                    Pagamento confirmado
                  </Select.Item>
                  <Select.Item value="awaiting_payment">
                    Aguardando pagamento
                  </Select.Item>
                  <Select.Item value="overdue">Vencido</Select.Item>
                  <Select.Item value="canceled">Cancelado</Select.Item>
                  <Select.Item value="failed">Falha no pagamento</Select.Item>
                  <Select.Item value="refunded">Estornado</Select.Item>
                  <Select.Item value="deleted">Excluído</Select.Item>
                  <Select.Item value="manual">Recebido (manual)</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Notificado por e-mail:</Label>
              <Select.Root
                value={draft.notifiedEmail}
                onValueChange={setField("notifiedEmail")}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content position="popper">
                  <Select.Item value="">Qualquer</Select.Item>
                  <Select.Item value="1">Sim</Select.Item>
                  <Select.Item value="0">Não</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Notificado por WhatsApp:</Label>
              <Select.Root
                value={draft.notifiedWhatsapp}
                onValueChange={setField("notifiedWhatsapp")}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content position="popper">
                  <Select.Item value="">Qualquer</Select.Item>
                  <Select.Item value="1">Sim</Select.Item>
                  <Select.Item value="0">Não</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          </div>

          <SheetFooter className="flex-row gap-3 px-4">
            <Button className="flex-1" onClick={applyFilters}>
              Aplicar
            </Button>
            <Button variant="ghost" className="flex-1" onClick={clearAndClose}>
              Limpar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

export { FilterDrawer };
```

- [ ] **Step 2: Atualizar `PaymentStatementsPage` para passar `donors` ao `FilterDrawer`**

Arquivo `src/client/pages/paymentStatements/index.tsx` — única mudança: ler `donors` do loader e passá-lo ao `FilterDrawer`.

Trecho alterado (linha 36 e linha 57):

```tsx
// linha 36 — ler donors do loader
const { metrics, donors } = useLoaderData<PaymentStatementsLoader>();

// linha 57 — passar donors como prop
<FilterDrawer donors={donors.data} />
```

Conteúdo final do arquivo:

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
import { FilterDrawer } from "./components/filterDrawer";
import { PaymentsTable } from "./components/paymentsTable";
import { PeriodSelect } from "./components/periodSelect";

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
  const { metrics, donors } = useLoaderData<PaymentStatementsLoader>();

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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-(--text-heading)">
          Extratos de pagamentos
        </h1>
        <div className="flex items-center gap-3">
          <PeriodSelect />
          <FilterDrawer donors={donors.data} />
        </div>
      </div>
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
npm run typecheck
```

Esperado: sem erros.
