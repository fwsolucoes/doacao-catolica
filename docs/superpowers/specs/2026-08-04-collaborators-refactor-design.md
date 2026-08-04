# Refatoração da tela de colaboradores

**Data:** 2026-08-04  
**Escopo:** `src/client/pages/collaborators/` — apenas a camada de apresentação

## Contexto

A tela de colaboradores (`CollaboratorsPage`) age como um hub que agrega dados do loader, mapeia tipos de view e distribui tudo via props para os filhos. Isso cria prop drilling desnecessário e contraria o padrão já estabelecido na tela de doadores, onde cada componente filho lê o que precisa diretamente via `useLoaderData`.

## Objetivo

Refatorar os componentes da tela de colaboradores para seguir o mesmo padrão da tela de doadores: componentes auto-contidos que leem dados do loader diretamente, sem receber dados como props do pai.

## O que não muda

- Toda a camada de infra, gateway, use case, controller, factory e route
- Comportamento de UI e visual idênticos
- `InviteSentModal` — sem alteração de estrutura
- `types.ts` — mantido

---

## Arquitetura

### `CollaboratorsPage` (index.tsx) — thin

Remove todo estado e mapeamento. Apenas renderiza os dois filhos:

```tsx
function CollaboratorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <CollaboratorsHeader />
      <CollaboratorsTable />
    </div>
  );
}
```

### `CollaboratorsHeader` — auto-contido

Passa a gerenciar internamente o modal de adicionar colaborador.

- Chama `useLoaderData<CollaboratorsLoader>()` para obter `projectRoles`
- Estado local: `addOpen: boolean`
- Renderiza `AddCollaboratorModal` internamente
- Nenhuma prop recebida do pai

### `CollaboratorsTable` — auto-contido

Espelha o padrão de `DonorsTable`: lê o loader, gerencia estado de diálogos, renderiza modais internamente.

- Chama `useLoaderData<CollaboratorsLoader>()` para `collaborators`, `inviteCollaborators`, `projectRoles`
- Lógica de mapeamento (`getInitials`, `getRoleTone`, `formatStatus`, `rolesById`) fica local no arquivo
- Estado de diálogo via discriminated union `DialogState`:
  ```ts
  type DialogState =
    | { type: "changeRole"; collaborator: ActiveCollaborator }
    | { type: "removeAccess"; collaborator: ActiveCollaborator }
    | { type: "cancelInvite"; invite: PendingCollaborator }
    | null;
  ```
- Renderiza `ChangeRoleModal` e os dois `AccessActionModal` internamente

### `AddCollaboratorModal` — simplificado

- Props: `open: boolean`, `onClose: () => void`
- Chama `useLoaderData<CollaboratorsLoader>()` para `projectRoles`
- `selectedRoleId` vira estado local (inicializado com o primeiro role disponível)
- Remove props: `roles`, `selectedRoleId`, `onOpenChange`, `onSelectedRoleChange`

### `ChangeRoleModal` — simplificado

- Props: `collaborator: ActiveCollaborator | null`, `onClose: () => void`
- Chama `useLoaderData<CollaboratorsLoader>()` para `projectRoles`
- `selectedRoleId` local, inicializado via `useEffect` quando `collaborator` muda
- Remove props: `roles`, `selectedRoleId`, `onSelectedRoleChange`

### `AccessActionModal` — sem mudança estrutural

Mantém a mesma interface de props. Apenas corrige a violação do CLAUDE.md (ver abaixo).

---

## Correções de convenção (CLAUDE.md)

Os três modais com formulário usam `<input type="hidden" name="_action">`, o que viola a convenção do projeto. O `name`/`value` da action deve ir no botão de submit:

**AddCollaboratorModal:**
```tsx
// antes
<input type="hidden" name="_action" value="createInviteCollaborator" />
<Button type="submit">Enviar convite</Button>

// depois
<Button type="submit" name="_action" value="createInviteCollaborator">Enviar convite</Button>
```

**ChangeRoleModal** e **AccessActionModal**: mesma correção com seus respectivos valores de action.

---

## Fluxo de dados após a refatoração

```
route loader
  └─ useLoaderData() ─── CollaboratorsHeader → [addOpen state] → AddCollaboratorModal
                    └─── CollaboratorsTable  → [DialogState]  → ChangeRoleModal
                                                              → AccessActionModal (removeAccess)
                                                              → AccessActionModal (cancelInvite)
```

Nenhum dado desce do `CollaboratorsPage` para os filhos.

---

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `pages/collaborators/index.tsx` | Remove estados, mapeamento e props; passa a ser thin |
| `pages/collaborators/components/header.tsx` | Adiciona `useLoaderData`, estado local, renderiza `AddCollaboratorModal` |
| `pages/collaborators/components/collaboratorsTable.tsx` | Adiciona `useLoaderData`, mapeamento local, `DialogState`, renderiza modais |
| `pages/collaborators/components/addCollaboratorModal.tsx` | Adiciona `useLoaderData`, estado local; remove 3 props |
| `pages/collaborators/components/changeRoleModal.tsx` | Adiciona `useLoaderData`, estado local; remove 3 props |
| `pages/collaborators/components/accessActionModal.tsx` | Corrige `_action` de hidden input para botão |

## Arquivos não alterados

- `src/main/routes/route.campaign.collaborators.tsx`
- `src/client/types/collaboratorsLoader.ts`
- `src/client/pages/collaborators/components/types.ts`
- `src/client/pages/collaborators/components/inviteSentModal.tsx`
- Toda a camada de infra/app/domain
