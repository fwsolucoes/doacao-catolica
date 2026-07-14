# Disable Recurrence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portar o use case `disableRecurrence` do projeto legado para o projeto atual, adicionando o case `"disableRecurrence"` à action de `route.campaign.donors.tsx`.

**Architecture:** Segue o mesmo padrão clean architecture já adotado no projeto (Schema → Domain Gateway Interface → Infra Gateway → UseCase → Controller → Factory → Route). O `SubscriptionGateway` existente é estendido com um método `disableSubscription`, evitando um novo gateway.

**Tech Stack:** React Router v7 (SSR), TypeScript, Zod, `donationApi` (autenticado via `api-key`).

## Global Constraints

- Nunca usar `<button>` nativo — sempre `<Button>` do design system (não se aplica a este plano, sem UI)
- Usar named imports do React (`useState`, etc.), nunca `import * as React`
- `donationApi` autentica via `api-key` no header — controllers não precisam verificar `AuthService` para a chamada em si, mas devem verificar para identificar `user.email`
- Não incluir passos de commit — o usuário revisa e commita manualmente via IDE
- Não criar arquivos de documentação ou README além do necessário

---

## Mapa de arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `src/infra/schemas/internal/recurrence.ts` | Modificar | Adicionar `disableRecurrenceSchema` e tipo inferido |
| `src/domain/gateways/subscription.ts` | Modificar | Adicionar `DisableSubscriptionInput` e `disableSubscription` à interface |
| `src/infra/gateways/subscription.ts` | Modificar | Implementar `disableSubscription` (POST `/api/subscriptions/disable/{uuid}`) |
| `src/app/useCases/disableRecurrence/disableRecurrenceUseCase.ts` | Criar | Lógica de negócio — recebe input tipado, delega ao gateway |
| `src/infra/controllers/disableRecurrence/disableRecurrenceController.ts` | Criar | Auth, decode, validação Zod, montagem do input para o UseCase |
| `src/main/factories/disableRecurrence/disableRecurrenceFactory.ts` | Criar | Instancia dependências (Gateway → UseCase → Controller) |
| `src/main/routes/route.campaign.donors.tsx` | Modificar | Adicionar `case "disableRecurrence":` e import da factory |

---

### Task 1: Schema Zod + interface do gateway de domínio

**Files:**
- Modify: `src/infra/schemas/internal/recurrence.ts`
- Modify: `src/domain/gateways/subscription.ts`

**Interfaces:**
- Produces: `disableRecurrenceSchema`, `DisableRecurrenceType`, `DisableSubscriptionInput`, `SubscriptionGatewayDTO` atualizado

---

- [ ] **Step 1: Adicionar `disableRecurrenceSchema` ao arquivo de schemas internos**

Em `src/infra/schemas/internal/recurrence.ts`, adicionar logo após a linha `import z from "zod";` o tipo inferido, e no final do arquivo o schema e sua exportação:

Substituir o início do arquivo (linhas 1–3) por:

```ts
import z from "zod";
type CreateRecurrenceType = z.infer<typeof createRecurrenceSchema>;
type DisableRecurrenceType = z.infer<typeof disableRecurrenceSchema>;
type UpdateRecurrenceType = z.infer<typeof updateRecurrenceSchema>;
```

Adicionar o schema antes do bloco `export`:

```ts
const disableRecurrenceSchema = z.object({
  subscriptionUuid: z.string().uuid("UUID inválido"),
  observation: z.string().min(1, "A observação é obrigatória"),
  perpetuatePaymentsChange: z
    .string()
    .optional()
    .transform((v) => v === "checked"),
  perpetuateNextPaymentsChange: z
    .string()
    .optional()
    .transform((v) => v === "checked"),
});
```

Atualizar o bloco `export` para incluir os novos itens:

```ts
export {
  createRecurrenceSchema,
  type CreateRecurrenceType,
  disableRecurrenceSchema,
  type DisableRecurrenceType,
  updateRecurrenceSchema,
  type UpdateRecurrenceType,
};
```

---

- [ ] **Step 2: Adicionar `DisableSubscriptionInput` e `disableSubscription` à interface de domínio**

Em `src/domain/gateways/subscription.ts`, adicionar após `UpdateSubscriptionInput`:

```ts
type DisableSubscriptionInput = {
  subscriptionUuid: string;
  observation: string;
  perpetuatePaymentsChange: boolean;
  perpetuateNextPaymentsChange: boolean;
  origin: string;
};
```

Atualizar `SubscriptionGatewayDTO` para incluir o novo método:

```ts
type SubscriptionGatewayDTO = {
  createSubscription(input: CreateSubscriptionInput): Promise<string>;
  updateSubscription(input: UpdateSubscriptionInput): Promise<void>;
  disableSubscription(input: DisableSubscriptionInput): Promise<void>;
};
```

Atualizar o bloco `export type` para incluir `DisableSubscriptionInput`:

```ts
export type {
  SubscriptionGatewayDTO,
  CreateSubscriptionInput,
  DisableSubscriptionInput,
  UpdateSubscriptionInput,
};
```

---

### Task 2: Implementação no gateway de infraestrutura + UseCase

**Files:**
- Modify: `src/infra/gateways/subscription.ts`
- Create: `src/app/useCases/disableRecurrence/disableRecurrenceUseCase.ts`

**Interfaces:**
- Consumes: `DisableSubscriptionInput` de `~/domain/gateways/subscription` (Task 1)
- Produces: `class DisableRecurrenceUseCase` com `execute(input: DisableRecurrenceInput): Promise<void>`

---

- [ ] **Step 3: Implementar `disableSubscription` no `SubscriptionGateway`**

Em `src/infra/gateways/subscription.ts`, atualizar o import do domain gateway para incluir `DisableSubscriptionInput`:

```ts
import type {
  CreateSubscriptionInput,
  DisableSubscriptionInput,
  SubscriptionGatewayDTO,
  UpdateSubscriptionInput,
} from "~/domain/gateways/subscription";
```

Adicionar o método `disableSubscription` dentro da classe `SubscriptionGateway`, após `updateSubscription`:

```ts
async disableSubscription(input: DisableSubscriptionInput): Promise<void> {
  const headers = { "api-key": environmentVariables.API_KEY_DONATION };
  const url = `/api/subscriptions/disable/${input.subscriptionUuid}`;

  const body = {
    obs: input.observation,
    perpetuate_payments_change: input.perpetuatePaymentsChange,
    perpetuate_next_payments_change: input.perpetuateNextPaymentsChange,
    origin: input.origin,
  };

  const apiResponse = await donationApi.post(url, { body, headers });
  if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
}
```

---

- [ ] **Step 4: Criar o UseCase**

Criar `src/app/useCases/disableRecurrence/disableRecurrenceUseCase.ts` com o conteúdo:

```ts
import type { SubscriptionGatewayDTO } from "~/domain/gateways/subscription";

type DisableRecurrenceInput = {
  subscriptionUuid: string;
  observation: string;
  perpetuatePaymentsChange: boolean;
  perpetuateNextPaymentsChange: boolean;
  origin: string;
};

class DisableRecurrenceUseCase {
  constructor(private subscriptionGateway: SubscriptionGatewayDTO) {}

  async execute(input: DisableRecurrenceInput): Promise<void> {
    await this.subscriptionGateway.disableSubscription({
      subscriptionUuid: input.subscriptionUuid,
      observation: input.observation,
      perpetuatePaymentsChange: input.perpetuatePaymentsChange,
      perpetuateNextPaymentsChange: input.perpetuateNextPaymentsChange,
      origin: input.origin,
    });
  }
}

export { DisableRecurrenceUseCase, type DisableRecurrenceInput };
```

---

### Task 3: Controller

**Files:**
- Create: `src/infra/controllers/disableRecurrence/disableRecurrenceController.ts`

**Interfaces:**
- Consumes: `DisableRecurrenceUseCase` (Task 2), `disableRecurrenceSchema` (Task 1)
- Produces: `class DisableRecurrenceController` com `handle(route: RouteDTO): Promise<void>`

---

- [ ] **Step 5: Criar o Controller**

Criar `src/infra/controllers/disableRecurrence/disableRecurrenceController.ts` com o conteúdo:

```ts
import type { DisableRecurrenceUseCase } from "~/app/useCases/disableRecurrence/disableRecurrenceUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { disableRecurrenceSchema } from "~/infra/schemas/internal/recurrence";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class DisableRecurrenceController {
  constructor(private disableRecurrenceUseCase: DisableRecurrenceUseCase) {}

  async handle(route: RouteDTO): Promise<void> {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const schemaValidator = new SchemaValidatorAdapter(disableRecurrenceSchema);
    const validatedBody = schemaValidator.validate(body);

    await this.disableRecurrenceUseCase.execute({
      subscriptionUuid: validatedBody.subscriptionUuid,
      observation: validatedBody.observation,
      perpetuatePaymentsChange: validatedBody.perpetuatePaymentsChange,
      perpetuateNextPaymentsChange: validatedBody.perpetuateNextPaymentsChange,
      origin: user.email,
    });
  }
}

export { DisableRecurrenceController };
```

---

### Task 4: Factory + wiring na rota

**Files:**
- Create: `src/main/factories/disableRecurrence/disableRecurrenceFactory.ts`
- Modify: `src/main/routes/route.campaign.donors.tsx`

**Interfaces:**
- Consumes: `DisableRecurrenceController` (Task 3), `DisableRecurrenceUseCase` (Task 2), `SubscriptionGateway` existente
- Produces: objeto `disableRecurrence` com `handle` exportado; case `"disableRecurrence"` no switch da action

---

- [ ] **Step 6: Criar a Factory**

Criar `src/main/factories/disableRecurrence/disableRecurrenceFactory.ts` com o conteúdo:

```ts
import { DisableRecurrenceUseCase } from "~/app/useCases/disableRecurrence/disableRecurrenceUseCase";
import { DisableRecurrenceController } from "~/infra/controllers/disableRecurrence/disableRecurrenceController";
import { SubscriptionGateway } from "~/infra/gateways/subscription";

const subscriptionGateway = new SubscriptionGateway();
const disableRecurrenceUseCase = new DisableRecurrenceUseCase(subscriptionGateway);
const disableRecurrenceController = new DisableRecurrenceController(disableRecurrenceUseCase);

const disableRecurrence = {
  handle: disableRecurrenceController.handle.bind(disableRecurrenceController),
};

export { disableRecurrence };
```

---

- [ ] **Step 7: Adicionar o import e o case na rota**

Em `src/main/routes/route.campaign.donors.tsx`, adicionar o import da nova factory após os imports existentes das factories:

```ts
import { disableRecurrence } from "../factories/disableRecurrence/disableRecurrenceFactory";
```

Adicionar o case no switch da `action`, após o case `"generatePaymentBooklet"`:

```ts
case "disableRecurrence":
  await disableRecurrence.handle(adaptedRoute);
  return {
    toast: {
      message: "Recorrência cancelada com sucesso!",
      type: "success" as const,
    },
  };
```
