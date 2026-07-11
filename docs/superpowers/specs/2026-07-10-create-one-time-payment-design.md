# Create One-Time Payment — Design Spec

**Date:** 2026-07-10  
**Status:** Approved

## Overview

Tela para criar um pagamento avulso (pontual) a partir de uma campanha. Acessada via o `DropdownMenuItem` "Criar pagamento avulso" na `PaymentsTable` da tela `payment-statements`. Dois modos de operação: online (gera link de pagamento) e offline (registra pagamento já recebido).

## Route

`/campaign/:campaignId/create-one-time-payment`

Adicionada em `src/routes.ts` dentro do bloco `campaign/:campaignId`.

## Files

### New files

| File | Purpose |
|------|---------|
| `src/main/routes/route.campaign.createOneTimePayment.tsx` | Route adapter (loader + action + ErrorBoundary) |
| `src/client/pages/createOneTimePayment/index.tsx` | Page component |
| `src/client/types/createOneTimePaymentLoader.ts` | Loader return type |
| `src/infra/schemas/internal/oneTimePayment.ts` | Zod validation schema |
| `src/infra/controllers/createOneTimePayment/createOneTimePaymentController.ts` | Controller |
| `src/app/useCases/createOneTimePayment/createOneTimePaymentUseCase.ts` | Use case — online mode |
| `src/app/useCases/createOneTimePayment/registerOfflinePaymentUseCase.ts` | Use case — offline mode |
| `src/main/factories/createOneTimePayment/createOneTimePaymentFactory.ts` | Factory |

### Modified files

| File | Change |
|------|--------|
| `src/routes.ts` | Add `create-one-time-payment` route under `campaign/:campaignId` |
| `src/client/pages/paymentStatements/components/paymentsTable/index.tsx` | Wire `Link` to existing "Criar pagamento avulso" `DropdownMenuItem` |

## Loader

Reuses existing factories — no new factories needed:
- `listContacts.handle(adaptedRoute)` — for contact Combobox
- `getCampaign.handle(adaptedRoute)` — for campaign info (accountId, type)
- `findOneContact.handle(adaptedRoute)` — conditional on `contactPublicId` query param

Returns `{ contacts, campaign, contactDetail }` — identical shape to `createRecurrenceLoader`.

## Page UI

### Layout

Same structure as `create-recurrence`: back button + title header, two `Card.Root` sections, footer with Cancel/Submit.

**Title:** "Criar pagamento avulso"  
**Back link:** `/campaign/:campaignId/payment-statements`

### Card 1 — Contato

Identical to `create-recurrence`:
- `Combobox` for contact search (navigates with `?contactPublicId=` on change)
- `ContactDetailCard` shown when a contact is selected

### Card 2 — Pagamento

Top-level `Select` switches between modes:

```
name="paymentOption"
options:
  - { value: "onlinePayment",    label: "Gerar link de pagamento online" }
  - { value: "receivedPayment",  label: "Registrar pagamento recebido (offline)" }
```

#### Online mode fields (`paymentOption === "onlinePayment"`)

| Field name | Component | Required | Notes |
|---|---|---|---|
| `paymentType` | `Select` (Pix / Boleto) | Yes | |
| `amount` | `CurrencyInput` | Yes | Min R$ 5,00 |
| `description` | `Textarea` | No | |

#### Offline mode fields (`paymentOption === "receivedPayment"`)

| Field name | Component | Required | Notes |
|---|---|---|---|
| `amount` | `CurrencyInput` | Yes | Label "Valor recebido" |
| `paymentDate` | `Input type="date"` | No | Default: today (YYYY-MM-DD) |
| `method` | `Select` | Yes | Static options (see below) |
| `bankAccount` | `Input type="text"` | No | |
| `observations` | `Textarea` | No | |

Static payment method options for offline:
- Pix
- Boleto
- Dinheiro
- Transferência
- Cheque
- TED/DOC

> **Future work:** Replace static list with API-loaded payment methods once the payment methods CRUD is implemented.

No notification switch — not present in the original one-time payment flow.

### Footer

```
[Cancelar]  [Salvar pagamento]
```

Cancelar links back to `/campaign/:campaignId/payment-statements`.  
Submit button disabled while submitting or when no contact is selected.

## Action

The controller reads `paymentOption` from the form body and branches:

- `onlinePayment` → `createOneTimePaymentUseCase.execute(...)` with `{ contactId, accountId, campaignId, category, paymentType, amount, description }`
- `receivedPayment` → `registerOfflinePaymentUseCase.execute(...)` with `{ contactId, accountId, campaignId, category, amount, paymentDate, method, bankAccount, observations }`

Both use cases call `donationApi`. The actual API call is commented out (matching `createRecurrenceController` pattern) until endpoints are available.

On success: toast `"Pagamento avulso criado com sucesso!"` + redirect to `payment-statements`.

## Validation Schema (Zod)

Common fields validated unconditionally: `contactId`, `paymentOption`, `accountId`, `category`.

Conditional fields via `.superRefine`:
- If `paymentOption === "onlinePayment"`: require `paymentType`, `amount`
- If `paymentOption === "receivedPayment"`: require `amount`, `method`

## Hidden form fields

Same pattern as `create-recurrence`:
- `<input type="hidden" name="accountId" value={campaign.accountId} />`
- `<input type="hidden" name="category" value={category} />`
- `<input type="hidden" name="contactId" value={contactDetail?.contactId ?? ""} />`
- `<input type="hidden" name="contactName" value={contactDetail?.name ?? ""} />`

## Navigation wiring

In `paymentsTable/index.tsx`, the existing `DropdownMenuItem`:

```tsx
<DropdownMenuItem>
  <Zap size={16} className="text-foreground" />
  Criar pagamento avulso
</DropdownMenuItem>
```

Becomes:

```tsx
<DropdownMenuItem asChild>
  <Link to={`/campaign/${campaignId}/create-one-time-payment`}>
    <Zap size={16} className="text-foreground" />
    Criar pagamento avulso
  </Link>
</DropdownMenuItem>
```

## Out of scope

- Payment methods CRUD (next task after this one)
- Notification switch for one-time payments
- Actual donationApi endpoint integration (uncommented after endpoints are available)
