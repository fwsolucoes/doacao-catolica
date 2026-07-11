# Create One-Time Payment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a tela "Criar pagamento avulso" acessada via o `DropdownMenu` da `PaymentsTable`, com dois modos: online (link de pagamento) e offline (registro de pagamento recebido).

**Architecture:** Segue exatamente o padrão do `create-recurrence`. O loader reutiliza `listContacts`, `getCampaign` e `findOneContact`. A action bifurca em dois use cases baseada no campo `paymentOption` do form. O controlador e os use cases têm as chamadas à `donationApi` comentadas (padrão do projeto enquanto endpoints não estão disponíveis).

**Tech Stack:** React Router v7 (SSR) · React 19 · Tailwind CSS v4 · tailwind-variants · shadcn/ui · Zod · @arkyn/server

## Global Constraints

- Usar sempre `<Button>` do design system, nunca `<button>` nativo
- Usar `FormField` como único ponto de exibição de erros por campo
- Importar `useState` etc como named imports do React (`import { useState } from "react"`)
- Parâmetros de gateway: separados, não agrupados em objeto genérico
- Usar donationApi (não api) para endpoints de doações
- Sem `"use client"`, sem `export default` em componentes UI
- Named exports em todo componente de página

---

### Task 1: Schema Zod + Tipo do Loader

**Files:**
- Create: `src/infra/schemas/internal/oneTimePayment.ts`
- Create: `src/client/types/createOneTimePaymentLoader.ts`

**Interfaces:**
- Produces: `oneTimePaymentSchema`, `CreateOneTimePaymentType` — consumidos em Task 3 (controller)
- Produces: `CreateOneTimePaymentLoader` — consumido em Task 5 (page)

> Nota: `createOneTimePaymentLoader.ts` referencia o módulo de rota que será criado em Task 4. Criar o arquivo agora mas a verificação de tipo só funciona após Task 4 existir.

- [ ] **Criar o schema Zod**

```ts
// src/infra/schemas/internal/oneTimePayment.ts
import z from "zod";

const oneTimePaymentSchema = z
  .object({
    contactId: z.string().min(1),
    contactName: z.string().min(1),
    contactEmail: z.string().optional(),
    contactPhone: z.string().optional(),
    contactCpf: z.string().optional(),
    contactBirthDate: z.string().optional(),
    accountId: z.coerce.number(),
    category: z.enum(["donation", "tithe"]),
    paymentOption: z.enum(["onlinePayment", "receivedPayment"]),
    // online
    paymentType: z.enum(["pix", "bank_slip"]).optional(),
    amount: z.coerce.number().optional(),
    description: z.string().optional(),
    // offline
    paymentDate: z.string().optional(),
    method: z.string().optional(),
    bankAccount: z.string().optional(),
    observations: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentOption === "onlinePayment") {
      if (!data.paymentType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione a forma de pagamento",
          path: ["paymentType"],
        });
      }
      if (!data.amount || data.amount < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Valor mínimo: R$ 5,00",
          path: ["amount"],
        });
      }
    }
    if (data.paymentOption === "receivedPayment") {
      if (!data.amount || data.amount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe o valor recebido",
          path: ["amount"],
        });
      }
      if (!data.method) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione a forma de pagamento",
          path: ["method"],
        });
      }
    }
  });

type CreateOneTimePaymentType = z.infer<typeof oneTimePaymentSchema>;

export { oneTimePaymentSchema, type CreateOneTimePaymentType };
```

- [ ] **Criar o tipo do loader**

```ts
// src/client/types/createOneTimePaymentLoader.ts
import type { loader } from "~/main/routes/route.campaign.createOneTimePayment";

type CreateOneTimePaymentLoader = Awaited<ReturnType<typeof loader>>;

export type { CreateOneTimePaymentLoader };
```

---

### Task 2: Use Cases

**Files:**
- Create: `src/app/useCases/createOneTimePayment/createOneTimePaymentUseCase.ts`
- Create: `src/app/useCases/createOneTimePayment/registerOfflinePaymentUseCase.ts`

**Interfaces:**
- Produces: `CreateOneTimePaymentUseCase` com método `execute(input: CreateOneTimePaymentInput)` — consumido em Task 3
- Produces: `RegisterOfflinePaymentUseCase` com método `execute(input: RegisterOfflinePaymentInput)` — consumido em Task 3

- [ ] **Criar use case online**

```ts
// src/app/useCases/createOneTimePayment/createOneTimePaymentUseCase.ts
type CreateOneTimePaymentInput = {
  contactId: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  contactCpf?: string;
  contactBirthDate?: string;
  accountId: number;
  campaignId: string;
  category: "donation" | "tithe";
  token: string;
  paymentType: "pix" | "bank_slip";
  amount: number;
  description?: string;
};

class CreateOneTimePaymentUseCase {
  async execute(input: CreateOneTimePaymentInput): Promise<void> {
    // await donationApi.createPayment({ ... });
  }
}

export { CreateOneTimePaymentUseCase, type CreateOneTimePaymentInput };
```

- [ ] **Criar use case offline**

```ts
// src/app/useCases/createOneTimePayment/registerOfflinePaymentUseCase.ts
type RegisterOfflinePaymentInput = {
  contactId: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  contactCpf?: string;
  contactBirthDate?: string;
  accountId: number;
  campaignId: string;
  category: "donation" | "tithe";
  token: string;
  amount: number;
  paymentDate?: string;
  method: string;
  bankAccount?: string;
  observations?: string;
};

class RegisterOfflinePaymentUseCase {
  async execute(input: RegisterOfflinePaymentInput): Promise<void> {
    // await donationApi.registerOfflinePayment({ ... });
  }
}

export { RegisterOfflinePaymentUseCase, type RegisterOfflinePaymentInput };
```

---

### Task 3: Controller + Factory

**Files:**
- Create: `src/infra/controllers/createOneTimePayment/createOneTimePaymentController.ts`
- Create: `src/main/factories/createOneTimePayment/createOneTimePaymentFactory.ts`

**Interfaces:**
- Consumes: `CreateOneTimePaymentUseCase`, `RegisterOfflinePaymentUseCase` (Task 2)
- Consumes: `oneTimePaymentSchema`, `CreateOneTimePaymentType` (Task 1)
- Produces: `createOneTimePayment.handle` — consumido em Task 4 (route adapter)

- [ ] **Criar o controller**

```ts
// src/infra/controllers/createOneTimePayment/createOneTimePaymentController.ts
import type { CreateOneTimePaymentUseCase } from "~/app/useCases/createOneTimePayment/createOneTimePaymentUseCase";
import type { RegisterOfflinePaymentUseCase } from "~/app/useCases/createOneTimePayment/registerOfflinePaymentUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { oneTimePaymentSchema } from "~/infra/schemas/internal/oneTimePayment";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class CreateOneTimePaymentController {
  constructor(
    private createOneTimePaymentUseCase: CreateOneTimePaymentUseCase,
    private registerOfflinePaymentUseCase: RegisterOfflinePaymentUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const schemaValidator = new SchemaValidatorAdapter(oneTimePaymentSchema);
    const validatedBody = schemaValidator.validate(body);

    if (validatedBody.paymentOption === "onlinePayment") {
      // await this.createOneTimePaymentUseCase.execute({
      //   contactId: validatedBody.contactId,
      //   contactName: validatedBody.contactName,
      //   contactEmail: validatedBody.contactEmail,
      //   contactPhone: validatedBody.contactPhone,
      //   contactCpf: validatedBody.contactCpf,
      //   contactBirthDate: validatedBody.contactBirthDate,
      //   accountId: validatedBody.accountId,
      //   campaignId,
      //   category: validatedBody.category,
      //   token: user.token,
      //   paymentType: validatedBody.paymentType!,
      //   amount: validatedBody.amount!,
      //   description: validatedBody.description,
      // });
    } else {
      // await this.registerOfflinePaymentUseCase.execute({
      //   contactId: validatedBody.contactId,
      //   contactName: validatedBody.contactName,
      //   contactEmail: validatedBody.contactEmail,
      //   contactPhone: validatedBody.contactPhone,
      //   contactCpf: validatedBody.contactCpf,
      //   contactBirthDate: validatedBody.contactBirthDate,
      //   accountId: validatedBody.accountId,
      //   campaignId,
      //   category: validatedBody.category,
      //   token: user.token,
      //   amount: validatedBody.amount!,
      //   paymentDate: validatedBody.paymentDate,
      //   method: validatedBody.method!,
      //   bankAccount: validatedBody.bankAccount,
      //   observations: validatedBody.observations,
      // });
    }
  }
}

export { CreateOneTimePaymentController };
```

- [ ] **Criar a factory**

```ts
// src/main/factories/createOneTimePayment/createOneTimePaymentFactory.ts
import { CreateOneTimePaymentUseCase } from "~/app/useCases/createOneTimePayment/createOneTimePaymentUseCase";
import { RegisterOfflinePaymentUseCase } from "~/app/useCases/createOneTimePayment/registerOfflinePaymentUseCase";
import { CreateOneTimePaymentController } from "~/infra/controllers/createOneTimePayment/createOneTimePaymentController";

const createOneTimePaymentUseCase = new CreateOneTimePaymentUseCase();
const registerOfflinePaymentUseCase = new RegisterOfflinePaymentUseCase();
const createOneTimePaymentController = new CreateOneTimePaymentController(
  createOneTimePaymentUseCase,
  registerOfflinePaymentUseCase,
);

const createOneTimePayment = {
  handle: createOneTimePaymentController.handle.bind(
    createOneTimePaymentController,
  ),
};

export { createOneTimePayment };
```

---

### Task 4: Route Adapter

**Files:**
- Create: `src/main/routes/route.campaign.createOneTimePayment.tsx`
- Modify: `src/routes.ts`

**Interfaces:**
- Consumes: `createOneTimePayment.handle` (Task 3)
- Consumes: `listContacts`, `getCampaign`, `findOneContact` (factories já existentes)
- Produces: `loader` exportado — referenciado em `CreateOneTimePaymentLoader` (Task 1)

- [ ] **Criar o route adapter**

```tsx
// src/main/routes/route.campaign.createOneTimePayment.tsx
import type { Route } from "+/route.campaign.createOneTimePayment";
import { redirect } from "react-router";
import { CreateOneTimePaymentPage } from "~/client/pages/createOneTimePayment";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getCampaign } from "../factories/campaign/getCampaignFactory";
import { listContacts } from "../factories/contacts/listContactsFactory";
import { findOneContact } from "../factories/contacts/findOneContactFactory";
import { createOneTimePayment } from "../factories/createOneTimePayment/createOneTimePaymentFactory";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const contactPublicId = adaptedRoute.query.contactPublicId;

  const [contacts, campaign, contactDetail] = await Promise.all([
    listContacts.handle(adaptedRoute),
    getCampaign.handle(adaptedRoute),
    contactPublicId
      ? findOneContact.handle(adaptedRoute)
      : Promise.resolve(null),
  ]);

  return { contacts, campaign, contactDetail };
}

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  try {
    await createOneTimePayment.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }

  return {
    toast: {
      message: "Pagamento avulso criado com sucesso!",
      type: "success" as const,
    },
  };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CreateOneTimePaymentRoute() {
  return <CreateOneTimePaymentPage />;
}
```

- [ ] **Registrar a rota em `src/routes.ts`**

Adicionar dentro do bloco `campaign/:campaignId`, logo após `create-recurrence`:

```ts
route("create-one-time-payment", "./main/routes/route.campaign.createOneTimePayment.tsx"),
```

O bloco completo fica:

```ts
route("campaign/:campaignId", "./main/routes/layout.campaignLayout.tsx", [
  route("home", "./main/routes/route.campaign.home.tsx"),
  route("notifications", "./main/routes/route.campaign.notifications.tsx"),
  route("payment-statements", "./main/routes/route.campaign.paymentStatements.tsx"),
  route("create-recurrence", "./main/routes/route.campaign.createRecurrence.tsx"),
  route("create-one-time-payment", "./main/routes/route.campaign.createOneTimePayment.tsx"),
]),
```

---

### Task 5: Page Component

**Files:**
- Create: `src/client/pages/createOneTimePayment/index.tsx`

**Interfaces:**
- Consumes: `CreateOneTimePaymentLoader` (Task 1)
- Consumes: `ContactDetailCard` de `~/client/pages/createRecurrence/components/ContactDetailCard` (componente existente, reutilizado)

- [ ] **Criar a página**

```tsx
// src/client/pages/createOneTimePayment/index.tsx
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useFetcher,
} from "react-router";
import { useActionToast } from "~/client/hooks/useActionToast";
import {
  FormErrorProvider,
  FormField,
} from "~/client/components/ui/form-field";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Combobox } from "~/client/components/ui/combobox";
import { CurrencyInput } from "~/client/components/ui/currency-input";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Textarea } from "~/client/components/ui/textarea";
import type { CreateOneTimePaymentLoader } from "~/client/types/createOneTimePaymentLoader";
import { useFilter } from "~/client/hooks/useFilter";
import { ContactDetailCard } from "../createRecurrence/components/ContactDetailCard";

const CATEGORY_MAP: Record<number, "donation" | "tithe"> = {
  1: "donation",
  2: "tithe",
};

const OFFLINE_METHOD_OPTIONS = [
  { value: "pix", label: "Pix" },
  { value: "bank_slip", label: "Boleto" },
  { value: "cash", label: "Dinheiro" },
  { value: "transfer", label: "Transferência" },
  { value: "check", label: "Cheque" },
  { value: "ted_doc", label: "TED/DOC" },
];

function CreateOneTimePaymentPage() {
  const { contacts, campaign, contactDetail } =
    useLoaderData<CreateOneTimePaymentLoader>();
  const { campaignId } = useParams<{ campaignId: string }>();
  const { Form, state, data } = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();
  const isSubmitting = state === "submitting";

  const [selectedContactId, setSelectedContactId] = useState(
    contactDetail?.contactId ?? "",
  );
  const [paymentOption, setPaymentOption] = useState<
    "onlinePayment" | "receivedPayment"
  >("onlinePayment");
  const [paymentType, setPaymentType] = useState<"pix" | "bank_slip">("pix");
  const [offlineMethod, setOfflineMethod] = useState("pix");

  useActionToast(data);

  useEffect(() => {
    if (data?.toast?.type !== "success") return;
    navigate(`/campaign/${campaignId}/payment-statements`);
  }, [data?.toast?.type]);

  const category = CATEGORY_MAP[campaign.type] ?? "donation";
  const contactOptions = contacts.map((c) => ({ value: c.id, label: c.name }));
  const { handleChangeFilter } = useFilter("contacts");

  const today = new Date().toISOString().split("T")[0];

  function handleContactChange(contactId: string) {
    setSelectedContactId(contactId);
    const params = new URLSearchParams(location.search);
    if (contactId) {
      params.set("contactPublicId", contactId);
    } else {
      params.delete("contactPublicId");
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link to={`/campaign/${campaignId}/payment-statements`}>
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold text-(--text-heading)">
          Criar pagamento avulso
        </h1>
      </div>

      <FormErrorProvider fieldErrors={data?.cause?.fieldErrors}>
        <Form method="post" className="space-y-6">
          <input type="hidden" name="accountId" value={campaign.accountId} />
          <input type="hidden" name="category" value={category} />
          <input
            type="hidden"
            name="contactId"
            value={contactDetail?.contactId ?? ""}
          />
          <input
            type="hidden"
            name="contactName"
            value={contactDetail?.name ?? ""}
          />

          {/* Card 1 — Contato */}
          <Card.Root className="p-6">
            <div className="mr-auto w-full max-w-xl flex flex-col gap-4">
              <h2 className="font-semibold text-(--text-heading)">Contato</h2>
              <FormField name="contactId" label="Pesquisar contato:" required>
                <Combobox
                  options={contactOptions}
                  value={selectedContactId}
                  onChange={handleContactChange}
                  onSearchChange={(search) =>
                    handleChangeFilter("name", search)
                  }
                  placeholder="Selecione um contato"
                  searchPlaceholder="Pesquisar por nome..."
                  emptyText="Nenhum contato encontrado."
                />
              </FormField>
              {contactDetail && (
                <ContactDetailCard contact={contactDetail} />
              )}
            </div>
          </Card.Root>

          {/* Card 2 — Pagamento */}
          <Card.Root className="p-6">
            <div className="mr-auto w-full max-w-xl flex flex-col gap-6">
              <h2 className="font-semibold text-(--text-heading)">Pagamento</h2>

              <FormField
                name="paymentOption"
                label="Opção de pagamento:"
                required
              >
                <Select.Root
                  name="paymentOption"
                  value={paymentOption}
                  onValueChange={(v) =>
                    setPaymentOption(
                      v as "onlinePayment" | "receivedPayment",
                    )
                  }
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="onlinePayment">
                      Gerar link de pagamento online
                    </Select.Item>
                    <Select.Item value="receivedPayment">
                      Registrar pagamento recebido (offline)
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </FormField>

              {paymentOption === "onlinePayment" && (
                <>
                  <FormField
                    name="paymentType"
                    label="Forma de pagamento:"
                    required
                  >
                    <Select.Root
                      name="paymentType"
                      value={paymentType}
                      onValueChange={(v) =>
                        setPaymentType(v as "pix" | "bank_slip")
                      }
                    >
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="pix">Pix</Select.Item>
                        <Select.Item value="bank_slip">Boleto</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </FormField>

                  <FormField name="amount" label="Valor:" required>
                    <CurrencyInput min={5} />
                    <p className="text-xs text-muted-foreground">
                      Valor mínimo: R$ 5,00
                    </p>
                  </FormField>

                  <FormField name="description" label="Descrição (opcional)">
                    <Textarea
                      name="description"
                      rows={3}
                      placeholder="Descreva o pagamento..."
                    />
                  </FormField>
                </>
              )}

              {paymentOption === "receivedPayment" && (
                <>
                  <FormField name="amount" label="Valor recebido:" required>
                    <CurrencyInput />
                  </FormField>

                  <FormField name="paymentDate" label="Data de pagamento:">
                    <Input
                      name="paymentDate"
                      type="date"
                      defaultValue={today}
                    />
                  </FormField>

                  <FormField
                    name="method"
                    label="Forma de pagamento:"
                    required
                  >
                    <Select.Root
                      name="method"
                      value={offlineMethod}
                      onValueChange={setOfflineMethod}
                    >
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        {OFFLINE_METHOD_OPTIONS.map((o) => (
                          <Select.Item key={o.value} value={o.value}>
                            {o.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </FormField>

                  <FormField
                    name="bankAccount"
                    label="Conta de recebimento (opcional)"
                  >
                    <Input
                      name="bankAccount"
                      type="text"
                      placeholder="Ex: Conta corrente Banco X"
                    />
                  </FormField>

                  <FormField name="observations" label="Observações (opcional)">
                    <Textarea
                      name="observations"
                      rows={3}
                      placeholder="Observações sobre o pagamento..."
                    />
                  </FormField>
                </>
              )}
            </div>
          </Card.Root>

          <div className="ml-auto flex w-fit max-w-xl justify-end gap-3">
            <Link to={`/campaign/${campaignId}/payment-statements`}>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting || !contactDetail}>
              {isSubmitting ? "Salvando..." : "Salvar pagamento"}
            </Button>
          </div>
        </Form>
      </FormErrorProvider>
    </div>
  );
}

export { CreateOneTimePaymentPage };
```

---

### Task 6: Wire Navigation

**Files:**
- Modify: `src/client/pages/paymentStatements/components/paymentsTable/index.tsx`

**Interfaces:**
- Consumes: rota `create-one-time-payment` registrada em Task 4

- [ ] **Adicionar `Link` ao `DropdownMenuItem` "Criar pagamento avulso"**

Localizar em `paymentsTable/index.tsx` o `DropdownMenuItem` sem `Link` (linha ~167):

```tsx
<DropdownMenuItem>
  <Zap size={16} className="text-foreground" />
  Criar pagamento avulso
</DropdownMenuItem>
```

Substituir por:

```tsx
<DropdownMenuItem asChild>
  <Link to={`/campaign/${campaignId}/create-one-time-payment`}>
    <Zap size={16} className="text-foreground" />
    Criar pagamento avulso
  </Link>
</DropdownMenuItem>
```

- [ ] **Verificar manualmente no browser**

1. Abrir `payment-statements` de qualquer campanha
2. Clicar em "+ Adicionar" → verificar que "Criar pagamento avulso" navega para `/campaign/:id/create-one-time-payment`
3. Na tela: selecionar um contato → `ContactDetailCard` aparece
4. Testar modo **online**: trocar forma de pagamento, preencher valor, descrição → clicar Salvar → toast de sucesso e redirect para `payment-statements`
5. Testar modo **offline**: trocar para "Registrar pagamento recebido", preencher valor, data, método → clicar Salvar → toast de sucesso
6. Testar validação: tentar submeter sem contato selecionado (botão desabilitado) e sem valor (erro de campo)
7. Verificar que o botão Cancelar retorna para `payment-statements`
