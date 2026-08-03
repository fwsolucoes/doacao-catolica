# Permission System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fetch the authenticated user's role and permissions for a campaign from the API, inject them into a React context at the campaign layout level, and expose `isPermissionGranted()` for components to conditionally render UI.

**Architecture:** Clean architecture pipeline — `CampaignGateway.getProjectPermissions` → `GetProjectPermissionsUseCase` → `GetProjectPermissionsController` → `getProjectPermissionsFactory` → called in `layout.campaignLayout` loader after `getCampaign`. A `CampaignLayoutProvider` wraps the layout and exposes `useCampaignLayout()` to child components.

**Tech Stack:** React Router v7 (SSR), React 19, TypeScript, Zod, `@arkyn/server` (HttpAdapter, SchemaValidatorAdapter), Tailwind CSS v4.

## Global Constraints

- No server-side guards — permissions are UI-only (hide elements, not block routes)
- No native HTML elements — always use design system components (`<Button>`, `<Input>`, etc.)
- Named React imports only — `import { useState } from "react"`, never `import * as React`
- All identifiers/filenames in English; UI text may be in Portuguese
- `user.id` (string) is the `userId` passed to the permissions API
- Dev bypass: when `NODE_ENV === "development"`, return all 15 permissions without hitting the API
- Verify each task with: `npm run typecheck` (runs `react-router typegen && tsc`)

---

## File Map

**New files:**
- `src/app/template/PROJECT_ALL_PERMISSIONS.ts` — `as const` array of 15 permissions
- `src/infra/schemas/external/campaignPermissions.ts` — Zod schema for `/user/get-role/...` response
- `src/app/useCases/projectPermissions/getProjectPermissionsUseCase.ts` — delegates to gateway
- `src/infra/controllers/projectPermissions/getProjectPermissionsController.ts` — extracts `user.id`+`token` from RouteDTO
- `src/main/factories/projectPermissions/getProjectPermissionsFactory.ts` — wires gateway → use case → controller
- `src/client/hooks/useCampaignLayout.tsx` — `CampaignLayoutProvider` + `useCampaignLayout()`

**Modified files:**
- `src/domain/gateways/campaign.ts` — add `GetProjectPermissionsOutput` type and method to `CampaignGatewayDTO`
- `src/infra/gateways/campaign.ts` — implement `getProjectPermissions`
- `src/main/routes/layout.campaignLayout.tsx` — update loader to call factory
- `src/client/layouts/campaignLayout/index.tsx` — wrap with `CampaignLayoutProvider`

> `src/client/types/campaignLayoutLoader.ts` — **no manual edit needed**: it infers from the loader's return type, so `projectPermissions` and `projectRole` appear automatically once the loader is updated.

---

### Task 1: Permissions catalog and API schema

**Files:**
- Create: `src/app/template/PROJECT_ALL_PERMISSIONS.ts`
- Create: `src/infra/schemas/external/campaignPermissions.ts`

**Interfaces:**
- Produces: `PROJECT_ALL_PERMISSIONS` (readonly string tuple, 15 entries); `externalCampaignPermissionsSchema` (Zod schema for API response)

- [ ] **Step 1: Create the permissions catalog**

Create `src/app/template/PROJECT_ALL_PERMISSIONS.ts`:

```ts
const PROJECT_ALL_PERMISSIONS = [
  "VIEW_FINANCIAL_METRICS",
  "EXPORT_FINANCIAL_REPORTS",
  "VIEW_DONATORS_LIST",
  "VIEW_DONATIONS_LIST",
  "VIEW_SETTINGS",
  "VIEW_SETTINGS_NOTIFICATION",
  "VIEW_SETTINGS_GENERAL",
  "VIEW_SETTINGS_PAGE",
  "VIEW_SETTINGS_PAYMENT",
  "VIEW_SETTINGS_FORM",
  "VIEW_FINANCIAL_TRANSFERS",
  "VIEW_FINANCIAL_STATEMENTS",
  "VIEW_NOTIFICATION_SENTS",
  "VIEW_DONATOR_REPORTS",
  "VIEW_FINANCIAL_REPORTS",
] as const;

export { PROJECT_ALL_PERMISSIONS };
```

- [ ] **Step 2: Create the external API schema**

Create `src/infra/schemas/external/campaignPermissions.ts`:

```ts
import { z } from "zod";

const externalCampaignPermissionsSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  user_id: z.number(),
  value: z.string(),
  status: z.boolean().optional(),
  role_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  project_role: z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    deleted_at: z.string().nullable(),
    project_role_permissions: z.array(
      z.object({
        project_permissions: z.object({
          id: z.string().uuid(),
          name: z.string(),
          description: z.string().nullable(),
          created_at: z.string().datetime(),
          updated_at: z.string().datetime(),
          deleted_at: z.string().nullable(),
        }),
      }),
    ),
  }),
});

export { externalCampaignPermissionsSchema };
```

- [ ] **Step 3: Verify types compile**

```bash
npm run typecheck
```

Expected: no errors.

---

### Task 2: Domain interface and gateway implementation

**Files:**
- Modify: `src/domain/gateways/campaign.ts`
- Modify: `src/infra/gateways/campaign.ts`

**Interfaces:**
- Consumes: `PROJECT_ALL_PERMISSIONS` from `~/app/template/PROJECT_ALL_PERMISSIONS`; `externalCampaignPermissionsSchema` from `~/infra/schemas/external/campaignPermissions`
- Produces: `GetProjectPermissionsOutput` type; `CampaignGateway.getProjectPermissions(projectId, userId, token)` method

- [ ] **Step 1: Add type and method signature to the domain interface**

In `src/domain/gateways/campaign.ts`, add the `GetProjectPermissionsOutput` type and method to `CampaignGatewayDTO`.

Add the type **above** the existing `type CampaignGatewayDTO`:

```ts
type GetProjectPermissionsOutput = {
  projectRole: { name: string };
  projectPermissions: string[];
};
```

Add the method to `CampaignGatewayDTO` (after the last existing method):

```ts
  getProjectPermissions: (
    projectId: string,
    userId: string,
    token: string,
  ) => Promise<GetProjectPermissionsOutput>;
```

Export the new type by adding it to the existing `export type { ... }` block:

```ts
export type {
  CampaignGatewayDTO,
  CreateCampaignInput,
  UpdateCampaignGeneralInfoInput,
  UpdateCampaignPageInput,
  GetProjectPermissionsOutput,
};
```

- [ ] **Step 2: Implement getProjectPermissions in CampaignGateway**

In `src/infra/gateways/campaign.ts`:

Add these imports at the top alongside the existing ones:

```ts
import { PROJECT_ALL_PERMISSIONS } from "~/app/template/PROJECT_ALL_PERMISSIONS";
import { externalCampaignPermissionsSchema } from "../schemas/external/campaignPermissions";
import type { GetProjectPermissionsOutput } from "~/domain/gateways/campaign";
```

Add the method inside the `CampaignGateway` class, after the last existing method:

```ts
  async getProjectPermissions(
    projectId: string,
    userId: string,
    token: string,
  ): Promise<GetProjectPermissionsOutput> {
    if (process.env.NODE_ENV === "development") {
      return {
        projectRole: { name: "Administrador" },
        projectPermissions: [...PROJECT_ALL_PERMISSIONS],
      };
    }

    const url = `/user/get-role/project-id/${projectId}/user-id/${userId}`;
    const apiResponse = await api.get(url, { token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      externalCampaignPermissionsSchema,
    );
    const data = schemaValidator.validate(apiResponse.response);

    return {
      projectRole: { name: data.project_role.name },
      projectPermissions: data.project_role.project_role_permissions.map(
        (p) => p.project_permissions.name,
      ),
    };
  }
```

- [ ] **Step 3: Verify types compile**

```bash
npm run typecheck
```

Expected: no errors. TypeScript will report an error if `CampaignGateway` does not satisfy `CampaignGatewayDTO` — this confirms the method signature is correct.

---

### Task 3: Use case, controller, and factory

**Files:**
- Create: `src/app/useCases/projectPermissions/getProjectPermissionsUseCase.ts`
- Create: `src/infra/controllers/projectPermissions/getProjectPermissionsController.ts`
- Create: `src/main/factories/projectPermissions/getProjectPermissionsFactory.ts`

**Interfaces:**
- Consumes: `CampaignGatewayDTO` and `GetProjectPermissionsOutput` from `~/domain/gateways/campaign`; `AuthService` from `~/infra/services/authService`; `HttpAdapter` from `~/infra/adapters/httpAdapter`; `CampaignGateway` from `~/infra/gateways/campaign`
- Produces: `getProjectPermissions.handle(route: RouteDTO, projectId: string)` — returns `Promise<GetProjectPermissionsOutput>`

- [ ] **Step 1: Create the use case**

Create `src/app/useCases/projectPermissions/getProjectPermissionsUseCase.ts`:

```ts
import type {
  CampaignGatewayDTO,
  GetProjectPermissionsOutput,
} from "~/domain/gateways/campaign";

type InputProps = {
  projectId: string;
  userId: string;
  token: string;
};

class GetProjectPermissionsUseCase {
  constructor(private campaignGateway: CampaignGatewayDTO) {}

  async execute(input: InputProps): Promise<GetProjectPermissionsOutput> {
    const { projectId, userId, token } = input;
    return this.campaignGateway.getProjectPermissions(projectId, userId, token);
  }
}

export { GetProjectPermissionsUseCase };
```

- [ ] **Step 2: Create the controller**

Create `src/infra/controllers/projectPermissions/getProjectPermissionsController.ts`:

```ts
import type { GetProjectPermissionsUseCase } from "~/app/useCases/projectPermissions/getProjectPermissionsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class GetProjectPermissionsController {
  constructor(private useCase: GetProjectPermissionsUseCase) {}

  async handle(route: RouteDTO, projectId: string) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    return this.useCase.execute({
      projectId,
      userId: user.id,
      token: user.token,
    });
  }
}

export { GetProjectPermissionsController };
```

- [ ] **Step 3: Create the factory**

Create `src/main/factories/projectPermissions/getProjectPermissionsFactory.ts`:

```ts
import { GetProjectPermissionsUseCase } from "~/app/useCases/projectPermissions/getProjectPermissionsUseCase";
import { GetProjectPermissionsController } from "~/infra/controllers/projectPermissions/getProjectPermissionsController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const getProjectPermissionsUseCase = new GetProjectPermissionsUseCase(
  campaignGateway,
);
const getProjectPermissionsController = new GetProjectPermissionsController(
  getProjectPermissionsUseCase,
);

const getProjectPermissions = {
  handle: getProjectPermissionsController.handle.bind(
    getProjectPermissionsController,
  ),
};

export { getProjectPermissions };
```

- [ ] **Step 4: Verify types compile**

```bash
npm run typecheck
```

Expected: no errors.

---

### Task 4: Loader update

**Files:**
- Modify: `src/main/routes/layout.campaignLayout.tsx`

**Interfaces:**
- Consumes: `getProjectPermissions.handle` from `~/main/factories/projectPermissions/getProjectPermissionsFactory`
- Produces: loader now returns `{ campaign, overview, projectRole: { name: string }, projectPermissions: string[] }` — `CampaignLayoutLoader` type in `~/client/types/campaignLayoutLoader.ts` updates automatically via TypeScript inference, no manual edit needed

- [ ] **Step 1: Update the loader**

Replace the full content of `src/main/routes/layout.campaignLayout.tsx`:

```tsx
import type { Route } from "+/layout.campaignLayout";
import { redirect } from "react-router";
import { CampaignLayout } from "~/client/layouts/campaignLayout";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getCampaignOverview } from "../factories/campaignOverview/getCampaignOverviewFactory";
import { getCampaign } from "../factories/campaign/getCampaignFactory";
import { getProjectPermissions } from "../factories/projectPermissions/getProjectPermissionsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const campaign = await getCampaign.handle(adaptedRoute);

  const [overview, permissions] = await Promise.all([
    getCampaignOverview.handle(adaptedRoute),
    getProjectPermissions.handle(adaptedRoute, campaign.id),
  ]);

  return { campaign, overview, ...permissions };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default CampaignLayout;
```

**Why sequential then parallel:** `getProjectPermissions` needs `campaign.id` (the internal API ID, not the URL param `campaignId`), so `getCampaign` must resolve first. `getCampaignOverview` does not need it, so both run in parallel after.

- [ ] **Step 2: Verify types compile**

```bash
npm run typecheck
```

Expected: no errors. The `CampaignLayoutLoader` type in `~/client/types/campaignLayoutLoader.ts` now includes `projectPermissions: string[]` and `projectRole: { name: string }` automatically.

---

### Task 5: React context, hook, and layout wrapper

**Files:**
- Create: `src/client/hooks/useCampaignLayout.tsx`
- Modify: `src/client/layouts/campaignLayout/index.tsx`

**Interfaces:**
- Consumes: `CampaignLayoutLoader` from `~/client/types/campaignLayoutLoader`; `PROJECT_ALL_PERMISSIONS` from `~/app/template/PROJECT_ALL_PERMISSIONS`; route ID `"main/routes/layout.campaignLayout"` (confirmed from `.react-router/types/`)
- Produces: `useCampaignLayout()` hook exposing `isPermissionGranted(permission: PermissionType): boolean`

- [ ] **Step 1: Create the hook and provider**

Create `src/client/hooks/useCampaignLayout.tsx`:

```tsx
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useMatches } from "react-router";
import { PROJECT_ALL_PERMISSIONS } from "~/app/template/PROJECT_ALL_PERMISSIONS";
import type { CampaignLayoutLoader } from "~/client/types/campaignLayoutLoader";

type PermissionType = (typeof PROJECT_ALL_PERMISSIONS)[number];

type CampaignLayoutContextType = {
  isPermissionGranted: (permission: PermissionType) => boolean;
};

const CampaignLayoutContext = createContext<CampaignLayoutContextType>(
  {} as CampaignLayoutContextType,
);

function useCampaignLayout() {
  const contextData = useContext(CampaignLayoutContext);
  if (Object.entries(contextData).length === 0) {
    throw new Error(
      "useCampaignLayout must be used within a CampaignLayoutProvider",
    );
  }
  return contextData;
}

const CampaignLayoutProvider = ({ children }: { children: ReactNode }) => {
  const matches = useMatches();
  const match = matches.find(
    (m) => m.id === "main/routes/layout.campaignLayout",
  );

  function isPermissionGranted(permission: PermissionType) {
    const { projectPermissions } = match?.data as CampaignLayoutLoader;
    return projectPermissions.includes(permission);
  }

  return (
    <CampaignLayoutContext.Provider value={{ isPermissionGranted }}>
      {children}
    </CampaignLayoutContext.Provider>
  );
};

export { CampaignLayoutProvider, useCampaignLayout };
```

- [ ] **Step 2: Wrap CampaignLayout with the provider**

Replace the full content of `src/client/layouts/campaignLayout/index.tsx`:

```tsx
import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "~/client/components/ui/sidebar";
import { CampaignLayoutProvider } from "~/client/hooks/useCampaignLayout";
import { CampaignBanner } from "./components/campaignBanner";
import { AppSidebar } from "./components/sidebar";

function CampaignLayout() {
  return (
    <CampaignLayoutProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <CampaignBanner />
          <main className="p-4 sm:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </CampaignLayoutProvider>
  );
}

export { CampaignLayout };
```

- [ ] **Step 3: Verify types compile**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Start the dev server and verify in the browser**

```bash
npm run dev
```

Navigate to any campaign route (e.g. `/campaign/:campaignId/home`). Open the browser console — there should be no React errors about missing context. The page should render normally.

- [ ] **Step 5: Smoke-test isPermissionGranted in a component**

In any existing campaign page component, add a temporary test:

```tsx
import { useCampaignLayout } from "~/client/hooks/useCampaignLayout";

// inside the component:
const { isPermissionGranted } = useCampaignLayout();
console.log("VIEW_DONATIONS_LIST:", isPermissionGranted("VIEW_DONATIONS_LIST"));
```

Expected in dev: `true` (dev bypass returns all permissions). Remove this temporary log after confirming.

---

## Usage Reference

Once the system is in place, guard any UI element like this:

```tsx
import { useCampaignLayout } from "~/client/hooks/useCampaignLayout";

function MyComponent() {
  const { isPermissionGranted } = useCampaignLayout();

  if (!isPermissionGranted("VIEW_DONATIONS_LIST")) return null;

  return <div>Conteúdo restrito</div>;
}
```

`useCampaignLayout` can only be used inside components rendered within the `campaign/:campaignId` route tree (i.e., children of `CampaignLayout`). Using it outside that tree throws an error.
