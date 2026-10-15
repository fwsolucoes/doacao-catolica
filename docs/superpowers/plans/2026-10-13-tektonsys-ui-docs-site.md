# tektonsys-ui Docs Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-scaffold `tektonsys-ui` as a React Router v7 app whose own alias configuration points straight at `registry/new-york/{ui,hooks,lib}`, then build a documentation site on top of it — a catalog page plus a per-item page with live preview, install command, variants and source code for the 42 UI components, and a simpler page (description + install + usage snippet) for the 6 non-visual items (`utils`, `theme`, 4 hooks).

**Architecture:** One React Router v7 SPA (`ssr: false`) with three routes: `_index` (catalog grouped by `registry:type`, read straight from `registry.json`), `route.components.$name` (per-UI-component page, demo resolved via `import.meta.glob` over `registry/new-york/examples/*-demo.tsx`), `route.other.$name` (per non-visual item page). Every demo file imports the real component through the same `~/client/components/ui/*` alias a consumer uses after `npx shadcn add`, so the app compiles the registry's own source as its real dependency tree — no more excluding `registry/` from the TypeScript program.

**Tech Stack:** React Router v7 (framework mode, SPA), Vite, `vite-tsconfig-paths`, Tailwind v4, tailwind-variants, Radix UI, same dependency set already declared across the 48 registry items.

**Spec:** `docs/superpowers/specs/2026-10-13-tektonsys-ui-docs-site-design.md` (revises `docs/superpowers/specs/2026-10-07-design-system-registry-design.md`)

**Depends on:** `docs/superpowers/plans/2026-10-07-tektonsys-ui-registry.md` Tasks 2–10, already executed — `registry.json` (48 items) and `registry/new-york/{ui,hooks,lib,theme}/` already exist in `/var/www/testes/tektonsys-ui` and must not be recreated, only preserved through the re-scaffold.

## Global Constraints

- `/var/www/testes/tektonsys-ui` currently has **nothing committed except the original Next.js scaffold's initial commit** — `registry.json`, `registry/`, and all later edits are uncommitted working-tree content. Every task in this plan must preserve that content; no step may run `git clean`, `git checkout .`, `rm -rf` on the repo root, or any other command that could discard it without first confirming it's backed up.
- No commit steps in this plan — the user reviews everything in their IDE and commits manually (standing project preference).
- Aliases: `~/client/components/ui/*` → `registry/new-york/ui/*`, `~/client/hooks/*` → `registry/new-york/hooks/*`, `~/lib/*` → `registry/new-york/lib/*`. Every demo file and every route uses these aliases, never a relative path into `registry/`.
- Every demo file's default export is a React component with no required props (so it can be rendered with zero configuration from the docs route).
- `ssr: false` (SPA mode) — this is a documentation site with no secrets or SEO requirement; it removes the need for a Node server adapter and keeps deployment to Vercel a plain static build, consistent with the already-deployed Vercel project.

## Review Focus

- **A demo file importing a component whose real API differs from what's written here:** every demo below was written after reading the actual `.tsx` source in `registry/new-york/ui/`, not guessed from the component name — but the registry's own content could still drift between when this plan was written and when it's executed. Each task's build step (`npm run typecheck`) is the net that catches a demo calling a prop that no longer exists.
- **`import.meta.glob` key mismatch:** the glob pattern and the key constructed from `params.name` must match in both route files, or a valid component silently renders "Sem preview disponível." Task 2's walking-skeleton step explicitly checks this in the browser, not just via typecheck (a mismatched glob key is syntactically valid TypeScript).
- **Hook usage-snippet import path vs. export name mismatch:** `use-mobile.ts` exports `useIsMobile` (not `useMobile`) — a naive filename-to-export-name derivation breaks silently for this one item. Task 2 hardcodes a 4-entry lookup table instead of deriving the name, and Task 7's manual check includes visiting `/other/use-mobile` specifically.
- **Losing the uncommitted `registry.json`/`registry/` content during re-scaffold:** Task 1 scaffolds into a temporary sibling directory and merges, never scaffolding in place over the existing repo — this is the guard against the Global Constraint above.
- **Sonner demo rendering nothing:** `sonner-demo.tsx` calls `toast.success(...)`, which is a no-op unless a `<Toaster />` is mounted somewhere in the tree. Task 1 mounts it once in the root layout; Task 3's manual check (visiting `/components/sonner` and clicking the button) is what actually proves this, not the build passing.

---

## Task 1: Re-scaffold as React Router v7, preserve registry content, wire aliases

**Files:**
- Create: `/var/www/testes/tektonsys-ui/app/root.tsx`, `app/routes.ts`, `app/routes/_index.tsx` (placeholder), `vite.config.ts`, `react-router.config.ts`, `tsconfig.json`, `package.json` (replaced)
- Preserve unchanged: `/var/www/testes/tektonsys-ui/registry.json`, `registry/new-york/{ui,hooks,lib,theme}/`, `.git/`
- Delete: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/favicon.ico`, `components/`, `hooks/`, `lib/`, `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.next/`, `components.json` (the Next.js one), `node_modules/`, `package-lock.json`, `AGENTS.md`, `CLAUDE.md`, `README.md` (Next.js scaffold boilerplate)

**Interfaces:**
- Produces: a working `npm run dev` / `npm run build` React Router v7 app, with `~/client/components/ui/*`, `~/client/hooks/*`, `~/lib/*` resolving into `registry/new-york/`, and the theme CSS + a `<Toaster />` mounted globally via `app/root.tsx`.

- [ ] **Step 1: Confirm what must survive, before touching anything**

```bash
cd /var/www/testes/tektonsys-ui
git status --short
ls registry.json registry/new-york/ui | head -5
```

Expected: `git status --short` shows the same uncommitted files as before (`registry.json`, `registry/`, and the modified `.gitignore`/`package.json`/`tsconfig.json` from the earlier Next.js work); `registry.json` and `registry/new-york/ui` exist. If this doesn't match, STOP — do not proceed with deletion until the discrepancy is understood.

- [ ] **Step 2: Scaffold a fresh React Router v7 app into a temporary sibling directory**

```bash
cd /var/www/testes
npx create-react-router@latest tektonsys-ui-rr7-tmp
```

The CLI may prompt for a template or package manager choice (similar to how the earlier `shadcn init` run surprised us with unannounced prompts) — pick the default TypeScript + Tailwind template, npm as the package manager, and decline automatic git init (this temp directory is throwaway). If a flag can skip the prompts non-interactively (e.g. `-y`/`--yes` or a `--template` option the CLI reports in its own `--help`), use it; otherwise answer interactively with the choices above. Record whatever actually worked as a ledger note — this mirrors the ruling made for the Next.js scaffold's own undocumented prompts.

- [ ] **Step 3: Verify the temp scaffold works standalone**

```bash
cd /var/www/testes/tektonsys-ui-rr7-tmp
npm install
npm run build
```

Expected: both commands exit 0.

- [ ] **Step 4: Remove the Next.js-specific files from `tektonsys-ui`, keeping `registry.json`, `registry/`, and `.git`**

```bash
cd /var/www/testes/tektonsys-ui
rm -rf app components hooks lib node_modules .next
rm -f next.config.ts next-env.d.ts postcss.config.mjs eslint.config.mjs \
      components.json package-lock.json AGENTS.md CLAUDE.md README.md
```

- [ ] **Step 5: Copy the fresh scaffold's structure in, then delete the temp directory**

```bash
cp -r /var/www/testes/tektonsys-ui-rr7-tmp/app /var/www/testes/tektonsys-ui/app
cp /var/www/testes/tektonsys-ui-rr7-tmp/vite.config.ts /var/www/testes/tektonsys-ui/vite.config.ts
cp /var/www/testes/tektonsys-ui-rr7-tmp/react-router.config.ts /var/www/testes/tektonsys-ui/react-router.config.ts
cp /var/www/testes/tektonsys-ui-rr7-tmp/tsconfig.json /var/www/testes/tektonsys-ui/tsconfig.json
cp /var/www/testes/tektonsys-ui-rr7-tmp/package.json /var/www/testes/tektonsys-ui/package.json
cp /var/www/testes/tektonsys-ui-rr7-tmp/.gitignore /var/www/testes/tektonsys-ui/.gitignore
rm -rf /var/www/testes/tektonsys-ui-rr7-tmp
```

- [ ] **Step 6: Edit `tsconfig.json` — add the three aliases pointing into `registry/new-york/`**

Open `/var/www/testes/tektonsys-ui/tsconfig.json` and edit the `compilerOptions.paths` object (keep whatever the scaffold already put there, e.g. `~/*`, and add these three *above* it so they win on longest-match):

```json
{
  "compilerOptions": {
    "paths": {
      "~/client/components/ui/*": ["./registry/new-york/ui/*"],
      "~/client/hooks/*": ["./registry/new-york/hooks/*"],
      "~/lib/*": ["./registry/new-york/lib/*"],
      "~/*": ["./app/*"]
    }
  }
}
```

- [ ] **Step 7: Install `vite-tsconfig-paths` and wire it into `vite.config.ts`**

```bash
cd /var/www/testes/tektonsys-ui
npm install -D vite-tsconfig-paths
```

Edit `vite.config.ts`:

```ts
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
```

- [ ] **Step 8: Set SPA mode in `react-router.config.ts`**

```ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
} satisfies Config;
```

- [ ] **Step 9: Install the runtime packages the registry's own components need**

```bash
cd /var/www/testes/tektonsys-ui
npm install clsx tailwind-merge tailwind-variants radix-ui @radix-ui/react-slot \
  @radix-ui/react-checkbox lucide-react sonner cmdk react-phone-number-input
npm install -D shadcn
```

- [ ] **Step 10: Add the `prebuild` script**

Edit `package.json`'s `scripts`:

```json
{
  "scripts": {
    "dev": "react-router dev",
    "prebuild": "shadcn build",
    "build": "react-router build",
    "typecheck": "react-router typegen && tsc --noEmit"
  }
}
```

- [ ] **Step 11: Write `app/root.tsx`** — mounts the theme CSS and the `<Toaster />` globally

```tsx
import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Toaster } from "~/client/components/ui/sonner";
import "../registry/new-york/theme/tailwind.css";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
```

- [ ] **Step 12: Write a placeholder `app/routes/_index.tsx` and `app/routes.ts`** (full catalog comes in Task 2 — this step only proves the pipeline end to end)

```tsx
// app/routes/_index.tsx
export default function Index() {
  return <p className="p-8">tektonsys-ui</p>;
}
```

```ts
// app/routes.ts
import { type RouteConfig, index } from "@react-router/dev/routes";

export default [index("routes/_index.tsx")] satisfies RouteConfig;
```

- [ ] **Step 13: Build clean and verify**

```bash
cd /var/www/testes/tektonsys-ui
rm -rf public/r build .react-router
npm run build
```

Expected: `shadcn build` (via `prebuild`) reports building all 48 existing items, then `react-router build` succeeds with no TypeScript errors. This proves the alias rewiring compiles the real `registry/new-york/` source — if it fails on a missing module, the alias in Step 6 or a package from Step 9 is the likely cause.

- [ ] **Step 14: Confirm `registry.json` and `registry/` are untouched**

```bash
cd /var/www/testes/tektonsys-ui
git status --short registry.json registry/
diff <(git show HEAD:registry.json 2>/dev/null || echo "not in git, expected") /dev/null > /dev/null; echo "(expected to differ from HEAD — registry.json was never committed; this just confirms the file still exists and is non-empty)"
wc -l registry.json
find registry/new-york -type f | wc -l
```

Expected: `registry.json` still has substantial content (not 0 lines), and `registry/new-york` still has 48 files — the same counts as before this task started.

---

## Task 2: Walking skeleton — all 3 routes, one UI demo, one non-visual item

**Files:**
- Create: `registry/new-york/examples/button-demo.tsx`
- Modify: `registry.json` (add `example-button` item)
- Create: `app/routes/_index.tsx` (replace placeholder), `app/routes/route.components.$name.tsx`, `app/routes/route.other.$name.tsx`
- Modify: `app/routes.ts`

**Interfaces:**
- Consumes: `registry.json`'s existing `items` array (read directly, no new data layer); the alias scheme from Task 1.
- Produces: the full routing/demo-resolution pattern that Tasks 3–6 repeat mechanically — `HOOK_INFO` lookup table (consumed by `route.other.$name.tsx`), the `import.meta.glob` key convention `/registry/new-york/examples/${name}-demo.tsx`.

- [ ] **Step 1: Write the first demo file**

```tsx
// registry/new-york/examples/button-demo.tsx
import { Button } from "~/client/components/ui/button";

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  );
}
```

- [ ] **Step 2: Register it in `registry.json`**

Add to the `items` array (after the `button` item, or anywhere — order doesn't matter to `shadcn build`):

```json
{
  "name": "example-button",
  "type": "registry:component",
  "title": "Button example",
  "description": "Usage example for the Button component.",
  "registryDependencies": ["button"],
  "files": [
    { "path": "registry/new-york/examples/button-demo.tsx", "type": "registry:component" }
  ]
}
```

- [ ] **Step 3: Write `app/routes/_index.tsx`**

```tsx
// app/routes/_index.tsx
import { Link } from "react-router";
import registryData from "../../registry.json";

type RegistryItem = {
  name: string;
  type: string;
  title?: string;
  description?: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  "registry:ui": "Componentes",
  "registry:hook": "Hooks",
  "registry:lib": "Utilitários",
  "registry:file": "Utilitários",
};

export function loader() {
  const items = (registryData.items as RegistryItem[]).filter(
    (item) => !item.name.startsWith("example-"),
  );
  const groups = new Map<string, RegistryItem[]>();
  for (const item of items) {
    const label = CATEGORY_LABELS[item.type] ?? "Outros";
    groups.set(label, [...(groups.get(label) ?? []), item]);
  }
  return { groups: Array.from(groups.entries()) };
}

export default function Index({
  loaderData,
}: {
  loaderData: { groups: [string, RegistryItem[]][] };
}) {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-2xl font-bold">tektonsys-ui</h1>
      {loaderData.groups.map(([label, items]) => (
        <section key={label} className="mb-8">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {label}
          </h2>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {items.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.type === "registry:ui" ? `/components/${item.name}` : `/other/${item.name}`}
                  className="block rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
                >
                  {item.title ?? item.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Write `app/routes/route.components.$name.tsx`**

```tsx
// app/routes/route.components.$name.tsx
import { lazy, Suspense, useMemo, type ComponentType } from "react";
import { data, Link } from "react-router";
import registryData from "../../registry.json";
import type { Route } from "./+types/route.components.$name";

type RegistryItem = { name: string; type: string; title?: string; description?: string };

const demoModules = import.meta.glob<{ default: ComponentType }>(
  "/registry/new-york/examples/*-demo.tsx",
);
const demoSources = import.meta.glob("/registry/new-york/examples/*-demo.tsx", {
  query: "?raw",
  import: "default",
});

export async function loader({ params }: Route.LoaderArgs) {
  const item = (registryData.items as RegistryItem[]).find(
    (i) => i.name === params.name && i.type === "registry:ui",
  );
  if (!item) throw data("Componente não encontrado", { status: 404 });

  const demoKey = `/registry/new-york/examples/${params.name}-demo.tsx`;
  const hasDemo = demoKey in demoModules;
  const source = hasDemo ? ((await (demoSources[demoKey] as () => Promise<string>)()) as string) : null;

  return { item, demoKey: hasDemo ? demoKey : null, source };
}

function DemoRenderer({ demoKey }: { demoKey: string }) {
  const Demo = useMemo(() => lazy(demoModules[demoKey]), [demoKey]);
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Carregando...</p>}>
      <Demo />
    </Suspense>
  );
}

export default function ComponentPage({ loaderData }: Route.ComponentProps) {
  const { item, demoKey, source } = loaderData;
  return (
    <div className="mx-auto max-w-3xl p-8">
      <Link to="/" className="text-sm text-muted-foreground">
        ← Voltar
      </Link>
      <h1 className="mt-2 text-2xl font-bold">{item.title ?? item.name}</h1>
      {item.description && <p className="mt-1 text-muted-foreground">{item.description}</p>}

      <section className="mt-6 rounded-lg border border-border p-8">
        {demoKey ? <DemoRenderer demoKey={demoKey} /> : (
          <p className="text-sm text-muted-foreground">Sem preview disponível.</p>
        )}
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold">Instalação</h2>
        <pre className="overflow-x-auto rounded-md bg-muted p-3 text-sm">
          <code>{`npx shadcn add @ds/${item.name}`}</code>
        </pre>
      </section>

      {source && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold">Código</h2>
          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-sm">
            <code>{source}</code>
          </pre>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Write `app/routes/route.other.$name.tsx`**

```tsx
// app/routes/route.other.$name.tsx
import { data, Link } from "react-router";
import registryData from "../../registry.json";
import type { Route } from "./+types/route.other.$name";

type RegistryItem = { name: string; type: string; title?: string; description?: string };

const HOOK_INFO: Record<string, { importPath: string; exportName: string }> = {
  "use-mobile": { importPath: "~/client/hooks/use-mobile", exportName: "useIsMobile" },
  "use-theme": { importPath: "~/client/hooks/useTheme", exportName: "useTheme" },
  "use-filter": { importPath: "~/client/hooks/useFilter", exportName: "useFilter" },
  "use-query-toast": { importPath: "~/client/hooks/useQueryToast", exportName: "useQueryToast" },
};

function usageSnippet(item: RegistryItem): string | null {
  if (item.type === "registry:hook") {
    const info = HOOK_INFO[item.name];
    return info ? `import { ${info.exportName} } from "${info.importPath}";` : null;
  }
  if (item.type === "registry:lib") {
    return `import { cn } from "~/lib/utils";`;
  }
  return null;
}

export async function loader({ params }: Route.LoaderArgs) {
  const item = (registryData.items as RegistryItem[]).find(
    (i) => i.name === params.name && i.type !== "registry:ui" && !i.name.startsWith("example-"),
  );
  if (!item) throw data("Item não encontrado", { status: 404 });
  return { item };
}

export default function OtherItemPage({ loaderData }: Route.ComponentProps) {
  const { item } = loaderData;
  const snippet = usageSnippet(item);

  return (
    <div className="mx-auto max-w-3xl p-8">
      <Link to="/" className="text-sm text-muted-foreground">
        ← Voltar
      </Link>
      <h1 className="mt-2 text-2xl font-bold">{item.title ?? item.name}</h1>
      {item.description && <p className="mt-1 text-muted-foreground">{item.description}</p>}

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold">Instalação</h2>
        <pre className="overflow-x-auto rounded-md bg-muted p-3 text-sm">
          <code>{`npx shadcn add @ds/${item.name}`}</code>
        </pre>
      </section>

      {snippet && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold">Uso</h2>
          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-sm">
            <code>{snippet}</code>
          </pre>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Wire both routes into `app/routes.ts`**

```ts
// app/routes.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("components/:name", "routes/route.components.$name.tsx"),
  route("other/:name", "routes/route.other.$name.tsx"),
] satisfies RouteConfig;
```

- [ ] **Step 7: Build and typecheck**

```bash
cd /var/www/testes/tektonsys-ui
npm run build
npm run typecheck
```

Expected: both succeed. `shadcn build` now reports 49 items (48 + `example-button`).

- [ ] **Step 8: Manual browser verification**

```bash
cd /var/www/testes/tektonsys-ui
npm run dev
```

Open `http://localhost:5173` (or whatever port Vite reports) and confirm:
- The catalog page lists items grouped under "Componentes" and "Utilitários".
- `/components/button` renders the five button variants live, shows the install command `npx shadcn add @ds/button`, and shows the demo's source code below it.
- `/other/use-mobile` shows the description, install command, and the usage snippet `import { useIsMobile } from "~/client/hooks/use-mobile";` — this specifically exercises the Review Focus item about the hook export-name mismatch.
- `/components/does-not-exist` renders a 404 (React Router's default error boundary is enough for now).

---

## Task 3: Demo batch 1 — 22 remaining leaf components

**Files:**
- Create: `registry/new-york/examples/{alert,avatar,badge,card,checkbox,dropdown-menu,empty,label,pagination,popover,progress,radio-group,scroll-area,separator,sheet,skeleton,sonner,switch,toggle-group,tooltip,trash-dashed-border-circle,whatsapp-icon}-demo.tsx`
- Modify: `registry.json` (add 22 `example-*` items)

**Interfaces:**
- Consumes: the pattern from Task 2 (default-export component, `~/client/components/ui/*` imports).
- Produces: nothing new for later tasks — this batch is leaf-level content.

- [ ] **Step 1: Write the 22 demo files**

```tsx
// registry/new-york/examples/alert-demo.tsx
import { Alert } from "~/client/components/ui/alert";

export default function AlertDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Alert.Root variant="default">
        <Alert.Title>Atualização disponível</Alert.Title>
        <Alert.Description>Uma nova versão do app já pode ser instalada.</Alert.Description>
      </Alert.Root>
      <Alert.Root variant="warning">
        <Alert.Title>Atenção</Alert.Title>
        <Alert.Description>Revise os dados antes de continuar.</Alert.Description>
      </Alert.Root>
      <Alert.Root variant="destructive">
        <Alert.Title>Erro ao salvar</Alert.Title>
        <Alert.Description>Não foi possível concluir a operação.</Alert.Description>
      </Alert.Root>
    </div>
  );
}
```

```tsx
// registry/new-york/examples/avatar-demo.tsx
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "~/client/components/ui/avatar";

export default function AvatarDemo() {
  return (
    <div className="flex items-center gap-6">
      <Avatar size="sm">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </div>
  );
}
```

```tsx
// registry/new-york/examples/badge-demo.tsx
import { Badge } from "~/client/components/ui/badge";

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="violet">Violet</Badge>
      <Badge variant="emerald">Emerald</Badge>
      <Badge variant="navy">Navy</Badge>
      <Badge variant="amber">Amber</Badge>
      <Badge variant="rose">Rose</Badge>
    </div>
  );
}
```

```tsx
// registry/new-york/examples/card-demo.tsx
import { TrendingUp } from "lucide-react";
import { Card } from "~/client/components/ui/card";

export default function CardDemo() {
  return (
    <Card.Root className="max-w-sm">
      <Card.MetricHeader label="Receita mensal" icon={TrendingUp} color="success" />
      <Card.MetricValue>R$ 24.500,00</Card.MetricValue>
      <Card.MetricTrend value="+12% vs mês anterior" direction="up" />
    </Card.Root>
  );
}
```

```tsx
// registry/new-york/examples/checkbox-demo.tsx
import { Checkbox } from "~/client/components/ui/checkbox";

export default function CheckboxDemo() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms-demo" defaultChecked />
      <label htmlFor="terms-demo" className="text-sm">
        Aceito os termos de uso
      </label>
    </div>
  );
}
```

```tsx
// registry/new-york/examples/dropdown-menu-demo.tsx
import { Button } from "~/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";

export default function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Abrir menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Perfil</DropdownMenuItem>
        <DropdownMenuItem>Configurações</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

```tsx
// registry/new-york/examples/empty-demo.tsx
import { Inbox } from "lucide-react";
import { Empty } from "~/client/components/ui/empty";

export default function EmptyDemo() {
  return (
    <Empty.Root>
      <Empty.Header>
        <Empty.Media variant="icon">
          <Inbox />
        </Empty.Media>
        <Empty.Title>Nenhum registro encontrado</Empty.Title>
        <Empty.Description>Ajuste os filtros ou crie um novo item.</Empty.Description>
      </Empty.Header>
    </Empty.Root>
  );
}
```

```tsx
// registry/new-york/examples/label-demo.tsx
import { Label } from "~/client/components/ui/label";

export default function LabelDemo() {
  return <Label htmlFor="email-demo">Endereço de e-mail</Label>;
}
```

```tsx
// registry/new-york/examples/pagination-demo.tsx
import { Pagination } from "~/client/components/ui/pagination";

export default function PaginationDemo() {
  return (
    <Pagination.Root>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link isActive>1</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link>2</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link>3</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next />
        </Pagination.Item>
      </Pagination.Content>
    </Pagination.Root>
  );
}
```

```tsx
// registry/new-york/examples/popover-demo.tsx
import { Button } from "~/client/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/client/components/ui/popover";

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Abrir popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm">Conteúdo flutuante exibido ao lado do gatilho.</p>
      </PopoverContent>
    </Popover>
  );
}
```

```tsx
// registry/new-york/examples/progress-demo.tsx
import { Progress } from "~/client/components/ui/progress";

export default function ProgressDemo() {
  return <Progress value={62} className="max-w-sm" />;
}
```

```tsx
// registry/new-york/examples/radio-group-demo.tsx
import { RadioGroup } from "~/client/components/ui/radio-group";

export default function RadioGroupDemo() {
  return (
    <RadioGroup.Root defaultValue="monthly">
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="monthly" id="monthly-demo" />
        <label htmlFor="monthly-demo" className="text-sm">
          Mensal
        </label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="yearly" id="yearly-demo" />
        <label htmlFor="yearly-demo" className="text-sm">
          Anual
        </label>
      </div>
    </RadioGroup.Root>
  );
}
```

```tsx
// registry/new-york/examples/scroll-area-demo.tsx
import { ScrollArea } from "~/client/components/ui/scroll-area";

export default function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-40 w-64 rounded-md border border-border p-4">
      {Array.from({ length: 20 }, (_, i) => (
        <p key={i} className="text-sm">
          Item {i + 1}
        </p>
      ))}
    </ScrollArea>
  );
}
```

```tsx
// registry/new-york/examples/separator-demo.tsx
import { Separator } from "~/client/components/ui/separator";

export default function SeparatorDemo() {
  return (
    <div className="w-64">
      <p className="text-sm">Acima da linha</p>
      <Separator className="my-4" />
      <p className="text-sm">Abaixo da linha</p>
    </div>
  );
}
```

```tsx
// registry/new-york/examples/sheet-demo.tsx
import { Button } from "~/client/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/client/components/ui/sheet";

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Abrir painel</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detalhes</SheetTitle>
          <SheetDescription>Painel lateral deslizante.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
```

```tsx
// registry/new-york/examples/skeleton-demo.tsx
import { Skeleton } from "~/client/components/ui/skeleton";

export default function SkeletonDemo() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
```

```tsx
// registry/new-york/examples/sonner-demo.tsx
import { toast } from "sonner";
import { Button } from "~/client/components/ui/button";

export default function SonnerDemo() {
  return (
    <Button variant="outline" onClick={() => toast.success("Alteração salva com sucesso.")}>
      Disparar toast
    </Button>
  );
}
```

```tsx
// registry/new-york/examples/switch-demo.tsx
import { Switch } from "~/client/components/ui/switch";

export default function SwitchDemo() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="notifications-demo" defaultChecked />
      <label htmlFor="notifications-demo" className="text-sm">
        Notificações ativas
      </label>
    </div>
  );
}
```

```tsx
// registry/new-york/examples/toggle-group-demo.tsx
import { Bold, Italic, Underline } from "lucide-react";
import { useState } from "react";
import { ToggleGroup } from "~/client/components/ui/toggle-group";

export default function ToggleGroupDemo() {
  const [value, setValue] = useState("bold");
  return (
    <ToggleGroup.Root type="single" value={value} onValueChange={setValue}>
      <ToggleGroup.Item value="bold" variant="icon">
        <Bold size={16} />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="italic" variant="icon">
        <Italic size={16} />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="underline" variant="icon">
        <Underline size={16} />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}
```

```tsx
// registry/new-york/examples/tooltip-demo.tsx
import { Button } from "~/client/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/client/components/ui/tooltip";

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Passe o mouse</Button>
        </TooltipTrigger>
        <TooltipContent>Texto de ajuda</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

```tsx
// registry/new-york/examples/trash-dashed-border-circle-demo.tsx
import { TrashDashedBorderCircle } from "~/client/components/ui/trash-dashed-border-circle";

export default function TrashDashedBorderCircleDemo() {
  return <TrashDashedBorderCircle />;
}
```

```tsx
// registry/new-york/examples/whatsapp-icon-demo.tsx
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";

export default function WhatsAppIconDemo() {
  return <WhatsAppIcon size={32} className="text-[#25D366]" />;
}
```

- [ ] **Step 2: Register all 22 in `registry.json`**

Add to `items` (`registryDependencies` always includes the component itself; add `utils` only where the component itself needs it per its own entry from the prior plan):

```json
{ "name": "example-alert", "type": "registry:component", "title": "Alert example", "registryDependencies": ["alert"], "files": [{ "path": "registry/new-york/examples/alert-demo.tsx", "type": "registry:component" }] },
{ "name": "example-avatar", "type": "registry:component", "title": "Avatar example", "registryDependencies": ["avatar"], "files": [{ "path": "registry/new-york/examples/avatar-demo.tsx", "type": "registry:component" }] },
{ "name": "example-badge", "type": "registry:component", "title": "Badge example", "registryDependencies": ["badge"], "files": [{ "path": "registry/new-york/examples/badge-demo.tsx", "type": "registry:component" }] },
{ "name": "example-card", "type": "registry:component", "title": "Card example", "dependencies": ["lucide-react"], "registryDependencies": ["card"], "files": [{ "path": "registry/new-york/examples/card-demo.tsx", "type": "registry:component" }] },
{ "name": "example-checkbox", "type": "registry:component", "title": "Checkbox example", "registryDependencies": ["checkbox"], "files": [{ "path": "registry/new-york/examples/checkbox-demo.tsx", "type": "registry:component" }] },
{ "name": "example-dropdown-menu", "type": "registry:component", "title": "Dropdown Menu example", "registryDependencies": ["dropdown-menu", "button"], "files": [{ "path": "registry/new-york/examples/dropdown-menu-demo.tsx", "type": "registry:component" }] },
{ "name": "example-empty", "type": "registry:component", "title": "Empty example", "dependencies": ["lucide-react"], "registryDependencies": ["empty"], "files": [{ "path": "registry/new-york/examples/empty-demo.tsx", "type": "registry:component" }] },
{ "name": "example-label", "type": "registry:component", "title": "Label example", "registryDependencies": ["label"], "files": [{ "path": "registry/new-york/examples/label-demo.tsx", "type": "registry:component" }] },
{ "name": "example-pagination", "type": "registry:component", "title": "Pagination example", "registryDependencies": ["pagination"], "files": [{ "path": "registry/new-york/examples/pagination-demo.tsx", "type": "registry:component" }] },
{ "name": "example-popover", "type": "registry:component", "title": "Popover example", "registryDependencies": ["popover", "button"], "files": [{ "path": "registry/new-york/examples/popover-demo.tsx", "type": "registry:component" }] },
{ "name": "example-progress", "type": "registry:component", "title": "Progress example", "registryDependencies": ["progress"], "files": [{ "path": "registry/new-york/examples/progress-demo.tsx", "type": "registry:component" }] },
{ "name": "example-radio-group", "type": "registry:component", "title": "Radio Group example", "registryDependencies": ["radio-group"], "files": [{ "path": "registry/new-york/examples/radio-group-demo.tsx", "type": "registry:component" }] },
{ "name": "example-scroll-area", "type": "registry:component", "title": "Scroll Area example", "registryDependencies": ["scroll-area"], "files": [{ "path": "registry/new-york/examples/scroll-area-demo.tsx", "type": "registry:component" }] },
{ "name": "example-separator", "type": "registry:component", "title": "Separator example", "registryDependencies": ["separator"], "files": [{ "path": "registry/new-york/examples/separator-demo.tsx", "type": "registry:component" }] },
{ "name": "example-sheet", "type": "registry:component", "title": "Sheet example", "registryDependencies": ["sheet", "button"], "files": [{ "path": "registry/new-york/examples/sheet-demo.tsx", "type": "registry:component" }] },
{ "name": "example-skeleton", "type": "registry:component", "title": "Skeleton example", "registryDependencies": ["skeleton"], "files": [{ "path": "registry/new-york/examples/skeleton-demo.tsx", "type": "registry:component" }] },
{ "name": "example-sonner", "type": "registry:component", "title": "Sonner example", "registryDependencies": ["sonner", "button"], "files": [{ "path": "registry/new-york/examples/sonner-demo.tsx", "type": "registry:component" }] },
{ "name": "example-switch", "type": "registry:component", "title": "Switch example", "registryDependencies": ["switch"], "files": [{ "path": "registry/new-york/examples/switch-demo.tsx", "type": "registry:component" }] },
{ "name": "example-toggle-group", "type": "registry:component", "title": "Toggle Group example", "dependencies": ["lucide-react"], "registryDependencies": ["toggle-group"], "files": [{ "path": "registry/new-york/examples/toggle-group-demo.tsx", "type": "registry:component" }] },
{ "name": "example-tooltip", "type": "registry:component", "title": "Tooltip example", "registryDependencies": ["tooltip", "button"], "files": [{ "path": "registry/new-york/examples/tooltip-demo.tsx", "type": "registry:component" }] },
{ "name": "example-trash-dashed-border-circle", "type": "registry:component", "title": "Trash Dashed Border Circle example", "registryDependencies": ["trash-dashed-border-circle"], "files": [{ "path": "registry/new-york/examples/trash-dashed-border-circle-demo.tsx", "type": "registry:component" }] },
{ "name": "example-whatsapp-icon", "type": "registry:component", "title": "WhatsApp Icon example", "registryDependencies": ["whatsapp-icon"], "files": [{ "path": "registry/new-york/examples/whatsapp-icon-demo.tsx", "type": "registry:component" }] }
```

- [ ] **Step 3: Build and typecheck**

```bash
cd /var/www/testes/tektonsys-ui
npm run build
npm run typecheck
```

Expected: both succeed; `shadcn build` reports 71 items total (49 from Task 2 + 22 new).

- [ ] **Step 4: Manual spot-check**

```bash
npm run dev
```

Visit `/components/card`, `/components/sonner` (click the button — a toast should actually appear, proving the `<Toaster />` wiring from Task 1), and `/components/toggle-group` (click between the three icons). Confirm each renders without console errors.

---

## Task 4: Demo batch 2 — 7 components (dialog, field, form-field, switch-field, tab-button, table-pagination, table)

**Files:**
- Create: `registry/new-york/examples/{dialog,field,form-field,switch-field,tab-button,table-pagination,table}-demo.tsx`
- Modify: `registry.json`

- [ ] **Step 1: Write the 7 demo files**

```tsx
// registry/new-york/examples/dialog-demo.tsx
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/client/components/ui/dialog";

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Abrir diálogo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar ação</DialogTitle>
          <DialogDescription>Essa ação não pode ser desfeita.</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button variant="danger">Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

```tsx
// registry/new-york/examples/field-demo.tsx
import { Field } from "~/client/components/ui/field";
import { Input } from "~/client/components/ui/input";

export default function FieldDemo() {
  return (
    <Field.Set>
      <Field.Root>
        <Field.Content>
          <Field.Label htmlFor="name-demo">Nome completo</Field.Label>
          <Input id="name-demo" placeholder="Maria Silva" />
          <Field.Description>Como aparece no documento oficial.</Field.Description>
        </Field.Content>
      </Field.Root>
    </Field.Set>
  );
}
```

```tsx
// registry/new-york/examples/form-field-demo.tsx
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";

export default function FormFieldDemo() {
  return (
    <FormErrorProvider fieldErrors={{ email: ["E-mail inválido."] }}>
      <FormField name="email" label="E-mail" required>
        <Input name="email" placeholder="voce@empresa.com" />
      </FormField>
    </FormErrorProvider>
  );
}
```

```tsx
// registry/new-york/examples/switch-field-demo.tsx
import { useState } from "react";
import { SwitchField } from "~/client/components/ui/switch-field";

export default function SwitchFieldDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <SwitchField
      name="notifications-demo"
      label="Receber notificações"
      checked={checked}
      onChange={setChecked}
    />
  );
}
```

```tsx
// registry/new-york/examples/tab-button-demo.tsx
import { Bell, Inbox } from "lucide-react";
import { useState } from "react";
import { TabBar } from "~/client/components/ui/tab-button";

export default function TabButtonDemo() {
  const [active, setActive] = useState("inbox");
  return (
    <TabBar.List>
      <TabBar.Button
        active={active === "inbox"}
        onClick={() => setActive("inbox")}
        icon={Inbox}
        label="Caixa de entrada"
        count={4}
      />
      <TabBar.Button
        active={active === "alerts"}
        onClick={() => setActive("alerts")}
        icon={Bell}
        label="Alertas"
      />
    </TabBar.List>
  );
}
```

```tsx
// registry/new-york/examples/table-pagination-demo.tsx
import { TablePagination } from "~/client/components/ui/table-pagination";

export default function TablePaginationDemo() {
  return (
    <TablePagination currentPage={3} totalPages={10} buildPageUrl={(page) => `#page-${page}`} />
  );
}
```

```tsx
// registry/new-york/examples/table-demo.tsx
import { Table } from "~/client/components/ui/table";

const donors = [
  { name: "Maria Silva", email: "maria@email.com", amount: "R$ 150,00" },
  { name: "João Souza", email: "joao@email.com", amount: "R$ 80,00" },
];

export default function TableDemo() {
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Nome</Table.Head>
          <Table.Head>E-mail</Table.Head>
          <Table.Head>Valor</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {donors.map((donor) => (
          <Table.Row key={donor.email}>
            <Table.Cell>{donor.name}</Table.Cell>
            <Table.Cell>{donor.email}</Table.Cell>
            <Table.Cell>{donor.amount}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
```

- [ ] **Step 2: Register all 7 in `registry.json`**

```json
{ "name": "example-dialog", "type": "registry:component", "title": "Dialog example", "registryDependencies": ["dialog", "button"], "files": [{ "path": "registry/new-york/examples/dialog-demo.tsx", "type": "registry:component" }] },
{ "name": "example-field", "type": "registry:component", "title": "Field example", "registryDependencies": ["field", "input"], "files": [{ "path": "registry/new-york/examples/field-demo.tsx", "type": "registry:component" }] },
{ "name": "example-form-field", "type": "registry:component", "title": "Form Field example", "registryDependencies": ["form-field", "input"], "files": [{ "path": "registry/new-york/examples/form-field-demo.tsx", "type": "registry:component" }] },
{ "name": "example-switch-field", "type": "registry:component", "title": "Switch Field example", "registryDependencies": ["switch-field"], "files": [{ "path": "registry/new-york/examples/switch-field-demo.tsx", "type": "registry:component" }] },
{ "name": "example-tab-button", "type": "registry:component", "title": "Tab Button example", "dependencies": ["lucide-react"], "registryDependencies": ["tab-button"], "files": [{ "path": "registry/new-york/examples/tab-button-demo.tsx", "type": "registry:component" }] },
{ "name": "example-table-pagination", "type": "registry:component", "title": "Table Pagination example", "registryDependencies": ["table-pagination"], "files": [{ "path": "registry/new-york/examples/table-pagination-demo.tsx", "type": "registry:component" }] },
{ "name": "example-table", "type": "registry:component", "title": "Table example", "registryDependencies": ["table"], "files": [{ "path": "registry/new-york/examples/table-demo.tsx", "type": "registry:component" }] }
```

- [ ] **Step 3: Build and typecheck**

```bash
cd /var/www/testes/tektonsys-ui
npm run build
npm run typecheck
```

Expected: both succeed; 78 items total.

- [ ] **Step 4: Manual spot-check**

```bash
npm run dev
```

Visit `/components/dialog` (open it, confirm the confirm/cancel footer renders) and `/components/form-field` (confirm the red error text "E-mail inválido." shows under the input — this is the FormField error-state path, worth seeing rendered for real).

---

## Task 5: Demo batch 3 — 9 components (command, currency-input, file/image upload, input-group, input, select, textarea)

**Files:**
- Create: `registry/new-york/examples/{command,currency-input,file-upload-compact,image-upload-compact,image-upload,input-group,input,select,textarea}-demo.tsx`
- Modify: `registry.json`

- [ ] **Step 1: Write the 9 demo files**

```tsx
// registry/new-york/examples/command-demo.tsx
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/client/components/ui/command";

export default function CommandDemo() {
  return (
    <Command className="max-w-sm rounded-lg border border-border">
      <CommandInput placeholder="Buscar comando..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado.</CommandEmpty>
        <CommandGroup heading="Ações">
          <CommandItem>Nova campanha</CommandItem>
          <CommandItem>Novo doador</CommandItem>
          <CommandItem>Exportar relatório</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
```

```tsx
// registry/new-york/examples/currency-input-demo.tsx
import { CurrencyInput } from "~/client/components/ui/currency-input";

export default function CurrencyInputDemo() {
  return <CurrencyInput name="amount-demo" defaultValue={150.5} className="max-w-xs" />;
}
```

```tsx
// registry/new-york/examples/file-upload-compact-demo.tsx
import { FileUploadCompact } from "~/client/components/ui/file-upload-compact";

export default function FileUploadCompactDemo() {
  return <FileUploadCompact name="document-demo" description="PDF, DOC ou XLS até 10MB." />;
}
```

```tsx
// registry/new-york/examples/image-upload-compact-demo.tsx
import { ImageUploadCompact } from "~/client/components/ui/image-upload-compact";

export default function ImageUploadCompactDemo() {
  return <ImageUploadCompact name="avatar-upload-demo" description="JPG, PNG ou WebP." />;
}
```

```tsx
// registry/new-york/examples/image-upload-demo.tsx
import { ImageUpload } from "~/client/components/ui/image-upload";

export default function ImageUploadDemo() {
  return <ImageUpload name="cover-demo" />;
}
```

```tsx
// registry/new-york/examples/input-group-demo.tsx
import { Mail } from "lucide-react";
import { InputGroup } from "~/client/components/ui/input-group";

export default function InputGroupDemo() {
  return (
    <div className="flex max-w-sm flex-col gap-4">
      <InputGroup.Root>
        <InputGroup.Side side="start">https://</InputGroup.Side>
        <InputGroup.Input placeholder="seusite.com.br" />
      </InputGroup.Root>
      <InputGroup.Root>
        <InputGroup.Addon align="inline-start">
          <Mail size={16} />
        </InputGroup.Addon>
        <InputGroup.Input className="pl-9" placeholder="voce@empresa.com" />
      </InputGroup.Root>
    </div>
  );
}
```

```tsx
// registry/new-york/examples/input-demo.tsx
import { Search } from "lucide-react";
import { Input } from "~/client/components/ui/input";

export default function InputDemo() {
  return (
    <div className="flex max-w-sm flex-col gap-4">
      <Input placeholder="Nome completo" />
      <Input leftIcon={Search} placeholder="Buscar..." />
    </div>
  );
}
```

```tsx
// registry/new-york/examples/select-demo.tsx
import { Select } from "~/client/components/ui/select";

export default function SelectDemo() {
  return (
    <Select.Root defaultValue="monthly">
      <Select.Trigger className="max-w-xs">
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="monthly">Mensal</Select.Item>
        <Select.Item value="quarterly">Trimestral</Select.Item>
        <Select.Item value="yearly">Anual</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
```

```tsx
// registry/new-york/examples/textarea-demo.tsx
import { Textarea } from "~/client/components/ui/textarea";

export default function TextareaDemo() {
  return <Textarea placeholder="Escreva uma mensagem..." className="max-w-sm" />;
}
```

- [ ] **Step 2: Register all 9 in `registry.json`**

```json
{ "name": "example-command", "type": "registry:component", "title": "Command example", "registryDependencies": ["command"], "files": [{ "path": "registry/new-york/examples/command-demo.tsx", "type": "registry:component" }] },
{ "name": "example-currency-input", "type": "registry:component", "title": "Currency Input example", "registryDependencies": ["currency-input"], "files": [{ "path": "registry/new-york/examples/currency-input-demo.tsx", "type": "registry:component" }] },
{ "name": "example-file-upload-compact", "type": "registry:component", "title": "File Upload Compact example", "registryDependencies": ["file-upload-compact"], "files": [{ "path": "registry/new-york/examples/file-upload-compact-demo.tsx", "type": "registry:component" }] },
{ "name": "example-image-upload-compact", "type": "registry:component", "title": "Image Upload Compact example", "registryDependencies": ["image-upload-compact"], "files": [{ "path": "registry/new-york/examples/image-upload-compact-demo.tsx", "type": "registry:component" }] },
{ "name": "example-image-upload", "type": "registry:component", "title": "Image Upload example", "registryDependencies": ["image-upload"], "files": [{ "path": "registry/new-york/examples/image-upload-demo.tsx", "type": "registry:component" }] },
{ "name": "example-input-group", "type": "registry:component", "title": "Input Group example", "dependencies": ["lucide-react"], "registryDependencies": ["input-group"], "files": [{ "path": "registry/new-york/examples/input-group-demo.tsx", "type": "registry:component" }] },
{ "name": "example-input", "type": "registry:component", "title": "Input example", "dependencies": ["lucide-react"], "registryDependencies": ["input"], "files": [{ "path": "registry/new-york/examples/input-demo.tsx", "type": "registry:component" }] },
{ "name": "example-select", "type": "registry:component", "title": "Select example", "registryDependencies": ["select"], "files": [{ "path": "registry/new-york/examples/select-demo.tsx", "type": "registry:component" }] },
{ "name": "example-textarea", "type": "registry:component", "title": "Textarea example", "registryDependencies": ["textarea"], "files": [{ "path": "registry/new-york/examples/textarea-demo.tsx", "type": "registry:component" }] }
```

- [ ] **Step 3: Build and typecheck**

```bash
cd /var/www/testes/tektonsys-ui
npm run build
npm run typecheck
```

Expected: both succeed; 87 items total.

- [ ] **Step 4: Manual spot-check**

```bash
npm run dev
```

Visit `/components/currency-input` (confirm it shows "R$ 150,50" formatted), `/components/select` (open it, confirm the three options), and `/components/image-upload` (confirm the drop-zone renders — no need to actually upload a file, this route has no backend in this project).

---

## Task 6: Demo batch 4 — combobox, phone-input, sidebar

**Files:**
- Create: `registry/new-york/examples/{combobox,phone-input,sidebar}-demo.tsx`
- Modify: `registry.json`

- [ ] **Step 1: Write the 3 demo files**

```tsx
// registry/new-york/examples/combobox-demo.tsx
import { useState } from "react";
import { Combobox } from "~/client/components/ui/combobox";

const options = [
  { value: "sp", label: "São Paulo" },
  { value: "rj", label: "Rio de Janeiro" },
  { value: "mg", label: "Minas Gerais" },
];

export default function ComboboxDemo() {
  const [value, setValue] = useState("");
  return (
    <Combobox
      options={options}
      value={value}
      onChange={setValue}
      placeholder="Selecione um estado"
      className="max-w-xs"
    />
  );
}
```

```tsx
// registry/new-york/examples/phone-input-demo.tsx
import { useState } from "react";
import { PhoneInput } from "~/client/components/ui/phone-input";

export default function PhoneInputDemo() {
  const [value, setValue] = useState<string>();
  return (
    <PhoneInput
      defaultCountry="BR"
      value={value}
      onChange={(v) => setValue(v)}
      className="max-w-xs"
    />
  );
}
```

```tsx
// registry/new-york/examples/sidebar-demo.tsx
import { Home, Settings, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/client/components/ui/sidebar";

const items = [
  { title: "Início", icon: Home },
  { title: "Doadores", icon: Users },
  { title: "Configurações", icon: Settings },
];

export default function SidebarDemo() {
  return (
    <div className="h-96 overflow-hidden rounded-lg border border-border">
      <SidebarProvider className="h-full min-h-0">
        <Sidebar collapsible="none">
          <SidebarHeader>
            <span className="px-2 text-sm font-semibold">tektonsys-ui</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navegação</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="flex items-center gap-2 p-4">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground">Conteúdo principal</span>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
```

- [ ] **Step 2: Register all 3 in `registry.json`**

```json
{ "name": "example-combobox", "type": "registry:component", "title": "Combobox example", "registryDependencies": ["combobox"], "files": [{ "path": "registry/new-york/examples/combobox-demo.tsx", "type": "registry:component" }] },
{ "name": "example-phone-input", "type": "registry:component", "title": "Phone Input example", "registryDependencies": ["phone-input"], "files": [{ "path": "registry/new-york/examples/phone-input-demo.tsx", "type": "registry:component" }] },
{ "name": "example-sidebar", "type": "registry:component", "title": "Sidebar example", "dependencies": ["lucide-react"], "registryDependencies": ["sidebar"], "files": [{ "path": "registry/new-york/examples/sidebar-demo.tsx", "type": "registry:component" }] }
```

- [ ] **Step 3: Build and typecheck**

```bash
cd /var/www/testes/tektonsys-ui
npm run build
npm run typecheck
```

Expected: both succeed; 90 items total (48 original + 42 examples).

- [ ] **Step 4: Manual spot-check**

```bash
npm run dev
```

Visit `/components/sidebar` (confirm the embedded sidebar renders with 3 menu items, and the trigger button collapses/expands it), `/components/combobox` (open it, type to filter, select a state), and `/components/phone-input` (confirm the country selector + input render side by side).

---

## Task 7: Final validation

**Files:** none (verification only).

**Interfaces:**
- Consumes: everything from Tasks 1–6.
- Produces: confidence that the whole 90-item catalog (48 real items + 42 examples) builds clean from scratch and that a representative sample across every category renders correctly in the browser.

- [ ] **Step 1: Full clean build from scratch**

```bash
cd /var/www/testes/tektonsys-ui
rm -rf public/r build .react-router node_modules
npm install
npm run build
npm run typecheck
```

Expected: `npm install` succeeds, `shadcn build` reports building all 90 items, `react-router build` succeeds, `typecheck` reports no errors. This is the same sequence Vercel's build step will run.

- [ ] **Step 2: Manual browser walkthrough covering every category**

```bash
npm run dev
```

Visit and confirm no console errors on:
- `/` — catalog renders, grouped sections visible.
- One leaf UI component: `/components/badge`.
- One composed UI component: `/components/dialog`.
- The most complex one: `/components/sidebar`.
- One hook: `/other/use-filter` (confirm the usage snippet shows `import { useFilter } from "~/client/hooks/useFilter";`).
- `utils`: `/other/utils` (confirm it shows `import { cn } from "~/lib/utils";`).
- `theme`: `/other/theme` (confirm it shows the install command only, no usage snippet — `usageSnippet` correctly returns `null` for `registry:file`).

- [ ] **Step 3: Confirm the uncommitted-content invariant held through the whole plan**

```bash
cd /var/www/testes/tektonsys-ui
git status --short | grep -c '^??' 
find registry/new-york -type f | wc -l
```

Expected: `registry/new-york` now has 90 files (48 original + 42 new demo files), and `registry.json`'s `items` array has 90 entries — confirm with:

```bash
node -e "console.log(require('./registry.json').items.length)"
```

Expected output: `90`.

No commit for this task — review everything in the IDE and commit manually once satisfied, per this repo's standing convention. The next step after this plan is Task 11 of `docs/superpowers/plans/2026-10-07-tektonsys-ui-registry.md` (deploy to Vercel), re-run against this React Router v7 build instead of the old Next.js one.
