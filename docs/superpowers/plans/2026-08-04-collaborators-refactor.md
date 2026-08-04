# Collaborators Page Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refatorar a tela de colaboradores para eliminar prop drilling, fazendo cada componente ler o que precisa diretamente do `useLoaderData`, seguindo o mesmo padrão da tela de doadores.

**Architecture:** Cada componente filho (`CollaboratorsHeader`, `CollaboratorsTable`, modais) passa a chamar `useLoaderData<CollaboratorsLoader>()` diretamente para acessar dados do loader. Estados de diálogo migram para os componentes que os possuem. `CollaboratorsPage` torna-se thin, sem estado.

**Tech Stack:** React 19, React Router v7 (SSR), TypeScript, Tailwind CSS v4

## Global Constraints

- Nunca usar `<input type="hidden" name="_action">` — o `name`/`value` da action vai no `<Button type="submit">`
- Nunca usar elementos HTML nativos onde há componente equivalente no design system (`<Button>`, `<Input>`, etc.)
- Named imports do React (`useState`, `useEffect`) — nunca `import * as React`
- Nenhuma mudança na camada de infra/gateway/use case/controller/factory/route
- Comportamento e visual da UI devem permanecer idênticos após a refatoração
- Trabalhar em `master` direto: `/var/www/testes/donation-react-router-v7/`

---

## Mapa de arquivos

| Arquivo | O que muda |
|---|---|
| `src/client/pages/collaborators/components/accessActionModal.tsx` | Move `_action` de hidden input para botão |
| `src/client/pages/collaborators/components/addCollaboratorModal.tsx` | Props simplificadas; `useLoaderData`; estado local |
| `src/client/pages/collaborators/components/changeRoleModal.tsx` | Props simplificadas; `useLoaderData`; estado local |
| `src/client/pages/collaborators/components/collaboratorsTable.tsx` | Remove props; `useLoaderData`; `DialogState`; renderiza modais |
| `src/client/pages/collaborators/components/header.tsx` | Auto-contido; `useLoaderData`; renderiza `AddCollaboratorModal` |
| `src/client/pages/collaborators/index.tsx` | Thin — sem estado, sem mapeamento |

**Não alterar:**
- `src/client/pages/collaborators/components/inviteSentModal.tsx`
- `src/client/pages/collaborators/components/types.ts`
- `src/client/types/collaboratorsLoader.ts`
- `src/main/routes/route.campaign.collaborators.tsx`

---

## Task 1: Corrigir `AccessActionModal` — `_action` no botão

**Files:**
- Modify: `src/client/pages/collaborators/components/accessActionModal.tsx`

**Interfaces:**
- Produces: mesmo componente com mesma assinatura de props, comportamento inalterado

- [ ] **Step 1: Mover `_action` do hidden input para o botão de submit**

Abrir `src/client/pages/collaborators/components/accessActionModal.tsx`.

Remover a linha:
```tsx
<input type="hidden" name="_action" value={actionName ?? ""} />
```

Alterar o botão de submit de:
```tsx
<Button
  type="submit"
  variant="danger"
  disabled={isSubmitting || !actionName || !resourceId}
  isLoading={isSubmitting}
>
  {actionLabel}
</Button>
```

Para:
```tsx
<Button
  type="submit"
  name="_action"
  value={actionName ?? ""}
  variant="danger"
  disabled={isSubmitting || !actionName || !resourceId}
  isLoading={isSubmitting}
>
  {actionLabel}
</Button>
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros de TypeScript.

---

## Task 2: Refatorar `AddCollaboratorModal` — props simplificadas

**Files:**
- Modify: `src/client/pages/collaborators/components/addCollaboratorModal.tsx`
- Modify: `src/client/pages/collaborators/index.tsx` (atualizar call site)

**Interfaces:**
- Consumes: `CollaboratorsLoader` de `~/client/types/collaboratorsLoader`
- Produces: `AddCollaboratorModal` com nova assinatura: `{ open: boolean; onClose: () => void }`

- [ ] **Step 1: Reescrever `AddCollaboratorModal`**

Substituir o conteúdo de `src/client/pages/collaborators/components/addCollaboratorModal.tsx` por:

```tsx
import { Send } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormField, FormErrorProvider } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { RadioGroup } from "~/client/components/ui/radio-group";
import type { CollaboratorsLoader } from "~/client/types/collaboratorsLoader";
import { InviteSentModal } from "./inviteSentModal";

type AddCollaboratorModalProps = {
  open: boolean;
  onClose: () => void;
};

function AddCollaboratorModal({ open, onClose }: AddCollaboratorModalProps) {
  const { projectRoles } = useLoaderData<CollaboratorsLoader>();
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState(projectRoles[0]?.id ?? "");
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      setSuccessOpen(true);
    }
  }, [fetcher.state, fetcher.data]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    setSubmittedEmail(String(formData.get("userEmail") ?? "").trim());
  }

  function handleSuccessConfirm() {
    setSuccessOpen(false);
    setSubmittedEmail("");
    formRef.current?.reset();
    onClose();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
        <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-132">
          <DialogHeader className="shrink-0 px-8 pb-5 pt-8">
            <DialogTitle className="text-xl">Adicionar colaborador</DialogTitle>
            <p className="text-base text-muted-foreground">
              Envie um convite por e-mail e defina a função de acesso.
            </p>
          </DialogHeader>

          <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
            <fetcher.Form
              ref={formRef}
              method="post"
              className="flex min-h-0 flex-1 flex-col"
              onSubmit={handleSubmit}
            >
              <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-8 pb-6">
                <FormField name="userEmail" label="E-mail" required>
                  <Input
                    name="userEmail"
                    type="email"
                    placeholder="colaborador@exemplo.com"
                  />
                </FormField>

                <FormField name="roleId" label="Função" required>
                  <RadioGroup.Root
                    name="roleId"
                    value={selectedRoleId}
                    onValueChange={setSelectedRoleId}
                    className="flex flex-col gap-4"
                  >
                    {projectRoles.map((role) => (
                      <label
                        key={role.id}
                        className="flex cursor-pointer gap-4 rounded-xl border border-border p-4 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                      >
                        <RadioGroup.Item value={role.id} className="mt-1" />
                        <span className="flex flex-col gap-2">
                          <span className="text-base font-semibold text-foreground">
                            {role.name}
                          </span>
                          <span className="text-sm leading-6 text-muted-foreground">
                            {role.description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </RadioGroup.Root>
                </FormField>
              </div>

              <DialogFooter className="shrink-0 border-t border-border px-8 py-5">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  name="_action"
                  value="createInviteCollaborator"
                  disabled={isSubmitting || !selectedRoleId}
                  isLoading={isSubmitting}
                  className="gap-2"
                >
                  <Send size={16} />
                  Enviar convite
                </Button>
              </DialogFooter>
            </fetcher.Form>
          </FormErrorProvider>
        </DialogContent>
      </Dialog>

      <InviteSentModal
        open={successOpen}
        email={submittedEmail}
        onConfirm={handleSuccessConfirm}
      />
    </>
  );
}

export { AddCollaboratorModal };
```

- [ ] **Step 2: Atualizar o call site em `CollaboratorsPage`**

Abrir `src/client/pages/collaborators/index.tsx`.

Localizar onde `AddCollaboratorModal` é renderizado e substituir:
```tsx
<AddCollaboratorModal
  open={addOpen}
  roles={roles}
  selectedRoleId={selectedRoleId}
  onOpenChange={setAddOpen}
  onSelectedRoleChange={setSelectedRoleId}
/>
```

Por:
```tsx
<AddCollaboratorModal
  open={addOpen}
  onClose={() => setAddOpen(false)}
/>
```

Ainda **não** remover os estados `addOpen` e `selectedRoleId` do `CollaboratorsPage` — isso acontece na Task 5.

- [ ] **Step 3: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros de TypeScript.

---

## Task 3: Refatorar `ChangeRoleModal` — props simplificadas

**Files:**
- Modify: `src/client/pages/collaborators/components/changeRoleModal.tsx`
- Modify: `src/client/pages/collaborators/index.tsx` (atualizar call site)

**Interfaces:**
- Consumes: `CollaboratorsLoader` de `~/client/types/collaboratorsLoader`; `ActiveCollaborator` de `./types`
- Produces: `ChangeRoleModal` com nova assinatura: `{ collaborator: ActiveCollaborator | null; onClose: () => void }`

- [ ] **Step 1: Reescrever `ChangeRoleModal`**

Substituir o conteúdo de `src/client/pages/collaborators/components/changeRoleModal.tsx` por:

```tsx
import { useEffect, useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormField, FormErrorProvider } from "~/client/components/ui/form-field";
import { RadioGroup } from "~/client/components/ui/radio-group";
import { useActionToast } from "~/client/hooks/useActionToast";
import type { CollaboratorsLoader } from "~/client/types/collaboratorsLoader";
import type { ActiveCollaborator } from "./types";

type ChangeRoleModalProps = {
  collaborator: ActiveCollaborator | null;
  onClose: () => void;
};

function ChangeRoleModal({ collaborator, onClose }: ChangeRoleModalProps) {
  const { projectRoles } = useLoaderData<CollaboratorsLoader>();
  const fetcher = useFetcher();
  const [selectedRoleId, setSelectedRoleId] = useState(collaborator?.role.id ?? "");
  const isSubmitting = fetcher.state !== "idle";

  useActionToast(fetcher.data);

  useEffect(() => {
    if (collaborator) setSelectedRoleId(collaborator.role.id);
  }, [collaborator]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Dialog open={!!collaborator} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-132">
        <DialogHeader className="shrink-0 px-8 pb-5 pt-8">
          <DialogTitle className="text-xl">Alterar função</DialogTitle>
          <p className="text-base text-muted-foreground">
            Atualize a função de acesso de {collaborator?.name}.
          </p>
        </DialogHeader>

        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form
            method="post"
            className="flex min-h-0 flex-1 flex-col"
          >
            <input type="hidden" name="Id" value={collaborator?.id ?? ""} />

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-8 pb-6">
              <FormField name="roleId" label="Função" required>
                <RadioGroup.Root
                  name="roleId"
                  value={selectedRoleId}
                  onValueChange={setSelectedRoleId}
                  className="flex flex-col gap-4"
                >
                  {projectRoles.map((role) => (
                    <label
                      key={role.id}
                      className="flex cursor-pointer gap-4 rounded-xl border border-border p-4 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                    >
                      <RadioGroup.Item value={role.id} className="mt-1" />
                      <span className="flex flex-col gap-2">
                        <span className="text-base font-semibold text-foreground">
                          {role.name}
                        </span>
                        <span className="text-sm leading-6 text-muted-foreground">
                          {role.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </RadioGroup.Root>
              </FormField>
            </div>

            <DialogFooter className="shrink-0 border-t border-border px-8 py-5">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                name="_action"
                value="updateInviteCollaborator"
                disabled={
                  isSubmitting ||
                  !selectedRoleId ||
                  selectedRoleId === collaborator?.role.id
                }
                isLoading={isSubmitting}
              >
                Salvar alteração
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { ChangeRoleModal };
```

- [ ] **Step 2: Atualizar o call site em `CollaboratorsPage`**

Abrir `src/client/pages/collaborators/index.tsx`.

Localizar onde `ChangeRoleModal` é renderizado e substituir:
```tsx
<ChangeRoleModal
  collaborator={changeRoleCollaborator}
  roles={roles}
  selectedRoleId={selectedRoleId}
  onClose={() => setChangeRoleCollaborator(null)}
  onSelectedRoleChange={setSelectedRoleId}
/>
```

Por:
```tsx
<ChangeRoleModal
  collaborator={changeRoleCollaborator}
  onClose={() => setChangeRoleCollaborator(null)}
/>
```

- [ ] **Step 3: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros de TypeScript.

---

## Task 4: Tornar `CollaboratorsTable` auto-contido

**Files:**
- Modify: `src/client/pages/collaborators/components/collaboratorsTable.tsx`
- Modify: `src/client/pages/collaborators/index.tsx` (remover props e modais do pai)

**Interfaces:**
- Consumes: `CollaboratorsLoader`; `ActiveCollaborator`, `PendingCollaborator` de `./types`; `ChangeRoleModal`; `AccessActionModal`
- Produces: `CollaboratorsTable` sem props

- [ ] **Step 1: Reescrever `CollaboratorsTable`**

Substituir o conteúdo de `src/client/pages/collaborators/components/collaboratorsTable.tsx` por:

```tsx
import {
  MoreHorizontal,
  Pencil,
  Send,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { Table } from "~/client/components/ui/table";
import type { CollaboratorsLoader } from "~/client/types/collaboratorsLoader";
import { AccessActionModal } from "./accessActionModal";
import { ChangeRoleModal } from "./changeRoleModal";
import type { ActiveCollaborator, CollaboratorRole, PendingCollaborator } from "./types";

const STATUS_BADGE: Record<string, { className: string; label: string }> = {
  Pendente: { className: "bg-amber-100 text-amber-700", label: "Pendente" },
  Aceito: { className: "bg-emerald-100 text-emerald-700", label: "Aceito" },
  Recusado: { className: "bg-red-100 text-red-700", label: "Recusado" },
  cancelled: { className: "bg-red-100 text-red-700", label: "Recusado" },
  revoked: { className: "bg-zinc-100 text-zinc-600", label: "Acesso removido" },
};

const ROLE_TONES: CollaboratorRole["tone"][] = ["emerald", "navy", "violet"];

type DialogState =
  | { type: "changeRole"; collaborator: ActiveCollaborator }
  | { type: "removeAccess"; collaborator: ActiveCollaborator }
  | { type: "cancelInvite"; invite: PendingCollaborator }
  | null;

function getInitials(name: string, email: string) {
  const base = name.trim() || email.split("@")[0] || email;
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "--";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatStatus(status: string) {
  const normalized = status.trim().toLowerCase();
  if (normalized === "pending") return "Pendente";
  if (normalized === "accepted") return "Aceito";
  if (normalized === "rejected") return "Recusado";
  return status;
}

function getRoleTone(name: string, index: number): CollaboratorRole["tone"] {
  const normalizedName = name.trim().toLowerCase();
  if (normalizedName.includes("supervisor")) return "violet";
  if (normalizedName.includes("finance")) return "navy";
  if (normalizedName.includes("relacionamento")) return "emerald";
  return ROLE_TONES[index % ROLE_TONES.length];
}

function CollaboratorsTable() {
  const { collaborators, inviteCollaborators, projectRoles } =
    useLoaderData<CollaboratorsLoader>();
  const [tab, setTab] = useState<"active" | "pending">("active");
  const [dialog, setDialog] = useState<DialogState>(null);

  const roles: CollaboratorRole[] = projectRoles.map((role, index) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    tone: getRoleTone(role.name, index),
  }));
  const rolesById = new Map(roles.map((role) => [role.id, role]));

  const activeCollaborators: ActiveCollaborator[] = collaborators.data.map(
    (collaborator) => ({
      id: collaborator.id,
      initials: getInitials(collaborator.user.name, collaborator.user.email),
      name: collaborator.user.name,
      email: collaborator.user.email,
      role: rolesById.get(collaborator.roleId) ?? {
        id: collaborator.roleId,
        name: "Função não encontrada",
        description: "Esta função não está disponível na lista de funções.",
        tone: "navy" as const,
      },
    }),
  );

  const pendingCollaborators: PendingCollaborator[] = inviteCollaborators.data
    .filter((invite) => invite.inviteStatus.trim().toLowerCase() !== "accepted")
    .map((invite) => ({
      id: invite.id,
      initials: getInitials(invite.invitedUserName, invite.invitedUserEmail),
      name: invite.invitedUserName,
      email: invite.invitedUserEmail,
      status: formatStatus(invite.inviteStatus),
    }));

  const isActiveTab = tab === "active";
  const rows = isActiveTab ? activeCollaborators : pendingCollaborators;

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex w-fit rounded-xl border border-border bg-card p-1">
          <Button
            variant={isActiveTab ? "secondary" : "ghost"}
            size="sm"
            className="gap-2 rounded-lg"
            onClick={() => setTab("active")}
          >
            <Users size={15} />
            Ativos
            <span className="rounded-full bg-muted px-2 text-xs">
              {activeCollaborators.length}
            </span>
          </Button>
          <Button
            variant={!isActiveTab ? "secondary" : "ghost"}
            size="sm"
            className="gap-2 rounded-lg"
            onClick={() => setTab("pending")}
          >
            <Send size={15} />
            Pendentes
            <span className="rounded-full bg-muted px-2 text-xs">
              {pendingCollaborators.length}
            </span>
          </Button>
        </div>

        <Card.Root className="gap-4 p-6">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>{isActiveTab ? "Nome" : "E-mail"}</Table.Head>
                {isActiveTab && <Table.Head>E-mail</Table.Head>}
                <Table.Head>Função</Table.Head>
                {!isActiveTab && <Table.Head>Convidado</Table.Head>}
                {!isActiveTab && <Table.Head>Status</Table.Head>}
                <Table.Head className="text-right">Ações</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.map((row) =>
                isActiveTab ? (
                  <Table.Row key={row.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3.5">
                        <Avatar size="lg">
                          <AvatarFallback className="bg-sidebar-accent-foreground/10 text-xs font-bold text-sidebar-accent-foreground">
                            {(row as ActiveCollaborator).initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">
                          {(row as ActiveCollaborator).name}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="font-mono text-xs text-muted-foreground">
                      {(row as ActiveCollaborator).email}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        className="py-3"
                        variant={(row as ActiveCollaborator).role.tone}
                      >
                        {(row as ActiveCollaborator).role.name}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-9 text-muted-foreground"
                          >
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onSelect={() =>
                              setDialog({ type: "changeRole", collaborator: row as ActiveCollaborator })
                            }
                          >
                            <Pencil size={16} />
                            Alterar função
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() =>
                              setDialog({ type: "removeAccess", collaborator: row as ActiveCollaborator })
                            }
                          >
                            <Trash2 size={16} />
                            Remover acesso
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  <Table.Row key={row.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3.5">
                        <Avatar size="lg">
                          <AvatarFallback className="bg-sidebar-accent-foreground/10 text-xs font-bold text-sidebar-accent-foreground">
                            {(row as PendingCollaborator).initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate text-sm text-foreground">
                          {(row as PendingCollaborator).email}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-muted-foreground">
                      <span>-</span>
                    </Table.Cell>
                    <Table.Cell className="text-muted-foreground">
                      <span>-</span>
                    </Table.Cell>
                    <Table.Cell>
                      {(() => {
                        const s = STATUS_BADGE[(row as PendingCollaborator).status];
                        return (
                          <Badge
                            className={s?.className ?? "bg-muted text-muted-foreground"}
                          >
                            {s?.label ?? (row as PendingCollaborator).status}
                          </Badge>
                        );
                      })()}
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-9 text-muted-foreground"
                          >
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <UserCheck size={16} />
                            Reenviar convite
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() =>
                              setDialog({ type: "cancelInvite", invite: row as PendingCollaborator })
                            }
                          >
                            <Trash2 size={16} />
                            Cancelar convite
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Table.Cell>
                  </Table.Row>
                ),
              )}

              {isActiveTab && !activeCollaborators.length && (
                <Table.Empty title="Nenhum colaborador ativo encontrado." />
              )}
              {!isActiveTab && !pendingCollaborators.length && (
                <Table.Empty title="Nenhum convite pendente encontrado." />
              )}
            </Table.Body>
          </Table.Root>
        </Card.Root>
      </div>

      <ChangeRoleModal
        collaborator={dialog?.type === "changeRole" ? dialog.collaborator : null}
        onClose={() => setDialog(null)}
      />
      <AccessActionModal
        open={dialog?.type === "removeAccess"}
        title="Remover acesso"
        description={`Remover o acesso de ${dialog?.type === "removeAccess" ? dialog.collaborator.name : "este colaborador"} à campanha?`}
        actionLabel="Remover acesso"
        actionName="deleteInviteCollaborator"
        resourceId={dialog?.type === "removeAccess" ? dialog.collaborator.id : undefined}
        onClose={() => setDialog(null)}
      />
      <AccessActionModal
        open={dialog?.type === "cancelInvite"}
        title="Cancelar convite"
        description={`Cancelar o convite enviado para ${dialog?.type === "cancelInvite" ? dialog.invite.email : "este e-mail"}?`}
        actionLabel="Cancelar convite"
        onClose={() => setDialog(null)}
      />
    </>
  );
}

export { CollaboratorsTable };
```

- [ ] **Step 2: Atualizar `CollaboratorsPage` — remover estados e modais migrados**

Abrir `src/client/pages/collaborators/index.tsx`.

Remover os seguintes imports que não serão mais usados:
```tsx
import { ChangeRoleModal } from "./components/changeRoleModal";
import { AccessActionModal } from "./components/accessActionModal";
import type {
  ActiveCollaborator,
  CollaboratorRole,
  PendingCollaborator,
} from "./components/types";
```

Remover os estados:
```tsx
const [changeRoleCollaborator, setChangeRoleCollaborator] = useState<ActiveCollaborator | null>(null);
const [removeCollaborator, setRemoveCollaborator] = useState<ActiveCollaborator | null>(null);
const [cancelInvite, setCancelInvite] = useState<PendingCollaborator | null>(null);
```

Remover as funções:
```tsx
function handleChangeRole(collaborator: ActiveCollaborator) { ... }
```

Remover as constantes derivadas de loader:
```tsx
const roles: CollaboratorRole[] = ...
const rolesById = ...
const activeCollaborators: ActiveCollaborator[] = ...
const pendingCollaborators: PendingCollaborator[] = ...
```

Remover helpers (que agora vivem na tabela):
```tsx
function getInitials(...) { ... }
function formatStatus(...) { ... }
function getRoleTone(...) { ... }
const ROLE_TONES = ...
```

Remover as renderizações de `<ChangeRoleModal>` e dos dois `<AccessActionModal>`.

Atualizar `<CollaboratorsTable>` — remover todas as props (agora sem props):
```tsx
<CollaboratorsTable />
```

O arquivo `index.tsx` deve ficar assim após as remoções:

```tsx
import { useState } from "react";
import { AddCollaboratorModal } from "./components/addCollaboratorModal";
import { CollaboratorsHeader } from "./components/header";
import { CollaboratorsTable } from "./components/collaboratorsTable";

function CollaboratorsPage() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <CollaboratorsHeader onAddCollaborator={() => setAddOpen(true)} />
      <CollaboratorsTable />

      <AddCollaboratorModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
    </div>
  );
}

export { CollaboratorsPage };
```

Nota: `addOpen`, `AddCollaboratorModal` e `CollaboratorsHeader` com prop ainda existem aqui — serão migrados para dentro do `CollaboratorsHeader` na Task 5.

- [ ] **Step 3: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros de TypeScript.

---

## Task 5: Tornar `CollaboratorsHeader` auto-contido + finalizar `CollaboratorsPage`

**Files:**
- Modify: `src/client/pages/collaborators/components/header.tsx`
- Modify: `src/client/pages/collaborators/index.tsx` (versão final thin)

**Interfaces:**
- Consumes: `CollaboratorsLoader`; `AddCollaboratorModal`
- Produces: `CollaboratorsHeader` sem props; `CollaboratorsPage` thin sem estado

- [ ] **Step 1: Reescrever `CollaboratorsHeader`**

Substituir o conteúdo de `src/client/pages/collaborators/components/header.tsx` por:

```tsx
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/client/components/ui/button";
import { AddCollaboratorModal } from "./addCollaboratorModal";

function CollaboratorsHeader() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
            Colaboradores
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie quem tem acesso a esta campanha e suas funções.
          </p>
        </div>

        <Button className="gap-2" onClick={() => setAddOpen(true)}>
          <Plus size={16} />
          Adicionar colaborador
        </Button>
      </div>

      <AddCollaboratorModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}

export { CollaboratorsHeader };
```

- [ ] **Step 2: Tornar `CollaboratorsPage` thin — versão final**

Substituir o conteúdo de `src/client/pages/collaborators/index.tsx` por:

```tsx
import { CollaboratorsHeader } from "./components/header";
import { CollaboratorsTable } from "./components/collaboratorsTable";

function CollaboratorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <CollaboratorsHeader />
      <CollaboratorsTable />
    </div>
  );
}

export { CollaboratorsPage };
```

- [ ] **Step 3: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros de TypeScript.

- [ ] **Step 4: Verificar no browser**

Iniciar o servidor de desenvolvimento:
```bash
cd /var/www/testes/donation-react-router-v7 && npm run dev
```

Navegar até a tela de colaboradores de uma campanha e verificar:
- A lista de colaboradores ativos é exibida corretamente
- A aba "Pendentes" mostra os convites pendentes
- O botão "Adicionar colaborador" abre o modal com as funções
- O dropdown de ações do colaborador abre o modal "Alterar função" e "Remover acesso"
- O dropdown de convites pendentes abre o modal "Cancelar convite"
- Submissão do formulário de adicionar colaborador funciona e exibe o modal de confirmação
