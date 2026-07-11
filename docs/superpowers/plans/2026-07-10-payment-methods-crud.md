# Payment Methods CRUD — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar CRUD completo de métodos de pagamento no projeto atual, portando do projeto legado (Remix + @arkyn) para React Router v7 + shadcn/ui, com a rota acessível como sub-menu de "Configurações" no sidebar da campanha.

**Architecture:** Página dedicada em `campaign/:campaignId/settings/payment-methods` com loader (lista) e action único com switch em `_action`. Três Dialogs (criar, editar, excluir) controlados por state local na página, cada um usando `useFetcher` para submissão sem navegação. Segue a stack UseCase → Controller → Factory → Route → Page do projeto.

**Tech Stack:** React Router v7, TypeScript, shadcn/ui (Dialog, Table, Button, Input, FormField, Empty), `donationApi` via `@arkyn/server`'s `ApiService`, zod.

## Global Constraints

- Nunca usar elementos HTML nativos (`<button>`, `<input>`) quando existe componente equivalente em `src/client/components/ui/`
- `donationApi` requer `{ headers: { "api-key": environmentVariables.API_KEY_DONATION } }` em todas as chamadas
- Controllers de endpoints `donationApi` não precisam verificar `AuthService` — auth é feita via api-key
- `campaignId` da rota React Router vai direto para a donation API (sem mapeamento intermediário)
- Named exports em todos os arquivos; nunca `export default` em componentes UI
- Named imports do React (`useState`, `useEffect`, etc.) — nunca `import * as React`
- Todo campo de formulário envolto em `FormField`; `FormErrorProvider` na raiz do form
- Verificação de tipos: `npm run typecheck` (alias para `tsc --noEmit`)

---

### Task 1: External Schema + Domain Entity + Gateway Interface + Mapper

**Files:**
- Create: `src/infra/schemas/external/paymentMethod.ts`
- Create: `src/domain/entities/paymentMethod.ts`
- Create: `src/domain/gateways/paymentMethod.ts`
- Create: `src/infra/mappers/paymentMethod.ts`

**Interfaces:**
- Produces: classe `PaymentMethod` com `restore({ id, name })` e `toJson()` → `{ id: string, name: string }`; tipo `PaymentMethodGatewayDTO` com métodos `list`, `create`, `update`, `delete`; `PaymentMethodMapper.toEntity(ExternalPaymentMethod)` → `PaymentMethod`

- [ ] **Step 1: Criar o schema externo**

```ts
// src/infra/schemas/external/paymentMethod.ts
import { z } from "zod";

type ExternalPaymentMethod = z.infer<typeof externalPaymentMethodSchema>;

const externalPaymentMethodSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
});

const externalPaymentMethodsSchema = z.object({
  data: z.array(externalPaymentMethodSchema),
});

export {
  externalPaymentMethodSchema,
  externalPaymentMethodsSchema,
  type ExternalPaymentMethod,
};
```

- [ ] **Step 2: Criar a entidade**

```ts
// src/domain/entities/paymentMethod.ts
type PaymentMethodProps = {
  id: string;
  name: string;
};

class PaymentMethod {
  id: string;
  name: string;

  private constructor(props: PaymentMethodProps) {
    this.id = props.id;
    this.name = props.name;
  }

  static restore(props: PaymentMethodProps): PaymentMethod {
    return new PaymentMethod(props);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

export { PaymentMethod };
```

- [ ] **Step 3: Criar a interface do gateway**

```ts
// src/domain/gateways/paymentMethod.ts
import type { PaymentMethod } from "../entities/paymentMethod";

type PaymentMethodGatewayDTO = {
  list(campaignId: string): Promise<PaymentMethod[]>;
  create(name: string, campaignId: string): Promise<void>;
  update(id: string, name: string, campaignId: string): Promise<void>;
  delete(id: string, campaignId: string): Promise<void>;
};

export type { PaymentMethodGatewayDTO };
```

- [ ] **Step 4: Criar o mapper**

```ts
// src/infra/mappers/paymentMethod.ts
import { PaymentMethod } from "~/domain/entities/paymentMethod";
import type { ExternalPaymentMethod } from "../schemas/external/paymentMethod";

class PaymentMethodMapper {
  static toEntity(external: ExternalPaymentMethod): PaymentMethod {
    return PaymentMethod.restore({
      id: external.uuid,
      name: external.name,
    });
  }
}

export { PaymentMethodMapper };
```

- [ ] **Step 5: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

Esperado: sem erros nos 4 arquivos criados.

---

### Task 2: Gateway Implementation

**Files:**
- Create: `src/infra/gateways/paymentMethod.ts`

**Interfaces:**
- Consumes: `PaymentMethodGatewayDTO` (Task 1); `donationApi` de `~/infra/http/donationApi`; `environmentVariables` de `~/main/config/environmentVariables`; `PaymentMethodMapper` (Task 1); `externalPaymentMethodsSchema` (Task 1)
- Produces: classe `PaymentMethodGateway implements PaymentMethodGatewayDTO` com os 4 métodos CRUD

- [ ] **Step 1: Criar o gateway**

```ts
// src/infra/gateways/paymentMethod.ts
import type { PaymentMethod } from "~/domain/entities/paymentMethod";
import type { PaymentMethodGatewayDTO } from "~/domain/gateways/paymentMethod";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { PaymentMethodMapper } from "../mappers/paymentMethod";
import { externalPaymentMethodsSchema } from "../schemas/external/paymentMethod";

class PaymentMethodGateway implements PaymentMethodGatewayDTO {
  private get headers() {
    return { "api-key": environmentVariables.API_KEY_DONATION };
  }

  async list(campaignId: string): Promise<PaymentMethod[]> {
    const apiResponse = await donationApi.get(
      `/api/payment-methods/${campaignId}`,
      { headers: this.headers },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const validator = new SchemaValidatorAdapter(externalPaymentMethodsSchema);
    const data = validator.validate(apiResponse.response);

    return data.data.map(PaymentMethodMapper.toEntity);
  }

  async create(name: string, campaignId: string): Promise<void> {
    const apiResponse = await donationApi.post("/api/payment-methods", {
      body: { name, account_reference: campaignId },
      headers: this.headers,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async update(id: string, name: string, campaignId: string): Promise<void> {
    const apiResponse = await donationApi.put(
      `/api/payment-methods/${campaignId}/${id}`,
      { body: { name }, headers: this.headers },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async delete(id: string, campaignId: string): Promise<void> {
    const apiResponse = await donationApi.delete(
      `/api/payment-methods/${campaignId}/${id}`,
      { headers: this.headers },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { PaymentMethodGateway };
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

Esperado: sem erros.

---

### Task 3: Use Cases + Internal Schemas

**Files:**
- Create: `src/infra/schemas/internal/paymentMethod.ts`
- Create: `src/app/useCases/paymentMethod/listPaymentMethodsUseCase.ts`
- Create: `src/app/useCases/paymentMethod/createPaymentMethodUseCase.ts`
- Create: `src/app/useCases/paymentMethod/updatePaymentMethodUseCase.ts`
- Create: `src/app/useCases/paymentMethod/deletePaymentMethodUseCase.ts`

**Interfaces:**
- Consumes: `PaymentMethodGatewayDTO` (Task 1)
- Produces: `ListPaymentMethodsUseCase`, `CreatePaymentMethodUseCase`, `UpdatePaymentMethodUseCase`, `DeletePaymentMethodUseCase` — todos recebem a gateway no construtor; schemas `createPaymentMethodBodySchema`, `updatePaymentMethodBodySchema`, `deletePaymentMethodBodySchema`

- [ ] **Step 1: Criar os schemas internos de validação de formulário**

```ts
// src/infra/schemas/internal/paymentMethod.ts
import { z } from "zod";

const createPaymentMethodBodySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

const updatePaymentMethodBodySchema = z.object({
  id: z.string().uuid("ID inválido"),
  name: z.string().min(1, "Nome é obrigatório"),
});

const deletePaymentMethodBodySchema = z.object({
  id: z.string().uuid("ID inválido"),
});

type CreatePaymentMethodBody = z.infer<typeof createPaymentMethodBodySchema>;
type UpdatePaymentMethodBody = z.infer<typeof updatePaymentMethodBodySchema>;
type DeletePaymentMethodBody = z.infer<typeof deletePaymentMethodBodySchema>;

export {
  createPaymentMethodBodySchema,
  updatePaymentMethodBodySchema,
  deletePaymentMethodBodySchema,
  type CreatePaymentMethodBody,
  type UpdatePaymentMethodBody,
  type DeletePaymentMethodBody,
};
```

- [ ] **Step 2: Criar os 4 use cases**

```ts
// src/app/useCases/paymentMethod/listPaymentMethodsUseCase.ts
import type { PaymentMethod } from "~/domain/entities/paymentMethod";
import type { PaymentMethodGatewayDTO } from "~/domain/gateways/paymentMethod";

class ListPaymentMethodsUseCase {
  constructor(private gateway: PaymentMethodGatewayDTO) {}

  async execute(campaignId: string): Promise<PaymentMethod[]> {
    return this.gateway.list(campaignId);
  }
}

export { ListPaymentMethodsUseCase };
```

```ts
// src/app/useCases/paymentMethod/createPaymentMethodUseCase.ts
import type { PaymentMethodGatewayDTO } from "~/domain/gateways/paymentMethod";

class CreatePaymentMethodUseCase {
  constructor(private gateway: PaymentMethodGatewayDTO) {}

  async execute(name: string, campaignId: string): Promise<void> {
    await this.gateway.create(name, campaignId);
  }
}

export { CreatePaymentMethodUseCase };
```

```ts
// src/app/useCases/paymentMethod/updatePaymentMethodUseCase.ts
import type { PaymentMethodGatewayDTO } from "~/domain/gateways/paymentMethod";

class UpdatePaymentMethodUseCase {
  constructor(private gateway: PaymentMethodGatewayDTO) {}

  async execute(id: string, name: string, campaignId: string): Promise<void> {
    await this.gateway.update(id, name, campaignId);
  }
}

export { UpdatePaymentMethodUseCase };
```

```ts
// src/app/useCases/paymentMethod/deletePaymentMethodUseCase.ts
import type { PaymentMethodGatewayDTO } from "~/domain/gateways/paymentMethod";

class DeletePaymentMethodUseCase {
  constructor(private gateway: PaymentMethodGatewayDTO) {}

  async execute(id: string, campaignId: string): Promise<void> {
    await this.gateway.delete(id, campaignId);
  }
}

export { DeletePaymentMethodUseCase };
```

- [ ] **Step 3: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

Esperado: sem erros.

---

### Task 4: Controller + Factory

**Files:**
- Create: `src/infra/controllers/paymentMethod/paymentMethodController.ts`
- Create: `src/main/factories/paymentMethod/paymentMethodFactory.ts`

**Interfaces:**
- Consumes: os 4 use cases (Task 3); schemas internos (Task 3); `DecodeRequestBodyAdapter`, `SchemaValidatorAdapter`, `HttpAdapter`; `RouteDTO`
- Produces: `paymentMethodFactory` com métodos `handleLoader(route)` → `{ paymentMethods: {id, name}[] }` e `handleAction(route)` → `{ toast }` ou erro

- [ ] **Step 1: Criar o controller**

```ts
// src/infra/controllers/paymentMethod/paymentMethodController.ts
import type { ListPaymentMethodsUseCase } from "~/app/useCases/paymentMethod/listPaymentMethodsUseCase";
import type { CreatePaymentMethodUseCase } from "~/app/useCases/paymentMethod/createPaymentMethodUseCase";
import type { UpdatePaymentMethodUseCase } from "~/app/useCases/paymentMethod/updatePaymentMethodUseCase";
import type { DeletePaymentMethodUseCase } from "~/app/useCases/paymentMethod/deletePaymentMethodUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import {
  createPaymentMethodBodySchema,
  updatePaymentMethodBodySchema,
  deletePaymentMethodBodySchema,
} from "~/infra/schemas/internal/paymentMethod";
import type { RouteDTO } from "~/main/types/route";

class PaymentMethodController {
  constructor(
    private listUseCase: ListPaymentMethodsUseCase,
    private createUseCase: CreatePaymentMethodUseCase,
    private updateUseCase: UpdatePaymentMethodUseCase,
    private deleteUseCase: DeletePaymentMethodUseCase,
  ) {}

  async handleLoader(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const paymentMethods = await this.listUseCase.execute(campaignId);
    return { paymentMethods: paymentMethods.map((pm) => pm.toJson()) };
  }

  async handleAction(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);

    switch (body._action) {
      case "createPaymentMethod": {
        const validated = new SchemaValidatorAdapter(
          createPaymentMethodBodySchema,
        ).validate(body);
        await this.createUseCase.execute(validated.name, campaignId);
        return {
          toast: { message: "Método de pagamento criado com sucesso!", type: "success" as const },
        };
      }
      case "updatePaymentMethod": {
        const validated = new SchemaValidatorAdapter(
          updatePaymentMethodBodySchema,
        ).validate(body);
        await this.updateUseCase.execute(validated.id, validated.name, campaignId);
        return {
          toast: { message: "Método de pagamento atualizado com sucesso!", type: "success" as const },
        };
      }
      case "deletePaymentMethod": {
        const validated = new SchemaValidatorAdapter(
          deletePaymentMethodBodySchema,
        ).validate(body);
        await this.deleteUseCase.execute(validated.id, campaignId);
        return {
          toast: { message: "Método de pagamento excluído com sucesso!", type: "success" as const },
        };
      }
      default:
        throw HttpAdapter.badRequest("Ação inválida");
    }
  }
}

export { PaymentMethodController };
```

- [ ] **Step 2: Criar a factory**

```ts
// src/main/factories/paymentMethod/paymentMethodFactory.ts
import { ListPaymentMethodsUseCase } from "~/app/useCases/paymentMethod/listPaymentMethodsUseCase";
import { CreatePaymentMethodUseCase } from "~/app/useCases/paymentMethod/createPaymentMethodUseCase";
import { UpdatePaymentMethodUseCase } from "~/app/useCases/paymentMethod/updatePaymentMethodUseCase";
import { DeletePaymentMethodUseCase } from "~/app/useCases/paymentMethod/deletePaymentMethodUseCase";
import { PaymentMethodGateway } from "~/infra/gateways/paymentMethod";
import { PaymentMethodController } from "~/infra/controllers/paymentMethod/paymentMethodController";

const gateway = new PaymentMethodGateway();
const controller = new PaymentMethodController(
  new ListPaymentMethodsUseCase(gateway),
  new CreatePaymentMethodUseCase(gateway),
  new UpdatePaymentMethodUseCase(gateway),
  new DeletePaymentMethodUseCase(gateway),
);

const paymentMethodFactory = {
  handleLoader: controller.handleLoader.bind(controller),
  handleAction: controller.handleAction.bind(controller),
};

export { paymentMethodFactory };
```

- [ ] **Step 3: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

Esperado: sem erros.

---

### Task 5: Route Adapter + Registro em routes.ts

**Files:**
- Create: `src/main/routes/route.campaign.paymentMethods.tsx`
- Modify: `src/routes.ts`

**Interfaces:**
- Consumes: `paymentMethodFactory` (Task 4); `AuthService`, `RouteAdapter`, `ErrorHandlerAdapter`
- Produces: rota `campaign/:campaignId/settings/payment-methods` registrada e acessível

- [ ] **Step 1: Criar o route adapter**

```tsx
// src/main/routes/route.campaign.paymentMethods.tsx
import type { Route } from "+/route.campaign.paymentMethods";
import { redirect } from "react-router";
import { PaymentMethodsPage } from "~/client/pages/paymentMethods";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { paymentMethodFactory } from "../factories/paymentMethod/paymentMethodFactory";

export async function loader(args: Route.LoaderArgs) {
  const route = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(route);
  if (!user) throw redirect("/sign-in");

  return paymentMethodFactory.handleLoader(route);
}

export async function action(args: Route.ActionArgs) {
  const route = await RouteAdapter.adaptRoute(args);

  try {
    return await paymentMethodFactory.handleAction(route);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function PaymentMethodsRoute() {
  return <PaymentMethodsPage />;
}
```

- [ ] **Step 2: Registrar a rota em routes.ts**

Localizar o bloco do `campaign/:campaignId` em `src/routes.ts` e adicionar a nova rota:

```ts
// src/routes.ts — dentro do array do layout.campaignLayout.tsx
route("campaign/:campaignId", "./main/routes/layout.campaignLayout.tsx", [
  route("home", "./main/routes/route.campaign.home.tsx"),
  route("notifications", "./main/routes/route.campaign.notifications.tsx"),
  route("payment-statements", "./main/routes/route.campaign.paymentStatements.tsx"),
  route("create-recurrence", "./main/routes/route.campaign.createRecurrence.tsx"),
  route("create-one-time-payment", "./main/routes/route.campaign.createOneTimePayment.tsx"),
  route("settings/payment-methods", "./main/routes/route.campaign.paymentMethods.tsx"), // ← adicionar
]),
```

- [ ] **Step 3: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

O TypeScript pode reclamar do import `+/route.campaign.paymentMethods` antes dos tipos serem gerados. Rode o dev server uma vez para gerar os tipos:

```bash
cd /var/www/testes/donation-react-router-v7 && npm run dev
```

Esperado: servidor inicia sem erros; a rota `/campaign/:id/settings/payment-methods` deve responder (loader retorna JSON com `paymentMethods`).

---

### Task 6: Page UI + Dialogs + Sidebar

**Files:**
- Create: `src/client/pages/paymentMethods/index.tsx`
- Create: `src/client/pages/paymentMethods/components/createDialog.tsx`
- Create: `src/client/pages/paymentMethods/components/updateDialog.tsx`
- Create: `src/client/pages/paymentMethods/components/deleteDialog.tsx`
- Modify: `src/client/layouts/campaignLayout/components/sidebar/index.tsx`

**Interfaces:**
- Consumes: dados do loader via `useLoaderData` — `{ paymentMethods: { id: string, name: string }[] }`; `useFetcher` para submissão nos dialogs; componentes `Dialog`, `Table`, `Button`, `Input`, `FormField`, `FormErrorProvider`, `Empty`

- [ ] **Step 1: Criar o CreateDialog**

```tsx
// src/client/pages/paymentMethods/components/createDialog.tsx
import { useEffect } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";

type CreateDialogProps = {
  open: boolean;
  onClose: () => void;
};

function CreateDialog({ open, onClose }: CreateDialogProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo método de pagamento</DialogTitle>
        </DialogHeader>
        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form method="post" className="flex flex-col gap-4">
            <input type="hidden" name="_action" value="createPaymentMethod" />
            <FormField name="name" label="Nome" required>
              <Input
                id="name"
                name="name"
                placeholder="Ex: PIX, Boleto, Cartão..."
                autoFocus
              />
            </FormField>
            <DialogFooter showCloseButton>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { CreateDialog };
```

- [ ] **Step 2: Criar o UpdateDialog**

```tsx
// src/client/pages/paymentMethods/components/updateDialog.tsx
import { useEffect } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";

type PaymentMethod = { id: string; name: string };

type UpdateDialogProps = {
  paymentMethod: PaymentMethod | null;
  onClose: () => void;
};

function UpdateDialog({ paymentMethod, onClose }: UpdateDialogProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={!!paymentMethod} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar método de pagamento</DialogTitle>
        </DialogHeader>
        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form method="post" className="flex flex-col gap-4">
            <input type="hidden" name="_action" value="updatePaymentMethod" />
            <input type="hidden" name="id" value={paymentMethod?.id ?? ""} />
            <FormField name="name" label="Nome" required>
              <Input
                id="name"
                name="name"
                defaultValue={paymentMethod?.name ?? ""}
                key={paymentMethod?.id}
                autoFocus
              />
            </FormField>
            <DialogFooter showCloseButton>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { UpdateDialog };
```

- [ ] **Step 3: Criar o DeleteDialog**

```tsx
// src/client/pages/paymentMethods/components/deleteDialog.tsx
import { useEffect } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";

type PaymentMethod = { id: string; name: string };

type DeleteDialogProps = {
  paymentMethod: PaymentMethod | null;
  onClose: () => void;
};

function DeleteDialog({ paymentMethod, onClose }: DeleteDialogProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={!!paymentMethod} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir método de pagamento</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir{" "}
            <strong>{paymentMethod?.name}</strong>? Esta ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        <fetcher.Form method="post">
          <input type="hidden" name="_action" value="deletePaymentMethod" />
          <input type="hidden" name="id" value={paymentMethod?.id ?? ""} />
          <DialogFooter showCloseButton>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteDialog };
```

- [ ] **Step 4: Criar a página principal**

```tsx
// src/client/pages/paymentMethods/index.tsx
import { useState } from "react";
import { Plus, PencilLine, Trash2 } from "lucide-react";
import { useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Empty } from "~/client/components/ui/empty";
import { Table } from "~/client/components/ui/table";
import { Tooltip } from "~/client/components/ui/tooltip";
import { CreateDialog } from "./components/createDialog";
import { UpdateDialog } from "./components/updateDialog";
import { DeleteDialog } from "./components/deleteDialog";
import type { loader } from "~/main/routes/route.campaign.paymentMethods";

type PaymentMethod = { id: string; name: string };

function PaymentMethodsPage() {
  const { paymentMethods } = useLoaderData<typeof loader>();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PaymentMethod | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
            Métodos de pagamento
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os métodos de pagamento aceitos pela campanha.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} />
          Novo método
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <Empty.Root>
          <Empty.Header>
            <Empty.Title>Nenhum método cadastrado</Empty.Title>
            <Empty.Description>
              Adicione métodos de pagamento para que doadores possam realizar
              contribuições.
            </Empty.Description>
          </Empty.Header>
          <Empty.Content>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus size={16} />
              Novo método
            </Button>
          </Empty.Content>
        </Empty.Root>
      ) : (
        <Table.Root>
          <Table.Header>
            <tr>
              <Table.Head>Nome</Table.Head>
              <Table.Head className="w-24 text-right">Ações</Table.Head>
            </tr>
          </Table.Header>
          <Table.Body>
            {paymentMethods.map((pm) => (
              <Table.Row key={pm.id}>
                <Table.Cell>{pm.name}</Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Tooltip content="Editar">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditTarget(pm)}
                        aria-label="Editar método de pagamento"
                      >
                        <PencilLine size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Excluir">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(pm)}
                        aria-label="Excluir método de pagamento"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      <CreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <UpdateDialog
        paymentMethod={editTarget}
        onClose={() => setEditTarget(null)}
      />
      <DeleteDialog
        paymentMethod={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export { PaymentMethodsPage };
```

- [ ] **Step 5: Atualizar o sidebar — "Configurações" vira CollapsibleNavItem**

Localizar em `src/client/layouts/campaignLayout/components/sidebar/index.tsx` a seção "Sistema" e alterar o item "Configurações":

```ts
// Antes:
{ icon: Settings, label: "Configurações" },

// Depois:
{
  icon: Settings,
  label: "Configurações",
  subItems: [
    { label: "Métodos de pagamento", path: "settings/payment-methods" },
  ],
},
```

O array `sections` ficará assim (apenas a seção "Sistema" muda):

```ts
{
  title: "Sistema",
  items: [
    { icon: Users2, label: "Colaboradores" },
    {
      icon: Settings,
      label: "Configurações",
      subItems: [
        { label: "Métodos de pagamento", path: "settings/payment-methods" },
      ],
    },
    { icon: CircleHelp, label: "Ajuda" },
  ],
},
```

- [ ] **Step 6: Verificar o Tooltip — checar a API do componente**

O componente `Tooltip` em `src/client/components/ui/tooltip.tsx` pode usar a prop `content` ou `text`. Verifique sua interface antes de usar:

```bash
grep -n "content\|children\|text" /var/www/testes/donation-react-router-v7/src/client/components/ui/tooltip.tsx | head -20
```

Ajuste a prop no `PaymentMethodsPage` conforme o que o componente aceita.

- [ ] **Step 7: Verificar tipos e rodar o dev server**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

```bash
cd /var/www/testes/donation-react-router-v7 && npm run dev
```

Verificar no browser:
1. Navegar até qualquer campanha → sidebar "Configurações" deve mostrar sub-item "Métodos de pagamento"
2. Clicar no sub-item → página carrega com tabela (ou estado vazio)
3. Clicar "Novo método" → dialog abre, preencher nome, submeter → item aparece na lista
4. Clicar editar em um item → dialog abre pré-preenchido, alterar nome, submeter → lista atualiza
5. Clicar excluir em um item → dialog de confirmação, confirmar → item some da lista
