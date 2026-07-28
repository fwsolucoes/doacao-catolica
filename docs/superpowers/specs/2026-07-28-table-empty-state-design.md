# Table Empty State — Design Spec

**Date:** 2026-07-28  
**Status:** Approved

## Problem

Tables across the application handle the empty state inconsistently:
- Some use the `Empty` component manually (donors, myCampaigns)
- Some use plain centered text (collaborators, campaignGroups, transfers)
- Several have no empty state at all (paymentsTable, campaignNotifications, messageRules, birthdayCelebrantsTable)

## Solution

Add `Table.Empty` as a new subcomponent to the existing `Table` object in `src/client/components/ui/table.tsx`. It renders a full-width row using the existing `Empty` component, with sensible defaults and optional overrides.

## Component API

**File:** `src/client/components/ui/table.tsx`

```tsx
interface TableEmptyProps {
  title?: string;       // default: "Nenhum registro encontrado."
  description?: string; // default: undefined (not rendered)
  icon?: ReactNode;     // default: <Inbox /> from lucide-react
  className?: string;   // applied to Empty.Root
}
```

**Internal structure:**
```tsx
function Empty({ title = "Nenhum registro encontrado.", description, icon = <Inbox />, className }: TableEmptyProps) {
  return (
    <Row>
      <Cell colSpan={9999}>
        <EmptyComponent.Root className={cn("border-0 py-12", className)}>
          <EmptyComponent.Media variant="icon">{icon}</EmptyComponent.Media>
          <EmptyComponent.Header>
            <EmptyComponent.Title>{title}</EmptyComponent.Title>
            {description && <EmptyComponent.Description>{description}</EmptyComponent.Description>}
          </EmptyComponent.Header>
        </EmptyComponent.Root>
      </Cell>
    </Row>
  );
}
```

The internal component is named `Empty` locally to avoid collision with the imported `Empty` UI component — import alias: `import { Empty as EmptyComponent } from "./empty"`.

`colSpan={9999}` spans all columns regardless of count — browsers clamp to the actual column number automatically.

## Usage

Zero-config (generic default):
```tsx
{!data.length && <Table.Empty />}
```

With context:
```tsx
{!data.length && (
  <Table.Empty
    icon={<Users />}
    title="Nenhum doador encontrado"
    description="Tente ajustar os termos da busca."
  />
)}
```

## Tables to Update

| File | Current state | Action |
|---|---|---|
| `src/client/pages/collaborators/components/collaboratorsTable.tsx` | plain text | replace with `<Table.Empty />` |
| `src/client/pages/campaignGroups/components/campaignGroupsTable.tsx` | plain text | replace with `<Table.Empty />` |
| `src/client/pages/transfer/components/transfersTable.tsx` | plain text | replace with `<Table.Empty />` |
| `src/client/pages/donors/components/oneTimeDonorsTable.tsx` | manual `Empty` | replace, preserve icon/title/description |
| `src/client/pages/donors/components/recurringDonorsTable.tsx` | manual `Empty` | replace, preserve icon/title/description |
| `src/client/pages/myCampaigns/components/table/index.tsx` | manual `Empty` | replace |
| `src/client/pages/paymentStatements/components/paymentsTable/index.tsx` | none | add `<Table.Empty />` |
| `src/client/pages/campaignNotifications/index.tsx` | none | add `<Table.Empty />` |
| `src/client/pages/messageRules/components/other-messages-tab.tsx` | none | add `<Table.Empty />` |
| `src/client/pages/birthdayReport/components/birthdayCelebrantsTable.tsx` | none | add `<Table.Empty />` |

## Out of Scope

`campaignHome` card tables (`top-donors-card`, `recent-donations-card`, `channel-performance-card`) — these render hardcoded/metrics data and have no real empty state scenario.
