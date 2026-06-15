# Payment Metrics — Design Spec

**Data:** 2026-06-15  
**Escopo:** Integrar os cards de métricas da página `PaymentStatementsPage` com a API real.

---

## Contexto

A página `src/client/pages/paymentStatements/index.tsx` exibe 8 cards com valores financeiros (recebido online, liberado, pendentes, etc.). Atualmente usa dados hardcoded. O objetivo é buscá-los do endpoint `/api/metrics/total-payments/{subAccountId}`.

O `subAccountId` é o próprio `params.campaignId` presente na URL `campaign/:campaignId/payment-statements`.

---

## Fluxo de dados

```
route.campaign.paymentStatements.tsx (loader)
  └─ getPaymentMetrics.handle(adaptedRoute)
       └─ GetPaymentMetricsController
            ├─ params.campaignId  ← é o subAccountId
            ├─ user.token
            └─ GetPaymentMetricsUseCase
                 ├─ calcula start_date = 1º dia do mês atual  (YYYY-MM-DD)
                 ├─ calcula end_date   = último dia do mês atual (YYYY-MM-DD)
                 └─ PaymentMetricsGateway
                      └─ GET /api/metrics/total-payments/{subAccountId}
                              ?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&per_page=20
                      └─ valida com zod (externalPaymentMetricsSchema)
                      └─ retorna objeto com os 8 valores formatados

Route retorna { metrics } → useLoaderData<PaymentStatementsLoader>() na página
```

---

## Mapeamento de cards

| Card | Campo(s) da API |
|------|----------------|
| Total recebido online | `received.amount + confirmed.amount` |
| Total liberado | `received.amount` |
| Aguardando liberação | `confirmed.amount` |
| Pendentes | `awaiting_payment.amount + overdue.amount` |
| Total recebido offline | `manual.amount` |
| Em atraso | `overdue.amount` |
| Cancelados | `canceled.amount` |
| Taxas aplicadas | `received.fee_amount + confirmed.fee_amount` |

Todos os valores são formatados com `toLocaleString("pt-BR", { style: "currency", currency: "BRL" })`.

---

## Filtro de período

Fixo no mês atual. Calculado no servidor dentro do `GetPaymentMetricsUseCase`:

```ts
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const startDate = new Date(year, month, 1).toISOString().slice(0, 10);
const endDate = new Date(year, month + 1, 0).toISOString().slice(0, 10);
```

Sem seletor na UI por enquanto. Facilmente extensível para aceitar `query.start_date` / `query.end_date` no futuro.

---

## Arquivos a criar

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/infra/schemas/external/paymentMetrics.ts` | Zod schema da resposta da API |
| `src/domain/gateways/paymentMetrics.ts` | Interface do gateway |
| `src/infra/gateways/paymentMetrics.ts` | Chamada HTTP + validação do schema |
| `src/app/useCases/paymentMetrics/getPaymentMetricsUseCase.ts` | Cálculo de datas + processamento dos valores |
| `src/infra/controllers/paymentMetrics/getPaymentMetricsController.ts` | Extrai params da route, chama use case |
| `src/main/factories/paymentMetrics/getPaymentMetricsFactory.ts` | Instancia e conecta as camadas |
| `src/client/types/paymentStatementsLoader.ts` | Tipo inferido do loader para `useLoaderData` |

## Arquivos a modificar

| Arquivo | Mudança |
|---------|---------|
| `src/main/routes/route.campaign.paymentStatements.tsx` | Adicionar `loader` que chama a factory |
| `src/client/pages/paymentStatements/index.tsx` | Substituir dados hardcoded por `useLoaderData()` |

---

## Decisões de design

- **`campaignId` == `subAccountId`**: Confirmado pelo usuário. O loader usa `params.campaignId` diretamente como ID no endpoint de métricas, sem chamada extra para buscar a campanha.
- **Sem entidade de domínio para métricas**: O use case retorna um plain object com os valores já computados. Métricas são dados de leitura/agregação, sem comportamento de entidade.
- **Data calculada no servidor**: Evita inconsistências de timezone entre cliente e servidor.
- **`per_page=20`**: Incluído na query string conforme padrão do endpoint informado pelo usuário.
