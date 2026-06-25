# Design: Combobox "Selecione um doador" no Drawer de Filtros de Extratos

**Data:** 2026-06-25  
**Feature:** Adicionar campo de seleção de doador no drawer de filtros da tela de extratos de pagamentos

---

## Contexto

A tela de extratos de pagamentos (`route.campaign.paymentStatements`) já possui um drawer de filtros com campos de data, tipo de doador, tipo de pagamento, status e notificações. O objetivo é adicionar um combobox "Selecione um doador" que permita filtrar os pagamentos por doador específico, enviando o parâmetro `customer_reference` para a API de pagamentos.

A infraestrutura de listagem de doadores foi criada anteriormente (factory `listDonors`), mas ela usa `projectId` + `accountId` como parâmetros de rota. Como a rota de extratos só expõe `campaignId`, é necessária uma chain adicional que resolva `accountId` internamente a partir da campanha.

---

## Abordagem

**Approach A (escolhida):** Doadores carregados no loader da página. Busca por texto dispara navegação completa (recarga do loader), mesmo padrão do combobox de contatos em `createRecurrence`.

---

## Arquitetura

### Novo fluxo backend: doadores por campanha

```
listDonorsByCampaignUseCase
  → CampaignGateway.getCampaign(campaignId, token)   // obtém accountId
  → DonorGateway.listDonors(campaignId, accountId, searchParams, token)
  → retorna SearchResult<Donor>.toJson()
```

O `campaignId` é usado diretamente como `projectId` no endpoint de doadores (`/donators/find-all/{projectId}/{accountId}`).

### Parâmetro de busca de doadores na URL

`donor_search` — parâmetro temporário, lido pelo controller de doadores. Não faz parte dos filtros de pagamento aplicados. É limpo da URL ao aplicar ou limpar filtros.

### Parâmetro de filtro de pagamentos

`customer_reference` — ID do doador selecionado, enviado à API de pagamentos. Faz parte de `DRAWER_PARAMS` (contador de filtros ativos + limpeza).

---

## Arquivos

### Novos

| Arquivo | Responsabilidade |
|---|---|
| `src/app/useCases/donor/listDonorsByCampaignUseCase.ts` | Busca campanha → obtém accountId → lista doadores |
| `src/infra/controllers/donor/listDonorsByCampaignController.ts` | Lê `campaignId` de params, `donor_search` de query |
| `src/main/factories/donor/listDonorsByCampaignFactory.ts` | Instancia `DonorGateway + CampaignGateway → UseCase → Controller` |

### Modificados

| Arquivo | Mudança |
|---|---|
| `src/app/search/paymentsListSearchParams.ts` | Adiciona `customer_reference?: string` ao tipo `Filter` |
| `src/app/useCases/paymentMetrics/listPaymentsUseCase.ts` | Adiciona `customerReference?: string` ao `InputProps`, passa para `SearchParams` |
| `src/infra/controllers/paymentMetrics/listPaymentsController.ts` | Lê `customer_reference` de `route.query`, passa ao use case |
| `src/main/routes/route.campaign.paymentStatements.tsx` | Adiciona `listDonorsByCampaign.handle(adaptedRoute)` ao `Promise.all`, retorna `donors` |
| `src/client/pages/paymentStatements/components/filterDrawer/index.tsx` | Adiciona combobox de doador com busca server-side |

---

## UseCase: `listDonorsByCampaignUseCase`

```ts
type InputProps = {
  campaignId: string;
  page?: number | null;
  search?: string;
  token: string;
};
```

1. Chama `campaignGateway.getCampaign(campaignId, token)` para obter o `accountId`
2. Monta `DonorSearchParams({ page: input.page ?? 1, filter: { search: input.search } })`
3. Chama `donorGateway.listDonors(campaignId, accountId, searchParams, token)`
4. Retorna `result.toJson()`

---

## Controller: `listDonorsByCampaignController`

1. `AuthService.getAuthStorage(route)` — lança `unauthorized` se não autenticado
2. Extrai `campaignId` de `route.params` — lança `badRequest` se ausente
3. Extrai `page` e `donor_search` de `route.query`
4. Chama `listDonorsByCampaignUseCase.execute({ campaignId, page, search: donor_search, token })`

---

## Factory: `listDonorsByCampaignFactory`

```ts
const campaignGateway = new CampaignGateway();
const donorGateway = new DonorGateway();
const listDonorsByCampaignUseCase = new ListDonorsByCampaignUseCase(campaignGateway, donorGateway);
const listDonorsByCampaignController = new ListDonorsByCampaignController(listDonorsByCampaignUseCase);

const listDonorsByCampaign = {
  handle: listDonorsByCampaignController.handle.bind(listDonorsByCampaignController),
};

export { listDonorsByCampaign };
```

---

## Modificações em pagamentos

### `paymentsListSearchParams.ts`

Adiciona `customer_reference?: string` ao tipo `Filter`.

### `listPaymentsUseCase.ts`

Adiciona `customerReference?: string` ao `InputProps`. Passa para o construtor de `PaymentsListSearchParams` no filtro.

### `listPaymentsController.ts`

Lê `route.query.customer_reference` e passa como `customerReference` ao use case.

---

## Loader da rota

`route.campaign.paymentStatements.tsx`:

```ts
const [metrics, payments, donors] = await Promise.all([
  getPaymentMetrics.handle(adaptedRoute),
  listPayments.handle(adaptedRoute),
  listDonorsByCampaign.handle(adaptedRoute),
]);
return { metrics, payments, donors };
```

---

## FilterDrawer — mudanças

### `DRAWER_PARAMS`

Adiciona `"customer_reference"` ao array.

### `FilterDraft`

Adiciona `donorId: string`.

### `draftFromParams`

Adiciona `donorId: sp.get("customer_reference") ?? ""`.

### `applyFilters`

Adiciona ao bloco de campos:
```ts
["customer_reference", draft.donorId],
```

Antes de navegar, também limpa `donor_search`:
```ts
nextSp.delete("donor_search");
```

### `clearFilters`

Além de deletar os `DRAWER_PARAMS`, também deleta `donor_search` antes de navegar:
```ts
nextSp.delete("donor_search");
```

### Props do `FilterDrawer`

`FilterDrawer` recebe `donors` como prop vinda da página pai (que tem acesso ao loader):

```ts
type FilterDrawerProps = {
  donors: { id: string; name: string }[];
};
```

A página pai mapeia `loaderData.donors.data` antes de passar.

### JSX — Combobox

Adicionado antes do bloco "Tipo de data", como primeiro filtro no drawer:

```tsx
import { Combobox } from "~/client/components/ui/combobox";
// no componente (donors vem via props):
const donorOptions = donors.map((d) => ({ value: d.id, label: d.name }));

function handleDonorSearch(search: string) {
  const nextSp = new URLSearchParams(location.search);
  if (search) nextSp.set("donor_search", search);
  else nextSp.delete("donor_search");
  navigate(`?${nextSp.toString()}`);
}

// no JSX:
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
```

---

## Checklist de implementação

- [ ] `src/app/useCases/donor/listDonorsByCampaignUseCase.ts`
- [ ] `src/infra/controllers/donor/listDonorsByCampaignController.ts`
- [ ] `src/main/factories/donor/listDonorsByCampaignFactory.ts`
- [ ] `src/app/search/paymentsListSearchParams.ts` (update)
- [ ] `src/app/useCases/paymentMetrics/listPaymentsUseCase.ts` (update)
- [ ] `src/infra/controllers/paymentMetrics/listPaymentsController.ts` (update)
- [ ] `src/main/routes/route.campaign.paymentStatements.tsx` (update)
- [ ] `src/client/pages/paymentStatements/components/filterDrawer/index.tsx` (update)
