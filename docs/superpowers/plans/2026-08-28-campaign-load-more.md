# Campaign Load More Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a paginação tradicional da listagem de campanhas por um botão "Carregar mais" que acumula itens sem substituir a lista.

**Architecture:** O loader SSR do React Router v7 já suporta o parâmetro `page` via `SearchParamsMapper` com escopo `campaigns`. O componente de página passa a manter estado local acumulado e usa `useFetcher` para buscar páginas subsequentes sem navegação.

**Tech Stack:** React Router v7 (useFetcher, useLoaderData), React useState/useEffect

**Spec:** Conversa de investigação — Opção A escolhida pelo usuário.

## Global Constraints

- Nunca usar `<button>` nativo — sempre `<Button>` do design system (`~/client/components/ui/button`)
- Named imports do React: `import { useState, useEffect } from "react"` — nunca `import * as React`
- Não commitar — usuário revisa na IDE

---

### Task 1: Ajustar pageLimit para 20 no use case de campanhas

**Files:**
- Modify: `src/app/useCases/campaign/listCampaignsUseCase.ts:15-18`

**Interfaces:**
- Produces: `CampaignSearchParams` com `pageLimit: 20` em todas as chamadas (loader SSR e fetcher)

- [ ] **Step 1: Abrir o arquivo e confirmar o estado atual**

```ts
// src/app/useCases/campaign/listCampaignsUseCase.ts — linha 15
const searchParams = new CampaignSearchParams({
  page,
  filter: { search: search ?? undefined },
});
```

- [ ] **Step 2: Adicionar `pageLimit: 20`**

```ts
const searchParams = new CampaignSearchParams({
  page,
  pageLimit: 20,
  filter: { search: search ?? undefined },
});
```

- [ ] **Step 3: Verificar manualmente no browser**

Abrir `/my-campaigns` e confirmar no Network tab que a chamada ao endpoint inclui `pagesize=20`.

---

### Task 2: Implementar Load More no componente de página

**Files:**
- Modify: `src/client/pages/myCampaigns/index.tsx`

**Interfaces:**
- Consumes:
  - `useLoaderData<CampaignsLoader>()` → `{ campaigns: { data: Campaign[], meta: { page, pageLimit, totalItems, totalPages } } }`
  - `CampaignsLoader` de `~/client/types/campaignsLoader`
  - Loader route path: `/my-campaigns`
  - Query param de escopo: `campaigns:page` (prefixo `campaigns:` processado por `SearchParamsMapper.toObject({ scoped: "campaigns" })`)
  - Query param para evitar redirect de pending invites: `skipPendingInvites=true`
- Produces: página com lista acumulada e botão "Carregar mais"

**Contexto importante:**
- `meta.totalPages` já é calculado pelo `SearchResult.toJson()` como `Math.ceil(totalItems / pageLimit)`
- `hasMore = meta.page < meta.totalPages`
- O loader atual já suporta `?skipPendingInvites=true` para não redirecionar ao buscar mais itens via fetcher (linha 19-29 do route)
- URL do fetcher: `/my-campaigns?campaigns:page=N&skipPendingInvites=true`

- [ ] **Step 1: Reescrever `src/client/pages/myCampaigns/index.tsx`**

```tsx
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Link, useLoaderData, useFetcher } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Empty } from "~/client/components/ui/empty";
import { FolderOpen } from "lucide-react";
import type { CampaignsLoader } from "~/client/types/campaignsLoader";
import { CampaignCard } from "./components/campaignCard";

function MyCampaignsPage() {
  const { campaigns } = useLoaderData<CampaignsLoader>();
  const fetcher = useFetcher<CampaignsLoader>();

  const [items, setItems] = useState(campaigns.data);
  const [meta, setMeta] = useState(campaigns.meta);

  useEffect(() => {
    if (!fetcher.data) return;
    setItems((prev) => [...prev, ...fetcher.data!.campaigns.data]);
    setMeta(fetcher.data!.campaigns.meta);
  }, [fetcher.data]);

  const hasMore = meta.page < meta.totalPages;
  const isLoading = fetcher.state !== "idle";

  function loadMore() {
    fetcher.load(
      `/my-campaigns?campaigns:page=${meta.page + 1}&skipPendingInvites=true`,
    );
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Campanhas
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie e acompanhe o progresso de todas as campanhas.
          </p>
        </div>

        <Button asChild className="w-full gap-2 sm:w-auto">
          <Link to="create">
            <Plus size={18} />
            Nova campanha
          </Link>
        </Button>
      </header>

      {items.length === 0 ? (
        <Empty.Root>
          <Empty.Header>
            <Empty.Media variant="icon">
              <FolderOpen />
            </Empty.Media>
            <Empty.Title>Nenhuma campanha cadastrada</Empty.Title>
          </Empty.Header>
          <Empty.Content>
            <Button asChild>
              <Link to="create">Criar campanha</Link>
            </Button>
          </Empty.Content>
        </Empty.Root>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={isLoading}
              >
                {isLoading ? "Carregando..." : "Carregar mais"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export { MyCampaignsPage };
```

- [ ] **Step 2: Verificar no browser**

1. Abrir `/my-campaigns`
2. Confirmar que a lista inicial carrega com 20 itens (ou menos se o total for menor)
3. Se `totalItems > 20`, o botão "Carregar mais" deve aparecer abaixo do grid
4. Clicar no botão — deve aparecer "Carregando..." e depois os próximos itens são adicionados ao final da lista sem recarregar a página
5. Quando todos os itens estiverem carregados, o botão some
6. Se `totalItems <= 20`, o botão não deve aparecer em nenhum momento
