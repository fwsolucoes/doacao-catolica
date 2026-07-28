# Table Empty State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `Table.Empty` as a subcomponent of `Table` and apply it consistently across all tables in the application.

**Architecture:** A new `Empty` function is added to `src/client/components/ui/table.tsx`, internally composing the existing `Empty` UI component. All affected tables are updated to use `<Table.Empty />` in place of ad-hoc empty-state patterns.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, lucide-react, existing `Empty` UI component.

## Global Constraints

- Named exports only — no `export default`.
- Never use native HTML elements when a design system component exists.
- Use `cn()` for class merging (no `twMerge`, no template literals).
- Tailwind scale units preferred over arbitrary `[Xpx]` values.
- No `"use client"` directive anywhere.
- All UI text in Portuguese.
- File and identifier names in English.

---

### Task 1: Add `Table.Empty` subcomponent

**Files:**
- Modify: `src/client/components/ui/table.tsx`

**Interfaces:**
- Produces: `Table.Empty` — accepts `{ title?, description?, icon?, className? }`, all optional. Exported via the `Table` object.

- [ ] **Step 1: Add the `Empty` function to `table.tsx`**

Open `src/client/components/ui/table.tsx`. The file currently imports only `cn` and `ComponentProps`. Add the following:

```tsx
import { Inbox } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Empty as EmptyComponent } from "./empty";
import { cn } from "~/lib/utils";

// ... existing Root, Header, Body, Row, Head, Cell functions unchanged ...

type TableEmptyProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
};

function Empty({
  title = "Nenhum registro encontrado.",
  description,
  icon = <Inbox />,
  className,
}: TableEmptyProps) {
  return (
    <Row>
      <Cell colSpan={9999}>
        <EmptyComponent.Root className={cn("border-0 py-12", className)}>
          <EmptyComponent.Media variant="icon">{icon}</EmptyComponent.Media>
          <EmptyComponent.Header>
            <EmptyComponent.Title>{title}</EmptyComponent.Title>
            {description && (
              <EmptyComponent.Description>{description}</EmptyComponent.Description>
            )}
          </EmptyComponent.Header>
        </EmptyComponent.Root>
      </Cell>
    </Row>
  );
}

export const Table = { Root, Header, Body, Row, Head, Cell, Empty };
```

> Note: `colSpan={9999}` spans all columns regardless of count — browsers clamp automatically to the actual column number. The import alias `EmptyComponent` avoids collision with the local `Empty` function name.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors related to `table.tsx`.

---

### Task 2: Replace plain-text empty states

**Files:**
- Modify: `src/client/pages/collaborators/components/collaboratorsTable.tsx`
- Modify: `src/client/pages/campaignGroups/components/campaignGroupsTable.tsx`
- Modify: `src/client/pages/transfer/components/transfersTable.tsx`

**Interfaces:**
- Consumes: `Table.Empty` from Task 1.

- [ ] **Step 1: Update `collaboratorsTable.tsx`**

Find and replace the two plain-text empty rows inside `<Table.Body>`:

```tsx
// REMOVE this block:
{isActiveTab && !activeCollaborators.length && (
  <Table.Row>
    <Table.Cell
      colSpan={4}
      className="h-28 text-center text-muted-foreground"
    >
      Nenhum colaborador ativo encontrado.
    </Table.Cell>
  </Table.Row>
)}

{!isActiveTab && !pendingCollaborators.length && (
  <Table.Row>
    <Table.Cell
      colSpan={4}
      className="h-28 text-center text-muted-foreground"
    >
      Nenhum convite pendente encontrado.
    </Table.Cell>
  </Table.Row>
)}

// ADD in its place:
{isActiveTab && !activeCollaborators.length && (
  <Table.Empty title="Nenhum colaborador ativo encontrado." />
)}
{!isActiveTab && !pendingCollaborators.length && (
  <Table.Empty title="Nenhum convite pendente encontrado." />
)}
```

- [ ] **Step 2: Update `campaignGroupsTable.tsx`**

Find and replace the plain-text empty row inside `<Table.Body>`:

```tsx
// REMOVE:
{!campaignGroups.length && (
  <Table.Row>
    <Table.Cell
      colSpan={3}
      className="h-28 text-center text-muted-foreground"
    >
      Nenhum grupo de campanha encontrado.
    </Table.Cell>
  </Table.Row>
)}

// ADD:
{!campaignGroups.length && <Table.Empty />}
```

- [ ] **Step 3: Update `transfersTable.tsx`**

Find and replace the plain-text empty row inside `<Table.Body>`:

```tsx
// REMOVE:
{!transfers.data.length && (
  <Table.Row>
    <Table.Cell
      colSpan={6}
      className="h-28 text-center text-muted-foreground"
    >
      Nenhuma solicitação de saque encontrada.
    </Table.Cell>
  </Table.Row>
)}

// ADD:
{!transfers.data.length && <Table.Empty />}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 3: Replace manual `Empty` usage in donors tables

**Files:**
- Modify: `src/client/pages/donors/components/oneTimeDonorsTable.tsx`
- Modify: `src/client/pages/donors/components/recurringDonorsTable.tsx`

**Interfaces:**
- Consumes: `Table.Empty` from Task 1.

- [ ] **Step 1: Update `oneTimeDonorsTable.tsx`**

Remove the `import { Empty } from "~/client/components/ui/empty"` line (line 16) — it's no longer used directly.

Then replace the ternary in `<Table.Body>` with a flat structure:

```tsx
// REMOVE the entire ternary:
{oneTimeDonors.data.length === 0 ? (
  <Table.Row>
    <Table.Cell colSpan={6}>
      <Empty.Root className="py-12">
        <Empty.Media variant="icon">
          <Users />
        </Empty.Media>
        <Empty.Header>
          <Empty.Title>Nenhum doador encontrado</Empty.Title>
          <Empty.Description>
            {searchValue
              ? "Tente ajustar os termos da busca."
              : "Ainda não há doadores nesta categoria."}
          </Empty.Description>
        </Empty.Header>
      </Empty.Root>
    </Table.Cell>
  </Table.Row>
) : (
  oneTimeDonors.data.map((donor) => (
    <OneTimeDonorRow
      key={donor.transferUuid}
      donor={donor}
      currentUrl={currentUrl}
    />
  ))
)}

// ADD flat structure:
{oneTimeDonors.data.map((donor) => (
  <OneTimeDonorRow
    key={donor.transferUuid}
    donor={donor}
    currentUrl={currentUrl}
  />
))}
{!oneTimeDonors.data.length && (
  <Table.Empty
    icon={<Users />}
    title="Nenhum doador encontrado"
    description={
      searchValue
        ? "Tente ajustar os termos da busca."
        : "Ainda não há doadores nesta categoria."
    }
  />
)}
```

- [ ] **Step 2: Update `recurringDonorsTable.tsx`**

Remove the `import { Empty } from "~/client/components/ui/empty"` line (line 20) — it's no longer used directly.

Then replace the ternary in `<Table.Body>`:

```tsx
// REMOVE:
{donors.data.length === 0 ? (
  <Table.Row>
    <Table.Cell colSpan={10}>
      <Empty.Root className="py-12">
        <Empty.Media variant="icon">
          <Users />
        </Empty.Media>
        <Empty.Header>
          <Empty.Title>Nenhum doador encontrado</Empty.Title>
          <Empty.Description>
            {searchValue
              ? "Tente ajustar os termos da busca."
              : "Ainda não há doadores nesta categoria."}
          </Empty.Description>
        </Empty.Header>
      </Empty.Root>
    </Table.Cell>
  </Table.Row>
) : (
  donors.data.map((donor) => (
    <RecurringDonorRow
      key={donor.subscriptionUuid}
      donor={donor}
      setDialog={setDialog}
    />
  ))
)}

// ADD:
{donors.data.map((donor) => (
  <RecurringDonorRow
    key={donor.subscriptionUuid}
    donor={donor}
    setDialog={setDialog}
  />
))}
{!donors.data.length && (
  <Table.Empty
    icon={<Users />}
    title="Nenhum doador encontrado"
    description={
      searchValue
        ? "Tente ajustar os termos da busca."
        : "Ainda não há doadores nesta categoria."
    }
  />
)}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 4: Add empty state to tables with no handling

**Files:**
- Modify: `src/client/pages/paymentStatements/components/paymentsTable/index.tsx`
- Modify: `src/client/pages/campaignNotifications/index.tsx`
- Modify: `src/client/pages/messageRules/components/other-messages-tab.tsx`
- Modify: `src/client/pages/birthdayReport/components/birthdayCelebrantsTable.tsx`

**Interfaces:**
- Consumes: `Table.Empty` from Task 1.

- [ ] **Step 1: Update `paymentsTable/index.tsx`**

Inside `<Table.Body>`, after the `{data.map((payment) => (...))}` block, add:

```tsx
{!data.length && <Table.Empty />}
```

- [ ] **Step 2: Update `campaignNotifications/index.tsx`**

Inside `<Table.Body>`, after the `{notifications.data.map((item) => (...))}` block, add:

```tsx
{!notifications.data.length && <Table.Empty />}
```

- [ ] **Step 3: Update `other-messages-tab.tsx`**

Inside `<Table.Body>`, after the `{otherMessages.map((rule) => (...))}` block, add:

```tsx
{!otherMessages.length && <Table.Empty />}
```

- [ ] **Step 4: Update `birthdayCelebrantsTable.tsx`**

Inside `<Table.Body>`, after the `{data.map((celebrant) => (...))}` block, add:

```tsx
{!data.length && <Table.Empty />}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

## Notes

**`myCampaigns/components/table/index.tsx` is intentionally excluded.** Its empty state replaces the entire table with a full `Empty` component including a "Criar campanha" CTA button — a pattern `Table.Empty` doesn't support. It stays as-is.
