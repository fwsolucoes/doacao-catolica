# Sidebar shadcn/ui Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a sidebar manual do `campaignLayout` pelos primitivos do shadcn/ui Sidebar com `collapsible="icon"`, `SidebarFooter` com perfil do usuário e integração via `SidebarProvider` + `SidebarInset` no layout.

**Architecture:** O `npx shadcn add sidebar` instala `sidebar.tsx` + dependências (tooltip, sheet, separator, skeleton, use-mobile). Após a instalação, o arquivo é adaptado às convenções do projeto (cva→tv, named exports, sem "use client"). O `CampaignLayout` passa a usar `SidebarProvider` + `SidebarInset`, eliminando o `ml-68 mt-14` hardcoded. A `CampaignBanner` vira `sticky top-0` para fluir dentro do inset.

**Tech Stack:** React Router v7, shadcn/ui Sidebar, tailwind-variants, Lucide React, Tailwind CSS v4

---

## Arquivos alterados

| Arquivo | Ação |
|---|---|
| `src/client/components/ui/sidebar.tsx` | Criar (shadcn) + adaptar |
| `src/client/components/ui/tooltip.tsx` | Criar (shadcn, dependência) |
| `src/client/components/ui/separator.tsx` | Criar (shadcn, dependência) |
| `src/client/components/ui/sheet.tsx` | Criar (shadcn, dependência) |
| `src/client/components/ui/skeleton.tsx` | Criar (shadcn, dependência) |
| `src/client/hooks/use-mobile.ts` | Criar (shadcn, dependência) |
| `src/client/themes/tailwind.css` | Adicionar vars de largura da sidebar |
| `src/client/layouts/campaignLayout/index.tsx` | Modificar |
| `src/client/layouts/campaignLayout/components/sidebar/index.tsx` | Reescrever |
| `src/client/layouts/campaignLayout/components/campaignBanner/index.tsx` | Modificar |

---

## Task 1: Instalar shadcn sidebar e proteger arquivos customizados

**Files:**
- Create: `src/client/components/ui/sidebar.tsx` (e dependências)
- Protect: `src/client/components/ui/button.tsx`
- Protect: `src/client/components/ui/input.tsx`

- [ ] **Step 1: Registrar estado atual de button.tsx e input.tsx**

```bash
git stash list
# Garante que não há stash pendente antes de continuar
```

- [ ] **Step 2: Executar instalação do shadcn sidebar**

```bash
npx shadcn@latest add sidebar
```

Responder `y` para todas as perguntas de confirmação. O comando vai:
- Criar `sidebar.tsx`, `tooltip.tsx`, `separator.tsx`, `sheet.tsx`, `skeleton.tsx`
- Criar `src/client/hooks/use-mobile.ts`
- **Sobrescrever** `button.tsx` e `input.tsx` (problema — será revertido)
- Adicionar CSS vars ao `tailwind.css`

- [ ] **Step 3: Restaurar button.tsx e input.tsx customizados**

```bash
git checkout -- src/client/components/ui/button.tsx src/client/components/ui/input.tsx
```

- [ ] **Step 4: Verificar que a build continua funcionando**

```bash
npm run build 2>&1 | tail -20
```

Esperado: build sem erros (pode ter warnings sobre tipos).

---

## Task 2: Ajustar CSS vars de largura no tailwind.css

O shadcn sidebar precisa de três CSS vars de layout que podem ter sido adicionadas com valores padrão incorretos pelo installer. Verifique e ajuste.

**Files:**
- Modify: `src/client/themes/tailwind.css`

- [ ] **Step 1: Verificar o que o installer adicionou**

```bash
grep "sidebar-width\|sidebar-width-mobile\|sidebar-width-icon" src/client/themes/tailwind.css
```

- [ ] **Step 2: Garantir que os valores corretos estão definidos em `:root`**

Localizar o bloco `--sidebar:` em `:root` e confirmar que as vars abaixo existem logo depois:

```css
/* em :root, junto às outras vars --sidebar-* */
--sidebar-width: 17rem;         /* 272px — match do Figma */
--sidebar-width-mobile: 18rem;
--sidebar-width-icon: 3rem;     /* largura colapsado */
```

Se o installer as adicionou com valores diferentes, editar para os valores acima. Se não as adicionou, inserir manualmente após `--sidebar-ring`.

- [ ] **Step 3: Confirmar que `.dark` também tem as vars (se o installer as colocou lá)**

Se o installer duplicou as vars no `.dark`, remover — as vars de largura não precisam de override por tema.

- [ ] **Step 4: Verificar build**

```bash
npm run build 2>&1 | tail -10
```

---

## Task 3: Adaptar sidebar.tsx às convenções do projeto

O arquivo gerado pelo shadcn usa `cva` de `class-variance-authority`. O projeto usa `tv` de `tailwind-variants`. Há apenas uma ocorrência de `cva` na sidebar: `sidebarMenuButtonVariants`.

**Files:**
- Modify: `src/client/components/ui/sidebar.tsx`

- [ ] **Step 1: Remover "use client" do topo do arquivo**

Localizar e remover a linha:
```ts
"use client"
```

- [ ] **Step 2: Substituir o import de cva**

Localizar:
```ts
import { cva, type VariantProps } from "class-variance-authority"
```

Substituir por:
```ts
import { tv, type VariantProps } from "tailwind-variants"
```

- [ ] **Step 3: Converter sidebarMenuButtonVariants de cva para tv**

Localizar o bloco `const sidebarMenuButtonVariants = cva(...)`. Ele tem este formato:

```ts
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 ...",
  {
    variants: {
      variant: { default: "...", outline: "..." },
      size: { default: "...", sm: "...", lg: "..." },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
```

Substituir pela sintaxe `tv` — a única diferença é que a string de classes base vai para a chave `base:`:

```ts
const sidebarMenuButtonVariants = tv({
  base: "peer/menu-button flex w-full items-center gap-2 ...",
  variants: {
    variant: { default: "...", outline: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
})
```

Manter exatamente as mesmas strings de classes — só mudar a estrutura do objeto.

- [ ] **Step 4: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep sidebar | head -20
```

Esperado: sem erros em `sidebar.tsx`.

- [ ] **Step 5: Commit**

```bash
git add src/client/components/ui/ src/client/hooks/use-mobile.ts src/client/themes/tailwind.css
git commit -m "feat(ui): add shadcn sidebar component and dependencies

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Atualizar CampaignLayout com SidebarProvider + SidebarInset

**Files:**
- Modify: `src/client/layouts/campaignLayout/index.tsx`

- [ ] **Step 1: Reescrever o arquivo**

```tsx
import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "~/client/components/ui/sidebar";
import { CampaignBanner } from "./components/campaignBanner";
import { AppSidebar } from "./components/sidebar";

function CampaignLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <CampaignBanner />
        <main className="p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { CampaignLayout };
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep campaignLayout | head -10
```

---

## Task 5: Reescrever o componente Sidebar (AppSidebar)

**Files:**
- Modify: `src/client/layouts/campaignLayout/components/sidebar/index.tsx`

- [ ] **Step 1: Reescrever o arquivo completo**

```tsx
import { ChevronsUpDown } from "lucide-react";
import {
  BarChart,
  BarChart2,
  Bell,
  Calendar,
  FileCheck,
  FileText,
  Heart,
  LayoutDashboard,
  Megaphone,
  Plug,
  Receipt,
  ScrollText,
  Settings,
  UserCheck,
  Users,
  Users2,
} from "lucide-react";
import { NavLink, useMatch, useParams } from "react-router";
import { useRoot } from "~/client/hooks/useRoot";
import { cn } from "~/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "~/client/components/ui/sidebar";

type NavItem = {
  icon: React.ElementType;
  label: string;
  path?: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    title: "",
    items: [{ icon: LayoutDashboard, label: "Dashboard", path: "home" }],
  },
  {
    title: "GESTÃO",
    items: [
      { icon: Heart, label: "Doações" },
      { icon: Megaphone, label: "Campanhas" },
      { icon: Bell, label: "Notificações enviadas", path: "notifications" },
      { icon: UserCheck, label: "Doadores" },
      { icon: Calendar, label: "Eventos" },
      { icon: Users, label: "Voluntários" },
    ],
  },
  {
    title: "FINANCEIRO",
    items: [
      { icon: Receipt, label: "Repasses" },
      { icon: FileText, label: "Despesas" },
      { icon: FileCheck, label: "Prestação de contas" },
    ],
  },
  {
    title: "RELATÓRIOS",
    items: [
      { icon: BarChart, label: "Relatório mensal" },
      { icon: BarChart2, label: "Relatório anual" },
      { icon: ScrollText, label: "Recibos" },
    ],
  },
  {
    title: "CONFIGURAÇÕES",
    items: [
      { icon: Settings, label: "Geral" },
      { icon: Users2, label: "Equipe" },
      { icon: Plug, label: "Integrações" },
    ],
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function NavItemRow({
  icon: Icon,
  label,
  path,
  basePath,
}: NavItem & { basePath: string }) {
  const to = path ? `${basePath}/${path}` : null;
  // useMatch precisa de string estática — usa placeholder que nunca casa quando não há rota
  const match = useMatch(to ?? "/__no_route__");
  const isActive = !!match && !!to;

  return (
    <SidebarMenuItem className="relative">
      <div
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 h-7.5 w-1 rounded-r shrink-0",
          isActive ? "bg-sidebar-primary" : "bg-transparent",
        )}
      />
      {to ? (
        <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
          <NavLink to={to} end>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton tooltip={label} className="cursor-default opacity-60">
          <Icon size={18} />
          <span>{label}</span>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}

function UserProfile() {
  const { user } = useRoot();
  const initials = getInitials(user.name);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="cursor-default">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-[0.7rem] font-extrabold text-sidebar">
            {initials}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-sidebar-foreground">
              {user.name}
            </span>
            <span className="truncate text-xs text-sidebar-foreground/60">
              {user.email}
            </span>
          </div>
          <ChevronsUpDown
            size={14}
            className="ml-auto shrink-0 text-sidebar-foreground/40"
          />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function AppSidebar() {
  const { LIGHT_LOGO } = useRoot().environmentVariables;
  const { campaignId } = useParams<{ campaignId: string }>();
  const basePath = `/campaign/${campaignId}`;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between px-4 py-4">
        <img
          src={LIGHT_LOGO}
          alt="Logo"
          className="h-8 w-auto shrink-0 group-data-[collapsible=icon]:hidden"
        />
        <SidebarTrigger className="text-sidebar-foreground/60 hover:bg-transparent hover:text-sidebar-foreground" />
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.title || "__root__"}>
            {section.title ? (
              <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/60">
                {section.title}
              </SidebarGroupLabel>
            ) : null}
            <SidebarMenu>
              {section.items.map((item) => (
                <NavItemRow key={item.label} {...item} basePath={basePath} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/30 pb-3">
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}

export { AppSidebar };
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "sidebar/index" | head -10
```

Esperado: sem erros.

---

## Task 6: Atualizar CampaignBanner para sticky

Remove o posicionamento `fixed` dependente da largura da sidebar. O banner passa a fluir dentro do `SidebarInset`.

**Files:**
- Modify: `src/client/layouts/campaignLayout/components/campaignBanner/index.tsx`

- [ ] **Step 1: Trocar a classe de posicionamento no `<header>`**

Localizar:
```tsx
<header className="fixed left-68 right-0 top-0 flex h-14 items-center justify-between border-b border-(--border) bg-(--card) px-7 z-30">
```

Substituir por:
```tsx
<header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-(--border) bg-(--card) px-7">
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep campaignBanner | head -5
```

---

## Task 7: Verificar resultado no browser e commit final

- [ ] **Step 1: Iniciar o servidor de desenvolvimento**

```bash
npm run dev
```

Abrir `http://localhost:5173` (ou a porta exibida no terminal).

- [ ] **Step 2: Checklist visual**

Navegar para uma rota de campanha (ex: `/campaign/1/notifications`) e verificar:

- [ ] Sidebar aparece com fundo navy escuro (`#0a1929`)
- [ ] Item ativo tem barra azul à esquerda e fundo branco/10
- [ ] Botão de colapso (ícone `≡` ou `←`) aparece no header da sidebar
- [ ] Clicar no botão colapsa a sidebar para largura de ícones (3rem)
- [ ] No modo colapsado, tooltip com o label do item aparece no hover
- [ ] Logo some quando colapsado (`group-data-[collapsible=icon]:hidden`)
- [ ] `CampaignBanner` continua visível e alinhado corretamente
- [ ] `SidebarFooter` mostra avatar com iniciais, nome e email do usuário
- [ ] Layout não tem deslocamento horizontal indesejado

- [ ] **Step 3: Commit**

```bash
git add \
  src/client/layouts/campaignLayout/index.tsx \
  src/client/layouts/campaignLayout/components/sidebar/index.tsx \
  src/client/layouts/campaignLayout/components/campaignBanner/index.tsx
git commit -m "feat(sidebar): migrate to shadcn Sidebar with collapsible icon mode

- SidebarProvider + SidebarInset replace manual ml-68/mt-14 layout
- collapsible='icon' with tooltip on hover when collapsed
- SidebarFooter with user profile (name, email, initials avatar)
- Active indicator bar (4px, sidebar-primary) via absolute div
- CampaignBanner changed from fixed to sticky

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```
