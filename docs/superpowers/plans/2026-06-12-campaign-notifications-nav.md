# Campaign Notifications Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar item "Notificações enviadas" ao menu do CampaignLayout com navegação funcional e uma página placeholder.

**Architecture:** A sidebar ganha suporte a `NavLink` do react-router usando um campo `path` opcional em `NavItem`. O `campaignId` é obtido via `useParams`. Uma nova página placeholder e uma nova rota são criadas seguindo o padrão existente.

**Tech Stack:** React Router v7, React 19, Tailwind CSS v4, Lucide React

---

## File Map

| Ação   | Arquivo                                                          | Responsabilidade                                         |
| ------ | ---------------------------------------------------------------- | -------------------------------------------------------- |
| Create | `src/client/pages/campaignNotifications/index.tsx`               | Página placeholder de notificações                       |
| Create | `src/main/routes/route.campaign.notifications.tsx`               | Thin adapter da rota                                     |
| Modify | `src/routes.ts`                                                  | Registrar nova rota sob campaignLayout                   |
| Modify | `src/client/layouts/campaignLayout/components/sidebar/index.tsx` | Adicionar `path` a `NavItem`, NavLink, novo item de menu |

---

### Task 1: Página placeholder

**Files:**

- Create: `src/client/pages/campaignNotifications/index.tsx`

- [ ] **Step 1: Criar a página**

```tsx
function CampaignNotificationsPage() {
  return <div />;
}

export { CampaignNotificationsPage };
```

- [ ] **Step 2: Commit**

```bash
git add src/client/pages/campaignNotifications/index.tsx
git commit -m "feat(campaignNotifications): add blank page placeholder"
```

---

### Task 2: Route adapter

**Files:**

- Create: `src/main/routes/route.campaign.notifications.tsx`

- [ ] **Step 1: Criar o arquivo de rota**

```tsx
import { CampaignNotificationsPage } from "~/client/pages/campaignNotifications";

export default function CampaignNotificationsRoute() {
  return <CampaignNotificationsPage />;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/main/routes/route.campaign.notifications.tsx
git commit -m "feat(campaignNotifications): add route adapter"
```

---

### Task 3: Registrar rota em routes.ts

**Files:**

- Modify: `src/routes.ts`

O bloco do `campaignLayout` atualmente é:

```ts
route("campaign/:campaignId", "./main/routes/layout.campaignLayout.tsx", [
  route("home", "./main/routes/route.campaign.home.tsx"),
]),
```

- [ ] **Step 1: Adicionar a nova rota filha**

```ts
route("campaign/:campaignId", "./main/routes/layout.campaignLayout.tsx", [
  route("home", "./main/routes/route.campaign.home.tsx"),
  route("notifications", "./main/routes/route.campaign.notifications.tsx"),
]),
```

- [ ] **Step 2: Verificar que o servidor de dev não apresenta erros de rota**

```bash
npm run dev
```

Expected: sem erros no console, `/campaign/any-id/notifications` carrega sem 404.

- [ ] **Step 3: Commit**

```bash
git add src/routes.ts
git commit -m "feat(campaignNotifications): register /campaign/:campaignId/notifications route"
```

---

### Task 4: Sidebar com NavLink e novo item

**Files:**

- Modify: `src/client/layouts/campaignLayout/components/sidebar/index.tsx`

- [ ] **Step 1: Atualizar o sidebar completo**

Substituir todo o conteúdo do arquivo por:

```tsx
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
import { NavLink, useParams } from "react-router";
import { useRoot } from "~/client/hooks/useRoot";
import { cn } from "~/lib/utils";

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

function NavItemRow({
  icon: Icon,
  label,
  path,
  basePath,
}: NavItem & { basePath: string }) {
  const inner = (active: boolean) => (
    <div className="flex items-center gap-2 py-px pr-3">
      <div
        className={cn(
          "h-7.5 w-0.75 rounded-br rounded-tr shrink-0",
          active ? "bg-[#60a5fa]" : "bg-transparent",
        )}
      />
      <div
        className={cn(
          "flex flex-1 items-center gap-2.5 rounded-lg px-3 h-10",
          active ? "bg-white/10" : "",
        )}
      >
        <Icon
          size={18}
          className={active ? "text-[#f1f5f9]" : "text-[#94a3b8]"}
        />
        <span
          className={cn(
            "text-sm whitespace-nowrap",
            active
              ? "font-semibold text-[#f1f5f9]"
              : "font-normal text-[#94a3b8]",
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );

  if (path) {
    return (
      <NavLink to={`${basePath}/${path}`} end>
        {({ isActive }) => inner(isActive)}
      </NavLink>
    );
  }

  return inner(false);
}

function Sidebar() {
  const { LIGHT_LOGO } = useRoot().environmentVariables;
  const { campaignId } = useParams<{ campaignId: string }>();
  const basePath = `/campaign/${campaignId}`;

  return (
    <nav className="fixed left-0 top-0 flex h-screen w-68 flex-col bg-[#0f172a] pb-4 z-40">
      <div className="flex h-16 shrink-0 items-center px-5">
        <img src={LIGHT_LOGO} alt="Sancton" className="h-8 w-auto shrink-0" />
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pt-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
        {sections.map((section) => (
          <div
            key={section.title || "__root__"}
            className="flex flex-col gap-1"
          >
            {section.title ? (
              <span className="px-5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]/60">
                {section.title}
              </span>
            ) : null}
            {section.items.map((item) => (
              <NavItemRow key={item.label} {...item} basePath={basePath} />
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}

export { Sidebar };
```

- [ ] **Step 2: Verificar visualmente no browser**

Acessar `/campaign/<algum-id>/home` e `/campaign/<algum-id>/notifications` — o item ativo deve ficar destacado, clicar nos itens com `path` deve navegar.

- [ ] **Step 3: Commit**

```bash
git add src/client/layouts/campaignLayout/components/sidebar/index.tsx
git commit -m "feat(sidebar): add NavLink navigation and Notificações enviadas item"
```
