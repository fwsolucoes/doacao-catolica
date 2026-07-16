# Design: Split donorsTable.tsx into smaller components

## Context

`donorsTable.tsx` has grown to 712 lines and contains multiple unrelated responsibilities: tab navigation, toolbar, recurring donor table, one-time donor table, dialog management, and shared utilities. The goal is to split it into focused files without changing any behavior.

## Architecture

Three files in `src/client/pages/donors/components/`:

### `donorsTable.tsx` (trimmed orchestrator)

Keeps:
- Type aliases: `Tab`, `DonorRow` **(exported)**, `OneTimeDonorRow`, `DialogState`
- `TabButton` component (only used here)
- `DonorsTable` component: renders tab bar, toolbar (search + filter drawer), delegates table rendering to sub-components, manages `DialogState` for all dialogs

`DonorsTable` passes props to sub-tables:
- `RecurringDonorsTable` receives `donors`, `searchValue`, `setDialog`
- `OneTimeDonorsTable` receives `oneTimeDonors`, `currentUrl`, `searchValue`

### `recurringDonorsTable.tsx` (new)

Contains:
- `PAYMENT_METHOD_BADGE` constant
- `formatApiDate` helper (local)
- `ActionsPopover` component (depends on `DonorRow` type)
- `RecurringDonorRow` component (extracted from inline JSX in `DonorsTable`)
- `RecurringDonorsTable` component (exported) — renders the table, empty state, and pagination

### `oneTimeDonorsTable.tsx` (new)

Contains:
- `formatApiDate` helper (local duplicate — 2 lines, not worth extracting)
- `OneTimeDonorRow` component (moved from `donorsTable.tsx`)
- `OneTimeDonorsTable` component (exported) — renders the table, empty state, and pagination

## Shared utility

`buildWhatsAppHref` is used by both `ActionsPopover` and `OneTimeDonorRow`. It moves to `src/lib/buildWhatsAppHref.ts` as a pure exported function.

## Props interfaces

```ts
// RecurringDonorsTable
type RecurringDonorsTableProps = {
  donors: DonorsLoader["donors"];
  searchValue: string;
  setDialog: (state: DialogState) => void;  // imported from donorsTable.tsx
};

// OneTimeDonorsTable
type OneTimeDonorsTableProps = {
  oneTimeDonors: NonNullable<DonorsLoader["oneTimeDonors"]>;
  currentUrl: string;
  searchValue: string;
};
```

`DonorRow` is exported from `donorsTable.tsx` and imported by `recurringDonorsTable.tsx`.
`DialogState` is exported from `donorsTable.tsx` and imported by `recurringDonorsTable.tsx`.

## What does NOT change

- All dialog components (`UpdateRecurrenceDialog`, etc.) stay where they are and are still rendered by `DonorsTable`
- `useRoot()` usage inside `OneTimeDonorRow` stays
- `DonorsFilterDrawer` usage stays in `DonorsTable`
- No logic changes — pure structural split
