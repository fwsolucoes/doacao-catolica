# List Donors Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a stack completa (entidade, schema, searchParams, gateway, useCase, controller, factory) para listar doadores via `GET /donators/find-all/{projectId}/{accountId}`.

**Architecture:** Segue o padrão clean architecture do projeto: `ExternalSchema → GatewayInterface → Gateway → UseCase → Controller → Factory`. O método `listDonors` é adicionado ao `DonorGateway` existente, tornando-o o único ponto de acesso a operações de doadores. Autenticação via token do usuário usando `api`.

**Tech Stack:** TypeScript, React Router v7 (SSR), Zod (validação de schema externo), arquitetura clean com camadas domain/app/infra/main.

## Global Constraints

- Usar `api` (não `donationApi`) para autenticar com token do usuário
- Parâmetros de gateway separados (não agrupados em objeto genérico), exceto `createDonor` que mantém seu padrão atual com `CreateDonorInput`
- `email` vazio (`""`) deve ser convertido para `null` no mapeamento do gateway
- `donorType` derivado de `is_recurrent`: `true` → `"Recorrente"`, `false` → `"Pontual"`
- `accountId` chega como `string` em `route.params` e deve ser convertido com `Number()`
- Verificar tipos com `npm run typecheck` ao final de cada task

---

### Task 1: Entidade `Donor`

**Files:**
- Create: `src/domain/entities/donor.ts`

**Interfaces:**
- Consumes: nada
- Produces: classe `Donor` com `Donor.restore(props)` e `donor.toJson()`, tipo `DonorProps`

- [ ] **Step 1: Criar a entidade**

```ts
// src/domain/entities/donor.ts
type DonorProps = {
  id: string;
  contactId: string;
  name: string;
  email: string | null;
  cpf: string | null;
  birthDate: string | null;
  phone: string | null;
  whatsapp: string | null;
  donorType: string;
  createdAt: string;
};

class Donor {
  readonly id: string;
  readonly contactId: string;
  readonly name: string;
  readonly email: string | null;
  readonly cpf: string | null;
  readonly birthDate: string | null;
  readonly phone: string | null;
  readonly whatsapp: string | null;
  readonly donorType: string;
  readonly createdAt: string;

  private constructor(props: DonorProps) {
    this.id = props.id;
    this.contactId = props.contactId;
    this.name = props.name;
    this.email = props.email;
    this.cpf = props.cpf;
    this.birthDate = props.birthDate;
    this.phone = props.phone;
    this.whatsapp = props.whatsapp;
    this.donorType = props.donorType;
    this.createdAt = props.createdAt;
  }

  static restore(props: DonorProps): Donor {
    return new Donor(props);
  }

  toJson() {
    return {
      id: this.id,
      contactId: this.contactId,
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      birthDate: this.birthDate,
      phone: this.phone,
      whatsapp: this.whatsapp,
      donorType: this.donorType,
      createdAt: this.createdAt,
    };
  }
}

export { Donor };
export type { DonorProps };
```

- [ ] **Step 2: Verificar tipos**

```bash
npm run typecheck
```

Esperado: sem erros relacionados a `donor.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/domain/entities/donor.ts
git commit -m "feat(donor): add Donor entity"
```

---

### Task 2: Schema externo e SearchParams

**Files:**
- Create: `src/infra/schemas/external/donor.ts`
- Create: `src/app/search/donorSearchParams.ts`

**Interfaces:**
- Consumes: nada
- Produces:
  - `externalDonorsListSchema` (zod) — valida `apiResponse.response`
  - `ExternalDonorItem` — tipo inferido do schema de item
  - `DonorSearchParams` — classe com filtro `{ search?: string }`

- [ ] **Step 1: Criar o schema externo**

```ts
// src/infra/schemas/external/donor.ts
import { z } from "zod";

const externalDonorContactInfoSchema = z.object({
  phone: z.string().nullable(),
  whatsapp: z.string().nullable(),
  email: z.string().nullable(),
});

const externalDonorContactSchema = z.object({
  name: z.string(),
  cpf: z.string().nullable(),
  birth_date: z.string().nullable(),
  contact_info: externalDonorContactInfoSchema,
});

const externalDonorItemSchema = z.object({
  id: z.string(),
  contact_id: z.string(),
  is_recurrent: z.boolean(),
  created_at: z.string(),
  contact: externalDonorContactSchema,
});

const externalDonorsListSchema = z.object({
  data: z.array(externalDonorItemSchema),
  meta: z.object({
    currentPage: z.number(),
    itemsPerPage: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
  }),
});

type ExternalDonorItem = z.infer<typeof externalDonorItemSchema>;

export { externalDonorsListSchema, type ExternalDonorItem };
```

- [ ] **Step 2: Criar o SearchParams**

```ts
// src/app/search/donorSearchParams.ts
import { SearchParams } from "../shared/searchParams";

type Filter = { search?: string };

class DonorSearchParams extends SearchParams<Filter> {}

export { DonorSearchParams };
```

- [ ] **Step 3: Verificar tipos**

```bash
npm run typecheck
```

Esperado: sem erros relacionados aos novos arquivos.

- [ ] **Step 4: Commit**

```bash
git add src/infra/schemas/external/donor.ts src/app/search/donorSearchParams.ts
git commit -m "feat(donor): add external schema and SearchParams"
```

---

### Task 3: Atualizar interface e implementação do gateway

**Files:**
- Modify: `src/domain/gateways/donor.ts`
- Modify: `src/infra/gateways/donor.ts`

**Interfaces:**
- Consumes:
  - `Donor` de `~/domain/entities/donor`
  - `DonorSearchParams` de `~/app/search/donorSearchParams`
  - `SearchResult` de `~/app/shared/searchResult`
  - `externalDonorsListSchema` de `~/infra/schemas/external/donor`
- Produces:
  - `DonorGatewayDTO` com `createDonor(input: CreateDonorInput): Promise<string>` e `listDonors(projectId: string, accountId: number, searchParams: DonorSearchParams, token: string): Promise<SearchResult<Donor>>`
  - `DonorGateway` implementando `DonorGatewayDTO`

- [ ] **Step 1: Atualizar a interface de gateway no domain**

Substituir o conteúdo de `src/domain/gateways/donor.ts`:

```ts
// src/domain/gateways/donor.ts
import type { DonorSearchParams } from "~/app/search/donorSearchParams";
import type { SearchResult } from "~/app/shared/searchResult";
import type { Donor } from "../entities/donor";

type CreateDonorInput = {
  accountId: number;
  name: string;
  cpf?: string;
  birthDate?: string;
  email?: string;
  phone?: string;
  projectId: string;
  token: string;
};

type DonorGatewayDTO = {
  createDonor(input: CreateDonorInput): Promise<string>;
  listDonors(
    projectId: string,
    accountId: number,
    searchParams: DonorSearchParams,
    token: string,
  ): Promise<SearchResult<Donor>>;
};

export type { DonorGatewayDTO, CreateDonorInput };
```

- [ ] **Step 2: Implementar `listDonors` no gateway**

Substituir o conteúdo de `src/infra/gateways/donor.ts`:

```ts
// src/infra/gateways/donor.ts
import type { DonorSearchParams } from "~/app/search/donorSearchParams";
import { SearchResult } from "~/app/shared/searchResult";
import { Donor } from "~/domain/entities/donor";
import type { CreateDonorInput, DonorGatewayDTO } from "~/domain/gateways/donor";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { createDonorResponseSchema } from "../schemas/external/createDonor";
import { externalDonorsListSchema } from "../schemas/external/donor";

class DonorGateway implements DonorGatewayDTO {
  async createDonor(input: CreateDonorInput): Promise<string> {
    const birthDate = input.birthDate
      ? new Date(input.birthDate).toISOString()
      : null;

    const apiResponse = await api.post("/create-donator-contact", {
      body: {
        contactData: {
          account_id: input.accountId,
          name: input.name,
          cpf: input.cpf ?? null,
          birth_date: birthDate,
          contactInfo: {
            email: input.email,
            phone: input.phone,
          },
        },
        customForms: [],
        project_id: input.projectId,
      },
      token: input.token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(createDonorResponseSchema);
    const data = schemaValidator.validate(apiResponse.response);

    return data.donator.id;
  }

  async listDonors(
    projectId: string,
    accountId: number,
    searchParams: DonorSearchParams,
    token: string,
  ): Promise<SearchResult<Donor>> {
    let url = `/donators/find-all/${projectId}/${accountId}`;
    url += searchParams.toExternal([]);

    const apiResponse = await api.get(url, { token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(externalDonorsListSchema);
    const data = schemaValidator.validate(apiResponse.response);

    return new SearchResult({
      data: data.data.map((item) =>
        Donor.restore({
          id: item.id,
          contactId: item.contact_id,
          name: item.contact.name,
          email: item.contact.contact_info.email || null,
          cpf: item.contact.cpf,
          birthDate: item.contact.birth_date,
          phone: item.contact.contact_info.phone,
          whatsapp: item.contact.contact_info.whatsapp,
          donorType: item.is_recurrent ? "Recorrente" : "Pontual",
          createdAt: item.created_at,
        }),
      ),
      meta: {
        page: data.meta.currentPage,
        pageLimit: data.meta.itemsPerPage,
        totalItems: data.meta.totalItems,
      },
    });
  }
}

export { DonorGateway };
```

- [ ] **Step 3: Verificar tipos**

```bash
npm run typecheck
```

Esperado: sem erros. Se aparecer erro de `SearchResult` não implementar `Entity`, verificar se a importação está correta — `SearchResult` é genérico sobre `Entity`, e `Donor` implementa `toJson()`.

- [ ] **Step 4: Commit**

```bash
git add src/domain/gateways/donor.ts src/infra/gateways/donor.ts
git commit -m "feat(donor): add listDonors to DonorGateway"
```

---

### Task 4: UseCase

**Files:**
- Create: `src/app/useCases/donor/listDonorsUseCase.ts`

**Interfaces:**
- Consumes:
  - `DonorGatewayDTO` de `~/domain/gateways/donor`
  - `DonorSearchParams` de `~/app/search/donorSearchParams`
- Produces:
  - `ListDonorsUseCase` com `execute(input: InputProps): Promise<SearchResult.toJson()>`
  - `InputProps = { projectId: string; accountId: number; page?: number | null; search?: string; token: string }`

- [ ] **Step 1: Criar o use case**

```ts
// src/app/useCases/donor/listDonorsUseCase.ts
import { DonorSearchParams } from "~/app/search/donorSearchParams";
import type { DonorGatewayDTO } from "~/domain/gateways/donor";

type InputProps = {
  projectId: string;
  accountId: number;
  page?: number | null;
  search?: string;
  token: string;
};

class ListDonorsUseCase {
  constructor(private gateway: DonorGatewayDTO) {}

  async execute(input: InputProps) {
    const { projectId, accountId, page, search, token } = input;

    const searchParams = new DonorSearchParams({
      page: page ?? 1,
      filter: { search },
    });

    const result = await this.gateway.listDonors(
      projectId,
      accountId,
      searchParams,
      token,
    );

    return result.toJson();
  }
}

export { ListDonorsUseCase };
```

- [ ] **Step 2: Verificar tipos**

```bash
npm run typecheck
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/app/useCases/donor/listDonorsUseCase.ts
git commit -m "feat(donor): add ListDonorsUseCase"
```

---

### Task 5: Controller

**Files:**
- Create: `src/infra/controllers/donor/listDonorsController.ts`

**Interfaces:**
- Consumes:
  - `ListDonorsUseCase` de `~/app/useCases/donor/listDonorsUseCase`
  - `AuthService` de `~/infra/services/authService`
  - `HttpAdapter` de `~/infra/adapters/httpAdapter`
  - `RouteDTO` de `~/main/types/route` — `params: Record<string, string>`, `query: Record<string, string>`
- Produces:
  - `ListDonorsController` com `handle(route: RouteDTO): Promise<...>`

- [ ] **Step 1: Criar o controller**

```ts
// src/infra/controllers/donor/listDonorsController.ts
import type { ListDonorsUseCase } from "~/app/useCases/donor/listDonorsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListDonorsController {
  constructor(private listDonorsUseCase: ListDonorsUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { projectId, accountId } = route.params;
    if (!projectId) throw HttpAdapter.badRequest("projectId is required");
    if (!accountId) throw HttpAdapter.badRequest("accountId is required");

    const page = route.query.page ? Number(route.query.page) : 1;

    return await this.listDonorsUseCase.execute({
      projectId,
      accountId: Number(accountId),
      page,
      search: route.query.search,
      token: user.token,
    });
  }
}

export { ListDonorsController };
```

- [ ] **Step 2: Verificar tipos**

```bash
npm run typecheck
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/infra/controllers/donor/listDonorsController.ts
git commit -m "feat(donor): add ListDonorsController"
```

---

### Task 6: Factory

**Files:**
- Create: `src/main/factories/donor/listDonorsFactory.ts`

**Interfaces:**
- Consumes:
  - `DonorGateway` de `~/infra/gateways/donor`
  - `ListDonorsUseCase` de `~/app/useCases/donor/listDonorsUseCase`
  - `ListDonorsController` de `~/infra/controllers/donor/listDonorsController`
- Produces:
  - `listDonors` — objeto com `handle` pronto para ser usado em route loaders

- [ ] **Step 1: Criar a factory**

```ts
// src/main/factories/donor/listDonorsFactory.ts
import { ListDonorsUseCase } from "~/app/useCases/donor/listDonorsUseCase";
import { ListDonorsController } from "~/infra/controllers/donor/listDonorsController";
import { DonorGateway } from "~/infra/gateways/donor";

const donorGateway = new DonorGateway();
const listDonorsUseCase = new ListDonorsUseCase(donorGateway);
const listDonorsController = new ListDonorsController(listDonorsUseCase);

const listDonors = {
  handle: listDonorsController.handle.bind(listDonorsController),
};

export { listDonors };
```

- [ ] **Step 2: Verificar tipos finais**

```bash
npm run typecheck
```

Esperado: sem erros em nenhum arquivo.

- [ ] **Step 3: Commit final**

```bash
git add src/main/factories/donor/listDonorsFactory.ts
git commit -m "feat(donor): add listDonors factory"
```

---

## Uso na rota

A factory exporta `listDonors.handle`, que pode ser usado diretamente num loader de rota:

```ts
// exemplo de uso num route loader
import { listDonors } from "~/main/factories/donor/listDonorsFactory";

export async function loader({ request, params }: Route.LoaderArgs) {
  const url = new URL(request.url);
  return await listDonors.handle({
    request,
    params,                              // deve conter projectId e accountId
    query: Object.fromEntries(url.searchParams),
  });
}
```
