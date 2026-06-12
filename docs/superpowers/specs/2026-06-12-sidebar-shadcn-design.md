# Sidebar shadcn/ui — Design Spec

**Data:** 2026-06-12  
**Escopo:** Refatorar `campaignLayout/components/sidebar` para usar os primitivos do shadcn/ui Sidebar, com comportamento `collapsible="icon"` e `SidebarFooter` com perfil do usuário.

---

## Contexto

A sidebar atual é implementada manualmente com `position: fixed`, `w-68`, e `ml-68` hardcoded no layout. Não tem comportamento de colapso. A migração para os primitivos shadcn elimina o posicionamento manual e entrega o colapso/expansão gratuitamente via `SidebarProvider`.

---

## Arquivos alterados

| Arquivo | Tipo de mudança |
|---|---|
| `src/client/components/ui/sidebar.tsx` | Novo — gerado por shadcn, adaptado às convenções |
| `src/client/layouts/campaignLayout/index.tsx` | Envolve em `SidebarProvider` + `SidebarInset` |
| `src/client/layouts/campaignLayout/components/sidebar/index.tsx` | Reescrito com primitivos shadcn |
| `src/client/layouts/campaignLayout/components/campaignBanner/index.tsx` | `fixed left-68` → `sticky top-0` |

---

## 1. `ui/sidebar.tsx`

Gerado via `npx shadcn@latest add sidebar`, depois adaptado:

- Substituir `cva()` de `class-variance-authority` por `tv()` de `tailwind-variants`
- Remover diretiva `"use client"` (projeto usa React Router v7, não Next.js)
- Converter `export default` em named exports
- Manter tokens semânticos (`bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-accent`, etc.) — já são usados nativamente pelo shadcn sidebar e estão definidos em `tailwind.css`

---

## 2. `campaignLayout/index.tsx`

```tsx
// antes
<div>
  <Sidebar />
  <CampaignBanner />
  <main className="ml-68 mt-14 p-6"><Outlet /></main>
</div>

// depois
<SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    <CampaignBanner />
    <main className="p-6"><Outlet /></main>
  </SidebarInset>
</SidebarProvider>
```

O `SidebarProvider` controla `--sidebar-width` e aplica automaticamente o offset ao `SidebarInset` via CSS var, eliminando `ml-68` hardcoded.

---

## 3. `sidebar/index.tsx` — Estrutura

```
<Sidebar collapsible="icon">
  <SidebarHeader>
    <img src={LIGHT_LOGO} />
    <SidebarTrigger />
  </SidebarHeader>

  <SidebarContent>
    {sections.map(section =>
      <SidebarGroup>
        <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
        <SidebarMenu>
          {section.items.map(item =>
            <SidebarMenuItem>
              {/* barra esquerda azul de 4px — controlada pelo isActive */}
              <ActiveBar active={isActive} />
              <SidebarMenuButton asChild tooltip={item.label}>
                <NavLink to={path}><Icon /><span>{label}</span></NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>
    )}
  </SidebarContent>

  <SidebarFooter>
    <UserProfile />
  </SidebarFooter>
</Sidebar>
```

### Active indicator (barra esquerda azul)

A barra de 4 px visível no Figma (cor `bg-sidebar-primary`) não é nativa do shadcn. Implementada como `div` absoluto no lado esquerdo do `SidebarMenuItem`:

```tsx
// dentro do NavItemRow, usando NavLink's isActive
<SidebarMenuItem className="relative">
  <div className={cn(
    "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7.5 rounded-r",
    active ? "bg-sidebar-primary" : "bg-transparent"
  )} />
  <SidebarMenuButton ...>
```

### Comportamento colapsado

- Texto dos items e labels de seção somem (controlado pelo shadcn via `group-data-[collapsible=icon]`)
- Cada `SidebarMenuButton` recebe `tooltip={item.label}` — tooltip aparece automaticamente no hover quando colapsado
- Logo reduz para só o ícone (ou some) — controlado por `group-data-[state=collapsed]`

### Items sem rota

Items que ainda não têm `path` definido renderizam como `<button>` estático (não `NavLink`), sem estado ativo. Comportamento idêntico ao atual.

---

## 4. `UserProfile` (SidebarFooter)

```tsx
function UserProfile() {
  const { user } = useRoot(); // user.name e user.email já disponíveis via root loader
  const initials = getInitials(user.name); // ex: "MS"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="cursor-default">
          <div className="avatar bg-sidebar-primary text-sidebar rounded-full ...">
            {initials}
          </div>
          {/* esconde no modo colapsado via group-data-[collapsible=icon] */}
          <div className="grid flex-1 group-data-[collapsible=icon]:hidden">
            <span className="font-semibold truncate">{user.name}</span>
            <span className="text-xs text-sidebar-foreground/60 truncate">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
```

Dados vêm de `useRoot().user` (`user.name`, `user.email`) — já disponíveis via root loader.

---

## 5. `CampaignBanner`

Única mudança: remover `fixed left-68 right-0 top-0` e substituir por `sticky top-0 z-30 w-full`. O banner passa a fluir dentro do `SidebarInset` e não precisa mais conhecer a largura da sidebar.

---

## Fora de escopo

- Dropdown no UserProfile (ex: logout, configurações)
- Persistência do estado colapsado no localStorage (pode ser adicionado depois via `defaultOpen` no `SidebarProvider`)
- Outras layouts além de `campaignLayout`
