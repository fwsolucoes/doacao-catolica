# Design: tektonsys-ui vira React Router v7 + site de documentação

**Data:** 2026-10-13
**Status:** Aprovado
**Revisa:** `2026-10-07-design-system-registry-design.md`

## Contexto

Com o `tektonsys-ui` já scaffoldado (Next.js) e as Tasks 1–10 do plano de implementação executadas — `registry.json` com 48 itens, todo o código-fonte copiado em `registry/new-york/` —, dois pontos surgiram ao revisar o resultado:

1. Para o `next build` não quebrar typechecando `registry/new-york/**` (que usa os aliases `~/` e pacotes do projeto de doações, inexistentes neste app autor), excluímos essa pasta do `tsconfig.json`. Efeito colateral: o editor para de resolver os imports desses arquivos (ex.: `useQueryToast.ts` mostra "Cannot find module 'react-router'"), já que eles ficam fora do programa TypeScript do app.
2. Todos os consumidores reais deste registry (doações hoje, eventos amanhã, qualquer painel futuro da empresa) são construídos em **React Router v7** — nunca Next.js. Hospedar o próprio registry em Next.js não traz nenhum benefício e é a causa raiz do problema acima.

Paralelamente, surgiu um requisito novo: um **site de documentação** onde devs possam ver cada componente renderizado antes de decidir instalá-lo — algo que a spec original não cobria (ela só previa servir `registry.json`/`public/r/*.json` estaticamente).

As duas coisas se resolvem com a mesma mudança: trocar o framework de hospedagem do registry para React Router v7 permite que os arquivos de `registry/new-york/` sejam **compilados e executados de verdade** dentro do próprio app (em vez de excluídos do build), o que é exatamente o que um site de documentação com preview ao vivo precisa.

Tudo o mais da spec original (`2026-10-07-design-system-registry-design.md`) continua válido e não é repetido aqui: por que o registry é público, o mapeamento `registry:type`, o plano de migração do repositório de doações, o consumo pelo projeto de eventos, e o "fora de escopo" original.

## Decisão

1. Re-scaffoldar `tektonsys-ui` como um app **React Router v7** (framework mode, SSR) no lugar do Next.js. O conteúdo de `registry.json` e `registry/new-york/{ui,lib,hooks,theme}/` migrado nas Tasks 2–10 é preservado sem alteração — só a Task 1 (scaffold do app) é refeita.
2. Configurar os aliases deste app (`~/client/components/ui/*`, `~/lib/*`, `~/client/hooks/*`) apontando **diretamente** para dentro de `registry/new-york/{ui,lib,hooks}/`. Isso faz os arquivos do registry serem o código-fonte real do app — compilados, com os mesmos imports que um projeto consumidor usa depois de instalar via `npx shadcn add`. Elimina o workaround do `tsconfig.json` excluindo `registry/**/*`.
3. Adicionar um site de documentação ao próprio `tektonsys-ui`: catálogo dos 48 itens, com preview ao vivo + variações + comando de instalação + trecho de código para os 42 componentes de UI, e uma versão mais simples (descrição + instalação + código de uso, sem preview) para os 6 itens não-visuais (`utils`, `theme`, 4 hooks).

## Arquitetura

### Alinhamento de aliases (o que resolve os dois problemas de uma vez)

```jsonc
// tsconfig.json / vite config do tektonsys-ui
{
  "paths": {
    "~/client/components/ui/*": ["./registry/new-york/ui/*"],
    "~/client/hooks/*": ["./registry/new-york/hooks/*"],
    "~/lib/*": ["./registry/new-york/lib/*"]
  }
}
```

Com isso, um arquivo de demo escrito como `import { Button } from "~/client/components/ui/button"` roda de verdade dentro do app de documentação **e** é exatamente o código que um consumidor escreveria após `npx shadcn add @ds/button`. Não existe mais "código de preview" distinto de "código real" — é o mesmo arquivo.

### Demos: descoberta automática via `import.meta.glob`

Cada um dos 42 componentes de UI ganha um arquivo em `registry/new-york/examples/<nome>-demo.tsx`, que importa o componente real pelo alias acima e renderiza um ou mais exemplos (cobrindo as variações do componentes, ex.: `button-demo.tsx` mostra todas as variantes do `Button` lado a lado).

```ts
// descoberta sem mapa manual, sem build step extra
const demos = import.meta.glob("/registry/new-york/examples/*-demo.tsx");
const demoSources = import.meta.glob("/registry/new-york/examples/*-demo.tsx", {
  query: "?raw",
  import: "default",
});
```

A rota do componente resolve a chave `/registry/new-york/examples/${name}-demo.tsx` em `demos` para o preview ao vivo, e a mesma chave em `demoSources` para o texto bruto do arquivo, exibido como trecho de código. Novo componente adicionado ao catálogo = novo arquivo de demo; nenhuma lista central para manter sincronizada.

Cada arquivo de demo também é cadastrado em `registry.json` como um item próprio (`type: "registry:component"`, nome `example-<nome>`), seguindo a convenção oficial do shadcn de itens "example-*" — fica disponível para instalação via CLI também, não só para visualização na doc.

### Estrutura de rotas

```
src/main/routes/
├── _index.ts                          # catálogo: lista os 48 itens agrupados por type (UI / Hooks / Utilitários)
├── route.components.$name.tsx         # página de um componente de UI: preview + variações + instalação + código
└── route.other.$name.tsx              # página simples para utils/theme/hooks: descrição + instalação + código de uso
```

- **`_index`**: loader lê `registry.json` diretamente (é o próprio catálogo — nenhuma outra fonte de dados necessária), agrupa por `type` e lista com link para cada item.
- **`route.components.$name`**: loader valida que `name` existe em `registry.json` com `type: "registry:ui"`; 404 via `ErrorBoundaryPage` caso contrário (mesmo padrão de erro já usado neste workspace). Renderiza título/descrição do `registry.json`, o demo resolvido via `import.meta.glob`, o comando `npx shadcn add @ds/${name}` em um bloco copiável, e o código-fonte do demo.
- **`route.other.$name`**: mesma validação e layout, mas sem bloco de preview — só descrição, comando de instalação, e (para hooks) um trecho de código mostrando import/assinatura básica.

### O que é preservado, refeito e novo

| | |
|---|---|
| **Preservado** | `registry.json` (48 itens, `dependencies`/`registryDependencies` já mapeados) e todo `registry/new-york/{ui,lib,hooks,theme}/` |
| **Refeito** | Task 1 do plano original: scaffold do app (Next.js → React Router v7, aliases apontando para `registry/new-york/`). O script `prebuild: "shadcn build"` continua fazendo sentido, agora dentro do app RR7. O `exclude: ["registry/**/*"]` do tsconfig é removido — não é mais necessário. |
| **Novo** | 42 arquivos `registry/new-york/examples/*-demo.tsx`; as 3 rotas acima; 42 novos itens `example-*` em `registry.json` |

## Validação

Build limpo do zero (scaffold novo, `shadcn build` + build do RR7) sem erros de tipo. Navegação manual pelo site gerado cobrindo pelo menos um item de cada categoria (um componente simples como `badge`, um composto como `dialog`, um hook, o `theme`), confirmando que o preview renderiza de verdade e o trecho de código exibido bate com o arquivo de demo — testado no browser, não só via `tsc`, seguindo a convenção deste workspace de validar UI visualmente antes de dar por concluído.

## Fora de escopo

- Syntax highlighting no bloco de código (v1 usa `<pre>` simples); pode ser adicionado depois sem mudar a arquitetura.
- Busca/filtro no catálogo — com 48 itens uma lista agrupada por categoria é suficiente por ora.
- Tudo que já estava fora de escopo na spec original (versionamento do registry, migração de componentes de domínio, autenticação, monorepo).
