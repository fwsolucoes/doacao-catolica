# Campaign Layout — Design Spec
Date: 2026-06-11

## Objetivo

Criar um layout dedicado para gerenciamento de campanhas individuais, acessado quando o usuário clica em "Gerenciar" na tabela de `myCampaigns`. O layout é composto por uma sidebar de navegação escura e um banner de cabeçalho com dados da campanha, seguido de um `<Outlet />` para sub-páginas.

## Rota

```
campaign/:campaignId        → layout.campaignLayout.tsx
  campaign/:campaignId/home → route.campaign.home.tsx  (placeholder)
```

O botão "Gerenciar" na tabela navega para `/campaign/:campaignId/home`.

## Camada de dados

### Endpoint
`GET /project/find-one/:campaignId`

Retorna a campanha pelo ID. A resposta tem o mesmo shape do endpoint de listagem (`/project/summary-list`) mais campos extras que não serão utilizados.

### Estratégia de reuso
- O `externalCampaignSchema` (Zod) existente é reutilizado diretamente — campos desconhecidos são descartados automaticamente pelo `.parse()`.
- **Exceção:** `current_revenue` é necessário para o `CampaignBanner`. O schema de detalhe estende o existente adicionando apenas esse campo. A entidade recebe um campo opcional `currentRevenue?: string | null`, e `CampaignMapper.toEntityFromDetail()` o popula. O mapper existente `toEntity()` (listagem) não é alterado.

### Novos/modificados arquivos de infra

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/domain/entities/campaign.ts` | Adiciona campo opcional `currentRevenue?: string \| null` |
| `src/infra/schemas/external/campaign.ts` | Adiciona `externalCampaignDetailSchema` (existente + `current_revenue`) |
| `src/infra/mappers/campaign.ts` | Adiciona `CampaignMapper.toEntityFromDetail()` populando `currentRevenue` |
| `src/domain/gateways/campaign.ts` | Adiciona `getCampaign(id, token): Promise<Campaign>` à interface |
| `src/infra/gateways/campaign.ts` | Implementa `getCampaign()` chamando `GET /project/find-one/:id` |
| `src/app/useCases/campaign/getCampaignUseCase.ts` | Orquestra: recebe `{ id, token }`, chama gateway, retorna `campaign.toJson()` |
| `src/infra/controllers/campaign/getCampaignController.ts` | Extrai `campaignId` dos params, autentica, delega à use case |
| `src/main/factories/campaign/getCampaignFactory.ts` | Instancia e conecta gateway → use case → controller |

## Layout visual

```
┌──────────────┬────────────────────────────────────┐
│              │  CampaignBanner                    │
│   Sidebar    ├────────────────────────────────────┤
│   (272px)    │                                    │
│   fundo      │       <Outlet />                   │
│   escuro     │                                    │
└──────────────┴────────────────────────────────────┘
```

### Sidebar (`campaignLayout/components/sidebar`)
- Fundo escuro (`#0f172a`), largura fixa `272px`, altura total da tela
- Logo no topo
- Itens agrupados em seções: GESTÃO, FINANCEIRO, RELATÓRIOS, CONFIGURAÇÕES
- Itens estáticos por ora (sem navegação funcional)
- Item ativo indicado por barra azul (`#60a5fa`) na borda esquerda + fundo `rgba(255,255,255,0.1)`

### CampaignBanner (`campaignLayout/components/campaignBanner`)
- Barra horizontal branca com borda inferior
- Esquerda: nome da campanha (bold, 20px) + status badge ("Ativo"/"Inativo") + arrecadado vs meta
- Direita: botão "Voltar para campanhas" (navega para `/my-campaigns`) + botão ícone de visualização
- Dados vêm do loader do layout via `useLoaderData<CampaignLayoutLoader>()`

### Campos do banner
| Campo | Origem na entidade |
|-------|--------------------|
| Nome | `campaign.name` |
| Status | `campaign.status` (boolean → "Ativo"/"Inativo") |
| Arrecadado | `campaign.currentRevenue` (campo opcional adicionado à entidade) |
| Meta total | `campaign.totalGoal` |

## Arquivos do layout e rotas

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/routes.ts` | Adiciona `route("campaign/:campaignId", layout, [route("home", home)])` |
| `src/main/routes/layout.campaignLayout.tsx` | Loader: autentica + chama `getCampaign.handle()`, exporta `CampaignLayout` |
| `src/client/types/campaignLayoutLoader.ts` | `type CampaignLayoutLoader = Awaited<ReturnType<typeof loader>>` |
| `src/client/layouts/campaignLayout/index.tsx` | Estrutura visual: `<Sidebar>` + coluna direita com `<CampaignBanner>` + `<Outlet />` |
| `src/client/layouts/campaignLayout/components/sidebar/index.tsx` | Sidebar escura com itens estáticos |
| `src/client/layouts/campaignLayout/components/campaignBanner/index.tsx` | Banner com dados da campanha |
| `src/main/routes/route.campaign.home.tsx` | Sem loader, renderiza `<CampaignHomePage />` |
| `src/client/pages/campaignHome/index.tsx` | Página placeholder em branco |

## Modificações em arquivos existentes

| Arquivo | Modificação |
|---------|------------|
| `src/client/pages/myCampaigns/components/table/index.tsx` | Botão "Gerenciar" vira `<Link to={/campaign/${campaign.id}/home}>` |

## Fora de escopo
- Navegação funcional nos itens da sidebar
- Conteúdo real da página home da campanha
- Ações do botão de visualização (olho) no banner
