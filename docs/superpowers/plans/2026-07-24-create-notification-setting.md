# Criar régua de cobrança — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Conectar o dialog `NewBillingRuleDialog` ao endpoint `POST /notifications_settings` para criar novas réguas de cobrança.

**Architecture:** Clean architecture — schema interno valida o FormData (strings → tipos via `.transform()`), controller extrai `campaignId` dos route params como `account_reference`, use case delega ao gateway que chama `donationApi`. Na UI, `useFetcher` com `<fetcher.Form>` submete para a `action` da rota, que exibe toast de sucesso e fecha o dialog.

**Tech Stack:** React Router v7, Zod v4, @arkyn/server (donationApi, ErrorHandlerAdapter), shadcn/ui, useFetcher

## Global Constraints

- Schemas internos: conversões de tipo via `.transform()` ou `z.coerce`, nunca no controller
- Field names do form: camelCase; mapeados para snake_case no gateway
- Controllers de `donationApi`: **não** verificar `AuthService` (conforme CLAUDE.md)
- `_action` identificador: no `<Button type="submit" name="_action" value="...">`, nunca em `<input type="hidden">`
- Zod v4: `z.uuid()` standalone (não `z.string().uuid()`)
- Exports: sempre named exports
- Inputs HTML nativos: nunca — usar componentes do design system

---

## File Map

| Arquivo                                                                             | Ação      | Responsabilidade                                                    |
| ----------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------- |
| `src/infra/schemas/internal/notificationSetting.ts`                                 | Criar     | Valida FormData da criação                                          |
| `src/domain/gateways/notificationSetting.ts`                                        | Modificar | Adicionar `createNotificationSetting` à interface                   |
| `src/infra/gateways/notificationSetting.ts`                                         | Modificar | Implementar POST para `donationApi`                                 |
| `src/app/useCases/notificationSetting/createNotificationSettingUseCase.ts`          | Criar     | Delegar ao gateway                                                  |
| `src/infra/controllers/notificationSetting/createNotificationSettingController.ts`  | Criar     | Decodificar body, validar schema, chamar use case                   |
| `src/main/factories/notificationSetting/createNotificationSettingFactory.ts`        | Criar     | Instanciar e encadear as camadas                                    |
| `src/main/routes/route.campaign.messageRules.tsx`                                   | Modificar | Adicionar `action` com switch/case                                  |
| `src/client/pages/messageRules/components/new-billing-rule-dialog/whatsapp-tab.tsx` | Modificar | Adicionar hidden input `enableWhatsapp`                             |
| `src/client/pages/messageRules/components/new-billing-rule-dialog/email-tab.tsx`    | Modificar | Adicionar `name` nos campos + hidden input `enableMail`             |
| `src/client/pages/messageRules/components/new-billing-rule-dialog/index.tsx`        | Modificar | Conectar `useFetcher`, `FormErrorProvider`, hidden inputs de estado |

---

### Task 1: Internal schema

**Files:**

- Create: `src/infra/schemas/internal/notificationSetting.ts`

**Interfaces:**

- Produces: `createNotificationSettingSchema`, `CreateNotificationSettingBody` — consumidos em Task 3

- [ ] **Step 1: Criar o schema interno**

Criar `src/infra/schemas/internal/notificationSetting.ts`:

```ts
import { z } from "zod";

const createNotificationSettingSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  days: z.coerce.number().int().min(0),
  whatsappMessage: z.string().default(""),
  mailSubject: z.string().default(""),
  mailMessage: z.string().default(""),
  emailImage1: z.string().default(""),
  enableWhatsapp: z.string().transform((v) => v === "true"),
  enableMail: z.string().transform((v) => v === "true"),
  enablePix: z.string().transform((v) => v === "true"),
  enableCreditCard: z.string().transform((v) => v === "true"),
  enableBankSlip: z.string().transform((v) => v === "true"),
});

type CreateNotificationSettingBody = z.infer<
  typeof createNotificationSettingSchema
>;

export { createNotificationSettingSchema };
export type { CreateNotificationSettingBody };
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -20
```

Esperado: sem erros novos.

- [ ] **Step 3: Commit**

```bash
git add src/infra/schemas/internal/notificationSetting.ts
git commit -m "feat(notificationSetting): add internal schema for create action"
```

---

### Task 2: Domain gateway interface + infra gateway

**Files:**

- Modify: `src/domain/gateways/notificationSetting.ts`
- Modify: `src/infra/gateways/notificationSetting.ts`

**Interfaces:**

- Produces: `NotificationSettingGatewayDTO.createNotificationSetting(accountUuid, data)` — consumido em Task 3
- Produces: type `CreateNotificationSettingData` — consumido em Task 3

- [ ] **Step 1: Atualizar a interface (domain)**

Substituir o conteúdo de `src/domain/gateways/notificationSetting.ts`:

```ts
import type { NotificationSetting } from "../entities/notificationSetting";

type CreateNotificationSettingData = {
  name: string;
  type: string;
  days: number;
  whatsappMessage: string;
  mailSubject: string;
  mailMessage: string;
  bannerImage: string | null;
  enableWhatsapp: boolean;
  enableMail: boolean;
  enablePix: boolean;
  enableCreditCard: boolean;
  enableBankSlip: boolean;
};

type NotificationSettingGatewayDTO = {
  listNotificationSettings(accountUuid: string): Promise<NotificationSetting[]>;
  createNotificationSetting(
    accountUuid: string,
    data: CreateNotificationSettingData,
  ): Promise<void>;
};

export type { NotificationSettingGatewayDTO, CreateNotificationSettingData };
```

- [ ] **Step 2: Implementar o POST no gateway (infra)**

Substituir o conteúdo de `src/infra/gateways/notificationSetting.ts`:

```ts
import { NotificationSetting } from "~/domain/entities/notificationSetting";
import type {
  CreateNotificationSettingData,
  NotificationSettingGatewayDTO,
} from "~/domain/gateways/notificationSetting";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { notificationSettingsSchema } from "../schemas/external/notificationSettings";

class NotificationSettingGateway implements NotificationSettingGatewayDTO {
  async listNotificationSettings(
    accountUuid: string,
  ): Promise<NotificationSetting[]> {
    const url = `/api/notifications_settings/account/${accountUuid}`;

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const validated = new SchemaValidatorAdapter(
      notificationSettingsSchema,
    ).validate(apiResponse.response);

    return validated.data.map((item) =>
      NotificationSetting.restore({
        uuid: item.uuid,
        active: item.active,
        type: item.type,
        name: item.name,
        days: item.days,
        whatsappMessage: item.whatsapp_message,
        mailSubject: item.mail_subject,
        mailMessage: item.mail_message,
        enableWhatsapp: item.enable_whatsapp,
        enableMail: item.enable_mail,
        enablePix: item.enable_pix,
        enableCreditCard: item.enable_credit_card,
        enableBankSlip: item.enable_bank_slip,
        bannerImage: item.banner_image,
        webhookUrl: item.webhook_url,
        keywordFlow: item.keyword_flow,
        whatsappType: item.whatsapp_type,
        createdAt: item.created_at2,
        updatedAt: item.updated_at2,
        deletedAt: item.deleted_at2,
      }),
    );
  }

  async createNotificationSetting(
    accountUuid: string,
    data: CreateNotificationSettingData,
  ): Promise<void> {
    const apiResponse = await donationApi.post("/api/notifications_settings", {
      body: {
        account_reference: accountUuid,
        type: data.type,
        name: data.name,
        days: data.days,
        whatsapp_message: data.whatsappMessage || undefined,
        mail_subject: data.mailSubject || undefined,
        mail_message: data.mailMessage || undefined,
        banner_image: data.bannerImage || undefined,
        enable_whatsapp: data.enableWhatsapp,
        enable_mail: data.enableMail,
        enable_pix: data.enablePix,
        enable_credit_card: data.enableCreditCard,
        enable_bank_slip: data.enableBankSlip,
      },
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { NotificationSettingGateway };
```

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Esperado: sem erros novos.

- [ ] **Step 4: Commit**

```bash
git add src/domain/gateways/notificationSetting.ts src/infra/gateways/notificationSetting.ts
git commit -m "feat(notificationSetting): add createNotificationSetting to gateway"
```

---

### Task 3: Use case + Controller + Factory

**Files:**

- Create: `src/app/useCases/notificationSetting/createNotificationSettingUseCase.ts`
- Create: `src/infra/controllers/notificationSetting/createNotificationSettingController.ts`
- Create: `src/main/factories/notificationSetting/createNotificationSettingFactory.ts`

**Interfaces:**

- Consumes: `createNotificationSettingSchema`, `CreateNotificationSettingBody` (Task 1); `NotificationSettingGatewayDTO.createNotificationSetting`, `CreateNotificationSettingData` (Task 2)
- Produces: `createNotificationSetting.handle` — consumido em Task 4

- [ ] **Step 1: Criar o use case**

Criar `src/app/useCases/notificationSetting/createNotificationSettingUseCase.ts`:

```ts
import type {
  CreateNotificationSettingData,
  NotificationSettingGatewayDTO,
} from "~/domain/gateways/notificationSetting";

class CreateNotificationSettingUseCase {
  constructor(private gateway: NotificationSettingGatewayDTO) {}

  async execute(
    accountUuid: string,
    data: CreateNotificationSettingData,
  ): Promise<void> {
    await this.gateway.createNotificationSetting(accountUuid, data);
  }
}

export { CreateNotificationSettingUseCase };
```

- [ ] **Step 2: Criar o controller**

Criar `src/infra/controllers/notificationSetting/createNotificationSettingController.ts`:

```ts
import type { CreateNotificationSettingUseCase } from "~/app/useCases/notificationSetting/createNotificationSettingUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { createNotificationSettingSchema } from "~/infra/schemas/internal/notificationSetting";
import type { RouteDTO } from "~/main/types/route";

class CreateNotificationSettingController {
  constructor(
    private createNotificationSettingUseCase: CreateNotificationSettingUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      createNotificationSettingSchema,
    ).validate(body);

    await this.createNotificationSettingUseCase.execute(campaignId, {
      name: validated.name,
      type: validated.type,
      days: validated.days,
      whatsappMessage: validated.whatsappMessage,
      mailSubject: validated.mailSubject,
      mailMessage: validated.mailMessage,
      bannerImage: validated.emailImage1 || null,
      enableWhatsapp: validated.enableWhatsapp,
      enableMail: validated.enableMail,
      enablePix: validated.enablePix,
      enableCreditCard: validated.enableCreditCard,
      enableBankSlip: validated.enableBankSlip,
    });

    return {
      toast: {
        message: "Régua criada com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { CreateNotificationSettingController };
```

- [ ] **Step 3: Criar a factory**

Criar `src/main/factories/notificationSetting/createNotificationSettingFactory.ts`:

```ts
import { CreateNotificationSettingUseCase } from "~/app/useCases/notificationSetting/createNotificationSettingUseCase";
import { CreateNotificationSettingController } from "~/infra/controllers/notificationSetting/createNotificationSettingController";
import { NotificationSettingGateway } from "~/infra/gateways/notificationSetting";

const notificationSettingGateway = new NotificationSettingGateway();
const createNotificationSettingUseCase = new CreateNotificationSettingUseCase(
  notificationSettingGateway,
);
const createNotificationSettingController =
  new CreateNotificationSettingController(createNotificationSettingUseCase);

const createNotificationSetting = {
  handle: createNotificationSettingController.handle.bind(
    createNotificationSettingController,
  ),
};

export { createNotificationSetting };
```

- [ ] **Step 4: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Esperado: sem erros novos.

- [ ] **Step 5: Commit**

```bash
git add \
  src/app/useCases/notificationSetting/createNotificationSettingUseCase.ts \
  src/infra/controllers/notificationSetting/createNotificationSettingController.ts \
  src/main/factories/notificationSetting/createNotificationSettingFactory.ts
git commit -m "feat(notificationSetting): add create use case, controller, and factory"
```

---

### Task 4: Route action

**Files:**

- Modify: `src/main/routes/route.campaign.messageRules.tsx`

**Interfaces:**

- Consumes: `createNotificationSetting.handle` (Task 3)

- [ ] **Step 1: Adicionar a action na rota**

Substituir o conteúdo de `src/main/routes/route.campaign.messageRules.tsx`:

```tsx
import { redirect } from "react-router";
import type { Route } from "+/route.campaign.messageRules";
import { MessageRulesPage } from "~/client/pages/messageRules";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { DecodeActionAdapter } from "~/infra/adapters/decodeAction";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { createNotificationSetting } from "../factories/notificationSetting/createNotificationSettingFactory";
import { listNotificationSettings } from "../factories/notificationSetting/listNotificationSettingsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const notificationSettings =
    await listNotificationSettings.handle(adaptedRoute);
  return { notificationSettings };
}

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const _action = await DecodeActionAdapter.decode(adaptedRoute.request);

  try {
    switch (_action) {
      case "createNotificationSetting":
        return await createNotificationSetting.handle(adaptedRoute);
      default:
        throw HttpAdapter.badRequest("Action not implemented");
    }
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function MessageRulesRoute() {
  return <MessageRulesPage />;
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Esperado: sem erros novos.

- [ ] **Step 3: Commit**

```bash
git add src/main/routes/route.campaign.messageRules.tsx
git commit -m "feat(messageRules): add createNotificationSetting action to route"
```

---

### Task 5: Dialog UI — wiring do fetcher e campos de formulário

**Files:**

- Modify: `src/client/pages/messageRules/components/new-billing-rule-dialog/whatsapp-tab.tsx`
- Modify: `src/client/pages/messageRules/components/new-billing-rule-dialog/email-tab.tsx`
- Modify: `src/client/pages/messageRules/components/new-billing-rule-dialog/index.tsx`

**Interfaces:**

- Consumes: rota com action `createNotificationSetting` (Task 4)

- [ ] **Step 1: Adicionar hidden input de enableWhatsapp na WhatsAppTab**

Substituir o conteúdo de `src/client/pages/messageRules/components/new-billing-rule-dialog/whatsapp-tab.tsx`:

```tsx
import { useRef, useState } from "react";
import { FormField } from "~/client/components/ui/form-field";
import { Textarea } from "~/client/components/ui/textarea";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { VariablePopover } from "../variable-popover";
import { WHATSAPP_DEFAULT } from "../../constants";

function WhatsAppTab() {
  const [message, setMessage] = useState(WHATSAPP_DEFAULT);
  const cursorRef = useRef(WHATSAPP_DEFAULT.length);

  function insertVariable(variable: string) {
    const pos = cursorRef.current;
    setMessage((prev) => prev.slice(0, pos) + variable + prev.slice(pos));
    cursorRef.current = pos + variable.length;
  }

  return (
    <>
      <input
        type="hidden"
        name="enableWhatsapp"
        value={message.trim() ? "true" : "false"}
      />
      <div className="grid grid-cols-5 gap-7">
        <div className="col-span-3 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-foreground">
              Inserir variável
            </p>
            <VariablePopover onInsert={insertVariable} />
          </div>
          <FormField name="whatsappMessage" label="Mensagem WhatsApp">
            <Textarea
              name="whatsappMessage"
              className="min-h-40 font-mono text-xs"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                cursorRef.current = e.target.selectionStart;
              }}
              onSelect={(e) => {
                cursorRef.current = (
                  e.target as HTMLTextAreaElement
                ).selectionStart;
              }}
              onBlur={(e) => {
                cursorRef.current = e.target.selectionStart;
              }}
            />
          </FormField>
        </div>

        <div className="col-span-2 flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-foreground">Prévia</p>
            <p className="text-xs text-muted-foreground">
              Variáveis serão preenchidas no envio
            </p>
          </div>
          <div className="overflow-clip rounded-2xl border border-border">
            <div className="flex items-center gap-2.5 bg-[#007a55] px-5 py-3">
              <WhatsAppIcon size={16} className="text-white" />
              <span className="text-sm font-semibold text-white">
                Empresa Demo
              </span>
            </div>
            <div className="bg-[#ecfdf5] p-5">
              <p className="whitespace-pre-wrap text-sm text-[#002c22]">
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { WhatsAppTab };
```

- [ ] **Step 2: Adicionar names e hidden input de enableMail na EmailTab**

Substituir o conteúdo de `src/client/pages/messageRules/components/new-billing-rule-dialog/email-tab.tsx`:

```tsx
import { useRef, useState } from "react";
import { FormField } from "~/client/components/ui/form-field";
import { ImageUpload } from "~/client/components/ui/image-upload";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Textarea } from "~/client/components/ui/textarea";
import { VariablePopover } from "../variable-popover";
import { EMAIL_BODY_DEFAULT } from "../../constants";

function EmailTab() {
  const [subject, setSubject] = useState("Lembrete de Vencimento - {{nome}}");
  const [body, setBody] = useState(EMAIL_BODY_DEFAULT);
  const subjectCursorRef = useRef(0);
  const bodyCursorRef = useRef(EMAIL_BODY_DEFAULT.length);

  function insertSubjectVariable(variable: string) {
    const pos = subjectCursorRef.current;
    setSubject((prev) => prev.slice(0, pos) + variable + prev.slice(pos));
    subjectCursorRef.current = pos + variable.length;
  }

  function insertBodyVariable(variable: string) {
    const pos = bodyCursorRef.current;
    setBody((prev) => prev.slice(0, pos) + variable + prev.slice(pos));
    bodyCursorRef.current = pos + variable.length;
  }

  return (
    <>
      <input
        type="hidden"
        name="enableMail"
        value={subject.trim() && body.trim() ? "true" : "false"}
      />
      <div className="grid grid-cols-5 gap-7">
        <div className="col-span-3 flex flex-col gap-4">
          <FormField name="emailLayout" label="Layout HTML">
            <Select.Root defaultValue="basico">
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="basico">Layout básico</Select.Item>
              </Select.Content>
            </Select.Root>
          </FormField>

          <FormField name="emailImage1" label="Imagem 1 (Topo)">
            <ImageUpload name="emailImage1" width={600} height={200} />
          </FormField>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-foreground">Assunto</p>
            <div className="flex w-full items-center gap-2.5">
              <div className="min-w-0 flex-1">
                <Input
                  name="mailSubject"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    subjectCursorRef.current =
                      e.target.selectionStart ?? e.target.value.length;
                  }}
                  onSelect={(e) => {
                    subjectCursorRef.current =
                      (e.target as HTMLInputElement).selectionStart ??
                      subject.length;
                  }}
                  onBlur={(e) => {
                    subjectCursorRef.current =
                      e.target.selectionStart ?? subject.length;
                  }}
                />
              </div>
              <VariablePopover onInsert={insertSubjectVariable} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-foreground">
              Corpo do e-mail
            </p>
            <VariablePopover onInsert={insertBodyVariable} />
            <Textarea
              name="mailMessage"
              className="min-h-40 text-sm"
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                bodyCursorRef.current = e.target.selectionStart;
              }}
              onSelect={(e) => {
                bodyCursorRef.current = (
                  e.target as HTMLTextAreaElement
                ).selectionStart;
              }}
              onBlur={(e) => {
                bodyCursorRef.current = e.target.selectionStart;
              }}
            />
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-foreground">Prévia</p>
            <p className="text-xs text-muted-foreground">
              Variáveis serão preenchidas no envio
            </p>
          </div>
          <div className="overflow-clip rounded-2xl border border-border">
            <div className="border-b border-border bg-muted px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Para: cliente@email.com
              </p>
              <p className="text-xs font-semibold text-foreground">{subject}</p>
            </div>
            <div className="flex h-28 items-center justify-center bg-muted/50">
              <span className="text-xs text-muted-foreground">Imagem 1</span>
            </div>
            <div className="p-5">
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { EmailTab };
```

- [ ] **Step 3: Conectar o dialog ao useFetcher**

Substituir o conteúdo de `src/client/pages/messageRules/components/new-billing-rule-dialog/index.tsx`:

```tsx
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Mail } from "lucide-react";
import { Tabs } from "radix-ui";
import { cn } from "~/lib/utils";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import {
  FormErrorProvider,
  FormField,
} from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Switch } from "~/client/components/ui/switch";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { useActionToast } from "~/client/hooks/useActionToast";
import { NOTIFICATION_TYPES } from "~/client/constants/notificationTypes";
import { EmailTab } from "./email-tab";
import { WhatsAppTab } from "./whatsapp-tab";

const CHANNEL_TABS = [
  { value: "whatsapp", label: "WhatsApp", icon: <WhatsAppIcon size={16} /> },
  { value: "email", label: "E-mail", icon: <Mail size={16} /> },
];

type PaymentMethods = { pix: boolean; cartao: boolean; boleto: boolean };

function NewBillingRuleDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  const [activeChannel, setActiveChannel] = useState("whatsapp");
  const [messageType, setMessageType] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>({
    pix: true,
    cartao: true,
    boleto: true,
  });

  useActionToast(fetcher.data);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast?.type === "success") {
      onOpenChange(false);
    }
  }, [fetcher.state, fetcher.data, onOpenChange]);

  function togglePayment(method: keyof PaymentMethods) {
    setPaymentMethods((prev) => ({ ...prev, [method]: !prev[method] }));
  }

  const showDaysField =
    messageType === "payment_before_due_date" ||
    messageType === "payment_after_due_date";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[90vw] max-w-[90vw] sm:max-w-[90vw] flex-col gap-0 p-0">
        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form method="post" className="flex min-h-0 flex-1 flex-col">
            <input type="hidden" name="type" value={messageType} />
            <input
              type="hidden"
              name="enablePix"
              value={paymentMethods.pix ? "true" : "false"}
            />
            <input
              type="hidden"
              name="enableCreditCard"
              value={paymentMethods.cartao ? "true" : "false"}
            />
            <input
              type="hidden"
              name="enableBankSlip"
              value={paymentMethods.boleto ? "true" : "false"}
            />
            {!showDaysField && <input type="hidden" name="days" value="0" />}

            <DialogHeader className="shrink-0 px-7 pb-5 pt-7">
              <DialogTitle>Nova régua de cobrança</DialogTitle>
            </DialogHeader>

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-7 pb-7">
              <div className="grid grid-cols-2 gap-5">
                <FormField name="name" label="Nome da mensagem" required>
                  <Input name="name" placeholder="Ex.: Lembrete 3 dias antes" />
                </FormField>
                <FormField name="messageType" label="Tipo de mensagem" required>
                  <Select.Root
                    value={messageType}
                    onValueChange={setMessageType}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Selecione o tipo" />
                    </Select.Trigger>
                    <Select.Content>
                      {Object.entries(NOTIFICATION_TYPES).map(
                        ([value, label]) => (
                          <Select.Item key={value} value={value}>
                            {label}
                          </Select.Item>
                        ),
                      )}
                    </Select.Content>
                  </Select.Root>
                </FormField>
              </div>

              {showDaysField && (
                <div className="max-w-80">
                  <FormField
                    name="days"
                    label={
                      messageType === "payment_before_due_date"
                        ? "Dias antes do vencimento"
                        : "Dias após o vencimento"
                    }
                  >
                    <Input
                      name="days"
                      type="number"
                      defaultValue="3"
                      min={1}
                      max={messageType === "payment_before_due_date" ? 5 : 1000}
                    />
                  </FormField>
                </div>
              )}

              <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-5">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-foreground">
                    Formas de pagamento ativas
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Esta mensagem será enviada apenas para doações com as formas
                    selecionadas.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["pix", "cartao", "boleto"] as const).map((method) => {
                    const label =
                      method === "cartao"
                        ? "Cartão"
                        : method.charAt(0).toUpperCase() + method.slice(1);
                    return (
                      <div
                        key={method}
                        className={cn(
                          "flex items-center justify-between rounded-xl border bg-muted px-4 py-2.5",
                          paymentMethods[method]
                            ? "border-primary/40"
                            : "border-border",
                        )}
                      >
                        <span className="text-sm font-semibold text-foreground">
                          {label}
                        </span>
                        <Switch
                          checked={paymentMethods[method]}
                          onCheckedChange={() => togglePayment(method)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-border pt-5">
                <p className="text-sm font-semibold text-foreground">
                  Mensagens por canal
                </p>

                <Tabs.Root
                  value={activeChannel}
                  onValueChange={setActiveChannel}
                >
                  <Tabs.List className="inline-flex gap-1.5 rounded-2xl border border-border bg-muted/60 p-1.5">
                    {CHANNEL_TABS.map((tab) => (
                      <Tabs.Trigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                          "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors",
                          "data-[state=active]:bg-secondary data-[state=active]:text-foreground",
                          "hover:text-foreground",
                        )}
                      >
                        {tab.icon}
                        {tab.label}
                      </Tabs.Trigger>
                    ))}
                  </Tabs.List>

                  <Tabs.Content
                    value="whatsapp"
                    className="mt-5 data-[state=inactive]:hidden"
                    forceMount
                  >
                    <WhatsAppTab />
                  </Tabs.Content>
                  <Tabs.Content
                    value="email"
                    className="mt-5 data-[state=inactive]:hidden"
                    forceMount
                  >
                    <EmailTab />
                  </Tabs.Content>
                </Tabs.Root>
              </div>
            </div>

            <DialogFooter className="shrink-0 border-t border-border px-7 py-5">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button
                type="submit"
                name="_action"
                value="createNotificationSetting"
                isLoading={isSubmitting}
              >
                Salvar
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { NewBillingRuleDialog };
```

- [ ] **Step 4: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Esperado: sem erros novos.

- [ ] **Step 5: Testar no browser**

1. Navegar até a página de automação de notificações da campanha
2. Clicar em "Nova régua de cobrança"
3. Preencher: Nome = "Teste", Tipo = "Lembrete antes do vencimento", Dias = 3
4. Garantir que o WhatsApp tab tem mensagem preenchida (já vem com default)
5. Clicar em "Salvar"
6. Verificar: toast "Régua criada com sucesso!" aparece, dialog fecha, lista recarrega com a nova régua
7. Testar submissão com campo "Nome" vazio: verificar erro de validação exibido no campo

- [ ] **Step 6: Commit**

```bash
git add \
  src/client/pages/messageRules/components/new-billing-rule-dialog/whatsapp-tab.tsx \
  src/client/pages/messageRules/components/new-billing-rule-dialog/email-tab.tsx \
  src/client/pages/messageRules/components/new-billing-rule-dialog/index.tsx
git commit -m "feat(messageRules): wire NewBillingRuleDialog to create action"
```
