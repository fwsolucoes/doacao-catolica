# listContacts: filter[account_id] obrigatório — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Garantir que toda chamada à rota `/contact/find-many` envie `filter[account_id]` derivado do `accountId` da campanha atual, buscando a campanha via `campaignGateway` dentro do `ListContactsUseCase`.

**Architecture:** O use case recebe `campaignId` do controller (via `route.params`), chama `campaignGateway.getCampaign()` para obter `accountId`, constrói `ContactsSearchParams` com esse valor e delega ao gateway. O gateway mapeia `filter.accountId` → chave `"filter[account_id]"` na URL usando `URLSearchParams` manual — sem usar `toExternal()`.

**Tech Stack:** TypeScript, React Router v7 SSR, Zod, clean architecture em camadas (SearchParams → Gateway → UseCase → Controller → Factory → Route).

---

## Mapa de arquivos

| Arquivo | Operação | Responsabilidade da mudança |
|---|---|---|
| `src/app/search/contactsSearchParams.ts` | Modificar | Adicionar `status` e `accountId` ao tipo `Filter` |
| `src/infra/schemas/internal/contacts.ts` | Modificar | Remover `accountId` do schema interno (não é mais input válido) |
| `src/app/useCases/contacts/listContactsUseCase.ts` | Modificar | Receber `campaignId`, buscar campanha e injetar `accountId` no filter |
| `src/infra/controllers/contacts/listContactsController.ts` | Modificar | Extrair `campaignId` de `route.params` e passá-lo ao use case |
| `src/infra/gateways/contacts.ts` | Modificar | Substituir `toExternal()` por `URLSearchParams` manual mapeando `accountId` → `filter[account_id]` |

---

### Task 1: Atualizar ContactsSearchParams

**Files:**
- Modify: `src/app/search/contactsSearchParams.ts`

- [ ] **Step 1: Substituir o conteúdo do arquivo**

```ts
// src/app/search/contactsSearchParams.ts
import { SearchParams } from "../shared/searchParams";

type Filter = { name?: string; status?: string; accountId?: string };

class ContactsSearchParams extends SearchParams<Filter> {}

export { ContactsSearchParams };
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npm run typecheck
```

Esperado: sem erros relacionados a `contactsSearchParams`.

- [ ] **Step 3: Commit**

```bash
git add src/app/search/contactsSearchParams.ts
git commit -m "feat(contacts): add status and accountId to ContactsSearchParams filter"
```

---

### Task 2: Remover accountId do schema interno

**Files:**
- Modify: `src/infra/schemas/internal/contacts.ts`

- [ ] **Step 1: Remover o campo `accountId` do schema**

```ts
// src/infra/schemas/internal/contacts.ts
import { z } from "zod";
import { paginationSchema } from "./pagination";

const listContactsSchema = paginationSchema.extend({
  name: z.string().optional(),
  status: z.string().optional(),
});

export { listContactsSchema };
```

> `accountId` é removido porque não é mais um input válido da requisição — o valor sempre vem da campanha, nunca do cliente.

- [ ] **Step 2: Verificar TypeScript**

```bash
npm run typecheck
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/infra/schemas/internal/contacts.ts
git commit -m "feat(contacts): remove accountId from internal schema (derived from campaign)"
```

---

### Task 3: Atualizar use case e controller juntos

> Estes dois arquivos devem ser alterados no mesmo commit porque a mudança em `InputProps` no use case quebra o controller até que ele seja atualizado.

**Files:**
- Modify: `src/app/useCases/contacts/listContactsUseCase.ts`
- Modify: `src/infra/controllers/contacts/listContactsController.ts`

- [ ] **Step 1: Reescrever o use case**

```ts
// src/app/useCases/contacts/listContactsUseCase.ts
import { ContactsSearchParams } from "~/app/search/contactsSearchParams";
import type {
  ContactOption,
  ContactsGatewayDTO,
} from "~/domain/gateways/contacts";

import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  campaignId: string;
  filter: { name?: string; status?: string };
};

class ListContactsUseCase {
  constructor(
    private contactsGateway: ContactsGatewayDTO,
    private campaignGateway: CampaignGatewayDTO,
  ) {}

  async execute(input: InputProps, token: string): Promise<ContactOption[]> {
    const { campaignId, filter } = input;
    const campaign = await this.campaignGateway.getCampaign(campaignId, token);
    const searchParams = new ContactsSearchParams({
      filter: { ...filter, accountId: String(campaign.accountId) },
    });
    return this.contactsGateway.listContacts(searchParams, token);
  }
}

export { ListContactsUseCase };
```

- [ ] **Step 2: Reescrever o controller**

```ts
// src/infra/controllers/contacts/listContactsController.ts
import { SearchParamsMapper } from "~/app/shared/searchParamsMapper";
import type { ListContactsUseCase } from "~/app/useCases/contacts/listContactsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { listContactsSchema } from "~/infra/schemas/internal/contacts";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListContactsController {
  constructor(private listContactsUseCase: ListContactsUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const searchParams = SearchParamsMapper.toObject({
      query: route.query,
      params: route.params,
      scoped: "contacts",
    });

    const schemaValidator = new SchemaValidatorAdapter(listContactsSchema);
    const validatedParams = schemaValidator.validate(searchParams);
    const mappedFilter = SearchParamsMapper.toFilter(validatedParams);

    return await this.listContactsUseCase.execute(
      { campaignId, filter: mappedFilter.filter },
      user.token,
    );
  }
}

export { ListContactsController };
```

- [ ] **Step 3: Verificar TypeScript**

```bash
npm run typecheck
```

Esperado: sem erros. TypeScript deve aceitar `campaignId: string` no `InputProps` e `mappedFilter.filter` como `{ name?: string; status?: string }`.

- [ ] **Step 4: Commit**

```bash
git add src/app/useCases/contacts/listContactsUseCase.ts src/infra/controllers/contacts/listContactsController.ts
git commit -m "feat(contacts): derive accountId from campaign in ListContactsUseCase"
```

---

### Task 4: Atualizar gateway para usar filter[account_id]

**Files:**
- Modify: `src/infra/gateways/contacts.ts`

- [ ] **Step 1: Substituir a construção da URL por URLSearchParams manual**

```ts
// src/infra/gateways/contacts.ts
import type { ContactsSearchParams } from "~/app/search/contactsSearchParams";
import type {
  ContactOption,
  ContactsGatewayDTO,
} from "~/domain/gateways/contacts";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { listContactsSchema } from "../schemas/external/contacts";

class ContactsGateway implements ContactsGatewayDTO {
  async listContacts(
    searchParams: ContactsSearchParams,
    token: string,
  ): Promise<ContactOption[]> {
    const params = new URLSearchParams();
    const filter = searchParams.filter;
    if (filter?.name) params.set("name", filter.name);
    if (filter?.accountId) params.set("filter[account_id]", filter.accountId);

    const url = `/contact/find-many?${params.toString()}`;

    console.log("URL de busca de contatos:", url);

    const apiResponse = await api.get(url, { token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(listContactsSchema);
    const data = schemaValidator.validate(apiResponse.response);

    return data.items.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.contactInfo?.email ?? undefined,
      phone: item.contactInfo?.phone ?? undefined,
      cpf: item.cpf ?? undefined,
      birthDate: item.birth_date ?? undefined,
    }));
  }
}

export { ContactsGateway };
```

> `toExternal(["page", "pageLimit"])` é substituído por `URLSearchParams` manual. Isso permite mapear `accountId` → `"filter[account_id]"`, que é o formato exigido pela API externa. Novos filtros devem ser adicionados manualmente aqui.

- [ ] **Step 2: Verificar TypeScript**

```bash
npm run typecheck
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/infra/gateways/contacts.ts
git commit -m "feat(contacts): map accountId to filter[account_id] in ContactsGateway"
```
