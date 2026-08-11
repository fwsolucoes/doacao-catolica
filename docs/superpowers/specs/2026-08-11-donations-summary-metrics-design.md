# Design: Cards de métricas da tela de Doações (donationsSummary)

**Data:** 2026-08-11  
**Status:** Aprovado

## Contexto

A tela de Doações (`/campaign/:campaignId/donations`) exibe 4 cards de métricas. Dois deles ("Ticket médio" e "Doadores") estão com valores placeholder `"—"`. O novo endpoint `GET /metrics/donations-summary/{account_uuid}` fornece os dados necessários para preenchê-los.

## Endpoint

```
GET /metrics/donations-summary/{account_uuid}
Query: start_date (YYYY-MM-DD), end_date (YYYY-MM-DD)
Auth: api-key header (API_KEY_DONATION)
Base URL: API_URL_DONATION
```

O `account_uuid` no path é o `campaignId` do route param — padrão já adotado em outros endpoints do `donationApi`.

## Campos consumidos

| Campo da API | Uso |
|---|---|
| `average_ticket.period` | Valor principal do card Ticket médio (BRL) |
| `average_ticket.previous_month` | Referência do mês anterior (BRL) |
| `average_ticket.variation_percentage` | Variação % exibida no subtitle do card (nullable) |
| `one_time_donations.amount` | Breakdown "Doações únicas" no card Ticket médio (BRL) |
| `recurring_donations.amount` | Breakdown "Recorrentes" no card Ticket médio (BRL) |
| `subscriptions.active_count` | Valor principal do card Doadores (inteiro) |
| `subscriptions.active_amount` | Breakdown "Assinaturas ativas" no card Doadores (BRL) |
| `subscriptions.created_in_period_active_amount` | Breakdown "Novas no período" no card Doadores (BRL) |

Campos não usados por enquanto: todos os `count` de `one_time_donations`, `recurring_donations`, `total_donations`, `subscriptions.created_in_period_count`, `subscriptions.created_in_period_active_count`.

## Arquitetura

Nova feature seguindo o padrão Gateway do projeto. Não altera o `paymentMetrics` existente.

```
src/infra/schemas/external/donationsSummary.ts
src/domain/entities/donationsSummary.ts
src/domain/gateways/donationsSummary.ts
src/app/search/donationsSummarySearchParams.ts
src/infra/gateways/donationsSummary.ts
src/app/useCases/donationsSummary/getDonationsSummaryUseCase.ts
src/infra/controllers/donationsSummary/getDonationsSummaryController.ts
src/main/factories/donationsSummary/getDonationsSummaryFactory.ts
```

### Schema externo (`donationsSummary.ts`)

Valida a resposta da API com Zod. Todos os campos numéricos são `z.number()`. `variation_percentage` é `z.number().nullable()`.

### Entity `DonationsSummary`

- `restore()` recebe os valores brutos (numbers + nullable number)
- `toJson()` formata amounts em BRL (`toLocaleString("pt-BR", { style: "currency", currency: "BRL" })`); `active_count` como string do número; `variation_percentage` como string `"+12,5%"` / `"-3,2%"` ou `null`

### Gateway interface

```ts
getDonationsSummary(
  campaignId: string,
  searchParams: DonationsSummarySearchParams,
): Promise<DonationsSummaryData>
```

### SearchParams

Estende `SearchParams` com `filter: { start_date: string; end_date: string }`. O gateway chama `toExternal(["page", "pageLimit"])`.

### UseCase

Resolve `start_date`/`end_date` do input, com fallback para `getMonthDates(0)` quando ausentes. Mesmo padrão do `GetPaymentMetricsUseCase`.

### Controller

Lê `campaignId` de `route.params`, passa `start_date`/`end_date` de `route.query`.

### Factory

Instancia `DonationsSummaryGateway → GetDonationsSummaryUseCase → GetDonationsSummaryController` e exporta `getDonationsSummary.handle`.

## Loader da rota

`route.campaign.donations.tsx` adiciona `getDonationsSummary.handle(adaptedRoute)` ao `Promise.all` existente:

```ts
const [metrics, payments, donors, summary] = await Promise.all([
  getPaymentMetrics.handle(adaptedRoute),
  listPayments.handle(adaptedRoute),
  listDonorsByCampaign.handle(adaptedRoute),
  getDonationsSummary.handle(adaptedRoute),
]);

return { metrics, payments, donors, summary };
```

## UI — Cards atualizados

### Card "Ticket médio"

| Propriedade | Valor |
|---|---|
| `value` | `summary.averageTicketPeriod` (BRL) |
| `subtitle` | `summary.variationPercentage` não-null → `"${variation} vs. mês anterior"` · null → `"vs. mês anterior"` |
| `breakdown[0]` | icon: Zap · label: "Doações únicas" · value: `summary.oneTimeDonationsAmount` |
| `breakdown[1]` | icon: RefreshCw · label: "Recorrentes" · value: `summary.recurringDonationsAmount` |

### Card "Doadores"

| Propriedade | Valor |
|---|---|
| `value` | `summary.subscriptionsActiveCount` |
| `subtitle` | `"assinaturas ativas"` |
| `breakdown[0]` | icon: Users · label: "Assinaturas ativas" · value: `summary.subscriptionsActiveAmount` |
| `breakdown[1]` | icon: UserPlus · label: "Novas no período" · value: `summary.subscriptionsCreatedInPeriodActiveAmount` |

### Cards sem alteração

"Total recebido" e "Pendências" continuam consumindo `metrics` do endpoint antigo.

## Tratamento de erros

O gateway lança `HttpAdapter.badGateway()` em caso de falha, igual ao padrão existente. O `ErrorBoundary` da rota captura.

## O que não muda

- Layout de 4 cards (grid `sm:grid-cols-2 xl:grid-cols-4`)
- Componente `MetricCard` (sem alteração de estrutura)
- `PeriodSelect` (já passa `start_date`/`end_date` na query string, que o novo controller consome)
- `PaymentsTable`
- Endpoint `/api/metrics/total-payments` (continua sendo chamado)
