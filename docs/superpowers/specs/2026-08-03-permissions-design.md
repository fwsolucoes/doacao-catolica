# Permission System Design

**Date:** 2026-08-03  
**Scope:** Client-side UI permission guards based on user role per campaign

---

## Overview

Implement a permission system that fetches the authenticated user's role and permissions for a given campaign from the API, injects them into a React context at the campaign layout level, and exposes `isPermissionGranted()` for components to conditionally render UI.

Permissions are enforced **client-side only** (UI hiding). No server-side loader/action guards.

---

## Flow

```
Request
└─ layout.campaignLayout (loader)
      ├─ getCampaign.handle(route)           → campaign (contains internal campaign.id)
      └─ Promise.all
            ├─ getCampaignOverview.handle(route)
            └─ getProjectPermissions.handle(route, campaign.id)
                  └─ GetProjectPermissionsController
                        └─ AuthService.getAuthStorage → user.id + token
                        └─ GetProjectPermissionsUseCase
                              └─ CampaignGateway.getProjectPermissions(projectId, userId, token)
                                    └─ GET /user/get-role/project-id/:id/user-id/:userId

React tree:
CampaignLayoutProvider  ← reads loader via useMatches("main/routes/layout.campaignLayout")
  └─ CampaignLayout (sidebar, outlet)
        └─ any child component
              └─ useCampaignLayout() → isPermissionGranted("VIEW_DONATIONS_LIST")
```

**Loader sequencing:** `getProjectPermissions` requires the internal `campaign.id` (not the URL param `campaignId`), so `getCampaign` runs first. Then `getCampaignOverview` and `getProjectPermissions` run in parallel.

---

## Permissions Catalog

15 permissions, identical to the reference project (`src/app/template/PROJECT_ALL_PERMISSIONS.ts`):

```
VIEW_FINANCIAL_METRICS, EXPORT_FINANCIAL_REPORTS, VIEW_DONATORS_LIST,
VIEW_DONATIONS_LIST, VIEW_SETTINGS, VIEW_SETTINGS_NOTIFICATION,
VIEW_SETTINGS_GENERAL, VIEW_SETTINGS_PAGE, VIEW_SETTINGS_PAYMENT,
VIEW_SETTINGS_FORM, VIEW_FINANCIAL_TRANSFERS, VIEW_FINANCIAL_STATEMENTS,
VIEW_NOTIFICATION_SENTS, VIEW_DONATOR_REPORTS, VIEW_FINANCIAL_REPORTS
```

---

## New Files (6)

| File | Purpose |
|---|---|
| `src/app/template/PROJECT_ALL_PERMISSIONS.ts` | Permissions catalog (`as const` array) |
| `src/infra/schemas/external/campaignPermissions.ts` | Zod schema for API response |
| `src/app/useCases/projectPermissions/getProjectPermissionsUseCase.ts` | Delegates to gateway |
| `src/infra/controllers/projectPermissions/getProjectPermissionsController.ts` | Extracts `user.id`+`token` from RouteDTO; receives `projectId` as second arg |
| `src/main/factories/projectPermissions/getProjectPermissionsFactory.ts` | Wires gateway → use case → controller |
| `src/client/hooks/useCampaignLayout.tsx` | `CampaignLayoutProvider` + `useCampaignLayout()` |

## Modified Files (5)

| File | Change |
|---|---|
| `src/domain/gateways/campaign.ts` | Add `GetProjectPermissionsOutput` type and method to `CampaignGatewayDTO` |
| `src/infra/gateways/campaign.ts` | Implement `getProjectPermissions` (dev bypass + SchemaValidatorAdapter) |
| `src/main/routes/layout.campaignLayout.tsx` | Update loader: sequential campaign fetch, then parallel overview+permissions |
| `src/client/types/campaignLayoutLoader.ts` | Add `projectPermissions: string[]` and `projectRole: { name: string }` |
| `src/client/layouts/campaignLayout/index.tsx` | Wrap JSX with `<CampaignLayoutProvider>` |

---

## Key Implementation Details

### API endpoint
```
GET /user/get-role/project-id/:projectId/user-id/:userId
```
- `projectId`: internal campaign ID (`campaign.id` from `getCampaign`)
- `userId`: `user.id` (string)
- Authenticated via `token` in API header

### Dev bypass
In `CampaignGateway.getProjectPermissions`, when `NODE_ENV === "development"`, return all permissions without hitting the API.

### Route ID for `useMatches`
```ts
matches.find(m => m.id === "main/routes/layout.campaignLayout")
```
Confirmed from generated types in `.react-router/types/`.

### Hook usage in components
```tsx
import { useCampaignLayout } from "~/client/hooks/useCampaignLayout";

function MyComponent() {
  const { isPermissionGranted } = useCampaignLayout();
  if (!isPermissionGranted("VIEW_DONATIONS_LIST")) return null;
  return <div>...</div>;
}
```

### Controller signature (differs from standard pattern)
Controllers normally receive only `RouteDTO`. `GetProjectPermissionsController.handle` receives `(route: RouteDTO, projectId: string)` because `projectId` is only available after `getCampaign` resolves.
