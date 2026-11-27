# Ocultar dados financeiros do perfil "Gestor de relacionamento com doadores" — Plano 1 (mecanismo + Dashboard)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Conectar o mecanismo de permissões já existente (`isPermissionGranted`) a um componente `<Can>` reutilizável e usá-lo para ocultar, por renderização condicional, todos os elementos financeiros do `CampaignBanner`, da sidebar e da tela Dashboard, sem bloquear o acesso a nenhuma das telas.

**Architecture:** A infraestrutura de permissões já existe e funciona (`useCampaignLayout().isPermissionGranted(permission)`, alimentada pelo loader de `layout.campaignLayout.tsx` a partir da API), mas nenhum componente a consome hoje. Este plano cria um componente `<Can permission="...">` fino sobre esse hook e o aplica em cada elemento financeiro do Dashboard (cards inteiros quando 100% financeiros, colunas de tabela quando o card mistura dado financeiro com não financeiro), além do banner (compartilhado por todas as telas) e dos itens de menu cujo conteúdo é 100% financeiro.

**Mapeamento de permissão usado neste plano** (chaves já existentes em `PROJECT_ALL_PERMISSIONS`, sem necessidade de mudança de schema/API):
- `VIEW_FINANCIAL_METRICS` — valores arrecadados, metas, ticket médio, gráficos de arrecadação (banner, Dashboard).
- `VIEW_FINANCIAL_TRANSFERS` — Transferências (não coberto neste plano, fica para o Plano 2).
- `VIEW_FINANCIAL_STATEMENTS` — Métricas Shalom (não coberto neste plano, fica para o Plano 2 — aqui só ocultamos o item do menu).

**Tech Stack:** React Router v7 (SSR), React 19, Tailwind v4, hook `useCampaignLayout` existente.

**Spec:** Relatório de auditoria entregue nesta conversa (seção "5. Entrega" do relatório de permissões financeiras, 2026-11-26) — sem arquivo próprio, o spec é o texto da auditoria já revisado com o usuário.

## Global Constraints

- Ocultação sempre por renderização condicional (early return / não montar o elemento) — nunca `className="hidden"`, `opacity-0` ou CSS equivalente.
- Nenhuma tela deixa de ser acessível — só o conteúdo financeiro específico é ocultado.
- Sem `useState` para isso — `isPermissionGranted` é lido direto do loader via contexto, não precisa de estado local.
- Named exports sempre, nunca `export default` em componentes novos.
- Este projeto não tem suite de testes automatizados para o front-end (verificado: sem vitest/jest configurado, sem arquivos `*.test.*`) e o usuário não usa Playwright para testar UI — a verificação de cada task é manual, rodando `npm run dev` e inspecionando no browser, alternando a permissão simulada via o bypass de `NODE_ENV=development` em `src/infra/gateways/campaign.ts:277-281`.

## Review Focus

- Usuário sem `VIEW_FINANCIAL_METRICS` acessando a URL do Dashboard direto (sem passar pelo menu) — o conteúdo financeiro deve continuar oculto, já que a ocultação é por componente, não por rota.
- Grids do Dashboard com todos os cards de uma linha ocultos (ex.: `DonationEvolutionCard` + `CampaignGoalCard` ambos escondidos) — o layout não pode quebrar nem deixar uma faixa com borda/fundo vazio aparente.
- Tabelas com coluna financeira removida (`RecentDonationsCard`, `TopDonorsCard`) — cabeçalho e células devem casar em quantidade em toda linha, inclusive no estado vazio (`Table.Empty`).
- Usuário com permissão total (owner/superuser, que no loader recebe `[...PROJECT_ALL_PERMISSIONS]`) — nada deve mudar visualmente para ele.
- `CampaignBanner` sem meta/arrecadado configurado (`goal === null`) combinado com permissão negada — o early-return do `<Can>` não deve deixar um separador "•" órfão sem o texto ao lado.

---

### Task 1: Componente `<Can>`

**Files:**
- Create: `src/client/components/can/index.tsx`

**Interfaces:**
- Consumes: `useCampaignLayout` de `~/client/hooks/useCampaignLayout` (já existe, `isPermissionGranted(permission: PermissionType) => boolean`).
- Produces: `Can` — componente `{ permission: PermissionType; children: ReactNode; fallback?: ReactNode }`. Todas as tasks seguintes importam de `~/client/components/can`.

- [ ] **Step 1: Criar o componente**

```tsx
// src/client/components/can/index.tsx
import type { ReactNode } from "react";
import { useCampaignLayout } from "~/client/hooks/useCampaignLayout";
import { PROJECT_ALL_PERMISSIONS } from "~/app/template/PROJECT_ALL_PERMISSIONS";

type PermissionType = (typeof PROJECT_ALL_PERMISSIONS)[number];

type CanProps = {
  permission: PermissionType;
  children: ReactNode;
  fallback?: ReactNode;
};

function Can({ permission, children, fallback = null }: CanProps) {
  const { isPermissionGranted } = useCampaignLayout();
  return isPermissionGranted(permission) ? <>{children}</> : <>{fallback}</>;
}

export { Can };
```

- [ ] **Step 2: Rodar o typecheck do projeto**

Run: `npm run typecheck` (ou o script equivalente declarado em `package.json`; conferir com `cat package.json | grep -A10 '"scripts"'` se o nome for diferente)
Expected: sem erros novos relacionados a `src/client/components/can/index.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/client/components/can/index.tsx
git commit -m "feat(permissions): add Can component for conditional financial content"
```

---

### Task 2: Ocultar valor arrecadado no `CampaignBanner`

**Files:**
- Modify: `src/client/layouts/campaignLayout/components/campaignBanner/index.tsx:35-57`

**Interfaces:**
- Consumes: `Can` de `~/client/components/can` (Task 1).

- [ ] **Step 1: Envolver o bloco "Arrecadado" com `<Can>`**

Substituir o trecho atual (linhas 35-57):

```tsx
        <div className="flex min-w-0 items-center gap-2.5 text-base">
          <span
            className={`shrink-0 font-semibold text-base ${campaign.status ? "text-[#1f7a4d]" : "text-destructive"}`}
          >
            {campaign.status ? "Ativa" : "Inativa"}
          </span>
          <span className="shrink-0 text-(--text-muted)/50">•</span>
          <span className="truncate text-(--text-muted)">
            {"Arrecadado: "}
            <span className="font-semibold text-foreground">
              {bannerTotalReceived ?? formatCurrency(String(overview.totalRaised))}
            </span>
            {(() => {
              const isMonthly = campaign.typeDonation === "BOTH" || campaign.typeDonation === "MONTHLY";
              if (isMonthly) {
                return overview.monthlyGoal
                  ? ` de ${formatCurrency(String(overview.monthlyGoal))}`
                  : " · Meta mensal não definida";
              }
              return campaign.totalGoal ? ` de ${formatCurrency(String(campaign.totalGoal))}` : null;
            })()}
          </span>
        </div>
```

por:

```tsx
        <div className="flex min-w-0 items-center gap-2.5 text-base">
          <span
            className={`shrink-0 font-semibold text-base ${campaign.status ? "text-[#1f7a4d]" : "text-destructive"}`}
          >
            {campaign.status ? "Ativa" : "Inativa"}
          </span>
          <Can permission="VIEW_FINANCIAL_METRICS">
            <span className="shrink-0 text-(--text-muted)/50">•</span>
            <span className="truncate text-(--text-muted)">
              {"Arrecadado: "}
              <span className="font-semibold text-foreground">
                {bannerTotalReceived ?? formatCurrency(String(overview.totalRaised))}
              </span>
              {(() => {
                const isMonthly = campaign.typeDonation === "BOTH" || campaign.typeDonation === "MONTHLY";
                if (isMonthly) {
                  return overview.monthlyGoal
                    ? ` de ${formatCurrency(String(overview.monthlyGoal))}`
                    : " · Meta mensal não definida";
                }
                return campaign.totalGoal ? ` de ${formatCurrency(String(campaign.totalGoal))}` : null;
              })()}
            </span>
          </Can>
        </div>
```

E adicionar o import no topo do arquivo, junto aos demais imports de `~/client`:

```tsx
import { Can } from "~/client/components/can";
```

- [ ] **Step 2: Verificar manualmente no browser**

1. Rodar `npm run dev`.
2. Abrir qualquer campanha em `/campaign/:campaignId/home` — confirmar que o banner mostra "Ativa/Inativa • Arrecadado: R$ ... de R$ ..." normalmente (ambiente dev retorna todas as permissões).
3. Editar temporariamente `src/infra/gateways/campaign.ts:277-281`, trocando `projectPermissions: [...PROJECT_ALL_PERMISSIONS]` por `projectPermissions: PROJECT_ALL_PERMISSIONS.filter((p) => p !== "VIEW_FINANCIAL_METRICS")`.
4. Recarregar a página — confirmar que o banner mostra só "Ativa/Inativa" (sem o "•" solto nem o texto "Arrecadado").
5. Reverter a edição do passo 3 com `git checkout src/infra/gateways/campaign.ts` antes de prosseguir.

Expected: nenhum "•" órfão, nenhum erro no console, nome/status da campanha continuam visíveis em ambos os casos.

- [ ] **Step 3: Commit**

```bash
git add src/client/layouts/campaignLayout/components/campaignBanner/index.tsx
git commit -m "feat(permissions): hide raised amount in campaign banner without VIEW_FINANCIAL_METRICS"
```

---

### Task 3: Ocultar itens 100% financeiros da sidebar

**Files:**
- Modify: `src/client/layouts/campaignLayout/components/sidebar/index.tsx:88-102`

**Interfaces:**
- Consumes: `useCampaignLayout` de `~/client/hooks/useCampaignLayout` (hook, não o componente `Can` — o filtro aqui precisa gerar um array antes do JSX, não envolver JSX).

- [ ] **Step 1: Adicionar o hook e estender o filtro existente**

O componente `AppSidebar` já faz `useMatches()` para achar `campaignData`; ele está fora de qualquer `<Can>` possível porque o filtro de `visibleSections` roda antes do JSX. Usar `useCampaignLayout()` diretamente (o componente já está dentro de `CampaignLayoutProvider`, ver `src/client/layouts/campaignLayout/index.tsx:9-11`).

Adicionar o import:

```tsx
import { useCampaignLayout } from "~/client/hooks/useCampaignLayout";
```

Dentro de `AppSidebar`, logo após a linha `const isOfficialDoacaoCatolica = ...` (linha 86), adicionar:

```tsx
  const { isPermissionGranted } = useCampaignLayout();
```

E trocar o filtro de `subItems` (linhas 94-98) de:

```tsx
            subItems: item.subItems.filter((sub) => {
              if (sub.label === "Métricas Shalom") return showShalomMetrics;
              if (sub.label === "Templates META") return !isOfficialDoacaoCatolica;
              return true;
            }),
```

para:

```tsx
            subItems: item.subItems.filter((sub) => {
              if (sub.label === "Métricas Shalom") {
                return showShalomMetrics && isPermissionGranted("VIEW_FINANCIAL_STATEMENTS");
              }
              if (sub.label === "Transferências") {
                return isPermissionGranted("VIEW_FINANCIAL_TRANSFERS");
              }
              if (sub.label === "Templates META") return !isOfficialDoacaoCatolica;
              return true;
            }),
```

- [ ] **Step 2: Verificar manualmente no browser**

1. Com `npm run dev` rodando, abrir a campanha e expandir o menu "Financeiro" — confirmar que "Transferências", "Métodos de pagamento" e "Pix Automático" aparecem normalmente (ambiente dev = todas as permissões).
2. Editar temporariamente `src/infra/gateways/campaign.ts:277-281` para remover `"VIEW_FINANCIAL_TRANSFERS"` do array retornado (`PROJECT_ALL_PERMISSIONS.filter((p) => p !== "VIEW_FINANCIAL_TRANSFERS")`), recarregar e confirmar que "Transferências" some do submenu mas "Métodos de pagamento"/"Pix Automático" continuam lá.
3. Reverter com `git checkout src/infra/gateways/campaign.ts`.

Expected: submenu "Financeiro" continua existindo e navegável, só os subitens filtrados somem.

- [ ] **Step 3: Commit**

```bash
git add src/client/layouts/campaignLayout/components/sidebar/index.tsx
git commit -m "feat(permissions): filter Transferências/Métricas Shalom sidebar items by permission"
```

---

### Task 4: Ocultar cards financeiros em `KpiCards`

**Files:**
- Modify: `src/client/pages/campaignHome/kpi-cards.tsx`

**Interfaces:**
- Consumes: `Can` de `~/client/components/can` (Task 1).

- [ ] **Step 1: Envolver os 3 cards financeiros, manter "Apoiadores" sempre visível**

Adicionar o import:

```tsx
import { Can } from "~/client/components/can";
```

Substituir o `return` do componente (linhas 47-106) por:

```tsx
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <Can permission="VIEW_FINANCIAL_METRICS">
        <Card.Root className="gap-4 p-6">
          <Card.MetricHeader
            label={isMonthly ? "Arrecadado no mês" : "Total arrecadado"}
            icon={DollarSign}
            color="success"
          />
          <div className="flex flex-col gap-1">
            <Card.MetricValue>
              {formatCurrency(String(raised))}
            </Card.MetricValue>
            {goal !== null && (
              <span className="text-xs text-muted-foreground">
                Meta: {formatCurrency(String(goal))}
              </span>
            )}
          </div>
        </Card.Root>
      </Can>

      <Card.Root className="gap-4 p-6">
        <Card.MetricHeader label="Apoiadores" icon={Users} color="info" />
        <div className="flex flex-col gap-1">
          <Card.MetricValue>
            {overview.supporters.toLocaleString("pt-BR")}
          </Card.MetricValue>
          <Card.MetricTrend
            value={`+${overview.newSupportersLast7Days} nos últimos 7 dias`}
            direction="up"
          />
        </div>
      </Card.Root>

      <Can permission="VIEW_FINANCIAL_METRICS">
        <Card.Root className="gap-4 p-6">
          <Card.MetricHeader label="Progresso" icon={Target} color="primary" />
          <div className="flex flex-col gap-1">
            <Card.MetricValue>{progressLabel}</Card.MetricValue>
            <span className="text-xs text-muted-foreground">
              {goalProgressPercentage !== null
                ? isMonthly
                  ? "da meta mensal"
                  : "da meta total"
                : "meta não configurada"}
            </span>
          </div>
        </Card.Root>
      </Can>

      <Can permission="VIEW_FINANCIAL_METRICS">
        <Card.Root className="gap-4 p-6">
          <Card.MetricHeader label="Ticket médio" icon={Receipt} color="teal" />
          <div className="flex flex-col gap-1">
            <Card.MetricValue>
              {formatCurrency(String(overview.averageTicketMonth))}
            </Card.MetricValue>
            {variationLabel && (
              <Card.MetricTrend value={variationLabel} direction={variationDirection} />
            )}
          </div>
        </Card.Root>
      </Can>
    </div>
  );
```

- [ ] **Step 2: Verificar manualmente no browser**

1. `npm run dev`, abrir o Dashboard — os 4 cards aparecem normalmente.
2. Aplicar o mesmo bypass temporário do Task 2 (remover `"VIEW_FINANCIAL_METRICS"` do array em `src/infra/gateways/campaign.ts:277-281`), recarregar — confirmar que só "Apoiadores" aparece, ocupando a grid sem quebrar (o grid `grid-cols-2 xl:grid-cols-4` aceita 1 item sem erro visual, só sobra espaço vazio).
3. Reverter com `git checkout src/infra/gateways/campaign.ts`.

Expected: sem elementos quebrados, sem key duplicada, sem erro de hidratação no console.

- [ ] **Step 3: Commit**

```bash
git add src/client/pages/campaignHome/kpi-cards.tsx
git commit -m "feat(permissions): hide financial KPI cards without VIEW_FINANCIAL_METRICS"
```

---

### Task 5: Ocultar `DonationEvolutionCard`, `CampaignGoalCard`, `PaymentMethodsCard` e `DonationBracketsCard`

**Files:**
- Modify: `src/client/pages/campaignHome/index.tsx`

**Interfaces:**
- Consumes: `Can` de `~/client/components/can` (Task 1).

Estes 4 cards são 100% financeiros (gráfico de arrecadação, meta/progresso, valores por método de pagamento, faixas de valor de doação) — ocultar o card inteiro é mais simples e correto do que tentar parcialmente ocultar partes internas deles.

- [ ] **Step 1: Envolver os 4 cards com `<Can>` no componente de página**

Adicionar o import:

```tsx
import { Can } from "~/client/components/can";
```

Substituir o `return` (linhas 18-56) por:

```tsx
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe o desempenho desta campanha em tempo real.
        </p>
      </div>

      <KpiCards />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <Can permission="VIEW_FINANCIAL_METRICS">
          <DonationEvolutionCard />
          <CampaignGoalCard />
        </Can>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
        <RecentDonationsCard campaignId={id} />
        <TopDonorsCard campaignId={id} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Can permission="VIEW_FINANCIAL_METRICS">
          <PaymentMethodsCard />
        </Can>
        <DonorProfileCard />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ConversionFunnelCard />
        <Can permission="VIEW_FINANCIAL_METRICS">
          <DonationBracketsCard />
        </Can>
      </div>

      <MonthlyRecurrenceCard />

      {/* <ChannelPerformanceCard /> */}
    </div>
  );
```

Nota: `DonationEvolutionCard` e `CampaignGoalCard` ficam juntos dentro de um único `<Can>` (os dois somem ou aparecem juntos) porque ambos são 100% financeiros e ocupam a mesma linha da grid — isso evita montar dois `<Can>` idênticos lado a lado.

- [ ] **Step 2: Verificar manualmente no browser**

1. `npm run dev`, abrir o Dashboard — os 4 cards aparecem normalmente junto com os demais (DonorProfileCard, ConversionFunnelCard, MonthlyRecurrenceCard).
2. Aplicar o bypass temporário removendo `"VIEW_FINANCIAL_METRICS"` (mesmo procedimento do Task 2), recarregar — confirmar que a linha `DonationEvolutionCard`/`CampaignGoalCard` fica totalmente vazia (sem borda/fundo visível, já que nenhum filho é montado), `PaymentMethodsCard` some mas `DonorProfileCard` continua, `DonationBracketsCard` some mas `ConversionFunnelCard` continua.
3. Reverter com `git checkout src/infra/gateways/campaign.ts`.

Expected: nenhuma faixa vazia com borda ou sombra residual, grid não quebra, demais cards não financeiros continuam ocupando seu espaço normalmente.

- [ ] **Step 3: Commit**

```bash
git add src/client/pages/campaignHome/index.tsx
git commit -m "feat(permissions): hide financial dashboard cards without VIEW_FINANCIAL_METRICS"
```

---

### Task 6: Remover coluna "Valor" de `RecentDonationsCard` sem permissão

**Files:**
- Modify: `src/client/pages/campaignHome/recent-donations-card.tsx`

**Interfaces:**
- Consumes: `useCampaignLayout` de `~/client/hooks/useCampaignLayout` (hook direto, pois a coluna precisa ser removida de cabeçalho e de cada linha da tabela — não é um bloco único para envolver com `<Can>`).

- [ ] **Step 1: Remover a coluna "Valor" condicionalmente**

Adicionar o import:

```tsx
import { useCampaignLayout } from "~/client/hooks/useCampaignLayout";
```

No corpo do componente, logo após `const { activity } = useLoaderData<CampaignHomeLoader>();`, adicionar:

```tsx
  const { isPermissionGranted } = useCampaignLayout();
  const canViewFinancial = isPermissionGranted("VIEW_FINANCIAL_METRICS");
```

Trocar o cabeçalho (linhas 60-67):

```tsx
      <Table.Root className="min-w-max">
        <Table.Header>
          <Table.Row>
            <Table.Head>Doador</Table.Head>
            <Table.Head className="w-px whitespace-nowrap">Método</Table.Head>
            <Table.Head className="w-px whitespace-nowrap">Status</Table.Head>
            <Table.Head className="w-px whitespace-nowrap text-right">Valor</Table.Head>
          </Table.Row>
        </Table.Header>
```

por:

```tsx
      <Table.Root className="min-w-max">
        <Table.Header>
          <Table.Row>
            <Table.Head>Doador</Table.Head>
            <Table.Head className="w-px whitespace-nowrap">Método</Table.Head>
            <Table.Head className="w-px whitespace-nowrap">Status</Table.Head>
            {canViewFinancial && (
              <Table.Head className="w-px whitespace-nowrap text-right">Valor</Table.Head>
            )}
          </Table.Row>
        </Table.Header>
```

E a célula de valor (linhas 101-103):

```tsx
                <Table.Cell className="w-px whitespace-nowrap text-right font-medium">
                  {formatCurrency(String(d.amount))}
                </Table.Cell>
```

por:

```tsx
                {canViewFinancial && (
                  <Table.Cell className="w-px whitespace-nowrap text-right font-medium">
                    {formatCurrency(String(d.amount))}
                  </Table.Cell>
                )}
```

- [ ] **Step 2: Verificar manualmente no browser**

1. `npm run dev`, abrir o Dashboard — tabela "Doações recentes" mostra Doador/Método/Status/Valor normalmente.
2. Aplicar o bypass temporário (remover `"VIEW_FINANCIAL_METRICS"`), recarregar — confirmar que a coluna "Valor" some do cabeçalho e de cada linha, sem desalinhar as demais colunas, e que `Table.Empty` (quando não há doações) continua ocupando a largura correta.
3. Reverter com `git checkout src/infra/gateways/campaign.ts`.

Expected: tabela com 3 colunas quando sem permissão, sem células órfãs ou desalinhamento.

- [ ] **Step 3: Commit**

```bash
git add src/client/pages/campaignHome/recent-donations-card.tsx
git commit -m "feat(permissions): hide Valor column in recent donations table without permission"
```

---

### Task 7: Remover coluna "Total" de `TopDonorsCard` sem permissão

**Files:**
- Modify: `src/client/pages/campaignHome/top-donors-card.tsx`

**Interfaces:**
- Consumes: `useCampaignLayout` de `~/client/hooks/useCampaignLayout`.

- [ ] **Step 1: Remover a coluna "Total" condicionalmente**

Adicionar o import:

```tsx
import { useCampaignLayout } from "~/client/hooks/useCampaignLayout";
```

No corpo do componente, logo após `const { activity } = useLoaderData<CampaignHomeLoader>();`, adicionar:

```tsx
  const { isPermissionGranted } = useCampaignLayout();
  const canViewFinancial = isPermissionGranted("VIEW_FINANCIAL_METRICS");
```

Trocar o cabeçalho (linhas 30-37):

```tsx
      <Table.Root className="min-w-max sm:min-w-0">
        <Table.Header>
          <Table.Row>
            <Table.Head>Doador</Table.Head>
            <Table.Head className="w-px whitespace-nowrap">Doações</Table.Head>
            <Table.Head className="w-px whitespace-nowrap text-right">Total</Table.Head>
          </Table.Row>
        </Table.Header>
```

por:

```tsx
      <Table.Root className="min-w-max sm:min-w-0">
        <Table.Header>
          <Table.Row>
            <Table.Head>Doador</Table.Head>
            <Table.Head className="w-px whitespace-nowrap">Doações</Table.Head>
            {canViewFinancial && (
              <Table.Head className="w-px whitespace-nowrap text-right">Total</Table.Head>
            )}
          </Table.Row>
        </Table.Header>
```

E a célula de total (linhas 54-56):

```tsx
              <Table.Cell className="w-px whitespace-nowrap text-right font-semibold text-(--text-heading)">
                {formatCurrency(String(donor.totalAmount))}
              </Table.Cell>
```

por:

```tsx
              {canViewFinancial && (
                <Table.Cell className="w-px whitespace-nowrap text-right font-semibold text-(--text-heading)">
                  {formatCurrency(String(donor.totalAmount))}
                </Table.Cell>
              )}
```

- [ ] **Step 2: Verificar manualmente no browser**

1. `npm run dev`, abrir o Dashboard — tabela "Top doadores" mostra Doador/Doações/Total normalmente.
2. Aplicar o bypass temporário, recarregar — confirmar que "Total" some, "Doador"/"Doações" continuam.
3. Reverter com `git checkout src/infra/gateways/campaign.ts`.

Expected: tabela com 2 colunas quando sem permissão, sem desalinhamento.

- [ ] **Step 3: Commit**

```bash
git add src/client/pages/campaignHome/top-donors-card.tsx
git commit -m "feat(permissions): hide Total column in top donors table without permission"
```

---

### Task 8: Revisão final de todo o fluxo do Dashboard

**Files:** nenhum arquivo novo — task de verificação ponta-a-ponta.

- [ ] **Step 1: Teste completo com permissão negada**

1. Editar `src/infra/gateways/campaign.ts:277-281` para `projectPermissions: PROJECT_ALL_PERMISSIONS.filter((p) => !["VIEW_FINANCIAL_METRICS", "VIEW_FINANCIAL_TRANSFERS", "VIEW_FINANCIAL_STATEMENTS"].includes(p))`.
2. `npm run dev`, navegar por Dashboard, abrir o menu "Financeiro" (confirmar que "Transferências" e "Métricas Shalom" não aparecem, mas "Métodos de pagamento"/"Pix Automático" aparecem), voltar ao Dashboard.
3. Confirmar visualmente: banner sem "Arrecadado", KPIs só com "Apoiadores", sem `DonationEvolutionCard`/`CampaignGoalCard`/`PaymentMethodsCard`/`DonationBracketsCard`, tabelas sem colunas de valor.
4. Verificar o console do browser — sem erros de React (keys, hidratação) nem warnings.

- [ ] **Step 2: Teste completo com todas as permissões**

1. Reverter `src/infra/gateways/campaign.ts` com `git checkout src/infra/gateways/campaign.ts`.
2. `npm run dev`, navegar pelo Dashboard novamente — tudo deve voltar a aparecer exatamente como antes deste plano (nenhuma regressão visual para quem tem permissão).

- [ ] **Step 3: Rodar typecheck final**

Run: `npm run typecheck` (ajustar nome do script se divergir)
Expected: sem erros.

Nenhum commit nesta task — é só verificação do que já foi commitado nas tasks 1-7.

---

## Próximos passos (fora deste plano)

Conforme a ordem de implementação sugerida na auditoria, os seguintes itens ficam para planos seguintes, escritos e revisados separadamente após este ser avaliado:

- **Plano 2 — Financeiro:** Transferências (cards de saldo, coluna Valor, bloqueio da action `requestWithdrawal`), Métricas Shalom (8 cards).
- **Plano 3 — Relatórios + exportações:** ocultar colunas/cards financeiros nos 6 relatórios e remover campos financeiros dos arquivos exportados — inclui também adicionar `AuthService` aos 6 endpoints de export que hoje não autenticam (achado crítico da auditoria, fora do escopo original mas descoberto durante ela).
- **Pendente de decisão do cliente:** "Valores sugeridos"/"Valor mínimo" em Métodos de pagamento e "Valor do bilhete" em Sorteio — são configurações, não arrecadação; aguardar confirmação se entram no escopo antes de planejar.
