# Campaign Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar layout dedicado para gerenciamento de campanhas individuais com sidebar escura, CampaignBanner e página placeholder, acessado via botão "Gerenciar" na tabela de myCampaigns.

**Architecture:** Segue o padrão Clean Architecture do projeto: `getCampaignUseCase` → `getCampaignController` → `getCampaignFactory` → `layout.campaignLayout.tsx` (loader SSR). A entidade `Campaign` recebe um campo opcional `currentRevenue` (já presente no `externalCampaignSchema` como `current_revenue`). O layout visual é composto por `<Sidebar>` fixa à esquerda e coluna direita com `<CampaignBanner>` + `<Outlet />`.

**Tech Stack:** React Router v7 (SSR), React 19, TypeScript, Tailwind CSS v4, tailwind-variants, lucide-react, Zod

---

## File Map

### Modificados
- `src/domain/entities/campaign.ts` — adiciona `currentRevenue?: string | null`
- `src/infra/mappers/campaign.ts` — popula `currentRevenue` em `toEntity()`
- `src/domain/gateways/campaign.ts` — adiciona `getCampaign(id, token)`
- `src/infra/gateways/campaign.ts` — implementa `getCampaign()`
- `src/routes.ts` — adiciona rota `campaign/:campaignId`
- `src/client/pages/myCampaigns/components/table/index.tsx` — "Gerenciar" vira Link

### Criados
- `src/lib/formatCurrency.ts`
- `src/app/useCases/campaign/getCampaignUseCase.ts`
- `src/infra/controllers/campaign/getCampaignController.ts`
- `src/main/factories/campaign/getCampaignFactory.ts`
- `src/main/routes/layout.campaignLayout.tsx`
- `src/client/types/campaignLayoutLoader.ts`
- `src/client/layouts/campaignLayout/index.tsx`
- `src/client/layouts/campaignLayout/components/sidebar/index.tsx`
- `src/client/layouts/campaignLayout/components/campaignBanner/index.tsx`
- `src/main/routes/route.campaign.home.tsx`
- `src/client/pages/campaignHome/index.tsx`

---

### Task 1: Entidade + Mapper + formatCurrency

**Files:**
- Modify: `src/domain/entities/campaign.ts`
- Modify: `src/infra/mappers/campaign.ts`
- Create: `src/lib/formatCurrency.ts`

- [ ] **Step 1: Adicionar `currentRevenue` à entidade**

Em `src/domain/entities/campaign.ts`, adicionar o campo no tipo, na classe e no `toJson()`:

```ts
// No tipo CampaignConstructorProps, após `endDate: string | null;`:
currentRevenue?: string | null;

// Na classe Campaign, após `endDate: string | null;`:
currentRevenue?: string | null;

// No constructor, após `this.endDate = props.endDate;`:
this.currentRevenue = props.currentRevenue;

// No toJson(), após `endDate: this.endDate,`:
currentRevenue: this.currentRevenue ?? null,
```

- [ ] **Step 2: Mapear `current_revenue` no mapper**

Em `src/infra/mappers/campaign.ts`, no objeto passado para `Campaign.restore()`, adicionar após `endDate: externalCampaign.end_date,`:

```ts
currentRevenue: externalCampaign.current_revenue ?? null,
```

- [ ] **Step 3: Criar helper `formatCurrency`**

Criar `src/lib/formatCurrency.ts`:

```ts
export function formatCurrency(value: string | null | undefined): string {
  if (!value) return "R$ 0,00";
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
```

- [ ] **Step 4: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros relacionados a `currentRevenue` ou `campaign.ts`.

- [ ] **Step 5: Commit**

```bash
git add src/domain/entities/campaign.ts src/infra/mappers/campaign.ts src/lib/formatCurrency.ts
git commit -m "feat(campaign): add currentRevenue field and formatCurrency helper"
```

---

### Task 2: Gateway — interface + implementação

**Files:**
- Modify: `src/domain/gateways/campaign.ts`
- Modify: `src/infra/gateways/campaign.ts`

- [ ] **Step 1: Adicionar `getCampaign` à interface**

Substituir o conteúdo de `src/domain/gateways/campaign.ts` por:

```ts
import type { CampaignSearchParams } from "~/app/search/campaignSearchParams";
import { SearchResult } from "~/app/shared/searchResult";
import type { Campaign } from "../entities/campaign";

type CampaignGatewayDTO = {
  listCampaigns: (
    searchParams: CampaignSearchParams,
    token: string,
  ) => Promise<SearchResult<Campaign>>;
  getCampaign: (id: string, token: string) => Promise<Campaign>;
};

export type { CampaignGatewayDTO };
```

- [ ] **Step 2: Implementar `getCampaign` no gateway**

Em `src/infra/gateways/campaign.ts`, dentro da classe `CampaignGateway`, adicionar após o método `listCampaigns()`, antes do bloco de comentários:

```ts
async getCampaign(id: string, token: string): Promise<Campaign> {
  const apiResponse = await api.get(`/project/find-one/${id}`, { token });

  if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

  const schemaValidator = new SchemaValidatorAdapter(externalCampaignSchema);
  const externalCampaign = schemaValidator.validate(apiResponse.response);

  return CampaignMapper.toEntity(externalCampaign);
}
```

- [ ] **Step 3: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros em `campaign.ts` (gateway).

- [ ] **Step 4: Commit**

```bash
git add src/domain/gateways/campaign.ts src/infra/gateways/campaign.ts
git commit -m "feat(campaign): add getCampaign to gateway interface and implementation"
```

---

### Task 3: Use Case

**Files:**
- Create: `src/app/useCases/campaign/getCampaignUseCase.ts`

- [ ] **Step 1: Criar use case**

Criar `src/app/useCases/campaign/getCampaignUseCase.ts`:

```ts
import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  id: string;
  token: string;
};

class GetCampaignUseCase {
  constructor(private campaignGateway: CampaignGatewayDTO) {}

  async execute(input: InputProps) {
    const { id, token } = input;
    const campaign = await this.campaignGateway.getCampaign(id, token);
    return campaign.toJson();
  }
}

export { GetCampaignUseCase };
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros em `getCampaignUseCase.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/app/useCases/campaign/getCampaignUseCase.ts
git commit -m "feat(campaign): add GetCampaignUseCase"
```

---

### Task 4: Controller + Factory

**Files:**
- Create: `src/infra/controllers/campaign/getCampaignController.ts`
- Create: `src/main/factories/campaign/getCampaignFactory.ts`

- [ ] **Step 1: Criar controller**

Criar `src/infra/controllers/campaign/getCampaignController.ts`:

```ts
import type { GetCampaignUseCase } from "~/app/useCases/campaign/getCampaignUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class GetCampaignController {
  constructor(private getCampaignUseCase: GetCampaignUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.getCampaignUseCase.execute({
      id: campaignId,
      token: user.token,
    });
  }
}

export { GetCampaignController };
```

- [ ] **Step 2: Criar factory**

Criar `src/main/factories/campaign/getCampaignFactory.ts`:

```ts
import { GetCampaignUseCase } from "~/app/useCases/campaign/getCampaignUseCase";
import { GetCampaignController } from "~/infra/controllers/campaign/getCampaignController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const getCampaignUseCase = new GetCampaignUseCase(campaignGateway);
const getCampaignController = new GetCampaignController(getCampaignUseCase);

const getCampaign = {
  handle: getCampaignController.handle.bind(getCampaignController),
};

export { getCampaign };
```

- [ ] **Step 3: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros nos dois arquivos novos.

- [ ] **Step 4: Commit**

```bash
git add src/infra/controllers/campaign/getCampaignController.ts src/main/factories/campaign/getCampaignFactory.ts
git commit -m "feat(campaign): add GetCampaignController and getCampaignFactory"
```

---

### Task 5: Layout route + tipo + routes.ts

**Files:**
- Create: `src/main/routes/layout.campaignLayout.tsx`
- Create: `src/client/types/campaignLayoutLoader.ts`
- Modify: `src/routes.ts`

- [ ] **Step 1: Criar layout route**

Criar `src/main/routes/layout.campaignLayout.tsx`:

```tsx
import type { Route } from "+/layout.campaignLayout";
import { redirect } from "react-router";
import { CampaignLayout } from "~/client/layouts/campaignLayout";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getCampaign } from "../factories/campaign/getCampaignFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const campaign = await getCampaign.handle(adaptedRoute);

  return { campaign };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default CampaignLayout;
```

- [ ] **Step 2: Criar tipo do loader**

Criar `src/client/types/campaignLayoutLoader.ts`:

```ts
import type { loader } from "~/main/routes/layout.campaignLayout";

type CampaignLayoutLoader = Awaited<ReturnType<typeof loader>>;

export type { CampaignLayoutLoader };
```

- [ ] **Step 3: Registrar a rota**

Em `src/routes.ts`, adicionar após o bloco `layout("./main/routes/layout.appLayout.tsx", [...])`:

```ts
route("campaign/:campaignId", "./main/routes/layout.campaignLayout.tsx", [
  route("home", "./main/routes/route.campaign.home.tsx"),
]),
```

O import de `route` já está disponível no arquivo.

- [ ] **Step 4: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Esperado: pode haver erros temporários de módulo não encontrado para `CampaignLayout` e `route.campaign.home` — serão resolvidos nas próximas tasks.

- [ ] **Step 5: Commit**

```bash
git add src/main/routes/layout.campaignLayout.tsx src/client/types/campaignLayoutLoader.ts src/routes.ts
git commit -m "feat(campaignLayout): add layout route, loader type and register route"
```

---

### Task 6: Sidebar component

**Files:**
- Create: `src/client/layouts/campaignLayout/components/sidebar/index.tsx`

- [ ] **Step 1: Criar sidebar**

Criar `src/client/layouts/campaignLayout/components/sidebar/index.tsx`:

```tsx
import {
  BarChart,
  BarChart2,
  Calendar,
  FileCheck,
  FileText,
  Heart,
  LayoutDashboard,
  Megaphone,
  Plug,
  Receipt,
  Settings,
  UserCheck,
  Users,
  Users2,
} from "lucide-react";
import { useRoot } from "~/client/hooks/useRoot";
import { cn } from "~/lib/utils";

type NavItem = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    title: "",
    items: [{ icon: LayoutDashboard, label: "Dashboard" }],
  },
  {
    title: "GESTÃO",
    items: [
      { icon: Heart, label: "Doações", active: true },
      { icon: Megaphone, label: "Campanhas" },
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
      { icon: FileText, label: "Recibos" },
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

function NavItemRow({ icon: Icon, label, active }: NavItem) {
  return (
    <div className="flex items-center gap-2 py-px pr-3">
      <div
        className={cn(
          "h-[30px] w-[3px] rounded-br-[4px] rounded-tr-[4px] shrink-0",
          active ? "bg-[#60a5fa]" : "bg-transparent",
        )}
      />
      <div
        className={cn(
          "flex flex-1 items-center gap-2.5 rounded-lg px-3 h-10",
          active ? "bg-white/10" : "bg-transparent",
        )}
      >
        <Icon size={18} className={active ? "text-[#f1f5f9]" : "text-[#94a3b8]"} />
        <span
          className={cn(
            "text-sm whitespace-nowrap",
            active ? "font-semibold text-[#f1f5f9]" : "font-normal text-[#94a3b8]",
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function Sidebar() {
  const { LIGHT_LOGO } = useRoot().environmentVariables;

  return (
    <nav className="flex h-screen w-68 shrink-0 flex-col bg-[#0f172a] pb-4">
      <div className="flex h-18 items-center px-5">
        <div className="rounded-md px-2 py-1">
          <img src={LIGHT_LOGO} alt="Logo" className="h-7 w-auto" />
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.title || "root"} className="flex flex-col pt-5">
          {section.title && (
            <p className="mb-1 pl-5 text-[10px] font-bold uppercase tracking-widest text-[rgba(148,163,184,0.6)]">
              {section.title}
            </p>
          )}
          {section.items.map((item) => (
            <NavItemRow key={item.label} {...item} />
          ))}
        </div>
      ))}
    </nav>
  );
}

export { Sidebar };
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros em `sidebar/index.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/client/layouts/campaignLayout/components/sidebar/index.tsx
git commit -m "feat(campaignLayout): add Sidebar component"
```

---

### Task 7: CampaignBanner component

**Files:**
- Create: `src/client/layouts/campaignLayout/components/campaignBanner/index.tsx`

- [ ] **Step 1: Criar CampaignBanner**

Criar `src/client/layouts/campaignLayout/components/campaignBanner/index.tsx`:

```tsx
import { ArrowLeft, Eye } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import type { CampaignLayoutLoader } from "~/client/types/campaignLayoutLoader";
import { formatCurrency } from "~/lib/formatCurrency";

function CampaignBanner() {
  const { campaign } = useLoaderData<CampaignLayoutLoader>();

  return (
    <header className="flex h-[57px] shrink-0 items-center justify-between border-b border-(--border) bg-(--card) px-7">
      <div className="flex flex-col gap-0.5">
        <p className="text-xl font-semibold text-(--text-heading) leading-6">
          {campaign.name}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <Badge variant={campaign.status ? "success" : "danger"}>
            {campaign.status ? "Ativo" : "Inativo"}
          </Badge>
          <span className="text-[#cbd5e1]">•</span>
          <span className="text-(--text-muted)">
            {"Arrecadado: "}
            <span className="font-semibold text-[rgb(var(--spotlight-primary))]">
              {formatCurrency(campaign.currentRevenue)}
            </span>
            {` de ${formatCurrency(campaign.totalGoal)}`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" className="h-10 min-h-0 w-auto gap-1.5 rounded-md px-3.5 text-sm text-[rgb(var(--spotlight-primary))]" asChild>
          <Link to="/my-campaigns">
            <ArrowLeft size={15} />
            Voltar para campanhas
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-10 rounded-lg text-[rgb(var(--spotlight-primary))]"
        >
          <Eye size={16} />
        </Button>
      </div>
    </header>
  );
}

export { CampaignBanner };
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros em `campaignBanner/index.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/client/layouts/campaignLayout/components/campaignBanner/index.tsx
git commit -m "feat(campaignLayout): add CampaignBanner component"
```

---

### Task 8: CampaignLayout — estrutura visual

**Files:**
- Create: `src/client/layouts/campaignLayout/index.tsx`

- [ ] **Step 1: Criar layout visual**

Criar `src/client/layouts/campaignLayout/index.tsx`:

```tsx
import { Outlet } from "react-router";
import { CampaignBanner } from "./components/campaignBanner";
import { Sidebar } from "./components/sidebar";

function CampaignLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <CampaignBanner />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { CampaignLayout };
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros. Se ainda houver erros de `route.campaign.home` (módulo não existente), serão resolvidos na próxima task.

- [ ] **Step 3: Commit**

```bash
git add src/client/layouts/campaignLayout/index.tsx
git commit -m "feat(campaignLayout): add CampaignLayout visual structure"
```

---

### Task 9: Página placeholder + rota filha

**Files:**
- Create: `src/client/pages/campaignHome/index.tsx`
- Create: `src/main/routes/route.campaign.home.tsx`

- [ ] **Step 1: Criar página placeholder**

Criar `src/client/pages/campaignHome/index.tsx`:

```tsx
function CampaignHomePage() {
  return <div />;
}

export { CampaignHomePage };
```

- [ ] **Step 2: Criar rota filha**

Criar `src/main/routes/route.campaign.home.tsx`:

```tsx
import { CampaignHomePage } from "~/client/pages/campaignHome";

export default function CampaignHomeRoute() {
  return <CampaignHomePage />;
}
```

- [ ] **Step 3: Verificar tipos — build completo**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -40
```

Esperado: 0 erros.

- [ ] **Step 4: Commit**

```bash
git add src/client/pages/campaignHome/index.tsx src/main/routes/route.campaign.home.tsx
git commit -m "feat(campaignLayout): add CampaignHomePage placeholder and child route"
```

---

### Task 10: Botão "Gerenciar" → Link

**Files:**
- Modify: `src/client/pages/myCampaigns/components/table/index.tsx`

- [ ] **Step 1: Substituir botão por Link**

Em `src/client/pages/myCampaigns/components/table/index.tsx`:

1. Adicionar import do `Link` no topo:

```tsx
import { Link, useLoaderData } from "react-router";
```

2. Substituir o `<Button variant="outline" ...>Gerenciar</Button>` por:

```tsx
<Button
  variant="outline"
  className="h-8 min-h-0 w-auto rounded-md px-4 py-0 text-xs text-[rgb(var(--spotlight-primary))]"
  asChild
>
  <Link to={`/campaign/${campaign.id}/home`}>Gerenciar</Link>
</Button>
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /var/www/testes/donation-react-router-v7 && npx tsc --noEmit 2>&1 | head -30
```

Esperado: 0 erros.

- [ ] **Step 3: Commit**

```bash
git add src/client/pages/myCampaigns/components/table/index.tsx
git commit -m "feat(myCampaigns): navigate to campaign layout on Gerenciar click"
```

---

## Verificação final

Após todas as tasks, rodar o servidor de desenvolvimento e verificar:

```bash
cd /var/www/testes/donation-react-router-v7 && npm run dev
```

1. Navegar para `/my-campaigns`
2. Clicar em "Gerenciar" em qualquer linha da tabela
3. Confirmar redirecionamento para `/campaign/:id/home`
4. Verificar que sidebar aparece à esquerda com logo e itens de navegação
5. Verificar que CampaignBanner mostra nome, status badge e valores formatados
6. Verificar que "Voltar para campanhas" retorna para `/my-campaigns`
