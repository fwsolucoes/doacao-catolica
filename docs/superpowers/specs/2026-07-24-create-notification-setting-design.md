# Design: Criar régua de cobrança

**Data:** 2026-07-24  
**Feature:** Ação de criação via `POST /notifications_settings`  
**Rota afetada:** `route.campaign.messageRules.tsx`

---

## Contexto

A página de automação de notificações (`/campaign/:campaignId/message-rules`) já lista as réguas existentes via `GET /api/notifications_settings/account/:accountUuid`. O dialog `NewBillingRuleDialog` tem UI completa (nome, tipo, dias, formas de pagamento, tabs WhatsApp/E-mail) mas o botão "Salvar" ainda não submete nada.

Esta spec cobre a conexão do dialog à API de criação.

---

## Arquitetura

Segue o padrão clean architecture do projeto:

```
Internal Schema
  → Controller (valida body, extrai params)
    → UseCase (delega)
      → Gateway (POST donationApi)
Domain Gateway Interface (contrato)
Factory (instancia tudo)
Route action (switch/case)
```

### Mapeamento de campos

| Campo form (camelCase) | Campo API (snake_case) | Origem |
|---|---|---|
| `type` | `type` | hidden input (estado do Select) |
| `name` | `name` | Input direto |
| `days` | `days` | Input numérico ou hidden `"0"` |
| `whatsappMessage` | `whatsapp_message` | Textarea na WhatsAppTab |
| `mailSubject` | `mail_subject` | Input na EmailTab |
| `mailMessage` | `mail_message` | Textarea na EmailTab |
| `enableWhatsapp` | `enable_whatsapp` | hidden inferido: `whatsappMessage.trim() !== ""` |
| `enableMail` | `enable_mail` | hidden inferido: `mailSubject.trim() && mailMessage.trim()` |
| `enablePix` | `enable_pix` | hidden do switch de Pix |
| `enableCreditCard` | `enable_credit_card` | hidden do switch de Cartão |
| `enableBankSlip` | `enable_bank_slip` | hidden do switch de Boleto |
| `emailImage1` | `banner_image` | ImageUpload na EmailTab |
| — (param de rota) | `account_reference` | `campaignId` dos route params |

`enable_whatsapp` e `enable_mail` são inferidos automaticamente: se a mensagem do canal estiver preenchida, o canal é ativado. Sem preenchimento → `false`.

---

## Arquivos novos

### `src/infra/schemas/internal/notificationSetting.ts`

Schema Zod para validação do body do formulário. Strings vindas do FormData são convertidas via `.transform()`:

- `days`: `z.string().transform(v => parseInt(v, 10))`
- `enableWhatsapp`, `enableMail`, `enablePix`, `enableCreditCard`, `enableBankSlip`: `z.string().transform(v => v === "true")`
- `whatsappMessage`, `mailSubject`, `mailMessage`: opcionais, default `""`
- `emailImage1`: opcional, string (URL retornada pelo `ImageUpload`), mapeada como `banner_image`
- `name`, `type`: `z.string().min(1)`

### `src/app/useCases/notificationSetting/createNotificationSettingUseCase.ts`

Recebe `accountUuid` + dados validados, delega ao gateway. Sem lógica de negócio adicional.

### `src/infra/controllers/notificationSetting/createNotificationSettingController.ts`

- Extrai `campaignId` de `route.params` — é o `accountUuid`
- Decodifica body via `DecodeRequestBodyAdapter`
- Valida com `SchemaValidatorAdapter(createNotificationSettingSchema)`
- Chama use case
- Retorna `{ toast: { type: "success", message: "Régua criada com sucesso" } }`
- Controllers de `donationApi` **não** verificam `AuthService` (conforme CLAUDE.md)

### `src/main/factories/notificationSetting/createNotificationSettingFactory.ts`

Instancia `NotificationSettingGateway` → `CreateNotificationSettingUseCase` → `CreateNotificationSettingController` e exporta `createNotificationSetting.handle`.

---

## Arquivos modificados

### `src/domain/gateways/notificationSetting.ts`

Adiciona ao type `NotificationSettingGatewayDTO`:

```ts
createNotificationSetting(
  accountUuid: string,
  data: CreateNotificationSettingData,
): Promise<void>;
```

`CreateNotificationSettingData` é um type local que espelha os campos de saída do `createNotificationSettingSchema` após os `.transform()` (booleans e number já convertidos).

### `src/infra/gateways/notificationSetting.ts`

Implementa `createNotificationSetting`: `POST /api/notifications_settings` via `donationApi` com `api-key` no header. Body mapeado de camelCase → snake_case. Se `!apiResponse.success`, lança `HttpAdapter.badGateway`.

### `src/main/routes/route.campaign.messageRules.tsx`

Adiciona `export async function action`:

```ts
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
```

### `src/client/pages/messageRules/components/new-billing-rule-dialog/index.tsx`

- Adiciona `useFetcher` — extrai `{ Form, state, data }`
- Envolve conteúdo em `<FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>`
- Substitui `<Dialog ...>` body por `<fetcher.Form method="post">`
- Adiciona `useActionToast(fetcher.data)`
- Adiciona `useEffect` que chama `onOpenChange(false)` quando `fetcher.state === "idle" && fetcher.data?.toast`
- Adiciona hidden inputs: `type`, `enablePix`, `enableCreditCard`, `enableBankSlip`
- Para `days`: quando `!showDaysField` → `<input type="hidden" name="days" value="0" />`; quando `showDaysField` → mantém o `<Input>` existente
- Botão Salvar: `<Button type="submit" name="_action" value="createNotificationSetting" isLoading={isSubmitting}>`

### `src/client/pages/messageRules/components/new-billing-rule-dialog/whatsapp-tab.tsx`

Adiciona ao final do JSX (dentro do form, fora do grid):

```tsx
<input type="hidden" name="enableWhatsapp" value={message.trim() ? "true" : "false"} />
```

### `src/client/pages/messageRules/components/new-billing-rule-dialog/email-tab.tsx`

- Adiciona `name="mailSubject"` no `<Input>` do assunto
- Adiciona `name="mailMessage"` no `<Textarea>` do corpo
- O `<ImageUpload name="emailImage1">` já tem `name` — será enviado como `banner_image` pelo gateway
- Adiciona hidden input para `enableMail`:

```tsx
<input
  type="hidden"
  name="enableMail"
  value={subject.trim() && body.trim() ? "true" : "false"}
/>
```

---

## Fluxo de dados (criação bem-sucedida)

1. Usuário preenche o dialog e clica em "Salvar"
2. `fetcher.Form` submete `POST` para a rota atual com `_action=createNotificationSetting`
3. Route `action` decodifica `_action`, delega para `createNotificationSetting.handle`
4. Controller valida body, chama use case → gateway → `donationApi`
5. Controller retorna `{ toast: { type: "success", message: "Régua criada com sucesso" } }`
6. `useActionToast` exibe o toast
7. `useEffect` fecha o dialog
8. React Router revalida o loader → lista atualizada automaticamente

---

## Tratamento de erros

- Erros de validação de campo: retornam via `ErrorHandlerAdapter` como `{ cause: { fieldErrors: {...} } }`, exibidos pelo `FormErrorProvider`
- Erros de API (bad gateway): retornam como toast de erro via `useActionToast`

---

## Fora de escopo

- Edição de régua existente
- Campos opcionais avançados: `flowbuilder_id`, `keyword_flow`, `whatsapp_template_id`, `whatsapp_type`
- Validação client-side de `payment_before_due_date` max=5 dias (a API retorna erro se inválido)
