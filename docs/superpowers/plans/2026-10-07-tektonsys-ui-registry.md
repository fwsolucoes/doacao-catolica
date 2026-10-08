# tektonsys-ui Registry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the `tektonsys-ui` repository as a public shadcn registry that serves the design system components, lib utilities, generic hooks and theme tokens currently living in `donation-react-router-v7`, so they can be installed via `npx shadcn add @ds/<name>` from any consumer project.

**Architecture:** A minimal Next.js app authored with the shadcn CLI (`shadcn init --template next`). Source files for every shared piece live under `registry/new-york/{ui,hooks,lib,theme}/`, cataloged in a root `registry.json`. `npx shadcn build` compiles that catalog into static `public/r/{name}.json` files, which Next.js serves as-is. Deployed to Vercel on every push to `main`; no authentication, since the content is pure component/utility source code.

**Tech Stack:** Next.js, shadcn CLI (`shadcn build`/`shadcn add`), Tailwind CSS v4, tailwind-variants, Radix UI (`radix-ui` package + a few scoped `@radix-ui/react-*` packages), lucide-react, same dependency set as `donation-react-router-v7`.

**Spec:** `docs/superpowers/specs/2026-10-07-design-system-registry-design.md` (in `donation-react-router-v7`)

## Global Constraints

- Registry is **public**, no auth, no tokens — confirmed in the spec: registry content is pure component/utility source, no secrets or user data.
- Repository location: `/var/www/testes/tektonsys-ui`.
- Hosting: Vercel, auto-deploy from the main branch.
- Style: `new-york` (matches `donation-react-router-v7`'s `components.json`).
- Every migrated file must be a **verbatim copy** of its source in `donation-react-router-v7` (after the import-path cleanup in Task 3) — no behavior changes in this plan. Any component that needs a behavior change happens in a separate, later change.
- Registry item names are kebab-case regardless of the source file's own basename (e.g. hook file `useFilter.ts` → item name `use-filter`). File basenames are preserved exactly as in the source repo so consumer import paths never change.
- Domain-specific code (anything referencing `~/app/`, campaign/donation types, or `useActionToast`/`useRoot`/`useCampaignLayout`) is explicitly out of scope and must not be copied.

## Review Focus

- **Stale `registryDependencies` reference:** an item lists a sibling item name that doesn't exist yet in `registry.json` at build time → `shadcn build` must fail loudly, not silently produce a broken JSON file. Each task's build-verification step checks the specific new items, not just "build didn't crash".
- **External npm dependency drift:** a component's `dependencies` array omits a package it actually imports (e.g. forgetting `cmdk` for `command`) → installing it in a fresh consumer would type-error on a missing module. Each task's file list is cross-checked against the actual `import` statements captured in this plan, not assumed from memory.
- **Duplicate `cn()` source:** six files (`label`, `form-field`, `input`, `image-upload`, `image-upload-compact`, `file-upload-compact`) currently import `cn` from the stray `~/client/lib/utils` instead of the canonical `~/lib/utils`. If copied as-is, the registry would ship a second utils import path that doesn't exist for consumers. Task 3 fixes this before any file referencing `cn` is copied.
- **Theme tokens losing fidelity in transcription:** `tailwind.css` mixes CSS custom properties with structural `@layer base` rules, attribute selectors, a keyframe animation and explanatory comments. Hand-transcribing this into `cssVars`/`css` JSON risks silently changing a color value or dropping a rule. Task 5 avoids the transcription entirely by shipping the file as a verbatim `registry:file` copy, with a build-time byte-for-byte content check against the source.
- **`shadcn build` emitting `content`-embedded items:** per the registry schema, a publicly served `registry.json`'s items must reference files via `path` (read from disk at build time), never pre-populate a literal `content` string — otherwise edits to the source file silently stop propagating to the built output. Every task's registry.json snippet uses `path` only.
- **Hook npm dependency leakage:** `useFilter`/`useQueryToast` depend on the private `@arkyn/components` package. If a future consumer project doesn't have `@arkyn/components` installed, `npx shadcn add @ds/use-filter` would install successfully but fail to compile. Task 6 records this as an explicit `dependencies` entry so the CLI prints it as a required install, and the plan's task note calls this out so it isn't mistaken for an oversight later.

---

## Task 1: Scaffold the `tektonsys-ui` Next.js project

**Files:**
- Create: `/var/www/testes/tektonsys-ui/` (new git repository, Next.js app)

**Interfaces:**
- Produces: a working Next.js project at `/var/www/testes/tektonsys-ui` with `components.json` (style `new-york`, `tailwind.cssVariables: true`) and a git repo on `main`, ready for `registry.json` to be added in Task 2.

- [ ] **Step 1: Scaffold the project**

```bash
cd /var/www/testes
npx shadcn@latest init --template next -n tektonsys-ui -b radix -y
```

This creates `/var/www/testes/tektonsys-ui` as a Next.js app pre-wired with Tailwind v4 and a `components.json`.

- [ ] **Step 2: Verify the scaffold**

```bash
cd /var/www/testes/tektonsys-ui
cat components.json
npm run build
```

Expected: `components.json` exists with `"style": "new-york"`, and `npm run build` completes without errors (default Next.js starter page).

- [ ] **Step 3: Initialize git**

```bash
cd /var/www/testes/tektonsys-ui
git init
```

---

## Task 2: Add the `registry.json` skeleton and verify the build pipeline

**Files:**
- Create: `/var/www/testes/tektonsys-ui/registry.json`

**Interfaces:**
- Consumes: nothing.
- Produces: an empty-but-valid `registry.json` that `npx shadcn build` can read. All later tasks append to `items`.

- [ ] **Step 1: Create the registry manifest**

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "tektonsys-ui",
  "homepage": "https://tektonsys-ui.vercel.app",
  "items": []
}
```

Save as `/var/www/testes/tektonsys-ui/registry.json`.

- [ ] **Step 2: Run the build with zero items**

```bash
cd /var/www/testes/tektonsys-ui
npx shadcn@latest build
ls public/r
```

Expected: command exits 0, `public/r` exists (may be empty — that's fine, confirms the pipeline runs end to end before any real content is added).

---

## Task 3: Fix the duplicate `cn()` import path in the source repo

This must happen in `donation-react-router-v7` *before* copying any file that touches `cn`, so the registry never ships the stray import path.

**Files (all in `donation-react-router-v7`):**
- Modify: `src/client/components/ui/label.tsx`
- Modify: `src/client/components/ui/form-field.tsx`
- Modify: `src/client/components/ui/input.tsx`
- Modify: `src/client/components/ui/image-upload.tsx`
- Modify: `src/client/components/ui/image-upload-compact.tsx`
- Modify: `src/client/components/ui/file-upload-compact.tsx`
- Delete: `src/client/lib/utils.ts`

**Interfaces:**
- Produces: all six files import `cn` from `~/lib/utils` (the one referenced by `components.json`'s `"utils"` alias), and the duplicate file is gone.

- [ ] **Step 1: Confirm the duplicate is unused elsewhere**

```bash
cd /var/www/testes/donation-react-router-v7
grep -rl '~/client/lib/utils' src --include="*.ts" --include="*.tsx"
```

Expected output: exactly the 6 files listed above. If any other file shows up, stop and investigate before continuing.

- [ ] **Step 2: Fix the imports**

```bash
cd /var/www/testes/donation-react-router-v7
sed -i 's#~/client/lib/utils#~/lib/utils#' \
  src/client/components/ui/label.tsx \
  src/client/components/ui/form-field.tsx \
  src/client/components/ui/input.tsx \
  src/client/components/ui/image-upload.tsx \
  src/client/components/ui/image-upload-compact.tsx \
  src/client/components/ui/file-upload-compact.tsx
```

- [ ] **Step 3: Delete the duplicate file**

```bash
cd /var/www/testes/donation-react-router-v7
rm src/client/lib/utils.ts
```

- [ ] **Step 4: Verify**

```bash
cd /var/www/testes/donation-react-router-v7
grep -rl '~/client/lib/utils' src || echo "no remaining references"
npm run typecheck
```

Expected: `grep` finds nothing (prints "no remaining references"), `typecheck` passes.

---

## Task 4: Migrate `lib/utils` (the `utils` registry item)

**Files:**
- Create: `/var/www/testes/tektonsys-ui/registry/new-york/lib/utils.ts`
- Modify: `/var/www/testes/tektonsys-ui/registry.json`

**Interfaces:**
- Consumes: `donation-react-router-v7/src/lib/utils.ts` (post-Task-3 content, unchanged — it already had no stray import).
- Produces: registry item `utils` (`registry:lib`), the dependency almost every other item in this plan declares via `registryDependencies: ["utils"]`.

- [ ] **Step 1: Copy the file**

```bash
mkdir -p /var/www/testes/tektonsys-ui/registry/new-york/lib
cp /var/www/testes/donation-react-router-v7/src/lib/utils.ts \
   /var/www/testes/tektonsys-ui/registry/new-york/lib/utils.ts
```

- [ ] **Step 2: Add the registry item**

Add to the `items` array in `registry.json`:

```json
{
  "name": "utils",
  "type": "registry:lib",
  "title": "cn utility",
  "description": "clsx + tailwind-merge class name helper.",
  "dependencies": ["clsx", "tailwind-merge"],
  "files": [
    {
      "path": "registry/new-york/lib/utils.ts",
      "type": "registry:lib"
    }
  ]
}
```

- [ ] **Step 3: Build and verify**

```bash
cd /var/www/testes/tektonsys-ui
npx shadcn@latest build
cat public/r/utils.json | grep -q '"name": "utils"' && echo OK
```

Expected: `OK` printed; `public/r/utils.json` contains the file's `content` inlined.

---

## Task 5: Migrate theme tokens (the `theme` registry item)

The source file (`src/client/themes/tailwind.css`, 341 lines) is far more than a plain set of CSS variables: it has extensive color tokens with explanatory comments, shadow/spotlight/toast/badge-palette tokens, sidebar width tokens, component-specific attribute selectors, a `@keyframes` animation, and two `@theme`/`@theme inline` blocks. Reconstructing all of this by hand as `cssVars`/`css` JSON risks a silent transcription error (e.g. a mistyped `oklch()` value shifting the brand color) and would strip every explanatory comment. Instead, this task ships the file verbatim via a `registry:file` entry with an explicit `target`, which the `shadcn` CLI writes byte-for-byte to the consumer's project — no merge, no JSON reconstruction.

**Files:**
- Create: `/var/www/testes/tektonsys-ui/registry/new-york/theme/tailwind.css`
- Modify: `/var/www/testes/tektonsys-ui/registry.json`

**Interfaces:**
- Consumes: `donation-react-router-v7/src/client/themes/tailwind.css`, copied byte-for-byte.
- Produces: registry item `theme` (`registry:file`) that a consumer installs via `npx shadcn add @ds/theme`, writing the full file to `src/client/themes/tailwind.css` in the consumer's project (same path convention this repo uses today).

- [ ] **Step 1: Copy the file verbatim**

```bash
mkdir -p /var/www/testes/tektonsys-ui/registry/new-york/theme
cp /var/www/testes/donation-react-router-v7/src/client/themes/tailwind.css \
   /var/www/testes/tektonsys-ui/registry/new-york/theme/tailwind.css
```

- [ ] **Step 2: Add the registry item**

Add to `registry.json`'s `items` array:

```json
{
  "name": "theme",
  "type": "registry:file",
  "title": "Design system theme",
  "description": "Color tokens, radius scale, fonts, shadows and base resets shared across products. Installs as a complete replacement of the consumer's Tailwind theme file.",
  "files": [
    {
      "path": "registry/new-york/theme/tailwind.css",
      "type": "registry:file",
      "target": "~/src/client/themes/tailwind.css"
    }
  ]
}
```

- [ ] **Step 3: Build and verify**

```bash
cd /var/www/testes/tektonsys-ui
npx shadcn@latest build
cat public/r/theme.json | grep -q '"name": "theme"' && echo OK
node -e "
const fs = require('fs');
const built = JSON.parse(fs.readFileSync('public/r/theme.json', 'utf8')).files[0].content;
const source = fs.readFileSync('/var/www/testes/donation-react-router-v7/src/client/themes/tailwind.css', 'utf8');
if (built !== source) { throw new Error('content mismatch between built registry item and source file'); }
console.log('CONTENT MATCHES SOURCE');
"
```

Expected: `OK`, then `CONTENT MATCHES SOURCE` — the built JSON's embedded content is byte-for-byte identical to the source file.

---

## Task 6: Migrate generic hooks

**Files:**
- Create: `/var/www/testes/tektonsys-ui/registry/new-york/hooks/use-mobile.ts`
- Create: `/var/www/testes/tektonsys-ui/registry/new-york/hooks/useTheme.tsx`
- Create: `/var/www/testes/tektonsys-ui/registry/new-york/hooks/useFilter.ts`
- Create: `/var/www/testes/tektonsys-ui/registry/new-york/hooks/useQueryToast.ts`
- Modify: `/var/www/testes/tektonsys-ui/registry.json`

**Interfaces:**
- Consumes: the four files from `donation-react-router-v7/src/client/hooks/`.
- Produces: registry items `use-mobile`, `use-theme`, `use-filter`, `use-query-toast` (all `registry:hook`). Note: `use-filter` and `use-query-toast` declare `@arkyn/components` as an npm dependency — a consumer project must already have that private package installed for these two to compile after install. This is expected, not a bug.

- [ ] **Step 1: Copy the files**

```bash
mkdir -p /var/www/testes/tektonsys-ui/registry/new-york/hooks
cp /var/www/testes/donation-react-router-v7/src/client/hooks/use-mobile.ts \
   /var/www/testes/donation-react-router-v7/src/client/hooks/useTheme.tsx \
   /var/www/testes/donation-react-router-v7/src/client/hooks/useFilter.ts \
   /var/www/testes/donation-react-router-v7/src/client/hooks/useQueryToast.ts \
   /var/www/testes/tektonsys-ui/registry/new-york/hooks/
```

- [ ] **Step 2: Add the registry items**

```json
{
  "name": "use-mobile",
  "type": "registry:hook",
  "title": "useIsMobile",
  "description": "Mobile breakpoint detection hook.",
  "files": [
    { "path": "registry/new-york/hooks/use-mobile.ts", "type": "registry:hook" }
  ]
},
{
  "name": "use-theme",
  "type": "registry:hook",
  "title": "useTheme",
  "description": "Light/dark theme context provider and hook.",
  "files": [
    { "path": "registry/new-york/hooks/useTheme.tsx", "type": "registry:hook" }
  ]
},
{
  "name": "use-filter",
  "type": "registry:hook",
  "title": "useFilter",
  "description": "URL search-params filter helper built on @arkyn/components.",
  "dependencies": ["@arkyn/components", "react-router"],
  "files": [
    { "path": "registry/new-york/hooks/useFilter.ts", "type": "registry:hook" }
  ]
},
{
  "name": "use-query-toast",
  "type": "registry:hook",
  "title": "useQueryToast",
  "description": "Shows a toast driven by a URL query param, built on @arkyn/components.",
  "dependencies": ["@arkyn/components", "react-router"],
  "files": [
    { "path": "registry/new-york/hooks/useQueryToast.ts", "type": "registry:hook" }
  ]
}
```

- [ ] **Step 3: Build and verify**

```bash
cd /var/www/testes/tektonsys-ui
npx shadcn@latest build
for n in use-mobile use-theme use-filter use-query-toast; do
  grep -q "\"name\": \"$n\"" public/r/$n.json && echo "$n OK"
done
```

Expected: all four print `OK`.

---

## Task 7: Migrate UI batch 1 — 23 leaf components (no sibling UI dependencies)

**Files:**
- Create: `/var/www/testes/tektonsys-ui/registry/new-york/ui/{alert,avatar,badge,button,card,checkbox,dropdown-menu,empty,label,pagination,popover,progress,radio-group,scroll-area,separator,sheet,skeleton,sonner,switch,toggle-group,tooltip,trash-dashed-border-circle,whatsapp-icon}.tsx
- Modify: `/var/www/testes/tektonsys-ui/registry.json`

**Interfaces:**
- Consumes: the 23 files from `donation-react-router-v7/src/client/components/ui/` (post-Task-3, so `label.tsx` already imports from `~/lib/utils`).
- Produces: 23 `registry:ui` items. Every item except `alert`, `badge`, `button`, `sonner`, `trash-dashed-border-circle` and `whatsapp-icon` declares `registryDependencies: ["utils"]` (those six don't call `cn()` at all — confirmed by source inspection, not assumption).

- [ ] **Step 1: Copy the files**

```bash
mkdir -p /var/www/testes/tektonsys-ui/registry/new-york/ui
cd /var/www/testes/donation-react-router-v7/src/client/components/ui
cp alert.tsx avatar.tsx badge.tsx button.tsx card.tsx checkbox.tsx \
   dropdown-menu.tsx empty.tsx label.tsx pagination.tsx popover.tsx \
   progress.tsx radio-group.tsx scroll-area.tsx separator.tsx sheet.tsx \
   skeleton.tsx sonner.tsx switch.tsx toggle-group.tsx tooltip.tsx \
   trash-dashed-border-circle.tsx whatsapp-icon.tsx \
   /var/www/testes/tektonsys-ui/registry/new-york/ui/
```

- [ ] **Step 2: Add the registry items**

```json
{ "name": "alert", "type": "registry:ui", "title": "Alert", "dependencies": ["tailwind-variants"], "files": [{ "path": "registry/new-york/ui/alert.tsx", "type": "registry:ui" }] },
{ "name": "avatar", "type": "registry:ui", "title": "Avatar", "dependencies": ["radix-ui"], "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/avatar.tsx", "type": "registry:ui" }] },
{ "name": "badge", "type": "registry:ui", "title": "Badge", "dependencies": ["tailwind-variants"], "files": [{ "path": "registry/new-york/ui/badge.tsx", "type": "registry:ui" }] },
{ "name": "button", "type": "registry:ui", "title": "Button", "dependencies": ["@radix-ui/react-slot", "tailwind-variants"], "files": [{ "path": "registry/new-york/ui/button.tsx", "type": "registry:ui" }] },
{ "name": "card", "type": "registry:ui", "title": "Card", "dependencies": ["lucide-react", "tailwind-variants"], "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/card.tsx", "type": "registry:ui" }] },
{ "name": "checkbox", "type": "registry:ui", "title": "Checkbox", "dependencies": ["lucide-react", "@radix-ui/react-checkbox"], "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/checkbox.tsx", "type": "registry:ui" }] },
{ "name": "dropdown-menu", "type": "registry:ui", "title": "Dropdown Menu", "dependencies": ["lucide-react", "radix-ui"], "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/dropdown-menu.tsx", "type": "registry:ui" }] },
{ "name": "empty", "type": "registry:ui", "title": "Empty", "dependencies": ["tailwind-variants"], "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/empty.tsx", "type": "registry:ui" }] },
{ "name": "label", "type": "registry:ui", "title": "Label", "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/label.tsx", "type": "registry:ui" }] },
{ "name": "pagination", "type": "registry:ui", "title": "Pagination", "dependencies": ["lucide-react", "react-router"], "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/pagination.tsx", "type": "registry:ui" }] },
{ "name": "popover", "type": "registry:ui", "title": "Popover", "dependencies": ["radix-ui"], "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/popover.tsx", "type": "registry:ui" }] },
{ "name": "progress", "type": "registry:ui", "title": "Progress", "dependencies": ["radix-ui"], "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/progress.tsx", "type": "registry:ui" }] },
{ "name": "radio-group", "type": "registry:ui", "title": "Radio Group", "dependencies": ["lucide-react", "radix-ui"], "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/radio-group.tsx", "type": "registry:ui" }] },
{ "name": "scroll-area", "type": "registry:ui", "title": "Scroll Area", "dependencies": ["radix-ui"], "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/scroll-area.tsx", "type": "registry:ui" }] },
{ "name": "separator", "type": "registry:ui", "title": "Separator", "dependencies": ["radix-ui"], "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/separator.tsx", "type": "registry:ui" }] },
{ "name": "sheet", "type": "registry:ui", "title": "Sheet", "dependencies": ["lucide-react", "radix-ui"], "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/sheet.tsx", "type": "registry:ui" }] },
{ "name": "skeleton", "type": "registry:ui", "title": "Skeleton", "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/skeleton.tsx", "type": "registry:ui" }] },
{ "name": "sonner", "type": "registry:ui", "title": "Sonner toaster", "dependencies": ["lucide-react", "sonner"], "files": [{ "path": "registry/new-york/ui/sonner.tsx", "type": "registry:ui" }] },
{ "name": "switch", "type": "registry:ui", "title": "Switch", "dependencies": ["radix-ui"], "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/switch.tsx", "type": "registry:ui" }] },
{ "name": "toggle-group", "type": "registry:ui", "title": "Toggle Group", "dependencies": ["radix-ui", "tailwind-variants"], "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/toggle-group.tsx", "type": "registry:ui" }] },
{ "name": "tooltip", "type": "registry:ui", "title": "Tooltip", "dependencies": ["radix-ui"], "registryDependencies": ["utils"], "files": [{ "path": "registry/new-york/ui/tooltip.tsx", "type": "registry:ui" }] },
{ "name": "trash-dashed-border-circle", "type": "registry:ui", "title": "Trash Dashed Border Circle", "dependencies": ["lucide-react"], "files": [{ "path": "registry/new-york/ui/trash-dashed-border-circle.tsx", "type": "registry:ui" }] },
{ "name": "whatsapp-icon", "type": "registry:ui", "title": "WhatsApp Icon", "files": [{ "path": "registry/new-york/ui/whatsapp-icon.tsx", "type": "registry:ui" }] }
```

- [ ] **Step 3: Build and verify**

```bash
cd /var/www/testes/tektonsys-ui
npx shadcn@latest build
for n in alert avatar badge button card checkbox dropdown-menu empty label \
  pagination popover progress radio-group scroll-area separator sheet \
  skeleton sonner switch toggle-group tooltip trash-dashed-border-circle whatsapp-icon; do
  grep -q "\"name\": \"$n\"" public/r/$n.json && echo "$n OK" || echo "$n MISSING"
done
```

Expected: all 23 print `OK`, none print `MISSING`.

---

## Task 8: Migrate UI batch 2 — 7 components depending only on batch 1

**Files:**
- Create: `/var/www/testes/tektonsys-ui/registry/new-york/ui/{dialog,field,form-field,switch-field,tab-button,table-pagination,table}.tsx`
- Modify: `/var/www/testes/tektonsys-ui/registry.json`

**Interfaces:**
- Consumes: the 7 files from `donation-react-router-v7/src/client/components/ui/`.
- Produces: 7 `registry:ui` items, each with `registryDependencies` pointing at the batch-1 items it imports (`button`, `label`, `separator`, `switch`, `pagination`, `empty`) plus `utils`.

- [ ] **Step 1: Copy the files**

```bash
cd /var/www/testes/donation-react-router-v7/src/client/components/ui
cp dialog.tsx field.tsx form-field.tsx switch-field.tsx tab-button.tsx \
   table-pagination.tsx table.tsx \
   /var/www/testes/tektonsys-ui/registry/new-york/ui/
```

- [ ] **Step 2: Add the registry items**

```json
{ "name": "dialog", "type": "registry:ui", "title": "Dialog", "dependencies": ["lucide-react", "radix-ui"], "registryDependencies": ["button", "utils"], "files": [{ "path": "registry/new-york/ui/dialog.tsx", "type": "registry:ui" }] },
{ "name": "field", "type": "registry:ui", "title": "Field", "dependencies": ["tailwind-variants"], "registryDependencies": ["label", "separator", "utils"], "files": [{ "path": "registry/new-york/ui/field.tsx", "type": "registry:ui" }] },
{ "name": "form-field", "type": "registry:ui", "title": "Form Field", "registryDependencies": ["label", "utils"], "files": [{ "path": "registry/new-york/ui/form-field.tsx", "type": "registry:ui" }] },
{ "name": "switch-field", "type": "registry:ui", "title": "Switch Field", "registryDependencies": ["label", "switch", "utils"], "files": [{ "path": "registry/new-york/ui/switch-field.tsx", "type": "registry:ui" }] },
{ "name": "tab-button", "type": "registry:ui", "title": "Tab Button", "dependencies": ["lucide-react"], "registryDependencies": ["button", "utils"], "files": [{ "path": "registry/new-york/ui/tab-button.tsx", "type": "registry:ui" }] },
{ "name": "table-pagination", "type": "registry:ui", "title": "Table Pagination", "dependencies": ["react-router"], "registryDependencies": ["pagination"], "files": [{ "path": "registry/new-york/ui/table-pagination.tsx", "type": "registry:ui" }] },
{ "name": "table", "type": "registry:ui", "title": "Table", "dependencies": ["lucide-react"], "registryDependencies": ["empty", "utils"], "files": [{ "path": "registry/new-york/ui/table.tsx", "type": "registry:ui" }] }
```

- [ ] **Step 3: Build and verify**

```bash
cd /var/www/testes/tektonsys-ui
npx shadcn@latest build
for n in dialog field form-field switch-field tab-button table-pagination table; do
  grep -q "\"name\": \"$n\"" public/r/$n.json && echo "$n OK" || echo "$n MISSING"
done
```

---

## Task 9: Migrate UI batch 3 — 9 components depending on batch 1/2

**Files:**
- Create: `/var/www/testes/tektonsys-ui/registry/new-york/ui/{command,currency-input,file-upload-compact,image-upload-compact,image-upload,input-group,input,select,textarea}.tsx`
- Modify: `/var/www/testes/tektonsys-ui/registry.json`

**Interfaces:**
- Consumes: the 9 files from `donation-react-router-v7/src/client/components/ui/`.
- Produces: 9 `registry:ui` items. `file-upload-compact.tsx` has an existing self-referencing import (`from "~/client/components/ui/file-upload-compact"`) found during dependency inspection — before copying, open the file and confirm what that import actually resolves to (likely a type re-export); if it turns out to be a real circular import bug, fix it as part of this task and flag it clearly to the reviewer instead of silently propagating it.

- [ ] **Step 1: Inspect the file-upload-compact self-import**

```bash
grep -n "file-upload-compact" /var/www/testes/donation-react-router-v7/src/client/components/ui/file-upload-compact.tsx
```

Read the matched line(s) and confirm whether it's a type-only import that should instead come from the same file (remove the import, reference the local type directly) or a genuine bug. Fix in the source repo if needed, matching the pattern used by every other `registry:ui` file (no `export default`, named exports only).

- [ ] **Step 2: Copy the files**

```bash
cd /var/www/testes/donation-react-router-v7/src/client/components/ui
cp command.tsx currency-input.tsx file-upload-compact.tsx \
   image-upload-compact.tsx image-upload.tsx input-group.tsx input.tsx \
   select.tsx textarea.tsx \
   /var/www/testes/tektonsys-ui/registry/new-york/ui/
```

- [ ] **Step 3: Add the registry items**

```json
{ "name": "command", "type": "registry:ui", "title": "Command", "dependencies": ["cmdk", "lucide-react"], "registryDependencies": ["dialog", "utils"], "files": [{ "path": "registry/new-york/ui/command.tsx", "type": "registry:ui" }] },
{ "name": "currency-input", "type": "registry:ui", "title": "Currency Input", "registryDependencies": ["form-field", "utils"], "files": [{ "path": "registry/new-york/ui/currency-input.tsx", "type": "registry:ui" }] },
{ "name": "file-upload-compact", "type": "registry:ui", "title": "File Upload Compact", "dependencies": ["lucide-react"], "registryDependencies": ["button", "form-field", "utils"], "files": [{ "path": "registry/new-york/ui/file-upload-compact.tsx", "type": "registry:ui" }] },
{ "name": "image-upload-compact", "type": "registry:ui", "title": "Image Upload Compact", "dependencies": ["lucide-react"], "registryDependencies": ["button", "form-field", "utils"], "files": [{ "path": "registry/new-york/ui/image-upload-compact.tsx", "type": "registry:ui" }] },
{ "name": "image-upload", "type": "registry:ui", "title": "Image Upload", "dependencies": ["lucide-react"], "registryDependencies": ["button", "form-field", "utils"], "files": [{ "path": "registry/new-york/ui/image-upload.tsx", "type": "registry:ui" }] },
{ "name": "input-group", "type": "registry:ui", "title": "Input Group", "registryDependencies": ["form-field", "utils"], "files": [{ "path": "registry/new-york/ui/input-group.tsx", "type": "registry:ui" }] },
{ "name": "input", "type": "registry:ui", "title": "Input", "dependencies": ["lucide-react"], "registryDependencies": ["form-field", "utils"], "files": [{ "path": "registry/new-york/ui/input.tsx", "type": "registry:ui" }] },
{ "name": "select", "type": "registry:ui", "title": "Select", "dependencies": ["lucide-react", "radix-ui"], "registryDependencies": ["form-field", "utils"], "files": [{ "path": "registry/new-york/ui/select.tsx", "type": "registry:ui" }] },
{ "name": "textarea", "type": "registry:ui", "title": "Textarea", "registryDependencies": ["form-field", "utils"], "files": [{ "path": "registry/new-york/ui/textarea.tsx", "type": "registry:ui" }] }
```

- [ ] **Step 4: Build and verify**

```bash
cd /var/www/testes/tektonsys-ui
npx shadcn@latest build
for n in command currency-input file-upload-compact image-upload-compact \
  image-upload input-group input select textarea; do
  grep -q "\"name\": \"$n\"" public/r/$n.json && echo "$n OK" || echo "$n MISSING"
done
```

---

## Task 10: Migrate UI batch 4 — combobox, phone-input, sidebar

**Files:**
- Create: `/var/www/testes/tektonsys-ui/registry/new-york/ui/{combobox,phone-input,sidebar}.tsx`
- Modify: `/var/www/testes/tektonsys-ui/registry.json`

**Interfaces:**
- Consumes: the 3 files from `donation-react-router-v7/src/client/components/ui/`.
- Produces: 3 `registry:ui` items, closing out the component migration. `sidebar` is the only `registry:ui` item in this plan with a `registryDependencies` entry on a hook (`use-mobile`).

- [ ] **Step 1: Copy the files**

```bash
cd /var/www/testes/donation-react-router-v7/src/client/components/ui
cp combobox.tsx phone-input.tsx sidebar.tsx \
   /var/www/testes/tektonsys-ui/registry/new-york/ui/
```

- [ ] **Step 2: Add the registry items**

```json
{ "name": "combobox", "type": "registry:ui", "title": "Combobox", "dependencies": ["lucide-react"], "registryDependencies": ["button", "command", "popover"], "files": [{ "path": "registry/new-york/ui/combobox.tsx", "type": "registry:ui" }] },
{ "name": "phone-input", "type": "registry:ui", "title": "Phone Input", "dependencies": ["lucide-react", "react-phone-number-input"], "registryDependencies": ["button", "command", "input", "popover", "scroll-area", "utils"], "files": [{ "path": "registry/new-york/ui/phone-input.tsx", "type": "registry:ui" }] },
{ "name": "sidebar", "type": "registry:ui", "title": "Sidebar", "dependencies": ["lucide-react", "radix-ui", "tailwind-variants"], "registryDependencies": ["button", "input", "separator", "sheet", "skeleton", "tooltip", "use-mobile", "utils"], "files": [{ "path": "registry/new-york/ui/sidebar.tsx", "type": "registry:ui" }] }
```

- [ ] **Step 3: Build and verify**

```bash
cd /var/www/testes/tektonsys-ui
npx shadcn@latest build
for n in combobox phone-input sidebar; do
  grep -q "\"name\": \"$n\"" public/r/$n.json && echo "$n OK" || echo "$n MISSING"
done
```

---

## Task 11: Deploy to Vercel and verify public URLs

**Files:** none (infra step).

**Interfaces:**
- Consumes: the full `public/r/*.json` output built across Tasks 4–10.
- Produces: a live, public URL `https://tektonsys-ui.vercel.app` serving every item's JSON at `/r/{name}.json`.

- [ ] **Step 1: Push the repository**

Create the `tektonsys-ui` remote (GitHub, under the same account/org used for `donation-react-router-v7`) and push:

```bash
cd /var/www/testes/tektonsys-ui
git remote add origin <git-remote-url-you-create>
git push -u origin main
```

- [ ] **Step 2: Connect to Vercel and deploy**

Via the Vercel dashboard (or `vercel` CLI if already authenticated), import the `tektonsys-ui` repository with default Next.js settings and deploy. No environment variables are required.

- [ ] **Step 3: Verify public access**

```bash
curl -s https://tektonsys-ui.vercel.app/r/button.json | grep -q '"name": "button"' && echo OK
curl -s https://tektonsys-ui.vercel.app/r/theme.json | grep -q '"name": "theme"' && echo OK
curl -s https://tektonsys-ui.vercel.app/r/use-filter.json | grep -q '"name": "use-filter"' && echo OK
```

Expected: all three print `OK` with no auth header needed.

- [ ] **Step 4: Record the final URL**

Note the actual deployed URL (it may differ from `tektonsys-ui.vercel.app` depending on what's available) — this is the value used as `registries["@ds"]` in every consumer project, including `donation-react-router-v7` in the next plan.

---

## Task 12: End-to-end install validation

**Files:**
- Create: a throwaway scratch project, e.g. `/tmp/tektonsys-ui-validation/` (not committed anywhere).

**Interfaces:**
- Consumes: the deployed registry from Task 11.
- Produces: proof that every item in the registry installs cleanly into a project with the same alias conventions as `donation-react-router-v7`/the future events project, with no missing `registryDependencies` and no TypeScript errors.

- [ ] **Step 1: Scaffold a scratch consumer**

```bash
cd /tmp
npx shadcn@latest init --template next -n tektonsys-ui-validation -b radix -y
cd tektonsys-ui-validation
```

- [ ] **Step 2: Point it at the deployed registry**

Edit `components.json`, add:

```json
{
  "registries": {
    "@ds": "https://tektonsys-ui.vercel.app/r/{name}.json"
  }
}
```

(use the actual URL recorded in Task 11, Step 4)

- [ ] **Step 3: Install every item**

```bash
npx shadcn@latest add @ds/utils @ds/theme @ds/use-mobile @ds/use-theme @ds/use-filter @ds/use-query-toast \
  @ds/alert @ds/avatar @ds/badge @ds/button @ds/card @ds/checkbox @ds/dropdown-menu @ds/empty @ds/label \
  @ds/pagination @ds/popover @ds/progress @ds/radio-group @ds/scroll-area @ds/separator @ds/sheet @ds/skeleton \
  @ds/sonner @ds/switch @ds/toggle-group @ds/tooltip @ds/trash-dashed-border-circle @ds/whatsapp-icon \
  @ds/dialog @ds/field @ds/form-field @ds/switch-field @ds/tab-button @ds/table-pagination @ds/table \
  @ds/command @ds/currency-input @ds/file-upload-compact @ds/image-upload-compact @ds/image-upload \
  @ds/input-group @ds/input @ds/select @ds/textarea @ds/combobox @ds/phone-input @ds/sidebar
```

Expected: the CLI reports every item installed, with no "registry dependency not found" errors. `@arkyn/components` will be flagged as a dependency to install manually for `use-filter`/`use-query-toast` — install it (`npm install @arkyn/components`) so the next step can typecheck cleanly.

Note: `@ds/theme` writes to `~/src/client/themes/tailwind.css`, a path that doesn't match this scratch Next.js app's own CSS location — that's expected here (this scratch app only exists to validate that every item *installs* and *typechecks*, not to visually render with the shared theme). The real consumers (`donation-react-router-v7` and the future events project) already use the `src/client/themes/tailwind.css` path, so the target is correct for them.

- [ ] **Step 4: Typecheck the scratch project**

```bash
npx tsc --noEmit
```

Expected: no errors. If there are missing-module errors, trace them back to the offending registry item's `dependencies`/`registryDependencies` array in `tektonsys-ui/registry.json`, fix it there, re-run `npx shadcn@latest build` + redeploy, and re-run this validation step.

- [ ] **Step 5: Clean up**

```bash
rm -rf /tmp/tektonsys-ui-validation
```

No commit — this task's deliverable is the validation result, not an artifact.
