# Design: filter[account_id] obrigatório em listContacts

**Data:** 2026-06-16

## Contexto

A rota `/contact/find-many` da API externa exige o parâmetro `filter[account_id]` em todas as chamadas. O valor desse parâmetro deve vir do campo `accountId` da campanha associada à rota atual. Atualmente, `listContacts` não envia esse parâmetro.

O `ListContactsUseCase` já tem `campaignGateway` injetado — preparado explicitamente para essa necessidade.

## Abordagem escolhida

O use case busca a campanha internamente via `campaignGateway.getCampaign()` para obter o `accountId`, garantindo que o valor nunca venha de input externo (sempre derivado server-side da campanha).

A rota continua chamando `getCampaign` separadamente para retornar dados da campanha à página; a chamada adicional dentro do use case é aceita como trade-off de encapsulamento.

## Fluxo de dados

```
route.params.campaignId
       ↓
ListContactsController
  → extrai campaignId de route.params
  → valida query params via listContactsSchema (sem accountId)
  → chama ListContactsUseCase({ campaignId, filter }, token)
       ↓
ListContactsUseCase
  1. campaignGateway.getCampaign(campaignId, token) → Campaign { accountId }
  2. new ContactsSearchParams({ filter: { ...filter, accountId: String(campaign.accountId) } })
  3. contactsGateway.listContacts(searchParams, token)
       ↓
ContactsGateway
  → URLSearchParams manual: accountId → "filter[account_id]"
  → GET /contact/find-many?filter[account_id]=xxx[&name=yyy]
```

## Arquivos alterados

### `src/app/search/contactsSearchParams.ts`
- Adiciona `accountId?: string` ao tipo `Filter`

### `src/app/useCases/contacts/listContactsUseCase.ts`
- `InputProps` passa a ter `campaignId: string` e remove `accountId` do filter (accountId agora é derivado)
- `execute()` chama `campaignGateway.getCampaign(campaignId, token)` e injeta `accountId` no filter antes de construir os search params

### `src/infra/controllers/contacts/listContactsController.ts`
- Extrai `campaignId` de `route.params`
- Lança `badRequest` se `campaignId` ausente
- Passa `{ campaignId, ...mappedFilter }` para o use case

### `src/infra/schemas/internal/contacts.ts`
- Remove `accountId` do schema — não é mais um input válido da requisição

### `src/infra/gateways/contacts.ts`
- Substitui `searchParams.toExternal()` por construção manual com `URLSearchParams`
- Mapeia `filter.accountId` → chave `"filter[account_id]"` na URL
- Mapeia outros filtros (ex.: `name`) com seus nomes diretos

## Arquivos não alterados

- `src/main/factories/contacts/listContactsFactory.ts` — wiring não muda
- `src/main/routes/route.campaign.createRecurrence.tsx` — `campaignId` já está em `route.params`; nenhuma mudança necessária

## Restrições

- `accountId` nunca deve aceitar valor vindo de query param — sempre derivado da campanha via gateway
- O gateway é o único ponto responsável pelo mapeamento `accountId` → `filter[account_id]`
