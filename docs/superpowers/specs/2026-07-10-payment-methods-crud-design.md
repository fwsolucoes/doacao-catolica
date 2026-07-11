# Design: CRUD de Métodos de Pagamento

**Data:** 2026-07-10  
**Status:** Aprovado

## Contexto

Portar o CRUD de payment-methods do projeto legado (Remix + @arkyn) para o projeto atual (React Router v7 + shadcn/ui). A funcionalidade permite listar, criar, editar e excluir métodos de pagamento de uma campanha.

## Endpoints da Donation API

| Operação | Método | URL |
|----------|--------|-----|
| Listar   | GET    | `/api/payment-methods/:campaignId` |
| Criar    | POST   | `/api/payment-methods` — body: `{ name, account_reference: campaignId }` |
| Editar   | PUT    | `/api/payment-methods/:campaignId/:id` — body: `{ name }` |
| Excluir  | DELETE | `/api/payment-methods/:campaignId/:id` |

Autenticação via header `api-key: $API_KEY_DONATION` (padrão `donationApi`).  
O `campaignId` é o parâmetro de rota `:campaignId` — passado diretamente, sem mapeamento intermediário.

## Entidade

```
PaymentMethod { id: string (uuid), name: string }
```

## Arquitetura — Abordagem A (página dedicada + Dialogs)

### Camadas a criar

```
infra/schemas/external/paymentMethod.ts
  └─ zod: { data: [{ uuid: string, name: string }] }

domain/entities/paymentMethod.ts
  └─ classe com restore() + toJson()

domain/gateways/paymentMethod.ts
  └─ interface: list(campaignId), create(name, campaignId),
                update(id, name, campaignId), delete(id, campaignId)

infra/mappers/paymentMethod.ts
  └─ ExternalPaymentMethod → PaymentMethod

infra/gateways/paymentMethod.ts
  └─ implementação via donationApi

app/useCases/paymentMethod/
  listPaymentMethodsUseCase.ts
  createPaymentMethodUseCase.ts
  updatePaymentMethodUseCase.ts
  deletePaymentMethodUseCase.ts

infra/controllers/paymentMethod/
  paymentMethodController.ts   ← action único com switch em _action

main/factories/paymentMethod/
  paymentMethodFactory.ts

main/routes/route.campaign.paymentMethods.tsx
  └─ loader: lista métodos de pagamento
  └─ action: despacha por _action (create | update | delete)
  └─ ErrorBoundary

client/pages/paymentMethods/
  index.tsx                    ← página principal
  components/
    createDialog.tsx
    updateDialog.tsx
    deleteDialog.tsx
```

### Rota e Navegação

- **URL:** `campaign/:campaignId/settings/payment-methods`
- Registrada em `routes.ts` como filha do `layout.campaignLayout.tsx`
- Sidebar: item "Configurações" passa a ser `CollapsibleNavItem` com subItem:
  - "Métodos de Pagamento" → `settings/payment-methods`

### UI da Página

**Cabeçalho:**
- Título "Métodos de pagamento"
- Subtítulo descritivo
- Botão "Novo método" que abre `CreateDialog`

**Tabela:**
- Colunas: Nome | Ações
- Ações por linha: botão editar (abre `UpdateDialog` com dados da linha) + botão excluir (abre `DeleteDialog`)
- Estado vazio via componente `Empty` quando lista estiver vazia

**Dialogs:**
- `CreateDialog`: campo Input `name` com `FormField`, submit via `useFetcher` com `_action=create`
- `UpdateDialog`: campo Input `name` pré-populado + campo hidden `id`, `_action=update`
- `DeleteDialog`: confirmação com nome do método, `_action=delete`, campo hidden `id`
- Todos fecham automaticamente após sucesso (via `useEffect` no `fetcher.state`)
- Feedback via toast (retornado pela action)

### Tratamento de Erros

- Erros de campo: `FormErrorProvider` + `FormField` — exibem `fieldErrors` da action
- Erros gerais: `ErrorHandlerAdapter.handle(error)` na action
- `ErrorBoundary` no adapter de rota

## Decisões

- `campaignId` da rota vai direto para a donation API (sem passar por `apiDonationPublicId`)
- Action única com `_action` switch — mesmo padrão do projeto legado, sem precisar de múltiplos endpoints
- Dialogs controlados por state local (`useState<PaymentMethod | null>`) — abre com o item selecionado, fecha ao limpar o state
