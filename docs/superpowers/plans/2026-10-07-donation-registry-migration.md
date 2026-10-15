# Donation Registry Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Switch `donation-react-router-v7` from locally-owned copies of `src/client/components/ui/*`, `src/lib/utils.ts` and the four generic hooks to copies installed from the `tektonsys-ui` registry, with zero behavior change.

**Architecture:** Add `@ds` to `components.json`'s `registries` map, then for each migrated file, run `npx shadcn add -y -o @ds/<name>` to overwrite the local copy with the registry-sourced one, verifying with `git diff` that the resulting file is byte-for-byte (or whitespace-only) identical to what was there before — this plan does not change any component's behavior, only its source of truth.

**Tech Stack:** shadcn CLI (`shadcn add`), same stack as the rest of `donation-react-router-v7`.

**Spec:** `docs/superpowers/specs/2026-10-07-design-system-registry-design.md`

**Depends on:** `docs/superpowers/plans/2026-10-07-tektonsys-ui-registry.md` must be fully executed first — this plan needs the live `@ds` registry URL from that plan's Task 11.

## Global Constraints

- Do not run this plan until `tektonsys-ui` Task 12 (end-to-end install validation) has passed — installing from a broken registry into the real product repo is the wrong place to discover a missing `registryDependencies` entry.
- Every `npx shadcn add` call in this plan uses `-y -o` (skip confirmation, overwrite in place) — these are intentional overwrites of files this plan expects to change.
- After every batch, `git diff` on the touched files is inspected. A diff that is empty or whitespace/import-ordering only is expected and fine. A diff that changes JSX structure, props, or logic is not expected in this plan and must be investigated before moving to the next task (it would mean the registry item doesn't match what was migrated in the other plan).
- `npm run typecheck` (`react-router typegen && tsc`) and `npm run build` (`react-router build`) must pass after every batch — these are the only verification commands available in this repo (no test runner is configured).
- The registry URL goes in `components.json` as `"registries": { "@ds": "<url-from-tektonsys-ui-plan-task-11>" }`.

## Review Focus

- **Silent content drift between repos:** if `tektonsys-ui`'s copy of a component diverged from this repo's copy (e.g. someone edited one but not the other between the two plans), `npx shadcn add -o` would silently overwrite local code with different behavior. Each task's `git diff` check is the guard for this — it must be read, not just run.
- **`@arkyn/components` already present:** `use-filter`/`use-query-toast` need `@arkyn/components`, which this repo already has in `package.json` — reinstalling these two hooks must not trigger a redundant/conflicting dependency install. Task 3's verification confirms `npm run typecheck` passes without `package.json` changing.
- **`components.json` aliases unchanged:** adding the `registries` key must not touch the existing `aliases`/`tailwind` config that the rest of the app (and the pre-existing `@reui` registry) depends on. Task 1 verifies via `git diff` that only the `registries` key changed.
- **Pages importing the stray `~/client/lib/utils` path reappearing:** Task 3 of the other plan already deleted `src/client/lib/utils.ts` and fixed its six importers — this plan's batch tasks must not reintroduce it. Each batch's verification includes a grep for `~/client/lib/utils` returning nothing.
- **Build succeeding but dev server broken:** `npm run build`/`typecheck` passing doesn't prove the UI renders correctly (e.g. a Radix primitive silently changing a data-attribute). The final task includes a manual dev-server smoke check per this repo's own CLAUDE.md testing guidance, not just the CLI checks.

---

## Task 1: Point `components.json` at the `@ds` registry

**Files:**
- Modify: `/var/www/testes/donation-react-router-v7/components.json`

**Interfaces:**
- Produces: `components.json` with a new `registries.@ds` entry, everything else unchanged.

- [ ] **Step 1: Add the registry entry**

Edit `components.json`'s `registries` object (it already has `@reui`):

```json
{
  "registries": {
    "@reui": "https://reui.io/r/{style}/{name}.json",
    "@ds": "<url-recorded-in-tektonsys-ui-plan-task-11>"
  }
}
```

- [ ] **Step 2: Verify nothing else changed**

```bash
cd /var/www/testes/donation-react-router-v7
git diff components.json
```

Expected: the diff shows only the added `"@ds": "..."` line.

---

## Task 2: Reinstall `utils`, `theme` and generic hooks from `@ds`

**Files:**
- Modify: `src/lib/utils.ts`
- Modify: `src/client/themes/tailwind.css`
- Modify: `src/client/hooks/use-mobile.ts`
- Modify: `src/client/hooks/useTheme.tsx`
- Modify: `src/client/hooks/useFilter.ts`
- Modify: `src/client/hooks/useQueryToast.ts`

**Interfaces:**
- Consumes: `@ds/utils`, `@ds/theme`, `@ds/use-mobile`, `@ds/use-theme`, `@ds/use-filter`, `@ds/use-query-toast`.
- Produces: all six files now sourced from the registry; no behavior change expected.

- [ ] **Step 1: Install**

```bash
cd /var/www/testes/donation-react-router-v7
npx shadcn@latest add -y -o @ds/utils @ds/theme @ds/use-mobile @ds/use-theme @ds/use-filter @ds/use-query-toast
```

- [ ] **Step 2: Verify no unexpected diff**

```bash
cd /var/www/testes/donation-react-router-v7
git diff src/lib/utils.ts src/client/themes/tailwind.css src/client/hooks/use-mobile.ts \
  src/client/hooks/useTheme.tsx src/client/hooks/useFilter.ts src/client/hooks/useQueryToast.ts
git status --porcelain  # confirm package.json wasn't touched
```

Read the diff. Expected: empty, or whitespace/import-order only. If `tailwind.css` shows a structural diff (e.g. a missing `@layer base` rule), stop — that means Task 5 of the `tektonsys-ui` plan dropped something; go fix it there, redeploy, and re-run this step.

- [ ] **Step 3: Typecheck**

```bash
cd /var/www/testes/donation-react-router-v7
npm run typecheck
```

Expected: no errors.

---

## Task 3: Reinstall UI batch 1 — 23 leaf components

**Files:**
- Modify: `src/client/components/ui/{alert,avatar,badge,button,card,checkbox,dropdown-menu,empty,label,pagination,popover,progress,radio-group,scroll-area,separator,sheet,skeleton,sonner,switch,toggle-group,tooltip,trash-dashed-border-circle,whatsapp-icon}.tsx`

**Interfaces:**
- Consumes: the matching 23 `@ds` registry items.
- Produces: all 23 files sourced from the registry.

- [ ] **Step 1: Install**

```bash
cd /var/www/testes/donation-react-router-v7
npx shadcn@latest add -y -o \
  @ds/alert @ds/avatar @ds/badge @ds/button @ds/card @ds/checkbox \
  @ds/dropdown-menu @ds/empty @ds/label @ds/pagination @ds/popover \
  @ds/progress @ds/radio-group @ds/scroll-area @ds/separator @ds/sheet \
  @ds/skeleton @ds/sonner @ds/switch @ds/toggle-group @ds/tooltip \
  @ds/trash-dashed-border-circle @ds/whatsapp-icon
```

- [ ] **Step 2: Verify no unexpected diff**

```bash
cd /var/www/testes/donation-react-router-v7
git diff --stat src/client/components/ui/
grep -rl '~/client/lib/utils' src/client/components/ui || echo "no stray import"
```

Expected: only the 23 files above show as changed (likely empty/whitespace diffs); the grep prints "no stray import".

- [ ] **Step 3: Typecheck and build**

```bash
cd /var/www/testes/donation-react-router-v7
npm run typecheck
npm run build
```

---

## Task 4: Reinstall UI batch 2 — 7 components

**Files:**
- Modify: `src/client/components/ui/{dialog,field,form-field,switch-field,tab-button,table-pagination,table}.tsx`

**Interfaces:**
- Consumes: the matching 7 `@ds` registry items.

- [ ] **Step 1: Install**

```bash
cd /var/www/testes/donation-react-router-v7
npx shadcn@latest add -y -o \
  @ds/dialog @ds/field @ds/form-field @ds/switch-field @ds/tab-button @ds/table-pagination @ds/table
```

- [ ] **Step 2: Verify no unexpected diff**

```bash
cd /var/www/testes/donation-react-router-v7
git diff --stat src/client/components/ui/
```

Expected: only the 7 files above show as changed.

- [ ] **Step 3: Typecheck and build**

```bash
cd /var/www/testes/donation-react-router-v7
npm run typecheck
npm run build
```

---

## Task 5: Reinstall UI batch 3 — 9 components

**Files:**
- Modify: `src/client/components/ui/{command,currency-input,file-upload-compact,image-upload-compact,image-upload,input-group,input,select,textarea}.tsx`

**Interfaces:**
- Consumes: the matching 9 `@ds` registry items.

- [ ] **Step 1: Install**

```bash
cd /var/www/testes/donation-react-router-v7
npx shadcn@latest add -y -o \
  @ds/command @ds/currency-input @ds/file-upload-compact @ds/image-upload-compact \
  @ds/image-upload @ds/input-group @ds/input @ds/select @ds/textarea
```

- [ ] **Step 2: Verify no unexpected diff**

```bash
cd /var/www/testes/donation-react-router-v7
git diff --stat src/client/components/ui/
```

Expected: only the 9 files above show as changed. Pay particular attention to `file-upload-compact.tsx` — this is the file with the self-import noted in the other plan's Task 9; confirm the fix (if any was made there) is reflected here and no circular import reappears.

- [ ] **Step 3: Typecheck and build**

```bash
cd /var/www/testes/donation-react-router-v7
npm run typecheck
npm run build
```

---

## Task 6: Reinstall UI batch 4 — combobox, phone-input, sidebar

**Files:**
- Modify: `src/client/components/ui/{combobox,phone-input,sidebar}.tsx`

**Interfaces:**
- Consumes: the matching 3 `@ds` registry items.

- [ ] **Step 1: Install**

```bash
cd /var/www/testes/donation-react-router-v7
npx shadcn@latest add -y -o @ds/combobox @ds/phone-input @ds/sidebar
```

- [ ] **Step 2: Verify no unexpected diff**

```bash
cd /var/www/testes/donation-react-router-v7
git diff --stat src/client/components/ui/
```

Expected: only these 3 files show as changed. This completes the full component migration — confirm no file remains in `src/client/components/ui/` that wasn't touched by this plan or a prior task, other than `CLAUDE.md`.

```bash
ls src/client/components/ui/ | grep -v CLAUDE.md
```

Cross-check this list against the union of files touched in Tasks 3–6 (42 files) — it must match exactly.

- [ ] **Step 3: Typecheck and build**

```bash
cd /var/www/testes/donation-react-router-v7
npm run typecheck
npm run build
```

---

## Task 7: Final verification

**Files:** none (verification only).

**Interfaces:**
- Consumes: the fully migrated repo from Tasks 1–6.
- Produces: confidence that the migration is behavior-neutral in the running app, not just in the type checker.

- [ ] **Step 1: Full typecheck and build**

```bash
cd /var/www/testes/donation-react-router-v7
npm run typecheck
npm run build
```

Expected: both pass cleanly, same as before this plan started.

- [ ] **Step 2: Manual smoke test in the browser**

Per this repo's own testing guidance (CLAUDE.md: verify UI changes in a real browser, not just type checks):

```bash
cd /var/www/testes/donation-react-router-v7
npm run dev
```

Open the app and exercise a representative page from each component family touched by this migration: a page with a `Dialog` + `Form` (e.g. a campaign edit modal), a page with the `Sidebar`, a page using `Combobox`/`Select`/`PhoneInput`, a page using `Table`/`Pagination`, and a toast (`sonner`). Confirm visuals and interactions are unchanged from before the migration.

- [ ] **Step 3: Final diff review**

```bash
cd /var/www/testes/donation-react-router-v7
git status --porcelain
git diff --stat
```

Confirm the full set of uncommitted changes from this plan touches only: `components.json`, `src/lib/utils.ts`, `src/client/themes/tailwind.css`, the 4 hook files, and the 42 files in `src/client/components/ui/`. Nothing outside this plan's scope should show up here.

No commit in this plan — review everything in the IDE and commit manually once satisfied.
