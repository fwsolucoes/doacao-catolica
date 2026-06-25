# Design: Listagem de Doadores

**Data:** 2026-06-25  
**Feature:** Factory para listar doadores via `DonorGateway`

---

## Contexto

O projeto já possui um `DonorGateway` com apenas `createDonor`. O objetivo é expandir esse gateway para suportar também a listagem de doadores via endpoint `/donators/find-all/{projectId}/{accountId}`, mantendo a arquitetura clean existente.

---

## API Externa

**Endpoint:** `GET /donators/find-all/{projectId}/{accountId}`  
**Query params:** `search` (texto livre), `page`, `pagesize`  
**Autenticação:** token do usuário via `api` (mesmo padrão do `createDonor`)

**Resposta:**
```json
{
  "success": true,
  "response": {
    "data": [...],
    "meta": {
      "currentPage": 1,
      "itemsPerPage": 20,
      "totalItems": 14,
      "totalPages": 1
    }
  }
}
```

Cada item de `data` contém o doador com contact aninhado.

---

## Arquivos

### Novos

| Arquivo | Responsabilidade |
|---|---|
| `src/domain/entities/donor.ts` | Entidade `Donor` com `restore()` e `toJson()` |
| `src/infra/schemas/external/donor.ts` | Schema zod para validar resposta da API |
| `src/app/search/donorSearchParams.ts` | `DonorSearchParams` com filtro `search` |
| `src/app/useCases/donor/listDonorsUseCase.ts` | Orquestra gateway + searchParams |
| `src/infra/controllers/donor/listDonorsController.ts` | Extrai params, verifica auth, chama use case |
| `src/main/factories/donor/listDonorsFactory.ts` | Instancia gateway → use case → controller |

### Modificados

| Arquivo | Mudança |
|---|---|
| `src/domain/gateways/donor.ts` | Adiciona `listDonors` ao `DonorGatewayDTO` e tipos necessários |
| `src/infra/gateways/donor.ts` | Implementa `listDonors` na classe `DonorGateway` |

---

## Entidade `Donor`

Campos e mapeamento da resposta API:

| Campo | Tipo | Origem na API |
|---|---|---|
| `id` | `string` | `data[].id` |
| `contactId` | `string` | `data[].contact_id` |
| `name` | `string` | `data[].contact.name` |
| `email` | `string \| null` | `data[].contact.contact_info.email` |
| `cpf` | `string \| null` | `data[].contact.cpf` |
| `birthDate` | `string \| null` | `data[].contact.birth_date` |
| `phone` | `string \| null` | `data[].contact.contact_info.phone` |
| `whatsapp` | `string \| null` | `data[].contact.contact_info.whatsapp` |
| `donorType` | `string` | `data[].is_recurrent` → `"Recorrente"` / `"Pontual"` |
| `createdAt` | `string` | `data[].created_at` |

Padrão: construtor privado, factory method `Donor.restore(props)`, método `toJson()`.

---

## Schema Externo (`donor.ts`)

Schema zod que valida a resposta da API:

- `externalDonorItemSchema` — valida cada item do array `data`
- `externalDonorsListSchema` — valida o objeto com `data[]` + `meta`

Campos `email`, `cpf`, `birth_date`, `phone`, `whatsapp` são `.nullable()`.

---

## SearchParams

```ts
type Filter = { search?: string };
class DonorSearchParams extends SearchParams<Filter> {}
```

`page` e `pagesize` são gerenciados pela classe base. O `toExternal()` é chamado sem exclusões (todos os params são enviados à API).

---

## Gateway Interface (domain)

Seguindo a regra do CLAUDE.md, parâmetros separados (não agrupados em objeto genérico):

```ts
type DonorGatewayDTO = {
  createDonor(input: CreateDonorInput): Promise<string>;
  listDonors(
    projectId: string,
    accountId: number,
    searchParams: DonorSearchParams,
    token: string,
  ): Promise<SearchResult<Donor>>;
};
```

---

## Gateway Implementação (infra)

`DonorGateway` ganha o método `listDonors`:

1. Monta URL: `/donators/find-all/${projectId}/${accountId}`
2. Adiciona query string via `searchParams.toExternal([])`
3. Chama `api.get(url, { token })`
4. Valida resposta com `SchemaValidatorAdapter(externalDonorsListSchema)`
5. Mapeia `response.data` → `Donor.restore(...)` → retorna `SearchResult<Donor>`

Paginação mapeada de `meta.currentPage` → `page`, `meta.itemsPerPage` → `pageLimit`, `meta.totalItems` → `totalItems`.

---

## UseCase

```ts
type InputProps = {
  projectId: string;
  accountId: number;
  page?: number | null;
  search?: string;
  token: string;
};
```

Monta `DonorSearchParams` com `page` e filtro `search`, chama `gateway.listDonors(...)`, retorna `.toJson()`.

---

## Controller

1. `AuthService.getAuthStorage(route)` — lança `unauthorized` se não autenticado
2. Extrai `projectId` e `accountId` de `route.params` — lança `badRequest` se ausentes
3. Extrai `page` e `search` de `route.query`
4. Chama `listDonorsUseCase.execute(...)`

---

## Factory

```ts
const donorGateway = new DonorGateway();
const listDonorsUseCase = new ListDonorsUseCase(donorGateway);
const listDonorsController = new ListDonorsController(listDonorsUseCase);

const listDonors = {
  handle: listDonorsController.handle.bind(listDonorsController),
};

export { listDonors };
```

---

## Checklist de implementação

- [ ] `src/domain/entities/donor.ts`
- [ ] `src/infra/schemas/external/donor.ts`
- [ ] `src/app/search/donorSearchParams.ts`
- [ ] `src/domain/gateways/donor.ts` (update)
- [ ] `src/infra/gateways/donor.ts` (update)
- [ ] `src/app/useCases/donor/listDonorsUseCase.ts`
- [ ] `src/infra/controllers/donor/listDonorsController.ts`
- [ ] `src/main/factories/donor/listDonorsFactory.ts`
