# Design: Registry shadcn compartilhado entre doações e eventos

**Data:** 2026-10-07
**Status:** Aprovado

## Contexto

Vamos iniciar um novo projeto (eventos), com a mesma stack deste repositório (React Router v7, React 19, Tailwind v4, tailwind-variants, shadcn/ui, Radix UI), estruturalmente análogo: um layout "geral" (lista de eventos) e um layout de entidade (um evento específico), assim como hoje temos lista de campanhas e uma campanha específica.

Hoje os ~38 componentes de `src/client/components/ui/` são mantidos só neste repositório. Sem um mecanismo de compartilhamento, o projeto de eventos nasceria com uma cópia divergente desde o primeiro componente, e qualquer ajuste de design system feito em um dos dois lados exigiria replicar manualmente no outro.

O projeto já consome de um registry externo (`@reui`, configurado em `components.json`), então o mecanismo de registries do shadcn — `npx shadcn add @namespace/nome` — já é familiar neste código.

Os dois projetos continuam como **repositórios Git separados** (não um monorepo).

## Decisão

Criar um terceiro repositório, **`tektonsys-ui`**, dedicado a ser a fonte canônica do design system, publicado como um **registry shadcn público** hospedado no Vercel. Os dois projetos de produto (doações e eventos) passam a consumir dele via `npx shadcn add @ds/<nome>`, em vez de manter cópias locais independentes.

O conteúdo do registry é só código de componente/utilitário (JSX/TSX, classes Tailwind, tokens de cor) — nada de segredo, variável de ambiente ou dado de usuário circula por ali —, então não há necessidade de autenticação: o registry fica **público**, sem token.

Não há versionamento automático: o registry sempre serve o conteúdo atual publicado. Atualizações exigem rodar `npx shadcn add @ds/<nome>` novamente em cada projeto consumidor, o que sobrescreve a cópia local — mesmo modelo mental do shadcn em geral ("open code, você é dono da cópia"), agora compartilhado entre repositórios.

## Arquitetura

### Novo repositório (design system)

App Next.js mínimo, cuja única função é autorar e servir o registry:

```
tektonsys-ui/
├── registry.json                    # catálogo raiz ($schema: registry.json)
├── registry/new-york/
│   ├── ui/           # button.tsx, badge.tsx, input.tsx, ... → registry:ui
│   ├── hooks/        # hooks genéricos de UI                → registry:hook
│   ├── lib/          # utils.ts (cn)                        → registry:lib
│   └── form/         # form-field.tsx, form-error-provider  → registry:component
├── registry/new-york/theme/
│   └── theme.json    # tokens de cor extraídos de tailwind.css → registry:theme (cssVars)
├── app/              # app Next.js mínimo, só serve public/r estaticamente
├── components.json   # config interna do shadcn para este próprio repo
└── public/r/         # gerado por `shadcn build`, não editado à mão
```

### Mapeamento de conteúdo → `registry:type`

| Conteúdo atual (neste repo) | `registry:type` no design system |
|---|---|
| `src/client/components/ui/*.tsx` (Button, Badge, Input, Select, Dialog, etc.) | `registry:ui` |
| `src/lib/utils.ts` (`cn`) | `registry:lib` |
| Hooks genéricos de `src/client/hooks/` não ligados a domínio | `registry:hook` |
| `form-field.tsx` + `form-error-provider` (padrão de formulário descrito no `CLAUDE.md`) | `registry:component` (múltiplos arquivos) |
| Tokens de cor / variáveis CSS de `src/client/themes/tailwind.css` | `registry:theme` via `cssVars` |

Cada item declara:
- `dependencies`: pacotes npm externos necessários (ex. `@radix-ui/react-slot`, `tailwind-variants`, `lucide-react`).
- `registryDependencies`: outros itens do mesmo registry (ex. `badge` depende de `lib/utils`; `form-field` depende de `ui/label`).

O CLI resolve essa árvore automaticamente — instalar um componente de nível alto traz junto tudo que ele precisa.

As convenções já documentadas em `src/client/components/ui/CLAUDE.md` deste repositório (padrão `tv()`, tokens semânticos, `group-data-invalid`, composição em objeto de sub-componentes, nunca `export default`, etc.) continuam valendo integralmente — só passam a viver no novo repositório como a referência única, em vez de duplicadas.

### Build e deploy

- `npx shadcn build` lê `registry.json` e gera `public/r/{name}.json` para cada item.
- Deploy automático no Vercel a cada push na branch principal — sem pipeline customizado.
- URLs finais públicas, ex.: `https://tektonsys-ui.vercel.app/r/button.json`, `/r/theme.json`.

### Consumo nos projetos de produto

```jsonc
// components.json (em cada projeto consumidor)
{
  "registries": {
    "@ds": "https://tektonsys-ui.vercel.app/r/{name}.json"
  }
}
```

```bash
npx shadcn add @ds/button @ds/badge @ds/form-field
```

## Migração deste repositório (doações)

1. **Extração:** copiar os componentes de `src/client/components/ui/`, `src/lib/utils.ts`, hooks genéricos e o padrão `FormField`/`FormErrorProvider` para a estrutura do novo repositório, convertendo cada um em um item de `registry.json` com o `type` da tabela acima. Qualquer coisa específica de domínio de doação fica de fora — só migra o que é genérico e reutilizável entre doações e eventos.
2. **Publicação:** gerar `registry.json`, rodar `shadcn build`, deploy no Vercel, validar que `/r/button.json` etc. respondem publicamente.
3. **Troca de fonte:** configurar `registries.@ds` no `components.json` deste repositório.
4. **Reinstalação:** remover os arquivos locais de `src/client/components/ui/` um a um e reinstalar via `npx shadcn add @ds/<nome>` (instalando os de nível mais alto primeiro, para que `registryDependencies` traga o resto). Repetir para os ~38 componentes, hooks, `utils.ts` e o padrão de formulário.
5. **Critério de aceite da migração:** o diff resultante deve ser efetivamente nulo em comportamento — é uma realocação de fonte, não uma reescrita. Nenhum componente muda de API, estilo ou comportamento nesta etapa.

## Projeto de eventos (consumo desde o início)

No scaffold inicial do novo projeto, configurar `registries.@ds` já no primeiro `components.json` e instalar os componentes necessários via `npx shadcn add @ds/<nome>` em vez do catálogo público do shadcn (`npx shadcn add <nome>`). O projeto nasce com exatamente os mesmos componentes, tokens e padrões de formulário deste repositório.

Componentes específicos de evento (ingresso, local do evento, etc.) continuam sendo construídos localmente no projeto de eventos, do mesmo jeito que componentes específicos de campanha/doação continuam locais neste repositório — só o que é genérico entra no registry compartilhado.

## Validação do registry

No próprio repositório do design system, manter um app de exemplo (pode ser o mesmo app Next.js mínimo que serve o registry) que instala todos os itens via `npx shadcn add` e roda `tsc`/build. Isso garante, a cada mudança, que o registry inteiro continua instalável do zero sem erro — funciona como o "teste" do design system.

## Fora de escopo

- Versionamento/pinning de versões do registry (não suportado nativamente pelo shadcn; aceito como limitação conhecida).
- Migração de componentes específicos de domínio (ligados a campanha/doação) para o registry.
- Autenticação/privacidade do registry (decidido como público, sem dados sensíveis).
- Estrutura de monorepo (descartada; repositórios permanecem separados).
